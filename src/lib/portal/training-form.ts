// State of the "Antrenament nou" / "Modifică lecția" form: value, readiness, request bodies, summary. Pure, loaded by Node tests.
import type { CoachLesson, CoachLessonBody, CoachLessonPlanBody, DayKey, LessonRepeat, ProgramAddBody, RepeatFreq, WeekOfMonth } from "./api-types";
import { TRAINING } from "./copy.ts";
import { capitalize, dayMonthLong, daysSpoken, longDay, weekdayLong, weekOfMonthOf } from "./format.ts";

export type TrainingKind = "grup" | "individual";
export type RepeatChoice = "none" | "weekly" | "biweekly" | "monthly";
export type TrainingValue = {
  kind: TrainingKind; groupId: string | null; athlete: { athleteId: string; name: string } | null;
  repeat: RepeatChoice; days: DayKey[]; date: string; startTime: string; durationMin: number;
  /** The week of the month a monthly series keeps (edit mode: the series' own); null: taken from `from`. */ week: WeekOfMonth | null;
  from: string; /** null: the season's end; "": "Alege data" chosen, no date yet. */ until: string | null; coachIds: string[];
};
export type TrainingMode = { kind: "new" } | { kind: "preset"; groupId: string } | { kind: "edit"; lesson: CoachLesson };

const DAY_ORDER: DayKey[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
const DAY_OF_WEEK: DayKey[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

/** The weekday of a date as a day key. */
export const dayKeyOf = (date: string): DayKey => DAY_OF_WEEK[new Date(`${date}T00:00:00Z`).getUTCDay()];
const sorted = (days: DayKey[]): DayKey[] => DAY_ORDER.filter((d) => days.includes(d));

export function initialValue(mode: TrainingMode, today: string, me: string): TrainingValue {
  const base: TrainingValue = {
    kind: "grup", groupId: null, athlete: null, repeat: "weekly", days: [dayKeyOf(today)], date: today, startTime: "", durationMin: 60,
    from: today, until: null, coachIds: [me], week: null,
  };
  // "+ Adaugă program" adds a repeating rule, so it starts weekly; a plain new training starts as a single one.
  if (mode.kind === "preset") return { ...base, groupId: mode.groupId };
  if (mode.kind === "new") return { ...base, repeat: "none" };
  const l = mode.lesson;
  const s = l.series;
  return {
    ...base, kind: "individual", athlete: { athleteId: l.athleteId, name: l.athleteName }, repeat: s ? s.freq : "none", days: s ? sorted(s.days) : [dayKeyOf(l.date)],
    date: l.date, startTime: l.startTime, durationMin: l.durationMin, from: l.date, until: s && !s.untilSeasonEnd ? s.to : null, coachIds: l.coachIds, week: s?.weekOfMonth ?? null,
  };
}

export function ready(v: TrainingValue): boolean {
  if (v.kind === "grup" ? !v.groupId : !v.athlete) return false;
  if (!/^\d{2}:\d{2}$/.test(v.startTime) || v.durationMin <= 0) return false;
  if (v.repeat === "none") return v.date !== "";
  if (v.days.length === 0 || v.from === "") return false;
  return v.until === null || (v.until !== "" && v.until >= v.from);
}

const freqOf = (v: TrainingValue): RepeatFreq => (v.repeat === "none" ? "weekly" : v.repeat);
const weekFor = (v: TrainingValue): WeekOfMonth => v.week ?? weekOfMonthOf(v.from);
const weekOf = (v: TrainingValue): WeekOfMonth | null => (v.repeat === "monthly" ? weekFor(v) : null);

/** POST /groups/:id/program */
export function groupBody(v: TrainingValue): ProgramAddBody {
  if (v.repeat === "none") return { repeat: false, date: v.date, startTime: v.startTime, durationMin: v.durationMin };
  const week = weekOf(v);
  return {
    repeat: true, freq: freqOf(v), days: sorted(v.days), ...(week ? { weekOfMonth: week } : {}),
    startTime: v.startTime, durationMin: v.durationMin, from: v.from, until: v.until,
  };
}

function repeatOf(v: TrainingValue): LessonRepeat | null {
  if (v.repeat === "none") return null;
  const week = weekOf(v);
  return { freq: freqOf(v), days: sorted(v.days), ...(week ? { weekOfMonth: week } : {}), until: v.until };
}

const coachIdsOf = (v: TrainingValue): string[] => v.coachIds;

/** POST /lessons */
export function lessonBody(v: TrainingValue): CoachLessonBody {
  const repeat = repeatOf(v);
  return {
    athleteId: v.athlete?.athleteId ?? "", date: v.repeat === "none" ? v.date : v.from, startTime: v.startTime, durationMin: v.durationMin, coachIds: coachIdsOf(v),
    ...(repeat ? { repeat } : {}),
  };
}

/** PUT /lessons/:id/plan */
export function planBody(v: TrainingValue, scope: "one" | "following"): CoachLessonPlanBody {
  return { date: v.repeat === "none" ? v.date : v.from, startTime: v.startTime, durationMin: v.durationMin, coachIds: coachIdsOf(v), scope, repeat: repeatOf(v) };
}

const WEEK_WORD: Record<WeekOfMonth, string> = TRAINING.weekWord;

/** The ice band above the button; null while there is nothing to say yet (no time, no day). */
export function trainingSummary(v: TrainingValue): string | null {
  if (!/^\d{2}:\d{2}$/.test(v.startTime)) return null;
  if (v.repeat === "none") return v.date === "" ? null : TRAINING.summaryOnce(longDay(v.date), v.startTime);
  if (v.days.length === 0 || v.from === "") return null;
  const until = v.until ? dayMonthLong(v.until) : null;
  const from = dayMonthLong(v.from);
  const days = daysSpoken(v.days);
  if (v.repeat === "monthly") return TRAINING.summaryMonthly(WEEK_WORD[weekFor(v)], days, v.startTime, v.durationMin, from, until);
  const lead = v.repeat === "biweekly" ? `${TRAINING.biweekly}, ` : "";
  return TRAINING.summarySeries(lead, lead ? days : capitalize(days), v.startTime, v.durationMin, from, until);
}

/** "11 noiembrie este a doua marți." for the grey line under the date row of a monthly repeat. */
export function monthlyNote(from: string, week: WeekOfMonth | null = null): string {
  return TRAINING.monthlyNote(dayMonthLong(from), `${WEEK_WORD[week ?? weekOfMonthOf(from)]} ${weekdayLong(from)}`);
}
