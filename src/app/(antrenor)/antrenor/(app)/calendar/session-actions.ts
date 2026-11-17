// What the calendar's session sheet offers. Pure: loaded by Node tests through type stripping.

export type SessionAction = "prezenta" | "anuleaza" | "muta" | "sterge";

export type SessionFacts = {
  kind: "group" | "lesson";
  /** Recorded and past the correction window: read only. */
  archived: boolean;
  /** The date is today or later. */
  future: boolean;
  /** The session or lesson was cancelled. */
  cancelled?: boolean;
  /** Presence was saved. */
  done?: boolean;
};

/** Days after a session during which its presence can still be corrected (the backend's CORRECTION_DAYS). */
const CORRECTION_DAYS = 7;

const dayNumber = (date: string): number => Date.UTC(Number(date.slice(0, 4)), Number(date.slice(5, 7)) - 1, Number(date.slice(8, 10))) / 86_400_000;

/** A session with saved presence more than the correction window ago. */
export const isArchived = (date: string, today: string, done: boolean): boolean => done && dayNumber(today) - dayNumber(date) > CORRECTION_DAYS;

/**
 * The actions of one session, in the order the sheet lists them. A group session is carried out by the program's date sheet (all four from today on);
 * a lesson has no move. Archived: presence only, read only. A cancelled lesson can only be deleted; a past date or a lesson with saved presence cannot be cancelled.
 */
export function sessionActions(s: SessionFacts): SessionAction[] {
  if (s.archived) return ["prezenta"];
  const cancelled = s.cancelled === true;
  if (s.kind === "lesson" && cancelled) return ["sterge"];
  const out: SessionAction[] = cancelled ? [] : ["prezenta"];
  if (s.kind === "group") {
    if (s.future) out.push("anuleaza", "muta");
    out.push("sterge");
    return out;
  }
  if (s.future && s.done !== true) out.push("anuleaza");
  out.push("sterge");
  return out;
}

/** The body of the cancel: the reason trimmed, left out when empty. */
export const cancelBody = (reason: string): { reason?: string } => {
  const text = reason.trim();
  return text === "" ? {} : { reason: text };
};
