import type { CalendarEvent, CalendarEventType } from "@/app/cursuri/program/_types";
import type { CalendarOccurrence } from "@/lib/strapi-calendar";
import { groupForOccurrence } from "@/components/blocks/fullcalendar/calendar-colors";

/**
 * Adapt backend calendar occurrences into the `CalendarEvent[]` shape the
 * season calendar renders.
 *
 * Every occurrence becomes a plain tile. "Școala de patinaj" dates are tiles too
 * (type "scoala", with their per-date state), and they ALSO feed the weekend
 * model (curs / liber / anulat) that only the Weekenduri list reads.
 *
 * Consecutive dates of the same event merge into a single span only when the
 * occurrences are ALL-DAY (no startTime): a vacation or a camp really is one
 * continuous block, so it should read as one tile. Timed occurrences are
 * separate sessions that happen to fall on neighbouring days (e.g. an
 * Antrenament on Monday and Tuesday), so each keeps its own tile instead of
 * being drawn as one two-day bar.
 */

// "YYYY-MM-DD" -> local Date (no timezone drift).
function parseYMD(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}
function ymd(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
// The Saturday that anchors the weekend a date belongs to.
function weekendAnchor(d: Date): string {
  const dow = d.getDay(); // 0 = Sun, 6 = Sat
  const back = (dow + 1) % 7; // days since Saturday
  return ymd(new Date(d.getFullYear(), d.getMonth(), d.getDate() - back));
}

type ScoalaState = "curs" | "liber" | "anulat";
function scoalaState(o: CalendarOccurrence): ScoalaState {
  const group = groupForOccurrence(o);
  if (group === "anulat") return "anulat";
  if (group === "liber") return "liber";
  return "curs";
}

/** "10:00 - 11:30", "10:00", or null for an all-day occurrence. */
export function occurrenceTimeSlot(o: CalendarOccurrence): string | null {
  if (!o.startTime) return null;
  return o.endTime ? `${o.startTime} - ${o.endTime}` : o.startTime;
}

/**
 * Tile title. The label is prefixed only when it adds information (skip
 * "Grupa A · Grupa A" and "Școala · Școala de patinaj").
 */
export function occurrenceTitle(o: CalendarOccurrence): string {
  return o.label && !o.title.toLowerCase().includes(o.label.toLowerCase())
    ? `${o.label} · ${o.title}`
    : o.title;
}

function specialType(t: string): CalendarEventType {
  switch (t) {
    case "concurs":
      return "concurs";
    case "vacanta":
      return "vacation";
    case "sarbatoare":
      return "holiday";
    case "curs":
      return "curs-special";
    case "liber":
      return "pauza";
    case "cantonament":
      return "cantonament";
    case "spectacol":
      return "spectacol";
    case "eveniment":
    default:
      return "eveniment";
  }
}

export function occurrencesToCalendarEvents(
  occurrences: CalendarOccurrence[],
): CalendarEvent[] {
  const scoala = occurrences.filter((o) => o.type === "scoala");
  const others = occurrences.filter(
    (o) => o.type !== "scoala" && o.status !== "cancelled",
  );

  const events: CalendarEvent[] = [];

  // ── Școala tiles: one per occurrence, the CMS title and time ─────────────
  for (const o of scoala) {
    const state = scoalaState(o);
    events.push({
      type: "scoala",
      state,
      startDate: o.date,
      endDate: o.date,
      title: state === "curs" ? occurrenceTitle(o) : null,
      description: state === "curs" ? o.description ?? null : o.note || o.description || null,
      timeSlot: state === "curs" ? occurrenceTimeSlot(o) : null,
    });
  }

  // ── Școala weekends (Weekenduri list only) ───────────────────────────────
  // Bucket by weekend, then by state within the weekend, so a normal weekend is
  // one Sat to Sun row and a mixed one (e.g. Sat curs, Sun liber) splits cleanly.
  const weekends = new Map<string, CalendarOccurrence[]>();
  for (const o of scoala) {
    const key = weekendAnchor(parseYMD(o.date));
    const arr = weekends.get(key) ?? [];
    arr.push(o);
    weekends.set(key, arr);
  }
  for (const days of weekends.values()) {
    const byState = new Map<ScoalaState, CalendarOccurrence[]>();
    for (const o of days) {
      const state = scoalaState(o);
      const arr = byState.get(state) ?? [];
      arr.push(o);
      byState.set(state, arr);
    }
    for (const [state, group] of byState) {
      const sorted = [...group].sort((a, b) => a.date.localeCompare(b.date));
      const note = sorted.map((o) => o.note).find((n) => n && n.trim()) ?? null;
      const evDesc = sorted.map((o) => o.description).find((d) => d && d.trim()) ?? null;
      events.push({
        type: state,
        startDate: sorted[0].date,
        endDate: sorted[sorted.length - 1].date,
        // The list shows this as the reason for a Curs anulat weekend.
        description: note || evDesc,
      });
    }
  }

  // ── Other events ─────────────────────────────────────────────────────────
  // Merge consecutive same-event dates into a single span, but only for all-day
  // occurrences. A timed occurrence is one session, never part of a multi-day bar.
  const isTimed = (o: CalendarOccurrence) => !!o.startTime;
  const byEvent = new Map<number, CalendarOccurrence[]>();
  for (const o of others) {
    const arr = byEvent.get(o.eventId) ?? [];
    arr.push(o);
    byEvent.set(o.eventId, arr);
  }
  for (const group of byEvent.values()) {
    const sorted = [...group].sort((a, b) => a.date.localeCompare(b.date));
    let run: CalendarOccurrence[] = [];
    const flush = () => {
      if (!run.length) return;
      const first = run[0];
      const last = run[run.length - 1];
      events.push({
        type: specialType(first.type),
        startDate: first.date,
        endDate: last.date,
        title: occurrenceTitle(first),
        description: first.description ?? first.note ?? null,
        timeSlot: occurrenceTimeSlot(first),
      });
      run = [];
    };
    for (const o of sorted) {
      if (!run.length) {
        run.push(o);
        continue;
      }
      const previous = run[run.length - 1];
      const prev = parseYMD(previous.date);
      const consecutive =
        !isTimed(previous) &&
        !isTimed(o) &&
        ymd(new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() + 1)) ===
          o.date;
      if (consecutive) run.push(o);
      else {
        flush();
        run.push(o);
      }
    }
    flush();
  }

  return events;
}
