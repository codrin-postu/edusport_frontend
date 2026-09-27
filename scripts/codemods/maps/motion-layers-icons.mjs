const T = "(^|[\\s\"'`:])";
const E = "(?=[\\s\"'`]|$)";
const dur = (ms) => (ms <= 200 ? "fast" : ms <= 300 ? "base" : ms <= 500 ? "slow" : "long");
const Z = { 0: "z-base", 1: "z-raised", 2: "z-raised", 4: "z-raised", 5: "z-raised", 6: "z-raised", 10: "z-raised", 20: "z-raised", 30: "z-raised", 50: "z-sticky", 90: "z-sticky", 100: "z-header", 200: "z-dialog", 900: "z-popup", 998: "z-menu", 999: "z-menu" };

export default {
  rules: [
    { match: new RegExp(`${T}duration-(\\d+)${E}`, "g"), replace: ([s, ms]) => `${s}duration-${dur(Number(ms))}` },
    { match: new RegExp(`${T}ease-\\[cubic-bezier\\([^\\]]+\\)\\]${E}`, "g"), replace: ([s]) => `${s}ease-standard` },
    { match: new RegExp(`${T}(-?)z-(?:\\[(\\d+)\\]|(\\d+))${E}`, "g"), replace: ([s, neg, a, b]) => { const v = Number(a ?? b); return neg ? null : Z[v] ? `${s}${Z[v]}` : null; } },
    { match: new RegExp(`${T}(size|w|h)-(3|3\\.5|\\[1[4-8]px\\])${E}`, "g"), replace: () => null },
  ],
};
