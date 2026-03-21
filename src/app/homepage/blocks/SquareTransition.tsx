"use client";

import React, { useEffect, useRef } from "react";

const SIZE = 56; // square side in px — no gap

// Phase p-ranges
// PHASE1_S > 0 is intentional: gives a brief pinned idle window before animation begins,
// and ensures p < PHASE1_S is true at p=0 so registration buttons are interactive.
const PHASE1_S = 0.12, PHASE1_E = 0.65; // diagonal sweep — (r+c)%2===0
const PHASE2_S = 0.45, PHASE2_E = 0.82; // L→R gap fill — (r+c)%2===1
const REVEAL_S = 0.78, REVEAL_E = 0.98; // children overlay fade-in

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
  background?: React.ReactNode;           // registration content — visible until canvas covers it
  bgStyle?: React.CSSProperties;          // solid bg override (e.g. dark gradient for closed state)
  children?: React.ReactNode;             // overlay revealed after wipe completes
  childScrollBudget?: number;             // extra viewport-heights of scroll allocated after wipe
  onChildScrollProgress?: (p: number) => void; // fires each scroll tick during post-wipe phase, 0→1
}

export default function SquareTransition({
  background,
  bgStyle,
  children,
  childScrollBudget = 0,
  onChildScrollProgress,
}: SquareTransitionProps): React.ReactElement {
  const wrapRef       = useRef<HTMLDivElement>(null);
  const canvasRef     = useRef<HTMLCanvasElement>(null);
  const childrenRef   = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const regOverflowRef          = useRef(0);
  const childScrollBudgetPxRef  = useRef(0);
  const onChildScrollProgressRef = useRef(onChildScrollProgress);
  onChildScrollProgressRef.current = onChildScrollProgress;

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

      // Registration overflow: backgroundRef is h-full/overflow-hidden so measure its first child.
      const regEl = backgroundRef.current?.firstElementChild as HTMLElement | null;
      regOverflowRef.current = Math.max(0, (regEl?.scrollHeight ?? 0) - H);

      // Explicit child scroll budget — no scrollHeight measurement needed.
      childScrollBudgetPxRef.current = childScrollBudget * H;

      // Wrapper = 200vh animation + registration pre-scroll + child scroll budget
      wrap.style.height = `calc(200vh + ${regOverflowRef.current}px + ${childScrollBudgetPxRef.current}px)`;
    }

    function getScrolled(): number {
      if (!wrap) return 0;
      return Math.max(0, -wrap.getBoundingClientRect().top);
    }

    function getP(): number {
      if (!wrap) return 0;
      const animScrolled = Math.max(0, getScrolled() - regOverflowRef.current);
      const animTotal = wrap.offsetHeight - H - regOverflowRef.current - childScrollBudgetPxRef.current;
      return animTotal > 0 ? Math.max(0, Math.min(1, animScrolled / animTotal)) : 0;
    }

    function draw(p: number) {
      if (!ctx || !wrap) return;

      const scrolled = getScrolled();

      // Pre-scroll phase: translate registration content up to reveal its bottom on small screens.
      if (backgroundRef.current) {
        const preScrolled = Math.min(scrolled, regOverflowRef.current);
        backgroundRef.current.style.transform = `translateY(-${preScrolled}px)`;
      }

      // Post-animation phase: fire scroll progress callback for child panel switching.
      if (childScrollBudgetPxRef.current > 0) {
        const animTotal = wrap.offsetHeight - H - regOverflowRef.current - childScrollBudgetPxRef.current;
        const childScrollStart = regOverflowRef.current + animTotal;
        const childScrolled = Math.max(0, scrolled - childScrollStart);
        const childProgress = Math.min(1, childScrolled / childScrollBudgetPxRef.current);
        onChildScrollProgressRef.current?.(childProgress);
      }

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

      // Children reveal: fade in while canvas turns white
      const pReveal = Math.max(0, Math.min(1, (p - REVEAL_S) / (REVEAL_E - REVEAL_S)));
      if (childrenRef.current && children != null) {
        childrenRef.current.style.opacity = String(pReveal);
        childrenRef.current.style.pointerEvents = pReveal > 0 ? "auto" : "none";
      }

      // Registration interaction: allow clicks before animation starts
      if (backgroundRef.current) {
        backgroundRef.current.style.pointerEvents = p < PHASE1_S ? "auto" : "none";
      }
    }

    const resizeObserver = new ResizeObserver(() => { resize(); draw(getP()); });
    resizeObserver.observe(wrap);
    resize();
    draw(0);

    let rafId = 0;
    function onScroll() {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => draw(getP()));
    }
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      resizeObserver.disconnect();
      cancelAnimationFrame(rafId);
    };
  }, [childScrollBudget]);

  return (
    <div ref={wrapRef} className="relative" style={{ height: "200vh" }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Solid background — fills full viewport, prevents white line */}
        <div className="absolute inset-0 z-0 bg-edusport-blue" style={bgStyle} />
        {/* Registration content — interactive at p=0, blocked once animation starts */}
        <div ref={backgroundRef} className="absolute inset-0 z-[1]">
          {background}
        </div>
        {/* Canvas — pointer-events-none so touches reach registration beneath */}
        <canvas ref={canvasRef} className="absolute inset-0 z-[5] w-full h-full pointer-events-none" />
        {/* Children overlay — revealed imperatively once canvas is fully white */}
        <div
          ref={childrenRef}
          className="absolute inset-0 z-10"
          style={{ opacity: 0, pointerEvents: "none" }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
