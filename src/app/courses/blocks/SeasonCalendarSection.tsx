import { cn } from "@/utils/cn";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  parseWeekendDates,
  getNextActiveWeekend,
  isNextWeekend,
  WeekendDate,
} from "@/utils/date";
import React from "react";

interface WeekendInfo {
  weekend: string;
  days: string[];
}

interface MonthData {
  month: string;
  courseDates: WeekendInfo[];
  offDates: WeekendInfo[];
}

interface SeasonCalendarSectionProps {
  seasonCalendar: MonthData[];
}

const SeasonCalendarSection: React.FC<SeasonCalendarSectionProps> = ({
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

  const allActiveWeekends = getAllActiveWeekends();
  const nextActiveWeekend = getNextActiveWeekend(allActiveWeekends);

  const isCurrentWeekendNext = (
    dateInfo: WeekendInfo,
    monthName: string,
    year: number,
  ): boolean => {
    const monthNumber = getMonthNumber(monthName);
    const weekendDates = parseWeekendDates(dateInfo.weekend, monthNumber, year);

    return weekendDates.some((weekend) =>
      isNextWeekend(weekend, nextActiveWeekend),
    );
  };

  return (
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
        <div className={cn("max-w-6xl", "mx-auto")}>
          <h2
            className={cn(
              "text-3xl",
              "font-bold",
              "text-gray-800",
              "mb-8",
              "text-center",
              "font-['League_Spartan']",
            )}
          >
            Calendar Sezon 2025-2026
          </h2>
          <div>
            <Table>
              <TableHeader>
                <TableRow className={cn("bg-gray-100", "hover:bg-gray-100")}>
                  <TableHead className={cn("text-gray-700", "font-semibold")}>
                    Luna
                  </TableHead>
                  <TableHead className={cn("text-gray-700", "font-semibold")}>
                    Program Cursuri
                  </TableHead>
                  <TableHead className={cn("text-gray-700", "font-semibold")}>
                    Weekenduri Libere
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {seasonCalendar.map((monthData, index) => (
                  <TableRow
                    key={index}
                    className={cn(
                      index % 2 === 0 ? "bg-gray-50" : "bg-white",
                      "hover:bg-edusport-blue/5",
                      "transition-colors",
                    )}
                  >
                    <TableCell
                      className={cn(
                        "font-semibold",
                        "text-edusport-blue",
                        "min-w-[150px]",
                        "py-3",
                      )}
                    >
                      {monthData.month}
                    </TableCell>
                    <TableCell className={cn("py-3")}>
                      <div className={cn("flex", "flex-wrap", "gap-2")}>
                        {monthData.courseDates.map((dateInfo, dateIndex) => {
                          const monthName = monthData.month.split(" ")[0];
                          const year = monthData.month.includes("2026")
                            ? 2026
                            : 2025;
                          const isNext = isCurrentWeekendNext(
                            dateInfo,
                            monthName,
                            year,
                          );

                          return (
                            <div
                              key={dateIndex}
                              className={cn("group", "relative")}
                            >
                              <span
                                className={cn(
                                  "inline-flex",
                                  "items-center",
                                  "px-2",
                                  "py-1",
                                  isNext ? "bg-green-200" : "bg-green-50",
                                  isNext ? "text-green-900" : "text-green-700",
                                  "rounded",
                                  "text-xs",
                                  isNext ? "font-bold" : "font-medium",
                                  "border",
                                  isNext
                                    ? "border-green-400"
                                    : "border-green-150",
                                  "cursor-help",
                                )}
                              >
                                <div
                                  className={cn(
                                    "w-2",
                                    "h-2",
                                    isNext ? "bg-green-600" : "bg-green-400",
                                    "rounded-full",
                                    "mr-1",
                                    isNext ? "animate-pulse" : "",
                                  )}
                                ></div>
                                {dateInfo.weekend}
                              </span>
                              <div
                                className={cn(
                                  "absolute",
                                  "bottom-full",
                                  "left-1/2",
                                  "transform",
                                  "-translate-x-1/2",
                                  "mb-2",
                                  "px-2",
                                  "py-1",
                                  "bg-gray-900",
                                  "text-white",
                                  "text-xs",
                                  "rounded",
                                  "whitespace-nowrap",
                                  "opacity-0",
                                  "group-hover:opacity-100",
                                  "transition-opacity",
                                  "pointer-events-none",
                                  "z-10",
                                )}
                              >
                                {dateInfo.days.join(", ")}
                                <div
                                  className={cn(
                                    "absolute",
                                    "top-full",
                                    "left-1/2",
                                    "transform",
                                    "-translate-x-1/2",
                                    "border-4",
                                    "border-transparent",
                                    "border-t-gray-900",
                                  )}
                                ></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </TableCell>
                    <TableCell className={cn("py-3")}>
                      {monthData.offDates.length > 0 ? (
                        <div className={cn("flex", "flex-wrap", "gap-2")}>
                          {monthData.offDates.map((dateInfo, dateIndex) => (
                            <div
                              key={dateIndex}
                              className={cn("group", "relative")}
                            >
                              <span
                                className={cn(
                                  "inline-flex",
                                  "items-center",
                                  "px-2",
                                  "py-1",
                                  "bg-red-50",
                                  "text-red-700",
                                  "rounded",
                                  "text-xs",
                                  "font-medium",
                                  "border",
                                  "border-red-150",
                                  "cursor-help",
                                )}
                              >
                                <div
                                  className={cn(
                                    "w-2",
                                    "h-2",
                                    "bg-red-400",
                                    "rounded-full",
                                    "mr-1",
                                  )}
                                ></div>
                                {dateInfo.weekend}
                              </span>
                              <div
                                className={cn(
                                  "absolute",
                                  "bottom-full",
                                  "left-1/2",
                                  "transform",
                                  "-translate-x-1/2",
                                  "mb-2",
                                  "px-2",
                                  "py-1",
                                  "bg-gray-900",
                                  "text-white",
                                  "text-xs",
                                  "rounded",
                                  "whitespace-nowrap",
                                  "opacity-0",
                                  "group-hover:opacity-100",
                                  "transition-opacity",
                                  "pointer-events-none",
                                  "z-10",
                                )}
                              >
                                {dateInfo.days.join(", ")}
                                <div
                                  className={cn(
                                    "absolute",
                                    "top-full",
                                    "left-1/2",
                                    "transform",
                                    "-translate-x-1/2",
                                    "border-4",
                                    "border-transparent",
                                    "border-t-gray-900",
                                  )}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className={cn("text-gray-400", "text-xs")}>
                          Niciun weekend liber
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SeasonCalendarSection;
