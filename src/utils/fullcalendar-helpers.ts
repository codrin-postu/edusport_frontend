import type { EventInput } from "@fullcalendar/core";
import type { CalendarEvent, CalendarEventType } from "@/app/cursuri/program/_types";
import type { CalendarOccurrence } from "@/lib/strapi-calendar";
import {
  type CalendarGroup,
  groupEventColors,
  groupForOccurrence,
} from "@/components/blocks/fullcalendar/calendar-colors";
import { occurrenceTimeSlot, occurrenceTitle } from "@/utils/occurrences-to-calendar";

// Format a local Date to "YYYY-MM-DD" WITHOUT converting to UTC.
// toISOString() shifts the date back by the local UTC offset (e.g. UTC+2 gives -1 day),
// so Oct 4 local becomes Oct 3 in UTC, the wrong day on calendar.
function toLocalDateStr(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// Shift a "YYYY-MM-DD" string by n days without touching UTC.
function addDaysToYMD(ymd: string, n: number): string {
  const [y, m, d] = ymd.split("-").map(Number);
  return toLocalDateStr(new Date(y, m - 1, d + n));
}

const DEFAULT_TITLE: Record<CalendarEventType, string> = {
  curs: "Școala de patinaj",
  liber: "Liber",
  anulat: "Curs anulat",
  scoala: "Școala de patinaj",
  holiday: "Sărbătoare",
  vacation: "Vacanță",
  eveniment: "Eveniment",
  concurs: "Concurs",
  cantonament: "Cantonament",
  spectacol: "Spectacol",
  pauza: "Pauză",
  "curs-special": "Antrenament",
};

function groupForEvent(e: CalendarEvent): CalendarGroup {
  switch (e.type) {
    case "scoala":
      return e.state === "anulat" ? "anulat" : e.state === "liber" ? "liber" : "scoala";
    case "curs-special":
      return "antrenament";
    case "holiday":
    case "vacation":
    case "pauza":
      return "liber";
    default:
      return "eveniment";
  }
}

function tileTitle(e: CalendarEvent, group: CalendarGroup): string {
  if (e.type === "scoala" && group !== "scoala") return group === "liber" ? "Liber" : "Curs anulat";
  return e.title?.trim() || DEFAULT_TITLE[e.type] || "Eveniment";
}

/** Tooltip body: the time slot (bold) first, then the description. */
function tooltipDescription(e: CalendarEvent): string | null {
  if (!e.timeSlot) return e.description ?? null;
  return `**${e.timeSlot}**${e.description ? `\n\n${e.description}` : ""}`;
}

/**
 * Month grid tiles. Every event, Școala dates included, is one plain tile
 * coloured by its group. Pass `tileEvents` from useSeasonCalendar: the weekend
 * model (curs / liber / anulat) is for the Weekenduri list only.
 */
export function buildCalendarEvents(tileEvents: CalendarEvent[]): EventInput[] {
  const events: EventInput[] = [];
  for (const e of tileEvents) {
    const group = groupForEvent(e);
    events.push({
      title: tileTitle(e, group),
      start: e.startDate,
      end: addDaysToYMD(e.endDate, 1), // FullCalendar end is exclusive
      allDay: true,
      display: "block",
      ...groupEventColors(group),
      extendedProps: { type: e.type, group, description: tooltipDescription(e) },
    });
  }
  return events;
}

/**
 * Turn expanded backend occurrences into TIMED FullCalendar events for the
 * weekly time-grid. Occurrences with a startTime become timed blocks; ones
 * without fall back to all-day. Colours come from the same group map as the
 * month grid.
 */
export function occurrencesToEvents(occurrences: CalendarOccurrence[]): EventInput[] {
  return occurrences.map((o) => {
    const timed = !!o.startTime;
    const start = timed ? `${o.date}T${o.startTime}:00` : o.date;
    // Overnight occurrences end on the NEXT calendar day. The backend resolves
    // that day into `endDate`; `endsNextDay` is the fallback for payloads that
    // carry only the flag. Without this the end would sit before the start and
    // FullCalendar would render a negative-duration block.
    const endDay = o.endDate ?? (o.endsNextDay ? addDaysToYMD(o.date, 1) : o.date);
    const end = timed && o.endTime ? `${endDay}T${o.endTime}:00` : undefined;
    const group = groupForOccurrence(o);

    let description: string | null = o.description ?? null;
    if (o.status === "cancelled") {
      description = o.cancelReason === "blackout" ? "Liber" : "Anulat";
    } else if (o.status === "override") {
      const slot = occurrenceTimeSlot(o);
      description = `Reprogramat${slot ? ` · ${slot}` : ""}`;
    }

    // A Școala date that is off or cancelled reads as its state, like the
    // month grid; other events keep their own title.
    const title =
      o.type === "scoala" && group === "liber"
        ? "Liber"
        : o.type === "scoala" && group === "anulat"
          ? "Curs anulat"
          : occurrenceTitle(o);
    if (o.type === "scoala" && group !== "scoala") description = o.note || null;

    return {
      title,
      start,
      end,
      allDay: !timed,
      display: "block",
      ...groupEventColors(group),
      extendedProps: {
        type: o.type,
        group,
        status: o.status,
        label: o.label,
        description,
        cancelReason: o.cancelReason,
      },
    } as EventInput;
  });
}
