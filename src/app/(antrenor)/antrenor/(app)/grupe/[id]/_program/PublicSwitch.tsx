import { PROGRAM } from "@/lib/portal/copy";
import { cn } from "@/utils/cn";

type PublicSwitchProps = { value: boolean; busy: boolean; onChange: (value: boolean) => void };

/** "Program public": a square switch. */
export function PublicSwitch({ value, busy, onChange }: PublicSwitchProps) {
  return (
    <div className="flex items-center justify-between gap-4 p-4 border-card border-card-line bg-surface-raised">
      <div className="min-w-0">
        <p id="program-public-label" className="text-body font-semibold text-primary">{PROGRAM.publicLabel}</p>
        <p className="text-body-sm text-secondary">{PROGRAM.publicHint}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={value}
        aria-labelledby="program-public-label"
        disabled={busy}
        onClick={() => onChange(!value)}
        className={cn(
          "relative h-6 w-12 shrink-0 border-control border-line outline-none focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-primary disabled:border-line-subtle",
          value ? "bg-accent" : "bg-surface",
        )}
      >
        <span aria-hidden className={cn("absolute top-0.5 size-4 bg-surface-dark", value ? "right-0.5" : "left-0.5")} />
      </button>
    </div>
  );
}
