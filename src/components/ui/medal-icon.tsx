import React from "react";
import { cn } from "@/utils/cn";

export type MedalPlace = 1 | 2 | 3;

const MEDAL: Record<MedalPlace, { fill: string; label: string }> = {
  1: { fill: "var(--color-medal-gold)", label: "Aur" },
  2: { fill: "var(--color-medal-silver)", label: "Argint" },
  3: { fill: "var(--color-medal-bronze)", label: "Bronz" },
};

// The medal face is a square with pixel-stepped corners: the site has no
// rounded shapes, so the corners step like pixel art instead of curving.
const FACE =
  "M6 8 L17.5 8 L17.5 9.5 L19 9.5 L19 22.5 L17.5 22.5 L17.5 24 L4.5 24 L4.5 22.5 L3 22.5 L3 9.5 L4.5 9.5 L4.5 8 Z";

interface MedalIconProps {
  place: MedalPlace;
  /** Overrides the tooltip and accessible name, e.g. "Aur, locul 1". */
  label?: string;
  className?: string;
}

/**
 * Square ribbon medal. The name ("Aur", "Argint", "Bronz") is the accessible
 * label and shows as a tooltip on hover.
 */
export function MedalIcon({ place, label, className }: MedalIconProps) {
  const medal = MEDAL[place];
  const name = label ?? medal.label;
  return (
    <span role="img" aria-label={name} className={cn("group relative inline-flex shrink-0", className)}>
      <svg width="22" height="26" viewBox="0 0 22 26" aria-hidden="true" shapeRendering="crispEdges">
        <path d="M5 1h5l2 7H7z" fill="var(--color-rust)" />
        <path d="M12 1h5l-2 7h-5z" fill="var(--color-navy)" />
        <path d={FACE} fill={medal.fill} stroke="var(--color-navy)" strokeWidth="1.5" />
        <rect x="7.5" y="12.5" width="7" height="7" fill="none" stroke="var(--color-navy)" strokeWidth="1" />
      </svg>
      <span
        aria-hidden="true"
        className="text-caption pointer-events-none absolute bottom-full left-1/2 z-popup mb-2 -translate-x-1/2 whitespace-nowrap bg-surface-dark px-2 py-1 font-semibold text-primary-on-dark opacity-0 transition-opacity duration-fast group-hover:opacity-100"
      >
        {name}
      </span>
    </span>
  );
}

export default MedalIcon;
