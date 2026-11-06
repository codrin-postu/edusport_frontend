import { useId } from "react";
import { cn } from "@/utils/cn";

type SquareSwitchProps = { label: string; checked: boolean; onChange: (value: boolean) => void };

/** A labelled square switch. */
export function SquareSwitch({ label, checked, onChange }: SquareSwitchProps) {
  const id = useId();
  return (
    <div className="flex items-center justify-between gap-4">
      <span id={id} className="text-body text-primary">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={id}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-6 w-12 shrink-0 border-retro border-line outline-none focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-primary",
          checked ? "bg-accent" : "bg-surface",
        )}
      >
        <span aria-hidden className={cn("absolute top-0.5 size-4 bg-surface-dark", checked ? "right-0.5" : "left-0.5")} />
      </button>
    </div>
  );
}
