# Crystal Loader — Design Spec
_2026-04-16_

## Context

The existing page transition uses a `SkateLoader` (floating skate image + sparkle stars + dot trail) displayed while panels cover the screen. The user disliked the animation and also identified a 700 ms artificial hold (`HOLD_MS`) that adds unnecessary perceived latency. This spec defines the replacement.

## Decision

Replace `SkateLoader` with a **bouncing crystal (gem) animation** using the "P" (pause) variant: a 2.1 s cycle where the bounce action occupies the first 1.2 s and the gem rests on the ground for the remaining 0.9 s before the next bounce.

## Animation Spec — Crystal Loader (P variant)

**Shape:** SVG diamond gem (4 facets + highlight streak), identical to the prototype shown in brainstorming.

**Colors:** Ice-blue shimmer — facets cycle `#e0f2fe → #7dd3fc → #38bdf8` over 2.4 s, offset per facet.

**Bounce physics:**
- Duration: `2.1s`
- Easing: `cubic-bezier(0.36, 0, 0.66, -0.56)`
- Keyframes (% of 2.1 s cycle):
  - `0%`  — ground, natural scale
  - `17%` — mid-rise, slight stretch
  - `29%` — apex (`translateY(-48px)`), max stretch + 15° tilt
  - `40%` — mid-fall, slight compress
  - `49%` — landing, squash (`scaleX 1.08, scaleY 0.92`)
  - `57%` — settled, natural scale
  - `57–100%` — held still (rest phase)

**Shadow:** Oval shadow beneath the gem shrinks/fades during flight, expands on landing, held full during rest.

**Dot trail:** Three pulsing dots below the shadow (unchanged from original).

## Changes Required

| File | Change |
|------|--------|
| `src/components/SkateLoader.tsx` | Replace entire component with crystal gem animation |
| `src/components/PageTransition.tsx` | Remove `HOLD_MS = 700` delay (set to `0`) |

## What stays the same

- `PageTransition.tsx` panel slide logic, z-index, spinner timer, navigation interception — all untouched.
- The loader only shows if navigation takes longer than `COVER_MS` (~750 ms), same as before.

## Verification

1. Run `npm run dev`
2. Navigate from homepage (`/`) to any internal page — panels should cover, gem bounces if load is slow, panels uncover with no artificial hold
3. Visually confirm: gem bounces once, pauses, bounces again; shadow syncs; dots pulse
4. Confirm no delay between route change and uncover animation starting
