import type { CalendarEvent, CalendarEventType } from "@/app/cursuri/program/_types";
import type { CalendarOccurrence } from "@/lib/strapi-calendar";

/**
 * Adapt backend calendar occurrences into the legacy `CalendarEvent[]` shape the
 * season calendar already renders (month grid, weekend list, tooltips).
 *
 * The "Școala de patinaj" recurring event is the source of the weekend model:
 * each weekend occurrence carries a `state` (curs / liber / anulat) set in the
 * admin calendar, so its Saturday+Sunday occurrences become the Curs / Liber /
 * Curs anulat weekend cards. Every other event type becomes a special tile,
 * with consecutive dates of the same event merged into a single span (so a
 * multi-day vacation is one tile, not one per day).
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

type WeekendKind = "curs" | "liber" | "anulat";
function scoalaDayKind(o: CalendarOccurrence): WeekendKind {
  if (o.state === "anulat") return "anulat";
  if (o.state === "liber") return "liber";
  if (o.status === "cancelled") return "liber"; // blackout / pauză
  return "curs";
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
      return "vacation";
    case "eveniment":
    case "cantonament":
    case "spectacol":
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

  // ── Școala weekends ──────────────────────────────────────────────────────
  // Bucket by weekend, then by state within the weekend, so a normal weekend is
  // one Sat–Sun card and a mixed one (e.g. Sat curs, Sun liber) splits cleanly.
  const weekends = new Map<string, CalendarOccurrence[]>();
  for (const o of scoala) {
    const key = weekendAnchor(parseYMD(o.date));
    const arr = weekends.get(key) ?? [];
    arr.push(o);
    weekends.set(key, arr);
  }
  for (const days of weekends.values()) {
    const byKind = new Map<WeekendKind, CalendarOccurrence[]>();
    for (const o of days) {
      const kind = scoalaDayKind(o);
      const arr = byKind.get(kind) ?? [];
      arr.push(o);
      byKind.set(kind, arr);
    }
    for (const [kind, group] of byKind) {
      const sorted = [...group].sort((a, b) => a.date.localeCompare(b.date));
      const first = sorted[0];
      const hours =
        first.startTime && first.endTime
          ? `${first.startTime}–${first.endTime}`
          : first.startTime || "";
      const note = sorted.map((o) => o.note).find((n) => n && n.trim()) ?? null;
      const evDesc = sorted.map((o) => o.description).find((d) => d && d.trim()) ?? null;
      // Curs: show the session hours (fall back to the event description).
      // Liber/Anulat: show the reason note, else the event description.
      const description =
        kind === "curs"
          ? evDesc || (hours ? `Ore: ${hours}` : null)
          : note || evDesc || (hours ? `Ore: ${hours}` : null);
      events.push({
        type: kind,
        startDate: first.date,
        endDate: sorted[sorted.length - 1].date,
        description,
        timeSlot: hours || null,
      });
    }
  }

  // ── Other events ─────────────────────────────────────────────────────────
  // Merge consecutive same-event dates into a single span.
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
      const isCursSpecial = first.type === "curs";
      const timeSlot =
        first.startTime && first.endTime
          ? `${first.startTime}–${first.endTime}`
          : first.startTime || null;
      events.push({
        type: specialType(first.type),
        startDate: first.date,
        endDate: last.date,
        title: first.title,
        description: first.description ?? first.note ?? null,
        courseLabel: isCursSpecial ? first.label || first.title : null,
        timeSlot: isCursSpecial ? timeSlot : null,
      });
      run = [];
    };
    for (const o of sorted) {
      if (!run.length) {
        run.push(o);
        continue;
      }
      const prev = parseYMD(run[run.length - 1].date);
      const next = parseYMD(o.date);
      const consecutive =
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
