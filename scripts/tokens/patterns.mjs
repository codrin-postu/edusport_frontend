// Forbidden class patterns. Each one maps to a rule in the SP1 spec.
const V = "(?:^|[\\s\"'`:])"; // start of a class token, after any variant prefix

export const PATTERNS = [
  // Any colour, not a fixed list: `text-edusport-blue/60` slipped past the old
  // list. `text-sm/6` style size/line-height shorthands are not colours.
  { id: "text-opacity", why: "text and borders never use opacity", regex: new RegExp(`${V}(?:text|border(?:-[trblxy])?|divide|ring|placeholder:text)-(?!(?:xs|sm|base|lg|[2-9]?xl)\\/)[a-z][a-z-]*\\/(?:\\d+|\\[[\\d.]+\\])`, "g") },
  // Fading an element with opacity fades its text too. Only the show/hide
  // pair opacity-0 / opacity-100 is allowed; states use solid colours
  // (text-disabled, text-muted, hover colours) instead.
  { id: "opacity", why: "no opacity except opacity-0/100 show and hide", regex: new RegExp(`${V}opacity-(?!(?:0|100)(?![\\d.]))(?:\\d+|\\[)`, "g") },
  // The same through CSS, inline styles and SVG attributes, which class
  // scans never saw: `opacity: .7` in globals.css, `rgba(...)` text colours.
  { id: "css-opacity", why: "no opacity or rgba text colour in CSS, styles or SVG", regex: /(?:\bopacity\s*[:=]\s*["'{]?\s*0?\.\d|\bcolor\s*:\s*["']?rgba\(|TextStroke\s*:\s*["']?[^"'\n]*rgba\()/gi },
  // Any colour. Hovers use the hover-layer utilities; image overlays use bg-overlay.
  { id: "bg-opacity", why: "use surface tokens, hover layers or bg-overlay", regex: new RegExp(`${V}bg-[a-z][a-z-]*\\/(?:\\d+|\\[[\\d.]+\\])`, "g") },
  { id: "default-palette", why: "only theme tokens", regex: new RegExp(`${V}(?:text|bg|border|ring|divide|from|to|via|fill|stroke)-(?:gray|slate|zinc|neutral|stone|red|green|blue|amber|yellow|orange|emerald|rose|sky|indigo|teal|lime|purple|pink)-\\d{2,3}\\b`, "g") },
  { id: "arbitrary-px", why: "sizes and spacing come from the scale", regex: new RegExp(`${V}(?:text|p[trblxy]?|m[trblxy]?|gap(?:-[xy])?|space-[xy]|top|bottom|left|right|inset(?:-[xy])?)-\\[-?\\d+(?:\\.\\d+)?px\\]`, "g") },
  { id: "off-scale-spacing", why: "4px grid: 1,2,3,4,6,8,12,16,24", regex: new RegExp(`${V}-?(?:p[trblxy]?|m[trblxy]?|gap(?:-[xy])?|space-[xy])-(?:1\\.5|2\\.5|3\\.5|5|7|9|10|11|14|20|28|32|40|56)\\b`, "g") },
  { id: "arbitrary-shadow", why: "shadow-retro-sm or shadow-retro", regex: new RegExp(`${V}shadow-\\[`, "g") },
  // No rounded shapes at all, pills and circles included (rounded-none is fine).
  { id: "radius", why: "square corners, no pills or circles", regex: new RegExp(`${V}rounded(?:-[trbl]{1,2})?(?:-(?:sm|md|lg|xl|2xl|3xl|full|\\[[^\\]]+\\]))?(?=[\\s"'\`]|$)`, "g") },
  { id: "z-index", why: "use z-base ... z-popup", regex: new RegExp(`${V}-?z-(?:\\[\\d+\\]|\\d+)(?=[\\s"'\`]|$)`, "g") },
  { id: "arbitrary-type", why: "type roles set tracking and leading", regex: new RegExp(`${V}(?:tracking|leading)-\\[`, "g") },
  { id: "raw-duration", why: "duration-fast, -base, -slow, -long", regex: new RegExp(`${V}duration-\\d+\\b`, "g") },
  // The saturated brand blue is retired from the theme (2026-09-28). Only the
  // frozen landing hero keeps its own hard-coded copy.
  { id: "retired-blue", why: "edusport-blue is retired; use navy, rust or burgundy", regex: /(?:edusport-blue|#2138b8)/gi },
];

// Frozen or third-party files the checker and codemods never touch.
export const FROZEN = [
  "src/app/landing-v2/blocks/HeroSection.tsx",
  "src/app/landing-v2/blocks/HeroWordmarkMorph.tsx",
  "src/components/blocks/fullcalendar/fullcalendar-overrides.css",
];

// Explicit, per-file-and-pattern exceptions. Each entry is a named, reviewed
// exception from the SP1 spec, not a blanket carve-out: only the given
// pattern is ignored in the given file, everything else in that file is
// still checked normally. Do not add to this list without a reason tied to
// a real spec decision; prefer fixing the violation instead.
export const ALLOWLIST = [
  {
    file: "src/components/blocks/announcement-popup/AnnouncementCard.tsx",
    id: "arbitrary-shadow",
    reason: "rust CTA layer shadow on the approved primary announcement button (SP1 spec).",
  },
  {
    file: "src/components/blocks/announcement-popup/AnnouncementModal.tsx",
    id: "arbitrary-shadow",
    reason: "rust CTA layer shadow on the approved primary announcement button (SP1 spec).",
  },
  {
    file: "src/components/ui/date-picker-field.tsx",
    id: "arbitrary-shadow",
    reason: "mustard inset focus ring, the SP2 focus utility, needs an arbitrary inset shadow value.",
  },
  {
    file: "src/app/despre-noi/sportivi/[slug]/_View.tsx",
    id: "arbitrary-type",
    reason: "named exception: athlete name / decorative numbers keep custom tracking/leading.",
  },
  {
    file: "src/app/despre-noi/sportivi/[slug]/_View.tsx",
    id: "arbitrary-px",
    reason: "decorative big numbers: placement numeral and watermark, the named exception.",
  },
  {
    file: "src/app/cursuri/blocks/ScheduleSection.tsx",
    id: "arbitrary-px",
    reason: "notebook margin positions aligned with the 72px hole column.",
  },
  {
    file: "src/hooks/useSeasonCalendar.ts",
    id: "default-palette",
    reason: "calendar/map colors are redesigned in SP5 (one color source shared with admin and legend).",
  },
  {
    file: "src/app/cursuri/blocks/SeasonTableView.tsx",
    id: "default-palette",
    reason: "calendar/map colors are redesigned in SP5 (one color source shared with admin and legend).",
  },
  {
    file: "src/components/ui/pill.tsx",
    id: "default-palette",
    reason: "calendar/map colors are redesigned in SP5 (one color source shared with admin and legend).",
  },
  {
    file: "src/app/cursuri/blocks/ScheduleSection.tsx",
    id: "css-opacity",
    reason: "notebook rail line and background doodle SVG: decorative, aria-hidden shape with no text; the no-opacity rule is about text.",
  },
  {
    file: "src/app/despre-noi/sportivi/_components/SportspersonCard.tsx",
    id: "css-opacity",
    reason: "card stripe SVG paths tinted by the medal colour: decorative, aria-hidden shape with no text; the no-opacity rule is about text.",
  },
  {
    file: "src/app/landing-v2/blocks/RegistrationPinwheelGrid.tsx",
    id: "css-opacity",
    reason: "pinwheel square grid SVG: decorative, aria-hidden shape with no text; the no-opacity rule is about text.",
  },
  {
    file: "src/app/landing-v2/blocks/RegistrationPinwheelGrid.tsx",
    id: "opacity",
    reason: "pinwheel grid faded behind text on mobile: decorative, aria-hidden shape with no text; the no-opacity rule is about text.",
  },
  {
    file: "src/app/landing-v2/blocks/AboutUsSection.tsx",
    id: "opacity",
    reason: "mobile background ribbon SVG: decorative, aria-hidden shape with no text; the no-opacity rule is about text.",
  },
  {
    file: "src/app/protectia-datelor/_View.tsx",
    id: "opacity",
    reason: "background circles in the contact card: decorative, aria-hidden shape with no text; the no-opacity rule is about text.",
  },
  {
    file: "src/app/contact/_View.tsx",
    id: "radius",
    reason: "the loading spinner in the submit button is a spinning ring; a square would wobble.",
  },
];
