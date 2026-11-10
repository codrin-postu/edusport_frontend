/**
 * Coach API types. Copied from the backend repo (edusport_backend, p3be feat/athletes, plan coach-portal-additions; first copy at commit 0474a2f; CoachMe.coachId, coachOptions and CoachSavedDays from b220199):
 * src/club/portal/coach/api-types.ts with its imports inlined from
 * src/api/calendar-event/services/expand.ts (Occurrence),
 * src/club/groups/{program-read,api-types,types,series}.ts (GroupProgram, ProgramRow, SeasonRef, JoinResult, DayKey, WeekOfMonth, RepeatFreq),
 * src/club/groups/program-dates.ts (DateAnswer),
 * src/club/presence/attendance/api-types.ts (AddedSession, SectionKind, SessionCheck, SavedOnDay (listed boolean, see CoachSavedOnDay), SessionSaveBody, Tick, SessionSaved, LessonBody, LessonPatch, LessonSaved),
 * src/club/presence/types.ts (LessonState),
 * and src/club/portal/auth/issue.ts (PortalSession).
 * The four program body types are written from the readers in src/club/groups/program-plan.ts.
 * Training add (2026-11-10): CoachProgramRule, LessonRepeat, LessonSeriesView, CoachLessonCreated, CoachLessonPlanBody, CoachProgram.rules, CoachLesson.series and planEditable, DateAnswer.mode "remove", the `until`, `day` and `repeat` body fields,
 * from the backend plan edusport_backend/docs/superpowers/plans/2026-11-10-coach-training-add.md (branch feat/training-add), section "HTTP contracts".
 * Type-only module: loaded by Node tests through type stripping.
 */

export type DayKey = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";
export type WeekOfMonth = "first" | "second" | "third" | "fourth" | "last";
export type RepeatFreq = "weekly" | "biweekly" | "monthly";
export type SectionKind = "school" | "club";
export type LessonState = "planned" | "saved";
export type SeasonRef = { documentId: string; label: string; past: boolean };
export type JoinResult = { added: number; athleteNames: string[]; groupName: string };
export type DateAnswer = { mode: "keep" | "cancel" | "move" | "remove"; date: string; emails: number };

/** "Program obișnuit": one row per series of the season still running. */
export type ProgramRow = {
  eventId: string; freq: RepeatFreq; days: DayKey[]; weekOfMonth: WeekOfMonth | null; startTime: string; durationMin: number;
  from: string; to: string; text: string; fromText: string; nextDate: string | null;
};
export type GroupProgram = { season: SeasonRef | null; series: ProgramRow[] };

export interface Occurrence {
  eventId: number;
  documentId?: string;
  title: string;
  type: string;
  label: string | null;
  color: string | null;
  order: number;
  /** YYYY-MM-DD, the day the occurrence starts. */
  date: string;
  /** HH:mm */
  startTime: string | null;
  /** HH:mm */
  endTime: string | null;
  /** True when `endTime` belongs to the day after `date` (crosses midnight). */
  endsNextDay: boolean;
  /** Resolved calendar day of `endTime`, or null without an end time; equals `date` unless `endsNextDay`. */
  endDate: string | null;
  status: "scheduled" | "cancelled" | "override";
  cancelReason: "exception" | "blackout" | null;
  /** Scoala only. */
  state?: "curs" | "liber" | "anulat" | null;
  /** Reason of a cancelled or moved date, the break name. */
  note?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  linkUrl?: string | null;
  linkLabel?: string | null;
  groupId: string | null;
  groupName: string | null;
  /** True for the dates of a one-off class (`freq: "none"`), never for a series date. */
  oneOff: boolean;
  /** A moved date: the series date and start time it came from. */
  originalDate: string | null;
  originalStartTime: string | null;
}

export type AddedSession = { groupId: string; date: string; startTime: string; durationMin: number };
/** `listed`: the calling coach is in that session's coaches (backend CoachSavedOnDay; the phase 5 roster count is not sent to coaches). */
export type SavedOnDay = { sessionId: string; startTime: string; present: number; listed: boolean; savedBy: string };
export type SessionCheck =
  | { kind: "existing"; sameTime: boolean; saved: SavedOnDay[] }
  | { kind: "occurrence"; occurrenceKey: string }
  | { kind: "free"; outsideSchedule: boolean };
export type Tick = { athleteId: string; grup: boolean; uscat: boolean };
export type SessionSaveBody = {
  id?: string; occurrence?: string; added?: AddedSession; coachIds: string[]; ticks: Tick[]; reactivate: string[]; keepInactive: string[];
};
export type SessionSaved = { sessionId: string; toast: string };
export type LessonBody = { athleteId: string; date: string; startTime: string; durationMin: number; coachIds: string[] };
/** One weekday of a series: the rows of "Program săptămânal". `untilSeasonEnd` is true when `to` is the season's last day. */
export type CoachProgramRule = {
  eventId: string; day: DayKey; freq: RepeatFreq; weekOfMonth: WeekOfMonth | null; startTime: string; durationMin: number;
  from: string; to: string; untilSeasonEnd: boolean; nextDate: string | null;
};
export type LessonRepeat = { freq: RepeatFreq; days: DayKey[]; weekOfMonth?: WeekOfMonth | null; until: string | null };
export type LessonSeriesView = {
  seriesId: string; freq: RepeatFreq; days: DayKey[]; weekOfMonth: WeekOfMonth | null; startTime: string; durationMin: number;
  from: string; to: string; untilSeasonEnd: boolean;
};
export type CoachLessonCreated = { lessonId: string; seriesId: string | null; count: number; toast: string };
export type CoachLessonPlanBody = {
  date: string; startTime: string; durationMin: number; coachIds: string[]; scope: "one" | "following"; repeat?: LessonRepeat | null;
};
/** `POST /lessons`: today's body plus `repeat` (with `repeat`, `date` is "Din data"). */
export type CoachLessonBody = LessonBody & { repeat?: LessonRepeat | null };
export type LessonPatch = { present: boolean; durationMin: number; coachIds: string[] };
export type LessonSaved = { lessonId: string; changed: boolean; toast: string };

/** JSON shapes of the coach routes. Only what the coach screens show: no price, amount, birth date, note, address or registration. */
export type CoachMe = { name: string; firstName: string; initials: string; email: string; phone: string | null; hasPassword: boolean; google: boolean;
  /** The coach's own team member documentId (a lesson's `coachIds` must contain it). */
  coachId: string;
  /** Team members who coach any group: id and name only, for choosing a lesson's coaches. */
  coachOptions: { id: string; name: string }[];
};
/** Dates of one month (`YYYY-MM-DD`, ascending) that have a saved session the coach may read. */
export type CoachSavedDays = { month: string; dates: string[] };
/** `twoFactorUntil`: the end of this device's remembered 2FA skip, null when it must answer the second step. */
export type CoachDevice = { id: string; label: string; lastSeenAt: string; current: boolean; twoFactorUntil: string | null };
export type CoachClassRow = {
  sessionId: string | null; occurrenceKey: string | null; groupId: string; groupName: string; date: string; startTime: string; children: number; done: boolean; standIn: boolean;
  location: string | null;
};
export type CoachLessonRow = { lessonId: string; athleteName: string; date: string; startTime: string; durationMin: number; done: boolean };
export type CoachToday = { date: string; today: string; groups: CoachClassRow[]; lessons: CoachLessonRow[]; todo: CoachClassRow[] };
export type NextClass = { date: string; startTime: string };
export type CoachGroupRow = { groupId: string; name: string; kind: SectionKind; program: string[]; children: number; next: NextClass | null };
export type OtherGroupRow = { groupId: string; name: string; coaches: string[]; program: string[]; children: number; next: NextClass | null };
export type CoachGroups = { mine: CoachGroupRow[]; others: OtherGroupRow[] };
/** `leavesOn`: the date a scheduled move or removal takes effect (the membership's `to` + 1 day), null when none; the member is listed until `to`. */
export type CoachMember = { athleteId: string; name: string; age: number | null; isNew: boolean; alsoIn: string[]; leavesOn: string | null };
export type StandInSlot = { occurrenceKey: string; date: string; startTime: string };
export type CoachGroupPage = {
  groupId: string; name: string; kind: SectionKind; own: boolean; coaches: string[]; program: string[];
  /** null for another coach's group. */
  members: CoachMember[] | null;
  /** Other group only: scheduled classes from today - 7 to today, newest first. */
  standIn: StandInSlot[];
  /** Occurrence key of today's class (own or other), drives "Fă prezența" / "Înlocuiesc azi". */
  todayKey: string | null;
  /** Own Club group only. */
  programPublic: boolean | null;
  location: string | null;
};
export type CoachPresenceRow = {
  athleteId: string; name: string; age: number | null; inactive: boolean; visitor: boolean; grup: boolean; uscat: boolean; abonament: string | null;
};
export type CoachSession = {
  sessionId: string | null; occurrenceKey: string | null; added: AddedSession | null; groupId: string; groupName: string; kind: SectionKind;
  date: string; startTime: string; durationMin: number; outsideSchedule: boolean; coachIds: string[]; coachOptions: { id: string; name: string }[];
  rows: CoachPresenceRow[]; savedLine: string | null; editable: boolean; archived: boolean; standIn: boolean;
};
export type CoachLesson = {
  lessonId: string; athleteId: string; athleteName: string; date: string; startTime: string; durationMin: number; coachIds: string[];
  coachOptions: { id: string; name: string }[]; state: LessonState; present: boolean | null; savedLine: string | null; editable: boolean; archived: boolean; deletable: boolean;
  series: LessonSeriesView | null; planEditable: boolean;
};
export type CoachSearchRow = { athleteId: string; name: string; age: number | null };
export type CoachNewAthleteBody = { groupId: string; name: string; birthDate?: string | null; contactName?: string | null; phone?: string | null; email?: string | null };
export type CoachCompetitionMember = { athleteId: string; name: string; category: string; placement: number | null; total: number | null };
export type CoachCompetitionEvent = { eventId: string; name: string; date: string | null; location: string | null; members: CoachCompetitionMember[] };
export type CoachCompetitions =
  | { available: false }
  | { available: true; stale: boolean; seasons: string[]; season: string; events: CoachCompetitionEvent[] };
/** Competitions of one athlete; `{ available: false }` when the source has nothing. */
export type CoachAthleteCompetitions =
  | { available: false }
  | { available: true; category: string | null; season: string; count: number; podiums: number;
      recent: { eventName: string; date: string | null; location: string | null; placement: number | null; total: number | null }[] };
export type CoachAthleteCard = {
  athleteId: string; name: string; age: number | null; groups: string[]; school: string | null; contact: { name: string | null; phone: string | null } | null;
  /** Section of the main group today, e.g. "Școala de patinaj". */
  sectionName: string | null;
  /** Current groups, main first. */
  groupRows: { groupId: string; name: string; program: string[] }[];
  presence: { season: number; lessons: number; last: string | null; missedThisMonth: number };
  /** Own children only. */
  abonament: { code: string | null; next: number; slots: number; validUntil: string; location: string | null } | null;
  competitions: CoachAthleteCompetitions;
};
export type CoachCalendarItem = {
  kind: "grup" | "individual"; cancelled: boolean; date: string; startTime: string; durationMin: number | null; title: string;
  children: number | null; location: string | null; done: boolean; standIn: boolean;
  sessionId: string | null; occurrenceKey: string | null; lessonId: string | null;
};
export type CoachCalendar = { month: string; today: string; days: { date: string; items: CoachCalendarItem[] }[] };
export type CoachMemberChange = { athleteName: string; groupName: string; from: string; toast: string };
export type CoachHistoryRow = {
  kind: "grup" | "inlocuitor" | "individuala"; date: string; name: string; present: number | null; durationMin: number | null; sessionId: string | null; lessonId: string | null;
  /** false: an own scheduled class of the month, up to today, nobody saved yet. */
  done: boolean; occurrenceKey: string | null;
};
export type CoachHistory = { month: string; sessions: number; lessons: number; hours: string; rows: CoachHistoryRow[] };
export type CoachProgram = { kind: SectionKind; editable: boolean; programPublic: boolean | null; program: GroupProgram; occurrences: Occurrence[]; rules: CoachProgramRule[] };

/** Login-like answer of /api/portal/auth/* (contracts). */
export type PortalSession = { accessToken: string; refreshToken: string; accessExpiresAt: string; deviceKey: string | null };
export type ApiRefusal = { data: null; error: { status: number; name: string; message: string } };

export type ProgramAddBody =
  | { repeat: true; freq: RepeatFreq; days: DayKey[]; weekOfMonth?: WeekOfMonth; startTime: string; durationMin: number; from: string; until?: string | null }
  | { repeat: false; date: string; startTime: string; durationMin: number; note?: string };
/** `readSeriesInput` in program-plan.ts: the same fields as a repeating add, without `repeat`. */
export type ProgramChangeBody = Omit<Extract<ProgramAddBody, { repeat: true }>, "repeat" | "until"> & { day?: DayKey };
export type ProgramEndBody = { from: string; day?: DayKey };
export type DateBody =
  | { mode: "keep" }
  | { mode: "cancel"; reason?: string; notifyParents?: boolean }
  | { mode: "move"; newDate: string; newStartTime: string; reason?: string | null; notifyParents?: boolean }
  | { mode: "remove" };
