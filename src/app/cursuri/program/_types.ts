export type CalendarEventType = "curs" | "liber" | "anulat" | "holiday" | "vacation" | "eveniment" | "concurs";

export interface CalendarEvent {
  type: CalendarEventType;
  startDate: string; // "YYYY-MM-DD"
  endDate: string;   // "YYYY-MM-DD" (inclusive)
  title?: string | null;
  description?: string | null; // shown in tooltip/mobile sheet (e.g. "10:00–10:50 · 11:00–11:50")
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
