// Synthetic sportiv accounts and athletes for the sportiv e2e (shapes after backend scripts/fixtures/phase7-shape.js).
// No real names or addresses.
import { FROZEN_TODAY, addDays } from "./portal-fixtures.mjs";

export const SPORTIV_PASSWORD = "Throwaway-Sportiv-1";
export const ANA_ID = "athana0001";
export const MATEI_ID = "athmatei01";
export const ADULT_ID = "athadult01";
export const FOREIGN_ID = "athforeign1";

export const SPORTIV_ACCOUNTS = {
  "parinte1@example.invalid": { name: "Elena Ionescu", phone: "0722 000 222", password: SPORTIV_PASSWORD, google: false, athletes: [ANA_ID, MATEI_ID] },
  "sportiv18@example.invalid": { name: "Ioana Marin", phone: null, password: SPORTIV_PASSWORD, google: false, athletes: [ADULT_ID] },
};

const SCHOOL = { section: "school", sectionName: "Școala de patinaj", location: "AFI Cotroceni" };

/** Per athlete: the row of `athletes`, the level and what Acasă shows. */
export const SPORTIV_ATHLETES = {
  [ANA_ID]: {
    name: "Ana Ionescu", firstName: "Ana", groupName: "Intermediari Bronze", age: 9, section: "school", performance: false,
    level: { groupId: "grpbronze01", groupName: "Intermediari Bronze", ...SCHOOL }, coach: "Alina Gheorghe",
    abonament: { code: "A-0124", next: 5, slots: 8 }, presences: 26,
  },
  [MATEI_ID]: {
    name: "Matei Ionescu", firstName: "Matei", groupName: "Începători", age: 6, section: "school", performance: false,
    level: { groupId: "grpbeginner1", groupName: "Începători", ...SCHOOL }, coach: "Andrei Pop",
    abonament: null, presences: 4,
  },
  [ADULT_ID]: {
    name: "Ioana Marin", firstName: "Ioana", groupName: "Club Performanță", age: 13, section: "club", performance: true,
    level: { groupId: "grpperform01", groupName: "Club Performanță", section: "club", sectionName: "Club", location: "Patinoar Nord" }, coach: "Alina Gheorghe",
    abonament: null, presences: 61,
  },
};

export const ICS_BODY = "BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//EduSport//RO\r\nEND:VCALENDAR\r\n";
export const PDF_BODY = "%PDF-1.4\n1 0 obj<</Type/Catalog>>endobj\ntrailer<</Root 1 0 R>>\n%%EOF\n";

const iso = (date) => `${date}T09:00:00.000Z`;

export function athleteRow(id, state) {
  const a = SPORTIV_ATHLETES[id];
  return { id, name: a.name, firstName: a.firstName, groupName: a.groupName, age: a.age, section: a.section, inPicker: state.unlisted !== id, performance: a.performance };
}

const session = (a, offset, start, end) => ({
  date: addDays(FROZEN_TODAY, offset), startTime: start, endTime: end, kind: "grupa", title: a.groupName, location: a.level.location, coaches: [a.coach], cancelled: false, note: null,
});

const competitionRow = { resultId: "res-0001", eventName: "Cupa României 2026", date: addDays(FROZEN_TODAY, -20), location: "București", category: "Advanced Novice Girls", categoryShort: "ANG", placement: 2, total: 98.42 };

export function homeOf(id, state) {
  const a = SPORTIV_ATHLETES[id];
  const comps = a.performance;
  let lastCompetition = null;
  if (comps && !state.noCompetitions) {
    lastCompetition = state.skateDown ? { available: false } : { available: true, stale: state.stale === true, updatedAt: iso(FROZEN_TODAY), row: competitionRow, field: 18 };
  }
  return {
    athlete: { id, name: a.name, firstName: a.firstName, age: a.age, inactive: state.inactive === id || state.inactive === true },
    level: a.level, category: comps ? "Advanced Novice Girls" : null, seasonLabel: "2026-2027",
    presences: { total: a.presences, months: [{ month: "2026-09", count: 7, state: "past" }, { month: "2026-10", count: 8, state: "past" }, { month: "2026-11", count: 6, state: "current" }, { month: "2026-12", count: null, state: "future" }, { month: "2027-01", count: null, state: "future" }, { month: "2027-02", count: null, state: "future" }] },
    upcoming: [session(a, 0, "17:30", "18:30"), { ...session(a, 2, "17:30", "18:30"), kind: "individual" }, { ...session(a, 7, "17:30", "18:30"), ...(comps ? { kind: "concurs" } : {}) }],
    abonament: a.abonament ? { ...a.abonament, validUntil: addDays(FROZEN_TODAY, 25) } : null,
    lastCompetition,
    promotion: state.promotion === id || state.promotion === true ? { from: "Intermediari Bronze", to: "Intermediari Silver" } : null,
  };
}

export function historyOf(id, state, page) {
  const a = SPORTIV_ATHLETES[id];
  const empty = state.emptyHistory;
  const total = empty ? 0 : a.presences;
  const from = (page - 1) * 20;
  // Every sixth presence is an individual lesson.
  const isLesson = (n) => n % 6 === 5;
  const individual = Array.from({ length: total }, (_, n) => n).filter(isLesson).length;
  const rows = Array.from({ length: Math.max(0, Math.min(20, total - from)) }, (_, i) => {
    const date = addDays(FROZEN_TODAY, -(from + i) * 2);
    return isLesson(from + i)
      ? { date, startTime: "17:30", kind: "Individual", groupName: null, coaches: ["Andrei Pop"] }
      : { date, startTime: "17:30", kind: "Grup", groupName: a.groupName, coaches: [a.coach] };
  });
  return { seasonLabel: "2026-2027", total, group: total - individual, individual, page, pageSize: 20, rows };
}

export function moneyOf(id, state) {
  const a = SPORTIV_ATHLETES[id];
  const owes = !state.nothingOwed && a.abonament !== null;
  return {
    left: owes ? 150 : 0, lines: owes ? [{ text: "Abonament A-0124", amount: 150 }] : [], advance: null,
    abonament: a.abonament ? { ...a.abonament, validUntil: addDays(FROZEN_TODAY, 30), itemName: "Abonament 8 ședințe", startsOn: addDays(FROZEN_TODAY, -30) } : null,
    document: state.noDocument ? null : { seasonLabel: "2026-2027" },
  };
}

export function competitionsOf(id, state, query) {
  const a = SPORTIV_ATHLETES[id];
  if (state.skateDown) return { available: false };
  const rows = a.performance && !state.noCompetitions ? [competitionRow] : [];
  return {
    available: true, stale: false, updatedAt: iso(FROZEN_TODAY), total: rows.length,
    category: rows.length ? { current: "Novice B", seasonLabel: "2026-2027", previous: null } : null,
    records: { best: rows.length ? 24 : null, podiums: rows.length, wins: 0 }, seasons: ["2026-2027"], page: Number(query.get("page") ?? 1), pageSize: 20, filtered: rows.length, rows,
  };
}

export function competitionOf(state) {
  if (state.skateDown) return { available: false };
  return {
    available: true, stale: false, updatedAt: iso(FROZEN_TODAY), row: competitionRow, field: 18, best: 98.42, officialUrl: null,
    segments: [{ name: "Program scurt", isShort: true, score: 24, tes: 12, pcs: 12, deductions: 0, elements: [{ name: "Piruetă", base: 3, score: 3.2 }] }],
  };
}

export function pathOf(id) {
  const a = SPORTIV_ATHLETES[id];
  return {
    now: { groupName: a.groupName, since: addDays(FROZEN_TODAY, -120), location: a.level.location, program: null },
    next: { groupName: "Intermediari Silver" }, before: [{ groupName: "Începători", from: addDays(FROZEN_TODAY, -300), to: addDays(FROZEN_TODAY, -120) }],
    badges: [{ key: "antrenamente", tier: "bronze", label: "Antrenamente", count: a.presences, next: 50, tiers: [{ threshold: 25, tier: "bronze", reachedOn: addDays(FROZEN_TODAY, -10) }, { threshold: 50, tier: "silver", reachedOn: null }] }],
  };
}

export function profileOf(id) {
  const a = SPORTIV_ATHLETES[id];
  return { name: a.name, birthDate: "2017-03-14", age: a.age, contactName: "Elena Ionescu", phone: "0722 000 222", email: "parinte1@example.invalid" };
}
