import { refreshExit, readExit } from "./exit-ip.js";
const M = "installSecret";
async function Ze() {
  const t = (await chrome.storage.local.get(M))[M];
  if (typeof t == "string" && t.length > 0) return t;
  const n = je();
  return (await chrome.storage.local.set({ [M]: n }), n);
}
function je() {
  return [...crypto.getRandomValues(new Uint8Array(32))]
    .map((t) => t.toString(16).padStart(2, "0"))
    .join("");
}
function ze(e) {
  const t = e.trim().toLowerCase();
  return t === "" ||
    t.startsWith("#") ||
    t === "ir" ||
    t.endsWith(".ir") ||
    !Ge(t)
    ? null
    : t;
}
const Ke = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/;
function Ge(e) {
  const t = e.split(".");
  return t.length >= 2 && t.every((n) => Ke.test(n));
}
function Ve(e) {
  const t = new Set();
  for (const n of e.split(`
`)) {
    const r = ze(n);
    r !== null && t.add(r);
  }
  return [...t].sort();
}
function Xe(e) {
  const t = e.trim().split(/\s+/)[0] ?? "";
  return /^[0-9a-f]{64}$/i.test(t) ? t.toLowerCase() : null;
}
async function Je(e, t) {
  if (e.length === 0) return (await t(e), e);
  if (await t(e)) return e;
  let n = Math.floor(e.length / 2);
  for (; n > 0;) {
    const r = e.slice(0, n);
    if (await t(r)) return r;
    n = Math.floor(n / 2);
  }
  return (await t([]), []);
}
const Ee =
    "https://github.com/bootmortis/iran-hosted-domains/releases/latest/download",
  Qe = `${Ee}/domains.txt.sha256`,
  et = `${Ee}/domains.txt`,
  tt = 2e4,
  F = "iranList",
  $ = "foxyshield:iran-list-refresh",
  Se = 1440,
  nt = Se * 6e4,
  rt = {
    domains: [],
    sha256: null,
    updatedAt: null,
    checkedAt: null,
    appliedCount: null,
  };
let q = null;
function K(e) {
  const t = e.domains.slice(0, e.appliedCount ?? e.domains.length),
    n = `${e.updatedAt ?? "none"}:${t.length}`;
  return (q?.key !== n && (q = { key: n, set: new Set(t) }), q.set);
}
async function m() {
  const e = await chrome.storage.local.get(F);
  return st(e[F]);
}
async function T(e) {
  const t = { ...(await m()), ...e };
  return (await chrome.storage.local.set({ [F]: t }), t);
}
async function ot(e) {
  await T({ appliedCount: e });
}
async function G() {
  const e = Date.now(),
    t = await m(),
    n = await se(Qe)
      .then(Xe)
      .catch(() => null);
  if (n === null || n === t.sha256) return T({ checkedAt: e });
  const r = await se(et).catch(() => null);
  if (r === null) return T({ checkedAt: e });
  const digest = [
    ...new Uint8Array(
      await crypto.subtle.digest("SHA-256", new TextEncoder().encode(r)),
    ),
  ]
    .map((v) => v.toString(16).padStart(2, "0"))
    .join("");
  if (digest !== n)
    throw new Error("Domain list integrity verification failed.");
  return T({ domains: Ve(r), sha256: n, updatedAt: e, checkedAt: e });
}
function at(e, t, n = nt) {
  return e.checkedAt === null || t - e.checkedAt > n;
}
async function it() {
  at(await m(), Date.now()) && (await G());
}
async function ct() {
  (await chrome.alarms.get($)) === void 0 &&
    (await chrome.alarms.create($, { periodInMinutes: Se }));
}
async function se(e) {
  const t = await fetch(e, {
    cache: "no-store",
    credentials: "omit",
    signal: AbortSignal.timeout(tt),
  });
  if (!t.ok) throw new Error(`${e} -> ${t.status}`);
  return t.text();
}
function st(e) {
  return ut(e)
    ? {
        domains: lt(e.domains),
        sha256: dt(e.sha256),
        updatedAt: x(e.updatedAt),
        checkedAt: x(e.checkedAt),
        appliedCount: x(e.appliedCount),
      }
    : rt;
}
function ut(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
function lt(e) {
  return Array.isArray(e) ? e.filter((t) => typeof t == "string") : [];
}
function dt(e) {
  return typeof e == "string" && e !== "" ? e : null;
}
function x(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
const Ae = [
    "challenges.cloudflare.com",
    "hcaptcha.com",
    "recaptcha.net",
    "arkoselabs.com",
    "funcaptcha.com",
    "geetest.com",
    "captcha-delivery.com",
  ],
  ft = [["www.google.com", "/recaptcha/"]];
function ht(e, t) {
  return e === t || e.endsWith(`.${t}`);
}
function mt(e) {
  let t;
  try {
    t = new URL(e);
  } catch {
    return !1;
  }
  const n = t.hostname.toLowerCase();
  return (
    Ae.some((r) => ht(n, r)) ||
    ft.some(([r, o]) => n === r && t.pathname.startsWith(o))
  );
}
const V = [
  "timezone",
  "locale",
  "geolocation",
  "fonts",
  "webrtc",
  "voices",
  "keyboard",
  "workers",
  "canvas",
  "webgl",
  "audio",
  "clientRects",
];
function pt(e) {
  return wt(JSON.stringify(e)).replace(/=/g, "_");
}
function wt(e) {
  const t = new TextEncoder().encode(e);
  return btoa(String.fromCharCode(...t));
}
const S = {
    pageConfig: 10,
    requestHeaders: 11,
    flowBlockRoute: 12,
    antibotAllow: 13,
    navigationConfig: 14,
    navigationHeaders: 15,
  },
  gt = ["sub_frame"],
  yt = Ae,
  Et = String.raw`^https://www\.google\.com/recaptcha/`,
  St = String.raw`^https://(?:flow\.google\.com(?:/u/[0-9]+)?|labs\.google/[^?#]*)/unsupported-country(?:[?#]|$)`;
function At(e) {
  const config = vt(e),
    headers = Tt(e);
  // A top-level navigation belongs to its destination. Only frames/subresources
  // inherit the initiating site's exemption.
  const navigation = {
    resourceTypes: ["main_frame"],
    excludedRequestDomains: H(e.exempt),
  };
  const t = [
    config,
    headers,
    bt(),
    { ...config, id: S.navigationConfig, condition: navigation },
    { ...headers, id: S.navigationHeaders, condition: navigation },
  ];
  return e.config.flowUnlockEnabled ? [...t, Rt(e)] : t;
}
function bt() {
  return {
    id: S.antibotAllow,
    priority: 2,
    action: { type: chrome.declarativeNetRequest.RuleActionType.ALLOW },
    condition: {
      regexFilter: Et,
      resourceTypes: Object.values(chrome.declarativeNetRequest.ResourceType),
    },
  };
}
function Rt(e) {
  return {
    id: S.flowBlockRoute,
    priority: 1,
    action: { type: chrome.declarativeNetRequest.RuleActionType.BLOCK },
    condition: {
      regexFilter: St,
      excludedRequestDomains: H(e.exempt),
      excludedInitiatorDomains: H(e.exempt),
      resourceTypes: [
        "main_frame",
        "sub_frame",
        "xmlhttprequest",
        "script",
        "other",
      ],
    },
  };
}
function vt(e) {
  return {
    id: S.pageConfig,
    priority: 1,
    action: {
      type: chrome.declarativeNetRequest.RuleActionType.MODIFY_HEADERS,
      responseHeaders: [
        {
          header: "server-timing",
          operation: chrome.declarativeNetRequest.HeaderOperation.APPEND,
          value: `${e.headerName};desc="${pt(e.config)}"`,
        },
      ],
    },
    condition: {
      resourceTypes: gt,
      excludedRequestDomains: H(e.exempt),
      excludedInitiatorDomains: H(e.exempt),
    },
  };
}
function Tt(e) {
  const t = chrome.declarativeNetRequest.HeaderOperation.SET,
    n = chrome.declarativeNetRequest.HeaderOperation.REMOVE;
  return {
    id: S.requestHeaders,
    priority: 1,
    action: {
      type: chrome.declarativeNetRequest.RuleActionType.MODIFY_HEADERS,
      requestHeaders: [
        ...(e.config.shields.locale
          ? [
              {
                header: "accept-language",
                operation: t,
                value: e.config.profile.acceptLanguage,
              },
            ]
          : []),
        { header: "dnt", operation: t, value: "1" },
        { header: "sec-gpc", operation: t, value: "1" },
        { header: "if-none-match", operation: n },
      ],
    },
    condition: {
      resourceTypes: Object.values(
        chrome.declarativeNetRequest.ResourceType,
      ).filter((type) => type !== "main_frame"),
      excludedRequestDomains: H(e.exempt),
      excludedInitiatorDomains: H(e.exempt),
    },
  };
}
function H(e) {
  return [...new Set([...yt, ...e.map((t) => t.toLowerCase())])];
}
const B = "rules-installed";
async function Ct(e) {
  try {
    await chrome.storage.session?.set({ [B]: e });
  } catch {}
}
async function Lt() {
  try {
    return (await chrome.storage.session?.get(B))?.[B] !== !1;
  } catch {
    return !0;
  }
}
const kt = [
    [
      "NL",
      "Netherlands",
      "Europe/Amsterdam",
      "nl-NL",
      "nl-NL,nl;q=0.9,en-US;q=0.8,en;q=0.7",
      52.4,
      4.9,
    ],
    [
      "DE",
      "Germany",
      "Europe/Berlin",
      "de-DE",
      "de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7",
      52.5,
      13.4,
    ],
    [
      "FI",
      "Finland",
      "Europe/Helsinki",
      "fi-FI",
      "fi-FI,fi;q=0.9,en-US;q=0.8,en;q=0.7",
      60.2,
      24.9,
    ],
    [
      "FR",
      "France",
      "Europe/Paris",
      "fr-FR",
      "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
      48.9,
      2.4,
    ],
    [
      "AT",
      "Austria",
      "Europe/Vienna",
      "de-AT",
      "de-AT,de;q=0.9,en-US;q=0.8,en;q=0.7",
      48.2,
      16.4,
    ],
    [
      "ES",
      "Spain",
      "Europe/Madrid",
      "es-ES",
      "es-ES,es;q=0.9,en-US;q=0.8,en;q=0.7",
      40.4,
      -3.7,
    ],
    [
      "AL",
      "Albania",
      "Europe/Tirane",
      "sq-AL",
      "sq-AL,sq;q=0.9,en-US;q=0.8,en;q=0.7",
      41.3,
      19.8,
    ],
    [
      "TR",
      "Turkey",
      "Europe/Istanbul",
      "tr-TR",
      "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7",
      41,
      29,
    ],
    [
      "US",
      "United States",
      "America/New_York",
      "en-US",
      "en-US,en;q=0.9",
      40.7,
      -74,
    ],
    [
      "CA",
      "Canada",
      "America/Toronto",
      "en-CA",
      "en-CA,en;q=0.9,fr-CA;q=0.8,fr;q=0.7",
      43.7,
      -79.4,
    ],
    [
      "GB",
      "United Kingdom",
      "Europe/London",
      "en-GB",
      "en-GB,en;q=0.9",
      51.5,
      -0.1,
    ],
    [
      "SE",
      "Sweden",
      "Europe/Stockholm",
      "sv-SE",
      "sv-SE,sv;q=0.9,en-US;q=0.8,en;q=0.7",
      59.3,
      18.1,
    ],
    [
      "CH",
      "Switzerland",
      "Europe/Zurich",
      "de-CH",
      "de-CH,de;q=0.9,en-US;q=0.8,en;q=0.7",
      47.4,
      8.5,
    ],
    [
      "PL",
      "Poland",
      "Europe/Warsaw",
      "pl-PL",
      "pl-PL,pl;q=0.9,en-US;q=0.8,en;q=0.7",
      52.2,
      21,
    ],
    [
      "IT",
      "Italy",
      "Europe/Rome",
      "it-IT",
      "it-IT,it;q=0.9,en-US;q=0.8,en;q=0.7",
      41.9,
      12.5,
    ],
    [
      "AE",
      "United Arab Emirates",
      "Asia/Dubai",
      "en-AE",
      "en-AE,en;q=0.9,ar-AE;q=0.8,ar;q=0.7",
      25.2,
      55.3,
    ],
    [
      "SG",
      "Singapore",
      "Asia/Singapore",
      "en-SG",
      "en-SG,en;q=0.9",
      1.3,
      103.8,
    ],
    [
      "JP",
      "Japan",
      "Asia/Tokyo",
      "ja-JP",
      "ja-JP,ja;q=0.9,en-US;q=0.8,en;q=0.7",
      35.7,
      139.7,
    ],
  ],
  Ot = kt.map(([e, t, n, r, o, i, p]) => ({
    code: e,
    name: t,
    timeZone: n,
    locale: r,
    acceptLanguage: o,
    latitude: i,
    longitude: p,
  })),
  Nt = "NL",
  P = new Map(Ot.map((e) => [e.code, e]));
function _t(e) {
  return (e === null ? void 0 : P.get(e.toUpperCase())) ?? P.get(Nt);
}
function be(e) {
  return e !== null && P.has(e.toUpperCase());
}
function k(e) {
  if (e.chosenCountry !== null) return "ok";
  if (e.detectedCountry === null || e.detectionError) return "unknown";
  if (e.detectedAt === null || Date.now() - e.detectedAt > 300000)
    return "stale";
  return be(e.detectedCountry) ? "ok" : "unsupported";
}
const Re = {
  timeZone: null,
  locale: null,
  acceptLanguage: null,
  coordinates: null,
};
function X(e, t) {
  const n = _t(e);
  return { profile: Ut(n, t), mismatches: Mt(n, t) };
}
function Ut(e, t) {
  const n = t.locale ?? e.locale;
  return {
    country: e.code,
    timeZone: t.timeZone ?? e.timeZone,
    locale: n,
    acceptLanguage: t.acceptLanguage ?? e.acceptLanguage,
    coordinates: t.coordinates ?? {
      latitude: e.latitude,
      longitude: e.longitude,
    },
    languages: It(t.acceptLanguage ?? e.acceptLanguage, n),
  };
}
function It(e, t) {
  const n = e
    .split(",")
    .map((r) => (r.split(";")[0] ?? "").trim())
    .filter((r) => r !== "");
  return n.length > 0 ? [...new Set(n)] : [t];
}
const Dt = [qt, xt, Ft, $t];
function Mt(e, t) {
  return Dt.map((n) => n(e, t)).filter((n) => n !== null);
}
function qt(e, t) {
  return t.timeZone === null || t.timeZone === e.timeZone
    ? null
    : {
        field: "timeZone",
        message: `Manual timezone (${t.timeZone}) differs from the ${e.name} profile.`,
      };
}
function xt(e, t) {
  const n = t.locale;
  return n === null
    ? null
    : ve(n)
      ? {
          field: "locale",
          message:
            "The manual locale includes Persian and may reveal your language preferences.",
        }
      : le(n) === null || le(n) === e.code
        ? null
        : {
            field: "locale",
            message: `Manual locale (${n}) differs from the ${e.name} profile.`,
          };
}
function Ft(e, t) {
  const n = t.acceptLanguage;
  return n === null || !ve(n)
    ? null
    : {
        field: "acceptLanguage",
        message: "The manual Accept-Language header includes Persian.",
      };
}
const ue = 12;
function $t(e, t) {
  const n = t.coordinates;
  return n === null
    ? null
    : Math.abs(n.latitude - e.latitude) > ue ||
        Math.abs(n.longitude - e.longitude) > ue
      ? {
          field: "coordinates",
          message: `Manual coordinates are far from the ${e.name} preset.`,
        }
      : null;
}
function ve(e) {
  return /\bfa\b|\bfa-/i.test(e);
}
function le(e) {
  const t = e.split("-")[1];
  return t !== void 0 && /^[A-Za-z]{2}$/.test(t) ? t.toUpperCase() : null;
}
function Ht(e) {
  let t = 2166136261;
  for (let n = 0; n < e.length; n += 1)
    ((t ^= e.charCodeAt(n)), (t = Math.imul(t, 16777619)));
  return t >>> 0;
}
function Bt(e) {
  return Ht(e);
}
const Pt = new Set(["timezone", "locale", "webrtc", "workers"]),
  f = {
    enabled: !0,
    shields: Object.fromEntries(V.map((e) => [e, Pt.has(e)])),
    whitelist: [],
    advancedMode: !1,
    overrides: Re,
    detectedCountry: null,
    detectedAt: null,
    detectionError: null,
    chosenCountry: null,
    autoIranExempt: !1,
    flowUnlockEnabled: !1,
    stealthEnabled: !1,
  };
function J(e) {
  return e.chosenCountry ?? e.detectedCountry;
}
const Y = "settings";
async function s() {
  const e = await chrome.storage.local.get(Y);
  return Wt(e[Y]);
}
async function u(e) {
  const t = { ...(await s()), ...e };
  return (await chrome.storage.local.set({ [Y]: t }), t);
}
function Wt(e) {
  return A(e)
    ? {
        enabled: g(e.enabled, f.enabled),
        shields: Yt(e.shields),
        whitelist: Te(e.whitelist, f.whitelist),
        advancedMode: g(e.advancedMode, f.advancedMode),
        overrides: Zt(e.overrides),
        detectedCountry: de(e.detectedCountry),
        detectedAt: Kt(e.detectedAt),
        detectionError: y(e.detectionError),
        chosenCountry: be(de(e.chosenCountry)) ? de(e.chosenCountry) : null,
        autoIranExempt: g(e.autoIranExempt, f.autoIranExempt),
        flowUnlockEnabled: g(e.flowUnlockEnabled, f.flowUnlockEnabled),
        stealthEnabled: g(e.stealthEnabled, f.stealthEnabled),
      }
    : f;
}
function Yt(e) {
  const t = A(e) ? e : {},
    n = {};
  for (const r of V) n[r] = g(t[r], f.shields[r]);
  return n;
}
function Zt(e) {
  return A(e)
    ? {
        timeZone: y(e.timeZone),
        locale: y(e.locale),
        acceptLanguage: y(e.acceptLanguage),
        coordinates: jt(e.coordinates),
      }
    : Re;
}
function jt(e) {
  if (!A(e)) return null;
  const t = e.latitude,
    n = e.longitude;
  return typeof t == "number" &&
    typeof n == "number" &&
    Math.abs(t) <= 90 &&
    Math.abs(n) <= 180
    ? { latitude: t, longitude: n }
    : null;
}
function A(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
function g(e, t) {
  return typeof e == "boolean" ? e : t;
}
function y(e) {
  return typeof e == "string" && e !== "" ? e : null;
}
function Kt(e) {
  return typeof e == "number" && Number.isFinite(e) ? e : null;
}
function de(e) {
  return typeof e == "string" && /^[A-Z]{2}$/.test(e) ? e : null;
}
function Te(e, t) {
  return Array.isArray(e) ? e.filter((n) => typeof n == "string") : t;
}
const Ce = Object.values(S);
async function Gt(e) {
  const n = e.enabled && k(e) === "ok";
  (n
    ? await Vt(e)
    : await chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: Ce,
        addRules: [],
      }),
    await Jt(n && (await Lt()) && e.shields.webrtc));
}
async function Vt(e) {
  const t = await Xt(e),
    n = [
      ...e.whitelist.map((w) => w.toLowerCase()),
      ...(e.autoIranExempt ? ["ir"] : []),
    ],
    r = await m();
  let o = !1;
  const i = async (w) => {
      try {
        (await chrome.declarativeNetRequest.updateDynamicRules({
          removeRuleIds: Ce,
          addRules: At({
            config: t,
            headerName: "fx5b78a745",
            exempt: [...n, ...w],
          }),
        }),
          (o = !0));
      } catch (R) {
        (console.warn("declarativeNetRequest rejected the rule set:", R),
          (o = !1));
      }
      return o;
    },
    p = await Je(e.autoIranExempt ? r.domains : [], i);
  if (!o)
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: Ce,
      addRules: [],
    });
  await Ct(o);
  if (e.autoIranExempt && p.length !== r.appliedCount) await ot(p.length);
}
async function Xt(e) {
  const { profile: t } = X(J(e), e.overrides),
    n = Bt(await Ze());
  return {
    profile: t,
    shields: e.shields,
    noiseBase: n,
    flowUnlockEnabled: e.flowUnlockEnabled,
    stealth: e.stealthEnabled,
  };
}
async function Jt(e) {
  const t = chrome.privacy?.network?.webRTCIPHandlingPolicy;
  if (t === void 0) return;
  try {
    if (e) {
      const state = await t.get({});
      if (
        ![
          "controllable_by_this_extension",
          "controlled_by_this_extension",
        ].includes(state.levelOfControl)
      )
        throw new Error(
          "Another extension or browser policy controls the WebRTC setting.",
        );
      await t.set({ value: "disable_non_proxied_udp" });
    } else await t.clear({});
    await chrome.storage.session.set({ webrtcError: null });
  } catch (error) {
    await chrome.storage.session.set({ webrtcError: ge(error) });
  }
}
const Qt = 2e4,
  Le = (e) => `reloaded:${e}`,
  C = (e) => `commit:${e}`,
  L = (e) => `recovery:${e}`;
async function en(e) {
  if (e.frameId !== 0) return;
  const t = { url: e.url, submitted: e.transitionType === "form_submit" };
  await chrome.storage.session.set({ [C(e.tabId)]: t });
}
async function tn(e, t) {
  const n = (await chrome.storage.session.get(C(e)))[C(e)];
  return n?.submitted === !0 && n.url === t;
}
async function nn(e, t) {
  try {
    return (
      await (t
        ? chrome.tabs.reload(e, { bypassCache: !0 })
        : chrome.tabs.reload(e)),
      !0
    );
  } catch {
    return !1;
  }
}
async function rn(e, t, n) {
  const r = (await chrome.storage.session.get(e))[e];
  return typeof r == "object" && r !== null && r.url === t && n - r.at < Qt;
}
async function on(e, t = {}) {
  if (e?.id === void 0 || e.url === void 0) return !1;
  const n = Le(e.id),
    r = Date.now();
  return (await rn(n, e.url, r)) || (await tn(e.id, e.url))
    ? !1
    : (await chrome.storage.session.set({ [n]: { url: e.url, at: r } }),
      nn(e.id, t.bypassCache === !0));
}
async function fe(e, t) {
  e !== void 0 &&
    (await chrome.storage.session.set({ [L(e)]: { ...t, at: Date.now() } }));
}
async function an(e) {
  return (await chrome.storage.session.get(L(e)))[L(e)] ?? null;
}
async function cn(e) {
  await chrome.storage.session.remove([Le(e), C(e), L(e)]);
}
const sn = new Set(["cache", "bfcache"]),
  un = new Set(["cache-storage"]);
function ln(e) {
  return e.delivered
    ? "delivered"
    : e.swControlled || un.has(e.deliveryType)
      ? "service-worker"
      : sn.has(e.deliveryType)
        ? "cache"
        : "missing";
}
function dn(e) {
  const t = performance.getEntriesByType("navigation")[0];
  return {
    delivered: (t?.serverTiming ?? []).some((r) => r.name === e),
    swControlled: !!navigator.serviceWorker?.controller,
    deliveryType: t?.deliveryType ?? "",
  };
}
async function fn(e) {
  const t = (a, c, d, l) => ({ id: a, label: c, passed: d, saw: l }),
    n = (a) => {
      try {
        return a();
      } catch {
        return "—";
      }
    },
    r = (a) => {
      const c = Date.now(),
        d = new Intl.DateTimeFormat("en-US", {
          timeZone: a,
          hourCycle: "h23",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }).formatToParts(new Date(c)),
        l = (We) => Number(d.find((Ye) => Ye.type === We)?.value ?? "0"),
        Pe = Date.UTC(
          l("year"),
          l("month") - 1,
          l("day"),
          l("hour"),
          l("minute"),
          l("second"),
        );
      return -Math.round((Pe - Math.floor(c / 1e3) * 1e3) / 6e4);
    },
    o = (a) => {
      const c = document.createElement("canvas").getContext("2d");
      if (c === null) return !1;
      const d = "مقایسهٔ عرض متن ABCwi";
      c.font = '72px "no-such-font-9x8y7z"';
      const l = c.measureText(d).width;
      return (
        (c.font = `72px "${a}", "no-such-font-9x8y7z"`),
        c.measureText(d).width !== l
      );
    },
    i = async () => {
      const a = globalThis.speechSynthesis;
      return a === void 0
        ? []
        : (a.getVoices().length === 0 &&
            (await new Promise((c) => {
              (a.addEventListener("voiceschanged", () => c(), { once: !0 }),
                setTimeout(c, 300));
            })),
          a.getVoices());
    },
    p = async () => {
      const a = navigator.keyboard;
      if (typeof a?.getLayoutMap != "function") return null;
      const c = new Promise((l) => setTimeout(() => l(null), 500));
      return (await Promise.race([a.getLayoutMap(), c]))?.get("KeyQ") ?? null;
    },
    w = n(() => Intl.DateTimeFormat().resolvedOptions().timeZone),
    R = n(() => String(new Date().getTimezoneOffset())),
    ne = n(() => String(r(e.timeZone))),
    re = n(() => String(Intl.DateTimeFormat().resolvedOptions().calendar)),
    oe = n(
      () =>
        `${new Intl.NumberFormat().format(123456789e-2)} · ${new Date().toLocaleDateString()}`,
    ),
    ae = n(() => [navigator.language, ...navigator.languages].join(", ")),
    ie = (await i())
      .filter((a) => /^fa\b/i.test(a.lang))
      .map((a) => a.lang)
      .join(", "),
    ce = e.hiddenFonts.filter(o),
    D = await p().catch(() => null);
  return [
    t("timezone", "Timezone", w === e.timeZone, w),
    t("offset", "System offset", R === ne, `${R} (expected ${ne})`),
    t("calendar", "Calendar", re !== "persian", re),
    t("digits", "Digits & dates", !/[۰-۹٠-٩]/.test(oe), oe),
    t("language", "Browser language", !/\bfa\b|\bfa-/i.test(ae), ae),
    t("voices", "Persian voices", ie === "", ie || "—"),
    t("fonts", "Persian fonts", ce.length === 0, ce.join(", ") || "—"),
    ...(D === null
      ? []
      : [t("keyboard", "Keyboard layout", /^[a-z]$/i.test(D), D)]),
  ];
}
const ke = [
  "IRANSans",
  "IRANSansX",
  "IRANSansWeb",
  "IRAN Sans",
  "IRANYekan",
  "IRANYekanX",
  "Iranian Sans",
  "Vazir",
  "Vazirmatn",
  "Vazir Code",
  "Sahel",
  "Samim",
  "Shabnam",
  "Estedad",
  "Dana",
  "DanaFaNum",
  "Yekan",
  "YekanBakh",
  "Parastoo",
  "Gandom",
  "Tanha",
  "Nahid",
  "Mikhak",
  "Ravi",
  "Behdad",
  "B Nazanin",
  "B Titr",
  "B Yekan",
  "B Mitra",
  "B Lotus",
  "B Koodak",
  "B Zar",
  "Nazanin",
  "Titr",
  "Mitra",
  "Lotus",
  "Zar",
  "Traffic",
  "Homa",
  "Koodak",
  "Far Nazanin",
  "Persian Sans",
  "Noto Naskh Arabic",
  "Noto Nastaliq Urdu",
  "W_nazanin",
  "XB Zar",
  "XB Niloofar",
];
function hn(e) {
  return e
    .toLowerCase()
    .replace(/["']/g, "")
    .replace(/[\s_-]+/g, "");
}
new Set(ke.map(hn));
const mn = ke,
  pn = "disable_non_proxied_udp",
  Oe = "Cannot inspect this page. Reload it and try again.";
function wn(e) {
  return {
    id: "webrtc",
    label: "WebRTC policy",
    passed: e === pn,
    saw: e ?? "—",
  };
}
async function gn() {
  const e = chrome.privacy?.network?.webRTCIPHandlingPolicy;
  if (e !== void 0) return (await e.get({})).value;
}
async function yn(e, t) {
  const n = await En(e);
  if (n !== "delivered")
    return { delivery: n, checks: [], recovery: await an(e) };
  const { profile: r } = X(J(t), t.overrides),
    [o, i, status] = await Promise.all([
      Sn(e, r.timeZone),
      gn(),
      chrome.scripting.executeScript({
        target: { tabId: e },
        world: "MAIN",
        func: () => globalThis[Symbol.for("raptorshield.shields")] ?? null,
      }),
    ]);
  const patch = status[0]?.result ?? null;
  const expected = JSON.stringify({
    profile: r,
    shields: t.shields,
    stealth: t.stealthEnabled,
    flowUnlockEnabled: t.flowUnlockEnabled,
  });
  return {
    delivery: n,
    checks: [...o, wn(i)],
    recovery: null,
    patch,
    reloadRequired: patch?.signature !== expected,
  };
}
async function En(e) {
  if (!(await Lt())) return "rules";
  try {
    const [t] = await chrome.scripting.executeScript({
      target: { tabId: e },
      world: "ISOLATED",
      args: ["fx5b78a745"],
      func: dn,
    });
    return ln(
      t?.result ?? { delivered: !1, swControlled: !1, deliveryType: "" },
    );
  } catch {
    throw new Error(Oe);
  }
}
async function Sn(e, t) {
  try {
    const [n] = await chrome.scripting.executeScript({
      target: { tabId: e },
      world: "MAIN",
      args: [{ timeZone: t, hiddenFonts: mn.slice(0, 8) }],
      func: fn,
    });
    return n?.result ?? [];
  } catch {
    throw new Error(Oe);
  }
}
const An = new Set(["http:", "https:"]);
function O(e) {
  if (!e) return null;
  try {
    const t = new URL(e);
    return An.has(t.protocol) ? t.hostname.toLowerCase() : null;
  } catch {
    return null;
  }
}
function bn(e) {
  return e === "ir" || e.endsWith(".ir");
}
function Rn(e, t) {
  return e === t || e.endsWith(`.${t}`);
}
function vn(e, t) {
  return t.some((n) => Rn(e, n.toLowerCase()));
}
function Tn(e, t) {
  const n = e.split(".");
  return n.some((r, o) => t.has(n.slice(o).join(".")));
}
const Cn = new Set();
function Q(e, t, n = Cn) {
  return t.enabled
    ? e === null
      ? null
      : t.autoIranExempt && bn(e)
        ? "iranian-tld"
        : t.autoIranExempt && Tn(e, n)
          ? "iran-list"
          : vn(e, t.whitelist)
            ? "whitelist"
            : null
    : "disabled";
}
const Ln = {
  "iranian-tld": "iranian",
  "iran-list": "iranian",
  whitelist: "whitelist",
};
function kn(e) {
  return e === null ? null : (Ln[e] ?? null);
}
const Z = "foxyshield:country",
  xn = 2;
async function Fn() {
  (await chrome.alarms.get(Z)) === void 0 &&
    (await chrome.alarms.create(Z, { periodInMinutes: xn }));
}
async function b(options = {}) {
  const before = await s();
  const exit = await refreshExit(options);
  await u({
    detectedCountry: exit.countryCode,
    detectedAt: exit.checkedAt,
    detectionError: exit.error,
  });
  return (
    before.detectedCountry !== exit.countryCode ||
    before.detectedAt !== exit.checkedAt ||
    before.detectionError !== exit.error
  );
}
const $n = "https://flow.google.com/";
function Hn(e) {
  try {
    return new URL(e).hostname;
  } catch {
    return "";
  }
}
function Ne(e) {
  const t = Hn(e);
  return (
    t === "flow.google.com" ||
    t.startsWith("flow.google-") ||
    t === "labs.google"
  );
}
function Bn(e) {
  return Ne(e) && e.toLowerCase().includes("unsupported-country");
}
function Pn(e) {
  try {
    const t = /^\/u\/(\d+)(?:\/|$)/.exec(new URL(e).pathname);
    if (t) return `https://flow.google.com/u/${t[1]}/`;
  } catch {}
  return $n;
}
const Wn = 2,
  Yn = 6e4;
function Zn(e, t) {
  const n = e.filter((r) => t - r < Yn);
  return n.length >= Wn
    ? { allowed: !1, attempts: n }
    : { allowed: !0, attempts: [...n, t] };
}
const j = new Map();
async function z(e, t) {
  const settings = await s();
  if (
    e < 0 ||
    !Ne(t) ||
    !settings.enabled ||
    !settings.flowUnlockEnabled ||
    k(settings) !== "ok" ||
    Q(O(t), settings, K(await m())) !== null
  )
    return;
  const r = Zn(j.get(e) ?? [], Date.now());
  if ((j.set(e, r.attempts), !!r.allowed))
    try {
      await chrome.tabs.update(e, { url: Pn(t) });
    } catch {}
}
function jn(e) {
  return e?.id === void 0 || e.url === void 0
    ? Promise.resolve()
    : z(e.id, e.url);
}
function zn() {
  (chrome.webNavigation.onErrorOccurred.addListener((e) => {
    e.frameId !== 0 ||
      !e.error.includes("ERR_BLOCKED_BY_CLIENT") ||
      z(e.tabId, e.url);
  }),
    chrome.webNavigation.onCommitted.addListener((e) => {
      e.frameId !== 0 || !Bn(e.url) || z(e.tabId, e.url);
    }),
    chrome.tabs.onRemoved.addListener((e) => j.delete(e)));
}
const Kn = [16, 32, 48, 128];
function Gn(e, t) {
  const n = Object.fromEntries(Kn.map((o) => [o, `icons/raptorshield-${e}-${o}.png`])),
    r = t === void 0 ? { path: n } : { path: n, tabId: t };
  chrome.action.setIcon(r, () => chrome.runtime.lastError);
}
const Nr = {
  "get-popup-state": () => Promise.resolve(),
  "set-enabled": (e) => $r(e),
  "set-shield": (e) => Hr(e),
  "whitelist-active-tab": () => Yr(),
  "restore-active-tab": () => restoreActive(),
  "refresh-exit": () => b({ details: !0, force: !0 }),
  "refresh-profile": () => b(),
  "set-iran-exempt": (e) => u({ autoIranExempt: e.enabled === !0 }),
  "reload-active-tab": () => reloadActive(),
  "set-country": (e) => Wr(e),
  "set-overrides": (e) => Mr(e),
  "set-advanced": (e) => qr(e),
  "run-audit": () => Promise.resolve(),
  "remove-whitelist": (e) => Ir(e),
  "refresh-iran-list": () => G(),
  "set-flow-unlock": (e) => xr(e),
  "set-stealth": (e) => Fr(e),
  "reload-cached": () => Promise.resolve(),
  "flow-bounce": () => Promise.resolve(),
};
async function Ir(e) {
  if (e.type !== "remove-whitelist") return;
  const t = await s();
  await u({ whitelist: t.whitelist.filter((n) => n !== e.host) });
}
async function Dr() {
  const e = await I();
  if (e?.id === void 0) throw new Error("No active tab found.");
  return yn(e.id, await s());
}
async function Mr(e) {
  if (e.type === "set-overrides") {
    const t = await s();
    await u({ overrides: { ...t.overrides, ...e.overrides } });
  }
}
async function qr(e) {
  e.type === "set-advanced" && (await u({ advancedMode: e.on }));
}
async function xr(e) {
  e.type === "set-flow-unlock" && (await u({ flowUnlockEnabled: e.enabled }));
}
async function Fr(e) {
  e.type === "set-stealth" && (await u({ stealthEnabled: e.enabled }));
}
async function $r(e) {
  e.type === "set-enabled" && (await u({ enabled: e.enabled }));
}
async function Hr(e) {
  if (e.type !== "set-shield") return;
  if (!Br(e.id)) throw new Error(`Unknown shield: ${e.id}`);
  const t = await s();
  await u({ shields: { ...t.shields, [e.id]: e.on } });
}
function Br(e) {
  return V.includes(e);
}
async function Wr(e) {
  if (e.type === "set-country") {
    if (e.code !== null && !be(e.code))
      throw new Error(`Unsupported country: ${e.code}`);
    await u({ chosenCountry: e.code });
  }
}
async function Yr() {
  const e = O((await I())?.url);
  if (e === null) throw new Error("This tab is not a web page.");
  const t = await s();
  t.whitelist.includes(e) || (await u({ whitelist: [...t.whitelist, e] }));
}
async function I() {
  const [e] = await chrome.tabs.query({ active: !0, currentWindow: !0 });
  return e;
}
async function Zr() {
  const e = await s(),
    t = O((await I())?.url),
    n = await m(),
    r = Q(t, e, K(n)),
    o = Date.now();
  return {
    settings: e,
    iranList: {
      count: n.domains.length,
      updatedAt: n.updatedAt,
      appliedCount: n.appliedCount,
    },
    host: t,
    exempt: r !== null,
    exemptWhy: kn(r),
    exitIp: await readExit(),
    rulesInstalled: await Lt(),
    webrtcError:
      (await chrome.storage.session.get("webrtcError")).webrtcError ?? null,
    profile: k(e) === "ok" ? X(J(e), e.overrides).profile : null,
    mismatches: k(e) === "ok" ? X(J(e), e.overrides).mismatches : [],
    exit: k(e),
  };
}
async function h(e) {
  const t = await s(),
    n = O(
      (e === void 0 ? await I() : await chrome.tabs.get(e).catch(() => null))
        ?.url,
    ),
    r = K(await m()),
    o = n !== null && (await Lt()) && k(t) === "ok" && Q(n, t, r) === null;
  Gn(o ? "on" : "off", e);
}
const jr = {
  "reload-cached": (e, t) =>
    Kr(e, t.type === "reload-cached" && t.bypassCache === !0),
  "flow-bounce": (e) => jn(e),
};
async function zr(e) {
  const t = await s(),
    n = K(await m());
  return k(t) === "ok" && Q(O(e?.url), t, n) === null && !mt(e?.url ?? "");
}
async function Kr(e, t) {
  if (!(await zr(e))) {
    await fe(e?.id, { outcome: "not-applicable", bypassCache: t });
    return;
  }
  const n = await on(e, { bypassCache: t });
  await fe(e?.id, { outcome: n ? "reloaded" : "skipped", bypassCache: t });
}
chrome.tabs.onRemoved.addListener((e) => {
  cn(e);
});
chrome.webNavigation.onCommitted.addListener((e) => {
  en(e);
});
chrome.runtime.onMessage.addListener((e, t, n) => {
  const r = jr[e?.type];
  if (r !== void 0)
    return (
      r(t.tab, e).catch((i) =>
        console.warn("content-script request failed:", i),
      ),
      !1
    );
  if (
    t.id !== chrome.runtime.id ||
    !t.url?.startsWith(chrome.runtime.getURL(""))
  ) {
    n({ ok: !1, error: "Request not allowed." });
    return !1;
  }
  if (e?.type === "run-audit")
    return (
      Dr()
        .then((i) => n({ ok: !0, ...i }))
        .catch((i) => n({ ok: !1, error: ge(i) })),
      !0
    );
  const o = Nr[e?.type];
  return o
    ? (o(e)
        .then(async () => {
          await E();
          n({ ok: true, state: await Zr() });
          await h();
        })
        .catch((i) => n({ ok: !1, error: ge(i) })),
      !0)
    : (n({ ok: !1, error: `Unknown request: ${e?.type}` }), !1);
});
function ge(e) {
  return e instanceof Error ? e.message : String(e);
}
async function Fe() {
  await b({ force: true });
  await E();
  await h();
}
const Gr = {
  [$]: async () => {
    if ((await s()).autoIranExempt) {
      await G();
      await E();
      await h();
    }
  },
  [Z]: () => Fe(),
};
chrome.alarms.onAlarm.addListener((e) => {
  Gr[e.name]?.();
});
const Vr = 1e4;
let ye = 0;
function $e() {
  const e = Date.now();
  e - ye >= Vr && ((ye = e), Fe());
}
self.addEventListener("online", $e);
navigator.connection?.addEventListener("change", $e);
zn();
chrome.tabs.onActivated.addListener(({ tabId: e }) => {
  h(e);
});
chrome.tabs.onUpdated.addListener((e, t) => {
  t.status === "complete" && h(e);
});
chrome.runtime.onInstalled.addListener(() => {
  He();
});
chrome.runtime.onStartup.addListener(() => {
  He();
});
async function He() {
  await chrome.alarms.clear("foxyshield:refresh");
  await chrome.declarativeNetRequest.updateSessionRules({
    removeRuleIds: [1],
    addRules: [],
  });
  const settings = await s();
  await chrome.storage.local.set({ settings });
  await Fn();
  await ct();
  await E();
  await b();
  if (settings.autoIranExempt) await it();
  await E();
  await h();
}
let ruleUpdates = Promise.resolve();
async function E() {
  ruleUpdates = ruleUpdates
    .catch(() => {})
    .then(async () => {
      await Gt(await s());
    });
  return ruleUpdates;
}

async function reloadActive() {
  const tab = await I();
  if (tab?.id === undefined || O(tab.url) === null)
    throw new Error("Open a regular web page.");
  if (!(await on(tab, { bypassCache: true })))
    throw new Error("Automatic reload skipped. Reload the page manually.");
}

async function restoreActive() {
  const host = O((await I())?.url);
  if (host === null) throw new Error("Open a regular web page.");
  const settings = await s();
  await u({
    whitelist: settings.whitelist.filter(
      (domain) => !Rn(host, domain.toLowerCase()),
    ),
  });
}
