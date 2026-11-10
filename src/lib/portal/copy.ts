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

/** The noun alone, for a screen that shows the number in its own element ("de ședințe" from 20 on). */
const noun = (n: number, one: string, many: string): string => count(n, one, many).slice(String(n).length + 1);

const children = (n: number): string => count(n, "copil", "copii");

export const NAV = { today: "Azi", groups: "Grupe", competitions: "Concursuri", history: "Istoric", profile: "Profil", menu: "Meniu" } as const;

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
  title: "Azi",
  todayHeading: "Antrenamente azi",
  calendarLink: "Calendar",
  statLabel: "antrenamente azi",
  doneOne: "completat",
  doneMany: "completate",
  pastHeading: "Antrenamente fără prezență",
  groupSub: (kids: string, location: string | null) => (location ? `grup, ${kids}, ${location}` : `grup, ${kids}`),
  minutes: (n: number) => `${n} min`,
  nowLabel: (weekdayDay: string, time: string) => `${weekdayDay}, ora ${time}`,
} as const;

export const CALENDAR = {
  title: "Calendar",
  sub: "Ședințele și lecțiile tale",
  prev: "Luna anterioară",
  next: "Luna următoare",
  legendGroup: "grup",
  legendIndividual: "individual",
  legendCancelled: "anulată",
  empty: "Nicio ședință în această zi.",
  grid: "Zilele lunii",
} as const;

export const GRUPE = {
  title: "Grupe",
  groupsCount: (n: number) => count(n, "grupă", "grupe"),
  others: "Alte grupe",
  line: (program: string, n: number) => [program, children(n)].filter((part) => part !== "").join(", "),
  coaches: (names: string) => `Antrenor: ${names}`,
  noNext: "Fără ședință programată",
  mine: "Grupele mele",
  sub: (groups: string, kids: string) => `${groups}, ${kids}`,
  coach: (names: string) => `Antrenor: ${names}`,
} as const;

export const GROUP = {
  members: "Sportivi",
  program: "Program:",
  place: "Loc:",
  coaches: "Antrenori:",
  edit: "Modifică grupa",
  tabAthletes: (n: number) => `Sportivi (${n})`,
  tabProgram: "Program",
  until: (dayMonth: string) => `până pe ${dayMonth}`,
  doPresence: "Fă prezența",
  membersCount: (n: number) => `Sportivi (${n})`,
  age: (n: number) => `${n} ani`,
  isNew: "nou",
  alsoIn: (names: string) => `și în ${names}`,
  addAthlete: "+ Adaugă sportiv",
  otherCoach: "Grupa altui antrenor",
  programLine: (program: string) => `Program: ${program}`,
  standIn: "Înlocuiesc azi",
  standInPresence: "Fă prezența ca înlocuitor",
} as const;

export const EDIT_GROUP = {
  title: "Modifică grupa",
  sub: (group: string, n: string) => `${group}, ${n}`,
  add: "+ Adaugă sportiv",
  done: "Gata",
  move: "Mută",
  remove: "Scoate",
  moveFor: (name: string) => `Mută ${name}`,
  removeFor: (name: string) => `Scoate ${name}`,
  moveTitle: (name: string) => `Muți pe ${name} în altă grupă`,
  moveText: (group: string) => `Prezențele de până acum rămân în ${group}.`,
  newGroup: "Grupa nouă",
  from: "Din data",
  cancel: "Renunță",
  moveConfirm: "Mută",
  removeTitle: (name: string) => `Scoți pe ${name} din grupă?`,
  removeText: "Prezențele de până acum rămân. Nu mai apare la ședințele grupei.",
  removeConfirm: "Scoate din grupă",
  noOtherGroup: "Nu ai altă grupă în care să-l muți.",
  pastDate: "Alege o dată de azi încolo.",
} as const;

export const PRESENCE = {
  coach: "Antrenor",
  coachSelf: (name: string) => `${name} (tu)`,
  addCoaches: "+ Adaugă alți antrenori",
  removeCoach: (name: string) => `Scoate ${name}`,
  athlete: "Sportiv",
  grup: "Grup",
  uscat: "Uscat",
  coachLabel: "Antrenor",
  you: (name: string) => `${name} (tu)`,
  headAthlete: "Sportiv",
  headGroup: "Grup",
  headDry: "Uscat",
  present: (n: string) => `${n} prezenți`,
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

export const CARD = {
  groups: "Grupe",
  school: "Școala",
  contact: "Contact",
  call: "Sună",
  parent: "Părinte",
  copy: "Copiază numărul",
  copied: "Numărul a fost copiat.",
  copyFailed: "Nu am putut copia numărul.",
  whatsapp: "WhatsApp",
  presence: "Prezențe",
  inSeason: "În sezon",
  presences: (n: number) => count(n, "prezență", "prezențe"),
  lessons: "Lecții individuale",
  lessonsValue: (n: number) => `${n} în sezon`,
  last: "Ultima",
  missed: "Lipsă luna asta",
  competitions: "Concursuri",
  all: "Toate",
  category: (season: string) => `Categoria ${season}`,
  count: "concursuri",
  podiums: "podiumuri",
  abonament: "Abonament",
  validUntil: "Valabil până la",
  location: "Locație",
  session: (next: number, slots: number) => `Ședința ${next}/${slots}`,
  ageSection: (age: string, section: string | null) => (section ? `${age}, ${section}` : age),
} as const;

export const COMPETITIONS = {
  title: "Concursuri",
  sub: "Rezultatele sportivilor clubului",
  all: "Toți sportivii",
  mine: "Grupele mele",
  season: "Sezon",
  athletes: "sportivi",
  place: "Loc",
  points: "puncte",
  unavailable: "Rezultatele nu sunt disponibile acum.",
  empty: "Niciun rezultat în acest sezon.",
  filter: "Sportivi",
} as const;

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
  title: "Istoric",
  statLabel: (n: number, month: string) => `${noun(n, "ședință de grup", "ședințe de grup")} în ${month}`,
  lessons: (n: number) => noun(n, "lecție individuală", "lecții individuale"),
  /** `hours` is the formatted amount ("1", "2,8"): a whole number agrees, a fraction takes "ore". */
  hours: (hours: string) => {
    const n = Number(String(hours).replace(",", "."));
    return Number.isInteger(n) ? noun(n, "oră", "ore") : "ore";
  },
  presentSub: (n: number) => `grup, ${count(n, "prezent", "prezenți")}`,
  standInSub: (n: number) => `înlocuitor, ${count(n, "prezent", "prezenți")}`,
  notDoneSub: "grup, fără prezență",
} as const;

export const PROFILE = {
  role: "Antrenor",
  settings: "Setări cont",
  security: "Securitate",
  settingsSub: "nume, e-mail, telefon, parolă",
  securitySub: "dispozitive conectate",
  logout: "Ieși din cont",
} as const;

export const SETTINGS = {
  account: "Cont",
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

