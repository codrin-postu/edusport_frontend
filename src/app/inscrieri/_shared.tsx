import { cn } from "@/utils/cn";
import { inputBaseOnCard } from "@/components/ui/form-field";
import { User, CalendarDays, ClipboardCheck, ChevronRight } from "lucide-react";
import React from "react";

// inputBase alias for inscrieri - on-card variant (white bg + focus ring)
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
// Step indicator
// ---------------------------------------------------------------------------

// Slanted parallelogram segment - shape matches the `Pill` component's
// "slanted" variant so the stepper visually echoes the brand pill.
const SEGMENT_CLIP = "polygon(12px 0, 100% 0, calc(100% - 12px) 100%, 0 100%)";

export const StepIndicator: React.FC<{ current: number }> = ({ current }) => (
  <div className="flex items-stretch gap-1 mb-10 overflow-x-auto pb-2">
    {STEPS.map((step, i) => {
      const Icon = step.icon;
      const done = i < current;
      const active = i === current;
      const filled = done || active;
      return (
        <div
          key={step.label}
          aria-current={active ? "step" : undefined}
          style={{ clipPath: SEGMENT_CLIP }}
          className={cn(
            "flex-1 min-w-[110px] flex items-center justify-center gap-2 px-6 py-3",
            "text-2xs font-semibold uppercase tracking-wider whitespace-nowrap",
            "transition-all duration-300",
            filled
              ? "bg-edusport-blue text-white"
              : "bg-gray-100 text-gray-400",
            active && "shadow-sm",
          )}
        >
          {done ? (
            <svg
              key={`check-${i}`}
              className="w-3.5 h-3.5 shrink-0 animate-check-pop"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path
                d="M5 13l4 4L19 7"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <Icon className="w-3.5 h-3.5 shrink-0" />
          )}
          <span>{step.label}</span>
        </div>
      );
    })}
  </div>
);

// ---------------------------------------------------------------------------
// Step navigation
// ---------------------------------------------------------------------------

export const StepNavigation: React.FC<{
  onBack: () => void;
  onNext: () => void;
  canProceed: boolean;
  backLabel?: string;
}> = ({ onBack, onNext, canProceed, backLabel = "Înapoi" }) => (
  <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
    <button
      type="button"
      onClick={onBack}
      className="text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors"
    >
      {backLabel}
    </button>
    <button
      type="button"
      onClick={onNext}
      disabled={!canProceed}
      className={cn(
        "flex items-center gap-2 px-6 py-3 text-sm font-semibold transition-colors",
        canProceed
          ? "bg-edusport-blue text-white hover:bg-edusport-blue/90"
          : "bg-gray-100 text-gray-300 cursor-not-allowed",
      )}
    >
      Continuă
      <ChevronRight className="w-4 h-4" />
    </button>
  </div>
);
