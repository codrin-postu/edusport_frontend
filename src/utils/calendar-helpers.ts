import { WeekendDate } from "@/utils/date";
import type { CalendarEvent } from "@/app/cursuri/program/_types";

// ─── WeekendDate helpers ──────────────────────────────────────────────────────

function isoToWeekendDate(event: CalendarEvent): WeekendDate {
  const start = new Date(event.startDate + "T00:00:00");
  const end = new Date(event.endDate + "T00:00:00");
  const startDay = start.getDate();
  const endDay = end.getDate();
  const displayText =
    start.getTime() === end.getTime()
      ? String(startDay)
      : `${startDay}-${endDay}`;
  return { startDate: start, endDate: end, displayText, description: event.description };
}

export function getAllActiveWeekends(events: CalendarEvent[]): WeekendDate[] {
  return events
    .filter((e) => e.type === "curs")
    .map(isoToWeekendDate)
    .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
}

export function getAllOffWeekends(events: CalendarEvent[]): WeekendDate[] {
  return events.filter((e) => e.type === "liber").map(isoToWeekendDate);
}

// ─── Modifiers (kept for any DayPicker usage) ─────────────────────────────────

export const createCalendarModifiers = (
  allActiveWeekends: WeekendDate[],
  allOffWeekends: WeekendDate[],
  nextActiveWeekend: WeekendDate | null,
) => {
  const createDateRange = (weekend: WeekendDate): Date[] => {
    const dates = [];
    const current = new Date(weekend.startDate);
    while (current <= weekend.endDate) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return dates;
  };

  return {
    active: allActiveWeekends.flatMap(createDateRange),
    off: allOffWeekends.flatMap(createDateRange),
    next: nextActiveWeekend ? createDateRange(nextActiveWeekend) : [],
  };
};

export const isDateInWeekends = (date: Date, weekends: WeekendDate[]): boolean => {
  return weekends.some(
    (weekend) =>
      date.getTime() >= weekend.startDate.getTime() &&
      date.getTime() <= weekend.endDate.getTime(),
  );
};

export const getTooltipContent = (
  date: Date,
  allActiveWeekends: WeekendDate[],
  allOffWeekends: WeekendDate[],
  nextActiveWeekend: WeekendDate | null,
  formatFn: (date: Date, format: string, options?: unknown) => string,
): string | null => {
  const dayOfWeek = date.getDay();
  if (dayOfWeek !== 0 && dayOfWeek !== 6) return null;

  const isNext = nextActiveWeekend && isDateInWeekends(date, [nextActiveWeekend]);
  const isActive = isDateInWeekends(date, allActiveWeekends);
  const isOff = isDateInWeekends(date, allOffWeekends);

  if (isNext) return `Următorul weekend activ - ${formatFn(date, "d MMM yyyy")}`;
  if (isActive) return `Cursuri programate - ${formatFn(date, "d MMM yyyy")}`;
  if (isOff) return `Weekend liber - ${formatFn(date, "d MMM yyyy")}`;

  return null;
};

// ─── Legacy exports removed ───────────────────────────────────────────────────
// MonthData, MONTH_MAPPINGS, getMonthNumber, getAllActiveWeekends(MonthData[]),
// getAllOffWeekends(MonthData[]) are no longer needed — data is now flat CalendarEvent[].
