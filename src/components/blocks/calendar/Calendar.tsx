"use client";

import React from "react";
import { Calendar as ShadcnCalendar } from "@/components/ui/calendar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/utils/cn";
import { WeekendDate } from "@/utils/date";
import CustomDay from "./CustomDay";
import type { CalendarDay, Modifiers } from "react-day-picker";

interface CalendarProps {
  modifiers: Record<string, Date[]>;
  modifiersClassNames: Record<string, string>;
  allActiveWeekends: WeekendDate[];
  allOffWeekends: WeekendDate[];
  nextActiveWeekend: WeekendDate | null;
  startMonth?: Date;
  endMonth?: Date;
  defaultMonth?: Date;
  className?: string;
}

const Calendar: React.FC<CalendarProps> = ({
  modifiers,
  modifiersClassNames,
  allActiveWeekends,
  allOffWeekends,
  nextActiveWeekend,
  startMonth = new Date(2025, 9, 1),
  endMonth = new Date(2026, 4, 31),
  defaultMonth = new Date(2025, 9, 1),
  className,
}) => {
  const CustomDayWithProps = (props: { day: CalendarDay; modifiers: Modifiers } & React.HTMLAttributes<HTMLDivElement>) => (
    <CustomDay
      {...props}
      allActiveWeekends={allActiveWeekends}
      allOffWeekends={allOffWeekends}
      nextActiveWeekend={nextActiveWeekend}
    />
  );

  return (
    <TooltipProvider>
      <div className={cn("flex", "justify-center")}>
        <ShadcnCalendar
          mode="single"
          numberOfMonths={1}
          showOutsideDays={false}
          weekStartsOn={1}
          defaultMonth={defaultMonth}
          startMonth={startMonth}
          endMonth={endMonth}
          modifiers={modifiers}
          modifiersClassNames={modifiersClassNames}
          disabled={{
            before: startMonth,
            after: endMonth,
          }}
          components={{
            Day: CustomDayWithProps,
          }}
          className={cn(
            "rounded-md",
            "w-full",
            "max-w-3xs",
            "[&_table]:w-full",
            "[&_tr]:flex",
            "[&_tr]:w-full",
            "[&_td]:text-center",
            "[&_th]:text-xs",
            "[&_th]:font-medium",
            "[&_th]:text-center",
            className,
          )}
        />
      </div>
    </TooltipProvider>
  );
};

export default Calendar;
