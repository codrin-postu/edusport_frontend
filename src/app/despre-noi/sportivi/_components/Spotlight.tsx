import React from "react";
import { cn } from "@/utils/cn";
import type {
  StrapiSportsperson,
  SportspersonStats,
} from "@/lib/strapi-sportsperson";
import { SportspersonCard } from "./SportspersonCard";

/**
 * Editorial spread spotlighting one athlete at the top of the index page.
 *
 * Picks visual cues from the magazine-style B mockup: a giant outlined
 * number watermark, eyebrow with a pulsing dot, two-line stacked filled +
 * stroke name treatment, descriptive paragraph, and three stat rows with
 * thin animated bar fills.
 *
 * The trading card on the right side reuses the same SportspersonCard
 * component as the grid below (so editors see the exact card they'll get
 * elsewhere). The card is rendered at `size="spotlight"` which adds the
 * foil overlay and bumps the dimensions.
 */

interface Props {
  sportsperson: StrapiSportsperson;
  stats: SportspersonStats;
  /** 1-based rank for the giant outlined number watermark. */
  rank: number;
}

export function Spotlight({ sportsperson, stats, rank }: Props) {
  return (
    <section className="relative overflow-hidden bg-edusport-blue px-6 py-16 md:px-10 md:py-20 text-white">
      {/* Giant outlined rank number — top right watermark */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-6 top-3 select-none text-[140px] md:text-[220px] font-black leading-[0.82] tracking-[-0.05em]"
        style={{
          color: "transparent",
          WebkitTextStroke: "1.5px rgba(255,255,255,0.12)",
        }}
      >
        {String(rank).padStart(2, "0")}
      </div>

      <div className="relative grid grid-cols-1 items-center gap-12 md:grid-cols-[1.5fr_1fr]">
        {/* Left: editorial copy + stats */}
        <div>
          <div className="mb-[18px] inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.32em] text-[#fbbf24]">
            <span
              aria-hidden
              className="text-[#fbbf24] motion-safe:animate-pulse"
            >
              ●
            </span>
            În atenție
          </div>

          {/* Stacked filled + stroke name — the editorial signature treatment */}
          <h2 className="mb-6 font-black leading-[0.9] tracking-[-0.045em] text-[56px] md:text-[88px]">
            <NameStack name={sportsperson.name} />
          </h2>

          {sportsperson.description && (
            <p className="mb-[30px] max-w-[460px] text-[14px] font-light leading-[1.6] text-white/75">
              {sportsperson.description}
            </p>
          )}

          <div className="flex max-w-[460px] flex-col gap-4">
            <StatRow
              value={String(stats.totalCompetitions).padStart(2, "0")}
              label="Competiții"
              accent
            />
            <StatRow
              value={stats.bestScore !== null ? stats.bestScore.toFixed(2) : "—"}
              label="Cel mai bun scor"
            />
          </div>
        </div>

        {/* Right: spotlight card (same component as the grid uses) */}
        <div className="flex justify-center md:justify-end">
          <SportspersonCard
            sportsperson={sportsperson}
            stats={stats}
            size="spotlight"
            restingRotation={-2}
          />
        </div>
      </div>
    </section>
  );
}

/** Render an athlete's name as two stacked words — first filled white,
 *  second outlined. The editorial signature treatment on a blue ground. */
function NameStack({ name }: { name: string }) {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.toUpperCase() ?? "";
  const rest = parts.slice(1).join(" ").toUpperCase();
  return (
    <>
      <span className="block text-white">{first}</span>
      {rest && (
        <span
          className="block"
          style={{
            color: "transparent",
            WebkitTextStroke: "1.5px #fff",
          }}
        >
          {rest}
        </span>
      )}
    </>
  );
}

function StatRow({
  value,
  label,
  accent = false,
}: {
  value: string;
  label: string;
  /** Use medal-gold colour for the number (signals "lead metric"). */
  accent?: boolean;
}) {
  return (
    <div className="flex items-baseline gap-[14px] border-t border-white/15 pt-[14px] first:border-t-0 first:pt-0">
      <span
        className={cn(
          "min-w-[100px] text-[44px] font-black leading-[0.9] tracking-[-0.03em]",
          accent ? "text-[#fbbf24]" : "text-white",
        )}
      >
        {value}
      </span>
      <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/60">
        {label}
      </div>
    </div>
  );
}

export default Spotlight;
