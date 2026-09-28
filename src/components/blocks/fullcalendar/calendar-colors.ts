/**
 * The season calendar's only colour source. Tiles (month and week grids),
 * mobile sheet dots, tooltip bars, the Weekenduri status squares and the legend
 * all read this map, so they cannot drift apart. Every value is a site token.
 *
 * The backend `color` field on an occurrence is deliberately ignored.
 */

import type { CalendarOccurrence } from "@/lib/strapi-calendar";

export type CalendarGroup = "scoala" | "antrenament" | "eveniment" | "liber" | "anulat";

export interface CalendarGroupStyle {
  id: CalendarGroup;
  /** Legend label. */
  label: string;
  /** Fill, as a site token reference. */
  bg: string;
  /** Text on top of the fill; every pair passes WCAG AA for normal text. */
  fg: string;
  /** FullCalendar class on the tile (drives the strike-through and mobile hit rules). */
  className: string;
}

/** Legend order. */
export const CALENDAR_GROUPS: readonly CalendarGroupStyle[] = [
  {
    id: "scoala",
    label: "Școala de Patinaj",
    bg: "var(--color-surface-dark)",
    fg: "var(--color-primary-on-dark)",
    className: "fc-event-scoala",
  },
  {
    id: "antrenament",
    label: "Antrenament",
    bg: "var(--color-burgundy)",
    fg: "var(--color-primary-on-dark)",
    className: "fc-event-antrenament",
  },
  {
    id: "eveniment",
    label: "Evenimente",
    // Cream on orange is 2.85:1 (fails), navy is 5.65:1.
    bg: "var(--color-orange)",
    fg: "var(--color-primary)",
    className: "fc-event-eveniment",
  },
  {
    id: "liber",
    label: "Liber",
    bg: "var(--color-medal-silver)",
    fg: "var(--color-primary)",
    className: "fc-event-liber",
  },
  {
    id: "anulat",
    label: "Anulat",
    bg: "var(--color-accent)",
    fg: "var(--color-primary-on-dark)",
    className: "fc-event-anulat",
  },
];

export const CALENDAR_GROUP: Record<CalendarGroup, CalendarGroupStyle> = Object.fromEntries(
  CALENDAR_GROUPS.map((g) => [g.id, g]),
) as Record<CalendarGroup, CalendarGroupStyle>;

/** FullCalendar EventInput colour props for a group (inline, so no CSS copy exists). */
export function groupEventColors(group: CalendarGroup) {
  const g = CALENDAR_GROUP[group];
  return {
    classNames: [g.className],
    backgroundColor: g.bg,
    borderColor: g.bg,
    textColor: g.fg,
  };
}

/** Backend category (occurrence `type`) to colour group. */
export function groupForCategory(type: string): CalendarGroup {
  switch (type) {
    case "scoala":
      return "scoala";
    case "curs":
      return "antrenament";
    case "liber":
    case "vacanta":
    case "sarbatoare":
      return "liber";
    case "eveniment":
    case "concurs":
    case "cantonament":
    case "spectacol":
    default:
      return "eveniment";
  }
}

/**
 * Colour group of one backend occurrence. A blackout is a planned break (grey
 * Liber); a cancellation by exception is Anulat. Școala dates also carry a
 * per-date state set in the admin calendar.
 */
export function groupForOccurrence(o: CalendarOccurrence): CalendarGroup {
  if (o.status === "cancelled") {
    return o.cancelReason === "blackout" ? "liber" : "anulat";
  }
  if (o.type === "scoala") {
    if (o.state === "anulat") return "anulat";
    if (o.state === "liber") return "liber";
  }
  return groupForCategory(o.type);
}
