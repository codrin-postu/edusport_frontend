# Square Diagonal Transition Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the static 2-row CSS checkerboard seam between Registration and About Us with a scroll-driven diagonal square wipe — the Registration section stays pinned while white squares sweep TL→BR over it, then About Us renders naturally below on a white page.

**Architecture:** A new `SquareTransition` component creates a 200vh sticky scroll zone. Registration renders as a pinned background layer (z-0) behind a transparent canvas (z-5); white squares are drawn diagonally over it as the user scrolls. About Us renders as a normal section **below** the 200vh zone — no overlay needed. When the canvas reaches 100% white (all squares filled), the user scrolls past the sticky zone and About Us (bg-white) appears seamlessly below. This avoids SSR suppression, Framer Motion scroll-tracking issues inside overflow containers, and LazySection collapse timing risks.

**Tech Stack:** React 19, Next.js 15, TypeScript, Canvas 2D API, `ResizeObserver`, passive scroll listener.

---

## Architecture Diagram

```
_View.tsx
├── HeroSection
├── SquareTransition  (200vh sticky wrapper, ssr: true)
│   ├── background prop  → Registration or RegistrationClosed  (pinned, z-0, SSRs normally)
│   └── <canvas>  (transparent, z-5)  → white squares animate here
│   (no children overlay — About Us is a sibling below, not inside)
├── AboutUsSection  (normal section, bg-white, renders below the 200vh zone)
└── LinesTransition
    └── LatestArticleSection
```

**Why no overlay / why About Us is below:**
- Placing About Us as an overlay inside the sticky zone breaks Framer Motion's `useScroll` (it targets window scroll, not the inner overflow-y-auto container)
- Passing JSX children into a `ssr:false` dynamic component suppresses their SSR — harms SEO and causes CLS
- About Us has `bg-white`. The canvas ends fully white. The transition is seamless with zero additional code

---

## Animation spec (approved in preview — second iteration with 6 patterns, pattern "3 — Diagonal")

```
SIZE = 56px squares — no gap between squares

Phase 1  (p: 0.05 → 0.55)  — (r+c)%2===0 squares, TL→BR diagonal with slight sine wobble
Phase 2  (p: 0.38 → 0.68)  — (r+c)%2===1 gap squares, simple L→R sweep
(no reveal phase — About Us is a normal section below, not an overlay)

Diagonal front formula (Phase 1):
  const AMP = 1.5, FREQ = 0.45
  const front = easeOut(p1) * (cols + rows + 2)
  const wave  = Math.sin((r - c) * FREQ) * AMP
  // square visible when: c + r - wave <= front
```

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `src/app/homepage/blocks/SquareTransition.tsx` | **CREATE** | 200vh sticky zone; `background` prop pinned at z-0; transparent canvas at z-5 draws white squares driven by scroll |
| `src/app/homepage/blocks/RegistrationSection.tsx` | **MODIFY** | Remove `CrossTransition`, remove `paddingBottom`; remove outer `<section className="bg-white">` wrapper so component returns just the blue inner div |
| `src/app/homepage/blocks/RegistrationClosedSection.tsx` | **MODIFY** | Same removals — returns just the gradient inner div |
| `src/app/homepage/_View.tsx` | **MODIFY** | Import `SquareTransition` (`ssr: true`); pass Registration as `background` prop; `AboutUsSection` stays as a direct sibling below |

---

## Task 1: Create SquareTransition.tsx

**Files:**
- Create: `src/app/homepage/blocks/SquareTransition.tsx`

### Steps

- [ ] **Step 1: Create the file**

```tsx
"use client";

import React, { useEffect, useRef } from "react";

const SIZE = 56; // square side in px — no gap

// Phase p-ranges (match approved preview)
const PHASE1_S = 0.05, PHASE1_E = 0.55; // diagonal sweep — (r+c)%2===0
const PHASE2_S = 0.38, PHASE2_E = 0.68; // L→R gap fill — (r+c)%2===1

// Diagonal wave: slight sine wobble on the TL→BR front
const DIAG_AMP  = 1.5;
const DIAG_FREQ = 0.45;

function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function rv(p: number, s: number, e: number): number {
  return Math.max(0, Math.min(1, (p - s) / (e - s)));
}

interface SquareTransitionProps {
  // Registration section — rendered pinned behind the canvas, stays visible during the wipe
  background?: React.ReactNode;
}

export default function SquareTransition({ background }: SquareTransitionProps): React.ReactElement {
  const wrapRef   = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap   = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0, H = 0;

    function resize() {
      if (!canvas || !wrap) return;
      W = wrap.offsetWidth;
      H = window.innerHeight;
      canvas.width  = W;
      canvas.height = H;
    }

    function getP(): number {
      if (!wrap) return 0;
      const rect = wrap.getBoundingClientRect();
      return Math.max(0, Math.min(1, -rect.top / (wrap.offsetHeight - window.innerHeight)));
    }

    function draw(p: number) {
      if (!ctx) return;

      // Transparent clear — Registration background shows through until covered
      ctx.clearRect(0, 0, W, H);

      const cols = Math.ceil(W / SIZE) + 1;
      const rows = Math.ceil(H / SIZE) + 1;

      ctx.fillStyle = "#fff";

      // Phase 1: (r+c)%2===0 — TL→BR diagonal with sine wobble on the front
      const p1 = rv(p, PHASE1_S, PHASE1_E);
      if (p1 > 0) {
        const front = easeOut(p1) * (cols + rows + 2);
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            if ((r + c) % 2 !== 0) continue;
            const wave = Math.sin((r - c) * DIAG_FREQ) * DIAG_AMP;
            if (c + r - wave > front) continue;
            ctx.fillRect(c * SIZE, r * SIZE, SIZE, SIZE);
          }
        }
      }

      // Phase 2: (r+c)%2===1 — simple L→R sweep fills the checkerboard gaps
      const p2 = rv(p, PHASE2_S, PHASE2_E);
      if (p2 > 0) {
        const front = easeOut(p2) * (cols + 2);
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            if ((r + c) % 2 !== 1) continue;
            if (c > front) continue;
            ctx.fillRect(c * SIZE, r * SIZE, SIZE, SIZE);
          }
        }
      }
    }

    const resizeObserver = new ResizeObserver(() => { resize(); draw(getP()); });
    resizeObserver.observe(wrap);
    resize();
    draw(0);

    function onScroll() { requestAnimationFrame(() => draw(getP())); }
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div ref={wrapRef} className="relative" style={{ height: "200vh" }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Registration section — pinned behind canvas, pointer-events blocked once covered */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {background}
        </div>
        {/* Canvas — transparent initially; white squares drawn here as p increases */}
        <canvas ref={canvasRef} className="absolute inset-0 z-[5] w-full h-full" />
      </div>
    </div>
  );
}
```

> **Note on `pointer-events-none` on background:** The Registration section's CTAs and links are intentionally non-interactive while inside SquareTransition — they are only visible during the wipe animation. Users who want to interact with Registration content will do so before scrolling into the transition zone (Registration renders normally above in the layout — see Task 4).

- [ ] **Step 2: TypeScript check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/homepage/blocks/SquareTransition.tsx
git commit -m "feat(homepage): add SquareTransition diagonal canvas component"
```

---

## Task 2: Strip CrossTransition from RegistrationSection

**Files:**
- Modify: `src/app/homepage/blocks/RegistrationSection.tsx`

RegistrationSection is now used in two places: (a) as the `background` prop of `SquareTransition` (pinned, visual-only), and (b) it no longer needs the seam CSS. Remove:

- Constants: `SQUARE_SIZE`, `ROWS`
- Style objects: `CROSS_ROW_STYLE_EVEN`, `CROSS_ROW_STYLE_ODD`
- Component: `CrossTransition` definition
- JSX: `<CrossTransition />` usage
- The `paddingBottom: calc(4rem + ${SQUARE_SIZE * ROWS}px)` style on the inner div — including the entire `style={{ ... }}` prop if `paddingBottom` is its only entry
- The outer `<section className="bg-white"><div className="w-full">` wrapper — the component should return just the blue inner div directly

**After edit, return shape:**
```tsx
return (
  <div
    ref={sectionRef}
    className="relative overflow-hidden py-16 md:py-20 bg-edusport-blue"
  >
    {/* ... rest of content unchanged ... */}
  </div>
);
```

### Steps

- [ ] **Step 1: Remove CrossTransition block and outer wrapper**

Make the edits described above.

- [ ] **Step 2: TypeScript check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/homepage/blocks/RegistrationSection.tsx
git commit -m "refactor(homepage): remove CrossTransition from RegistrationSection"
```

---

## Task 3: Strip CrossTransition from RegistrationClosedSection

**Files:**
- Modify: `src/app/homepage/blocks/RegistrationClosedSection.tsx`

Identical removals to Task 2. The component should return just the gradient inner div directly.

**After edit, return shape:**
```tsx
return (
  <div
    className="relative overflow-hidden py-16 md:py-20"
    style={{
      background:
        "linear-gradient(135deg, oklch(0.18 0.04 264) 0%, oklch(0.28 0.06 264) 60%, oklch(0.32 0.05 240) 100%)",
    }}
  >
    {/* ... rest of content unchanged ... */}
  </div>
);
```

### Steps

- [ ] **Step 1: Remove CrossTransition block and outer wrapper**

- [ ] **Step 2: TypeScript check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/homepage/blocks/RegistrationClosedSection.tsx
git commit -m "refactor(homepage): remove CrossTransition from RegistrationClosedSection"
```

---

## Task 4: Wire SquareTransition into _View.tsx

**Files:**
- Modify: `src/app/homepage/_View.tsx`

### What changes

1. Add `SquareTransition` dynamic import — use **`ssr: true`** (all canvas ops are in `useEffect`; SSR renders just the HTML shell + background slot, which correctly includes Registration section markup for SEO)
2. Wrap the Registration conditional in `<SquareTransition background={...}>` — no children
3. Keep `<AboutUsSection>` as a direct sibling **below** `SquareTransition` — it renders normally, keeps its own `useScroll` animations, and its `bg-white` matches the fully-white canvas end state seamlessly
4. Remove `<LazySection>` from around `AboutUsSection` — it was only there to defer load; with this layout About Us is standard below-fold content that Next.js handles naturally
5. Remove standalone `SquareTransition` lazy wrapper — not needed since Registration is critical path

### Target _View.tsx

```tsx
"use client";

import React from "react";
import dynamic from "next/dynamic";
import { OrganizationJsonLd } from "@/components/JsonLd";
import HeroSection from "./blocks/HeroSection";
import type { HomepageCms } from "./_types";
import type { LatestArticleData } from "./blocks/LatestArticleSection";

const RegistrationSection = dynamic(
  () => import("./blocks/RegistrationSection"),
  { ssr: true },
);
const RegistrationClosedSection = dynamic(
  () => import("./blocks/RegistrationClosedSection"),
  { ssr: true },
);
const SquareTransition = dynamic(
  () => import("./blocks/SquareTransition"),
  { ssr: true },
);
const AboutUsSection = dynamic(() => import("./blocks/AboutUsSection"), {
  ssr: true,
});
const LatestArticleSection = dynamic(
  () => import("./blocks/LatestArticleSection"),
  { ssr: true },
);
const LinesTransition = dynamic(
  () => import("./blocks/LinesTransition"),
  { ssr: false },
);

interface HomePageProps {
  registrationOpen?: boolean;
  cms?: HomepageCms;
  latestArticles?: LatestArticleData[];
}

const HomePage: React.FC<HomePageProps> = ({ registrationOpen = true, cms = {}, latestArticles }) => {
  return (
    <div>
      <OrganizationJsonLd />
      <HeroSection
        motto={cms.hero?.motto}
        ctaLabel={cms.hero?.ctaLabel}
        ctaUrl={cms.hero?.ctaUrl}
      />
      <SquareTransition
        background={
          registrationOpen
            ? <RegistrationSection cms={cms.registration} />
            : <RegistrationClosedSection cms={cms.registrationClosed} />
        }
      />
      <AboutUsSection cms={cms.about} />
      <LinesTransition>
        <LatestArticleSection articles={latestArticles} />
      </LinesTransition>
    </div>
  );
};

export default HomePage;
```

> **Note:** `LazySection` import is removed since it is no longer used anywhere in this file.

### Steps

- [ ] **Step 1: Apply the full file update above**

- [ ] **Step 2: TypeScript check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Build check**

```bash
npm run build
```

Expected: build succeeds with no errors or warnings about unused imports.

- [ ] **Step 4: Commit**

```bash
git add src/app/homepage/_View.tsx
git commit -m "feat(homepage): wire SquareTransition — Registration pins, diagonal wipe, About Us below"
```

---

## Verification Checklist

After all tasks complete:

- [ ] `npm run dev` — scroll from top: Registration section is visible and pinned at p=0; white squares sweep TL→BR diagonally; at p≈0.68 canvas is fully white; user scrolls past the 200vh zone and About Us appears naturally below with no visible seam (both are white)
- [ ] Scroll back up — animation reverses correctly (p returns to 0, Registration becomes visible again through the transparent canvas)
- [ ] Resize window mid-animation — canvas redraws at new dimensions, no stretched or clipped squares
- [ ] `registrationOpen=false` path — `RegistrationClosedSection` (dark gradient) pins behind canvas; same diagonal animation works
- [ ] About Us `useScroll` animations work correctly (it's a normal DOM section, not inside an overflow container)
- [ ] `npm run build` — zero TypeScript errors, zero build errors
- [ ] `npm run lint` — no lint violations
