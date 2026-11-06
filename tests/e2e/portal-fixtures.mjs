// Synthetic data for the mock portal (tests/e2e/mock-portal.mjs). Invented names and
// example.invalid addresses only; dates are computed from the run day.
export const SECRET = "test-bff-secret-000000000000000000";
export const SEED_DEVICE_KEY = "seed-device-key-current";
export const OTHER_DEVICE_KEY = "seed-device-key-phone";
export const INVITE_VALID = "inv-valid-0000000000000000000000";
export const INVITE_OLD = "inv-old-00000000000000000000000000";
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
    "g-avansati": { id: "g-avansati", name: "Avansați", kind: "club", own: true, coaches: ["Andrei Popa"], days: [2, 3], start: "18:15", dur: 60, program: ["Ma, Mi 18:15"], programPublic: true, eventId: "ev-avansati" },
    "g-primii": { id: "g-primii", name: "Primii Pași", kind: "school", own: true, coaches: ["Andrei Popa"], days: [6, 0], start: "10:00", dur: 50, program: ["Sâ, Du 10:00"], programPublic: null, eventId: "ev-primii" },
    "g-silver": { id: "g-silver", name: "Intermediari Silver", kind: "school", own: false, coaches: ["Bianca Ene"], days: [6, 0], start: "10:00", dur: 50, program: ["Sâ, Du 10:00"], programPublic: null, eventId: "ev-silver" },
    "g-uscat": { id: "g-uscat", name: "Uscat Juniori", kind: "club", own: false, coaches: ["Bianca Ene"], days: [1, 4], start: "17:00", dur: 60, program: ["Lu, Jo 17:00"], programPublic: false, eventId: "ev-uscat" },
  };
  const members = {
    "g-avansati": [
      person("a-maria", "Maria Ionescu", 11), person("a-luca", "Luca Dumitru", 10), person("a-ana", "Ana Stoica", 12),
      person("a-matei", "Matei Radu", 9), person("a-elena", "Elena Barbu", 13), person("a-david", "David Marin", 10),
      person("a-sofia", "Sofia Nistor", 11), person("a-tudor", "Tudor Pavel", 8, { isNew: true }),
      person("a-ioana", "Ioana Diaconu", 12, { alsoIn: ["Uscat Juniori"] }),
    ],
    "g-primii": [person("a-paul", "Paul Enache", 6), person("a-sara", "Sara Voicu", 7), person("a-eric", "Eric Mocanu", 6), person("a-lia", "Lia Tănase", 7)],
    "g-silver": [person("a-dara", "Dara Constantin", 9), person("a-vlad", "Vlad Ene", 10)],
    "g-uscat": [person("a-ioana", "Ioana Diaconu", 12)],
  };
  // The member list shows the 9 active children; the inactive child only appears on the presence sheet.
  const inactive = { "g-avansati": [person("a-inactive", "Robert Toma", 14, { inactive: true })] };
  const standIn3 = addDays(today, -3);
  const saved = {
    [`occ:g-avansati:${today}`]: { sessionId: "s-today", groupId: "g-avansati", date: today, startTime: "18:15", durationMin: 60, ticks: ["a-maria", "a-luca", "a-ana", "a-matei", "a-elena", "a-david", "a-sofia"], coachIds: ["tm-andrei"] },
    [`occ:g-avansati:${addDays(today, -9)}`]: { sessionId: "s-archived", groupId: "g-avansati", date: addDays(today, -9), startTime: "18:15", durationMin: 60, ticks: ["a-maria", "a-luca"], coachIds: ["tm-andrei"] },
    [`occ:g-silver:${standIn3}`]: { sessionId: "s-standin", groupId: "g-silver", date: standIn3, startTime: "10:00", durationMin: 50, ticks: ["a-dara"], coachIds: ["tm-andrei"] },
  };
  const lessons = {
    "l-done": { lessonId: "l-done", athleteId: "a-matei", athleteName: "Matei Radu", date: today, startTime: "15:00", durationMin: 50, coachIds: ["tm-andrei"], state: "saved", present: true },
    "l-plan": { lessonId: "l-plan", athleteId: "a-ana", athleteName: "Ana Stoica", date: today, startTime: "17:00", durationMin: 60, coachIds: ["tm-andrei"], state: "planned", present: null },
  };
  const devices = [
    { id: "dev-1", key: SEED_DEVICE_KEY, label: "Chrome pe Windows", lastSeenAt: new Date().toISOString() },
    { id: "dev-2", key: OTHER_DEVICE_KEY, label: "Safari pe iPhone", lastSeenAt: new Date(Date.now() - 5 * 86_400_000).toISOString() },
  ];
  const pool = [person("a-pool-1", "Teodora Anghel", 9), person("a-pool-2", "Rareș Cojocaru", 11), person("a-pool-3", "Irina Munteanu", 8)];
  return { accounts, groups, members, inactive, saved, lessons, devices, pool, coachOptions: COACH_OPTIONS, counters: { athlete: 0, lesson: 0, event: 0 } };
}
