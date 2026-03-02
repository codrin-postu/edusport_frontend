"use client";

import { cn } from "@/utils/cn";
import React from "react";
import { useSeasonCalendar } from "@/hooks/useSeasonCalendar";
import { MonthData } from "@/utils/calendar-helpers";
import { Calendar } from "@/components/blocks";

interface SeasonCalendarViewProps {
  seasonCalendar: MonthData[];
}

interface DayEntry {
  date: string;
  type: "curs" | "liber";
}

function buildMonthEntries(monthData: MonthData): DayEntry[] {
  const entries: DayEntry[] = [];

  // Collect all days from courseDates and offDates, then sort them
  const courseDays: string[] = [];
  const offDays: string[] = [];

  monthData.courseDates.forEach((w) => {
    w.days.forEach((d) => courseDays.push(d));
  });
  monthData.offDates.forEach((w) => {
    w.days.forEach((d) => offDays.push(d));
  });

  // Parse day number from strings like "4 Oct (Sâm)" → 4
  const getDayNum = (s: string) => parseInt(s.split(" ")[0], 10);

  const allDays: DayEntry[] = [
    ...courseDays.map((d) => ({ date: d, type: "curs" as const })),
    ...offDays.map((d) => ({ date: d, type: "liber" as const })),
  ].sort((a, b) => getDayNum(a.date) - getDayNum(b.date));

  return allDays;
}

const MonthCard: React.FC<{ monthData: MonthData }> = ({ monthData }) => {
  const entries = buildMonthEntries(monthData);
  const monthLabel = monthData.month; // e.g. "Octombrie 2025"

  return (
    <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-white">
      {/* Month header */}
      <div
        className="px-4 py-3 text-center font-semibold text-white text-sm tracking-wide italic"
        style={{
          background:
            "linear-gradient(110deg, oklch(0.18 0.12 264) 0%, oklch(0.421 0.2593 264.52) 100%)",
        }}
      >
        {monthLabel}
      </div>

      {/* Date rows */}
      <div className="divide-y divide-gray-100">
        {entries.map((entry, i) => (
          <div
            key={i}
            className={cn(
              "flex items-center justify-between px-4 py-2 text-sm",
              entry.type === "curs"
                ? "bg-teal-50"
                : "bg-white",
            )}
          >
            {/* Date label — strip the parenthetical day abbreviation for cleanliness */}
            <span className={cn("font-medium", entry.type === "curs" ? "text-teal-900" : "text-gray-400")}>
              {entry.date.replace(/\s*\(.*?\)/, "")}
            </span>
            {entry.type === "curs" ? (
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-500/15 text-teal-700 border border-teal-200/60">
                Curs
              </span>
            ) : (
              <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-400 border border-gray-200">
                Liber
              </span>
            )}
          </div>
        ))}
        {entries.length === 0 && (
          <div className="px-4 py-3 text-xs text-gray-400 text-center">
            Nicio dată programată
          </div>
        )}
      </div>
    </div>
  );
};

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
    <section className={cn("py-12 md:py-16", "bg-gray-50")}>
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
        <h2
          className={cn(
            "text-3xl",
            "font-bold",
            "text-gray-800",
            "mb-3",
            "text-center",
            "font-['League_Spartan']",
          )}
        >
          Calendar Sezon 2025–2026
        </h2>
        <p className="text-center text-gray-500 text-sm mb-10">
          Datele în care se desfășoară cursurile și weekend-urile libere.
        </p>

        {/* Month grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-14">
          {seasonCalendar.map((monthData, i) => (
            <MonthCard key={i} monthData={monthData} />
          ))}
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-6 mb-10 text-sm text-gray-500">
          <span className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full bg-teal-500/70" />
            Curs programat
          </span>
          <span className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full bg-gray-300" />
            Weekend liber
          </span>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 mb-12" />

        {/* Interactive calendar */}
        <h3 className="text-xl font-semibold text-gray-700 mb-6 text-center">
          Calendar interactiv
        </h3>
        <div className="flex justify-center">
          <div className="w-full max-w-2xl">
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

            <div className="mt-4 text-center text-sm text-gray-600 flex justify-center flex-wrap gap-x-6 gap-y-2">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-green-300" />
                Următorul weekend
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-green-200" />
                Cursuri programate
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-red-100" />
                Weekend liber
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SeasonCalendarView;
