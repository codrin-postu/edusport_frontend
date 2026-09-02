import { inputBaseOnCard } from "@/components/ui/form-field";
import { User, CalendarDays, ClipboardCheck } from "lucide-react";
import SpotlightButton from "@/components/ui/spotlight-button";
import React from "react";

// inputBase alias for inscrieri - on-card variant (white bg + navy border)
export const inputBase = inputBaseOnCard;

// ---------------------------------------------------------------------------
// Step definitions
// ---------------------------------------------------------------------------

export const STEPS = [
  { label: "Date personale", icon: User },
  { label: "Experiență", icon: CalendarDays },
  { label: "Confirmare", icon: ClipboardCheck },
] as const;

// ---------------------------------------------------------------------------
// Step indicator — minimal progress bar: current title + "Pasul X din Y" +
// a mustard fill that grows each step.
// ---------------------------------------------------------------------------

export const StepIndicator: React.FC<{
  current: number;
  /** Step titles from the CMS config. Falls back to the built-in three. */
  labels?: string[];
}> = ({ current, labels }) => {
  const titles = labels?.length ? labels : STEPS.map((s) => s.label);
  const total = titles.length;
  const pct = Math.round(((current + 1) / total) * 100);
  return (
    <div className="flex flex-col gap-2 mb-10">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[15px] font-bold text-navy tracking-[-0.2px]">
          {titles[current] ?? ""}
        </span>
        <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-rust whitespace-nowrap">
          Pasul {current + 1} din {total}
        </span>
      </div>
      <div className="relative h-2 border-[1.5px] border-navy bg-navy/[0.06] overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-navy transition-[width] duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
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
}> = ({ onBack, onNext, canProceed, backLabel = "Înapoi" }) => (
  <div className="flex items-center justify-between mt-8 pt-6 border-t-[1.5px] border-navy/12">
    {backLabel ? (
      <button
        type="button"
        onClick={onBack}
        className="text-sm font-semibold text-navy/50 hover:text-rust transition-colors"
      >
        {backLabel}
      </button>
    ) : (
      <span />
    )}
    <SpotlightButton
      layers
      layersFace="black"
      type="button"
      onClick={onNext}
      disabled={!canProceed}
    >
      Continuă
    </SpotlightButton>
  </div>
);
