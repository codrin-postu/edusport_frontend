"use client";

import { cn } from "@/utils/cn";
import React, { useMemo, useState } from "react";
import { useSeasonCalendar } from "@/hooks/useSeasonCalendar";
import type { CalendarEvent } from "@/app/cursuri/program/_types";
import { buildCalendarEvents } from "@/utils/fullcalendar-helpers";
import { WeekendDate, isWeekendInPast, isNextWeekend } from "@/utils/date";
import FullCalendarClient from "@/components/blocks/fullcalendar/FullCalendarClient";
import SlidingPillToggle from "@/components/ui/SlidingPillToggle";
import { format } from "date-fns";
import { ro } from "date-fns/locale";

// Stable reference — avoids re-creating the array on every render of the toggle
const CALENDAR_VIEW_OPTIONS = [
  { value: "calendar" as const, label: "Calendar complet" },
  { value: "weekends" as const, label: "Weekenduri sezon" },
];

interface SeasonCalendarViewV2Props {
  seasonCalendar: CalendarEvent[];
  seasonLabel?: string;
  /** "YYYY-MM" — first month of the season */
  seasonStart?: string | null;
  /** "YYYY-MM" — last month of the season (inclusive) */
  seasonEnd?: string | null;
}

// ─── Weekend card data ────────────────────────────────────────────────────────

interface WeekendCardData {
  weekend: WeekendDate;
  type: "curs" | "liber";
}

interface MonthGroup {
  label: string; // e.g. "Octombrie 2025"
  cards: WeekendCardData[];
}

function buildGroupedWeekends(
  activeWeekends: WeekendDate[],
  offWeekends: WeekendDate[],
  seasonStart: string, // "YYYY-MM-DD" inclusive start
  seasonEnd: string,   // "YYYY-MM-DD" exclusive end
): MonthGroup[] {
  // Pre-seed all months in the season range so empty months still get a column
  const groups: MonthGroup[] = [];
  const cursor = new Date(seasonStart);
  const end = new Date(seasonEnd);
  while (cursor < end) {
    groups.push({
      label: format(cursor, "LLLL yyyy", { locale: ro }),
      cards: [],
    });
    cursor.setMonth(cursor.getMonth() + 1);
  }

  const merged: WeekendCardData[] = [
    ...activeWeekends.map((w) => ({ weekend: w, type: "curs" as const })),
    ...offWeekends.map((w) => ({ weekend: w, type: "liber" as const })),
  ].sort(
    (a, b) => a.weekend.startDate.getTime() - b.weekend.startDate.getTime(),
  );

  for (const card of merged) {
    const label = format(card.weekend.startDate, "LLLL yyyy", { locale: ro });
    const group = groups.find((g) => g.label === label);
    if (group) {
      group.cards.push(card);
    }
  }
  return groups;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const LegendDot: React.FC<{ color: string; label: string }> = ({
  color,
  label,
}) => (
  <span className="inline-flex items-center gap-1.5">
    <span
      className="inline-block w-2.5 h-2.5 rounded-sm flex-shrink-0"
      style={{ background: color }}
    />
    <span>{label}</span>
  </span>
);

const WeekendRow: React.FC<{
  card: WeekendCardData;
  nextActiveWeekend: WeekendDate | null;
}> = ({ card, nextActiveWeekend }) => {
  const isPast = isWeekendInPast(card.weekend);
  const isNext = isNextWeekend(card.weekend, nextActiveWeekend);

  const startLabel = format(card.weekend.startDate, "d MMM", { locale: ro });
  const endLabel =
    card.weekend.startDate.getTime() !== card.weekend.endDate.getTime()
      ? format(card.weekend.endDate, "d MMM", { locale: ro })
      : null;

  return (
    <div
      className={cn(
        "flex items-center justify-between px-4 py-2.5 text-sm transition-colors",
        isPast ? "opacity-40" : "",
        isNext && "bg-green-50",
      )}
    >
      {/* Status dot */}
      <span
        className={cn(
          "w-2 h-2 rounded-full flex-shrink-0 mr-3",
          isNext
            ? "bg-green-500"
            : card.type === "curs"
              ? "bg-teal-400"
              : "bg-gray-200",
        )}
      />

      {/* Date */}
      <span
        className={cn(
          "flex-1 tabular-nums whitespace-nowrap",
          isPast ? "text-gray-600" : "text-gray-700",
        )}
      >
        {startLabel}
        {endLabel ? ` – ${endLabel}` : ""}
      </span>

      {/* Status label */}
      {isNext ? (
        <span className="text-xs font-medium text-green-600">
          Curs
        </span>
      ) : (
        <span
          className={cn(
            "text-xs",
            card.type === "curs"
              ? "text-teal-600 font-medium"
              : "text-gray-400",
          )}
        >
          {card.type === "curs" ? "Curs" : "Liber"}
        </span>
      )}
    </div>
  );
};

const MonthColumn: React.FC<{
  group: MonthGroup;
  nextActiveWeekend: WeekendDate | null;
}> = ({ group, nextActiveWeekend }) => {
  const allPast = group.cards.every((c) => isWeekendInPast(c.weekend));
  const [collapsed, setCollapsed] = useState(allPast);

  return (
    <div className="overflow-hidden">
      {/* Month label — acts as table header */}
      <div
        className={cn(
          "px-4 py-2 border-b border-gray-200 flex items-center justify-between",
          allPast && "sm:cursor-default cursor-pointer select-none",
        )}
        onClick={allPast ? () => setCollapsed((v) => !v) : undefined}
      >
        <span className="text-xs font-semibold uppercase tracking-widest text-gray-400 capitalize">
          {group.label}
        </span>
        {allPast && (
          <span className="sm:hidden text-gray-300 text-xs">
            {collapsed ? "▸" : "▾"}
          </span>
        )}
      </div>

      {/* Weekend rows */}
      <div className={cn("divide-y divide-gray-100", collapsed && "hidden sm:block")}>
        {group.cards.map((card, i) => (
          <WeekendRow key={i} card={card} nextActiveWeekend={nextActiveWeekend} />
        ))}
      </div>
    </div>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────

const SeasonCalendarViewV2: React.FC<SeasonCalendarViewV2Props> = ({
  seasonCalendar,
  seasonLabel = "2025–2026",
  seasonStart,
  seasonEnd,
}) => {
  const { allActiveWeekends, allOffWeekends, nextActiveWeekend, specialEvents } =
    useSeasonCalendar(seasonCalendar);

  const [activeView, setActiveView] = useState<"calendar" | "weekends">(
    "calendar",
  );

  // Derive FC valid range from seasonStart/seasonEnd ("YYYY-MM")
  // validRangeEnd is exclusive in FullCalendar → add 1 month past seasonEnd
  const fcValidStart = seasonStart ? `${seasonStart}-01` : "2025-10-01";
  const fcValidEnd = useMemo(() => {
    const end = seasonEnd ?? "2026-05";
    const [y, m] = end.split("-").map(Number);
    const next = m === 12 ? `${y + 1}-01` : `${y}-${String(m + 1).padStart(2, "0")}`;
    return `${next}-01`;
  }, [seasonEnd]);

  // Open at the current month, clamped to the season bounds
  const calendarInitialDate = useMemo(() => {
    const start = new Date(fcValidStart);
    const end = new Date(fcValidEnd);
    const today = new Date();
    const clamped = today < start ? start : today >= end ? new Date(end.getFullYear(), end.getMonth() - 1, 1) : today;
    return `${clamped.getFullYear()}-${String(clamped.getMonth() + 1).padStart(2, "0")}-01`;
  }, [fcValidStart, fcValidEnd]);

  const calendarEvents = useMemo(
    () =>
      buildCalendarEvents(allActiveWeekends, allOffWeekends, nextActiveWeekend, specialEvents),
    [allActiveWeekends, allOffWeekends, nextActiveWeekend, specialEvents],
  );

  // Filter weekends to the season bounds before building the list view
  const { filteredActive, filteredOff } = useMemo(() => {
    const start = new Date(fcValidStart);
    const end = new Date(fcValidEnd); // exclusive
    const inRange = (w: WeekendDate) => w.startDate >= start && w.startDate < end;
    return {
      filteredActive: allActiveWeekends.filter(inRange),
      filteredOff: allOffWeekends.filter(inRange),
    };
  }, [allActiveWeekends, allOffWeekends, fcValidStart, fcValidEnd]);

  const groupedWeekends = useMemo(
    () => buildGroupedWeekends(filteredActive, filteredOff, fcValidStart, fcValidEnd),
    [filteredActive, filteredOff, fcValidStart, fcValidEnd],
  );

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
        {/* Section heading */}
        <p className="text-xs font-semibold tracking-widest uppercase text-edusport-blue/60 mb-1">
          Calendar Sezon
        </p>
        <h2
          className={cn(
            "text-3xl md:text-4xl",
            "font-semibold",
            "text-gray-900",
            "mb-3",
            "leading-snug",
          )}
        >
          {seasonLabel}
        </h2>
        <p className="text-gray-500 text-sm mb-8">
          Datele în care se desfășoară cursurile și weekend-urile libere.
        </p>

        {/* Toggle */}
        <div className="flex justify-center mb-8">
          <SlidingPillToggle
            options={CALENDAR_VIEW_OPTIONS}
            value={activeView}
            onChange={setActiveView}
          />
        </div>

        {/* Calendar view */}
        {activeView === "calendar" && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 md:p-6">
            <FullCalendarClient
              events={calendarEvents}
              initialDate={calendarInitialDate}
              validRangeStart={fcValidStart}
              validRangeEnd={fcValidEnd}
            />

            {/* Legend */}
            <div className="mt-6 pt-4 border-t border-gray-100 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-gray-500">
              <LegendDot color="oklch(0.78 0.12 184)" label="Weekend Curs" />
              <LegendDot color="oklch(0.78 0 0)" label="Weekend liber" />
              <LegendDot color="oklch(0.78 0.16 85)" label="Sărbătoare legală" />
              <LegendDot color="oklch(0.78 0.12 280)" label="Vacanță școlară" />
              <LegendDot color="oklch(0.78 0.17 55)" label="Eveniment" />
              <LegendDot color="oklch(0.78 0.14 15)" label="Concurs" />
            </div>
          </div>
        )}

        {/* Weekend view — borderless table layout */}
        {activeView === "weekends" && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 divide-y sm:divide-y-0 divide-x-0 sm:divide-x divide-gray-200">
              {groupedWeekends.map((group) => (
                <MonthColumn
                  key={group.label}
                  group={group}
                  nextActiveWeekend={nextActiveWeekend}
                />
              ))}
            </div>

            {/* Legend */}
            <div className="mt-8 pt-6 border-t border-gray-200 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-gray-500">
              <span className="inline-flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-400 flex-shrink-0" />
                Weekend cursuri
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                Următoarele cursuri
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gray-200 flex-shrink-0" />
                Weekend liber
              </span>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default SeasonCalendarViewV2;
