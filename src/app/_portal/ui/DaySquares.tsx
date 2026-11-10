"use client";

import { PROGRAM } from "@/lib/portal/copy";
import type { DayKey } from "@/lib/portal/api-types";
import { cn } from "@/utils/cn";

const ORDER: DayKey[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

/** "Zile": seven square checkboxes Lu..Du in a 7-column grid. `onChange` gets the days Monday first. */
export function DaySquares({ value, onChange, label }: { value: DayKey[]; onChange: (v: DayKey[]) => void; label: string }) {
  const toggle = (day: DayKey) => onChange(ORDER.filter((d) => (d === day ? !value.includes(d) : value.includes(d))));
  return (
    <div role="group" aria-label={label} className="flex flex-col gap-(--portal-day-gap)">
      <span aria-hidden className="text-(length:--portal-text-14) font-bold text-primary">{label}</span>
      <div className="grid grid-cols-7 gap-(--portal-day-gap)">
        {ORDER.map((day) => {
          const on = value.includes(day);
          return (
            <button
              key={day}
              type="button"
              role="checkbox"
              aria-checked={on}
              onClick={() => toggle(day)}
              className={cn(
                "flex h-(--portal-tap) min-w-0 items-center justify-center text-(length:--portal-text-14) font-bold outline-none focus-visible:outline-2 focus-visible:outline-offset-(--focus-offset) focus-visible:outline-focus",
                on ? "border-control border-checkbox-on bg-checkbox-on text-checkbox-mark" : "border border-checkbox-line bg-surface-raised text-primary",
              )}
            >
              {PROGRAM.dayLetters[day]}
            </button>
          );
        })}
      </div>
    </div>
  );
}
