import type { Occurrence } from "@/lib/portal/api-types";
import { PROGRAM } from "@/lib/portal/copy";
import { isPause } from "@/lib/portal/program";
import { cn } from "@/utils/cn";

const toWeekday = (month: string, day: number): number => (new Date(Date.UTC(Number(month.slice(0, 4)), Number(month.slice(5, 7)) - 1, day)).getUTCDay() + 6) % 7;
const daysIn = (month: string): number => new Date(Date.UTC(Number(month.slice(0, 4)), Number(month.slice(5, 7)), 0)).getUTCDate();
const HEAD = ["lu", "ma", "mi", "jo", "vi", "sâ", "du"] as const;

/** A 7 column grid of square cells, Monday first, with the times of each day. */
export function ProgramMonth({ month, occurrences }: { month: string; occurrences: Occurrence[] }) {
  const lead = toWeekday(month, 1);
  const cells: (number | null)[] = [...Array<null>(lead).fill(null), ...Array.from({ length: daysIn(month) }, (_, i) => i + 1)];
  const byDay = (d: number): Occurrence[] => occurrences.filter((o) => Number(o.date.slice(8)) === d);
  return (
    <div data-testid="program-month">
      <ol className="grid grid-cols-7 mb-1">
        {HEAD.map((h) => <li key={h} className="text-(length:--portal-text-12) font-bold text-secondary text-center uppercase">{h}</li>)}
      </ol>
      <ol className="grid grid-cols-7 gap-px bg-line-subtle border-card border-card-line">
        {cells.map((d, i) => (
          <li key={i} className="aspect-square bg-surface-raised p-1 overflow-hidden">
            {d !== null && (
              <>
                <span className="text-(length:--portal-text-12) font-bold text-secondary block">{d}</span>
                {byDay(d).map((o) => (
                  <span
                    key={`${o.startTime}:${o.originalDate ?? ""}`}
                    className={cn("text-(length:--portal-text-12) font-bold block text-primary", o.status === "cancelled" && !isPause(o) && "line-through text-secondary", isPause(o) && "text-secondary")}
                    title={isPause(o) ? PROGRAM.breakNotice(o.note ?? "") : undefined}
                  >
                    {o.startTime}
                  </span>
                ))}
              </>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
