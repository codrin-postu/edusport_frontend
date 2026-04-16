# Homepage Animations & Performance — Design Spec
**Date:** 2026-03-21
**Status:** Approved (v2)

---

## Context

Three animation improvement areas on the EduSport homepage:

1. **Article section transition** — `LinesTransition` canvas (5 rising vertical bands) precedes `LatestArticleSection`. Replace with per-card scroll-reveal so each article card animates independently.

2. **About Us section** — `AboutUsSection` currently just fades in as a static block. Add a sticky-split scroll pattern: notebook stays pinned on the left, right-side text swaps through 3 panels as the user scrolls.

3. **Performance** — Heavy initial JS download. Fixes: delete dead `RinkTransition.tsx` (750 lines, never imported), remove `LinesTransition`, activate unused `LazySection`, and simplify `AboutUsSection` to not need `motion`.

---

## Change 1 — Replace LinesTransition with Article Card Scroll Reveal

### What changes
- Delete `LinesTransition.tsx` and remove its `dynamic()` import from `_View.tsx`
- Remove the `<LinesTransition>` wrapper around `<LatestArticleSection>`
- Add `whileInView` staggered slide-up animations to `LatestArticleSection` card elements (`motion/react` is already imported in that file for hover states)

### Animation spec
```
Featured card:  opacity 0→1, translateY 24px→0, duration 500ms, delay 100ms, ease-out, once:true
List item 1:    opacity 0→1, translateY 24px→0, duration 500ms, delay 250ms
List item 2:    delay 400ms
List item 3:    delay 550ms
Trigger:        whileInView, viewport={{ once: true, margin: "-80px" }}
```

### Files
- `src/app/homepage/blocks/LinesTransition.tsx` — **DELETE**
- `src/app/homepage/_View.tsx` — remove LinesTransition dynamic import + wrapper
- `src/app/homepage/blocks/LatestArticleSection.tsx` — wrap featured card + list items in `motion.div` with above config

---

## Change 2 — About Us Sticky Split Scroll

### Structural change in `_View.tsx`

`AboutUsSection` currently lives inside `SquareTransition`'s `children` prop, which renders it as `position: absolute; inset: 0` — incompatible with a 300vh scroll wrapper. The fix: **remove `AboutUsSection` from `SquareTransition`** and place it as a standalone section immediately after. `SquareTransition` children becomes `null` — the canvas wipe simply reveals a white section, and the About Us story begins below it.

New `_View.tsx` structure:
```tsx
<SquareTransition
  background={registrationOpen ? <RegistrationSection/> : <RegistrationClosedSection/>}
  bgStyle={registrationOpen ? undefined : closedBgStyle}
>
  {null}  {/* wipe reveals white — About Us follows below */}
</SquareTransition>

<AboutUsSection cms={cms.about} />   {/* now standalone — can own its scroll height */}

<LazySection minHeight="600px">
  <LatestArticleSection articles={latestArticles} />
</LazySection>
<div className="bg-[#eef2fb] h-24 -mb-24 md:h-32 md:-mb-32" aria-hidden="true" />
```

> Note: The color-fill div stays **outside** `LazySection` so it always renders and prevents footer spacing collapse.

### Layout (desktop, `md:`)

```
<section class="bg-white relative" style="height: 300vh">        ← scroll space
  <div class="sticky top-0 h-screen overflow-hidden py-16">      ← pinned viewport
    <div class="max-w-5xl mx-auto px-4 md:px-8 lg:px-12
                grid md:grid-cols-2 gap-16 items-center h-full">
      ├── LEFT: notebook (existing JSX, completely static)
      └── RIGHT: text panels (position relative, overflow hidden)
    </div>
    <div class="absolute top-0 left-0 right-0 h-0.5 bg-gray-100"> ← progress bar
      <div id="progress-fill" class="h-full bg-edusport-blue transition-[width]"/>
    </div>
  </div>
</section>
```

### Mobile (`< md`)
Below the `md` breakpoint the sticky scroll is disabled — the section renders as a normal static layout (same as current, stacked single column). This avoids overflow issues on small viewports. Implementation: check `window.innerWidth < 768` before attaching the scroll listener; on mobile show only panel-0.

### Panel content
Three panels, each matching the existing CMS field shape (`eyebrow`, `heading`, `body`, `ctaLabel`, `ctaUrl`):

| Panel | eyebrow | heading | body (truncated) | ctaLabel | ctaUrl |
|-------|---------|---------|------------------|----------|--------|
| 0 | `cms.about.eyebrow ?? "Cine suntem"` | `cms.about.heading ?? "Asociație non-profit\npentru sport și educație"` | `cms.about.body ?? "Fondată în 2012…"` | `cms.about.ctaLabel ?? "Despre noi"` | `cms.about.ctaUrl ?? "/despre-noi"` |
| 1 | `"Echipa noastră"` | `"Antrenori dedicați,\ncursanți motivați"` | `"Patru antrenori certificați FRPA, fiecare cu o poveste proprie pe gheață. Împreună ghidează peste 50 de cursanți în 6 grupe."` | `"Cunoaște echipa"` | `"/despre-noi/echipa"` |
| 2 | `"Realizările noastre"` | `"32 de medalii\nși tot înainte"` | `"De la primul campionat național la competiții internaționale, cursanții EduSport au urcat pe podium de 32 de ori în 8 ani."` | `"Vezi realizările"` | `"/despre-noi/realizari"` |

### Panel transition
- Entering: `translateY(28px) opacity:0` → `translateY(0) opacity:1`, 550ms, `cubic-bezier(0.22,1,0.36,1)`
- Exiting (scrolled past): `translateY(-28px) opacity:0`
- CSS transitions only (no `motion` library needed in this component)

### Step indicator (replaces dots)
```html
<div class="mt-7 flex items-center gap-2.5">
  <div class="w-5 h-px bg-gray-300"/>
  <span class="text-[10px] text-gray-300 uppercase tracking-[0.15em] select-none">01 / 03</span>
</div>
```
Not interactive — purely decorative text.

### Ghost number
```html
<div aria-hidden class="absolute right-0 top-1/2 -translate-y-1/2 font-['League_Spartan']
                        text-[160px] font-black leading-none pointer-events-none select-none"
     style="color: rgba(0,0,0,0.03)">
  01 {/* updated via JS */}
</div>
```

### Scroll driver
```ts
// sectionRef = the outer <section> with height:300vh
// step = 0 | 1 | 2

function getStep(sectionEl: HTMLElement): number {
  const scrolled   = -sectionEl.getBoundingClientRect().top;
  const scrollable = sectionEl.offsetHeight - window.innerHeight;  // ≈ 2 × vh
  if (scrolled <= 0)          return 0;
  if (scrolled >= scrollable) return 2;
  return Math.min(2, Math.floor((scrolled / scrollable) * 3));
}
```
- `scrollable = 300vh - 100vh = 200vh` (2 × window.innerHeight)
- `Math.min(2, ...)` clamp prevents out-of-bounds index at `frac = 1.0`

Progress bar width: `33% / 66% / 100%` per step, via CSS `transition-[width]`.

### Resize handling
```ts
useEffect(() => {
  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('resize', handleScroll, { passive: true });
  return () => {
    window.removeEventListener('scroll', handleScroll);
    window.removeEventListener('resize', handleScroll);
  };
}, []);
```
`getBoundingClientRect()` recalculates on every event so no cached values become stale.

### Additional fix — SquareTransition null-children guard
When `children` is `null`, `SquareTransition`'s `draw()` still sets `pointerEvents: "auto"` on the empty `absolute inset-0 z-10` overlay div, blocking all clicks in the viewport after the wipe completes. Add a guard in `draw()`:

```ts
// Only mutate childrenRef styles when children is non-null
if (childrenRef.current && children != null) {
  childrenRef.current.style.opacity = String(pReveal);
  childrenRef.current.style.pointerEvents = pReveal > 0 ? "auto" : "none";
}
```

### Files
- `src/app/homepage/_View.tsx` — remove AboutUsSection from SquareTransition children; see structure above
- `src/app/homepage/blocks/SquareTransition.tsx` — add null-children guard in `draw()` as above
- `src/app/homepage/blocks/AboutUsSection.tsx` — full animation layer rewrite; notebook JSX preserved verbatim; no `motion` import

---

## Change 3 — Performance: Dead Code & LazySection

### 3a. Delete RinkTransition.tsx
`src/app/homepage/blocks/RinkTransition.tsx` — **DELETE** (750 lines, never imported anywhere — confirmed by grep showing only self-reference).

### 3b. Activate LazySection
`LazySection` uses `IntersectionObserver` with 200px root margin. It already exists at `src/app/homepage/LazySection.tsx` but is not imported anywhere.

**Fix `LazySection` placeholder first:** the current placeholder renders `style={{ minHeight: "1px" }}` regardless of the `minHeight` prop. Change line 31 to use the prop:
```tsx
// LazySection.tsx — placeholder when not yet visible
return <div style={{ minHeight }} />;  // was: style={{ minHeight: "1px" }}
```

Add a static import to `_View.tsx`:
```ts
import LazySection from "./LazySection";
```
Wrap `LatestArticleSection` as shown in the `_View.tsx` structure above. Pass `minHeight="600px"` — this prevents the color-fill div's `-mb-24` negative margin from collapsing before the section renders.

> `LazySection` is a `"use client"` component; static import works fine since `_View.tsx` is already `"use client"`.

### 3c. Bundle impact summary
After all changes:
- `LinesTransition.tsx` removed (~150 lines, 1 dynamic chunk eliminated)
- `RinkTransition.tsx` removed (~750 lines, never in bundle but eliminates dead file)
- `AboutUsSection.tsx` no longer imports `motion/react`
- `LatestArticleSection.tsx` adds `motion.div` usage (motion already in bundle via other components — no net size increase)
- Net: 1 fewer JS chunk (LinesTransition), 1 fewer `motion` import site

---

## Files Summary

| File | Action |
|------|--------|
| `src/app/homepage/blocks/LinesTransition.tsx` | DELETE |
| `src/app/homepage/blocks/RinkTransition.tsx` | DELETE |
| `src/app/homepage/_View.tsx` | Remove LinesTransition dynamic import + wrapper; move AboutUsSection out of SquareTransition children; add LazySection import + wrapper |
| `src/app/homepage/blocks/SquareTransition.tsx` | Add null-children guard in `draw()` to prevent pointer-event capture |
| `src/app/homepage/blocks/AboutUsSection.tsx` | Rewrite animation layer (sticky scroll); preserve notebook JSX; remove motion import |
| `src/app/homepage/blocks/LatestArticleSection.tsx` | Add stagger scroll-reveal to featured card + list items |
| `src/app/homepage/LazySection.tsx` | Fix placeholder to use `minHeight` prop (was hardcoded `1px`) |

---

## Verification

1. **Dev server** (`npm run dev`):
   - Scroll homepage end-to-end — confirm About Us sticky scroll (3 panels, notebook static)
   - Confirm articles stagger in below About Us (no canvas bands)
   - Mobile (`< 768px`): confirm static layout, no overflow, no sticky behavior
   - No console errors, no hydration warnings
2. **Build** (`npm run build`): no TypeScript errors
3. **Network tab**: confirm no JS chunks named `LinesTransition` or `RinkTransition`
4. **Spacing**: confirm `#eef2fb` background extends correctly to footer after LinesTransition removal
