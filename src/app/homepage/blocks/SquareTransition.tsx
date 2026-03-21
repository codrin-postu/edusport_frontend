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
