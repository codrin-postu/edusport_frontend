"use client";

import { cn } from "@/utils/cn";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSeasonCalendar } from "@/hooks/useSeasonCalendar";
import type { CalendarEvent } from "@/app/cursuri/program/_types";
import { buildCalendarEvents } from "@/utils/fullcalendar-helpers";
import { WeekendDate, isWeekendInPast, isNextWeekend } from "@/utils/date";
import FullCalendarClient from "@/components/blocks/fullcalendar/FullCalendarClient";
import SlidingPillToggle from "@/components/ui/SlidingPillToggle";
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { renderMarkdown } from "@/utils/markdown";
import { format } from "date-fns";
import { ro } from "date-fns/locale";

// Stable reference - avoids re-creating the array on every render of the toggle
const CALENDAR_VIEW_OPTIONS = [
  { value: "calendar" as const, label: "Calendar complet" },
  { value: "weekends" as const, label: "Weekenduri sezon" },
];

interface SeasonCalendarViewV2Props {
  seasonCalendar: CalendarEvent[];
  seasonLabel?: string;
  /** "YYYY-MM" - first month of the season */
  seasonStart?: string | null;
  /** "YYYY-MM" - last month of the season (inclusive) */
  seasonEnd?: string | null;
}

// ─── Weekend card data ────────────────────────────────────────────────────────

type WeekendKind = "curs" | "liber" | "anulat";

interface WeekendCardData {
  weekend: WeekendDate;
  type: WeekendKind;
}

interface MonthGroup {
  label: string; // e.g. "Octombrie 2025"
  cards: WeekendCardData[];
}

function buildGroupedWeekends(
  activeWeekends: WeekendDate[],
  offWeekends: WeekendDate[],
  cancelledWeekends: WeekendDate[],
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
    ...cancelledWeekends.map((w) => ({ weekend: w, type: "anulat" as const })),
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

const STATE_LABEL: Record<WeekendKind, string> = {
  curs: "Curs",
  liber: "Liber",
  anulat: "Curs anulat",
};

const WeekendRow: React.FC<{
  card: WeekendCardData;
  nextActiveWeekend: WeekendDate | null;
}> = ({ card, nextActiveWeekend }) => {
  const isPast = isWeekendInPast(card.weekend);
  const isCancelled = card.type === "anulat";
  const isNext = !isCancelled && isNextWeekend(card.weekend, nextActiveWeekend);

  const startLabel = format(card.weekend.startDate, "d MMM", { locale: ro });
  const endLabel =
    card.weekend.startDate.getTime() !== card.weekend.endDate.getTime()
      ? format(card.weekend.endDate, "d MMM", { locale: ro })
      : null;

  const stateLabel = isNext ? "Curs" : STATE_LABEL[card.type];
  const description = card.weekend.description ?? null;
  const hasDescription =
    isCancelled && !!description && description.trim().length > 0;

  const row = (
    <div
      className={cn(
        "flex items-center justify-between px-4 py-2.5 text-sm transition-colors",
        isPast ? "opacity-40" : "",
        isNext && "bg-green-50",
        isCancelled && "bg-red-50",
        hasDescription && "cursor-help hover:bg-gray-50",
      )}
    >
      {/* Status dot */}
      <span
        className={cn(
          "w-2 h-2 rounded-full flex-shrink-0 mr-3",
          isNext
            ? "bg-green-500"
            : isCancelled
              ? "bg-red-500"
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
          isCancelled && "line-through text-gray-500",
        )}
      >
        {startLabel}
        {endLabel ? ` – ${endLabel}` : ""}
      </span>

      {/* Status label */}
      <span
        className={cn(
          "text-xs",
          isNext
            ? "text-green-600 font-medium"
            : isCancelled
              ? "text-red-600 font-medium"
              : card.type === "curs"
                ? "text-teal-600 font-medium"
                : "text-gray-400",
        )}
      >
        {stateLabel}
      </span>
    </div>
  );

  if (!hasDescription) return row;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{row}</TooltipTrigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          side="top"
          align="center"
          sideOffset={2}
          collisionPadding={12}
          className="z-50 max-w-[320px] bg-white text-gray-700 border border-gray-200 shadow-lg rounded-lg px-3 py-2.5 text-2xs leading-snug space-y-1.5 animate-in fade-in-0 zoom-in-95"
        >
          <p className="text-3xs font-semibold uppercase tracking-wider text-edusport-blue/70">
            {stateLabel}
          </p>
          <div className="space-y-1.5 [&_p]:m-0 [&_p]:text-inherit [&_strong]:font-semibold [&_strong]:text-gray-900">
            {renderMarkdown(description)}
          </div>
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </Tooltip>
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
      {/* Month label - acts as table header */}
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
  const { allActiveWeekends, allOffWeekends, allCancelledWeekends, nextActiveWeekend, specialEvents } =
    useSeasonCalendar(seasonCalendar);

  const [activeView, setActiveView] = useState<"calendar" | "weekends">(
    "calendar",
  );

  // Defer FullCalendar bundle until the container scrolls near the viewport.
  // Saves ~50–80 KB of initial JS on /cursuri/program.
  const calendarContainerRef = useRef<HTMLDivElement>(null);
  const [shouldMountCalendar, setShouldMountCalendar] = useState(false);

  useEffect(() => {
    if (shouldMountCalendar) return;
    const node = calendarContainerRef.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      setShouldMountCalendar(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShouldMountCalendar(true);
            observer.disconnect();
            break;
          }
        }
      },
      { rootMargin: "400px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [shouldMountCalendar]);

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

  // eslint-disable-next-line no-console
  console.log("[SeasonCalendarViewV2] season props:", {
    seasonStart,
    seasonEnd,
    fcValidStart,
    fcValidEnd,
    calendarInitialDate,
    today: new Date().toISOString(),
    seasonCalendarLength: seasonCalendar?.length ?? 0,
    firstEventDates: seasonCalendar?.slice(0, 3).map((e) => ({ start: e.startDate, end: e.endDate, type: e.type })),
    lastEventDates: seasonCalendar?.slice(-3).map((e) => ({ start: e.startDate, end: e.endDate, type: e.type })),
  });

  const calendarEvents = useMemo(
    () =>
      buildCalendarEvents(
        allActiveWeekends,
        allOffWeekends,
        nextActiveWeekend,
        specialEvents,
        allCancelledWeekends,
      ),
    [allActiveWeekends, allOffWeekends, allCancelledWeekends, nextActiveWeekend, specialEvents],
  );

  // Filter weekends to the season bounds before building the list view
  const { filteredActive, filteredOff, filteredCancelled } = useMemo(() => {
    const start = new Date(fcValidStart);
    const end = new Date(fcValidEnd); // exclusive
    const inRange = (w: WeekendDate) => w.startDate >= start && w.startDate < end;
    return {
      filteredActive: allActiveWeekends.filter(inRange),
      filteredOff: allOffWeekends.filter(inRange),
      filteredCancelled: allCancelledWeekends.filter(inRange),
    };
  }, [allActiveWeekends, allOffWeekends, allCancelledWeekends, fcValidStart, fcValidEnd]);

  const groupedWeekends = useMemo(
    () => buildGroupedWeekends(filteredActive, filteredOff, filteredCancelled, fcValidStart, fcValidEnd),
    [filteredActive, filteredOff, filteredCancelled, fcValidStart, fcValidEnd],
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
            disabled={!shouldMountCalendar && activeView === "calendar"}
          />
        </div>

        {/* Calendar view */}
        {activeView === "calendar" && (
          <div
            ref={calendarContainerRef}
            className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 md:p-6"
          >
            {shouldMountCalendar ? (
              <FullCalendarClient
                events={calendarEvents}
                initialDate={calendarInitialDate}
                validRangeStart={fcValidStart}
                validRangeEnd={fcValidEnd}
              />
            ) : (
              <div
                className="flex items-center justify-center bg-gray-50 rounded-xl border border-gray-200"
                style={{ minHeight: 600 }}
                aria-hidden="true"
              />
            )}
          </div>
        )}

        {/* Weekend view - borderless table layout */}
        {activeView === "weekends" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 divide-y sm:divide-y-0 divide-x-0 sm:divide-x divide-gray-200">
            {groupedWeekends.map((group) => (
              <MonthColumn
                key={group.label}
                group={group}
                nextActiveWeekend={nextActiveWeekend}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default SeasonCalendarViewV2;
