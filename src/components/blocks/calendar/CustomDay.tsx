"use client";

import React, { useState } from "react";
import { CalendarDay, Modifiers } from "react-day-picker";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format } from "date-fns";
import { ro } from "date-fns/locale";
import { cn } from "@/utils/cn";
import { WeekendDate } from "@/utils/date";
import { getTooltipContent } from "@/utils/calendar-helpers";

interface CustomDayProps {
  day: CalendarDay;
  modifiers: Modifiers;
  allActiveWeekends: WeekendDate[];
  allOffWeekends: WeekendDate[];
  nextActiveWeekend: WeekendDate | null;
}

const CustomDay: React.FC<
  CustomDayProps & React.HTMLAttributes<HTMLDivElement>
> = ({
  day,
  modifiers,
  allActiveWeekends,
  allOffWeekends,
  nextActiveWeekend,
  ...props
}) => {
  const [mobileTooltipOpen, setMobileTooltipOpen] = useState(false);
  const date = day.date;
  const tooltipContent = getTooltipContent(
    date,
    allActiveWeekends,
    allOffWeekends,
    nextActiveWeekend,
    (date, formatStr) => format(date, formatStr, { locale: ro })
  );

  const dayClasses = cn(
    props.className,
    "h-6 w-6 m-auto text-xs flex items-center justify-center cursor"
  );

  if (tooltipContent) {
    return (
      <Tooltip open={mobileTooltipOpen} onOpenChange={setMobileTooltipOpen}>
        <TooltipTrigger asChild>
          <div
            {...props}
            className={dayClasses}
            onClick={() => setMobileTooltipOpen(!mobileTooltipOpen)}
          >
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

export default CustomDay;