"use client";

import { cn } from "@/utils/cn";
import React from "react";
import { useSeasonCalendar } from "@/hooks/useSeasonCalendar";
import { MonthData } from "@/utils/calendar-helpers";
import { Calendar } from "@/components/blocks";

interface SeasonCalendarViewProps {
  seasonCalendar: MonthData[];
}

const SeasonCalendarView: React.FC<SeasonCalendarViewProps> = ({
  seasonCalendar,
}) => {
  const {
    allActiveWeekends,
    allOffWeekends,
    nextActiveWeekend,
    modifiers,
    modifiersClassNames,
  } = useSeasonCalendar(seasonCalendar);

  return (
    <section className={cn("py-16", "bg-white")}>
      <div className={cn("w-full", "max-w-content", "md:px-8", "lg:px-12")}>
        <div className={cn("max-w-2xl", "mx-auto")}>
          <h2
            className={cn(
              "text-3xl",
              "font-bold",
              "text-gray-800",
              "mb-8",
              "text-center",
            )}
          >
            Calendar Sezon 2025-2026
          </h2>

          <Calendar
            modifiers={modifiers}
            modifiersClassNames={modifiersClassNames}
            allActiveWeekends={allActiveWeekends}
            allOffWeekends={allOffWeekends}
            nextActiveWeekend={nextActiveWeekend}
            startMonth={new Date(2025, 9, 1)}
            endMonth={new Date(2026, 4, 31)}
            defaultMonth={new Date(2025, 9, 1)}
          />

          <div
            className={cn("mt-4", "text-center", "text-sm", "text-gray-600")}
          >
            <span
              className={cn("inline-flex", "items-center", "gap-1", "mr-4")}
            >
              <div
                className={cn("w-2", "h-2", "rounded", "bg-green-300")}
              ></div>
              Următorul weekend
            </span>
            <span
              className={cn("inline-flex", "items-center", "gap-1", "mr-4")}
            >
              <div
                className={cn("w-2", "h-2", "rounded", "bg-green-200")}
              ></div>
              Cursuri programate
            </span>
            <span className={cn("inline-flex", "items-center", "gap-1")}>
              <div
                className={cn("w-2", "h-2", "rounded", "bg-red-100")}
              ></div>
              Weekend liber
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SeasonCalendarView;
