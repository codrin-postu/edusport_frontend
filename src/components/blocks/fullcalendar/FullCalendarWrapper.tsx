"use client";

import React, { useState, useRef, useCallback, useMemo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import type { EventInput } from "@fullcalendar/core";
import { format } from "date-fns";
import { ro } from "date-fns/locale";
import "./fullcalendar-overrides.css";
import CalendarHeader from "./CalendarHeader";
import CursEvent, { SpecialEventWithTooltip } from "./CursEvent";
import { MobileListSheet, MobileDetailSheet } from "./MobileSheets";
import type { CursEventInfo } from "./types";

interface FullCalendarWrapperProps {
  events: EventInput[];
  initialDate?: string;
  validRangeStart?: string;
  validRangeEnd?: string;
  viewModeControl?: React.ReactNode;
  onDatesChange?: (ymd: string) => void;
}

// Standardized event date label from the event start (backend-driven).
// allDay events carry no time, so only the date shows — nothing fabricated.
function formatEventDate(date: Date | null): string | undefined {
  if (!date) return undefined;
  return date.toLocaleDateString("ro-RO", { day: "numeric", month: "long" });
}

function clampToRange(validStart: string, validEnd: string): string {
  const today = new Date();
  const start = new Date(validStart);
  const end = new Date(validEnd);
  const clamped = today < start ? start : today >= end ? new Date(end.getFullYear(), end.getMonth() - 1, 1) : today;
  return `${clamped.getFullYear()}-${String(clamped.getMonth() + 1).padStart(2, "0")}-01`;
}

const FullCalendarWrapper: React.FC<FullCalendarWrapperProps> = ({
  events,
  initialDate,
  validRangeStart = "2025-10-01",
  validRangeEnd = "2026-06-01",
  viewModeControl,
  onDatesChange,
}) => {
  const resolvedInitialDate = initialDate ?? clampToRange(validRangeStart, validRangeEnd);
  const calRef = useRef<FullCalendar>(null);
  const [mobileSheet, setMobileSheet] = useState<{
    events: CursEventInfo[];
    dateLabel: string;
  } | null>(null);
  const [mobileEvent, setMobileEvent] = useState<CursEventInfo | null>(null);
  const [headerTitle, setHeaderTitle] = useState("");
  const [isCurrentMonth, setIsCurrentMonth] = useState(true);
  const [canPrev, setCanPrev] = useState(true);
  const [canNext, setCanNext] = useState(true);
  const todayNum = useMemo(() => new Date().getDate(), []);

  const syncHeader = useCallback(
    (info: { view: { title: string; currentStart: Date } }) => {
      const { title, currentStart } = info.view;
      setHeaderTitle(title.charAt(0).toUpperCase() + title.slice(1));

      const today = new Date();
      const toYearMonth = (d: Date) => d.getFullYear() * 12 + d.getMonth();
      setIsCurrentMonth(toYearMonth(today) === toYearMonth(currentStart));

      // validRangeStart/End are "YYYY-MM-DD" strings parsed as UTC - convert to local
      const parseYearMonth = (s: string) => {
        const [year, month] = s.split("-").map(Number);
        return year * 12 + (month - 1);
      };
      const cur = toYearMonth(currentStart);
      setCanPrev(cur > parseYearMonth(validRangeStart));
      setCanNext(cur < parseYearMonth(validRangeEnd) - 1);

      // Report the visible month so the week view lands on the same period.
      const y = currentStart.getFullYear();
      const m = String(currentStart.getMonth() + 1).padStart(2, "0");
      const d = String(currentStart.getDate()).padStart(2, "0");
      onDatesChange?.(`${y}-${m}-${d}`);
    },
    [validRangeStart, validRangeEnd, onDatesChange],
  );

  // datesSet fires after every navigation and on mount -
  // that's the only place we need to sync. Calling syncHeader() imperatively
  // right after api.prev/next reads the old view before it has updated.
  const handlePrev = useCallback(() => calRef.current?.getApi().prev(), []);
  const handleNext = useCallback(() => calRef.current?.getApi().next(), []);
  const handleToday = useCallback(() => calRef.current?.getApi().today(), []);

  return (
    <>
      <CalendarHeader
        title={headerTitle}
        todayNum={todayNum}
        isCurrentMonth={isCurrentMonth}
        onPrev={handlePrev}
        onNext={handleNext}
        onToday={handleToday}
        canPrev={canPrev}
        canNext={canNext}
        viewModeControl={viewModeControl}
      />
      <FullCalendar
        ref={calRef}
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        initialDate={resolvedInitialDate}
        validRange={{ start: validRangeStart, end: validRangeEnd }}
        events={events}
        headerToolbar={false}
        locale="ro"
        firstDay={1}
        dayHeaderContent={(arg) => format(arg.date, "EEEEEE", { locale: ro })}
        height="auto"
        fixedWeekCount={false}
        showNonCurrentDates={false}
        dayMaxEvents={5}
        datesSet={syncHeader}
        eventContent={(info) => {
          const type = info.event.extendedProps?.type as string | undefined;
          const description = info.event.extendedProps?.description as string | null | undefined;
          const dateLabel = formatEventDate(info.event.start);
          if (type === "curs" || type === "next") {
            return <CursEvent title={info.event.title} dateLabel={dateLabel} description={description ?? undefined} />;
          }
          // Every other event gets a hover tooltip too (title + date at minimum,
          // description when present), so nothing is silently un-hoverable.
          return <SpecialEventWithTooltip title={info.event.title} dateLabel={dateLabel} description={description ?? undefined} />;
        }}
        eventClick={(arg) => {
          // Touch has no hover: tapping an event opens its detail sheet.
          if (!window.matchMedia("(max-width: 767px)").matches) return;
          arg.jsEvent?.stopPropagation();
          setMobileEvent({
            title: arg.event.title,
            dateLabel: formatEventDate(arg.event.start),
            description: (arg.event.extendedProps?.description as string | null) ?? undefined,
            type: (arg.event.extendedProps?.type as string) ?? "curs",
          });
        }}
        dayCellDidMount={(info) => {
          const handler = () => {
            if (!window.matchMedia("(max-width: 767px)").matches) return;

            const allEvents = info.view.calendar.getEvents();
            const clickedDate = new Date(info.date);
            clickedDate.setHours(0, 0, 0, 0);

            const dayEvents = allEvents.filter((event) => {
              const evStart = event.start ? new Date(event.start) : null;
              const evEnd = event.end ? new Date(event.end) : null;
              if (!evStart) return false;
              evStart.setHours(0, 0, 0, 0);
              const evEndNorm = evEnd ? new Date(evEnd) : new Date(evStart);
              evEndNorm.setHours(0, 0, 0, 0);
              // FullCalendar end is exclusive, so subtract one day for comparison
              evEndNorm.setDate(evEndNorm.getDate() - 1);
              return clickedDate >= evStart && clickedDate <= evEndNorm;
            });

            if (dayEvents.length === 0) return;

            const sheetEvents: CursEventInfo[] = dayEvents.map((event) => ({
              title: event.title,
              dateLabel: formatEventDate(event.start),
              description: (event.extendedProps?.description as string | null) ?? undefined,
              type: (event.extendedProps?.type as string) ?? "curs",
            }));
            const dateLabel = info.date.toLocaleDateString("ro-RO", {
              day: "numeric",
              month: "long",
            });
            setMobileSheet({ events: sheetEvents, dateLabel });
          };
          info.el.addEventListener("click", handler);
        }}
      />

      {mobileSheet && (
        <MobileListSheet
          events={mobileSheet.events}
          dateLabel={mobileSheet.dateLabel}
          onClose={() => setMobileSheet(null)}
        />
      )}

      {mobileEvent && (
        <MobileDetailSheet
          event={mobileEvent}
          onBack={() => setMobileEvent(null)}
          onClose={() => setMobileEvent(null)}
        />
      )}
    </>
  );
};

export default FullCalendarWrapper;
