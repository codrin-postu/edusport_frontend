// Every string of the coach app (spec 9 and 5, approved 2026-11-06). Romanian, terse.
// No em or en dash, no middle dot, straight quotes, "E-mail" not "Email", no emoji.
// Values go in through functions; counts agree through `count`.

/**
 * Local copy of `roCount` (src/lib/ro-plural.ts): this module is loaded by Node
 * tests, which cannot resolve an extensionless relative import.
 */
function count(n: number, one: string, many: string): string {
  if (n === 1) return `1 ${one}`;
  const mod100 = n % 100;
  if (mod100 >= 20 || (n >= 100 && mod100 === 0)) return `${n} de ${many}`;
  return `${n} ${many}`;
}

export { PORTAL_LABEL, LOGIN, EYE, INVITE, RESET, STATES, A11Y, KIT } from "./copy-shared.ts";
export type { AuthCopy } from "./copy-shared.ts";
import { LOGIN, RESET, INVITE, type AuthCopy } from "./copy-shared.ts";

/** The coach portal's sign-in copy. */
export const COACH_AUTH: AuthCopy = { login: LOGIN, reset: RESET, invite: INVITE };

const children = (n: number): string => count(n, "copil", "copii");

export const NAV = { today: "Azi", groups: "Grupe", history: "Istoric", profile: "Profil" } as const;

export const AZI = {
  greeting: (firstName: string) => `Bună, ${firstName}`,
  groups: "Grupe",
  lessons: "Lecții individuale",
  todo: "De făcut",
  done: "Completat",
  addLesson: "+ Lecție individuală",
  none: "Nicio ședință azi.",
  groupLine: (n: number) => `grup, ${children(n)}`,
  lessonLine: (min: string) => `individuală, ${min}`,
  todoLine: (date: string) => `grup, ${date}`,
} as const;

export const GRUPE = {
  title: "Grupele mele",
  others: "Alte grupe",
  line: (program: string, n: number) => `${program}, ${children(n)}`,
  coaches: (names: string) => `Antrenor: ${names}`,
} as const;

export const GROUP = {
  members: "Sportivi",
  program: "Program",
  coaches: (names: string) => `Antrenori: ${names}`,
  doPresence: "Fă prezența",
  membersCount: (n: number) => `Sportivi (${n})`,
  age: (n: number) => `${n} ani`,
  isNew: "nou",
  alsoIn: (group: string) => `și în ${group}`,
  addAthlete: "+ Adaugă sportiv",
  otherCoach: "Grupa altui antrenor",
  programLine: (program: string) => `Program: ${program}`,
  standIn: "Înlocuiesc azi",
  standInPresence: "Fă prezența ca înlocuitor",
} as const;

export const PRESENCE = {
  coach: "Antrenor",
  coachSelf: (name: string) => `${name} (tu)`,
  addCoaches: "+ Adaugă alți antrenori",
  removeCoach: (name: string) => `Scoate ${name}`,
  athlete: "Sportiv",
  grup: "Grup",
  uscat: "Uscat",
  presentCount: (n: number) => count(n, "prezent", "prezenți"),
  save: "Salvează",
  pickDay: "Alege ziua pentru care faci prezența.",
  hasSaved: "are prezență salvată",
  pick: (day: string) => `Alege ${day}`,
  willAppear: "Vei apărea ca antrenor la această ședință.",
  archived: "Arhivată. Nu mai poate fi modificată.",
  outside: "În afara programului",
  noSubscription: "Fără abonament",
  existing: {
    title: "Există deja o ședință salvată",
    open: "Deschide prezența salvată",
    addAnother: "Adaugă încă o ședință în ziua asta",
    savedBy: (name: string) => `Salvată de ${name}`,
  },
  reactivate: {
    title: "Sportiv inactiv",
    text: (name: string) => `${name} are statusul Inactiv. Reactivezi sportivul?`,
    keep: "Salvează fără",
    reactivate: "Reactivează și salvează",
  },
} as const;

export const LESSON = {
  title: "Lecție individuală",
  athlete: "Sportiv",
  date: "Data",
  time: "Ora",
  duration: "Durată",
  hours: "Ore",
  minutes: "Minute",
  ok: "OK",
  coach: "Antrenor",
  present: "Prezent",
  save: "Salvează lecția",
  savePresence: "Salvează prezența",
  delete: "Șterge lecția",
  deleteConfirm: (date: string) => `Ștergi lecția din ${date}?`,
  giveUp: "Renunță",
} as const;

export const ADD_ATHLETE = {
  title: (group: string) => `Adaugă în ${group}`,
  search: "Caută după nume",
  row: (name: string, age: number) => `${name}, ${age} ani`,
  notListed: "Nu e în listă: sportiv nou",
  from: "Din data",
  submit: (n: number) => `Adaugă ${count(n, "sportiv", "sportivi")}`,
} as const;

export const NEW_ATHLETE = {
  title: "Sportiv nou",
  name: "Nume și prenume",
  birthDate: "Data nașterii",
  datePlaceholder: "zz.ll.aaaa",
  parent: "Părinte",
  phone: "Telefon",
  email: "E-mail",
  optional: "opțional",
  submit: (group: string) => `Adaugă în ${group}`,
} as const;

export const CARD = { groups: "Grupe", school: "Școala", contact: "Contact", call: "Sună" } as const;

export const PROGRAM = {
  list: "Listă",
  month: "Lună",
  add: "+ Adaugă program",
  repeat: "Se repetă",
  howOften: "Cât de des",
  weekly: "Săptămânal",
  biweekly: "La 2 săptămâni",
  monthly: "Lunar",
  weekOfMonth: "Săptămâna din lună",
  weekFirst: "Prima",
  weekSecond: "A doua",
  weekThird: "A treia",
  weekFourth: "A patra",
  weekLast: "Ultima",
  days: "Zile",
  dayLetters: { mon: "Lu", tue: "Ma", wed: "Mi", thu: "Jo", fri: "Vi", sat: "Sâ", sun: "Du" },
  startAt: "De la",
  duration: "Durată",
  appliesFrom: "Se aplică din",
  change: "Schimbă",
  drawerNew: "Program nou",
  drawerChange: "Schimbă programul",
  date: "Data",
  note: "Notă",
  endProgram: "Șterge programul",
  endConfirm: (date: string) => `Ștergi programul din ${date}? Datele de dinainte rămân.`,
  thisDate: "Această dată",
  keep: "Ține",
  cancel: "Anulează",
  move: "Mută",
  newDate: "Data nouă",
  reason: "Motiv",
  notify: "Anunță părinții pe e-mail",
  deleteClass: "Șterge ședința",
  deleteClassConfirm: (date: string) => `Ștergi ședința din ${date}?`,
  breakNotice: (name: string) => `Pauză: ${name}.`,
  cancelled: "Anulată",
  movedFrom: (what: string) => `Mutată de la ${what}`,
  nothingThisMonth: "Nimic programat în această lună.",
  publicTitle: "Program public",
  publicHint: "Programul apare în calendarul de pe site.",
  past: "trecut",
  schoolLocked: "Programul Școlii îl schimbă administratorul.",
  save: "Salvează",
  noDays: "Alege cel puțin o zi.",
  toasts: {
    programAdded: "Program adăugat.",
    classAdded: (day: string) => `Ședință adăugată: ${day}.`,
    programChanged: "Program schimbat.",
    programEnded: "Program șters.",
    classDeleted: "Ședință ștearsă.",
    dateCancelled: (day: string) => `Ședința din ${day} a fost anulată.`,
    dateMoved: (day: string) => `Ședința din ${day} a fost mutată.`,
    dateKept: (day: string) => `Ședința din ${day} se ține.`,
  },
} as const;

export const HISTORY = {
  summary: (sessions: number, lessons: number, hours: string) =>
    `${count(sessions, "ședință de grup", "ședințe de grup")}, ${count(lessons, "lecție individuală", "lecții individuale")}, ${hours} ore`,
  group: (present: number) => `grup, ${count(present, "prezent", "prezenți")}`,
  lesson: (min: string) => `individuală, ${min}`,
  standIn: (present: number) => `înlocuitor, ${count(present, "prezent", "prezenți")}`,
} as const;

export const PROFILE = {
  role: "Antrenor",
  settings: "Setări cont",
  security: "Securitate",
  logout: "Ieși din cont",
} as const;

export const SETTINGS = {
  name: "Nume",
  email: "E-mail",
  adminNote: "Numele și e-mailul le schimbă administratorul. După schimbarea e-mailului, intri cu adresa nouă.",
  phone: "Telefon",
  changePassword: "Schimbă parola",
  currentPassword: "Parola actuală",
  newPassword: "Parola nouă",
  save: "Salvează",
  setPassword: "Setează o parolă",
} as const;

export const SECURITY = { device: "Dispozitiv", lastSeen: "Ultima dată", current: "acesta", signOut: "Deconectează", unknown: "Dispozitiv necunoscut" } as const;

