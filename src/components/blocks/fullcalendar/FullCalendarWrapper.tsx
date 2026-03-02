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

interface TooltipPos { top: number; left: number }

interface CursEventInfo {
  title: string;
  hours: string;
}

// ── Desktop hover tooltip ──────────────────────────────────────────────────────
const DesktopTooltip: React.FC<{ title: string; pos: TooltipPos; onMouseEnter: () => void; onMouseLeave: () => void }> = ({
  title, pos, onMouseEnter, onMouseLeave,
}) => (
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
  )
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
          onMouseEnter={() => { if (hideTimer.current) clearTimeout(hideTimer.current); }}
          onMouseLeave={hide}
        />
      )}
    </span>
  );
};

// ── Mobile detail sheet — shown when user taps an event in the list ────────────
const MobileDetailSheet: React.FC<{ event: CursEventInfo; onBack: () => void; onClose: () => void }> = ({
  event, onBack, onClose,
}) => (
  createPortal(
    <div className="fc-mobile-modal-backdrop" onPointerDown={onClose}>
      <div className="fc-mobile-modal" onPointerDown={(e) => e.stopPropagation()}>
        <div className="fc-mobile-modal-header">
          <button className="fc-mobile-modal-back" onClick={onBack}>← Înapoi</button>
          <button className="fc-mobile-modal-close" onClick={onClose}>✕</button>
        </div>
        <span className="fc-curs-tooltip-title">{event.title}</span>
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
      </div>
    </div>,
    document.body,
  )
);

// ── Mobile list sheet — shown when user taps a day ────────────────────────────
const MobileListSheet: React.FC<{ events: CursEventInfo[]; dateLabel: string; onClose: () => void }> = ({
  events, dateLabel, onClose,
}) => {
  const [detail, setDetail] = useState<CursEventInfo | null>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
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
      <div className="fc-mobile-modal" onPointerDown={(e) => e.stopPropagation()}>
        <div className="fc-mobile-modal-header">
          <span className="fc-mobile-modal-date">{dateLabel}</span>
          <button className="fc-mobile-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="fc-mobile-modal-list">
          {events.map((ev, i) => (
            <button
              key={i}
              className="fc-mobile-modal-item"
              onClick={() => setDetail(ev)}
            >
              <span className="fc-curs-dot" />
              <span>{ev.title}</span>
              <span className="fc-mobile-modal-chevron">›</span>
            </button>
          ))}
        </div>
      </div>
    </div>,
    document.body,
  );
};

// ── Main wrapper ───────────────────────────────────────────────────────────────
const FullCalendarWrapper: React.FC<FullCalendarWrapperProps> = ({
  events,
  initialDate = "2025-10-01",
  validRangeStart = "2025-10-01",
  validRangeEnd = "2026-06-01",
}) => {
  const [mobileSheet, setMobileSheet] = useState<{ events: CursEventInfo[]; dateLabel: string } | null>(null);

  return (
    <>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        initialDate={initialDate}
        validRange={{ start: validRangeStart, end: validRangeEnd }}
        events={events}
        headerToolbar={{
          left: "prev",
          center: "title",
          right: "next",
        }}
        locale="ro"
        firstDay={1}
        height="auto"
        fixedWeekCount={false}
        showNonCurrentDates={false}
        dayMaxEvents={5}
        eventDisplay="block"
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
            const dayEvents = info.view.calendar.getEvents().filter((ev) => {
              const evStart = ev.start;
              return (
                ev.extendedProps?.hours &&
                evStart &&
                evStart.toDateString() === date.toDateString()
              );
            });
            if (dayEvents.length === 0) return;
            const cursEvents: CursEventInfo[] = dayEvents.map((ev) => ({
              title: ev.title,
              hours: ev.extendedProps.hours as string,
            }));
            const dateLabel = date.toLocaleDateString("ro-RO", { day: "numeric", month: "long" });
            setMobileSheet({ events: cursEvents, dateLabel });
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
