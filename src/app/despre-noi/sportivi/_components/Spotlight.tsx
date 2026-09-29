import React from "react";
import type {
  StrapiSportsperson,
  SportspersonStats,
} from "@/lib/strapi-sportsperson";
import { Stat } from "@/components/ui/stat";
import NameStack from "@/components/ui/name-stack";
import { SportspersonCard } from "./SportspersonCard";

/**
 * Editorial spread spotlighting one athlete at the top of the index page.
 *
 * Picks visual cues from the magazine-style B mockup: eyebrow with a
 * pulsing dot, two-line stacked filled + stroke name treatment,
 * descriptive paragraph, and three stat rows with thin animated bar
 * fills.
 *
 * The trading card on the right side reuses the same SportspersonCard
 * component as the grid below (so editors see the exact card they'll get
 * elsewhere). The card is rendered at `size="spotlight"` which adds the
 * foil overlay and bumps the dimensions.
 */

interface Props {
  sportsperson: StrapiSportsperson;
  stats: SportspersonStats;
}

export function Spotlight({ sportsperson, stats }: Props) {
  return (
    <section className="relative overflow-hidden bg-surface border-b-retro border-line-subtle gutter section text-primary">
      <div className="relative grid grid-cols-1 items-center gap-12 md:grid-cols-[1.5fr_1fr]">
        {/* Left: editorial copy + stats */}
        <div>
          {/* Stacked filled + stroke name — the editorial signature treatment */}
          <h2 className="text-athlete-name mb-6">
            <NameStack name={sportsperson.name} />
          </h2>

          {sportsperson.description && (
            <p className="text-body-sm mb-8 max-w-narrow text-secondary">
              {sportsperson.description}
            </p>
          )}

          <div className="flex max-w-narrow flex-col gap-4">
            <Stat
              size="xl"
              layout="inline"
              valueClassName="min-w-[100px]"
              value={String(stats.totalCompetitions).padStart(2, "0")}
              label="Competiții"
              accent
              className="gap-4 border-t border-line-subtle pt-4 first:border-t-0 first:pt-0"
            />
            <Stat
              size="xl"
              layout="inline"
              valueClassName="min-w-[100px]"
              value={stats.bestScore !== null ? stats.bestScore.toFixed(2) : "—"}
              label="Cel mai bun scor"
              className="gap-4 border-t border-line-subtle pt-4 first:border-t-0 first:pt-0"
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
            retro
          />
        </div>
      </div>
    </section>
  );
}

export default Spotlight;
