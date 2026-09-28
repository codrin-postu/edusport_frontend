import { useMemo } from "react";
import { getNextActiveWeekend } from "@/utils/date";
import {
  getAllActiveWeekends,
  getAllOffWeekends,
  getAllCancelledWeekends,
  createCalendarModifiers,
} from "@/utils/calendar-helpers";
import type { CalendarEvent } from "@/app/cursuri/program/_types";

export const useSeasonCalendar = (calendarEvents: CalendarEvent[]) => {
  // The backend stores section-default sentinels as `meta-default` events
  // alongside real ones. Filter them out up front so no downstream consumer
  // accidentally renders or counts them as calendar events.
  const events = useMemo(
    () => calendarEvents.filter((e) => (e.type as string) !== "meta-default"),
    [calendarEvents],
  );

  const allActiveWeekends = useMemo(
    () => getAllActiveWeekends(events),
    [events],
  );

  const allOffWeekends = useMemo(
    () => getAllOffWeekends(events),
    [events],
  );

  const allCancelledWeekends = useMemo(
    () => getAllCancelledWeekends(events),
    [events],
  );

  const nextActiveWeekend = useMemo(
    () => getNextActiveWeekend(allActiveWeekends),
    [allActiveWeekends],
  );

  // Everything the grids draw as a tile: all events except the weekend model,
  // which only the Weekenduri list reads.
  const tileEvents = useMemo(
    () => events.filter((e) => e.type !== "curs" && e.type !== "liber" && e.type !== "anulat"),
    [events],
  );

  const modifiers = useMemo(
    () =>
      createCalendarModifiers(
        allActiveWeekends,
        allOffWeekends,
        nextActiveWeekend,
      ),
    [allActiveWeekends, allOffWeekends, nextActiveWeekend],
  );

  const modifiersClassNames = useMemo(
    () => ({
      active:
        "bg-green-100 h-3 w-3 text-green-800 hover:bg-green-200 font-medium m-auto",
      off: "bg-red-100 text-red-800 hover:bg-red-200 font-medium m-auto",
      next: "bg-green-300 text-green-900 hover:bg-green-400 font-bold m-auto",
    }),
    [],
  );

  return {
    allActiveWeekends,
    allOffWeekends,
    allCancelledWeekends,
    nextActiveWeekend,
    tileEvents,
    modifiers,
    modifiersClassNames,
  };
};
