import type { CoachProgramRule, DayKey } from "@/lib/portal/api-types";

const ORDER: DayKey[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

/** Weekday by weekday (Monday first); inside a weekday the row that has started first, a later one under it. */
export function byWeekday(rules: CoachProgramRule[]): CoachProgramRule[] {
  return [...rules].sort((a, b) => ORDER.indexOf(a.day) - ORDER.indexOf(b.day) || a.from.localeCompare(b.from) || a.startTime.localeCompare(b.startTime));
}

const covers = (r: CoachProgramRule, date: string): boolean => r.from <= date && date <= r.to;

/**
 * The eventId a write addresses. A row is identified by eventId, weekday and start time, never by weekday alone:
 * the tapped row when it covers `date`; else, on the same weekday, the row that covers `date` at the same start time
 * (a split weekday), then any row of that weekday that covers it; else the tapped row.
 */
export function eventForDate(rules: CoachProgramRule[], rule: CoachProgramRule, date: string): string {
  if (covers(rule, date)) return rule.eventId;
  const sameDay = rules.filter((r) => r.day === rule.day && covers(r, date));
  const hit = sameDay.find((r) => r.startTime === rule.startTime) ?? sameDay[0];
  return (hit ?? rule).eventId;
}
