// Exit observations describe these lookup requests, not every route in a split tunnel.
const STORAGE_KEY = "exitIp";
const TIMEOUT = 6500;
export const EXIT_MAX_AGE = 5 * 60_000;
const EMPTY = {
  ip: null,
  ipv4: null,
  ipv6: null,
  countryCode: null,
  country: null,
  region: null,
  city: null,
  timezone: null,
  isp: null,
  asn: null,
  source: null,
  checkedAt: null,
  attemptedAt: null,
  error: null,
  addressesCheckedAt: null,
  addressErrors: [],
  previousIp: null,
  changedAt: null,
};
let lookupInFlight = null;
let lookupIncludesAddresses = false;

export function isValidIP(value) {
  if (typeof value !== "string" || value.length > 45) return false;
  if (/^(?:\d{1,3}\.){3}\d{1,3}$/.test(value)) {
    return value
      .split(".")
      .every((part) => String(Number(part)) === part && Number(part) <= 255);
  }
  if (!value.includes(":") || !/^[\da-f:.]+$/i.test(value)) return false;
  try {
    return new URL(`http://[${value}]/`).hostname.startsWith("[");
  } catch {
    return false;
  }
}

function clean(value, limit = 100) {
  return typeof value === "string" && value.trim()
    ? value
        .replace(/[\u0000-\u001f\u007f]/g, "")
        .trim()
        .slice(0, limit)
    : null;
}
function countryCode(value) {
  return typeof value === "string" &&
    /^[A-Z]{2}$/.test(value) &&
    !["XX", "T1"].includes(value)
    ? value
    : null;
}
async function request(url, format = "json") {
  const response = await fetch(url, {
    cache: "no-store",
    credentials: "omit",
    referrerPolicy: "no-referrer",
    signal: AbortSignal.timeout(TIMEOUT),
  });
  if (!response.ok) throw new Error(`Lookup returned HTTP ${response.status}`);
  return format === "json" ? response.json() : response.text();
}
async function metadata() {
  try {
    const data = await request("https://ipwho.is/");
    if (
      data.success !== true ||
      !isValidIP(data.ip) ||
      !countryCode(data.country_code)
    ) {
      throw new Error("Incomplete IP metadata");
    }
    return {
      ip: data.ip,
      countryCode: countryCode(data.country_code),
      country: clean(data.country),
      region: clean(data.region),
      city: clean(data.city),
      timezone: clean(data.timezone?.id),
      isp: clean(data.connection?.isp),
      asn:
        Number.isSafeInteger(data.connection?.asn) && data.connection.asn > 0
          ? data.connection.asn
          : null,
      source: "ipwho.is",
    };
  } catch {
    const trace = await request(
      "https://www.cloudflare.com/cdn-cgi/trace",
      "text",
    );
    const fields = Object.fromEntries(
      trace.split("\n").map((line) => {
        const index = line.indexOf("=");
        return [line.slice(0, index), line.slice(index + 1)];
      }),
    );
    if (!isValidIP(fields.ip) || !countryCode(fields.loc))
      throw new Error("Exit lookup unavailable");
    return {
      ip: fields.ip,
      countryCode: countryCode(fields.loc),
      country: null,
      region: null,
      city: null,
      timezone: null,
      isp: null,
      asn: null,
      source: "Cloudflare",
    };
  }
}
async function address(url, version) {
  const data = await request(url);
  if (!isValidIP(data.ip) || (version === 6) !== data.ip.includes(":")) {
    throw new Error(`IPv${version} unavailable`);
  }
  return data.ip;
}

export async function readExit() {
  const stored = (await chrome.storage.local.get(STORAGE_KEY))[STORAGE_KEY];
  return {
    ...EMPTY,
    ...(stored && typeof stored === "object" ? stored : {}),
    error: stored?.error
      ? "Exit lookup failed. Previous data is unverified."
      : null,
  };
}

export async function refreshExit({ details = false, force = false } = {}) {
  if (lookupInFlight) {
    const includesAddresses = lookupIncludesAddresses;
    const result = await lookupInFlight;
    if (!details || includesAddresses) return result;
  }
  lookupIncludesAddresses = details;
  lookupInFlight = performLookup(details, force);
  try {
    return await lookupInFlight;
  } finally {
    lookupInFlight = null;
  }
}

async function performLookup(details, force) {
  const previous = await readExit();
  if (
    !force &&
    !details &&
    previous.attemptedAt &&
    Date.now() - previous.attemptedAt < 60_000
  )
    return previous;
  const attemptedAt = Date.now();
  const calls = [metadata()];
  if (details)
    calls.push(
      address("https://api.ipify.org?format=json", 4),
      address("https://api6.ipify.org?format=json", 6),
    );
  const results = await Promise.allSettled(calls);
  const main = results[0];
  const next = { ...previous, attemptedAt, error: null };
  if (main.status === "fulfilled") {
    const changed = previous.ip !== null && previous.ip !== main.value.ip;
    Object.assign(next, main.value, { checkedAt: Date.now() });
    if (changed)
      Object.assign(next, {
        previousIp: previous.ip,
        changedAt: next.checkedAt,
        ipv4: null,
        ipv6: null,
        addressesCheckedAt: null,
        addressErrors: [],
      });
  } else {
    // Keep historical information for display, but invalidate automatic protection.
    next.error = "Exit lookup failed. Previous data is unverified.";
  }
  if (details) {
    next.ipv4 = results[1].status === "fulfilled" ? results[1].value : null;
    next.ipv6 = results[2].status === "fulfilled" ? results[2].value : null;
    next.addressesCheckedAt = Date.now();
    next.addressErrors = [4, 6].filter(
      (version, index) => results[index + 1].status === "rejected",
    );
  }
  await chrome.storage.local.set({ [STORAGE_KEY]: next });
  return next;
}
