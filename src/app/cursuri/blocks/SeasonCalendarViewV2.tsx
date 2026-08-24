"use client";

import { cn } from "@/utils/cn";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSeasonCalendar } from "@/hooks/useSeasonCalendar";
import type { CalendarEvent } from "@/app/cursuri/program/_types";
import { buildCalendarEvents, occurrencesToEvents } from "@/utils/fullcalendar-helpers";
import { fetchCalendarOccurrences } from "@/lib/strapi-calendar";
import type { EventInput } from "@fullcalendar/core";
import { WeekendDate, isWeekendInPast, isNextWeekend } from "@/utils/date";
import FullCalendarClient from "@/components/blocks/fullcalendar/FullCalendarClient";
import WeekGridClient from "@/components/blocks/fullcalendar/WeekGridClient";
import ViewModeDropdown, { type CalendarMode } from "@/components/blocks/fullcalendar/ViewModeDropdown";
import SlidingPillToggle from "@/components/ui/SlidingPillToggle";
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { renderMarkdown } from "@/utils/markdown";
import { format } from "date-fns";
import { ro } from "date-fns/locale";

// Stable reference - avoids re-creating the array on every render of the toggle
const CALENDAR_VIEW_OPTIONS = [
  { value: "calendar" as const, label: "Calendar complet" },
  { value: "weekends" as const, label: "Weekenduri Școala Patinaj" },
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

  // Colour square = course colour (navy) / silver for liber / faded navy for cancelled.
  const squareColor =
    card.type === "liber" ? "bg-silver" : isCancelled ? "bg-navy/45" : "bg-navy";
  const stateColor = isNext
    ? "text-navy font-bold"
    : isCancelled
      ? "text-rust font-medium"
      : card.type === "curs"
        ? "text-navy/70"
        : "text-navy/45";

  const row = (
    <div
      className={cn(
        "flex items-center px-4 py-2.5 text-sm border-t border-navy/[0.08] first:border-t-0 transition-colors",
        isPast && "opacity-40",
        isNext && "bg-mustard/[0.16]",
        hasDescription && "cursor-help",
      )}
    >
      {/* Status square */}
      <span className={cn("w-2.5 h-2.5 flex-shrink-0 mr-3", squareColor)} />

      {/* Date */}
      <span
        className={cn(
          "flex-1 tabular-nums whitespace-nowrap text-navy",
          isCancelled && "line-through text-navy/50",
        )}
      >
        {startLabel}
        {endLabel ? ` – ${endLabel}` : ""}
      </span>

      {/* Status label */}
      <span className={cn("text-xs", stateColor)}>{stateLabel}</span>
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
          className="z-50 max-w-[320px] bg-retro-cream text-navy/75 border-[1.5px] border-navy shadow-[6px_6px_0_rgb(14_26_60_/_0.18)] px-3 py-2.5 text-2xs leading-snug space-y-1.5 animate-in fade-in-0 zoom-in-95"
        >
          <p className="text-3xs font-bold uppercase tracking-wider text-rust">
            {stateLabel}
          </p>
          <div className="space-y-1.5 [&_p]:m-0 [&_p]:text-inherit [&_strong]:font-semibold [&_strong]:text-navy">
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
          "px-4 py-2.5 border-b-[1.5px] border-navy flex items-center justify-between",
          allPast && "sm:cursor-default cursor-pointer select-none",
        )}
        onClick={allPast ? () => setCollapsed((v) => !v) : undefined}
      >
        <span className="text-xs font-extrabold uppercase tracking-[0.08em] text-navy capitalize">
          {group.label}
        </span>
        {allPast && (
          <span className="sm:hidden text-navy/40 text-xs">
            {collapsed ? "▸" : "▾"}
          </span>
        )}
      </div>

      {/* Weekend rows */}
      <div className={cn(collapsed && "hidden sm:block")}>
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
  const [calendarMode, setCalendarMode] = useState<CalendarMode>("month");

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

  // Shared focus date so switching Lunar <-> Săptămânal keeps roughly the same period.
  const [focusDate, setFocusDate] = useState<string>(calendarInitialDate);

  // Timed hourly sessions for the WEEK grid only (month + weekend views keep the
  // existing weekend model). Fetched per visible week from the backend expansion
  // endpoint — a full season exceeds its 92-day cap, so we request just the
  // focused week and refetch as you navigate.
  const [hourlyEvents, setHourlyEvents] = useState<EventInput[]>([]);
  useEffect(() => {
    if (calendarMode !== "week") return;
    const d = new Date(focusDate);
    if (Number.isNaN(d.getTime())) return;
    const dow = (d.getDay() + 6) % 7; // Monday = 0
    const monday = new Date(d);
    monday.setDate(d.getDate() - dow);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    const ymd = (x: Date) =>
      `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}-${String(x.getDate()).padStart(2, "0")}`;
    let cancelled = false;
    fetchCalendarOccurrences(ymd(monday), ymd(sunday)).then((res) => {
      if (!cancelled) setHourlyEvents(occurrencesToEvents(res.occurrences));
    });
    return () => {
      cancelled = true;
    };
  }, [calendarMode, focusDate]);

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
    <section className="py-16 md:py-24 bg-retro-cream">
      <div className="w-full max-w-content mx-auto px-4 md:px-8 lg:px-12">
        {/* Header — eyebrow + title left, description right */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3 sm:gap-8">
          <div>
            <span className="text-eyebrow font-bold uppercase text-rust">
              Calendar sezon
            </span>
            <h2 className="font-display text-display-sm font-extrabold text-navy leading-[1.05] tracking-[-0.4px] mt-1.5">
              Sezonul {seasonLabel}
            </h2>
          </div>
          <p className="text-navy/60 text-sm sm:text-right sm:max-w-xs">
            Datele în care se desfășoară cursurile și weekend-urile libere.
          </p>
        </div>

        {/* View toggle */}
        <div className="mt-6 mb-8">
          <SlidingPillToggle
            options={CALENDAR_VIEW_OPTIONS}
            value={activeView}
            onChange={setActiveView}
            disabled={!shouldMountCalendar && activeView === "calendar"}
          />
        </div>

        {/* Calendar view — Lunar (month grid) / Săptămânal (rolling timeline) */}
        {activeView === "calendar" && (
          <>
            {/* Shared card chrome (border + offset shadow) for both modes */}
            <div
              ref={calendarContainerRef}
              className="bg-retro-cream border-[1.5px] border-navy shadow-[8px_8px_0_rgb(14_26_60_/_0.16)]"
            >
              {calendarMode === "month" ? (
                shouldMountCalendar ? (
                  <FullCalendarClient
                    events={calendarEvents}
                    initialDate={focusDate}
                    validRangeStart={fcValidStart}
                    validRangeEnd={fcValidEnd}
                    onDatesChange={setFocusDate}
                    viewModeControl={
                      <ViewModeDropdown value={calendarMode} onChange={setCalendarMode} />
                    }
                  />
                ) : (
                  <div
                    className="flex items-center justify-center bg-navy/[0.04]"
                    style={{ minHeight: 600 }}
                    aria-hidden="true"
                  />
                )
              ) : (
                <WeekGridClient
                  events={[...calendarEvents, ...hourlyEvents]}
                  initialDate={focusDate}
                  validRangeStart={fcValidStart}
                  validRangeEnd={fcValidEnd}
                  onDatesChange={setFocusDate}
                  viewModeControl={
                    <ViewModeDropdown value={calendarMode} onChange={setCalendarMode} />
                  }
                />
              )}
            </div>

            {/* Legend */}
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-navy/60">
              <span className="inline-flex items-center gap-2"><i className="w-3.5 h-2.5 bg-navy" />Curs</span>
              <span className="inline-flex items-center gap-2"><i className="w-3.5 h-2.5 bg-silver" />Liber</span>
              <span className="inline-flex items-center gap-2"><i className="w-3.5 h-2.5 bg-navy opacity-45" />Anulat</span>
              <span className="inline-flex items-center gap-2"><i className="w-3.5 h-2.5 bg-orange" />Eveniment</span>
            </div>
          </>
        )}

        {/* Weekend view - month columns */}
        {activeView === "weekends" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 divide-y sm:divide-y-0 divide-x-0 sm:divide-x divide-navy/15 border-[1.5px] border-navy">
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
