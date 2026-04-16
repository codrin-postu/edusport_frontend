"use client";

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
  isWeekendInPast,
  WeekendDate,
} from "@/utils/date";
import React, { useMemo, useState } from "react";

interface WeekendInfo {
  weekend: string;
  days: string[];
}

interface MonthData {
  month: string;
  courseDates: WeekendInfo[];
  offDates: WeekendInfo[];
}

interface SeasonTableViewProps {
  seasonCalendar: MonthData[];
}

const MONTH_NUMBER: Record<string, number> = {
  Octombrie: 10,
  Noiembrie: 11,
  Decembrie: 12,
  Ianuarie: 1,
  Februarie: 2,
  Martie: 3,
  Aprilie: 4,
  Mai: 5,
};

function getMonthNumber(monthName: string): number {
  return MONTH_NUMBER[monthName] ?? 1;
}

function getYearFromMonthLabel(monthLabel: string): number {
  return monthLabel.includes("2026") ? 2026 : 2025;
}

function getAllActiveWeekends(seasonCalendar: MonthData[]): WeekendDate[] {
  const allWeekends: WeekendDate[] = [];
  for (const monthData of seasonCalendar) {
    const monthName = monthData.month.split(" ")[0];
    const year = getYearFromMonthLabel(monthData.month);
    const monthNumber = getMonthNumber(monthName);
    for (const dateInfo of monthData.courseDates) {
      allWeekends.push(...parseWeekendDates(dateInfo.weekend, monthNumber, year));
    }
  }
  return allWeekends.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
}

function isMonthFullyPast(monthData: MonthData): boolean {
  const monthName = monthData.month.split(" ")[0];
  const year = getYearFromMonthLabel(monthData.month);
  const monthNumber = getMonthNumber(monthName);
  const allDates = [...monthData.courseDates, ...monthData.offDates];
  if (allDates.length === 0) return false;
  return allDates.every((dateInfo) =>
    parseWeekendDates(dateInfo.weekend, monthNumber, year).every(isWeekendInPast),
  );
}

// ── Tooltip ──────────────────────────────────────────────────────────────────

const tooltipClass = cn(
  "absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1",
  "bg-gray-900 text-white text-xs rounded whitespace-nowrap",
  "opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10",
);

const tooltipArrowClass = cn(
  "absolute top-full left-1/2 -translate-x-1/2",
  "border-4 border-transparent border-t-gray-900",
);

const TooltipWrapper: React.FC<{ label: string; children: React.ReactNode }> = ({
  label,
  children,
}) => (
  <div className="group relative">
    {children}
    <div className={tooltipClass}>
      {label}
      <div className={tooltipArrowClass} />
    </div>
  </div>
);

// ── Date badge ────────────────────────────────────────────────────────────────

const CourseDateBadge: React.FC<{ dateInfo: WeekendInfo; isNext: boolean }> = ({
  dateInfo,
  isNext,
}) => (
  <TooltipWrapper label={dateInfo.days.join(", ")}>
    <span
      className={cn(
        "inline-flex items-center px-2 py-1 rounded text-xs border cursor-help",
        isNext
          ? "bg-green-400 text-green-950 font-bold border-green-600"
          : "bg-green-50 text-green-700 font-medium border-green-150",
      )}
    >
      <div
        className={cn(
          "w-2 h-2 rounded-full mr-1",
          isNext ? "bg-green-600 animate-pulse" : "bg-green-400",
        )}
      />
      {dateInfo.weekend}
    </span>
  </TooltipWrapper>
);

const OffDateBadge: React.FC<{ dateInfo: WeekendInfo }> = ({ dateInfo }) => (
  <TooltipWrapper label={dateInfo.days.join(", ")}>
    <span className="inline-flex items-center px-2 py-1 bg-red-50 text-red-700 rounded text-xs font-medium border border-red-150 cursor-help">
      <div className="w-2 h-2 bg-red-400 rounded-full mr-1" />
      {dateInfo.weekend}
    </span>
  </TooltipWrapper>
);

// ── Main component ────────────────────────────────────────────────────────────

const SeasonTableView: React.FC<SeasonTableViewProps> = ({ seasonCalendar }) => {
  const allActiveWeekends = useMemo(
    () => getAllActiveWeekends(seasonCalendar),
    [seasonCalendar],
  );
  const nextActiveWeekend = useMemo(
    () => getNextActiveWeekend(allActiveWeekends),
    [allActiveWeekends],
  );

  const isWeekendNext = (dateInfo: WeekendInfo, monthName: string, year: number): boolean => {
    const monthNumber = getMonthNumber(monthName);
    const weekendDates = parseWeekendDates(dateInfo.weekend, monthNumber, year);
    return weekendDates.some((weekend) => isNextWeekend(weekend, nextActiveWeekend));
  };

  const [collapsed, setCollapsed] = useState<Record<number, boolean>>(() =>
    Object.fromEntries(
      seasonCalendar.map((monthData, i) => [i, isMonthFullyPast(monthData)]),
    ),
  );

  return (
    <section className="py-16 bg-white">
      <div className="w-full max-w-content mx-auto px-4 md:px-8 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center font-['League_Spartan']">
            Calendar Sezon 2025-2026
          </h2>
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100 hover:bg-gray-100">
                <TableHead className="text-gray-700 font-semibold">Luna</TableHead>
                <TableHead className="text-gray-700 font-semibold">Program Cursuri</TableHead>
                <TableHead className="text-gray-700 font-semibold">Weekenduri Libere</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {seasonCalendar.map((monthData, rowIndex) => {
                const isPast = isMonthFullyPast(monthData);
                const isCollapsed = isPast && (collapsed[rowIndex] ?? true);
                const monthName = monthData.month.split(" ")[0];
                const year = getYearFromMonthLabel(monthData.month);

                return (
                  <TableRow
                    key={rowIndex}
                    className={cn(
                      rowIndex % 2 === 0 ? "bg-gray-50" : "bg-white",
                      "hover:bg-edusport-blue/5 transition-colors",
                    )}
                  >
                    <TableCell
                      className={cn(
                        "font-semibold text-edusport-blue min-w-[150px] py-3",
                        isPast && "md:cursor-default cursor-pointer select-none",
                      )}
                      onClick={
                        isPast
                          ? () => setCollapsed((prev) => ({ ...prev, [rowIndex]: !prev[rowIndex] }))
                          : undefined
                      }
                    >
                      <div className="flex items-center gap-1">
                        <span>{monthData.month}</span>
                        {isPast && (
                          <span className="md:hidden text-gray-400 text-xs leading-none">
                            {isCollapsed ? "▸" : "▾"}
                          </span>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="py-3">
                      <div className={cn("flex flex-wrap gap-2", isCollapsed && "hidden md:flex")}>
                        {monthData.courseDates.map((dateInfo, dateIndex) => (
                          <CourseDateBadge
                            key={dateIndex}
                            dateInfo={dateInfo}
                            isNext={isWeekendNext(dateInfo, monthName, year)}
                          />
                        ))}
                      </div>
                    </TableCell>

                    <TableCell className="py-3">
                      <div className={isCollapsed ? "hidden md:block" : undefined}>
                        {monthData.offDates.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {monthData.offDates.map((dateInfo, dateIndex) => (
                              <OffDateBadge key={dateIndex} dateInfo={dateInfo} />
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-xs">Niciun weekend liber</span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </section>
  );
};

export default SeasonTableView;
