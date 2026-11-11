import {
  g as countryOptions,
  e as fillSelect,
  m as renderIcons,
  s as sendMessage,
  S as SHIELDS,
} from "./chunks/settings-iR74DS63.js";
import { isValidIP, EXIT_MAX_AGE } from "./exit-ip.js";

const $ = (id) => document.getElementById(id);
const SHIELD_NAMES = {
  timezone: "Timezone",
  locale: "Language & calendar",
  geolocation: "Geolocation",
  fonts: "Fonts",
  webrtc: "WebRTC",
  voices: "Voices",
  keyboard: "Keyboard",
  workers: "Worker",
  canvas: "Canvas",
  webgl: "GPU",
  audio: "Audio",
  clientRects: "Geometry & text",
};
let state = null;
let audit = null;
let auditSequence = 0;
let observedSignature = null;
let reloadRequested = false;

function showError(error) {
  $("error").textContent =
    error instanceof Error ? error.message : String(error);
  $("error").hidden = false;
}
async function command(message) {
  const result = await sendMessage(message);
  if (!result?.ok)
    throw new Error(result?.error || "Could not connect to the extension.");
  return result;
}
async function action(button, task) {
  if (button.disabled) return;
  button.disabled = true;
  button.classList.add("is-busy");
  button.setAttribute("aria-busy", "true");
  $("error").hidden = true;
  try {
    await task();
  } catch (error) {
    showError(error);
  } finally {
    button.disabled = false;
    button.classList.remove("is-busy");
    button.removeAttribute("aria-busy");
    if (state) render();
  }
}
function status(id, text, tone = "off") {
  $(id).textContent = text;
  $(id).dataset.tone = tone;
}
function age(timestamp) {
  if (!timestamp) return "Not checked yet";
  const seconds = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));
  if (seconds < 60) return "Just now";
  if (seconds < 3600)
    return `${Math.floor(seconds / 60).toLocaleString("en-US")} min ago`;
  return new Date(timestamp).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
function fresh(exit) {
  return Boolean(
    exit?.checkedAt &&
    !exit.error &&
    Date.now() - exit.checkedAt < EXIT_MAX_AGE,
  );
}
function isProtected() {
  return Boolean(
    state?.settings.enabled &&
    state.exit === "ok" &&
    state.rulesInstalled &&
    state.host &&
    !state.exempt,
  );
}
function notice(id, text) {
  $(id).textContent = text || "";
  $(id).hidden = !text;
}
function signature() {
  return JSON.stringify([
    state.host,
    state.settings.shields,
    state.settings.enabled,
    state.profile,
    state.settings.stealthEnabled,
    state.settings.flowUnlockEnabled,
    state.exempt,
    state.rulesInstalled,
  ]);
}
function update(next) {
  state = next;
  const nextSignature = signature();
  if (observedSignature !== null && observedSignature !== nextSignature) {
    auditSequence++;
    audit = null;
  }
  observedSignature = nextSignature;
  render();
}
function render() {
  const { settings, exitIp: exit, profile } = state;
  $("master").disabled = $("master").getAttribute("aria-busy") === "true";
  $("master").setAttribute("aria-checked", String(settings.enabled));
  let title = "Protection ready",
    hint = "Reload the page to apply your settings.",
    code = "READY",
    tone = "ok";
  if (!settings.enabled) {
    title = "Protection off";
    hint = "Reload open pages to remove existing patches.";
    code = "OFFLINE";
    tone = "off";
  } else if (state.exit !== "ok") {
    title = "Waiting for a valid profile";
    hint =
      state.exit === "unsupported"
        ? "No preset for this exit country. Select a manual profile."
        : "Check your exit IP or choose a manual profile.";
    code = "STANDBY";
    tone = "warn";
  } else if (!state.rulesInstalled) {
    title = "Protection rules failed";
    hint = "Reload the extension and review your settings.";
    code = "RULE ERROR";
    tone = "bad";
  } else if (state.exempt) {
    title = "Site excluded";
    hint = "Page and header changes are paused for this site.";
    code = "EXEMPT";
    tone = "warn";
  } else if (!state.host) {
    title = "Protection ready";
    hint = "Open a regular web page.";
  } else if (
    audit?.ok &&
    !audit.reloadRequired &&
    audit.delivery === "delivered" &&
    audit.patch?.failed?.length === 0
  ) {
    title = "Page shields installed";
    hint = "See Shields for diagnostics and coverage limits.";
    code = "PATCHED";
  }
  if (state.webrtcError && settings.enabled && settings.shields.webrtc) {
    hint = state.webrtcError;
    tone = "warn";
    code = "PARTIAL";
  }
  $("protection-title").textContent = title;
  $("protection-hint").textContent = hint;
  status("protection-code", code, tone);
  $("site-light").dataset.tone = isProtected() ? "ok" : "warn";
  $("active-host").textContent = state.host || "No active web page";
  $("site-exempt").textContent =
    state.exemptWhy === "whitelist"
      ? "Restore"
      : state.exemptWhy === "iranian"
        ? "Iran exception"
        : "Exclude site";
  $("site-exempt").disabled =
    !state.host ||
    state.exemptWhy === "iranian" ||
    $("site-exempt").getAttribute("aria-busy") === "true";

  const current = fresh(exit);
  status(
    "exit-status",
    exit?.error
      ? "LOOKUP FAILED"
      : current
        ? "OBSERVED"
        : exit?.checkedAt
          ? "STALE"
          : "UNKNOWN",
    current ? "ok" : "warn",
  );
  $("exit-ip").textContent = exit?.ip || "— — —";
  $("exit-ip").parentElement.classList.toggle(
    "is-v6",
    Boolean(exit?.ip?.includes(":")),
  );
  $("copy-ip").disabled = !isValidIP(exit?.ip);
  $("exit-location").textContent =
    [exit?.country || exit?.countryCode, exit?.city || exit?.region]
      .filter(Boolean)
      .join(" · ") || "Location unknown";
  $("exit-source").textContent = exit?.source || "NO SOURCE";
  $("exit-isp").textContent = exit?.isp || "Unknown";
  $("exit-asn").textContent = exit?.asn ? `AS${exit.asn}` : "—";
  $("exit-timezone").textContent = exit?.timezone || "—";
  $("exit-checked").textContent = age(exit?.checkedAt);
  $("address-details").hidden = !exit?.addressesCheckedAt;
  $("exit-ipv4").textContent = exit?.ipv4 || "Unavailable";
  $("exit-ipv6").textContent = exit?.ipv6 || "Unavailable";
  $("address-hint").textContent =
    `Addresses checked: ${age(exit?.addressesCheckedAt)}${exit?.addressErrors?.length ? " · No response does not prove IPv6 is disabled or leak-free." : ""}`;
  const messages = [];
  if (exit?.error) messages.push(exit.error);
  else if (exit?.checkedAt && !current)
    messages.push("Exit data is stale. Check again.");
  if (exit?.changedAt && Date.now() - exit.changedAt < 5 * 60_000)
    messages.push(`Exit changed. Previous IP: ${exit.previousIp}`);
  if (
    exit?.ip &&
    exit?.addressesCheckedAt &&
    current &&
    exit.ipv4 &&
    !exit.ip.includes(":") &&
    exit.ip !== exit.ipv4
  )
    messages.push(
      "Services observed different IPv4 addresses. Routing may vary or rotate.",
    );
  notice("exit-message", messages.join(" "));

  fillSelect(
    $("country"),
    countryOptions((c) => c.code),
    settings.chosenCountry || "",
  );
  $("country").disabled = $("country").getAttribute("aria-busy") === "true";
  $("country-hint").textContent = settings.chosenCountry
    ? "Manual profile. VPN connection cannot be verified here."
    : current
      ? `Automatic profile for exit ${exit.countryCode}. This does not verify a VPN connection.`
      : "Automatic selection needs fresh exit information.";
  $("profile-timezone").textContent = profile?.timeZone || "UNAVAILABLE";
  $("profile-locale").textContent = profile?.locale || "UNAVAILABLE";
  const mismatch = current && profile && exit.countryCode !== profile.country;
  const timezoneMismatch =
    current && profile && exit.timezone && exit.timezone !== profile.timeZone;
  status(
    "sync-status",
    !profile || !current
      ? "UNVERIFIED"
      : mismatch
        ? "MISMATCH"
        : "COUNTRY MATCH",
    !profile || !current || mismatch ? "warn" : "ok",
  );
  const warnings = state.mismatches.map((item) => item.message);
  if (mismatch)
    warnings.unshift(
      "The profile country differs from the observed exit country.",
    );
  if (timezoneMismatch)
    warnings.push(
      "Exit and profile timezones differ. Some countries have multiple timezones.",
    );
  notice("sync-warning", warnings.join(" "));

  const enabled = SHIELDS.filter((id) => settings.shields[id]);
  $("shield-count").textContent = `${enabled.length}/${SHIELDS.length}`;
  $("reload-notice").hidden =
    !state.host ||
    !(
      reloadRequested ||
      audit?.reloadRequired ||
      (isProtected() && audit?.ok && audit.delivery !== "delivered")
    );
  renderReports();
  renderAudit();
}
function renderReports() {
  const exit = state.exitIp;
  const choices = [];
  if (fresh(exit)) {
    if (isValidIP(exit.ip)) choices.push(exit.ip);
    if (
      exit.addressesCheckedAt &&
      Date.now() - exit.addressesCheckedAt < EXIT_MAX_AGE
    ) {
      for (const ip of [exit.ipv4, exit.ipv6])
        if (isValidIP(ip) && !choices.includes(ip)) choices.push(ip);
    }
  }
  const select = $("report-ip");
  const selected = choices.includes(select.value)
    ? select.value
    : choices[0] || "";
  fillSelect(
    select,
    choices.length
      ? choices.map((ip) => ({ value: ip, label: ip }))
      : [{ value: "", label: "Check your exit IP first" }],
    selected,
  );
  select.disabled = !choices.length;
  $("report-freshness").textContent = choices.length
    ? `IP observed ${age(exit.checkedAt)} · Reputation not checked.`
    : "Refresh your exit IP before opening a report.";
  updateReportLinks();
}
function updateReportLinks() {
  const ip = $("report-ip").value;
  const enabled = fresh(state.exitIp) && isValidIP(ip);
  const links = {
    "abuse-report": `https://www.abuseipdb.com/check/${encodeURIComponent(ip)}`,
    "spamhaus-report": `https://check.spamhaus.org/listed/?searchterm=${encodeURIComponent(ip)}`,
  };
  for (const [id, url] of Object.entries(links)) {
    $(id).setAttribute("aria-disabled", String(!enabled));
    $(id).tabIndex = enabled ? 0 : -1;
    if (enabled) $(id).href = url;
    else $(id).removeAttribute("href");
  }
}
function renderAudit() {
  const available = isProtected();
  $("run-audit").disabled =
    !available || $("run-audit").getAttribute("aria-busy") === "true";
  let summary = available
    ? "Inspect the active page to check shield installation."
    : "Open a regular web page with protection enabled.";
  let code = "UNVERIFIED",
    tone = "warn";
  if (audit) {
    if (!audit.ok) summary = audit.error;
    else if (audit.delivery !== "delivered")
      summary =
        {
          "service-worker":
            "Configuration did not reach this service-worker page. Reload it.",
          cache: "Configuration did not reach the cached page. Reload it.",
          missing: "Configuration did not reach the page. Reload it.",
          rules: "Network rules are not installed.",
        }[audit.delivery] || "This page cannot be inspected.";
    else if (audit.reloadRequired)
      summary =
        "The page uses different settings. Reload it to apply the current profile.";
    else {
      const failed = audit.patch?.failed || [];
      const issues = audit.checks.filter(
        (check) => check.passed === false && checkEnabled(check.id),
      );
      summary =
        failed.length || issues.length
          ? "Some checks failed. Review the details below."
          : "Active shield installation checked. Diagnostics cover only selected paths.";
      code = failed.length || issues.length ? "ISSUES FOUND" : "CHECKED";
      tone = failed.length || issues.length ? "bad" : "ok";
    }
  }
  status("audit-code", code, tone);
  $("audit-summary").textContent = summary;
  $("shield-grid").replaceChildren(
    ...SHIELDS.map((id) => {
      const item = document.createElement("li");
      const name = document.createElement("span");
      name.textContent = SHIELD_NAMES[id];
      const value = document.createElement("small");
      const enabled = state.settings.shields[id];
      const failed = audit?.patch?.failed?.includes(id);
      const installed =
        !audit?.reloadRequired && audit?.patch?.installed?.includes(id);
      value.textContent = !enabled
        ? "Off"
        : !available
          ? "Paused"
          : failed
            ? "Failed"
            : installed
              ? "Installed"
              : "Unverified";
      item.dataset.tone =
        !enabled || !available
          ? "off"
          : failed
            ? "bad"
            : installed
              ? "ok"
              : "warn";
      item.append(name, value);
      return item;
    }),
  );
  const issues =
    audit?.ok && !audit.reloadRequired
      ? audit.checks
          .filter((check) => !check.passed && checkEnabled(check.id))
          .map((check) => `${check.label}: ${check.saw}`)
      : [];
  if (state.webrtcError) issues.push(state.webrtcError);
  $("audit-issues").replaceChildren(
    ...issues.map((text) => {
      const li = document.createElement("li");
      li.textContent = text;
      return li;
    }),
  );
}
function checkEnabled(id) {
  const shield =
    {
      offset: "timezone",
      calendar: "locale",
      digits: "locale",
      language: "locale",
    }[id] || id;
  return state.settings.shields[shield] === true;
}
async function runAudit() {
  if (!isProtected()) return;
  const sequence = ++auditSequence;
  let result;
  try {
    result = await command({ type: "run-audit" });
  } catch (error) {
    result = { ok: false, error: error.message };
  }
  if (sequence !== auditSequence) return;
  audit = result;
  if (result.ok && !result.reloadRequired && result.delivery === "delivered")
    reloadRequested = false;
  render();
}
async function refreshIP() {
  update((await command({ type: "refresh-exit" })).state);
  if (isProtected()) await runAudit();
}
function selectView(view, focus = false) {
  window.scrollTo({ top: 0 });
  for (const button of document.querySelectorAll("[data-view]")) {
    const selected = button.dataset.view === view;
    button.setAttribute("aria-selected", String(selected));
    button.tabIndex = selected ? 0 : -1;
    $(`view-${button.dataset.view}`).hidden = !selected;
    if (selected && focus) button.focus();
  }
}
for (const button of document.querySelectorAll("[data-view]")) {
  button.addEventListener("click", () => selectView(button.dataset.view));
  button.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const views = ["overview", "reputation", "shields"];
    const index = views.indexOf(button.dataset.view);
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? 2
          : (index + (event.key === "ArrowRight" ? 1 : 2)) % 3;
    selectView(views[next], true);
  });
}
$("master").addEventListener("click", () =>
  action($("master"), async () => {
    update(
      (await command({ type: "set-enabled", enabled: !state.settings.enabled }))
        .state,
    );
    reloadRequested = true;
    audit = null;
  }),
);
$("country").addEventListener("change", () =>
  action($("country"), async () => {
    update(
      (await command({ type: "set-country", code: $("country").value || null }))
        .state,
    );
    reloadRequested = true;
    audit = null;
  }),
);
$("site-exempt").addEventListener("click", () =>
  action($("site-exempt"), async () => {
    const message =
      state.exemptWhy === "whitelist"
        ? { type: "restore-active-tab" }
        : { type: "whitelist-active-tab" };
    update((await command(message)).state);
    reloadRequested = true;
    audit = null;
  }),
);
$("reload").addEventListener("click", () =>
  action($("reload"), async () => {
    await command({ type: "reload-active-tab" });
    window.close();
  }),
);
$("check-ip").addEventListener("click", () => action($("check-ip"), refreshIP));
$("reputation-refresh").addEventListener("click", () =>
  action($("reputation-refresh"), refreshIP),
);
$("run-audit").addEventListener("click", () =>
  action($("run-audit"), runAudit),
);
$("copy-ip").addEventListener("click", () =>
  action($("copy-ip"), async () => {
    await navigator.clipboard.writeText(state.exitIp.ip);
    $("copy-ip").setAttribute("aria-label", "IP address copied");
    $("copy-ip").title = "IP address copied";
  }),
);
$("report-ip").addEventListener("change", updateReportLinks);
for (const id of ["settings", "brand-settings"])
  $(id).addEventListener("click", (event) => {
    event.preventDefault();
    chrome.runtime.openOptionsPage().catch(showError);
  });
renderIcons();
$("version").textContent = `v${chrome.runtime.getManifest().version}`;
async function initialize() {
  update((await command({ type: "get-popup-state" })).state);
  if (isProtected()) await runAudit();
  update((await command({ type: "refresh-profile" })).state);
  if (isProtected() && !audit) await runAudit();
}
initialize().catch(showError);
setInterval(() => {
  command({ type: "get-popup-state" })
    .then((result) => update(result.state))
    .catch(showError);
}, 30_000);
