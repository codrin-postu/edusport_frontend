import React from "react";
import { cn } from "@/utils/cn";
import { Icon, type IconName } from "@/components/ui/icon";

export type MedalPlace = 1 | 2 | 3;

const MEDAL: Record<MedalPlace, { icon: IconName; label: string }> = {
  1: { icon: "medal-gold", label: "Aur" },
  2: { icon: "medal-silver", label: "Argint" },
  3: { icon: "medal-bronze", label: "Bronz" },
};

/**
 * Medal icon with a hover tooltip showing its label ("Aur" or, with an
 * override, e.g. "Aur, locul 1"). Shared between the Realizări results
 * table and the athlete skate-results list, so both render the same medal.
 */
export function Medal({
  place,
  label,
  className,
}: {
  place: MedalPlace;
  label?: string;
  className?: string;
}) {
  const medal = MEDAL[place];
  const name = label ?? medal.label;
  return (
    <span className={cn("group relative inline-flex shrink-0", className)}>
      <Icon name={medal.icon} size="md" label={name} />
      <span
        aria-hidden="true"
        className="text-caption pointer-events-none absolute bottom-full left-1/2 z-popup mb-2 -translate-x-1/2 whitespace-nowrap bg-surface-dark px-2 py-1 font-semibold text-primary-on-dark opacity-0 transition-opacity duration-fast group-hover:opacity-100"
      >
        {name}
      </span>
    </span>
  );
}

/** One medal icon plus its count, e.g. gold medal + "5". */
export function MedalCount({ place, count }: { place: MedalPlace; count: number }) {
  return (
    <span className="inline-flex items-center gap-2">
      <Medal place={place} />
      <span className="text-body font-semibold text-primary tabular-nums">{count}</span>
    </span>
  );
}

/**
 * Gold/silver/bronze totals as a row of medal icons + counts. A medal type
 * with a count of 0 is hidden, and the whole strip is hidden when there are
 * no medals at all. Shared by the Realizări season summary and the athlete
 * profile's competition history sections.
 */
export function MedalTotals({
  gold,
  silver,
  bronze,
  className,
}: {
  gold: number;
  silver: number;
  bronze: number;
  className?: string;
}) {
  if (gold === 0 && silver === 0 && bronze === 0) return null;
  return (
    <div className={cn("flex flex-wrap items-center gap-x-4 gap-y-2", className)}>
      <span className="text-label text-secondary">Medalii</span>
      {gold > 0 && <MedalCount place={1} count={gold} />}
      {silver > 0 && <MedalCount place={2} count={silver} />}
      {bronze > 0 && <MedalCount place={3} count={bronze} />}
    </div>
  );
}

export default Medal;
