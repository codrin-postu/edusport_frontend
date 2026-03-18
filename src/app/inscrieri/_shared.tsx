import { cn } from "@/utils/cn";
import { inputBaseOnCard } from "@/components/ui/form-field";
import { User, CalendarDays, ClipboardCheck, ChevronRight } from "lucide-react";
import React from "react";

// inputBase alias for inscrieri — on-card variant (white bg + focus ring)
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

export const StepIndicator: React.FC<{ current: number }> = ({ current }) => (
  <div className="flex items-center gap-1 mb-10 overflow-x-auto pb-2">
    {STEPS.map((step, i) => {
      const Icon = step.icon;
      const done = i < current;
      const active = i === current;
      return (
        <React.Fragment key={step.label}>
          {i > 0 && (
            <div className="h-px flex-1 min-w-6 max-w-16 bg-gray-200 relative overflow-hidden">
              <div
                key={`fill-${i}-${done}`}
                className={cn(
                  "absolute inset-y-0 left-0 bg-edusport-blue",
                  done ? "animate-line-fill" : "w-0",
                )}
              />
            </div>
          )}
          <div
            key={`pill-${i}-${active}`}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-full border text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all duration-300",
              done && "bg-edusport-blue border-edusport-blue text-white",
              active && "border-edusport-blue text-edusport-blue bg-edusport-blue/5 animate-pill-glow",
              !active && !done && "border-transparent text-gray-300",
            )}
          >
            {/* Step icon — hidden when done */}
            {!done && <Icon className="w-3.5 h-3.5 shrink-0" />}

            {/* Check icon — shown when done, animates in */}
            {done && (
              <svg
                key={`check-${i}`}
                className="w-3.5 h-3.5 shrink-0 animate-check-pop"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  d="M5 13l4 4L19 7"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}

            {step.label}
          </div>
        </React.Fragment>
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
