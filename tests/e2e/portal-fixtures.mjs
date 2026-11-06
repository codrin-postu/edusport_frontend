// Synthetic data for the mock portal (tests/e2e/mock-portal.mjs). Invented names and
// example.invalid addresses only; dates are computed from the run day.
export const SECRET = "test-bff-secret-000000000000000000";
export const SEED_DEVICE_KEY = "seed-device-key-current";
export const OTHER_DEVICE_KEY = "seed-device-key-phone";
export const INVITE_VALID = "inv-valid-0000000000000000000000";
export const INVITE_OLD = "inv-old-00000000000000000000000000";
// The mock's "today": a Thursday, so Uscat Juniori (Mon, Thu) has a class today and Intermediari Silver (Sat, Sun) has none.
// The browser clock is frozen to the same day (portal-helpers freezeToday).
export const FROZEN_TODAY = "2026-11-05";
export const RESET_CODE = "123456";
export const COACH_PASSWORD = "Throwaway-Coach-1";

const pad = (n) => String(n).padStart(2, "0");
export const ymd = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export function addDays(date, n) {
  const [y, m, d] = date.split("-").map(Number);
  return ymd(new Date(y, m - 1, d + n));
}
export const weekdayOf = (date) => {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(y, m - 1, d).getDay();
};

const COACH_OPTIONS = [
  { id: "tm-andrei", name: "Andrei Popa" },
  { id: "tm-bianca", name: "Bianca Ene" },
  { id: "tm-radu", name: "Radu Matei" },
];

const person = (id, name, age, extra = {}) => ({ athleteId: id, name, age, isNew: false, alsoIn: [], inactive: false, ...extra });

export function buildWorld(today) {
  const accounts = {
    "antrenor1@example.invalid": { coachId: "tm-andrei", name: "Andrei Popa", firstName: "Andrei", initials: "AP", phone: "0722 000 111", password: COACH_PASSWORD, google: false },
    "antrenor2@example.invalid": { coachId: "tm-radu", name: "Radu Matei", firstName: "Radu", initials: "RM", phone: null, password: null, google: false },
    "antrenor3@example.invalid": { coachId: "tm-cezar", name: "Cezar Lungu", firstName: "Cezar", initials: "CL", phone: null, password: null, google: true },
  };
  const groups = {
    "gavansati": { id: "gavansati", name: "Avansați", kind: "club", own: true, coaches: ["Andrei Popa"], days: [2, 3], start: "18:15", dur: 60, program: ["Ma, Mi 18:15"], programPublic: true, eventId: "evavansati" },
    "gprimii": { id: "gprimii", name: "Primii Pași", kind: "school", own: true, coaches: ["Andrei Popa"], days: [6, 0], start: "10:00", dur: 50, program: ["Sâ, Du 10:00"], programPublic: null, eventId: "evprimii" },
    "gsilver": { id: "gsilver", name: "Intermediari Silver", kind: "school", own: false, coaches: ["Bianca Ene"], days: [6, 0], start: "10:00", dur: 50, program: ["Sâ, Du 10:00"], programPublic: null, eventId: "evsilver" },
    "guscat": { id: "guscat", name: "Uscat Juniori", kind: "club", own: false, coaches: ["Bianca Ene"], days: [1, 4], start: "17:00", dur: 60, program: ["Lu, Jo 17:00"], programPublic: false, eventId: "evuscat" },
  };
  const members = {
    "gavansati": [
      person("amaria", "Maria Ionescu", 11), person("aluca", "Luca Dumitru", 10), person("aana", "Ana Stoica", 12),
      person("amatei", "Matei Radu", 9), person("aelena", "Elena Barbu", 13), person("adavid", "David Marin", 10),
      person("asofia", "Sofia Nistor", 11), person("atudor", "Tudor Pavel", 8, { isNew: true }),
      person("aioana", "Ioana Diaconu", 12, { alsoIn: ["Uscat Juniori"] }),
    ],
    "gprimii": [person("apaul", "Paul Enache", 6), person("asara", "Sara Voicu", 7), person("aeric", "Eric Mocanu", 6), person("alia", "Lia Tănase", 7)],
    "gsilver": [person("adara", "Dara Constantin", 9), person("avlad", "Vlad Ene", 10)],
    "guscat": [person("aioana", "Ioana Diaconu", 12)],
  };
  // The member list shows the 9 active children; the inactive child only appears on the presence sheet.
  const inactive = { "gavansati": [person("ainactive", "Robert Toma", 14, { inactive: true })], "gprimii": [person("ainactive2", "Dan Preda", 7, { inactive: true })] };
  const standIn3 = addDays(today, -3);
  const saved = {
    [`occ:gavansati:${today}`]: { sessionId: "s-today", groupId: "gavansati", date: today, startTime: "18:15", durationMin: 60, ticks: ["amaria", "aluca", "aana", "amatei", "aelena", "adavid", "asofia"], coachIds: ["tm-andrei"] },
    [`occ:gavansati:${addDays(today, -9)}`]: { sessionId: "s-archived", groupId: "gavansati", date: addDays(today, -9), startTime: "18:15", durationMin: 60, ticks: ["amaria", "aluca"], coachIds: ["tm-andrei"] },
    [`occ:gsilver:${standIn3}`]: { sessionId: "s-standin", groupId: "gsilver", date: standIn3, startTime: "10:00", durationMin: 50, ticks: ["adara"], coachIds: ["tm-andrei"] },
  };
  const lessons = {
    "ldone": { lessonId: "ldone", athleteId: "amatei", athleteName: "Matei Radu", date: today, startTime: "15:00", durationMin: 50, coachIds: ["tm-andrei"], state: "saved", present: true },
    "larchived": { lessonId: "larchived", athleteId: "aana", athleteName: "Ana Stoica", date: addDays(today, -9), startTime: "16:00", durationMin: 50, coachIds: ["tm-andrei"], state: "saved", present: true },
    "lplan": { lessonId: "lplan", athleteId: "aana", athleteName: "Ana Stoica", date: today, startTime: "17:00", durationMin: 60, coachIds: ["tm-andrei"], state: "planned", present: null },
  };
  const devices = [
    { id: "dev1", key: SEED_DEVICE_KEY, label: "Chrome pe Windows", lastSeenAt: new Date().toISOString() },
    { id: "dev2", key: OTHER_DEVICE_KEY, label: "Safari pe iPhone", lastSeenAt: new Date(Date.now() - 5 * 86_400_000).toISOString() },
  ];
  const pool = [person("apool1", "Teodora Anghel", 9), person("apool2", "Rareș Cojocaru", 11), person("apool3", "Irina Munteanu", 8), person("apool4", "Ana Bălan", 9), person("apool5", "Diana Ilie", 10)];
  return { accounts, groups, members, inactive, saved, lessons, devices, pool, coachOptions: COACH_OPTIONS, counters: { athlete: 0, lesson: 0, event: 0 } };
}
