"use client";

import React, { useMemo, useState, useEffect } from "react";
import type { EventInput } from "@fullcalendar/core";
import { addDays, startOfDay, startOfWeek, isSameDay, format } from "date-fns";
import { ro } from "date-fns/locale";
import { cn } from "@/utils/cn";
import { HoverTooltip } from "./CursEvent";
import { MobileDetailSheet } from "./MobileSheets";
import type { CursEventInfo } from "./types";

const START_HOUR = 8;
const END_HOUR = 22;
const HOUR_H = 44;
const WINDOW_DAYS = 7;
const PAGE = 7;

const HOURS = Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => START_HOUR + i);

// Course colour = type. `captionClass` is the solid, no-opacity role token
// that passes 4.5:1 for the secondary (time-range) line on that background.
function typeStyle(type?: string): { bg: string; fg: string; captionClass: string } {
  switch (type) {
    case "eveniment":
    case "concurs":
    case "special":
      return { bg: "var(--color-orange)", fg: "#ffffff", captionClass: "text-primary" };
    default:
      return { bg: "var(--color-navy)", fg: "var(--color-retro-cream)", captionClass: "text-primary-on-dark" };
  }
}

interface Session {
  sH: number; sM: number; eH: number; eM: number; title: string; type?: string;
}

// MOCK schedule until the backend sends real per-session times.
// Weekends get course sessions; Tuesday a special. Weekdays empty.
function mockSessions(day: Date): Session[] {
  const d = day.getDay(); // 0 Sun … 6 Sat
  if (d === 6 || d === 0) {
    return [
      { sH: 10, sM: 0, eH: 10, eM: 50, title: "Grupa începători", type: "curs" },
      { sH: 11, sM: 0, eH: 11, eM: 50, title: "Grupa avansați", type: "curs" },
      { sH: 12, sM: 0, eH: 12, eM: 50, title: "Copii 4–6 ani", type: "curs" },
    ];
  }
  if (d === 2) {
    return [{ sH: 17, sM: 0, eH: 18, eM: 0, title: "Curs special", type: "special" }];
  }
  return [];
}

interface WeeklyTimelineProps {
  events: EventInput[];
  validRangeStart: string;
  validRangeEnd: string;
  initialDate?: string;
  viewModeControl?: React.ReactNode;
  onFocusChange?: (ymd: string) => void;
}

const WeeklyTimeline: React.FC<WeeklyTimelineProps> = ({
  validRangeStart,
  validRangeEnd,
  initialDate,
  viewModeControl,
  onFocusChange,
}) => {
  const rangeStart = useMemo(() => startOfDay(new Date(validRangeStart)), [validRangeStart]);
  const rangeEnd = useMemo(() => startOfDay(new Date(validRangeEnd)), [validRangeEnd]);

  const clampStart = useMemo(() => {
    // Week-aligned: the 7-day window always starts on a Monday.
    const monday = startOfWeek(initialDate ? new Date(initialDate) : new Date(), {
      weekStartsOn: 1,
    });
    if (monday < rangeStart) return rangeStart;
    const lastWindow = addDays(rangeEnd, -WINDOW_DAYS);
    if (monday > lastWindow) return lastWindow < rangeStart ? rangeStart : lastWindow;
    return monday;
  }, [initialDate, rangeStart, rangeEnd]);

  const [winStart, setWinStart] = useState<Date>(clampStart);

  const days = useMemo(
    () => Array.from({ length: WINDOW_DAYS }, (_, i) => addDays(winStart, i)),
    [winStart],
  );

  const canPrev = winStart > rangeStart;
  const canNext = addDays(winStart, WINDOW_DAYS) < rangeEnd;
  const today = startOfDay(new Date());
  const todayNum = today.getDate();
  const atThisWeek = winStart.getTime() === clampStart.getTime();

  // Lift the focused date so switching to the month view lands on the same period.
  useEffect(() => {
    onFocusChange?.(format(winStart, "yyyy-MM-dd"));
  }, [winStart, onFocusChange]);

  const page = (dir: number) => {
    setWinStart((prev) => {
      let next = addDays(prev, dir * PAGE);
      if (next < rangeStart) next = rangeStart;
      const lastWindow = addDays(rangeEnd, -WINDOW_DAYS);
      if (next > lastWindow) next = lastWindow < rangeStart ? rangeStart : lastWindow;
      return next;
    });
  };

  const rangeLabel = `${format(days[0], "d MMM", { locale: ro })} – ${format(days[days.length - 1], "d MMM", { locale: ro })}`;

  return (
    <div>
      {/* Header — identical chrome to the month view (.fc-custom-header) */}
      <div className="fc-custom-header">
        <div className="fc-custom-header-title">{rangeLabel}</div>
        <div className="fc-custom-header-nav">
          {viewModeControl}
          <div className="fc-custom-header-navbtns">
            <button
              type="button"
              className="fc-custom-today-btn"
              onClick={() => setWinStart(clampStart)}
              disabled={atThisWeek}
              aria-label="Azi"
            >
              <span className="fc-custom-today-badge">{todayNum}</span>
              <span className="fc-custom-today-label">Azi</span>
            </button>
            <button
              type="button"
              className="fc-custom-nav-btn"
              onClick={() => page(-1)}
              disabled={!canPrev}
              aria-label="Zilele anterioare"
            >
              ‹
            </button>
            <button
              type="button"
              className="fc-custom-nav-btn"
              onClick={() => page(1)}
              disabled={!canNext}
              aria-label="Zilele următoare"
            >
              ›
            </button>
          </div>
        </div>
      </div>

      {/* Track: fixed gutter + horizontally scrollable day columns */}
      <div className="grid grid-cols-[48px_1fr] border-t border-line-subtle">
        {/* Gutter */}
        <div>
          <div className="h-11 border-b-retro border-line" />
          <div className="relative border-r border-line-subtle">
            {HOURS.map((h) => (
              <div key={h} className="relative" style={{ height: HOUR_H }}>
                <span className="text-caption absolute top-1 right-1.5 text-secondary tabular-nums">
                  {h}:00
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Columns */}
        <div className="overflow-x-auto" style={{ scrollSnapType: "x proximity" }}>
          <div className="flex min-w-min">
            {days.map((day) => {
              const isToday = isSameDay(day, today);
              const sessions = mockSessions(day);
              return (
                <div
                  key={day.toISOString()}
                  className="flex-[0_0_150px]"
                  style={{ scrollSnapAlign: "start" }}
                >
                  {/* Day head */}
                  <div className="h-11 border-b-retro border-line flex flex-col items-center justify-center gap-0.5">
                    <span className="text-label uppercase text-secondary">
                      {format(day, "EEEE", { locale: ro })}
                    </span>
                    <span
                      className={cn(
                        "text-title text-primary",
                        isToday &&
                          "bg-surface-dark text-primary-on-dark w-[22px] h-[22px] rounded-full inline-flex items-center justify-center",
                      )}
                    >
                      {format(day, "d")}
                    </span>
                  </div>

                  {/* Time grid */}
                  <div className="relative border-r border-line-subtle">
                    {HOURS.map((h) => (
                      <div key={h} className="border-t border-line-subtle first:border-t-0" style={{ height: HOUR_H }} />
                    ))}
                    {isToday &&
                      (() => {
                        const now = new Date();
                        const mins = now.getHours() * 60 + now.getMinutes();
                        const top = (mins / 60 - START_HOUR) * HOUR_H;
                        if (top < 0 || top > (END_HOUR - START_HOUR + 1) * HOUR_H) return null;
                        return <div className="absolute left-0 right-0 h-0.5 bg-rust z-raised" style={{ top }} />;
                      })()}
                    {sessions.map((e, i) => {
                      const sMin = e.sH * 60 + e.sM;
                      const eMin = e.eH * 60 + e.eM;
                      const top = (sMin / 60 - START_HOUR) * HOUR_H;
                      const height = Math.max(((eMin - sMin) / 60) * HOUR_H - 3, 20);
                      const st = typeStyle(e.type);
                      return (
                        <div
                          key={i}
                          className="text-caption absolute left-1 right-1 px-2 py-1 overflow-hidden"
                          style={{ top, height, background: st.bg, color: st.fg }}
                        >
                          {e.title}
                          <span className={cn("text-caption block", st.captionClass)}>
                            {String(e.sH).padStart(2, "0")}:{String(e.sM).padStart(2, "0")} – {String(e.eH).padStart(2, "0")}:{String(e.eM).padStart(2, "0")}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Demo note (mock data until the backend sends session times) */}
      <div className="text-caption px-4 py-2 border-t border-line-subtle text-secondary">
        Orar demonstrativ — orele reale vor fi preluate din sistem.
      </div>
    </div>
  );
};

export default WeeklyTimeline;
