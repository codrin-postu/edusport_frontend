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

  const specialEvents = useMemo(
    () => events.filter(
      (e) =>
        e.type === "holiday" ||
        e.type === "vacation" ||
        e.type === "eveniment" ||
        e.type === "concurs" ||
        e.type === "curs-special",
    ),
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
        "bg-green-100 h-3 w-3 text-green-800 hover:bg-green-200 rounded font-medium m-auto",
      off: "bg-red-100 text-red-800 hover:bg-red-200 rounded font-medium m-auto",
      next: "bg-green-300 text-green-900 hover:bg-green-400 font-bold rounded m-auto",
    }),
    [],
  );

  return {
    allActiveWeekends,
    allOffWeekends,
    allCancelledWeekends,
    nextActiveWeekend,
    specialEvents,
    modifiers,
    modifiersClassNames,
  };
};
