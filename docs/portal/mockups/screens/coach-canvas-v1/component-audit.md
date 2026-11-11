# Canvas vs built code: component audit

Canvas = gen_coach.py + gen_login.py (coach), student boards share the same ice palette and helpers (same hex set: #0e1a3c, #8fb8f5, #e1ecfb, #4a7bd0, #f6f9fd, #dde6f3, 8px shadow), so one row covers both portals.
Code = worktree p3fe, src/components/ui/*, src/app/globals.css, src/app/(antrenor)/antrenor/_ui/*.
Abbreviations: A = src/app/(antrenor)/antrenor, UI = src/components/ui, G = src/app/globals.css.

## Summary counts

- Same: 6
- Differs: 34
- Canvas-only (no code component yet): 8
- Code-only (not drawn on canvas): 9

## Canvas hex to existing token map

| Canvas hex | Existing token | Note |
|---|---|---|
| #0e1a3c | --color-navy / primary / surface-dark / line | exact |
| #5f657a | --color-muted | exact |
| #495269 | --color-secondary | exact |
| #be3330 | --color-rust / accent | exact (canvas uses it only for the month label in the date block) |
| #c0c0c4 | --color-secondary-on-dark | exact |
| #979ba5 | --color-muted-on-dark | exact |
| #ffffff | --color-surface-raised | exact |
| rgba(14,26,60,.16) 8px 8px 0 | --shadow-retro | exact |
| #f6f9fd (page bg) | none (surface is cream #fbf8f1) | needs new token |
| #dde6f3 (card border, dividers) | none (line-subtle is #dfdddb) | needs new token |
| #b9c6da (input, checkbox border) | none | needs new token |
| #8fb8f5 (ice) | none (login frame hardcodes it) | needs new token |
| #e1ecfb (ice light) | none | needs new token |
| #4a7bd0 (blue, focus ring, lesson block) | none | needs new token |
| #c9d6ee (nav text on navy) | none (secondary-on-dark is #c0c0c4) | needs new token |
| #111111 (Individual tag) | none (Button uses bg-black #000) | needs new token |
| rgba(14,26,60,.45) overlay | --color-overlay is .55 | value differs |

## Differences table

| # | Component | Code file | Canvas value | Code value | Differs in | Token that would carry it |
|---|---|---|---|---|---|---|
| 1 | Page background | src/app/(antrenor)/layout.tsx (bg-surface), G | #f6f9fd | bg-surface #fbf8f1 | colour | --color-surface (override per portal scope) |
| 2 | Page title h1 | A/_ui/BackHeader.tsx, A/(app)/page.tsx | League Spartan 800, 30px, lh 1.05, ls 0, navy | text-title: League Spartan 800, 20px (24px from md), lh 1.2, ls -0.01em | size, line-height, letter-spacing | needs new role (e.g. text-portal-title) |
| 3 | Section heading h2 | A/(app)/page.tsx (Heading) | League Spartan 800, 22px, normal case, navy | text-label secondary: Inter 600, 12px, uppercase, ls .14em | family, size, weight, case, letter-spacing, colour | needs new role (e.g. text-portal-heading); family/weight reuse --font-display |
| 4 | Row title | A/_ui/Row.tsx | Inter 700, 15px | text-body font-semibold: 16px, lh 1.6 | size, weight (700 vs 600) | needs new role (text-row-title) |
| 5 | Row sub / meta line | A/_ui/Row.tsx | Inter 400, 13px, #5f657a | text-body-sm: 14px, lh 1.55, secondary #495269 | size, colour | text-caption is 12px, body-sm 14px: needs 13px role; colour --color-muted exists |
| 6 | Kicker / greeting line | A/(app)/page.tsx | 14px, #5f657a, normal case | text-label caps 12px secondary (date) or text-body-sm | size, case, colour | muted token exists; size via text role |
| 7 | Card | UI/card.tsx, A/_ui/ListCard.tsx | white, 1px #dde6f3, shadow 8px (lists and cards alike), square | raised: white, border-retro 1.5px navy (--color-line), ListCard uses shadow-retro-sm 4px | border width, border colour, list shadow size | --color-line (override), --shadow-retro (exists), border-retro width token |
| 8 | Info card (group info) | UI/card.tsx (surface=subtle) | bg #e1ecfb | subtle #ece8e0 | colour | --color-surface-subtle (override) |
| 9 | List row | A/_ui/Row.tsx | min-h 76, pad 12/14, gap 14, divider 1px #dde6f3, trailing 44px chevron column (16px, stroke 2.5, square cap, #495269) | p-4 (16), gap-4, divider 1px #dfdddb (divide-line-subtle), Icon chevron-right 16px | height, padding, gap, divider colour, chevron stroke/colour | spacing/size mostly structural; divider via line-subtle override |
| 10 | Date / time block | A/_ui/Row.tsx (tile, time) | 56x52 solid #e1ecfb, month 11px 700 uppercase rust, number League Spartan 800 22px (17px when no month, time text 22px) | tile: w-12, border-retro navy outline, text-label weekday secondary, day text-body semibold; time: plain text-label secondary w-12 | fill vs outline, size, number font, month colour | fill via ice-light token; size/markup structural |
| 11 | End / status block | A/_ui/SquareLabel.tsx | 96px wide full-height solid block, 11px 800, fills navy (todo, group), #e1ecfb (done, soft), #4a7bd0 (lesson) | inline outlined label: text-label, border-retro navy, px-2 py-1, no fill | whole shape (full-height fill vs outline), size, weight, colours | fills need ice/blue tokens; shape is structural |
| 12 | Individual tag | UI/chip.tsx | bg #111111, white, 11px 700, normal case, pad 2/6 | Chip: text-label caps 12px 600, tones accent/highlight/neutral/outline (no black) | colour, size, case, weight | needs new chip tone (ink) and case variant |
| 13 | Field label | UI/form-field.tsx (Field) | Inter 700, 14px, navy, normal case | text-label secondary: 600, 12px, uppercase, ls .14em | size, weight, case, letter-spacing, colour | needs new role (text-field-label) |
| 14 | Input | UI/form-field.tsx (Input) | h48, px14, white bg, 1px #b9c6da, 15px | h-12, px-4 (16), bg-surface (cream) or raised, border-retro 1.5px navy, text-body-sm 14px | border width, border colour, padding, font-size, bg | needs input-border token; --color-surface-raised exists |
| 15 | Select trigger | UI/select.tsx | same box as input, chevron 16px stroke 2.5 square #495269 | h-12 px-4, bg-surface, border-retro navy, Icon chevron-down, text-body-sm | same as input, chevron stroke | same tokens as input |
| 16 | Field hint | UI/form-field.tsx | 13px #5f657a | text-caption 12px secondary | size, colour | muted token exists; 13px role needed |
| 17 | Checkbox | UI/checkbox.tsx | 44x44 square, 2px border (#b9c6da off, navy on), checked fill navy + white 20px check stroke 3 | 20px box, border-retro navy, checked fill accent rust + cream 14px check | size, border width and colour, checked fill | size structural (touch target); fill via accent override |
| 18 | Segmented control | A/_ui/Segmented.tsx | 2px navy border, no dividers, h44, px16, auto width (flex-start), 14px 700 normal case, active navy | border-retro 1.5px, divide-x, h-12, flex-1 full width, text-button 13px 600 caps, active surface-dark | border width, dividers, height, width behaviour, font, case | border width token, text role; width is structural |
| 19 | Primary button | UI/button.tsx (primary, lcta) | solid navy face, 2px navy border, h48, px20, 15px 700 normal case, static 8px shadow, no hover motion drawn | lcta: black #000 face (bg-black), 1.5px border, mustard and rust layers fan on hover, h-12 px-6, text-button 13px 600 caps ls .06em | face colour, border width, padding, font, case, letter-spacing, shadow vs layers | face colour: needs navy face (ButtonFace); layers: --color-mustard, --color-rust exist; shadow vs layers is structural |
| 20 | Secondary button | UI/button.tsx (secondary) | white fill, 2px navy border, h48, px20, 15px 700, normal case | transparent bg, border-retro 1.5px, h-12 px-6, text-button caps, hover-layer | fill, border width, padding, font, case | text-button role, border-retro width |
| 21 | Link | UI/link.tsx, G (@utility link) | navy, 700, 14px, no underline, underline on hover, min-h 44 tap | 600, permanent 2px rust underline (gradient), hover turns rust + slide animation | weight, underline, hover colour, size | needs link tone (e.g. tone="portal"); colours exist |
| 22 | Back header | A/_ui/BackHeader.tsx | text link "‹ Azi" 15px 700, 44px tap, above title | IconButton chevron-left + h1 text-title inline, no text | markup | structural |
| 23 | Phone header and brand | A/_ui/PortalHeader.tsx | no bar, page bg, brand block (CLUBUL SPORTIV 12px .18em 400 secondary over EDUSPORT Climate Crisis 22px .05em), 44px row | navy bar h-16, EDUSPORT only (text-header-logo), initials square button 40px | background, kicker line, layout | bar colour via surface-dark; kicker and layout structural |
| 24 | Bottom nav | A/_ui/BottomNav.tsx | floating navy pill: margin 0 16 16, radius 18, pad 6, 5 items, icon 20 + 11px label, active #8fb8f5 fill radius 13 navy text 700 | full-width fixed white bar, border-t navy, h-16, text-only, 4 items, active navy fill cream text, square | shape, colour, icons, item count, radius (canvas rounded, brief rule forbids rounded) | colours need ice token; shape, icons, radius structural |
| 25 | Desktop nav | A/_ui/TopNav.tsx, PortalHeader.tsx | left navy sidebar 240px: icon links 15px 600, min-h 48, active #8fb8f5 fill, account button 1px bordered; top band #e1ecfb with page title | navy top header: text-button caps links h-10, active white fill, name dropdown | whole layout | structural |
| 26 | Sheet / dialog | A/_ui/Sheet.tsx, UI/dialog.tsx | card: white, 1px #dde6f3, 8px shadow, pad 20, h2 League Spartan 22; overlay rgba(14,26,60,.45); no grab handle; desktop 460px | bg-surface cream, border-retro navy, pad 16, grab handle, text-title, overlay .55, desktop max-w-md | bg, border, pad, title, overlay alpha, handle | --color-overlay, surface, line tokens; handle structural |
| 27 | Google button and divider | A/_ui/AuthBits.tsx (GoogleBlock) | white, 2px navy border, h48, 15px 700 normal case, Google G logo 18px; divider is plain centred "sau" 13px muted, no rules | border-retro, text-button caps, label only (no logo), hover-layer; divider has lines each side + text-label | border width, font, case, logo, divider rules | text-button role; logo and rules structural |
| 28 | Login frame card | A/_ui/AuthFrame.tsx | 1px #dde6f3, 8px shadow, pad 24 (phone and desktop), h1 League Spartan 28px | same border and shadow but hardcoded hex (border-[#dde6f3], shadow-[8px_8px_0_rgba(...)]), pad p-5 phone / p-6 desktop, h1 text-title | h1 size, phone padding, hardcoded hexes not tokens | border and ice tokens (removes hardcoding); size via title role |
| 29 | Save bar | A/(app)/prezenta/PresenceView.tsx | full-width white bar, border-top 1px #dde6f3, pad 14/20, left League Spartan 20px count, primary button right | inline flex row, no bar surface or border, count text-body | bar surface and border, count font | line token; bar is structural (new wrapper) |
| 30 | Presence table | A/(app)/prezenta/PresenceTable.tsx | head bg #e1ecfb 12px 700 #495269 normal case, 1px #dde6f3 dividers, row min-h 68, name 15px 700, meta 13px, 44px checkboxes | head h-12 text-label caps secondary with navy border-b, outer border-retro navy, dividers line-subtle, name text-body, 20px checkboxes | head fill, head font and case, borders, row height, text sizes | ice-light, line tokens, text roles; row height and checkbox size structural |
| 31 | Focus ring | UI/button.tsx, form-field.tsx, all controls | 2px solid #4a7bd0, offset 2px | 2px outline offset 3px, colour primary navy (cream on dark) | colour, offset | needs new --color-focus token |
| 32 | Icons | UI/icon.tsx, A/_ui/Row.tsx | inline SVG, stroke 2 round caps, chevron stroke 2.5 square cap, sizes 16/18/20/26 | sprite icons, fixed sizes 16, 24, 48 (size-4/6/12), no 18/20 | stroke, caps, sizes | structural (icon set), sizes need new steps |
| 33 | Stat card | UI/stat.tsx | navy card, League Spartan 800 88px lh .85 number in #8fb8f5, 14px #c0c0c4 label, 8px shadow, pad 20 | Stat: text-athlete-stat 44px or text-display-lg 80px max, number accent-on-dark mustard, label text-label caps | size, number colour, label case; not used on Azi page | ice token for number; 88px needs new size |
| 34 | Desktop page container | A/_ui/PortalShell.tsx | max-w 1200, pad 32, columns gap 32 | max-w-content 1280, gutter 16/32/48, py-6 | width, padding | spacing tokens (--max-content-width), mostly structural |

## Same (6)

| Component | Code file | Value |
|---|---|---|
| Body font | G body | Inter on both |
| Primary ink colour | G --color-primary | #0e1a3c |
| Muted and secondary text colours | G --color-muted, --color-secondary | #5f657a, #495269 |
| Card shadow (8px) | G --shadow-retro | 8px 8px 0 rgba(14,26,60,.16) |
| Login brand block and ribbon | A/_ui/AuthFrame.tsx, AuthRibbon.tsx | kicker 12px 700 .28em, wordmark 62px desktop, ribbon colours #efb22b #ea7233 #be3330 #6e4256, geometry (values match, but hardcoded hex) |
| Square corners on cards, buttons, inputs, sheets | all | 0 radius (only bottom nav pill breaks it on canvas, see row 24) |

## Canvas-only, no code component yet (8)

1. Key/value card (kv rows: 14px muted key, 15px 700 value, min-h 56, Școala and Prezențe cards).
2. Now tile (Noi / day / time, 64px navy block + white time box).
3. Type block (64px full-height icon block, navy or #4a7bd0, 26px icon).
4. Competition accordion card (details/summary, 96px navy count block).
5. Place block and points cell (Loc N tile, points column).
6. Nav icons and the Concursuri tab (code nav has 4 text items, canvas has 5 with icons).
7. Calendar screen (month grid, group and lesson lists).
8. Desktop top band (#e1ecfb with page heading) and sidebar account button.

## Code-only, not drawn on canvas (9)

1. Textarea (UI/form-field.tsx).
2. Toast (A/_ui/Toast.tsx: navy, border-retro, shadow-retro-sm, text-body-sm).
3. Spinner (A/_ui/Spinner.tsx).
4. LoadError line (A/_ui/LoadError.tsx).
5. Entry reveal transition (A/_ui/EntryReveal.tsx; canvas draws a tr-* looping board only).
6. Password field with eye toggle (A/_ui/PasswordField.tsx).
7. Profile dropdown menu (A/_ui/TopNav.tsx ProfileMenu).
8. Initials avatar button in the phone header (A/_ui/PortalHeader.tsx).
9. Disabled and invalid states for button, input, checkbox, select (canvas draws none; code uses disabled, line-subtle, accent border).

## Which differences a token theme can carry

### Pure token values (a scoped theme can do these)

Rows 1, 7 (border colour and width, list shadow), 8, 14 and 15 (border colour and width, bg), 16 (colour), 17 (border, fill colour), 19 (face colour, border width), 20 (border width), 26 (bg, border, overlay alpha), 28 (hardcoded hexes to tokens), 31 (focus colour and offset), 12 and 33 (colours), plus the divider colour in 9 and 30.

New tokens needed for these: surface-page ice (#f6f9fd), line-subtle ice (#dde6f3), input-border (#b9c6da), ice (#8fb8f5), ice-light (#e1ecfb), blue (#4a7bd0), on-navy nav text (#c9d6ee), ink chip (#111111), focus (#4a7bd0), plus a border-width token (1px/2px portal vs 1.5px site) and overlay alpha. Existing tokens (primary, muted, secondary, shadow-retro, surface-raised, accent) already carry the rest.

Type is also token-able but needs new text roles, not new colours: row title 15px 700, meta 13px, field label 14px 700 normal case, button 15px 700 normal case, h1 30px, h2 22px League Spartan. Rows 2, 3, 4, 5, 6, 13, 16, 18 (font part), 19 and 20 (font part), 21 (weight, underline) are of this kind. A portal text-role set (same role names, different values per scope) would carry them.

### Structural (different markup or layout, a token cannot do these)

Rows 9 (height, chevron column), 10 (fill tile vs outlined tile), 11 (full-height block vs outlined label), 18 (full-width vs auto width), 19 (static shadow vs animated layers), 22 (text back link vs icon button), 23 (kicker line, navy bar vs plain header), 24 (floating pill, icons, radius, 5 items), 25 (sidebar vs top nav), 27 (Google logo, divider rules), 29 (bar wrapper), 30 (row height, 44px checkbox), 32 (icon set and sizes), 34 (container), 17 (44px touch size), 26 (grab handle).

Roughly: 14 of 34 rows are fully token-expressible, 8 are mixed (colours by token, shape by markup), 12 are structural. All 8 canvas-only items are structural (new components).

### Flags for the decision

- Bottom nav on canvas uses radius 18 and 13, which conflicts with the no-rounded-shapes rule in memory. Decide before building.
- AuthFrame hardcodes #dde6f3, #8fb8f5, #c9d6ee, #495269 and the shadow, bypassing G tokens. Migrating these to tokens is the first step of any theme.
- Canvas button and checkbox hit areas are 44px, code is 48px (buttons) and 20px visible box (checkbox). Needs a decision, not a token.
