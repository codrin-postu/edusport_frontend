"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";

// Mirrors the 4 evergreen numbers surfaced on /despre-noi.
// Split into value + suffix so the number can count up on scroll.
const STATS = [
  { value: 10, suffix: "+", label: "Competiții pe an", bg: "bg-rust", text: "text-retro-cream" },
  { value: 150, suffix: "", label: "Copii pe sezon", bg: "bg-orange", text: "text-navy" },
  { value: 500, suffix: "+", label: "Sportivi formați", bg: "bg-mustard", text: "text-navy" },
  { value: 13, suffix: "+", label: "Ani de activitate", bg: "bg-pastel", text: "text-navy" },
] as const;

const COUNT_MS = 1200;

function CountUp({ target, suffix, run }: { target: number; suffix: string; run: boolean }) {
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!run) return;
    // Respect reduced-motion: jump straight to the final value.
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setN(target);
      return;
    }
    let raf = 0;
    let start = 0;
    const tick = (t: number) => {
      if (!start) start = t;
      const p = Math.min(1, (t - start) / COUNT_MS);
      const eased = 1 - Math.pow(1 - p, 3); // cubic ease-out
      setN(Math.round(eased * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, target]);

  return (
    <>
      {n}
      {suffix}
    </>
  );
}

export default function StatsStrip() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px" });

  return (
    <section className="bg-navy">
      <div
        ref={ref}
        className="grid grid-cols-2 md:grid-cols-4 gap-[3px]"
      >
        {STATS.map((s) => (
          <div
            key={s.label}
            className={`${s.bg} ${s.text} flex flex-col items-center justify-center text-center py-16 md:py-20 px-4`}
          >
            <span className="font-display text-display-lg font-extrabold leading-none tracking-[-0.02em]">
              <CountUp target={s.value} suffix={s.suffix} run={inView} />
            </span>
            <span className="mt-4 text-3xs md:text-2xs font-bold tracking-[0.24em] uppercase opacity-80">
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
