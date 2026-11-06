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
