import {
  c as g,
  i as C,
  f as w,
  m as E,
  s as k,
  C as S,
  a as h,
  b as Z,
  S as x,
  d as L,
  e as b,
  w as $,
  g as O,
  h as N,
  j as H,
} from "./chunks/settings-iR74DS63.js";
function I(e, t) {
  const n = g(e);
  return { profile: A(n, t), mismatches: U(n, t) };
}
function A(e, t) {
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
    languages: R(t.acceptLanguage ?? e.acceptLanguage, n),
  };
}
function R(e, t) {
  const n = e
    .split(",")
    .map((o) => (o.split(";")[0] ?? "").trim())
    .filter((o) => o !== "");
  return n.length > 0 ? [...new Set(n)] : [t];
}
const T = [D, M, P, _];
function U(e, t) {
  return T.map((n) => n(e, t)).filter((n) => n !== null);
}
function D(e, t) {
  return t.timeZone === null || t.timeZone === e.timeZone
    ? null
    : {
        field: "timeZone",
        message: `Manual timezone (${t.timeZone}) differs from the ${e.name} profile.`,
      };
}
function M(e, t) {
  const n = t.locale;
  return n === null
    ? null
    : v(n)
      ? {
          field: "locale",
          message:
            "The manual locale includes Persian and may reveal your language preferences.",
        }
      : f(n) === null || f(n) === e.code
        ? null
        : {
            field: "locale",
            message: `Manual locale (${n}) differs from the ${e.name} profile.`,
          };
}
function P(e, t) {
  const n = t.acceptLanguage;
  return n === null || !v(n)
    ? null
    : {
        field: "acceptLanguage",
        message: "The manual Accept-Language header includes Persian.",
      };
}
const p = 12;
function _(e, t) {
  const n = t.coordinates;
  return n === null
    ? null
    : Math.abs(n.latitude - e.latitude) > p ||
        Math.abs(n.longitude - e.longitude) > p
      ? {
          field: "coordinates",
          message: `Manual coordinates are far from the ${e.name} preset.`,
        }
      : null;
}
function v(e) {
  return /\bfa\b|\bfa-/i.test(e);
}
function f(e) {
  const t = e.split("-")[1];
  return t !== void 0 && /^[A-Za-z]{2}$/.test(t) ? t.toUpperCase() : null;
}
function j(e, t) {
  const n = e.trim(),
    o = t.trim();
  if (n === "" && o === "") return null;
  if (n === "" || o === "") return;
  const s = { latitude: Number(n), longitude: Number(o) };
  return Math.abs(s.latitude) <= 90 && Math.abs(s.longitude) <= 180
    ? s
    : void 0;
}
const F = [
    { id: "country", title: "Country alignment" },
    { id: "fingerprint", title: "Fingerprint protection" },
  ],
  y = {
    timezone: {
      name: "Timezone",
      group: "country",
      detail: "Aligns local browser time with the profile timezone.",
    },
    locale: {
      name: "Language & calendar",
      group: "country",
      detail:
        "Aligns default language, calendar and number formatting with the profile. Disable if a site needs your original locale.",
    },
    geolocation: {
      name: "Geolocation",
      group: "country",
      detail:
        "Returns approximate preset coordinates. Does not measure the VPN server location.",
    },
    fonts: {
      name: "Persian fonts",
      group: "country",
      detail:
        "Conceals selected installed Persian fonts from common probes. May affect text rendering.",
    },
    voices: {
      name: "Persian voices",
      group: "country",
      detail:
        "Filters Persian system voices from the speech synthesis voice list.",
    },
    keyboard: {
      name: "Keyboard layout",
      group: "country",
      detail: "Returns a fixed Latin keyboard layout map.",
    },
    webrtc: {
      name: "WebRTC policy",
      group: "country",
      detail:
        "Requires relay connections and changes the browser-wide WebRTC policy. Calls may fail; this is not a leak-free guarantee.",
    },
    workers: {
      name: "Workers",
      group: "country",
      detail:
        "Patches time and language in accessible classic workers. Module workers are not covered.",
    },
    canvas: {
      name: "Canvas",
      group: "fingerprint",
      detail:
        "Adds small, site-specific changes to canvas readouts, including supported classic workers.",
    },
    webgl: {
      name: "GPU",
      group: "fingerprint",
      detail:
        "Changes selected GPU model strings only when another model matches the hardware preset. Covers supported WebGL, WebGPU and classic-worker paths.",
    },
    audio: {
      name: "Audio",
      group: "fingerprint",
      detail:
        "Adds small changes to audio fingerprint readouts without playing sound.",
    },
    clientRects: {
      name: "Layout metrics",
      group: "fingerprint",
      detail:
        "Slightly changes geometry and text measurements used for fingerprinting.",
    },
  },
  B = {
    timezone: "clock",
    locale: "languages",
    geolocation: "map-pin",
    fonts: "type",
    webrtc: "wifi",
    voices: "volume-2",
    keyboard: "keyboard",
    workers: "cpu",
    canvas: "scan",
    webgl: "monitor",
    audio: "audio-waveform",
    clientRects: "sliders-horizontal",
  };
function a(e) {
  const t = document.getElementById(e);
  if (!t) throw new Error(`missing element: ${e}`);
  return t;
}
const i = {
  countryLine: a("country-line"),
  shields: a("shields"),
  mismatches: a("mismatches"),
  timeZone: a("timeZone"),
  timeZoneHint: a("timeZone-hint"),
  locale: a("locale"),
  localeHint: a("locale-hint"),
  acceptLanguage: a("acceptLanguage"),
  acceptLanguageHint: a("acceptLanguage-hint"),
  countryCoords: a("countryCoords"),
  latitude: a("latitude"),
  longitude: a("longitude"),
  coordinatesHint: a("coordinates-hint"),
  whitelist: a("whitelist"),
  iranListStatus: a("iran-list-status"),
  iranListRefresh: a("iran-list-refresh"),
  flowUnlockToggle: a("flow-unlock-toggle"),
  stealthToggle: a("stealth-toggle"),
  error: a("error"),
};
function G(e) {
  const t = h(e.settings);
  ((i.countryLine.textContent = Z("options", e.exit, t)),
    q(e),
    Q(e),
    X(e),
    te(e),
    W(e),
    V(e),
    i.stealthToggle.setAttribute(
      "aria-checked",
      String(e.settings.stealthEnabled),
    ),
    a("iran-exempt-toggle").setAttribute(
      "aria-checked",
      String(e.settings.autoIranExempt),
    ),
    b(
      a("profile-country"),
      O((o) => o.code),
      e.settings.chosenCountry ?? "",
    ),
    !e.profile &&
      [
        i.timeZoneHint,
        i.localeHint,
        i.acceptLanguageHint,
        i.coordinatesHint,
      ].forEach((el) => {
        el.textContent = "Waiting for a valid profile. No fallback is applied.";
      }));
}
function V(e) {
  i.flowUnlockToggle.setAttribute(
    "aria-checked",
    String(e.settings.flowUnlockEnabled),
  );
}
function W(e) {
  const { count: t, updatedAt: n, appliedCount: o } = e.iranList;
  if (!e.settings.autoIranExempt) {
    i.iranListStatus.textContent = t
      ? `${t.toLocaleString("en-US")} domains cached; automatic exceptions off.`
      : "Automatic exceptions off. The domain list is optional.";
    return;
  }
  if (t === 0) {
    i.iranListStatus.textContent = "No Iranian domain list downloaded yet.";
    return;
  }
  const s =
      n === null ? "" : ` · Updated ${new Date(n).toLocaleDateString("en-US")}`,
    r =
      o !== null && o < t ? ` (only ${o.toLocaleString("en-US")} applied)` : "";
  i.iranListStatus.textContent = `${t.toLocaleString("en-US")} Iranian domains${r}${s}`;
}
function q(e) {
  i.shields.replaceChildren(
    ...F.flatMap(({ id: t, title: n }) => [
      Object.assign(document.createElement("h3"), {
        className: "shield-group",
        textContent: n,
      }),
      ...x
        .filter((o) => y[o].group === t)
        .map((o) => Y(o, e.settings.shields[o])),
    ]),
  );
}
function Y(e, t) {
  const n = y[e],
    o = document.createElement("div");
  o.className = "shield";
  const s = document.createElement("span");
  ((s.className = `chip-icon${t ? "" : " chip-icon--off"}`),
    s.append(L(B[e], 18)));
  const r = document.createElement("div");
  return (
    (r.className = "shield-text"),
    r.append(d("shield-name", n.name), d("muted", n.detail)),
    o.append(
      s,
      r,
      J(n.name, t, () => {
        l({ type: "set-shield", id: e, on: !t });
      }),
    ),
    o
  );
}
function J(e, t, n) {
  const o = document.createElement("button");
  return (
    (o.type = "button"),
    (o.className = "switch"),
    o.setAttribute("role", "switch"),
    o.setAttribute("aria-checked", String(t)),
    o.setAttribute("aria-label", e),
    o.append(
      Object.assign(document.createElement("span"), {
        className: "switch-thumb",
      }),
    ),
    o.addEventListener("click", n),
    o
  );
}
function d(e, t) {
  const n = document.createElement("div");
  return ((n.className = e), (n.textContent = t), n);
}
function Q(e) {
  i.mismatches.replaceChildren(
    ...e.mismatches.map((t) => {
      const n = document.createElement("p");
      return ((n.className = "warning"), (n.textContent = t.message), n);
    }),
  );
}
function X(e) {
  const { overrides: t } = e.settings,
    n = I(h(e.settings), t).profile;
  (u(i.timeZone, (o) => o.timeZone, t.timeZone),
    u(i.locale, (o) => o.locale, t.locale),
    u(i.acceptLanguage, (o) => o.acceptLanguage, t.acceptLanguage),
    (i.timeZoneHint.textContent = c(t.timeZone, n.timeZone)),
    (i.localeHint.textContent = c(t.locale, n.locale)),
    (i.acceptLanguageHint.textContent = c(t.acceptLanguage, n.acceptLanguage)),
    ee(t.coordinates, n.coordinates));
}
function u(e, t, n) {
  b(
    e,
    $(O(t), n, (o) => `Current value: ${o}`),
    n ?? "",
  );
}
function ee(e, t) {
  ((i.latitude.value = e === null ? "" : String(e.latitude)),
    (i.longitude.value = e === null ? "" : String(e.longitude)),
    b(i.countryCoords, H(e), N(e)),
    (i.coordinatesHint.textContent = c(
      e === null ? null : "Manual",
      `${t.latitude}, ${t.longitude}`,
    )));
}
function c(e, t) {
  return e === null ? `Automatic: ${t}` : `Manual: ${t}`;
}
function te(e) {
  i.whitelist.replaceChildren(
    ...e.settings.whitelist.map((t) => {
      const n = document.createElement("li");
      return (n.append(d("", t)), n.append(ne(t)), n);
    }),
  );
}
function ne(e) {
  const t = document.createElement("button");
  return (
    (t.type = "button"),
    (t.className = "ghost-button"),
    t.setAttribute("aria-label", `Remove ${e}`),
    t.append(
      L("trash-2"),
      Object.assign(document.createElement("span"), { textContent: "Remove" }),
    ),
    t.addEventListener("click", () => {
      l({ type: "remove-whitelist", host: e });
    }),
    t
  );
}
async function l(e) {
  i.error.textContent = "";
  try {
    const t = await k(e);
    if (!t.ok) throw new Error(t.error);
    G(t.state);
  } catch (error) {
    i.error.textContent = error.message ?? String(error);
  }
}
async function oe(e, t, n) {
  const o = e.querySelector("span") ?? e,
    s = o.textContent;
  ((e.disabled = !0), e.classList.add("is-busy"), (o.textContent = t));
  try {
    await n();
  } finally {
    ((e.disabled = !1), e.classList.remove("is-busy"), (o.textContent = s));
  }
}
function m(e, t) {
  e.addEventListener("change", () => {
    l({
      type: "set-overrides",
      overrides: { [t]: e.value === "" ? null : e.value },
    });
  });
}
function ie() {
  i.countryCoords.addEventListener("change", () => {
    if (i.countryCoords.value === "") {
      l({ type: "set-overrides", overrides: { coordinates: null } });
      return;
    }
    if (i.countryCoords.value === S) return;
    const e = g(i.countryCoords.value);
    l({
      type: "set-overrides",
      overrides: {
        coordinates: { latitude: e.latitude, longitude: e.longitude },
      },
    });
  });
}
function ae() {
  const e = () => {
    const t = j(i.latitude.value, i.longitude.value),
      n = t === void 0;
    (i.latitude.classList.toggle("is-bad", n),
      i.longitude.classList.toggle("is-bad", n),
      n || l({ type: "set-overrides", overrides: { coordinates: t } }));
  };
  (i.latitude.addEventListener("change", e),
    i.longitude.addEventListener("change", e));
}
i.iranListRefresh.addEventListener("click", () => {
  oe(i.iranListRefresh, "Updating…", () => l({ type: "refresh-iran-list" }));
});
i.stealthToggle.addEventListener("click", () => {
  const e = i.stealthToggle.getAttribute("aria-checked") === "true";
  l({ type: "set-stealth", enabled: !e });
});
i.flowUnlockToggle.addEventListener("click", () => {
  const e = i.flowUnlockToggle.getAttribute("aria-checked") === "true";
  l({ type: "set-flow-unlock", enabled: !e });
});
m(i.timeZone, "timeZone");
m(i.locale, "locale");
m(i.acceptLanguage, "acceptLanguage");
ae();
ie();
E();
a("version").textContent = `v${chrome.runtime.getManifest().version}`;
l({ type: "get-popup-state" });

a("iran-exempt-toggle").addEventListener("click", () =>
  l({
    type: "set-iran-exempt",
    enabled: a("iran-exempt-toggle").getAttribute("aria-checked") !== "true",
  }),
);
a("profile-country").addEventListener("change", () =>
  l({ type: "set-country", code: a("profile-country").value || null }),
);
