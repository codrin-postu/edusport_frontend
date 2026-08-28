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
  /** Școala de patinaj only — per-date state driving the weekend model. */
  state?: "curs" | "liber" | "anulat" | null;
  /** Per-occurrence note (e.g. reason a weekend is Liber/Anulat). */
  note?: string | null;
  /** Event description (markdown) shown in calendar tooltips / detail. */
  description?: string | null;
  imageUrl?: string | null;
  linkUrl?: string | null;
  linkLabel?: string | null;
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

// The occurrences endpoint caps each request at 92 days, but a full season is
// ~7 months. Add days to a "YYYY-MM-DD" date (local, no timezone drift).
function addDaysYMD(ymd: string, n: number): string {
  const [y, m, d] = ymd.split("-").map(Number);
  const dt = new Date(y, m - 1, d + n);
  const yy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const dd = String(dt.getDate()).padStart(2, "0");
  return `${yy}-${mm}-${dd}`;
}

/**
 * Fetch a whole season by splitting it into ≤90-day windows (the endpoint's
 * per-request cap) and merging the results. Occurrences are de-duplicated by
 * (eventId, date) in case adjacent windows overlap on a boundary day.
 */
export async function fetchSeasonOccurrences(
  from: string,
  to: string,
  revalidate = 300,
): Promise<CalendarWindow> {
  const windows: Array<[string, string]> = [];
  let cursor = from;
  while (cursor <= to) {
    const end = addDaysYMD(cursor, 89);
    windows.push([cursor, end < to ? end : to]);
    cursor = addDaysYMD(end, 1);
  }

  const results = await Promise.all(
    windows.map(([a, b]) => fetchCalendarOccurrences(a, b, revalidate)),
  );

  const seen = new Set<string>();
  const occurrences: CalendarOccurrence[] = [];
  for (const r of results) {
    for (const o of r.occurrences) {
      const key = `${o.eventId}:${o.date}`;
      if (seen.has(key)) continue;
      seen.add(key);
      occurrences.push(o);
    }
  }

  const blackoutSeen = new Set<string>();
  const blackouts: CalendarBlackout[] = [];
  for (const r of results) {
    for (const b of r.blackouts) {
      const key = `${b.label}:${b.startDate}:${b.endDate}`;
      if (blackoutSeen.has(key)) continue;
      blackoutSeen.add(key);
      blackouts.push(b);
    }
  }

  return { occurrences, blackouts };
}
