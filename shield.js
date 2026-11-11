(function () {
  "use strict";
  const k = new WeakSet(),
    q = Function.prototype.toString;
  let V = !1,
    E = !1;
  function d(t, e) {
    const n = E ? wt(t, L(e)) : t;
    return (D(n, "name", L(e)), D(n, "length", e.length), k.add(n), n);
  }
  function I(t, e) {
    return (
      D(t, "name", L(e)),
      D(t, "length", e.length),
      k.add(t),
      E && vt(t, e),
      t
    );
  }
  function vt(t, e) {
    const n = t.prototype;
    try {
      (Object.defineProperty(t, "prototype", { writable: !1 }),
        n?.constructor === e &&
          Object.defineProperty(n, "constructor", {
            value: t,
            configurable: !0,
            writable: !0,
            enumerable: !1,
          }));
    } catch {}
  }
  function wt(t, e) {
    return {
      [e](...o) {
        return Reflect.apply(t, this, o);
      },
    }[e];
  }
  function L(t) {
    const e = Object.getOwnPropertyDescriptor(t, "name");
    return typeof e?.value == "string" ? e.value : "";
  }
  function D(t, e, n) {
    try {
      Object.defineProperty(t, e, {
        value: n,
        configurable: !0,
        writable: !1,
        enumerable: !1,
      });
    } catch {}
  }
  function Tt(t = {}) {
    if (V) return;
    ((V = !0), (E = t.strict === !0));
    const e = function () {
      return typeof this == "function" && k.has(this)
        ? `function ${this.name}() { [native code] }`
        : q.call(this);
    };
    Function.prototype.toString = d(e, q);
  }
  function Ot(t) {
    let e = t >>> 0;
    return function () {
      e = (e + 1831565813) >>> 0;
      let o = e;
      return (
        (o = Math.imul(o ^ (o >>> 15), o | 1)),
        (o ^= o + Math.imul(o ^ (o >>> 7), o | 61)),
        ((o ^ (o >>> 14)) >>> 0) / 4294967296
      );
    };
  }
  function Mt(t, e, n) {
    return e + Math.floor(t() * (n - e + 1));
  }
  function Ct(t, e) {
    const n = Mt(t, 0, e.length - 1);
    return e[n];
  }
  function T(t, e, n) {
    let o = (t ^ Math.imul(e, 668265263) ^ Math.imul(n, 374761393)) >>> 0;
    return (
      (o = Math.imul(o ^ (o >>> 15), o | 1)),
      (o ^= o + Math.imul(o ^ (o >>> 7), o | 61)),
      ((o ^ (o >>> 14)) >>> 0) / 4294967296
    );
  }
  const F = 1e-4;
  function Dt(t, e, n) {
    let o = !1;
    const r = new Float32Array(n.length);
    for (let i = 0; i < n.length; i += 1) {
      const c = n[i] ?? 0;
      if (c === 0) {
        r[i] = 0;
        continue;
      }
      ((o = !0), (r[i] = c + (T(t, e, i) - 0.5) * F));
    }
    return o ? r : n;
  }
  function Nt(t, e) {
    for (let n = 0; n < e.length; n += 1) {
      const o = e[n];
      o !== void 0 &&
        Number.isFinite(o) &&
        o !== -1 / 0 &&
        (e[n] = o + (T(t, -1, n) - 0.5) * F);
    }
  }
  function Pt(t, e) {
    for (let n = 0; n < e.length; n += 1) {
      const o = e[n];
      o !== void 0 &&
        o !== 0 &&
        Number.isFinite(o) &&
        (e[n] = o + (T(t, -2, n) - 0.5) * F);
    }
  }
  function Z(t, e, n, o) {
    for (let r = 0; r < n.length; r += 1) {
      const i = n[r];
      i !== void 0 &&
        i !== o &&
        (n[r] = Math.min(255, Math.max(0, i + Math.floor(T(t, e, r) * 3) - 1)));
    }
  }
  const Rt = {
    getFloatFrequencyData: Nt,
    getFloatTimeDomainData: Pt,
    getByteFrequencyData: (t, e) => Z(t, -3, e, 0),
    getByteTimeDomainData: (t, e) => Z(t, -4, e, 128),
  };
  function At(t) {
    (xt(t), jt());
    for (const [e, n] of Object.entries(Rt)) kt(t, e, n);
  }
  function xt(t) {
    const e = globalThis.AudioBuffer?.prototype,
      n = e?.getChannelData;
    if (e === void 0 || typeof n != "function") return;
    const o = new WeakMap();
    B(
      e,
      "getChannelData",
      function (i) {
        const c = o.get(this) ?? new Map();
        o.set(this, c);
        const g = c.get(i);
        if (g !== void 0) return g;
        const u = Dt(t, i, n.call(this, i));
        return (c.set(i, u), u);
      },
      n,
    );
  }
  function jt() {
    const t = globalThis.AudioBuffer?.prototype,
      e = t?.copyFromChannel;
    if (t === void 0 || typeof e != "function") return;
    B(
      t,
      "copyFromChannel",
      function (o, r, i = 0) {
        const c = this.getChannelData(r);
        o.set(c.subarray(i, i + o.length));
      },
      e,
    );
  }
  function kt(t, e, n) {
    const o = globalThis.AnalyserNode?.prototype,
      r = o?.[e];
    if (o === void 0 || typeof r != "function") return;
    B(
      o,
      e,
      function (c) {
        (Reflect.apply(r, this, [c]), n(t, c));
      },
      r,
    );
  }
  function B(t, e, n, o) {
    Object.defineProperty(t, e, {
      value: d(n, o),
      configurable: !0,
      writable: !0,
      enumerable: !1,
    });
  }
  const Q = 3;
  function Et(t) {
    const e = CanvasRenderingContext2D.prototype.getImageData;
    (Lt(t), Ft(t, e), Bt(t, e), _t(t));
  }
  function _(t, e, n, o) {
    const { data: r, width: i, height: c } = e,
      g = (u, p, s, l) => {
        const f = (p * i + u) * 4,
          S = Math.floor(T(t, s, l) * 3) - 1,
          a = r[f];
        a !== void 0 && (r[f] = a + S);
      };
    for (let u = 0; u < c; u += 1) {
      const p = u + o;
      if (p % Q === 0)
        for (let s = 0; s < i; s += 1) {
          const l = s + n;
          l % Q === 0 && g(s, u, l, p);
        }
    }
    return e;
  }
  function It() {
    return [
      CanvasRenderingContext2D.prototype,
      globalThis.OffscreenCanvasRenderingContext2D?.prototype,
    ].filter((t) => t !== void 0);
  }
  function Lt(t) {
    for (const e of It()) {
      const n = e.getImageData;
      N(
        e,
        "getImageData",
        function (...r) {
          const [i, c] = r;
          return _(t, n.call(this, ...r), i, c);
        },
        n,
      );
    }
  }
  function tt(t, e, n) {
    if (t.width === 0 || t.height === 0) return null;
    const o = t.getContext("2d");
    if (!(o instanceof CanvasRenderingContext2D)) return null;
    const r = _(e, n.call(o, 0, 0, t.width, t.height), 0, 0),
      i = document.createElement("canvas");
    ((i.width = t.width), (i.height = t.height));
    const c = i.getContext("2d");
    return c === null ? null : (c.putImageData(r, 0, 0), i);
  }
  function Ft(t, e) {
    const n = HTMLCanvasElement.prototype.toDataURL,
      o = function (...r) {
        const i = tt(this, t, e);
        return n.apply(i ?? this, r);
      };
    N(HTMLCanvasElement.prototype, "toDataURL", o, n);
  }
  function Bt(t, e) {
    const n = HTMLCanvasElement.prototype.toBlob,
      o = function (...r) {
        const i = tt(this, t, e);
        n.apply(i ?? this, r);
      };
    N(HTMLCanvasElement.prototype, "toBlob", o, n);
  }
  function _t(t) {
    const e = globalThis.OffscreenCanvas?.prototype,
      n = e?.convertToBlob,
      o = globalThis.OffscreenCanvasRenderingContext2D?.prototype.getImageData;
    if (e === void 0 || typeof n != "function" || o === void 0) return;
    N(
      e,
      "convertToBlob",
      function (...i) {
        const c = Ut(this, t, o);
        return n.apply(c ?? this, i);
      },
      n,
    );
  }
  function Ut(t, e, n) {
    if (t.width === 0 || t.height === 0) return null;
    const o = t.getContext("2d");
    if (!(o instanceof OffscreenCanvasRenderingContext2D)) return null;
    const r = new OffscreenCanvas(t.width, t.height),
      i = r.getContext("2d");
    return i === null
      ? null
      : (i.putImageData(_(e, n.call(o, 0, 0, t.width, t.height), 0, 0), 0, 0),
        r);
  }
  function N(t, e, n, o) {
    Object.defineProperty(t, e, {
      value: d(n, o),
      configurable: !0,
      writable: !0,
      enumerable: !1,
    });
  }
  const et = 1 / 64;
  function U(t, e) {
    return {
      x: O(t, 0, e.x),
      y: O(t, 1, e.y),
      width: O(t, 2, e.width),
      height: O(t, 3, e.height),
    };
  }
  function Gt(t) {
    return !Number.isFinite(t) || Number.isInteger(t * 4);
  }
  function O(t, e, n) {
    if (Gt(n)) return n;
    const o = Math.round(n * 100);
    return n + (T(t, o, e) < 0.5 ? -et : et);
  }
  function Kt(t) {
    (Wt(t), $t(t));
  }
  function G(t) {
    return new DOMRect(t.x, t.y, t.width, t.height);
  }
  function nt() {
    return [Element.prototype, globalThis.Range?.prototype].filter(
      (t) => t !== void 0,
    );
  }
  function Wt(t) {
    for (const e of nt()) {
      const n = e.getBoundingClientRect;
      ot(
        e,
        "getBoundingClientRect",
        function () {
          return G(U(t, Reflect.apply(n, this, [])));
        },
        n,
      );
    }
  }
  function $t(t) {
    for (const e of nt()) {
      const n = e.getClientRects;
      ot(
        e,
        "getClientRects",
        function () {
          const r = Array.from(Reflect.apply(n, this, []), (i) => G(U(t, i)));
          return Object.assign(r, { item: (i) => r[i] ?? null });
        },
        n,
      );
    }
  }
  function ot(t, e, n, o) {
    Object.defineProperty(t, e, {
      value: d(n, o),
      configurable: !0,
      writable: !0,
      enumerable: !1,
    });
  }
  const zt = {
      width: 2,
      actualBoundingBoxLeft: 4,
      actualBoundingBoxRight: 5,
      actualBoundingBoxAscent: 6,
      actualBoundingBoxDescent: 7,
      fontBoundingBoxAscent: 8,
      fontBoundingBoxDescent: 9,
    },
    Ht = ["getComputedTextLength", "getSubStringLength"];
  function Yt(t) {
    (Jt(t), qt(t), Vt(t));
  }
  function Jt(t) {
    const e = globalThis.TextMetrics?.prototype;
    if (e !== void 0) for (const [n, o] of Object.entries(zt)) Xt(e, n, o, t);
  }
  function Xt(t, e, n, o) {
    const r = Object.getOwnPropertyDescriptor(t, e),
      i = r?.get;
    if (r === void 0 || i === void 0 || r.configurable === !1) return;
    Object.defineProperty(t, e, {
      get: d(function () {
        return O(o, n, Reflect.apply(i, this, []));
      }, i),
      configurable: !0,
      enumerable: r.enumerable ?? !0,
    });
  }
  function qt(t) {
    const e = globalThis.SVGTextContentElement?.prototype;
    for (const n of Ht) {
      const o = e?.[n];
      if (e === void 0 || typeof o != "function") continue;
      rt(
        e,
        n,
        function (...i) {
          return O(t, 2, Reflect.apply(o, this, i));
        },
        o,
      );
    }
  }
  function Vt(t) {
    const e = globalThis.SVGGraphicsElement?.prototype,
      n = e?.getBBox;
    if (e === void 0 || typeof n != "function") return;
    rt(
      e,
      "getBBox",
      function (...r) {
        return G(U(t, Reflect.apply(n, this, r)));
      },
      n,
    );
  }
  function rt(t, e, n, o) {
    Object.defineProperty(t, e, {
      value: d(n, o),
      configurable: !0,
      writable: !0,
      enumerable: !1,
    });
  }
  const Zt = [
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
  function it(t) {
    return t
      .toLowerCase()
      .replace(/["']/g, "")
      .replace(/[\s_-]+/g, "");
  }
  const Qt = new Set(Zt.map(it));
  function te(t) {
    return Qt.has(it(t));
  }
  const K = new Set();
  function ee() {
    (oe(), re(), ie(), ce(), ae(), fe());
  }
  function W(t) {
    const e = t
      .split(",")
      .map((n) => n.trim())
      .filter((n) => n === "" || !ne(n));
    return e.length > 0 ? e.join(", ") : "";
  }
  function ne(t) {
    const e = t.replace(/["']/g, "").trim();
    return te(e) && !K.has(e.toLowerCase());
  }
  function oe() {
    try {
      (document.fonts.forEach((t) =>
        K.add(t.family.replace(/["']/g, "").toLowerCase()),
      ),
        document.fonts.addEventListener("loadingdone", () => {
          document.fonts.forEach((t) =>
            K.add(t.family.replace(/["']/g, "").toLowerCase()),
          );
        }));
    } catch {}
  }
  function re() {
    const t = CSSStyleDeclaration.prototype,
      e = Object.getOwnPropertyDescriptor(t, "fontFamily");
    if (!e?.set || !e.get) return;
    const { get: n, set: o } = e,
      r = function (i) {
        o.call(this, W(String(i)));
      };
    Object.defineProperty(t, "fontFamily", {
      get: d(n, n),
      set: d(r, o),
      configurable: !0,
      enumerable: e.enumerable === !0,
    });
  }
  function ie() {
    const t = CSSStyleDeclaration.prototype,
      e = Object.getOwnPropertyDescriptor(t, "cssText");
    if (!e?.set || !e.get) return;
    const { get: n, set: o } = e,
      r = function (i) {
        o.call(this, ct(String(i)));
      };
    Object.defineProperty(t, "cssText", {
      get: d(n, n),
      set: d(r, o),
      configurable: !0,
      enumerable: e.enumerable === !0,
    });
  }
  function ct(t) {
    return t.replace(
      /font-family\s*:\s*([^;]+)/gi,
      (e, n) => `font-family: ${W(n)}`,
    );
  }
  function ce() {
    const t = Element.prototype.setAttribute,
      e = function (n, o) {
        const r = String(n).toLowerCase() === "style" ? ct(String(o)) : o;
        t.call(this, n, r);
      };
    Object.defineProperty(Element.prototype, "setAttribute", {
      value: d(e, t),
      configurable: !0,
      writable: !0,
      enumerable: !1,
    });
  }
  function ae() {
    const t = globalThis.CanvasRenderingContext2D?.prototype,
      e = t === void 0 ? void 0 : Object.getOwnPropertyDescriptor(t, "font");
    if (!t || !e?.set || !e.get) return;
    const { get: n, set: o } = e,
      r = function (i) {
        o.call(this, at(String(i)));
      };
    Object.defineProperty(t, "font", {
      get: d(n, n),
      set: d(r, o),
      configurable: !0,
      enumerable: e.enumerable === !0,
    });
  }
  const se =
      /^[\d.]+(px|pt|pc|em|rem|ex|ch|vw|vh|vmin|vmax|in|cm|mm|q|%)(\/.+)?$/i,
    ue = new Set([
      "xx-small",
      "x-small",
      "small",
      "medium",
      "large",
      "x-large",
      "xx-large",
      "xxx-large",
      "smaller",
      "larger",
    ]);
  function le(t) {
    return se.test(t) || ue.has(t.toLowerCase().split("/")[0] ?? "");
  }
  function at(t) {
    const e = t.trim().split(/\s+/),
      n = e.findLastIndex(le);
    if (n < 0 || n === e.length - 1) return t;
    const o = W(e.slice(n + 1).join(" "));
    return o === "" ? t : `${e.slice(0, n + 1).join(" ")} ${o}`;
  }
  function fe() {
    const t = document.fonts,
      e = t?.check;
    if (typeof e != "function") return;
    Object.defineProperty(t, "check", {
      value: d(function (o, r) {
        return at(o) === o ? e.call(this, o, r) : !1;
      }, e),
      configurable: !0,
      writable: !0,
      enumerable: !1,
    });
  }
  const st = 20,
    pe = 100,
    ge = 111320,
    ut = 150,
    de = 550;
  function he(t, e = Math.random) {
    const n = st + e() * (pe - st),
      o = n / ge;
    return {
      latitude: t.latitude + (e() - 0.5) * o,
      longitude: t.longitude + (e() - 0.5) * o,
      accuracy: n,
    };
  }
  function lt(t = Math.random) {
    return ut + t() * (de - ut);
  }
  function me(t) {
    const e = navigator.geolocation;
    if (e === void 0) return;
    const n = () => {
      const o = he(t);
      return {
        coords: {
          latitude: o.latitude,
          longitude: o.longitude,
          accuracy: o.accuracy,
          altitude: null,
          altitudeAccuracy: null,
          heading: null,
          speed: null,
          toJSON: () => ({}),
        },
        timestamp: Date.now(),
        toJSON: () => ({}),
      };
    };
    (M(e, "getCurrentPosition", (o) => {
      setTimeout(() => o(n()), lt());
    }),
      M(e, "watchPosition", (o) => (setTimeout(() => o(n()), lt()), 0)),
      M(e, "clearWatch", () => {}),
      ye());
  }
  function ye() {
    const t = navigator.permissions,
      e = t?.query;
    if (typeof e != "function") return;
    M(t, "query", async function (o) {
      const r = await e.call(this, o);
      return o?.name !== "geolocation"
        ? r
        : new Proxy(r, {
            get: (i, c, g) =>
              c === "state" ? "granted" : Reflect.get(i, c, g),
          });
    });
  }
  function be() {
    const t = globalThis.speechSynthesis,
      e = t?.getVoices;
    if (typeof e != "function") return;
    M(t, "getVoices", function () {
      return e.call(this).filter((o) => !/^fa\b/i.test(o.lang));
    });
  }
  const Se = [
    ["KeyQ", "q"],
    ["KeyW", "w"],
    ["KeyE", "e"],
    ["KeyR", "r"],
    ["KeyT", "t"],
    ["KeyY", "y"],
    ["KeyU", "u"],
    ["KeyI", "i"],
    ["KeyO", "o"],
    ["KeyP", "p"],
    ["KeyA", "a"],
    ["KeyS", "s"],
    ["KeyD", "d"],
    ["KeyF", "f"],
    ["KeyG", "g"],
    ["KeyH", "h"],
    ["KeyJ", "j"],
    ["KeyK", "k"],
    ["KeyL", "l"],
    ["KeyZ", "z"],
    ["KeyX", "x"],
    ["KeyC", "c"],
    ["KeyV", "v"],
    ["KeyB", "b"],
    ["KeyN", "n"],
    ["KeyM", "m"],
    ["Semicolon", ";"],
    ["Quote", "'"],
    ["Comma", ","],
    ["Period", "."],
    ["Slash", "/"],
    ["BracketLeft", "["],
    ["BracketRight", "]"],
    ["Backslash", "\\"],
    ["Backquote", "`"],
    ["Minus", "-"],
    ["Equal", "="],
  ];
  function ve() {
    const t = navigator.keyboard;
    if (t === void 0 || typeof t.getLayoutMap != "function") return;
    M(t, "getLayoutMap", function () {
      return Promise.resolve(new Map(Se));
    });
  }
  function we() {
    const t = globalThis.RTCPeerConnection;
    if (typeof t != "function") return;
    const e = function (n, ...o) {
      return new t({ ...n, iceTransportPolicy: "relay" }, ...o);
    };
    ((e.prototype = t.prototype),
      Object.defineProperty(globalThis, "RTCPeerConnection", {
        value: I(e, t),
        configurable: !0,
        writable: !0,
      }));
  }
  function M(t, e, n) {
    const o = t[e];
    typeof o == "function" &&
      Object.defineProperty(t, e, {
        value: d(n, o),
        configurable: !0,
        writable: !0,
        enumerable: !1,
      });
  }
  const Te = [
      "DateTimeFormat",
      "NumberFormat",
      "Collator",
      "PluralRules",
      "RelativeTimeFormat",
      "ListFormat",
      "DisplayNames",
      "Segmenter",
    ],
    Oe = ["toLocaleString", "toLocaleDateString", "toLocaleTimeString"];
  function Me(t) {
    (Ce(t), De(t), Re(t), Ae(t));
  }
  function Ce(t) {
    const e = Object.freeze([...t.languages]);
    (pt(Navigator.prototype, "language", () => t.locale),
      pt(Navigator.prototype, "languages", () => e));
  }
  function De(t) {
    for (const e of Te) {
      const n = Intl[e];
      typeof n == "function" && Ne(e, n, t);
    }
  }
  function Ne(t, e, n) {
    const o = function (r, i) {
      const c = r === void 0 ? n.locale : r;
      return new e(c, ft(t, i, n));
    };
    ((o.prototype = e.prototype),
      Pe(o, e),
      Object.defineProperty(Intl, t, {
        value: I(o, e),
        configurable: !0,
        writable: !0,
        enumerable: !1,
      }));
  }
  function ft(t, e, n) {
    if (t !== "DateTimeFormat") return e;
    const o = xe(e) ? e : {};
    return {
      calendar: "gregory",
      numberingSystem: "latn",
      timeZone: n.timeZone,
      ...o,
    };
  }
  function Pe(t, e) {
    for (const n of Object.getOwnPropertyNames(e)) {
      if (n === "prototype" || n === "name" || n === "length") continue;
      const o = Object.getOwnPropertyDescriptor(e, n);
      o && Object.defineProperty(t, n, o);
    }
  }
  function Re(t) {
    for (const e of Oe) P(Date.prototype, e, t, !0);
    (P(Number.prototype, "toLocaleString", t, !1),
      P(BigInt.prototype, "toLocaleString", t, !1),
      P(Array.prototype, "toLocaleString", t, !1));
  }
  function P(t, e, n, o) {
    const r = t[e];
    if (typeof r != "function") return;
    Object.defineProperty(t, e, {
      value: d(function (c, g) {
        const u = c === void 0 ? n.locale : c,
          p = o ? ft("DateTimeFormat", g, n) : g;
        return r.call(this, u, p);
      }, r),
      configurable: !0,
      writable: !0,
      enumerable: !1,
    });
  }
  function Ae(t) {
    const e = String.prototype.localeCompare,
      n = function (o, r, i) {
        return e.call(this, o, r === void 0 ? t.locale : r, i);
      };
    Object.defineProperty(String.prototype, "localeCompare", {
      value: d(n, e),
      configurable: !0,
      writable: !0,
      enumerable: !1,
    });
  }
  function pt(t, e, n) {
    const o = Object.getOwnPropertyDescriptor(t, e);
    if (o?.configurable === !1) return;
    const r = d(n, o?.get ?? (() => {}));
    Object.defineProperty(t, e, {
      get: r,
      configurable: !0,
      enumerable: o?.enumerable ?? !0,
    });
  }
  function xe(t) {
    return typeof t == "object" && t !== null;
  }
  const je = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 },
    gt = new Map();
  function ke(t) {
    const e = gt.get(t);
    if (e !== void 0) return e;
    const n = new Intl.DateTimeFormat("en-US", {
      timeZone: t,
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      weekday: "short",
      era: "short",
    });
    return (gt.set(t, n), n);
  }
  function R(t, e) {
    const n = {};
    for (const o of ke(t).formatToParts(new Date(e))) n[o.type] = o.value;
    return {
      year: Ee(n),
      month: C(n, "month", 1),
      day: C(n, "day", 1),
      hour: C(n, "hour", 0),
      minute: C(n, "minute", 0),
      second: C(n, "second", 0),
      weekday: je[n.weekday ?? "Sun"] ?? 0,
    };
  }
  function C(t, e, n) {
    const o = Number(t[e]);
    return Number.isFinite(o) ? o : n;
  }
  function Ee(t) {
    const e = C(t, "year", 0);
    return t.era === "BC" ? 1 - e : e;
  }
  function A(t, e) {
    const n = R(t, e),
      o = Date.UTC(n.year, n.month - 1, n.day, n.hour, n.minute, n.second);
    return Math.round((o - Math.floor(e / 1e3) * 1e3) / 6e4);
  }
  function Ie(t, e, n) {
    const o = Date.UTC(
        e.year,
        e.month - 1,
        e.day,
        e.hour,
        e.minute,
        e.second,
        n,
      ),
      r = o - A(t, o) * 6e4;
    return o - A(t, r) * 6e4;
  }
  function Le(t) {
    const e = t < 0 ? "-" : "+",
      n = Math.abs(t),
      o = String(Math.floor(n / 60)).padStart(2, "0"),
      r = String(n % 60).padStart(2, "0");
    return `${e}${o}${r}`;
  }
  function Fe(t, e) {
    return (
      new Intl.DateTimeFormat("en-US", { timeZone: t, timeZoneName: "long" })
        .formatToParts(new Date(e))
        .find((o) => o.type === "timeZoneName")?.value ?? t
    );
  }
  const Be = {
      getFullYear: (t) => t.year,
      getMonth: (t) => t.month - 1,
      getDate: (t) => t.day,
      getDay: (t) => t.weekday,
      getHours: (t) => t.hour,
      getMinutes: (t) => t.minute,
      getSeconds: (t) => t.second,
      getMilliseconds: (t, e) => e.getUTCMilliseconds(),
      getYear: (t) => t.year - 1900,
    },
    _e = {
      setFullYear: ["year", "month", "day"],
      setMonth: ["month", "day"],
      setDate: ["day"],
      setHours: ["hour", "minute", "second"],
      setMinutes: ["minute", "second"],
      setSeconds: ["second"],
    };
  function Ue(t) {
    const e = Date.prototype;
    (Ge(e, t), Ke(e, t), We(e, t), Ye(e, t));
  }
  function Ge(t, e) {
    const n = t.getTimezoneOffset;
    x(t, "getTimezoneOffset", n, function () {
      const o = this.getTime();
      return Number.isNaN(o) ? Number.NaN : -A(e, o);
    });
  }
  function Ke(t, e) {
    for (const [n, o] of Object.entries(Be)) {
      const r = t[n];
      typeof r == "function" &&
        x(t, n, r, function () {
          const i = this.getTime();
          return Number.isNaN(i) ? Number.NaN : o(R(e, i), this);
        });
    }
  }
  function We(t, e) {
    for (const [n, o] of Object.entries(_e)) {
      const r = t[n];
      typeof r == "function" &&
        x(t, n, r, function (...i) {
          const c = this.getTime();
          if (Number.isNaN(c)) return Number.NaN;
          const g = { ...R(e, c) };
          return (
            $e(g, o, i),
            this.setTime(Ie(e, g, this.getUTCMilliseconds()))
          );
        });
    }
  }
  function $e(t, e, n) {
    e.forEach((o, r) => {
      const i = n[r];
      i !== void 0 && Object.assign(t, { [o]: o === "month" ? i + 1 : i });
    });
  }
  const ze = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    He = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  function Ye(t, e) {
    const n = {
      toString: (o, r) => `${dt(o)} ${ht(o, e, r)}`,
      toDateString: (o) => dt(o),
      toTimeString: (o, r) => ht(o, e, r),
    };
    for (const [o, r] of Object.entries(n)) {
      const i = t[o];
      typeof i == "function" &&
        x(t, o, i, function () {
          const c = this.getTime();
          return Number.isNaN(c) ? "Invalid Date" : r(R(e, c), c);
        });
    }
  }
  function dt(t) {
    const e = String(t.day).padStart(2, "0"),
      n = String(t.year).padStart(4, "0");
    return `${He[t.weekday]} ${ze[t.month - 1]} ${e} ${n}`;
  }
  function ht(t, e, n) {
    const o = [t.hour, t.minute, t.second]
        .map((i) => String(i).padStart(2, "0"))
        .join(":"),
      r = Le(A(e, n));
    return `${o} GMT${r} (${Fe(e, n)})`;
  }
  function x(t, e, n, o) {
    Object.defineProperty(t, e, {
      value: d(o, n),
      configurable: !0,
      writable: !0,
      enumerable: !1,
    });
  }
  const mt = [1440, 900],
    $ = [1470, 956],
    z = [1710, 1107],
    v = [1512, 982],
    w = [1728, 1117],
    H = [2240, 1260],
    yt = [
      {
        platform: "mac",
        token: /Apple M\d+(?: (?:Pro|Max|Ultra))?/,
        models: [
          { name: "Apple M1", cores: [8], screens: [mt, H] },
          { name: "Apple M1 Pro", cores: [8, 10], screens: [v] },
          { name: "Apple M1 Pro", cores: [10], screens: [w] },
          { name: "Apple M1 Max", cores: [10], screens: [v, w] },
          { name: "Apple M2", cores: [8], screens: [mt, $, z] },
          { name: "Apple M2 Pro", cores: [10, 12], screens: [v] },
          { name: "Apple M2 Pro", cores: [12], screens: [w] },
          { name: "Apple M2 Max", cores: [12], screens: [v, w] },
          { name: "Apple M3", cores: [8], screens: [$, z, v, H] },
          { name: "Apple M3 Pro", cores: [11, 12], screens: [v] },
          { name: "Apple M3 Pro", cores: [12], screens: [w] },
          { name: "Apple M3 Max", cores: [14, 16], screens: [v, w] },
          { name: "Apple M4", cores: [10], screens: [$, z, v, H] },
          { name: "Apple M4 Pro", cores: [12, 14], screens: [v] },
          { name: "Apple M4 Pro", cores: [14], screens: [w] },
          { name: "Apple M4 Max", cores: [14, 16], screens: [v] },
          { name: "Apple M4 Max", cores: [16], screens: [w] },
        ],
      },
    ];
  function Je(t) {
    return /win/i.test(t) ? "windows" : /mac/i.test(t) ? "mac" : "linux";
  }
  function Y(t) {
    return {
      platform: Je(navigator.platform),
      cores: navigator.hardwareConcurrency,
      screen: [globalThis.screen.width, globalThis.screen.height],
      seed: t,
    };
  }
  function Xe(t, e) {
    return (t[0] === e[0] && t[1] === e[1]) || (t[0] === e[1] && t[1] === e[0]);
  }
  function qe(t, e) {
    return t.cores.includes(e.cores) && t.screens.some((n) => Xe(n, e.screen));
  }
  function Ve(t, e) {
    return [...new Set(t.models.filter((n) => qe(n, e)).map((n) => n.name))];
  }
  function Ze(t, e, n) {
    const o = e?.token.exec(t)?.[0],
      r = e === void 0 ? [] : Ve(e, n);
    return o !== void 0 && r.length >= 2 && r.includes(o)
      ? Ct(Ot(n.seed), r)
      : null;
  }
  function J(t, e, n = yt) {
    const o = n.find((i) => i.platform === e.platform && i.token.test(t)),
      r = Ze(t, o, e);
    return o === void 0 || r === null ? t : t.replace(o.token, r);
  }
  function Qe(t) {
    return {
      seed: t.seed,
      screen: t.screen,
      families: yt.map(({ platform: e, token: n, models: o }) => ({
        platform: e,
        token: { source: n.source, flags: n.flags },
        models: o,
      })),
    };
  }
  const tn = 37446;
  function en(t) {
    const e = Y(t);
    (bt(globalThis.WebGLRenderingContext?.prototype, (n) => J(n, e)),
      bt(globalThis.WebGL2RenderingContext?.prototype, (n) => J(n, e)));
  }
  function bt(t, e) {
    const n = t?.getParameter;
    if (t === void 0 || typeof n != "function") return;
    const o = new Map();
    Object.defineProperty(t, "getParameter", {
      value: d(function (i) {
        const c = n.call(this, i);
        if (i !== tn || typeof c != "string") return c;
        const g = o.get(c);
        if (g !== void 0) return g;
        const u = e(c);
        return (o.set(c, u), u);
      }, n),
      configurable: !0,
      writable: !0,
      enumerable: !1,
    });
  }
  const nn = ["device", "description"];
  function on(t) {
    const e = globalThis.GPUAdapterInfo?.prototype;
    if (e === void 0) return;
    const n = Y(t);
    for (const o of nn) rn(e, o, (r) => J(r, n));
  }
  function rn(t, e, n) {
    const o = Object.getOwnPropertyDescriptor(t, e),
      r = o?.get;
    if (o === void 0 || r === void 0 || o.configurable === !1) return;
    Object.defineProperty(t, e, {
      get: d(function () {
        const c = Reflect.apply(r, this, []);
        return typeof c == "string" && c !== "" ? n(c) : c;
      }, r),
      configurable: !0,
      enumerable: o.enumerable ?? !0,
    });
  }
  function cn(t) {
    (St("Worker", t), St("SharedWorker", t));
  }
  function St(t, e) {
    const n = globalThis[t];
    if (typeof n != "function") return;
    const o = function (r, i) {
      const c = an(r, i, e),
        g = n;
      return c === null ? new g(r, i) : new g(c, i);
    };
    ((o.prototype = n.prototype),
      Object.defineProperty(globalThis, t, {
        value: I(o, n),
        configurable: !0,
        writable: !0,
      }));
  }
  function an(t, e, n) {
    if (e?.type === "module") return null;
    const o = ln(t);
    if (o === null || !fn(o)) return null;
    const r = pn(o);
    if (r === null) return null;
    try {
      return URL.createObjectURL(
        new Blob([sn(n), r], { type: "text/javascript" }),
      );
    } catch {
      return null;
    }
  }
  function sn(t) {
    const { gpu: e, canvas: n, ...o } = t,
      r = (c, g) => `(${String(c)})(${JSON.stringify(g)}, register);
`;
    return `;((register) => {
${[r(gn, o), e === void 0 ? "" : r(dn, e), n === void 0 ? "" : r(hn, n)].join("")}})((${String(un)})());
`;
  }
  function un() {
    const t = new WeakMap(),
      e = Function.prototype.toString,
      n = function () {
        return (
          (typeof this == "function" ? t.get(this) : void 0) ?? e.call(this)
        );
      };
    (t.set(n, e.call(e)),
      Object.defineProperty(Function.prototype, "toString", {
        value: n,
        configurable: !0,
        writable: !0,
      }));
    const o = (r, i, c) => {
      const g = Reflect.get(c, i);
      Object.defineProperty(r, i, {
        value: g,
        configurable: !0,
        writable: !1,
        enumerable: !1,
      });
    };
    return (r, i) => (
      o(r, "name", i),
      o(r, "length", i),
      t.set(r, e.call(i)),
      r
    );
  }
  function ln(t) {
    try {
      return new URL(String(t), location.href).href;
    } catch {
      return null;
    }
  }
  function fn(t) {
    try {
      const e = new URL(t);
      return (
        e.origin === location.origin ||
        e.protocol === "blob:" ||
        e.protocol === "data:"
      );
    } catch {
      return !1;
    }
  }
  function pn(t) {
    try {
      const e = new XMLHttpRequest();
      return (
        e.open("GET", t, !1),
        e.send(),
        e.status >= 200 && e.status < 300 ? e.responseText : null
      );
    } catch {
      return null;
    }
  }
  function gn(t, e) {
    const n = (u) => {
        const p = new Intl.DateTimeFormat("en-US", {
            timeZone: t.timeZone,
            hourCycle: "h23",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
          s = {};
        for (const l of p.formatToParts(new Date(u)))
          s[l.type] = Number(l.value);
        return s;
      },
      o = (u) => {
        const p = n(u),
          s = Date.UTC(
            p.year ?? 1970,
            (p.month ?? 1) - 1,
            p.day ?? 1,
            p.hour ?? 0,
            p.minute ?? 0,
            p.second ?? 0,
          );
        return Math.round((s - Math.floor(u / 1e3) * 1e3) / 6e4);
      },
      r = Date.prototype.getTimezoneOffset;
    Date.prototype.getTimezoneOffset = e(function () {
      const u = this.getTime();
      return Number.isNaN(u) ? Number.NaN : -o(u);
    }, r);
    const i = {
      getFullYear: "year",
      getMonth: "month",
      getDate: "day",
      getHours: "hour",
      getMinutes: "minute",
      getSeconds: "second",
    };
    for (const [u, p] of Object.entries(i)) {
      const s = Date.prototype[u];
      Object.defineProperty(Date.prototype, u, {
        value: e(function () {
          const l = this.getTime();
          if (Number.isNaN(l)) return Number.NaN;
          const f = n(l)[p] ?? 0;
          return p === "month" ? f - 1 : f;
        }, s),
        configurable: !0,
        writable: !0,
      });
    }
    const c = [
      "DateTimeFormat",
      "NumberFormat",
      "Collator",
      "PluralRules",
      "RelativeTimeFormat",
    ];
    for (const u of c) {
      const p = Intl[u];
      if (typeof p != "function") continue;
      const s = p,
        l = function (f, S) {
          const a = f === void 0 ? t.locale : f,
            h =
              u === "DateTimeFormat"
                ? {
                    calendar: "gregory",
                    numberingSystem: "latn",
                    timeZone: t.timeZone,
                    ...S,
                  }
                : S;
          return new s(a, h);
        };
      ((l.prototype = s.prototype),
        Object.defineProperty(Intl, u, {
          value: e(l, s),
          configurable: !0,
          writable: !0,
        }));
    }
    (() => {
      const u = Object.getPrototypeOf(navigator) ?? navigator,
        p = { language: t.locale, languages: Object.freeze([...t.languages]) };
      for (const s of Object.keys(p)) {
        const l = Object.getOwnPropertyDescriptor(u, s),
          f = () => p[s];
        Object.defineProperty(l === void 0 ? navigator : u, s, {
          get: l?.get === void 0 ? f : e(f, l.get),
          configurable: !0,
          enumerable: l?.enumerable ?? !0,
        });
      }
    })();
  }
  function dn(t, e) {
    const n = () => {
        let a = ((t.seed >>> 0) + 1831565813) >>> 0;
        return (
          (a = Math.imul(a ^ (a >>> 15), a | 1)),
          (a ^= a + Math.imul(a ^ (a >>> 7), a | 61)),
          ((a ^ (a >>> 14)) >>> 0) / 4294967296
        );
      },
      r =
        [
          [/win/i, "windows"],
          [/mac/i, "mac"],
        ].find(([a]) => a.test(navigator.platform))?.[1] ?? "linux",
      i = navigator.hardwareConcurrency,
      c = (a) => new RegExp(a.token.source, a.token.flags),
      g = (a) =>
        (a[0] === t.screen[0] && a[1] === t.screen[1]) ||
        (a[0] === t.screen[1] && a[1] === t.screen[0]),
      u = (a) => {
        const h = t.families.find((m) => m.platform === r && c(m).test(a));
        if (h === void 0) return a;
        const y = c(h).exec(a)?.[0],
          b = [
            ...new Set(
              h.models
                .filter((m) => m.cores.includes(i) && m.screens.some(g))
                .map((m) => m.name),
            ),
          ];
        return y === void 0 || b.length < 2 || !b.includes(y)
          ? a
          : a.replace(c(h), b[Math.floor(n() * b.length)] ?? y);
      },
      p = new Map(),
      s = (a) => {
        const h = p.get(a) ?? u(a);
        return (p.set(a, h), h);
      },
      l = globalThis,
      f = (a) => {
        const h = l[a]?.prototype,
          y = h?.getParameter;
        h === void 0 ||
          typeof y != "function" ||
          Object.defineProperty(h, "getParameter", {
            value: e(function (m) {
              const X = y.call(this, m);
              return m === 37446 && typeof X == "string" ? s(X) : X;
            }, y),
            configurable: !0,
            writable: !0,
          });
      },
      S = (a) => {
        const h = l.GPUAdapterInfo?.prototype,
          y = h === void 0 ? void 0 : Object.getOwnPropertyDescriptor(h, a),
          b = y?.get;
        h === void 0 ||
          b === void 0 ||
          Object.defineProperty(h, a, {
            get: e(function () {
              const m = b.call(this);
              return typeof m == "string" && m !== "" ? s(m) : m;
            }, b),
            configurable: !0,
            enumerable: y?.enumerable ?? !0,
          });
      };
    (["WebGLRenderingContext", "WebGL2RenderingContext"].forEach(f),
      ["device", "description"].forEach(S));
  }
  function hn(t, e) {
    const n = (s, l) => {
        let f = (t ^ Math.imul(s, 668265263) ^ Math.imul(l, 374761393)) >>> 0;
        return (
          (f = Math.imul(f ^ (f >>> 15), f | 1)),
          (f ^= f + Math.imul(f ^ (f >>> 7), f | 61)),
          ((f ^ (f >>> 14)) >>> 0) / 4294967296
        );
      },
      o = (s, l, f) => {
        const { data: S, width: a, height: h } = s;
        for (let y = 0; y < h; y += 1)
          if ((y + f) % 3 === 0) {
            for (let b = 0; b < a; b += 1)
              if ((b + l) % 3 === 0) {
                const m = (y * a + b) * 4;
                S[m] = (S[m] ?? 0) + Math.floor(n(b + l, y + f) * 3) - 1;
              }
          }
        return s;
      },
      r = globalThis,
      i = r.OffscreenCanvasRenderingContext2D?.prototype,
      c = i?.getImageData,
      g = () => {
        i === void 0 ||
          c === void 0 ||
          Object.defineProperty(i, "getImageData", {
            value: e(function (...l) {
              return o(c.apply(this, l), l[0] ?? 0, l[1] ?? 0);
            }, c),
            configurable: !0,
            writable: !0,
          });
      },
      u = (s) => {
        const l = r.OffscreenCanvasRenderingContext2D,
          f = r.OffscreenCanvas,
          S = s.width > 0 && s.height > 0 ? s.getContext("2d") : null;
        if (c === void 0 || !(S instanceof l)) return null;
        const a = new f(s.width, s.height),
          h = a.getContext("2d");
        return (
          h?.putImageData(o(c.call(S, 0, 0, s.width, s.height), 0, 0), 0, 0),
          h === null ? null : a
        );
      },
      p = () => {
        const s = r.OffscreenCanvas?.prototype,
          l = s?.convertToBlob;
        s === void 0 ||
          l === void 0 ||
          Object.defineProperty(s, "convertToBlob", {
            value: e(function (...S) {
              return l.apply(u(this) ?? this, S);
            }, l),
            configurable: !0,
            writable: !0,
          });
      };
    (g(), p());
  }
  const mn = new Set([
    "co.uk",
    "org.uk",
    "me.uk",
    "ac.uk",
    "gov.uk",
    "co.jp",
    "ne.jp",
    "or.jp",
    "co.kr",
    "co.nz",
    "co.za",
    "co.in",
    "com.au",
    "net.au",
    "org.au",
    "com.br",
    "com.tr",
    "com.sg",
    "com.mx",
    "com.hk",
    "com.tw",
  ]);
  function yn(t) {
    const e = t
      .toLowerCase()
      .split(".")
      .filter((r) => r !== "");
    if (e.length <= 2) return e.join(".");
    const n = e.slice(-2).join("."),
      o = e.slice(-3).join(".");
    return mn.has(n) ? o : n;
  }
  function bn(t) {
    let e = 2166136261;
    for (let n = 0; n < t.length; n += 1)
      ((e ^= t.charCodeAt(n)), (e = Math.imul(e, 16777619)));
    return e >>> 0;
  }
  function Sn(t, e) {
    const n = bn(yn(e));
    let o = (t ^ Math.imul(n, 668265263)) >>> 0;
    return (
      (o = Math.imul(o ^ (o >>> 15), o | 1)),
      (o ^= o + Math.imul(o ^ (o >>> 7), o | 61)),
      (o ^ (o >>> 14)) >>> 0
    );
  }
  const vn = {
    timezone: (t) => Ue(t.profile.timeZone),
    locale: (t) =>
      Me({
        locale: t.profile.locale,
        languages: t.profile.languages,
        timeZone: t.profile.timeZone,
      }),
    geolocation: (t) => me(t.profile.coordinates),
    fonts: () => ee(),
    webrtc: () => we(),
    voices: () => be(),
    keyboard: () => ve(),
    workers: (t, e) =>
      cn({
        timeZone: t.profile.timeZone,
        locale: t.profile.locale,
        languages: t.profile.languages,
        ...(t.shields.webgl ? { gpu: Qe(Y(e)) } : {}),
        ...(t.shields.canvas ? { canvas: e } : {}),
      }),
    canvas: (t, e) => Et(e),
    webgl: (t, e) => {
      (en(e), on(e));
    },
    audio: (t, e) => At(e),
    clientRects: (t, e) => {
      (Kt(e), Yt(e));
    },
  };
  function wn(t) {
    Tt({ strict: t.stealth });
    const e = Sn(t.noiseBase, location.hostname),
      n = [],
      failed = [];
    for (const [o, r] of Object.entries(vn))
      if (t.shields[o])
        try {
          (r(t, e), n.push(o));
        } catch (error) {
          failed.push(o);
        }
    Object.defineProperty(globalThis, Symbol.for("raptorshield.shields"), {
      value: {
        installed: n,
        failed,
        signature: JSON.stringify({
          profile: t.profile,
          shields: t.shields,
          stealth: t.stealth,
          flowUnlockEnabled: t.flowUnlockEnabled,
        }),
      },
      configurable: true,
    });
    return n;
  }
  function Tn(t, e) {
    return Object.freeze(t.filter((n) => n.name !== e));
  }
  function On(t, e) {
    if (typeof t != "object" || t === null) return t;
    const n = t.serverTiming;
    return Array.isArray(n)
      ? { ...t, serverTiming: n.filter((o) => o?.name !== e) }
      : t;
  }
  function Mn(t, e) {
    for (let n = t; n !== null; n = Object.getPrototypeOf(n))
      if (Object.prototype.hasOwnProperty.call(n, e)) return n;
    return null;
  }
  function Cn(t) {
    const e = globalThis.PerformanceNavigationTiming?.prototype;
    e !== void 0 && (Dn(e, t), Nn(e, t));
  }
  function Dn(t, e) {
    const n = Mn(t, "serverTiming"),
      o =
        n === null
          ? void 0
          : Object.getOwnPropertyDescriptor(n, "serverTiming"),
      r = o?.get;
    if (n === null || o === void 0 || r === void 0) return;
    Object.defineProperty(n, "serverTiming", {
      get: d(function () {
        return Tn(Reflect.apply(r, this, []), e);
      }, r),
      enumerable: o.enumerable ?? !0,
      configurable: !0,
    });
  }
  function Nn(t, e) {
    for (let n = t; n !== null; n = Object.getPrototypeOf(n)) {
      const o = Object.getOwnPropertyDescriptor(n, "toJSON"),
        r = o?.value;
      if (o === void 0 || typeof r != "function") continue;
      Object.defineProperty(n, "toJSON", {
        ...o,
        value: d(function () {
          return On(Reflect.apply(r, this, []), e);
        }, r),
      });
    }
  }
  const Pn = [
      "challenges.cloudflare.com",
      "hcaptcha.com",
      "recaptcha.net",
      "arkoselabs.com",
      "funcaptcha.com",
      "geetest.com",
      "captcha-delivery.com",
    ],
    Rn = [["www.google.com", "/recaptcha/"]];
  function An(t, e) {
    return t === e || t.endsWith(`.${e}`);
  }
  function xn(t) {
    let e;
    try {
      e = new URL(t);
    } catch {
      return !1;
    }
    const n = e.hostname.toLowerCase();
    return (
      Pn.some((o) => An(n, o)) ||
      Rn.some(([o, r]) => n === o && e.pathname.startsWith(r))
    );
  }
  const jn = [
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
  function kn(t) {
    try {
      const e = JSON.parse(Fn(t.replace(/_/g, "=")));
      return En(e) ? e : null;
    } catch {
      return null;
    }
  }
  function En(t) {
    if (!j(t) || !j(t.profile) || !j(t.shields)) return !1;
    const e = t.shields;
    return (
      Ln(t.profile) &&
      jn.every((n) => typeof e[n] == "boolean") &&
      typeof t.noiseBase == "number" &&
      Number.isFinite(t.noiseBase) &&
      In(t)
    );
  }
  function In(t) {
    return (
      typeof t.flowUnlockEnabled == "boolean" && typeof t.stealth == "boolean"
    );
  }
  function Ln(t) {
    const e = ["country", "timeZone", "locale", "acceptLanguage"],
      n = t.coordinates;
    return (
      e.every((o) => typeof t[o] == "string") &&
      Array.isArray(t.languages) &&
      t.languages.every((o) => typeof o == "string") &&
      j(n) &&
      typeof n.latitude == "number" &&
      typeof n.longitude == "number"
    );
  }
  function j(t) {
    return typeof t == "object" && t !== null && !Array.isArray(t);
  }
  function Fn(t) {
    const e = atob(t);
    return new TextDecoder().decode(Uint8Array.from(e, (n) => n.charCodeAt(0)));
  }
  function Bn() {
    const t = location.hostname.toLowerCase();
    return t === "ir" || t.endsWith(".ir");
  }
  function _n() {
    for (const t of performance.getEntriesByType("navigation")) {
      const e = t.serverTiming ?? [];
      for (const n of e) if (n.name === "fx5b78a745") return kn(n.description);
    }
    return null;
  }
  function Un() {
    if (xn(location.href)) return;
    const t = _n();
    t !== null && (wn(t), t.stealth && Cn("fx5b78a745"));
  }
  Un();
})();
