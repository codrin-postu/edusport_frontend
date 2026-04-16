import { useMemo } from "react";
import { getNextActiveWeekend } from "@/utils/date";
import {
  getAllActiveWeekends,
  getAllOffWeekends,
  createCalendarModifiers,
} from "@/utils/calendar-helpers";
import type { CalendarEvent } from "@/app/cursuri/program/_types";

export const useSeasonCalendar = (calendarEvents: CalendarEvent[]) => {
  const allActiveWeekends = useMemo(
    () => getAllActiveWeekends(calendarEvents),
    [calendarEvents],
  );

  const allOffWeekends = useMemo(
    () => getAllOffWeekends(calendarEvents),
    [calendarEvents],
  );

  const nextActiveWeekend = useMemo(
    () => getNextActiveWeekend(allActiveWeekends),
    [allActiveWeekends],
  );

  const specialEvents = useMemo(
    () => calendarEvents.filter(
      (e) => e.type === "holiday" || e.type === "vacation" || e.type === "eveniment" || e.type === "concurs",
    ),
    [calendarEvents],
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
    nextActiveWeekend,
    specialEvents,
    modifiers,
    modifiersClassNames,
  };
};
