"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * 70s scallop / pinwheel grid backdrop for the landing-v2 registration
 * section. A grid of cells, each split into four quarter-circle "pie"
 * quadrants in the warm palette; the TL + BR quadrants are flipped so they
 * point outward (the pinwheel). Each quadrant zooms + fades in individually,
 * staggered top-to-bottom, when the section scrolls into view. Rendered on a
 * transparent background so the pastel section colour shows through the gaps.
 *
 * Ported from the locked `registration-70s.html` mockup (option A). The
 * mockup's `Math.random()` stagger is replaced with a deterministic hash so
 * server and client render identically (no hydration mismatch).
 */

const COLS = [
  "var(--color-mustard)",
  "var(--color-orange)",
  "var(--color-rust)",
  "var(--color-burgundy)",
  "var(--color-brown)",
];

const R = 67;
const STEP = 134;
const XS = [67, 201, 335];
const YS = [67, 201, 335, 469, 603];
const MAX_Y = YS[YS.length - 1]! + R;

// Deterministic pseudo-random in [0,1) from an integer seed.
function hash(n: number): number {
  const s = Math.sin(n * 12.9898) * 43758.5453;
  return s - Math.floor(s);
}

interface Quad {
  d: string;
  fill: string;
  delay: number;
  dur: number;
}

function buildQuads(): Quad[] {
  const quads: Quad[] = [];
  let cell = 0;
  for (const y of YS) {
    for (const x of XS) {
      const paths = [
        // TR + BL keep their corner at the centre (arc bulges outward)
        `M${x},${y} L${x},${y - R} A${R},${R} 0 0 1 ${x + R},${y} Z`,
        // BR flipped: corner at the OUTER corner, points outside
        `M${x + R},${y + R} L${x + R},${y} A${R},${R} 0 0 0 ${x},${y + R} Z`,
        `M${x},${y} L${x},${y + R} A${R},${R} 0 0 1 ${x - R},${y} Z`,
        // TL flipped: corner at the OUTER corner, points outside
        `M${x - R},${y - R} L${x - R},${y} A${R},${R} 0 0 0 ${x},${y - R} Z`,
      ];
      paths.forEach((d, q) => {
        const seed = cell * 4 + q;
        quads.push({
          d,
          fill: COLS[(cell + q) % COLS.length]!,
          // Top-to-bottom bias + deterministic jitter.
          delay: (y / MAX_Y) * 0.7 + hash(seed) * 0.28,
          dur: 0.4 + hash(seed + 97) * 0.65,
        });
      });
      cell++;
    }
  }
  return quads;
}

const RegistrationPinwheelGrid: React.FC = () => {
  const quads = useMemo(buildQuads, []);
  const ref = useRef<SVGSVGElement>(null);
  const [play, setPlay] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false);
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setPlay(true);
          io.disconnect();
        }
      },
      { rootMargin: "-10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      aria-hidden
      className="absolute right-0 top-0 bottom-0 w-[62%] md:w-[48%] overflow-hidden pointer-events-none opacity-[0.28] md:opacity-100"
      style={{
        // Fade the left edge (toward the content) — on mobile the full-width
        // text sits over the grid, so it must not compete with it.
        WebkitMaskImage: "linear-gradient(to right, transparent, #000 55%)",
        maskImage: "linear-gradient(to right, transparent, #000 55%)",
      }}
    >
      <style>{`
        .reg-q { transform-box: fill-box; transform-origin: center; opacity: 0; }
        .reg-grid.play .reg-q { animation-name: regGrow; animation-timing-function: cubic-bezier(.34,1.3,.5,1); animation-fill-mode: forwards; }
        .reg-grid.reduced .reg-q { opacity: 1; animation: none; }
        @keyframes regGrow { from { opacity: 0; transform: scale(.15); } to { opacity: 1; transform: scale(1); } }
      `}</style>
      <svg
        ref={ref}
        className={`reg-grid h-full w-full ${play ? "play" : ""} ${reduced ? "reduced" : ""}`}
        viewBox="0 0 402 672"
        preserveAspectRatio="xMidYMid slice"
        style={{ opacity: 0.9 }}
      >
        {quads.map((q, i) => (
          <path
            key={i}
            className="reg-q"
            d={q.d}
            fill={q.fill}
            style={{ animationDelay: `${q.delay.toFixed(2)}s`, animationDuration: `${q.dur.toFixed(2)}s` }}
          />
        ))}
      </svg>
    </div>
  );
};

export default RegistrationPinwheelGrid;
