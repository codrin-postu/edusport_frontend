"use client";

import React, { useEffect, useRef } from "react";

// ── Band definitions ───────────────────────────────────────
// Center band (dist=0) rises first; outer bands (dist=2) rise last.
// This creates a symmetric burst from the middle of the screen.
interface Band {
  xFrac: number; // left edge as fraction of W
  wFrac: number; // width as fraction of W
  dist: number;  // distance from center (0=center, 2=outermost)
}

const BANDS: Band[] = [
  { xFrac: 0.00,  wFrac: 0.205, dist: 2 },
  { xFrac: 0.20,  wFrac: 0.205, dist: 1 },
  { xFrac: 0.40,  wFrac: 0.205, dist: 0 }, // center - rises first
  { xFrac: 0.60,  wFrac: 0.205, dist: 1 },
  { xFrac: 0.795, wFrac: 0.205, dist: 2 },
];

// Target background colour - must match LatestArticleSection bg
const BG = "238,242,251"; // #eef2fb brand-blue tint

// p range where children overlay fades in (all bands fully up by ~0.62)
const REVEAL_START = 0.62;
const REVEAL_END   = 0.80;

// ── Easing ─────────────────────────────────────────────────
function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function rv(p: number, s: number, e: number): number {
  return Math.max(0, Math.min(1, (p - s) / (e - s)));
}

// ── Component ──────────────────────────────────────────────
interface LinesTransitionProps {
  children?: React.ReactNode;
}

export default function LinesTransition({ children }: LinesTransitionProps): React.ReactElement {
  const wrapRef          = useRef<HTMLDivElement>(null);
  const canvasRef        = useRef<HTMLCanvasElement>(null);
  const childrenRef      = useRef<HTMLDivElement>(null);
  const childOverflowRef = useRef(0);

  useEffect(() => {
    const wrap       = wrapRef.current;
    const canvas     = canvasRef.current;
    const childrenEl = childrenRef.current;
    if (!wrap || !canvas || !childrenEl) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0;
    let H = 0;

    function resize() {
      if (!canvas || !wrap) return;
      W = wrap.offsetWidth;
      H = window.innerHeight;
      canvas.width  = W;
      canvas.height = H;

      // Measure how much article content overflows the viewport.
      // The wrapper grows by that amount so page scroll can reveal it.
      childOverflowRef.current = Math.max(0, (childrenRef.current?.scrollHeight ?? 0) - H);
      wrap.style.height = `calc(160vh + ${childOverflowRef.current}px)`;
    }

    function getScrolled(): number {
      if (!wrap) return 0;
      return Math.max(0, -wrap.getBoundingClientRect().top);
    }

    function getP(): number {
      if (!wrap) return 0;
      // Animation portion = wrapper height − viewport − child overflow = 160vh − 100vh = 60vh
      const animTotal = wrap.offsetHeight - H - childOverflowRef.current;
      return animTotal > 0 ? Math.max(0, Math.min(1, getScrolled() / animTotal)) : 0;
    }

    function draw(p: number) {
      if (!ctx || !childrenEl || !wrap) return;
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = `rgb(${BG})`;

      for (const band of BANDS) {
        const s = 0.04 + band.dist * 0.15;
        const t = easeOut(rv(p, s, s + 0.28));
        if (t <= 0) continue;
        ctx.fillRect(band.xFrac * W, H - H * t, band.wFrac * W, H * t);
      }

      const ao = rv(p, REVEAL_START, REVEAL_END);
      childrenEl.style.opacity = String(ao);
      childrenEl.style.pointerEvents = ao > 0.3 ? "auto" : "none";

      // Post-animation: translate content upward with page scroll so all of
      // it is reachable without an inner scroll container.
      if (childOverflowRef.current > 0) {
        const animTotal = wrap.offsetHeight - H - childOverflowRef.current;
        const childScrolled = Math.max(0, getScrolled() - animTotal);
        childrenEl.style.transform = `translateY(-${Math.min(childScrolled, childOverflowRef.current)}px)`;
      }
    }

    const resizeObserver = new ResizeObserver(() => {
      resize();
      draw(getP());
    });
    resizeObserver.observe(wrap);
    if (childrenRef.current) resizeObserver.observe(childrenRef.current);

    resize();
    draw(0);

    function onScroll() {
      requestAnimationFrame(() => draw(getP()));
    }

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div ref={wrapRef} className="relative" style={{ height: "160vh", marginTop: "-30vh" }}>
      <div className="sticky top-0 h-screen overflow-hidden" style={{ zIndex: 20 }}>
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        <div
          ref={childrenRef}
          className="absolute inset-0 z-10 opacity-0 pointer-events-none bg-[#eef2fb]"
        >
          {children}
        </div>
      </div>
    </div>
  );
}
