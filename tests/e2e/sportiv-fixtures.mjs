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
  return { id, name: a.name, firstName: a.firstName, groupName: a.groupName, age: a.age, section: a.section, inPicker: state.unlisted !== id, performance: a.performance || (state.listPerformance ?? []).includes(id) };
}

const session = (a, offset, start, end) => ({
  date: addDays(FROZEN_TODAY, offset), startTime: start, endTime: end, kind: "grupa", title: a.groupName, location: a.level.location, coaches: [a.coach], cancelled: false, reason: null, movedFrom: null,
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
    upcoming: state.noUpcoming ? [] : state.sessionNotices ? [{ ...session(a, 2, "17:30", "18:30"), cancelled: true, reason: "Vacanță" }, { ...session(a, 4, "18:00", "19:00"), movedFrom: { date: addDays(FROZEN_TODAY, 3), startTime: "17:30" } }] : [session(a, 0, "17:30", "18:30"), { ...session(a, 2, "17:30", "18:30"), kind: "individual" }, { ...session(a, 7, "17:30", "18:30"), ...(comps ? { kind: "concurs" } : {}) }],
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
  // moneyMismatch: `left` differs from the sum of `lines` (the page shows what is sent, never a sum).
  const lines = !owes ? [] : state.moneyMismatch ? [{ text: "Lecție 12 noi", amount: 100 }, { text: "Abonament A-0124", amount: 50 }] : [{ text: "Lecție 12 noi", amount: 150 }];
  return {
    left: !owes ? 0 : state.moneyMismatch ? 170 : 150, lines, advance: state.advance ?? null,
    abonament: a.abonament ? { ...a.abonament, validUntil: "2026-11-30", itemName: "Școala noiembrie", startsOn: "2026-11-01" } : null,
    document: state.noDocument ? null : { seasonLabel: "2026-2027" },
  };
}

const PAYMENT_ROWS = [
  { what: "Abonament noiembrie", paidOn: "2026-11-02", method: "numerar", amount: 320 },
  { what: "Lecție 22 oct", paidOn: "2026-10-22", method: "card", amount: 180 },
  { what: "Abonament octombrie", paidOn: "2026-10-01", method: "transfer", amount: 320 },
];

/** Never a cancelled payment and never who recorded one (the backend leaves both out). manyPayments: 26 rows, 20 to a page. */
export function paymentsOf(state, page) {
  const all = state.manyPayments ? Array.from({ length: 26 }, (_, i) => ({ ...PAYMENT_ROWS[i % 3], what: `${PAYMENT_ROWS[i % 3].what} ${i + 1}` })) : PAYMENT_ROWS;
  return { page, pageSize: 20, total: all.length, rows: all.slice((page - 1) * 20, page * 20) };
}

export function subscriptionsOf(id) {
  const a = SPORTIV_ATHLETES[id].abonament;
  if (!a) return { active: null, earlier: [] };
  return {
    active: { code: a.code, itemName: "Școala noiembrie", startsOn: "2026-11-01", validUntil: "2026-11-30", slots: a.slots, used: ["2026-11-01", "2026-11-03", "2026-11-04", "2026-11-05"], left: 4 },
    earlier: [{ itemName: "Școala octombrie", used: 8, slots: 8, validUntil: "2026-10-31" }],
  };
}

const CITIES = ["București", "Brașov", "Cluj-Napoca", "Iași", "Timișoara", "Sibiu"];
const plain = (t) => t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const seasonOf = (date) => { const y = Number(date.slice(0, 4)); const start = Number(date.slice(5, 7)) >= 9 ? y : y - 1; return `${start}-${start + 1}`; };

/** 41 results, newest first; the first is `competitionRow` (res-0001). Another skater's name is only in the event, never in a row. */
const allResults = Array.from({ length: 41 }, (_, i) => (i === 0 ? competitionRow : {
  resultId: `res-${String(i + 1).padStart(4, "0")}`, eventName: `Trofeul ${CITIES[i % CITIES.length]} ${i}`, date: addDays(FROZEN_TODAY, -20 - 9 * i), location: CITIES[i % CITIES.length],
  category: "Advanced Novice Girls", categoryShort: "ANG", placement: i % 7 === 0 ? null : (i % 5) + 1, total: 60 + (i % 13) * 3.1,
}));

export function competitionsOf(id, state, query) {
  const a = SPORTIV_ATHLETES[id];
  if (state.skateDown) return { available: false };
  const all = a.performance && !state.noCompetitions ? allResults : [];
  const q = plain(query.get("q") ?? "");
  const season = query.get("season");
  const sort = query.get("sort") ?? "recent";
  const rows = all.filter((r) => plain(`${r.eventName} ${r.location ?? ""}`).includes(q) && (!season || seasonOf(r.date) === season));
  if (sort === "place") rows.sort((x, y) => (x.placement ?? 99) - (y.placement ?? 99));
  if (sort === "points") rows.sort((x, y) => (y.total ?? 0) - (x.total ?? 0));
  const page = Math.max(1, Number(query.get("page") ?? 1));
  return {
    available: true, stale: state.stale === true, updatedAt: iso(FROZEN_TODAY), total: all.length,
    category: all.length ? { current: "Advanced Novice Girls", seasonLabel: "2026-2027", previous: { short: "Basic Novice", sinceYear: 2025 } } : null,
    records: { best: all.length ? 101.07 : null, podiums: all.length ? 12 : 0, wins: all.length ? 5 : 0 },
    seasons: ["2026-2027", "2025-2026", "2024-2025"], page, pageSize: 20, filtered: rows.length, rows: rows.slice((page - 1) * 20, page * 20),
  };
}

/** null: a result id that is not this athlete's (the route answers 404). */
export function competitionOf(id, state, resultId) {
  if (state.skateDown) return { available: false };
  const row = (SPORTIV_ATHLETES[id].performance ? allResults : []).find((r) => r.resultId === resultId);
  if (!row) return null;
  return {
    available: true, stale: state.stale === true, updatedAt: iso(FROZEN_TODAY), row, field: 18, best: 101.07, officialUrl: state.noOfficialUrl ? null : "https://results.example.invalid/cupa-2026",
    segments: [
      { name: "Program scurt", isShort: true, score: 34.1, tes: 18.2, pcs: 16.4, deductions: 0.5, elements: [{ name: "Piruetă", base: 3, score: 3.2 }, { name: "Salt dublu", base: 4.2, score: null }] },
      { name: "Program liber", isShort: false, score: 64.32, tes: 33.1, pcs: 31.7, deductions: 0, elements: [{ name: "Secvență de pași", base: 3.3, score: 3.5 }] },
    ],
  };
}

export function pathOf(id, state = {}) {
  const a = SPORTIV_ATHLETES[id];
  const rung = (threshold, tier, reachedOn) => ({ threshold, tier, reachedOn });
  return {
    now: state.noPathNow ? null : { groupName: a.groupName, since: "2026-09", location: a.level.location, program: `Marți și joi, 17:30, cu ${a.coach}` },
    next: { groupName: "Intermediari Silver" },
    before: [{ groupName: "Începători", from: "2025-09", to: "2026-06" }, { groupName: "Primii Pași", from: "2024-09", to: "2025-06" }],
    badges: [
      { key: "antrenamente", tier: "silver", label: "50 antrenamente", count: 63, next: 100, tiers: [rung(25, "bronze", "2026-03-10"), rung(50, "silver", "2026-09-22"), rung(100, "gold", null), rung(250, "platinum", null)] },
      { key: "sezon", tier: "bronze", label: "Sezon complet", count: 1, next: 2, tiers: [rung(1, "bronze", "2026-06-30"), rung(2, "silver", null), rung(3, "gold", null), rung(4, "platinum", null), rung(5, "ice", null)] },
      { key: "prima", tier: "bronze", label: "Prima lecție", count: 1, next: null, tiers: [rung(1, "bronze", "2024-09-12")] },
      { key: "concursuri", tier: null, label: "Concursuri", count: 0, next: 1, tiers: [rung(1, "bronze", null), rung(2, "silver", null), rung(5, "gold", null), rung(10, "platinum", null), rung(25, "ice", null)] },
    ],
  };
}

export function profileOf(id) {
  const a = SPORTIV_ATHLETES[id];
  return { name: a.name, birthDate: "2017-03-14", age: a.age, contactName: "Elena Ionescu", phone: "0722 000 222", email: "parinte1@example.invalid" };
}

/** Mesaje of an account: one automatic notice with two rows (a cancelled class, a moved one) and one hand-written. Ids are stable. */
export function noticesOf(email) {
  if (email !== "parinte1@example.invalid") return [];
  return [
    {
      id: "ntcauto0001", date: addDays(FROZEN_TODAY, 0), title: "Modificări în program", body: null,
      rows: [
        { date: addDays(FROZEN_TODAY, 2), text: "Ana: Intermediari Bronze, anulată", reason: "Vacanță" },
        { date: addDays(FROZEN_TODAY, 4), text: "Matei: Începători, mutată", reason: null },
      ],
    },
    { id: "ntchand0001", date: addDays(FROZEN_TODAY, -1), title: "Ședință cu părinții", body: "Vă așteptăm sâmbătă la ora 10.", rows: [] },
  ];
}
