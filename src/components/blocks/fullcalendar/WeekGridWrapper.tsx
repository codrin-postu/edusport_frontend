"use client";

import React, { useRef, useState, useCallback } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import type { EventInput } from "@fullcalendar/core";
import { format } from "date-fns";
import { ro } from "date-fns/locale";
import "./fullcalendar-overrides.css";
import CalendarHeader from "./CalendarHeader";
import CursEvent, { SpecialEventWithTooltip } from "./CursEvent";

// Standardized "date · start – end" label from the event (times only if not all-day).
function eventDateLabel(e: { start: Date | null; end: Date | null; allDay: boolean }): string | undefined {
  if (!e.start) return undefined;
  const d = e.start.toLocaleDateString("ro-RO", { day: "numeric", month: "long" });
  if (e.allDay) return d;
  const t = (x: Date) => x.toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit" });
  return `${d} · ${t(e.start)}${e.end ? ` – ${t(e.end)}` : ""}`;
}

interface WeekGridWrapperProps {
  events: EventInput[];
  initialDate?: string;
  validRangeStart?: string;
  validRangeEnd?: string;
  viewModeControl?: React.ReactNode;
  onDatesChange?: (ymd: string) => void;
}

const toYMD = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const WeekGridWrapper: React.FC<WeekGridWrapperProps> = ({
  events,
  initialDate,
  validRangeStart = "2025-10-01",
  validRangeEnd = "2026-06-01",
  viewModeControl,
  onDatesChange,
}) => {
  const calRef = useRef<FullCalendar>(null);
  const [headerTitle, setHeaderTitle] = useState("");
  const [isCurrentWeek, setIsCurrentWeek] = useState(true);
  const [canPrev, setCanPrev] = useState(true);
  const [canNext, setCanNext] = useState(true);
  const todayNum = new Date().getDate();

  const syncHeader = useCallback(
    (info: { view: { title: string; currentStart: Date; currentEnd: Date } }) => {
      const { title, currentStart, currentEnd } = info.view;
      setHeaderTitle(title.charAt(0).toUpperCase() + title.slice(1));
      const today = new Date();
      setIsCurrentWeek(today >= currentStart && today < currentEnd);
      setCanPrev(currentStart > new Date(validRangeStart));
      setCanNext(currentEnd < new Date(validRangeEnd));
      onDatesChange?.(toYMD(currentStart));
    },
    [validRangeStart, validRangeEnd, onDatesChange],
  );

  const handlePrev = useCallback(() => calRef.current?.getApi().prev(), []);
  const handleNext = useCallback(() => calRef.current?.getApi().next(), []);
  const handleToday = useCallback(() => calRef.current?.getApi().today(), []);

  return (
    <>
      <CalendarHeader
        title={headerTitle}
        todayNum={todayNum}
        isCurrentMonth={isCurrentWeek}
        onPrev={handlePrev}
        onNext={handleNext}
        onToday={handleToday}
        canPrev={canPrev}
        canNext={canNext}
        viewModeControl={viewModeControl}
      />
      {/* Mobile: horizontal scroll so at least ~2 days show (FC free has no sticky ScrollGrid) */}
      <div className="wg-scroll">
        <FullCalendar
          ref={calRef}
          plugins={[timeGridPlugin]}
          initialView="timeGridWeek"
          initialDate={initialDate}
          validRange={{ start: validRangeStart, end: validRangeEnd }}
          events={events}
          headerToolbar={false}
          locale="ro"
          firstDay={1}
          allDaySlot
          allDayText="toată ziua"
          slotMinTime="08:00:00"
          slotMaxTime="22:00:00"
          slotDuration="01:00:00"
          slotLabelFormat={{ hour: "2-digit", minute: "2-digit", hour12: false }}
          nowIndicator
          height="auto"
          dayHeaderFormat={{ weekday: "long", day: "numeric" }}
          datesSet={syncHeader}
          eventContent={(info) => {
            const type = info.event.extendedProps?.type as string | undefined;
            const description = info.event.extendedProps?.description as string | null | undefined;
            const dateLabel = eventDateLabel({
              start: info.event.start,
              end: info.event.end,
              allDay: info.event.allDay,
            });
            if (type === "curs" || type === "next") {
              return <CursEvent title={info.event.title} dateLabel={dateLabel} description={description ?? undefined} />;
            }
            if (description) {
              return <SpecialEventWithTooltip title={info.event.title} dateLabel={dateLabel} description={description} />;
            }
            return true;
          }}
        />
      </div>
    </>
  );
};

export default WeekGridWrapper;
