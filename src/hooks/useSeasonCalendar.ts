import { useMemo } from "react";
import { getNextActiveWeekend } from "@/utils/date";
import {
  MonthData,
  getAllActiveWeekends,
  getAllOffWeekends,
  createCalendarModifiers,
} from "@/utils/calendar-helpers";

export const useSeasonCalendar = (seasonCalendar: MonthData[]) => {
  const allActiveWeekends = useMemo(
    () => getAllActiveWeekends(seasonCalendar),
    [seasonCalendar],
  );

  const allOffWeekends = useMemo(
    () => getAllOffWeekends(seasonCalendar),
    [seasonCalendar],
  );

  const nextActiveWeekend = useMemo(
    () => getNextActiveWeekend(allActiveWeekends),
    [allActiveWeekends],
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
    modifiers,
    modifiersClassNames,
  };
};
