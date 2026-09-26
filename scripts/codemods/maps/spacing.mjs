// Nearest step on the 4px scale; ties go up. Pixel values in, Tailwind steps out.
const T = "(^|[\\s\"'`:])";
const E = "(?=[\\s\"'`]|$)";
const PROP = "(-?)(p[trblxy]?|m[trblxy]?|gap(?:-[xy])?|space-[xy])";
const SCALE = [0, 4, 8, 12, 16, 24, 32, 48, 64, 96];
const STEP = { 0: "0", 4: "1", 8: "2", 12: "3", 16: "4", 24: "6", 32: "8", 48: "12", 64: "16", 96: "24" };

export function snap(pxValue) {
  let best = SCALE[0];
  for (const s of SCALE) {
    const d = Math.abs(s - pxValue);
    const bd = Math.abs(best - pxValue);
    if (d < bd || (d === bd && s > best)) best = s;
  }
  return STEP[best];
}

const fromStep = (v) => Number(v) * 4;

export default {
  rules: [
    { match: new RegExp(`${T}${PROP}-(1\\.5|2\\.5|3\\.5|5|7|9|10|11|14|20|28|40|56)${E}`, "g"), replace: ([s, neg, prop, v]) => `${s}${neg}${prop}-${snap(fromStep(v))}` },
    { match: new RegExp(`${T}${PROP}-\\[(\\d+(?:\\.\\d+)?)px\\]${E}`, "g"), replace: ([s, neg, prop, v]) => `${s}${neg}${prop}-${snap(Number(v))}` },
  ],
  skip: ["src/components/ui/badge.tsx"],
};
