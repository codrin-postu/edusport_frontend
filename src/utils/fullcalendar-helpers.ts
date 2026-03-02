import { EventInput } from "@fullcalendar/core";
import { WeekendDate } from "@/utils/date";
import {
  ROMANIAN_HOLIDAYS_2025_2026,
  SCHOOL_VACATIONS_2025_2026,
} from "@/utils/romanian-holidays";

// FullCalendar's all-day end is exclusive (end = day after the last visible day)
function toExclusiveEnd(date: Date): string {
  const d = new Date(date);
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

function toDateStr(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function isoToExclusiveEnd(isoDate: string): string {
  const d = new Date(isoDate + "T00:00:00");
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

export function buildCalendarEvents(
  allActiveWeekends: WeekendDate[],
  allOffWeekends: WeekendDate[],
  nextActiveWeekend: WeekendDate | null,
): EventInput[] {
  const events: EventInput[] = [];

  // Course weekends (teal) — next upcoming gets a distinct style
  // TODO: remove slice(0, 1) and extra test events after testing mobile dot UI
  allActiveWeekends.slice(0, 1).forEach((w) => {
    const isNext =
      nextActiveWeekend !== null &&
      w.startDate.getTime() === nextActiveWeekend.startDate.getTime();

    const baseEvent = {
      start: toDateStr(w.startDate),
      end: toExclusiveEnd(w.startDate), // only Saturday for test
      allDay: true,
      display: "list-item",
      classNames: isNext ? ["fc-event-next-weekend"] : ["fc-event-curs"],
      extendedProps: {
        type: isNext ? "next" : "curs",
        displayText: w.displayText,
        hours: "10:00–10:50 · 11:00–11:50",
      },
    };

    events.push({ ...baseEvent, title: "Cursuri - Școala de Patinaj" });
    events.push({ ...baseEvent, title: "Cursuri - Începători" });
    events.push({ ...baseEvent, title: "Cursuri - Avansați" });
  });

  // Off weekends (gray)
  allOffWeekends.forEach((w) => {
    events.push({
      title: "Liber",
      start: toDateStr(w.startDate),
      end: toExclusiveEnd(w.endDate),
      allDay: true,
      display: "block",
      classNames: ["fc-event-liber"],
      extendedProps: { type: "liber", displayText: w.displayText },
    });
  });

  // National holidays (amber)
  ROMANIAN_HOLIDAYS_2025_2026.forEach((h) => {
    events.push({
      title: h.title,
      start: h.start,
      end: isoToExclusiveEnd(h.end),
      allDay: true,
      display: "block",
      classNames: ["fc-event-holiday"],
      extendedProps: { type: "holiday" },
    });
  });

  // School vacations (indigo)
  SCHOOL_VACATIONS_2025_2026.forEach((v) => {
    events.push({
      title: v.title,
      start: v.start,
      end: isoToExclusiveEnd(v.end),
      allDay: true,
      display: "block",
      classNames: ["fc-event-vacation"],
      extendedProps: { type: "vacation" },
    });
  });

  return events;
}
