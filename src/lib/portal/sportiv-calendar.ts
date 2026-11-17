// Helpers of the sportiv calendar. Pure, type imports only (loaded by Node tests through type stripping).
import { SESSION } from "./copy-sportiv.ts";
import { shortDate, weekdayShort } from "./format.ts";
import type { CalendarItem } from "./sportiv-types.ts";

export type SportivMark = "grup" | "individual" | "concurs" | "anulata";

const ORDER: SportivMark[] = ["grup", "individual", "concurs", "anulata"];

/** Per date, the unique marks in the order grup, individual, concurs, anulata; a cancelled item gives only "anulata". */
export function sportivMarks(items: CalendarItem[]): Record<string, SportivMark[]> {
  const found: Record<string, Set<SportivMark>> = {};
  for (const i of items) {
    const mark: SportivMark = i.cancelled ? "anulata" : i.kind === "grupa" ? "grup" : i.kind;
    (found[i.date] ??= new Set()).add(mark);
  }
  const out: Record<string, SportivMark[]> = {};
  for (const [date, set] of Object.entries(found)) out[date] = ORDER.filter((m) => set.has(m));
  return out;
}

/** The items of one date by start time, those without a time last. */
export function itemsOnDay(items: CalendarItem[], date: string): CalendarItem[] {
  return items
    .filter((i) => i.date === date)
    .sort((a, b) => (a.startTime === null ? 1 : 0) - (b.startTime === null ? 1 : 0) || (a.startTime ?? "").localeCompare(b.startTime ?? ""));
}

/** The muted second line of a session row: the reason of a cancelled item, else where a moved one came from, else null. */
export function sessionLine(item: CalendarItem): string | null {
  if (item.cancelled) return item.reason;
  if (item.movedFrom === null) return null;
  return SESSION.movedFrom(`${weekdayShort(item.movedFrom.date)} ${shortDate(item.movedFrom.date)}`, item.movedFrom.startTime);
}
