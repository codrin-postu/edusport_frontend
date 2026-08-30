# EduSport — Fixes & Features Plan

Status legend: [ ] todo · [~] in progress · [x] done · [?] needs approval/brainstorm

## Group 1 — Mobile / responsive bugs (landing + nav)
- [~] Landing hero mobile **landscape**: content crowded — NEEDS screenshot (hero is h-screen + h-full children; fix is a layout tradeoff)
- [~] Landing hero: wave divider pinned to bottom even on short screens — tied to hero-height fix above
- [x] Landing: **blue edges / not full-bleed** on phone — added `overflow-x-clip` to body (clip preserves sticky)
- [~] Mobile scroll nav: background **wavy band fixed** — need to confirm if it's the MenuPanel tube-lines (decorative, currently fixed behind scroll) — screenshot
- [x] Mobile **landscape burger menu squished** — rows container now `flex-1 min-h-0` so it scrolls instead of clipping

## Group 2 — White space above footer (should be cream)
- [x] Global fix: `main` bg `white → retro-cream` in layout.tsx (covers echipa, sportivi, all pages)

## Group 3 — Sportivi
- [-] Featured sportsperson — DEFERRED (correctly requires ≥1 linked competition; data, not a bug)

## Group 4 — Calendar page polish
- [?] Empty area under the calendar (before "Scoala de patinaj" block) — add something (needs a small design/brainstorm)

## Group 5 — BIG: Calendar backend redesign (BRAINSTORM REQUIRED)
- [?] Hourly schedule per event: **start + end hours**
- [?] **Recurring** events (with hours)
- [?] **Cancel a specific occurrence** of a recurrence
- [?] **Exceptions** to a recurrence
- [?] Special case handling for **"Scoala de patinaj"**
- [?] Frontend weekly view consumes the new hourly + recurrence model

## Sequencing
1. Group 1 (responsive bugs) — concrete fixes, do first.
2. Groups 2 + 3 (white space, featured sportsperson) — concrete fixes.
3. Group 5 (calendar backend) — dedicated brainstorm to design the data model
   (recurrence + exceptions + hours) BEFORE building. Biggest change.
4. Group 4 (calendar empty area) — quick design once the model is settled.

## Notes
- Changes ship via the git→PR→Deploy pipeline (staging → main → Deploy Action).
- Show diffs / get approval before finalizing design-affecting changes.
