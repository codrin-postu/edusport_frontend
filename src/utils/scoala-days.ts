// ---------------------------------------------------------------------------
// One Școala de patinaj tile per school day (phase 4 spec 9.2, W21): every
// `scoala` occurrence of a date (one per Școala group after phase 4) is merged
// into one. Runtime imports are limited to what node's type stripping can load:
// scripts/club/scoala-days.test.mjs imports this file directly.
// ---------------------------------------------------------------------------

import type { CalendarOccurrence } from "@/lib/strapi-calendar";

type DayState = "curs" | "liber" | "anulat";
const TITLE = "Școala de patinaj";

/** Today's reading of one date (as `groupForOccurrence`): a break is "liber", any other cancellation "anulat" (decided 4). */
function stateOf(o: CalendarOccurrence): DayState {
  if (o.status === "cancelled") return o.cancelReason === "blackout" ? "liber" : "anulat";
  return o.state === "anulat" || o.state === "liber" ? o.state : "curs";
}

/** W21: curs if any date holds class, else anulat if any is anulat, else liber. */
function dayState(states: DayState[]): DayState {
  if (states.includes("curs")) return "curs";
  return states.includes("anulat") ? "anulat" : "liber";
}

const STATUS: Record<DayState, Pick<CalendarOccurrence, "status" | "cancelReason">> = {
  curs: { status: "scheduled", cancelReason: null },
  anulat: { status: "cancelled", cancelReason: "exception" },
  liber: { status: "cancelled", cancelReason: "blackout" },
};

function firstText(values: (string | null | undefined)[]): string | null {
  return values.find((v) => v && v.trim()) ?? null;
}

function merged(day: CalendarOccurrence[]): CalendarOccurrence {
  const state = dayState(day.map(stateOf));
  // A day that holds class is described by the dates that hold class only: a
  // cancelled group must not widen the time span or lend its description.
  const basis = state === "curs" ? day.filter((o) => stateOf(o) === "curs") : day;
  const starts = basis.flatMap((o) => (o.startTime ? [o.startTime] : [])).sort();
  const ends = basis.flatMap((o) => (o.endTime ? [o.endTime] : [])).sort();
  return {
    ...day[0], title: TITLE, label: null, groupName: null, state, ...STATUS[state],
    startTime: starts[0] ?? null, endTime: ends[ends.length - 1] ?? null,
    note: firstText(day.map((o) => o.note)),
    description: firstText(basis.map((o) => o.description)),
  };
}

export function mergeScoalaDays(occurrences: CalendarOccurrence[]): CalendarOccurrence[] {
  const byDate = occurrences.reduce((map, o) => map.set(o.date, [...(map.get(o.date) ?? []), o]), new Map<string, CalendarOccurrence[]>());
  return [...byDate.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([, day]) => merged(day));
}
