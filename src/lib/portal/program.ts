// Pure helpers of the Program tab. Type-only import: loaded by Node tests through type stripping.
import type { Occurrence } from "./api-types";

export type DateState = "past" | "pause" | "cancelled" | "moved" | "open";

/** The date a date action addresses: a moved date by the series date it came from (as the admin `dateKey`). */
export const dateKey = (o: Pick<Occurrence, "date" | "originalDate">): string => o.originalDate ?? o.date;

/** A break date: cancelled by a blackout (the admin `isBreak`). */
export const isPause = (o: Pick<Occurrence, "status" | "cancelReason">): boolean => o.status === "cancelled" && o.cancelReason === "blackout";

export function dateState(o: Occurrence, today: string): DateState {
  if (o.date < today) return "past";
  if (isPause(o)) return "pause";
  if (o.status === "cancelled") return "cancelled";
  if (o.status === "override" || o.originalDate !== null) return "moved";
  return "open";
}

/** The Strapi documentId the date routes take; never the numeric `eventId`. */
export const eventDocumentId = (o: Occurrence): string | null => o.documentId ?? null;

/** Minutes from `startTime` to `endTime` of an occurrence, null without an end time (or across midnight). */
export function occurrenceMinutes(o: Pick<Occurrence, "startTime" | "endTime" | "endsNextDay">): number | null {
  if (!o.startTime || !o.endTime) return null;
  const at = (t: string): number => Number(t.slice(0, 2)) * 60 + Number(t.slice(3, 5));
  return at(o.endTime) - at(o.startTime) + (o.endsNextDay ? 24 * 60 : 0);
}
