import type { EventInput } from "@fullcalendar/core";
import { WeekendDate } from "@/utils/date";
import type { CalendarEvent } from "@/app/cursuri/program/_types";

// Format a local Date to "YYYY-MM-DD" WITHOUT converting to UTC.
// toISOString() shifts the date back by the local UTC offset (e.g. UTC+2 → -1 day),
// so Oct 4 local becomes Oct 3 in UTC → wrong day on calendar.
function toLocalDateStr(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// FullCalendar end is exclusive: add 1 day to the inclusive end date.
function toExclusiveEnd(date: Date): string {
  const d = new Date(date);
  d.setDate(d.getDate() + 1);
  return toLocalDateStr(d);
}

// Special events come in as ISO strings already - just add 1 day for FC exclusivity.
function isoToExclusiveEnd(isoDate: string): string {
  const d = new Date(isoDate + "T00:00:00");
  d.setDate(d.getDate() + 1);
  return toLocalDateStr(d);
}

export function buildCalendarEvents(
  allActiveWeekends: WeekendDate[],
  allOffWeekends: WeekendDate[],
  nextActiveWeekend: WeekendDate | null,
  specialEvents: CalendarEvent[],
  allCancelledWeekends: WeekendDate[] = [],
): EventInput[] {
  const events: EventInput[] = [];

  // Course weekends (teal) - one dot per day so Saturday and Sunday each get their own marker
  allActiveWeekends.forEach((w) => {
    const isNext =
      nextActiveWeekend !== null &&
      w.startDate.getTime() === nextActiveWeekend.startDate.getTime();

    const classNames = isNext ? ["fc-event-next-weekend"] : ["fc-event-curs"];
    const type = isNext ? "next" : "curs";
    const sharedProps = {
      title: "Curs",
      allDay: true,
      display: "block",
      classNames,
      extendedProps: { type, displayText: w.displayText, description: w.description ?? null },
    };

    // Always emit Saturday
    events.push({ ...sharedProps, start: toLocalDateStr(w.startDate), end: toExclusiveEnd(w.startDate) });

    // Emit Sunday only if it's a different day (some events are single-day)
    if (w.startDate.getTime() !== w.endDate.getTime()) {
      events.push({ ...sharedProps, start: toLocalDateStr(w.endDate), end: toExclusiveEnd(w.endDate) });
    }
  });

  // Cancelled weekends (red) - formerly active courses now marked anulat
  allCancelledWeekends.forEach((w) => {
    events.push({
      title: "Curs anulat",
      start: toLocalDateStr(w.startDate),
      end: toExclusiveEnd(w.endDate),
      allDay: true,
      display: "block",
      classNames: ["fc-event-anulat"],
      extendedProps: { type: "anulat", displayText: w.displayText, description: w.description ?? null },
    });
  });

  // Off weekends (gray)
  allOffWeekends.forEach((w) => {
    events.push({
      title: "Liber",
      start: toLocalDateStr(w.startDate),
      end: toExclusiveEnd(w.endDate),
      allDay: true,
      display: "block",
      classNames: ["fc-event-liber"],
      extendedProps: { type: "liber", displayText: w.displayText, description: w.description ?? null },
    });
  });

  // Special events: holidays, vacations, events, competitions
  specialEvents.forEach((e) => {
    let classNames: string[];
    let defaultTitle: string;
    switch (e.type) {
      case "holiday":
        classNames = ["fc-event-holiday"];
        defaultTitle = "Sărbătoare";
        break;
      case "vacation":
        classNames = ["fc-event-vacation"];
        defaultTitle = "Vacanță";
        break;
      case "eveniment":
        classNames = ["fc-event-eveniment"];
        defaultTitle = "Eveniment";
        break;
      case "concurs":
        classNames = ["fc-event-concurs"];
        defaultTitle = "Concurs";
        break;
      default:
        classNames = ["fc-event-holiday"];
        defaultTitle = "Special";
    }
    events.push({
      title: e.title ?? defaultTitle,
      start: e.startDate,
      end: isoToExclusiveEnd(e.endDate),
      allDay: true,
      display: "block",
      classNames,
      extendedProps: { type: e.type, description: e.description ?? null },
    });
  });

  return events;
}
