# Înscrieri Form Redesign

**Date:** 2026-03-19
**Status:** Approved for implementation

---

## Context

The `/inscrieri` registration form uses a custom 3-step stepper with no animations. The layout feels flat — steps appear/disappear instantly, the stepper gives no clear "done / doing / todo" signal, and input interactions lack any tactile feedback. The goal is to make the form feel more personal and polished without changing its structure, data model, or Google Forms submission logic.

---

## Scope

- `src/app/inscrieri/_shared.tsx` — StepIndicator upgrade
- `src/app/inscrieri/_RegistrationForm.tsx` — step transition animations
- `src/app/inscrieri/_StepPersonal.tsx` — input stagger animation
- `src/app/inscrieri/_StepExperience.tsx` — input stagger animation
- `src/app/inscrieri/_StepConfirm.tsx` — agreement card stagger animation
- No changes to `_types.ts`, `page.tsx`, `_View.tsx`, or submission logic

---

## Design Decisions

### 1. Overall feel
Light, warm background (`#f8f7f5` or `bg-gray-50`) with white card panels. Approachable and trustworthy — suited to parents filling in children's details.

### 2. Step transitions — Lift + stagger
When advancing or going back between steps, the incoming form card:
- Fades in + translates up from `y: 16px` → `y: 0`
- Duration: ~0.6s, easing: `cubic-bezier(0.22, 1, 0.36, 1)` (snappy spring)
- Uses the `motion` library (already installed at `^12.29.0`)

Each input field within the card staggers in with a 120ms delay per field after the card itself arrives (fields are already rendered, just animated into view).

**Implementation:** Wrap the active step in a `<motion.div>` with `initial={{ opacity: 0, y: 16 }}` / `animate={{ opacity: 1, y: 0 }}`. Use a `key` prop tied to the current step number so React remounts the element on step change, triggering the animation.

### 3. Input focus feedback
Already partially present via `inputBaseOnCard` styles. Enhance with:
- `transform: translateY(-1px)` on focus (subtle lift)
- `box-shadow: 0 0 0 3px oklch(0.421 0.2593 264.52 / 0.12)` glow ring
- Both via Tailwind `focus:` utilities — no Motion needed

### 4. StepIndicator — Pill upgrade

Keep exact current structure: `rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-wider` pill containing icon + label text, connected by `h-px flex-1` lines.

**Three new states:**

| State | Visual | Animation |
|-------|--------|-----------|
| `upcoming` | Muted gray text, no background | — |
| `active` | Blue text, blue border ring, subtle blue bg tint | `pillGlow` keyframe — ring fades out from 0→6px radius |
| `done` | Solid blue fill, white text, ✓ replaces step icon | `checkPop` keyframe on the ✓ icon; `pillFill` transition on background |

**Connector line:** When a step completes, the connector line animates from gray → blue using a CSS fill animation (width 0% → 100%, duration 0.5s, delayed 0.15s after step change).

**Implementation:** Each pill renders two icon slots (step icon + check icon). CSS classes `done` / `active` / `upcoming` show/hide the correct icon and apply the fill. Motion is not needed here — pure CSS transitions + keyframes.

**Connector animation:** A nested `<div>` inside the `h-px` connector element, starting at `width: 0%` and animating to `width: 100%` via a CSS `@keyframes lineFill` rule triggered by adding a class when the step completes.

**Keyframes location:** All custom `@keyframes` (`checkPop`, `pillGlow`, `pillFillIn`, `lineFill`) are defined in `globals.css` under `@layer utilities`, consistent with the existing `hero-typewriter` and `hero-letter-in` keyframes already there.

---

## What Does NOT Change

- Form field structure, labels, validation logic
- `StepNavigation` component (back/continue buttons)
- Google Forms submission logic in `_types.ts`
- Success and error states (keep as-is)
- Page layout (`_View.tsx`, `PageHeroSection`, `SectionHeader`)

---

## Verification

1. Run `npm run dev` and navigate to `/inscrieri`
2. Confirm the stepper pills show correct done/active/upcoming states as you advance
3. Confirm the form card lifts in on each step change
4. Confirm input fields stagger in (slightly delayed, not instant)
5. Confirm clicking an input shows the focus glow
6. Confirm the Back button correctly restores previous stepper state
7. Confirm the success state still shows after submission
8. Run `npm run build` — no TypeScript errors
