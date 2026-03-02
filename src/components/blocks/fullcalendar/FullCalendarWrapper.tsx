"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { EventInput } from "@fullcalendar/core";
import "./fullcalendar-overrides.css";

interface FullCalendarWrapperProps {
  events: EventInput[];
  initialDate?: string;
  validRangeStart?: string;
  validRangeEnd?: string;
}

interface TooltipPos {
  top: number;
  left: number;
}

interface CursEventInfo {
  title: string;
  hours: string;
  type?: string;
  color?: string;
}

// ── Desktop hover tooltip ──────────────────────────────────────────────────────
const DesktopTooltip: React.FC<{
  title: string;
  pos: TooltipPos;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}> = ({ title, pos, onMouseEnter, onMouseLeave }) =>
  createPortal(
    <span
      className="fc-curs-tooltip"
      style={{ top: pos.top, left: pos.left }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <span className="fc-curs-tooltip-title">{title}</span>
      <span className="fc-curs-tooltip-hours">
        <span>10:00–10:50</span>
        <span>11:00–11:50</span>
      </span>
      <a
        href="/cursuri/regulament"
        className="fc-curs-tooltip-link"
        onClick={(e) => e.stopPropagation()}
      >
        Vezi regulamentul →
      </a>
    </span>,
    document.body,
  );

// ── CursEvent — desktop only (dot + text + hover tooltip) ─────────────────────
const CursEvent: React.FC<{ title: string }> = ({ title }) => {
  const [pos, setPos] = useState<TooltipPos | null>(null);
  const anchorRef = useRef<HTMLSpanElement>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback(() => {
    if (window.matchMedia("(max-width: 767px)").matches) return;
    if (hideTimer.current) clearTimeout(hideTimer.current);
    if (anchorRef.current) {
      const r = anchorRef.current.getBoundingClientRect();
      setPos({ top: r.top - 8, left: r.left });
    }
  }, []);

  const hide = useCallback(() => {
    hideTimer.current = setTimeout(() => setPos(null), 80);
  }, []);

  return (
    <span
      ref={anchorRef}
      className="fc-curs-event"
      onMouseEnter={show}
      onMouseLeave={hide}
    >
      <span className="fc-curs-dot" />
      <span className="fc-event-title fc-curs-desktop-title">{title}</span>

      {pos !== null && typeof document !== "undefined" && (
        <DesktopTooltip
          title={title}
          pos={pos}
          onMouseEnter={() => {
            if (hideTimer.current) clearTimeout(hideTimer.current);
          }}
          onMouseLeave={hide}
        />
      )}
    </span>
  );
};

// ── Mobile detail sheet — shown when user taps an event in the list ────────────
const MobileDetailSheet: React.FC<{
  event: CursEventInfo;
  onBack: () => void;
  onClose: () => void;
}> = ({ event, onBack, onClose }) =>
  createPortal(
    <div className="fc-mobile-modal-backdrop" onPointerDown={onClose}>
      <div
        className="fc-mobile-modal"
        onPointerDown={(e) => e.stopPropagation()}
      >
        <div className="fc-mobile-modal-header">
          <button className="fc-mobile-modal-back" onClick={onBack}>
            ← Înapoi
          </button>
          <button className="fc-mobile-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <span className="fc-curs-tooltip-title">{event.title}</span>
        {event.hours && (
          <span className="fc-curs-tooltip-hours">
            <span>10:00–10:50</span>
            <span>11:00–11:50</span>
          </span>
        )}
        {event.type === "curs" || event.type === "next" ? (
          <a
            href="/cursuri/regulament"
            className="fc-curs-tooltip-link"
            onClick={(e) => e.stopPropagation()}
          >
            Vezi regulamentul →
          </a>
        ) : null}
      </div>
    </div>,
    document.body,
  );

// An event has drill-down detail only if it's a curs/next type with hours
function hasDetail(ev: CursEventInfo): boolean {
  return ev.type === "curs" || ev.type === "next";
}

// ── Mobile list sheet — shown when user taps a day ────────────────────────────
const MobileListSheet: React.FC<{
  events: CursEventInfo[];
  dateLabel: string;
  onClose: () => void;
}> = ({ events, dateLabel, onClose }) => {
  const [detail, setDetail] = useState<CursEventInfo | null>(null);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", handler);
    };
  }, [onClose]);

  if (detail) {
    return (
      <MobileDetailSheet
        event={detail}
        onBack={() => setDetail(null)}
        onClose={onClose}
      />
    );
  }

  return createPortal(
    <div className="fc-mobile-modal-backdrop" onPointerDown={onClose}>
      <div
        className="fc-mobile-modal"
        onPointerDown={(e) => e.stopPropagation()}
      >
        <div className="fc-mobile-modal-header">
          <span className="fc-mobile-modal-date">{dateLabel}</span>
          <button className="fc-mobile-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="fc-mobile-modal-list">
          {events.map((ev, i) => (
            <button
              key={i}
              className={`fc-mobile-modal-item fc-mobile-modal-item--${ev.type ?? "curs"}`}
              onClick={() => hasDetail(ev) && setDetail(ev)}
              style={hasDetail(ev) ? undefined : { cursor: "default" }}
            >
              <span
                className={`fc-mobile-modal-dot fc-mobile-modal-dot--${ev.type ?? "curs"}`}
              />
              <span>{ev.title}</span>
              {hasDetail(ev) && (
                <span className="fc-mobile-modal-chevron">›</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>,
    document.body,
  );
};

// ── Custom calendar header ─────────────────────────────────────────────────────
const CalendarHeader: React.FC<{
  title: string;
  todayNum: number;
  isCurrentMonth: boolean;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  canPrev: boolean;
  canNext: boolean;
}> = ({
  title,
  todayNum,
  isCurrentMonth,
  onPrev,
  onNext,
  onToday,
  canPrev,
  canNext,
}) => (
  <div className="fc-custom-header">
    <div className="fc-custom-header-title">{title}</div>
    <div className="fc-custom-header-nav">
      <button
        className="fc-custom-today-btn"
        onClick={onToday}
        disabled={isCurrentMonth}
        aria-label="Azi"
      >
        <span className="fc-custom-today-badge">{todayNum}</span>
        <span className="fc-custom-today-label">Azi</span>
      </button>
      <button
        className="fc-custom-nav-btn"
        onClick={onPrev}
        disabled={!canPrev}
        aria-label="Luna anterioară"
      >
        ‹
      </button>
      <button
        className="fc-custom-nav-btn"
        onClick={onNext}
        disabled={!canNext}
        aria-label="Luna următoare"
      >
        ›
      </button>
    </div>
  </div>
);

// ── Main wrapper ───────────────────────────────────────────────────────────────
const FullCalendarWrapper: React.FC<FullCalendarWrapperProps> = ({
  events,
  initialDate = "2025-10-01",
  validRangeStart = "2025-10-01",
  validRangeEnd = "2026-06-01",
}) => {
  const calRef = useRef<FullCalendar>(null);
  const [mobileSheet, setMobileSheet] = useState<{
    events: CursEventInfo[];
    dateLabel: string;
  } | null>(null);
  const [headerTitle, setHeaderTitle] = useState("");
  const [isCurrentMonth, setIsCurrentMonth] = useState(true);
  const [canPrev, setCanPrev] = useState(true);
  const [canNext, setCanNext] = useState(true);
  const todayNum = new Date().getDate();

  const syncHeader = useCallback(
    (arg: { view: { title: string; currentStart: Date } }) => {
      const { title, currentStart } = arg.view;
      setHeaderTitle(title.charAt(0).toUpperCase() + title.slice(1));

      const today = new Date();
      const ym = (d: Date) => d.getFullYear() * 12 + d.getMonth();
      setIsCurrentMonth(ym(today) === ym(currentStart));
      // validRangeStart/End are "YYYY-MM-DD" strings parsed as UTC — convert to local
      const parseLocal = (s: string) => {
        const [y, m] = s.split("-").map(Number);
        return y * 12 + (m - 1);
      };
      const cur = ym(currentStart);
      const start = parseLocal(validRangeStart);
      const end = parseLocal(validRangeEnd);

      setCanPrev(cur > start);
      setCanNext(cur < end - 1);
    },
    [validRangeStart, validRangeEnd],
  );

  // datesSet on the FullCalendar fires after every navigation and on mount —
  // that's the only place we need to sync. Calling syncHeader() imperatively
  // right after api.prev/next reads the old view before it has updated.
  const handlePrev = useCallback(() => {
    calRef.current?.getApi().prev();
  }, []);

  const handleNext = useCallback(() => {
    calRef.current?.getApi().next();
  }, []);

  const handleToday = useCallback(() => {
    calRef.current?.getApi().today();
  }, []);

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
      />
      <FullCalendar
        ref={calRef}
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        initialDate={initialDate}
        validRange={{ start: validRangeStart, end: validRangeEnd }}
        events={events}
        headerToolbar={false}
        locale="ro"
        firstDay={1}
        height="auto"
        fixedWeekCount={false}
        showNonCurrentDates={false}
        dayMaxEvents={5}
        eventDisplay="block"
        datesSet={syncHeader}
        eventContent={(arg) => {
          const hours = arg.event.extendedProps?.hours as string | undefined;
          if (hours) {
            return <CursEvent title={arg.event.title} />;
          }
          return true;
        }}
        dayCellDidMount={(info) => {
          const cell = info.el;
          const date = info.date;
          const handler = () => {
            if (!window.matchMedia("(max-width: 767px)").matches) return;

            const allEvents = info.view.calendar.getEvents();
            const clickedDate = new Date(date);
            clickedDate.setHours(0, 0, 0, 0);

            const dayEvents = allEvents.filter((ev) => {
              const evStart = ev.start ? new Date(ev.start) : null;
              const evEnd = ev.end ? new Date(ev.end) : null;
              if (!evStart) return false;
              evStart.setHours(0, 0, 0, 0);
              const evEndNorm = evEnd ? new Date(evEnd) : new Date(evStart);
              evEndNorm.setHours(0, 0, 0, 0);
              // FullCalendar end is exclusive, so subtract one day for comparison
              evEndNorm.setDate(evEndNorm.getDate() - 1);
              return clickedDate >= evStart && clickedDate <= evEndNorm;
            });

            if (dayEvents.length === 0) return;

            const sheetEvents: CursEventInfo[] = dayEvents.map((ev) => ({
              title: ev.title,
              hours: (ev.extendedProps?.hours as string) ?? "",
              type: (ev.extendedProps?.type as string) ?? "curs",
            }));
            const dateLabel = date.toLocaleDateString("ro-RO", {
              day: "numeric",
              month: "long",
            });
            setMobileSheet({ events: sheetEvents, dateLabel });
          };
          cell.addEventListener("click", handler);
        }}
      />

      {mobileSheet && (
        <MobileListSheet
          events={mobileSheet.events}
          dateLabel={mobileSheet.dateLabel}
          onClose={() => setMobileSheet(null)}
        />
      )}
    </>
  );
};

export default FullCalendarWrapper;
