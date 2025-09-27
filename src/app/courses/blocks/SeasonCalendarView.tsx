"use client";

import { cn } from "@/utils/cn";
import { Calendar } from "@/components/ui/calendar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  parseWeekendDates,
  getNextActiveWeekend,
  isNextWeekend,
  WeekendDate,
} from "@/utils/date";
import { format } from "date-fns";
import { ro } from "date-fns/locale";
import React from "react";
import { CalendarDay, Modifiers } from "react-day-picker";

interface WeekendInfo {
  weekend: string;
  days: string[];
}

interface MonthData {
  month: string;
  courseDates: WeekendInfo[];
  offDates: WeekendInfo[];
}

interface SeasonCalendarViewProps {
  seasonCalendar: MonthData[];
}

const SeasonCalendarView: React.FC<SeasonCalendarViewProps> = ({
  seasonCalendar,
}) => {
  const getMonthNumber = (monthName: string): number => {
    const months: Record<string, number> = {
      Octombrie: 10,
      Noiembrie: 11,
      Decembrie: 12,
      Ianuarie: 1,
      Februarie: 2,
      Martie: 3,
      Aprilie: 4,
      Mai: 5,
    };
    return months[monthName] || 1;
  };

  const getAllActiveWeekends = (): WeekendDate[] => {
    const allWeekends: WeekendDate[] = [];
    seasonCalendar.forEach((month) => {
      month.courseDates.forEach((dateInfo) => {
        const monthName = month.month.split(" ")[0];
        const year = month.month.includes("2026") ? 2026 : 2025;
        const monthNumber = getMonthNumber(monthName);
        const weekendDates = parseWeekendDates(
          dateInfo.weekend,
          monthNumber,
          year,
        );
        allWeekends.push(...weekendDates);
      });
    });
    return allWeekends.sort(
      (a, b) => a.startDate.getTime() - b.startDate.getTime(),
    );
  };

  const getAllOffWeekends = (): WeekendDate[] => {
    const allWeekends: WeekendDate[] = [];
    seasonCalendar.forEach((month) => {
      month.offDates.forEach((dateInfo) => {
        const monthName = month.month.split(" ")[0];
        const year = month.month.includes("2026") ? 2026 : 2025;
        const monthNumber = getMonthNumber(monthName);
        const weekendDates = parseWeekendDates(
          dateInfo.weekend,
          monthNumber,
          year,
        );
        allWeekends.push(...weekendDates);
      });
    });
    return allWeekends;
  };

  const allActiveWeekends = getAllActiveWeekends();
  const allOffWeekends = getAllOffWeekends();
  const nextActiveWeekend = getNextActiveWeekend(allActiveWeekends);

  const isDateActive = (date: Date): boolean => {
    return allActiveWeekends.some(
      (weekend) =>
        date.getTime() >= weekend.startDate.getTime() &&
        date.getTime() <= weekend.endDate.getTime(),
    );
  };

  const isDateOff = (date: Date): boolean => {
    return allOffWeekends.some(
      (weekend) =>
        date.getTime() >= weekend.startDate.getTime() &&
        date.getTime() <= weekend.endDate.getTime(),
    );
  };

  const isDateNext = (date: Date): boolean => {
    if (!nextActiveWeekend) return false;
    return (
      date.getTime() >= nextActiveWeekend.startDate.getTime() &&
      date.getTime() <= nextActiveWeekend.endDate.getTime()
    );
  };

  const modifiers = {
    active: allActiveWeekends.flatMap((weekend) => {
      const dates = [];
      let current = new Date(weekend.startDate);
      while (current <= weekend.endDate) {
        dates.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }
      return dates;
    }),
    off: allOffWeekends.flatMap((weekend) => {
      const dates = [];
      let current = new Date(weekend.startDate);
      while (current <= weekend.endDate) {
        dates.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }
      return dates;
    }),
    next: nextActiveWeekend
      ? (() => {
          const dates = [];
          let current = new Date(nextActiveWeekend.startDate);
          while (current <= nextActiveWeekend.endDate) {
            dates.push(new Date(current));
            current.setDate(current.getDate() + 1);
          }
          return dates;
        })()
      : [],
  };

  const modifiersClassNames = {
    active:
      "bg-green-100 h-3 w-3 text-green-800 hover:bg-green-200 rounded font-medium",
    off: "bg-red-100 text-red-800 hover:bg-red-200 rounded font-medium",
    next: "bg-green-300 text-green-900 hover:bg-green-400 font-bold rounded",
  };

  const getTooltipContent = (date: Date): string | null => {
    const dayOfWeek = date.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) return null; // Not weekend

    const isActive = allActiveWeekends.some(
      (weekend) =>
        date.getTime() >= weekend.startDate.getTime() &&
        date.getTime() <= weekend.endDate.getTime(),
    );

    const isOff = allOffWeekends.some(
      (weekend) =>
        date.getTime() >= weekend.startDate.getTime() &&
        date.getTime() <= weekend.endDate.getTime(),
    );

    const isNext =
      nextActiveWeekend &&
      date.getTime() >= nextActiveWeekend.startDate.getTime() &&
      date.getTime() <= nextActiveWeekend.endDate.getTime();

    if (isNext) {
      return `Următorul weekend activ - ${format(date, "d MMM yyyy", {
        locale: ro,
      })}`;
    } else if (isActive) {
      return `Cursuri programate - ${format(date, "d MMM yyyy", {
        locale: ro,
      })}`;
    } else if (isOff) {
      return `Weekend liber - ${format(date, "d MMM yyyy", { locale: ro })}`;
    }

    return null;
  };

  const CustomDay = ({
    day,
    modifiers,
    ...props
  }: {
    day: CalendarDay;
    modifiers: Modifiers;
  } & React.HTMLAttributes<HTMLDivElement>) => {
    const date = day.date;
    const tooltipContent = getTooltipContent(date);

    const dayClasses = cn(
      props.className,
      "h-6 w-6 text-xs flex items-center justify-center cursor-pointer m-auto",
    );

    if (tooltipContent) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <div {...props} className={dayClasses}>
              {format(date, "d")}
            </div>
          </TooltipTrigger>
          <TooltipContent>{tooltipContent}</TooltipContent>
        </Tooltip>
      );
    }

    return (
      <div {...props} className={dayClasses}>
        {format(date, "d")}
      </div>
    );
  };

  return (
    <TooltipProvider>
      <section className={cn("py-16", "bg-white")}>
        <div
          className={cn(
            "w-full",
            "max-w-content",
            "mx-auto",
            "px-4",
            "md:px-8",
            "lg:px-12",
          )}
        >
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

            <div className={cn("flex", "justify-center")}>
              <Calendar
                mode="single"
                numberOfMonths={1}
                showOutsideDays={false}
                weekStartsOn={1}
                defaultMonth={new Date(2025, 9, 1)}
                startMonth={new Date(2025, 9, 1)}
                endMonth={new Date(2026, 4, 31)}
                modifiers={modifiers}
                modifiersClassNames={modifiersClassNames}
                disabled={{
                  before: new Date(2025, 9, 1),
                  after: new Date(2026, 4, 31),
                }}
                components={{
                  Day: CustomDay,
                }}
                className={cn(
                  "rounded-md",
                  "w-full",
                  "max-w-xs",
                  "[&_table]:w-full",
                  "[&_td]:p-0",
                  "[&_th]:p-1",
                  "[&_th]:text-xs",
                  "[&_th]:font-medium",
                )}
              />
            </div>

            <div
              className={cn("mt-4", "text-center", "text-sm", "text-gray-600")}
            >
              <span
                className={cn("inline-flex", "items-center", "gap-1", "mr-4")}
              >
                <div
                  className={cn(
                    "w-2",
                    "h-2",
                    "rounded",
                    "bg-green-300",
                    "ring-1",
                    "ring-green-500",
                  )}
                ></div>
                Următorul weekend
              </span>
              <span
                className={cn("inline-flex", "items-center", "gap-1", "mr-4")}
              >
                <div
                  className={cn("w-2", "h-2", "rounded", "bg-green-100")}
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
    </TooltipProvider>
  );
};

export default SeasonCalendarView;
