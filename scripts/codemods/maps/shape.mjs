const T = "(^|[\\s\"'`:])";
const E = "(?=[\\s\"'`]|$)";
const NAVY = "(?:rgb\\(14_26_60_\\/_0?\\.(\\d+)\\)|rgba\\(14,26,60,0?\\.(\\d+)\\))";

export default {
  rules: [
    { match: new RegExp(`${T}border(-[trblxy])?-\\[1\\.5px\\]${E}`, "g"), replace: "$1border$2-retro" },
    { match: new RegExp(`${T}shadow-\\[(\\d)px_(\\d)px_0_${NAVY}\\]${E}`, "g"), replace: ([s, x, y]) => (x === y && (x === "4" || x === "6" || x === "8") ? `${s}${x === "4" ? "shadow-retro-sm" : "shadow-retro"}` : null) },
    { match: new RegExp(`${T}shadow-\\[[^\\]]+\\]${E}`, "g"), replace: () => null },
    { match: new RegExp(`${T}rounded(?:-[trbl]{1,2})?(?:-(?:sm|md|lg|xl|2xl|3xl|\\[[^\\]]+\\]))?${E}`, "g"), replace: "$1rounded-none" },
  ],
  skip: ["src/components/ui/SlidingPillToggle.tsx"],
};
