"use client";

import { PortalCard } from "@/app/_portal/ui/PortalCard";
import { KIT } from "@/lib/portal/copy-shared";
import { monthCells, monthTitle } from "@/lib/portal/month-grid";
import { cn } from "@/utils/cn";

export type DayMarks = ("grup" | "individual" | "concurs" | "anulata")[];

export function MonthGrid({
  month,
  marks,
  selected,
  today,
  onSelect,
  label,
}: {
  month: string;
  marks: Record<string, DayMarks>;
  selected: string | null;
  today: string;
  onSelect: (date: string) => void;
  label: string;
}) {
  const monthWord = monthTitle(month).split(" ")[0].toLowerCase();
  return (
    <PortalCard className="p-3">
      <div role="group" aria-label={label}>
        <div className="mb-(--portal-cal-head-gap) grid grid-cols-7 gap-0.5">
          {KIT.weekdays.map((w) => (
            <span key={w} className="text-center text-(length:--portal-text-11) font-bold text-muted">{w}</span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-0.5">
          {monthCells(month).map((date, i) => {
            if (!date) return <span key={`blank-${i}`} />;
            const day = Number(date.slice(8));
            const dayMarks = marks[date] ?? [];
            const on = date === selected;
            return (
              <button
                key={date}
                type="button"
                aria-pressed={on}
                aria-current={date === today ? "date" : undefined}
                aria-label={`${day} ${monthWord}`}
                onClick={() => onSelect(date)}
                className={cn(
                  "flex h-12 flex-col items-center justify-center gap-(--portal-cell-gap) text-(length:--portal-text-14) outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus",
                  dayMarks.length ? "font-extrabold" : "font-medium",
                  on ? "bg-surface-dark text-white" : date === today ? "bg-ice-light text-primary" : "text-primary",
                )}
              >
                {day}
                <span className="flex min-h-(--portal-mark-h) justify-center gap-0.5">
                  {dayMarks.map((m, k) => (
                    <span
                      key={k}
                      className={cn(
                        "h-(--portal-mark-h) w-2",
                        m === "grup" && (on ? "bg-ice" : "bg-surface-dark"),
                        m === "individual" && "bg-ice-blue",
                        m === "concurs" && "bg-ice",
                        m === "anulata" && "bg-cancelled",
                      )}
                    />
                  ))}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </PortalCard>
  );
}
