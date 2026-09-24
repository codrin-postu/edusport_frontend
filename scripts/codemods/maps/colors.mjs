const T = "(^|[\\s\"'`:])";
const E = "(?=[\\s\"'`]|$)";
const A = "(\\d+|\\[0?\\.\\d+\\])"; // opacity: 50 or [0.72]
const pct = (a) => (a.startsWith("[") ? Math.round(parseFloat(a.slice(1, -1)) * 100) : Number(a));

const LIGHT_INK = "navy|ink";
const DARK_INK = "retro-cream|white|cream";

export default {
  rules: [
    // text on light: /80 and up primary, /40 to /79 secondary, below 40 flagged (decorative)
    { match: new RegExp(`${T}text-(${LIGHT_INK})${E}`, "g"), replace: "$1text-primary" },
    { match: new RegExp(`${T}text-(?:${LIGHT_INK})\\/${A}${E}`, "g"), replace: ([s, a]) => { const p = pct(a); return p >= 80 ? `${s}text-primary` : p >= 40 ? `${s}text-secondary` : null; } },
    { match: new RegExp(`${T}placeholder:text-(?:${LIGHT_INK})\\/${A}${E}`, "g"), replace: ([s]) => `${s}placeholder:text-muted` },
    { match: new RegExp(`${T}text-gray-(900|800)${E}`, "g"), replace: "$1text-primary" },
    { match: new RegExp(`${T}text-gray-(700|600|500)${E}`, "g"), replace: "$1text-secondary" },
    { match: new RegExp(`${T}text-gray-(400|300)${E}`, "g"), replace: () => null },
    { match: new RegExp(`${T}text-rust${E}`, "g"), replace: "$1text-accent" },

    // text on dark
    { match: new RegExp(`${T}text-(${DARK_INK})${E}`, "g"), replace: "$1text-primary-on-dark" },
    { match: new RegExp(`${T}text-(?:${DARK_INK})\\/${A}${E}`, "g"), replace: ([s, a]) => { const p = pct(a); return p >= 80 ? `${s}text-primary-on-dark` : p >= 45 ? `${s}text-secondary-on-dark` : null; } },
    { match: new RegExp(`${T}placeholder:text-(?:${DARK_INK})\\/${A}${E}`, "g"), replace: ([s]) => `${s}placeholder:text-muted-on-dark` },

    // hover tints become the hover layer
    { match: new RegExp(`${T}hover:bg-navy\\/${A}${E}`, "g"), replace: ([s, a]) => (pct(a) <= 10 ? `${s}hover-layer` : null) },
    { match: new RegExp(`${T}hover:bg-(?:white|retro-cream)\\/${A}${E}`, "g"), replace: ([s, a]) => (pct(a) <= 20 ? `${s}hover-layer-on-dark` : null) },

    // backgrounds
    { match: new RegExp(`${T}bg-retro-cream${E}`, "g"), replace: "$1bg-surface" },
    { match: new RegExp(`${T}bg-white${E}`, "g"), replace: "$1bg-surface-raised" },
    { match: new RegExp(`${T}bg-navy${E}`, "g"), replace: "$1bg-surface-dark" },
    { match: new RegExp(`${T}bg-navy\\/${A}${E}`, "g"), replace: ([s, a]) => { const p = pct(a); return p <= 10 ? `${s}bg-surface-subtle` : p >= 45 && p <= 60 ? `${s}bg-overlay` : null; } },
    { match: new RegExp(`${T}bg-gray-(50|100|200)${E}`, "g"), replace: "$1bg-surface-subtle" },
    { match: new RegExp(`${T}bg-(?:white|retro-cream)\\/${A}${E}`, "g"), replace: ([s, a]) => (pct(a) <= 20 ? `${s}bg-surface-subtle-on-dark` : null) },

    // lines
    { match: new RegExp(`${T}(border|divide)(-[trblxy])?-navy${E}`, "g"), replace: "$1$2$3-line" },
    { match: new RegExp(`${T}(border|divide)(-[trblxy])?-navy\\/${A}${E}`, "g"), replace: ([s, k, side = ""]) => `${s}${k}${side}-line-subtle` },
    { match: new RegExp(`${T}(border|divide)(-[trblxy])?-(?:retro-cream|white)${E}`, "g"), replace: "$1$2$3-line-on-dark" },
    { match: new RegExp(`${T}(border|divide)(-[trblxy])?-(?:retro-cream|white)\\/${A}${E}`, "g"), replace: ([s, k, side = "", a]) => `${s}${k}${side}-${pct(a) <= 25 ? "line-subtle-on-dark" : "line-on-dark"}` },
    { match: new RegExp(`${T}(border|divide)(-[trblxy])?-gray-(100|200|300)${E}`, "g"), replace: "$1$2$3-line-subtle" },
  ],
};
