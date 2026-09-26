// Picks a role from the size class, using font-display on the same element
// to tell headings from text, then strips the classes the role now owns.
const SIZE = /(^|\s)(?:(?:sm|md|lg|xl):)?text-(3xs|2xs|xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|eyebrow|label|display-(?:sm|md|lg|xl)|\[\d+(?:\.\d+)?px\])(?=\s|$)/g;
const OWNED = /(^|\s)(?:(?:sm|md|lg|xl):)?(?:font-(?:display|light|normal|medium|semibold|bold|extrabold|black)|leading-\S+|tracking-\S+)(?=\s|$)/g;

const px = (t) => ({ "3xs": 10, "2xs": 11, xs: 12, sm: 14, base: 16, lg: 18, xl: 20, "2xl": 24, "3xl": 30, "4xl": 36, "5xl": 48, "6xl": 60, eyebrow: 11, label: 11 })[t] ?? (t.startsWith("[") ? parseFloat(t.slice(1)) : null);

function role(classes) {
  const sizes = [...classes.matchAll(SIZE)].map((m) => m[2]);
  if (!sizes.length) return null;
  const top = sizes[sizes.length - 1];
  const caps = /\buppercase\b/.test(classes);
  const heading = /\bfont-display\b/.test(classes);
  if (top.startsWith("display-")) return { "display-sm": "text-heading", "display-md": "text-display", "display-lg": "text-display-lg", "display-xl": "text-display-lg" }[top];
  const size = px(top);
  if (size === null) return null;
  if (heading) return size >= 48 ? "text-display" : size >= 26 ? "text-heading" : "text-title";
  if (caps) return "text-label";
  if (size >= 16) return "text-body";
  if (size >= 14) return "text-body-sm";
  return "text-caption";
}

export default {
  rules: [
    {
      match: /className="([^"]*)"/g,
      replace: ([classes]) => {
        const r = role(classes);
        if (!r) return `className="${classes}"`;
        const kept = classes.replace(SIZE, " ").replace(OWNED, " ").replace(/\s+/g, " ").trim();
        return `className="${r}${kept ? " " + kept : ""}"`;
      },
    },
  ],
};
