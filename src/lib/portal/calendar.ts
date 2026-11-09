// Helpers of the coach calendar. Pure: loaded by Node tests through type stripping.
import type { CoachCalendar, CoachCalendarItem } from "./api-types.ts";

export type Mark = "grup" | "individual" | "anulata";

/** Per date, one mark per item in item order; a cancelled item gives "anulata". */
export function marksOf(cal: CoachCalendar): Record<string, Mark[]> {
  const out: Record<string, Mark[]> = {};
  for (const day of cal.days) {
    out[day.date] = day.items.map((i): Mark => (i.cancelled ? "anulata" : i.kind));
  }
  return out;
}

/** The items of one date, in the answer's order; none for a date without items. */
export function itemsOn(cal: CoachCalendar, date: string): CoachCalendarItem[] {
  return cal.days.find((d) => d.date === date)?.items ?? [];
}
