/**
 * Client for the backend calendar expansion endpoint
 * (`GET /api/calendar/occurrences`). The backend expands recurrence rules into
 * concrete dated occurrences and applies exceptions + blackouts, so the
 * frontend just fetches a window and renders. Works from both server
 * components and the client (plain fetch).
 */

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337";

export type OccurrenceStatus = "scheduled" | "cancelled" | "override";

export interface CalendarOccurrence {
  eventId: number;
  documentId?: string;
  title: string;
  type: string;
  label: string | null;
  color: string | null;
  order: number;
  date: string; // YYYY-MM-DD
  startTime: string | null; // HH:mm
  endTime: string | null; // HH:mm
  status: OccurrenceStatus;
  cancelReason: "exception" | "blackout" | null;
}

export interface CalendarBlackout {
  label: string;
  startDate: string;
  endDate: string;
}

export interface CalendarWindow {
  occurrences: CalendarOccurrence[];
  blackouts: CalendarBlackout[];
}

/**
 * Fetch all occurrences (and blackout ranges) between `from` and `to`
 * (inclusive, YYYY-MM-DD). Returns empty data on any failure so the calendar
 * degrades gracefully.
 */
export async function fetchCalendarOccurrences(
  from: string,
  to: string,
  revalidate = 300,
): Promise<CalendarWindow> {
  try {
    const res = await fetch(
      `${STRAPI_URL}/api/calendar/occurrences?from=${from}&to=${to}`,
      { next: { revalidate } },
    );
    if (!res.ok) return { occurrences: [], blackouts: [] };
    const json = await res.json();
    return {
      occurrences: Array.isArray(json?.data) ? json.data : [],
      blackouts: Array.isArray(json?.blackouts) ? json.blackouts : [],
    };
  } catch {
    return { occurrences: [], blackouts: [] };
  }
}
