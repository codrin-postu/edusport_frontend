import type { CoachProgramRule, DayKey } from "@/lib/portal/api-types";

const ORDER: DayKey[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

/** Weekday by weekday (Monday first); inside a weekday the row that has started first, a later one under it. */
export function byWeekday(rules: CoachProgramRule[]): CoachProgramRule[] {
  return [...rules].sort((a, b) => ORDER.indexOf(a.day) - ORDER.indexOf(b.day) || a.from.localeCompare(b.from) || a.startTime.localeCompare(b.startTime));
}

/** The eventId a write addresses: the row of that weekday whose from and to cover `date`, else the row the coach tapped. */
export function eventForDate(rules: CoachProgramRule[], rule: CoachProgramRule, date: string): string {
  const hit = rules.find((r) => r.day === rule.day && r.from <= date && date <= r.to);
  return (hit ?? rule).eventId;
}
