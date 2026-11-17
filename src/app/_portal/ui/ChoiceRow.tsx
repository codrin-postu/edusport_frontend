"use client";

import { cn } from "@/utils/cn";

/** Moves the selection inside the nearest `role="radiogroup"` with the arrow keys. */
function arrowKeys(e: React.KeyboardEvent<HTMLButtonElement>) {
  const step = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0;
  if (!step) return;
  const radios = Array.from(e.currentTarget.closest("[role=radiogroup]")?.querySelectorAll<HTMLButtonElement>("[role=radio]") ?? []);
  const next = radios[(radios.indexOf(e.currentTarget) + step + radios.length) % radios.length];
  if (!next) return;
  e.preventDefault();
  next.focus();
  next.click();
}

/** A selectable row with a square indicator, a bold label and a muted line. The caller wraps the rows in a `role="radiogroup"`. */
export function ChoiceRow({ label, sub, checked, onSelect, children }: { label: string; sub?: string; checked: boolean; onSelect: () => void; children?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        role="radio"
        aria-checked={checked}
        tabIndex={checked ? 0 : -1}
        onClick={onSelect}
        onKeyDown={arrowKeys}
        className={cn(
          "flex min-h-(--portal-choice-min-h) items-center gap-3 bg-surface-raised px-3 py-2 text-left text-primary outline-none focus-visible:outline-2 focus-visible:outline-offset-(--focus-offset) focus-visible:outline-focus",
          checked ? "border-control border-checkbox-on" : "border border-checkbox-line",
        )}
      >
        <span aria-hidden className={cn("size-(--portal-choice-box) shrink-0 border-control border-checkbox-on", checked ? "bg-checkbox-on" : "bg-surface-raised")} />
        <span className="flex min-w-0 flex-col gap-1">
          <span className="text-(length:--portal-row-title) font-bold">{label}</span>
          {sub && <span className="text-(length:--portal-row-sub) text-muted">{sub}</span>}
        </span>
      </button>
      {children}
    </div>
  );
}
