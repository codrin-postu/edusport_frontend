# Design Foundations (SP1): Design Spec

**Date:** 2026-09-24
**Status:** Approved in design review, pending spec review
**Scope:** Sub-project 1 of the frontend standardisation (SP0 to SP6)

---

## Overview

The site has no single source for its visual rules. A read-only audit of `src/`
(236 files) found 17 text opacities, about 200 transparent backgrounds and
borders, about 40 spacing values (about 230 uses off the 4px grid), 44 font
sizes, 31 letter-spacings, about 30 animation durations, 16 z-index values and
11 icon sizes. Primitives exist in `src/components/ui/` but are mostly bypassed:
`ui/card.tsx` has no users and `ui/button.tsx` has one.

SP1 defines the tokens every later sub-project builds on: color, surfaces,
lines, shape, spacing, layout, typography, motion, layering and icons. Each
value below was reviewed against a live screenshot or a rendered mockup and
approved. SP1 changes tokens, global CSS and the utilities that express them.
Rewriting primitives (Button, Card, SectionHeader, Breadcrumb, Accordion,
Dialog, IconButton, form fields) is SP2 and gets its own spec.

## Principles

1. **No opacity on text, borders or fills.** Every text, line and background
   color is a solid value, and no element is faded with `opacity-*` (only the
   `opacity-0` / `opacity-100` show and hide pair). The only translucent values
   allowed are the hover layers, the overlay, the two shadows and decorative
   text-free shapes (ruling 2026-09-27).
2. **One token per role.** Pages pick a role (`text-secondary`, `section`,
   `text-title`), never a raw size, color or padding.
3. **Square corners, everywhere.** No pills and no circles: tags, dots,
   avatars and round icon buttons are square too. The one exception is the
   loading spinner ring (ruling 2026-09-27).
4. **No dashed or dotted lines** anywhere.
5. **Rem, not px, for type**, so browser zoom and the phone text-size setting
   work.
6. **Guarded, not promised.** A lint rule blocks the old patterns, and a pixel
   diff proves what changed.

## Frozen: landing page hero

The landing page hero (`src/app/landing-v2/blocks/HeroSection.tsx`,
`HeroWordmarkMorph.tsx`) must not change at all: spacing, gutters, sizes, type,
motion. It is excluded from the codemod and the lint rule. The SP0 pixel diff at
390, 768 and 1440px must show it identical after every step.

Only the landing hero is frozen. Subpage heroes (`PageHeroSection`) and the
header follow the new rules.

---

## 1. Text colors

Eight solid colors, exposed as utilities (`@utility`) so class names read
cleanly (`text-secondary`, not `text-text-secondary`).

| Class | Hex | Contrast | Use |
|---|---|---|---|
| `text-primary` | #0e1a3c | 16.1 on cream, 17.1 on white | Titles, body, labels, numbers |
| `text-secondary` | #495269 | 7.4 / 7.8 | Subtitles, descriptions, dates, locations |
| `text-muted` | #5f657a | 5.4 / 5.8 | Placeholders, disabled labels, hints only |
| `text-accent` | #be3330 | 5.3 / 5.7 | Eyebrows, links, active state |
| `text-primary-on-dark` | #fbf8f1 | 16.1 on navy | Titles, body on navy |
| `text-secondary-on-dark` | #c0c0c4 | 9.4 | Subtitles, footer text on navy |
| `text-muted-on-dark` | #979ba5 | 6.1 | Placeholders, disabled on navy |
| `text-accent-on-dark` | #efb22b | 9.0 | Eyebrows, links, accents on navy |
| `text-disabled` | #8a8e9a | 3.1 on cream | Past items (Program weekends, text and square) and disabled controls only; never body copy |

**Migration.** `text-navy`, `/85` and `/80` become `text-primary`. Readable text
at `/75` to `/40` becomes `text-secondary`. Placeholders and disabled labels
become `text-muted`. Cream and white opacities on navy map the same way to the
`-on-dark` set. The 40 `text-gray-*` uses and the current `ink` token (#111827,
3 uses) merge in. The shadcn `primary` text color (13 uses) is retired in SP2.

## 2. Backgrounds

| Class | Hex | Use |
|---|---|---|
| `bg-surface` | #fbf8f1 | Page |
| `bg-surface-raised` | #ffffff | Cards, inputs |
| `bg-surface-subtle` | #ece8e0 | Skeletons, image placeholders, blockquotes and code, table header, selected row, progress track, disabled button |
| `bg-surface-dark` | #0e1a3c | Navy sections, footer, panels |
| `bg-surface-subtle-on-dark` | #26304e | The same roles on navy; selected option card and page hero watermark on navy |
| `bg-surface-highlight` | #f9edd1 | The one "next" item in a list (Program's next weekend) |

`bg-surface-subtle` replaces `bg-navy/[0.03]` through `bg-navy/10` and the
default gray backgrounds (about 45 static uses).

## 3. Interaction layers and overlay

These are the only translucent fills.

| Token | Value | Use |
|---|---|---|
| `hover` | navy 5% layer over the element | Rows, secondary buttons, menu items, accordion headers |
| `hover-on-dark` | cream 10% layer | The same on navy |
| `bg-overlay` | navy 55% | Dialog backdrop, text on photos |

The hover layer is drawn on top of the element (for example an inset shadow or
a pseudo-element), so the same rule works on a white row, a cream page or a
button. Never used for text or borders.

## 4. Lines

| Class | Hex | Use |
|---|---|---|
| `border-line` | #0e1a3c | The 1.5px retro border |
| `border-line-subtle` | #dfdddb | Dividers between rows and list items |
| `border-line-on-dark` | #fbf8f1 | Outline buttons and inputs on navy |
| `border-line-subtle-on-dark` | #3d4660 | Dividers on navy |

Border width token: `border-retro` = 1.5px (today typed 131 times with no
token).

## 5. Shape and shadows

- Corners: square everywhere (buttons, cards, inputs, dialogs, athlete cards).
- Shadows keep navy at 16%:
  - `shadow-retro-sm`: 4px 4px 0, navy 16%. List items, small tiles.
  - `shadow-retro`: 8px 8px 0, navy 16%. Default for content cards, forms,
    dialogs.
- Removed: the 6px variant, the darker 8px/0.28 modal shadow (dialogs rely on
  `bg-overlay`), the soft blurred shadows, and the mismatched token value
  (0.12). About 22 inline shadows collapse into these two.
- The primary button's layered mustard and rust hover shadow stays as it is.

## 6. Spacing

**Scale (4px grid):** 4, 8, 12, 16, 24, 32, 48, 64, 96. Tailwind classes stay
familiar (`p-4`, `gap-6`, `mb-12`); other steps and hand-typed px are blocked by
lint. A 2px hairline remains only for the link underline and badge insets.

Snapping rules: 6 and 10 go to 8 or 12; 14 and 18 to 16; 20 to 16 or 24; 28 to
24 or 32; 40 to 32 or 48; 56 to 48 or 64; 80 to 64 or 96. Each snap is decided
per use by the pixel diff, not blindly.

**Fixed patterns:**

| Pattern | Value |
|---|---|
| Card padding | 24 default, 16 compact (list tiles); large panels (forms, pricing) 32 on desktop |
| Card inner rhythm | eyebrow, 8, title, 8, text |
| Section header | eyebrow, 12, title, 16, intro, then 48 to content (built into SectionHeader in SP2) |
| Input | 48px tall, 16px sides (same height as buttons) |
| List and table rows | 12 vertical, 16 sides |
| Badge and pill | 4 x 8 small, 4 x 12 default |
| Grid gaps | 16 tight lists, 24 cards, 32 groups of cards |

## 7. Layout

**Widths:**

| Class | Width | Use |
|---|---|---|
| `max-w-content` | 1280 | Every section container, header and footer included |
| `max-w-prose` | 720 | Running text: intros, articles, lists, rules |
| `max-w-narrow` | 560 | Forms, dialogs, hero subtitles |
| `max-w-aside` | 320 | Side notes, the subtitle next to a heading |

`max-footer-content` (1480) is removed; footer content sits at 1280. About 20
ad-hoc caps (`max-w-xs` to `max-w-6xl`, 620/560/490/460/440/320/200px, `46ch`)
map to these. Exception: the landing `AboutUsSection` ribbon keeps its 1600px
decorative width, with a comment.

Rule: grids, cards and timelines use content width; anything read line by line
uses prose width. Despre noi is aligned to this.

**Section sizes** (the only spacing above 96):

| Utility | Mobile to desktop | Use |
|---|---|---|
| `section-compact` | 48 to 64 | CTA strips and bands |
| `section` | 64 to 96 | Every section |
| `section-feature` | 96 to 128 | Landing sections below the hero (today 80 to 112) |

The page shell's extra bottom padding (`layout.tsx:163`, `pb-24 md:pb-32`) is
removed.

**Gutters:** 16, 32, 48 (mobile, md, lg) everywhere, including the header (today
16 only) and the footer (today a fixed 88).

**Scroll offset:** `scroll-padding-top` equal to the fixed header height, so
anchor and form scrolls land below the header.

## 8. Typography

**Families: 3, down from 5.** Inter and League Spartan are variable fonts, so
all their weights come from one file each (split into Latin and Latin Extended,
which Romanian ș and ț need). Measured on the live homepage: 11 font files,
556 KB today; about 5 files after (Inter 2, League Spartan 2, Climate Crisis 1, now 24 KB instead of 85 KB).
The weight list below limits which weights the design uses, not the download.

| Family | Weights | Use |
|---|---|---|
| Inter | 400, 600 | 400 for reading text and captions; 600 for links, emphasis and all caps (labels, buttons, table headers, nav). 300 and 500 go to 400; 700, 800 and 900 go to 600 |
| League Spartan | 800, 900 | 800 for every heading role; 900 for the athlete name and existing black display numbers. The 4 current 700 uses (landing event and article titles `EventsNewsSection.tsx:98,125`, `SeasonTableView.tsx:168`, footer column headings `globals.css:374-380`) become `text-title` at 800 |
| Climate Crisis | static, frozen at YEAR 1979 | Logo, header, footer wordmark, subpage hero titles and the landing hero wordmark |

**Climate Crisis frozen at 1979.** The site only uses YEAR 1979
(`globals.css:40`). The variable .ttf (164 KB, 85 KB gzipped as served) is
replaced by a static instance at 1979 in woff2 (24 KB, built with
`fontTools.varLib.instancer`). Verified on the font data: all 457 characters
have identical outlines and advance widths, and kern, mark and mkmk features
are kept. The `font-variation-settings: "YEAR" 1979` line stays (harmless on a
static font), so the frozen hero's canvas code reads the same value as today.
A further Latin-only subset (13 KB) was rejected: it drops mark positioning and
risks fallback glyphs in CMS titles.

Removed:
- **Lora.** The landing CompetitionStrip heading becomes Inter 400 at the same
  size, in `text-secondary-on-dark`. The athlete short description (fallback)
  becomes `text-body` semibold. The career goal becomes a quote with a rust bar
  in `text-secondary`.
- **Caveat.** The "weekend!" note on `/cursuri/program` (`ScheduleSection.tsx:120`)
  becomes an inline SVG with the same handwriting, in a solid color.

**Font leak fix.** `globals.css:21-29` sets Inter directly on `h4, h5, h6, p,
span, div, body`. A rule on the element beats inheritance, so text inside span,
p or div under a `.font-display` parent renders in Inter. Verified with the
browser's rendered-font query on 15 live routes: 12 blocks in 4 places (landing
`AboutUsSection` heading, the Sportivi spotlight name, the athlete page name
which renders as Inter Black, and 9 Realizări season headers). Fix: set Inter on
`body` only and let inheritance work. The pixel diff lists every element this
changes before commit.

**Type roles (11 roles, rem; `text-subtitle` and `text-body-lg` added 2026-09-28):** each role sets size, weight,
line-height and letter-spacing together.

| Role | Size | Font | Line | Spacing |
|---|---|---|---|---|
| `text-display-lg` | 48 to 80 | Spartan 800 | 1.05 | -0.02em |
| `text-display` | 30 to 48 | Spartan 800 | 1.05 | -0.02em |
| `text-heading` | 26 to 36 | Spartan 800 | 1.1 | -0.02em |
| `text-title` | 20 to 24 | Spartan 800 | 1.2 | -0.01em |
| `text-subtitle` | 20 to 24 | Inter 600 | 1.35 | 0 |
| `text-body-lg` | 18 | Inter 400 | 1.6 | 0 |
| `text-body` | 16 | Inter 400 | 1.6 | 0 |
| `text-body-sm` | 14 | Inter 400 | 1.55 | 0 |
| `text-caption` | 12 | Inter 400 | 1.4 | 0 |
| `text-label` | 12 | Inter 600 caps | 1.1 | +0.14em |
| `text-button` | 13 | Inter 600 caps | 1 | +0.06em |

- `text-subtitle`: the line under a page or section title. `text-body-lg`: intro
  paragraphs.
- Named exceptions: `text-athlete-name` (Spartan 900, 56 / 88px, -0.055em, as
  before SP1) and `text-branding-font` (Climate Crisis).
- Minimum size is 12px. 8, 9.5, 10, 10.5 and 11px are removed.
- `text-label` covers both eyebrows and labels.
- `text-title` absorbs the 15 to 24px small headings (form titles, pricing
  cards, team names, event cards).
- Mapping: 11 to 11.5px and `text-2xs`/`text-eyebrow` go to `text-label`; 12 to
  13.5px and `text-xs` to `text-caption` or `text-label`; 14 to 15px and
  `text-sm` to `text-body-sm`; 16 to 17px and `text-base` to `text-body`; 18 to
  24px headings to `text-title`; 26 to 44px and `display-sm` to `text-heading`;
  `display-md` and 48px to `text-display`; `display-lg/xl` to `text-display-lg`.

**Exceptions:** the athlete page name (`NameStack`, Spartan 900, 56 to 88px,
letter-spacing -0.035em instead of -0.055em so the outlines stop crossing), the
large decorative numbers, and the frozen landing hero.

A `text-lead` role (18px) was considered and dropped; revisit only if page
intros need it.

## 9. Links

All links except the footer:

- At rest: `text-primary` in Inter 600 with a permanent 2px `text-accent` underline, drawn as
  a background gradient on the text (`box-decoration-break: clone`). This gives
  the same gap for inline and standalone links and one underline per wrapped
  line. Gap 4px so the ș and ț commas clear the line.
- Hover: text turns `text-accent`; the underline slides out to the right and back
  in from the left, `duration-long` (750ms), `in-out`.
- On navy: the same with `text-accent-on-dark`.
- Reduced motion: an instant color change.
- Replaces `link-underline-rust` (21 uses) and `link-underline-animate`
  (`ui/link.tsx`).

Footer links are the exception and keep today's look (mustard bar grows in 200ms,
text turns white); the four inline copies become one `link-underline-footer`
utility.

## 10. Buttons (token level)

- Fixed 48px height, 24px sides, `text-button`. Height never depends on the label.
- Primary: unchanged, including the layered mustard and rust hover (`spring`
  easing).
- Secondary hover: the `hover` layer (`hover-on-dark` on navy); border and text
  unchanged.
- Disabled: `bg-surface-subtle` with `text-disabled` (on navy
  `bg-surface-subtle-on-dark` with `text-muted-on-dark`); outline controls get
  `border-line-subtle`; no dashes, never `opacity-*`.
  Visibly different from a white input.

The Button component rewrite itself is SP2.

## 11. Motion

| Token | Value | Use |
|---|---|---|
| `duration-fast` | 150ms | Hover and color changes |
| `duration-base` | 250ms | Menus, dropdowns, popovers, dialogs |
| `duration-slow` | 400ms | Carousel, accordion, card movement |
| `duration-long` | 750ms | Link slide, scroll reveals |

| Easing | Curve | Use |
|---|---|---|
| `standard` | cubic-bezier(0.4, 0, 0.2, 1) | Moving from A to B |
| `out` | cubic-bezier(0.22, 1, 0.36, 1) | Things appearing |
| `in-out` | ease-in-out | Link slide only |
| `spring` | cubic-bezier(0.34, 1.56, 0.64, 1) | Primary button layered hover and the cookie accept button only |

Exceptions keep their own timing: marquees, `NavigationProgress`, and the
frozen landing hero and wordmark. Every animation respects
`prefers-reduced-motion`.

## 12. Layers (z-index)

| Token | Value | Use |
|---|---|---|
| `z-base` | 0 | Page content |
| `z-raised` | 10 | Lifted items inside content |
| `z-sticky` | 50 | Resume-registration bar (today 90) |
| `z-header` | 100 | Fixed header |
| `z-menu` | 200 | Mobile menu panel (today 998/999) |
| `z-dialog` | 300 | Dialogs, gallery lightbox (fixes the Înscrieri modal sharing 100 with the header) |
| `z-popup` | 400 | Announcement card and modal (today 900) |

The cookie banner keeps the library's layer. The Strapi preview banner (9999)
is an editor-only tool and stays separate.

## 13. Icons

- Two sizes: 16 next to text (buttons, inputs, links, lists, breadcrumbs,
  accordion arrows) and 24 for standalone controls (close, arrows, menu,
  social).
- Stroke width 1.5 or 2.
- Every icon-only control has at least a 40px hit area (14 are under that
  today).

---

## Enforcement

- A lint rule (ESLint plus a class-pattern check) blocks: text and border
  opacity classes (`text-*/NN`, `border-*/NN`), default Tailwind gray and palette
  colors, arbitrary px sizes and spacing, spacing steps outside the scale,
  arbitrary shadows, radii other than none/full, and z-index values outside the
  layer tokens. The frozen hero files are excluded.
- Removed tokens (`gold` duplicate of `medal-gold`, `surface-soft`, `blue-tint`,
  `scrim`, `scrim-light`, `ink`, the three near-identical creams) are deleted so
  they cannot be used.

## Verification

- **SP0 baseline first.** Before any SP1 change, Playwright captures every route
  at 390, 768 and 1440px in Chromium and WebKit (WebKit covers the Safari
  checks), plus an axe contrast pass.
- **After each change set:** the same capture, a pixel diff against the
  baseline, and a before/after gallery. Expected changes are listed in advance;
  anything else is investigated before commit.
- **Landing hero:** zero pixel difference, every time.
- **Rendered fonts:** the browser's platform-font query confirms headings
  render in League Spartan (the check that exposed the leak).
- **Contrast:** axe reports no text contrast failures on the audited routes.

## Out of scope for SP1

- Rewriting the primitives and the components that bypass them (SP2).
- Page-level fixes from the change list (SP4).
- Structure changes: Evenimente into Noutăți, map and calendar colors, YouTube
  without consent (SP5).
- Medal counts per athlete (SP6).

## Open items

- A single label for the Înscrieri CTA (seven variants today).
- The landing section 2 color.
- Order of the SP4 page passes.


## Ruling 2026-09-28: brand blue retired

`edusport-blue` (#2138b8) is removed from the theme. Logo is plain navy with no
hover animation; photo-less athlete gradients use burgundy; the athlete frame
ends in navy; the page-load bar is rust; Antrenament in the calendar is
burgundy (the admin panel's category colour must match); body and the
registration-closed section are navy. The checker blocks `edusport-blue` and
#2138b8. Only the frozen landing hero keeps its own hard-coded copy.
