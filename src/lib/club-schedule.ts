// ---------------------------------------------------------------------------
// The Școala notebook on /cursuri/program, read from GET /api/club/schedule
// (backend plan 4-2): per school, the time slots of the public, active Școala
// groups in the current season. The CMS `program.scheduleGroups` stays the
// fallback (spec 9.1). No runtime imports: scripts/club/club-schedule.test.mjs
// loads this file with node's type stripping.
// ---------------------------------------------------------------------------

import type { ScheduleGroup } from "@/app/(site)/cursuri/program/_types";

export type ScheduleSlot = { start: string; end: string; groups: string[] };
export type SchoolSchedule = { section: { name: string; slug: string }; slots: ScheduleSlot[] };

const isRecord = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object" && !Array.isArray(v);
const isTime = (v: unknown): v is string => typeof v === "string" && /^\d{2}:\d{2}$/.test(v);
const names = (v: unknown): string[] => (Array.isArray(v) ? v.filter((x): x is string => typeof x === "string" && x.trim() !== "") : []);

function parseSlot(v: unknown): ScheduleSlot | null {
  if (!isRecord(v) || !isTime(v.start) || !isTime(v.end)) return null;
  const groups = names(v.groups);
  return groups.length ? { start: v.start, end: v.end, groups } : null;
}

function parseSchool(v: unknown): SchoolSchedule | null {
  if (!isRecord(v) || !isRecord(v.section) || typeof v.section.name !== "string" || typeof v.section.slug !== "string") return null;
  const slots = Array.isArray(v.slots) ? v.slots.map(parseSlot).filter((s): s is ScheduleSlot => s !== null) : [];
  return { section: { name: v.section.name, slug: v.section.slug }, slots };
}

export function parseClubSchedule(raw: unknown): SchoolSchedule[] {
  return Array.isArray(raw) ? raw.map(parseSchool).filter((s): s is SchoolSchedule => s !== null) : [];
}

/** "09:00 - 09:50" (decided 1). */
export const slotsToGroups = (slots: ScheduleSlot[]): ScheduleGroup[] => slots.map((s) => ({ timeSlot: `${s.start} - ${s.end}`, courses: s.groups }));

/** The first school with slots (decided 2), else the CMS series (spec 9.1 fallback, decided 3). */
export function notebookGroups(schedule: SchoolSchedule[], fallback: ScheduleGroup[]): ScheduleGroup[] {
  const school = schedule.find((s) => s.slots.length > 0);
  return school ? slotsToGroups(school.slots) : fallback;
}
