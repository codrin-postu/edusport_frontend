"use client";

import React from "react";
import SpotlightButton from "@/components/ui/spotlight-button";
import type { CustomVariant } from "@/components/ui/custom-questions";

// ---------------------------------------------------------------------------
// Shared multi-step form chrome, lifted from src/app/inscrieri/_shared.tsx so
// every config-driven form (Înscriere, Voluntariat, Parteneri) can reuse it.
// Two visual variants match the two form surfaces: "card" (light cream/white
// card — Înscriere) and "navy" (dark panel — Voluntariat).
// ---------------------------------------------------------------------------

const INDICATOR_VARIANT = {
  card: {
    title: "text-body-sm text-primary",
    counter: "text-label uppercase text-accent whitespace-nowrap",
    bar: "relative h-2 border-retro border-line bg-surface-subtle overflow-hidden",
    fill: "absolute inset-y-0 left-0 bg-surface-dark transition-[width] duration-500 ease-out",
  },
  navy: {
    title: "text-body-sm text-primary-on-dark",
    counter: "text-label uppercase text-mustard whitespace-nowrap",
    bar: "relative h-2 border-retro border-line-on-dark bg-surface-subtle-on-dark overflow-hidden",
    fill: "absolute inset-y-0 left-0 bg-mustard transition-[width] duration-500 ease-out",
  },
} as const;

const NAVIGATION_VARIANT = {
  card: {
    container:
      "flex items-center justify-between mt-8 pt-6 border-t-retro border-line-subtle",
    back: "text-body-sm text-secondary hover:text-accent transition-colors",
    face: "black" as const,
  },
  navy: {
    container:
      "flex items-center justify-between mt-8 pt-6 border-t-retro border-line-subtle-on-dark",
    back: "text-body-sm text-secondary-on-dark hover:text-mustard transition-colors",
    face: "cream" as const,
  },
} as const;

// ---------------------------------------------------------------------------
// Step indicator — minimal progress bar: current title + "Pasul X din Y" +
// an accent fill that grows each step.
// ---------------------------------------------------------------------------

export const StepIndicator: React.FC<{
  current: number;
  /** Step titles from the CMS config. */
  labels?: string[];
  variant?: CustomVariant;
}> = ({ current, labels, variant = "card" }) => {
  const v = INDICATOR_VARIANT[variant];
  const titles = labels ?? [];
  const total = Math.max(titles.length, 1);
  const pct = Math.round(((current + 1) / total) * 100);
  return (
    <div className="flex flex-col gap-2 mb-12">
      <div className="flex items-baseline justify-between gap-3">
        <span className={v.title}>{titles[current] ?? ""}</span>
        <span className={v.counter}>
          Pasul {current + 1} din {total}
        </span>
      </div>
      <div className={v.bar}>
        <div className={v.fill} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Step navigation — ghost back link + layers-CTA continue
// ---------------------------------------------------------------------------

export const StepNavigation: React.FC<{
  onBack: () => void;
  onNext: () => void;
  canProceed: boolean;
  backLabel?: string;
  variant?: CustomVariant;
}> = ({ onBack, onNext, canProceed, backLabel = "Înapoi", variant = "card" }) => {
  const v = NAVIGATION_VARIANT[variant];
  return (
    <div className={v.container}>
      {backLabel ? (
        <button type="button" onClick={onBack} className={v.back}>
          {backLabel}
        </button>
      ) : (
        <span />
      )}
      <SpotlightButton
        layers
        layersFace={v.face}
        type="button"
        onClick={onNext}
        disabled={!canProceed}
      >
        Continuă
      </SpotlightButton>
    </div>
  );
};
