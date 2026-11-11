(function () {
  const t = document.createElement("link").relList;
  if (t && t.supports && t.supports("modulepreload")) return;
  for (const n of document.querySelectorAll('link[rel="modulepreload"]')) o(n);
  new MutationObserver((n) => {
    for (const r of n)
      if (r.type === "childList")
        for (const d of r.addedNodes)
          d.tagName === "LINK" && d.rel === "modulepreload" && o(d);
  }).observe(document, { childList: !0, subtree: !0 });
  function a(n) {
    const r = {};
    return (
      n.integrity && (r.integrity = n.integrity),
      n.referrerPolicy && (r.referrerPolicy = n.referrerPolicy),
      n.crossOrigin === "use-credentials"
        ? (r.credentials = "include")
        : n.crossOrigin === "anonymous"
          ? (r.credentials = "omit")
          : (r.credentials = "same-origin"),
      r
    );
  }
  function o(n) {
    if (n.ep) return;
    n.ep = !0;
    const r = a(n);
    fetch(n.href, r);
  }
})();
const S = [
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
  s = S.map(([e, t, a, o, n, r, d]) => ({
    code: e,
    name: t,
    timeZone: a,
    locale: o,
    acceptLanguage: n,
    latitude: r,
    longitude: d,
  })),
  g = "NL",
  h = new Map(s.map((e) => [e.code, e]));
function x(e) {
  return (e === null ? void 0 : h.get(e.toUpperCase())) ?? h.get(g);
}
function A(e) {
  return e !== null && h.has(e.toUpperCase());
}
function i(e) {
  return A(e) ? x(e).name : e.toUpperCase();
}
function p(e) {
  return [...e.toUpperCase()]
    .map((a) => String.fromCodePoint(127397 + a.charCodeAt(0)))
    .join("");
}
function l(e) {
  return e === null ? "" : ` (${e.toUpperCase()})`;
}
const C = {
  popup: {
    ok: (e) =>
      e === null ? "No profile selected." : `Browser profile: ${i(e)} ${p(e)}`,
    unknown: () =>
      "Exit unknown. Check your connection or select a manual profile.",
    stale: () => "Exit data is stale. Check again.",
    unsupported: (e) =>
      `No preset for exit country${l(e)}. Select a manual profile.`,
  },
  options: {
    ok: (e) => `Browser profile: ${p(e)} ${i(e)}`,
    unknown: () => "Exit unknown. Automatic profile paused.",
    stale: () => "Exit data is stale. Automatic profile paused.",
    unsupported: (e) =>
      `Exit country${l(e)} has no preset. Select a manual profile.`,
  },
};
function k(e, t, a) {
  return C[e][t](a);
}
const E = "Automatic (based on exit IP)",
  f = "custom",
  M = { value: "", label: E };
function c(e) {
  return `${p(e)}  ${i(e)}`;
}
function H(e, t) {
  const a = e.map((n) => ({ value: n, label: c(n) })),
    o = t !== null && !e.includes(t);
  return [
    M,
    ...a,
    ...(o ? [{ value: t, label: `${c(t)} (not currently available)` }] : []),
  ];
}
function b(e) {
  return [M, ...s.map((t) => ({ value: e(t), label: c(t.code) }))];
}
function I(e, t, a) {
  return t === null || e.some((o) => o.value === t)
    ? e
    : [...e, { value: t, label: a(t) }];
}
function m(e) {
  return (
    s.find((a) => a.latitude === e.latitude && a.longitude === e.longitude)
      ?.code ?? null
  );
}
function P(e) {
  const t = b((o) => o.code);
  return e !== null && m(e) === null
    ? [...t, { value: f, label: "Custom coordinates" }]
    : t;
}
function V(e) {
  return e === null ? "" : (m(e) ?? f);
}
function w(e) {
  return JSON.stringify(e.map((t) => [t.value, t.label]));
}
const v = {
  "audio-waveform": [
    [
      "path",
      {
        d: "M2 13a2 2 0 0 0 2-2V7a2 2 0 0 1 4 0v13a2 2 0 0 0 4 0V4a2 2 0 0 1 4 0v13a2 2 0 0 0 4 0v-4a2 2 0 0 1 2-2",
      },
    ],
  ],
  ban: [
    ["circle", { cx: "12", cy: "12", r: "10" }],
    ["path", { d: "M4.929 4.929 19.07 19.071" }],
  ],
  calendar: [
    ["path", { d: "M8 2v3" }],
    ["path", { d: "M16 2v3" }],
    ["rect", { x: "3", y: "3", width: "18", height: "18", rx: "2" }],
    ["path", { d: "M3 9h18" }],
  ],
  "circle-check": [
    ["circle", { cx: "12", cy: "12", r: "10" }],
    ["path", { d: "m16 9-5.5 5.5L8 12" }],
  ],
  "circle-x": [
    ["circle", { cx: "12", cy: "12", r: "10" }],
    ["path", { d: "m15 9-6 6" }],
    ["path", { d: "m9 9 6 6" }],
  ],
  clock: [
    ["circle", { cx: "12", cy: "12", r: "10" }],
    ["path", { d: "M12 6v6l4 2" }],
  ],
  cpu: [
    ["path", { d: "M12 20v2" }],
    ["path", { d: "M12 2v2" }],
    ["path", { d: "M17 20v2" }],
    ["path", { d: "M17 2v2" }],
    ["path", { d: "M2 12h2" }],
    ["path", { d: "M2 17h2" }],
    ["path", { d: "M2 7h2" }],
    ["path", { d: "M20 12h2" }],
    ["path", { d: "M20 17h2" }],
    ["path", { d: "M20 7h2" }],
    ["path", { d: "M7 20v2" }],
    ["path", { d: "M7 2v2" }],
    ["rect", { x: "4", y: "4", width: "16", height: "16", rx: "2" }],
    ["rect", { x: "8", y: "8", width: "8", height: "8", rx: "1" }],
  ],
  "credit-card": [
    ["rect", { width: "20", height: "14", x: "2", y: "5", rx: "2" }],
    ["line", { x1: "2", x2: "22", y1: "10", y2: "10" }],
    ["path", { d: "M6 14h2" }],
  ],
  "eye-off": [
    [
      "path",
      {
        d: "M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",
      },
    ],
    ["path", { d: "M14.084 14.158a3 3 0 0 1-4.242-4.242" }],
    [
      "path",
      {
        d: "M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",
      },
    ],
    ["path", { d: "m2 2 20 20" }],
  ],
  globe: [
    ["circle", { cx: "12", cy: "12", r: "10" }],
    ["path", { d: "M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" }],
    ["path", { d: "M2 12h20" }],
  ],
  hash: [
    ["line", { x1: "4", x2: "20", y1: "9", y2: "9" }],
    ["line", { x1: "4", x2: "20", y1: "15", y2: "15" }],
    ["line", { x1: "10", x2: "8", y1: "3", y2: "21" }],
    ["line", { x1: "16", x2: "14", y1: "3", y2: "21" }],
  ],
  keyboard: [
    ["path", { d: "M10 8h.01" }],
    ["path", { d: "M12 12h.01" }],
    ["path", { d: "M14 8h.01" }],
    ["path", { d: "M16 12h.01" }],
    ["path", { d: "M18 8h.01" }],
    ["path", { d: "M6 8h.01" }],
    ["path", { d: "M7 16h10" }],
    ["path", { d: "M8 12h.01" }],
    ["rect", { width: "20", height: "16", x: "2", y: "4", rx: "2" }],
  ],
  languages: [
    ["path", { d: "m5 8 6 6" }],
    ["path", { d: "m4 14 6-6 2-3" }],
    ["path", { d: "M2 5h12" }],
    ["path", { d: "M7 2h1" }],
    ["path", { d: "m22 22-5-10-5 10" }],
    ["path", { d: "M14 18h6" }],
  ],
  "list-x": [
    ["path", { d: "M16 5H3" }],
    ["path", { d: "M11 12H3" }],
    ["path", { d: "M16 19H3" }],
    ["path", { d: "m15.5 9.5 5 5" }],
    ["path", { d: "m20.5 9.5-5 5" }],
  ],
  "loader-circle": [["path", { d: "M21 12a9 9 0 1 1-6.219-8.56" }]],
  "lock-open": [
    ["rect", { width: "18", height: "11", x: "3", y: "11", rx: "2", ry: "2" }],
    ["path", { d: "M7 11V7a5 5 0 0 1 9.9-1" }],
  ],
  "map-pin": [
    [
      "path",
      {
        d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",
      },
    ],
    ["circle", { cx: "12", cy: "10", r: "3" }],
  ],
  monitor: [
    ["rect", { width: "20", height: "14", x: "2", y: "3", rx: "2" }],
    ["line", { x1: "8", x2: "16", y1: "21", y2: "21" }],
    ["line", { x1: "12", x2: "12", y1: "17", y2: "21" }],
  ],
  power: [
    ["path", { d: "M12 2v10" }],
    ["path", { d: "M18.4 6.6a9 9 0 1 1-12.77.04" }],
  ],
  "refresh-cw": [
    ["path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" }],
    ["path", { d: "M21 3v5h-5" }],
    ["path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" }],
    ["path", { d: "M8 16H3v5" }],
  ],
  scan: [
    ["path", { d: "M3 7V5a2 2 0 0 1 2-2h2" }],
    ["path", { d: "M17 3h2a2 2 0 0 1 2 2v2" }],
    ["path", { d: "M21 17v2a2 2 0 0 1-2 2h-2" }],
    ["path", { d: "M7 21H5a2 2 0 0 1-2-2v-2" }],
  ],
  settings: [
    [
      "path",
      {
        d: "M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",
      },
    ],
    ["circle", { cx: "12", cy: "12", r: "3" }],
  ],
  "shield-alert": [
    [
      "path",
      {
        d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      },
    ],
    ["path", { d: "M12 8v4" }],
    ["path", { d: "M12 16h.01" }],
  ],
  "shield-check": [
    [
      "path",
      {
        d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      },
    ],
    ["path", { d: "m9 12 2 2 4-4" }],
  ],
  "shield-off": [
    ["path", { d: "m2 2 20 20" }],
    [
      "path",
      {
        d: "M5 5a1 1 0 0 0-1 1v7c0 5 3.5 7.5 7.67 8.94a1 1 0 0 0 .67.01c2.35-.82 4.48-1.97 5.9-3.71",
      },
    ],
    [
      "path",
      {
        d: "M9.309 3.652A12.252 12.252 0 0 0 11.24 2.28a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1v7a9.784 9.784 0 0 1-.08 1.264",
      },
    ],
  ],
  "sliders-horizontal": [
    ["path", { d: "M10 5H3" }],
    ["path", { d: "M12 19H3" }],
    ["path", { d: "M14 3v4" }],
    ["path", { d: "M16 17v4" }],
    ["path", { d: "M21 12h-9" }],
    ["path", { d: "M21 19h-5" }],
    ["path", { d: "M21 5h-7" }],
    ["path", { d: "M8 10v4" }],
    ["path", { d: "M8 12H3" }],
  ],
  "trash-2": [
    ["path", { d: "M10 11v6" }],
    ["path", { d: "M14 11v6" }],
    ["path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" }],
    ["path", { d: "M3 6h18" }],
    ["path", { d: "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" }],
  ],
  "triangle-alert": [
    [
      "path",
      {
        d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
      },
    ],
    ["path", { d: "M12 9v4" }],
    ["path", { d: "M12 17h.01" }],
  ],
  type: [
    ["path", { d: "M12 4v16" }],
    ["path", { d: "M4 7V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2" }],
    ["path", { d: "M9 20h6" }],
  ],
  "volume-2": [
    [
      "path",
      {
        d: "M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z",
      },
    ],
    ["path", { d: "M16 9a5 5 0 0 1 0 6" }],
    ["path", { d: "M19.364 18.364a9 9 0 0 0 0-12.728" }],
  ],
  wifi: [
    ["path", { d: "M12 20h.01" }],
    ["path", { d: "M2 8.82a15 15 0 0 1 20 0" }],
    ["path", { d: "M5 12.859a10 10 0 0 1 14 0" }],
    ["path", { d: "M8.5 16.429a5 5 0 0 1 7 0" }],
  ],
  "wifi-off": [
    ["path", { d: "M12 20h.01" }],
    ["path", { d: "M8.5 16.429a5 5 0 0 1 7 0" }],
    ["path", { d: "M5 12.859a10 10 0 0 1 5.17-2.69" }],
    ["path", { d: "M19 12.859a10 10 0 0 0-2.007-1.523" }],
    ["path", { d: "M2 8.82a15 15 0 0 1 4.177-2.643" }],
    ["path", { d: "M22 8.82a15 15 0 0 0-11.288-3.764" }],
    ["path", { d: "m2 2 20 20" }],
  ],
};
function O(e) {
  return v[e];
}
const u = "http://www.w3.org/2000/svg";
function L(e, t = 16) {
  const a = document.createElementNS(u, "svg"),
    o = {
      width: String(t),
      height: String(t),
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": "2",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "aria-hidden": "true",
      class: "icon",
    };
  for (const [n, r] of Object.entries(o)) a.setAttribute(n, r);
  for (const [n, r] of O(e)) {
    const d = document.createElementNS(u, n);
    for (const [q, y] of Object.entries(r)) d.setAttribute(q, y);
    a.append(d);
  }
  return a;
}
function R(e = document) {
  for (const t of e.querySelectorAll("[data-icon]")) {
    const a = t.dataset.icon;
    a in v && t.replaceWith(L(a, Number(t.dataset.size ?? 16)));
  }
}
function $(e, t, a) {
  const o = w(t);
  (e.dataset.sig !== o && (e.replaceChildren(...t.map(U)), (e.dataset.sig = o)),
    (e.value = a));
}
function U(e) {
  const t = document.createElement("option");
  return ((t.value = e.value), (t.textContent = e.label), t);
}
async function j(e) {
  return chrome.runtime.sendMessage(e);
}
async function B() {
  return chrome.runtime.sendMessage({ type: "run-audit" });
}
const N = [
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
  ],
  T = new Set(["timezone", "locale", "webrtc", "workers"]);
Object.fromEntries(N.map((e) => [e, T.has(e)]));
function F(e) {
  return e.chosenCountry ?? e.detectedCountry;
}
export {
  f as C,
  N as S,
  F as a,
  k as b,
  x as c,
  L as d,
  $ as e,
  p as f,
  b as g,
  V as h,
  A as i,
  P as j,
  H as k,
  R as m,
  B as r,
  j as s,
  I as w,
};
