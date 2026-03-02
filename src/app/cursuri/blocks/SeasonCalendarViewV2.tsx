"use client";

import { cn } from "@/utils/cn";
import React, { useMemo, useState } from "react";
import { useSeasonCalendar } from "@/hooks/useSeasonCalendar";
import { MonthData } from "@/utils/calendar-helpers";
import { buildCalendarEvents } from "@/utils/fullcalendar-helpers";
import { WeekendDate, isWeekendInPast, isNextWeekend } from "@/utils/date";
import { FullCalendarClient } from "@/components/blocks";
import SlidingPillToggle from "@/components/ui/SlidingPillToggle";
import { format } from "date-fns";
import { ro } from "date-fns/locale";

// Stable reference — avoids re-creating the array on every render of the toggle
const CALENDAR_VIEW_OPTIONS = [
  { value: "calendar" as const, label: "Calendar complet" },
  { value: "weekends" as const, label: "Weekenduri sezon" },
];

interface SeasonCalendarViewV2Props {
  seasonCalendar: MonthData[];
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
): MonthGroup[] {
  const merged: WeekendCardData[] = [
    ...activeWeekends.map((w) => ({ weekend: w, type: "curs" as const })),
    ...offWeekends.map((w) => ({ weekend: w, type: "liber" as const })),
  ].sort((a, b) => a.weekend.startDate.getTime() - b.weekend.startDate.getTime());

  const groups: MonthGroup[] = [];
  for (const card of merged) {
    const label = format(card.weekend.startDate, "LLLL yyyy", { locale: ro });
    const last = groups[groups.length - 1];
    if (last && last.label === label) {
      last.cards.push(card);
    } else {
      groups.push({ label, cards: [card] });
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
    <span className={cn("inline-block w-2.5 h-2.5 rounded-sm flex-shrink-0", color)} />
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
          isNext ? "bg-green-500" : card.type === "curs" ? "bg-teal-400" : "bg-gray-200",
        )}
      />

      {/* Date */}
      <span className={cn("flex-1 tabular-nums", isPast ? "text-gray-600" : "text-gray-700")}>
        {startLabel}
        {endLabel ? ` – ${endLabel}` : ""}
      </span>

      {/* Status label */}
      {isNext ? (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-600">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          Următor
        </span>
      ) : (
        <span
          className={cn(
            "text-xs",
            card.type === "curs" ? "text-teal-600 font-medium" : "text-gray-400",
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
}> = ({ group, nextActiveWeekend }) => (
  <div className="overflow-hidden">
    {/* Month label — acts as table header */}
    <div className="px-4 py-2 border-b border-gray-200">
      <span className="text-xs font-semibold uppercase tracking-widest text-gray-400 capitalize">
        {group.label}
      </span>
    </div>

    {/* Weekend rows */}
    <div className="divide-y divide-gray-100">
      {group.cards.map((card, i) => (
        <WeekendRow key={i} card={card} nextActiveWeekend={nextActiveWeekend} />
      ))}
    </div>
  </div>
);

// ─── Main component ───────────────────────────────────────────────────────────

const SeasonCalendarViewV2: React.FC<SeasonCalendarViewV2Props> = ({
  seasonCalendar,
}) => {
  const { allActiveWeekends, allOffWeekends, nextActiveWeekend } =
    useSeasonCalendar(seasonCalendar);

  const [activeView, setActiveView] = useState<"calendar" | "weekends">(
    "calendar",
  );

  const calendarInitialDate = useMemo(() => {
    const seasonStart = new Date(2025, 9, 1); // Oct 2025
    const seasonEnd = new Date(2026, 4, 31);  // May 2026
    const today = new Date();
    const clamped = today < seasonStart ? seasonStart : today > seasonEnd ? seasonEnd : today;
    return `${clamped.getFullYear()}-${String(clamped.getMonth() + 1).padStart(2, "0")}-01`;
  }, []);

  const calendarEvents = useMemo(
    () => buildCalendarEvents(allActiveWeekends, allOffWeekends, nextActiveWeekend),
    [allActiveWeekends, allOffWeekends, nextActiveWeekend],
  );

  const groupedWeekends = useMemo(
    () => buildGroupedWeekends(allActiveWeekends, allOffWeekends),
    [allActiveWeekends, allOffWeekends],
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
          2025–2026
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
              validRangeStart="2025-10-01"
              validRangeEnd="2026-06-01"
            />

            {/* Legend */}
            <div className="mt-6 pt-4 border-t border-gray-100 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-gray-500">
              <LegendDot color="bg-teal-500/80" label="Curs programat" />
              <LegendDot color="bg-gray-300" label="Weekend liber" />
              <LegendDot color="bg-amber-300" label="Sărbătoare legală" />
              <LegendDot color="bg-indigo-300" label="Vacanță școlară" />
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
                Curs programat
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                Următor weekend
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
