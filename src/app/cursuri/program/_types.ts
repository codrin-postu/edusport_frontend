export type CalendarEventType =
  /** Weekend model, read only by the Weekenduri list. */
  | "curs"
  | "liber"
  | "anulat"
  /** One Școala de patinaj date, drawn as a tile in the grids. */
  | "scoala"
  | "holiday"
  | "vacation"
  | "eveniment"
  | "concurs"
  | "cantonament"
  | "spectacol"
  | "pauza"
  /** Standalone course such as Antrenament. */
  | "curs-special";

export interface CalendarEvent {
  type: CalendarEventType;
  startDate: string; // "YYYY-MM-DD"
  endDate: string;   // "YYYY-MM-DD" (inclusive)
  title?: string | null;
  description?: string | null; // shown in tooltip/mobile sheet
  /** "scoala" only: the per-date state set in the admin calendar. */
  state?: "curs" | "liber" | "anulat" | null;
  /** Timed events only, e.g. "10:00 - 11:30". Shown first in the tooltip. */
  timeSlot?: string | null;
}

export interface ScheduleGroup {
  timeSlot: string;
  courses: string[];
}

export interface ProgramPageData {
  seasonLabel: string;
  /** "YYYY-MM" - first month of the season, inclusive */
  seasonStart?: string | null;
  /** "YYYY-MM" - last month of the season, inclusive */
  seasonEnd?: string | null;
  bannerTitle?: string | null;
  bannerSubtitle?: string | null;
  scheduleSubtitle?: string | null;
  scheduleGroups: ScheduleGroup[];
  calendarEvents: CalendarEvent[];
  disclaimers: string[];
}

/**
 * Static text defaults (banner, disclaimers, season label/bounds) used when
 * the CMS fetch itself fails. The schedule series and season calendar have no
 * static default anymore: when `program` / the calendar-event occurrences are
 * empty, the page renders with an empty calendar and schedule (see
 * SeasonCalendarViewV2 and ScheduleSection's empty states).
 */
export type ProgramPageDefaults = Omit<ProgramPageData, "scheduleGroups" | "calendarEvents">;
