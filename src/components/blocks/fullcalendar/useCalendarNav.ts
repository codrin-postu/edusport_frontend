"use client";

import { useCallback, useRef, useState } from "react";
import type FullCalendar from "@fullcalendar/react";

/**
 * Shared header-sync + prev/next/today state for FullCalendarWrapper and
 * WeekGridWrapper. Both drive the same `CalendarHeader` from a FullCalendar
 * ref: title, whether the visible period is the current one, and whether
 * prev/next are still inside `validRangeStart`/`validRangeEnd`.
 */
export function useCalendarNav() {
  const calRef = useRef<FullCalendar>(null);
  const [headerTitle, setHeaderTitle] = useState("");
  const [isCurrentPeriod, setIsCurrentPeriod] = useState(true);
  const [canPrev, setCanPrev] = useState(true);
  const [canNext, setCanNext] = useState(true);

  const handlePrev = useCallback(() => calRef.current?.getApi().prev(), []);
  const handleNext = useCallback(() => calRef.current?.getApi().next(), []);
  const handleToday = useCallback(() => calRef.current?.getApi().today(), []);

  return {
    calRef,
    headerTitle,
    setHeaderTitle,
    isCurrentPeriod,
    setIsCurrentPeriod,
    canPrev,
    setCanPrev,
    canNext,
    setCanNext,
    handlePrev,
    handleNext,
    handleToday,
  };
}
