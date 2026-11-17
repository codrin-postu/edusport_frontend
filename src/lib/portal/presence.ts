// Pure helpers of the presence screen. Type-only imports (loaded by Node tests).
import type { CoachSession, SessionSaveBody, Tick } from "./api-types";

/** The session query string for `coach/session`: exactly one of `occurrence`, `id`, or `group` + `date` (+ `time`, `duration`). */
export function sessionQuery(search: URLSearchParams): string | null {
  const occurrence = search.get("occurrence");
  if (occurrence) return new URLSearchParams({ occurrence }).toString();
  const id = search.get("id");
  if (id) return new URLSearchParams({ id }).toString();
  const group = search.get("group");
  const date = search.get("date");
  if (!group || !date) return null;
  const out = new URLSearchParams({ group, date });
  for (const key of ["time", "duration"]) {
    const value = search.get(key);
    if (value) out.set(key, value);
  }
  return out.toString();
}

export type PresenceFrom = "istoric" | "calendar" | "grupa";

/** Where the coach came from (`from` query); anything else means Azi. */
export function fromOf(search: URLSearchParams): PresenceFrom | null {
  const v = search.get("from");
  return v === "istoric" || v === "calendar" || v === "grupa" ? v : null;
}

/** Adds `from` to a presence href. */
export function withFrom(href: string, from: PresenceFrom | null): string {
  return from === null ? href : `${href}${href.includes("?") ? "&" : "?"}from=${from}`;
}

export function presentCount(rows: { grup: boolean; uscat: boolean }[]): number {
  return rows.filter((r) => r.grup || r.uscat).length;
}

export function saveBody(
  s: CoachSession,
  ticks: Map<string, { grup: boolean; uscat: boolean }>,
  coachIds: string[],
  reactivate: string[],
  keepInactive: string[],
): SessionSaveBody {
  const ticked: Tick[] = [];
  for (const [athleteId, t] of ticks) if (t.grup || t.uscat) ticked.push({ athleteId, grup: t.grup, uscat: t.uscat });
  const body: SessionSaveBody = { coachIds, ticks: ticked, reactivate, keepInactive };
  if (s.sessionId) body.id = s.sessionId;
  else if (s.occurrenceKey) body.occurrence = s.occurrenceKey;
  else body.added = s.added ?? { groupId: s.groupId, date: s.date, startTime: s.startTime, durationMin: s.durationMin };
  return body;
}
