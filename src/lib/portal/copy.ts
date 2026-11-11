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

export const NOT_FOUND = { title: "Pagina nu există", text: "Adresa nu duce nicăieri. Poate a fost mutată sau scrisă greșit.", back: "Înapoi la Azi" } as const;

export const AZI = {
  greeting: (firstName: string) => `Bună, ${firstName}`,
  groups: "Grupe",
  lessons: "Lecții individuale",
  todo: "De făcut",
  done: "Completat",
  addTraining: "+ Adaugă antrenament",
  none: "Nicio ședință azi.",
  groupLine: (n: number) => `grup, ${children(n)}`,
  lessonLine: (min: string) => `individuală, ${min}`,
  title: "Azi",
  todayHeading: "Antrenamente azi",
  calendarLink: "Calendar",
  statLabel: "antrenamente azi",
  doneOne: "completat",
  doneMany: "completate",
  pastHeading: "Prezență de completat",
  summaryHeading: "Azi pe scurt",
  nextHeading: "Următorul antrenament",
  weekHeading: "Săptămâna aceasta",
  weekGroups: "Ședințe de grup",
  weekLessons: "Lecții individuale",
  weekMissing: "Prezență necompletată",
  weekCount: (held: number, left: number) => `${held} ${held === 1 ? "ținută" : "ținute"}, ${left} ${left === 1 ? "rămasă" : "rămase"}`,
  groupSub: (kids: string, location: string | null) => (location ? `grup, ${kids}, ${location}` : `grup, ${kids}`),
  minutes: (n: number) => `${n} min`,
  nowLabel: (weekdayDay: string, time: string) => `${weekdayDay}, ora ${time}`,
} as const;

const WEEK_WORD = { first: "prima", second: "a doua", third: "a treia", fourth: "a patra", last: "ultima" } as const;

export const CLUB_TODAY = {
  button: "Toate antrenamentele de azi din club",
  title: "Antrenamentele clubului azi",
  hint: (day: string) => `${day}. Atinge o grupă ca să vezi copiii sau să faci prezența ca înlocuitor.`,
  lesson: "Lecție individuală",
  you: (name: string) => `${name} (tu)`,
  none: "Azi nu are loc niciun antrenament în club.",
  close: "Închide",
} as const;

export const TRAINING = {
  title: "Antrenament nou",
  close: "Închide",
  editTitle: "Modifică lecția",
  group: "Grup",
  individual: "Individual",
  groupField: "Grupa",
  athlete: "Sportiv",
  repeat: "Se repetă",
  once: "Nu se repetă",
  weekly: "Săptămânal",
  biweekly: "La 2 săptămâni",
  monthly: "Lunar",
  days: "Zile",
  date: "Data",
  time: "Ora",
  duration: "Durată",
  from: "Din data",
  until: "Până la",
  seasonEnd: "Sfârșitul sezonului",
  untilDate: "Alege data",
  untilDateField: "Data de sfârșit",
  coach: "Antrenor",
  submit: "Adaugă",
  save: "Salvează",
  scopeTitle: "Ce schimbi?",
  scopeDeleteTitle: (date: string) => `Ce ștergi din lecția din ${date}?`,
  scopeOneSub: (date: string) => `Doar lecția din ${date}.`,
  scopeFollowingSub: (date: string) => `Lecțiile din ${date} până la sfârșitul seriei.`,
  scopeFollowingDeleteSub: (date: string) => `Lecțiile din ${date} până la sfârșitul seriei. Cele ținute sau plătite rămân.`,
  scopeFollowingEndsSub: (date: string) => `Lecțiile din ${date} se șterg, rămâne doar aceasta, fără repetare.`,
  scopeOne: "Doar această lecție",
  scopeFollowing: "Și lecțiile următoare",
  noGroup: "Nu ai o grupă de club.",
  weekWord: WEEK_WORD,
  // Summary builders: `lead` is "" or "La 2 săptămâni, " (the days follow in lowercase).
  summaryOnce: (when: string, time: string) => `${when}, ${time}, o singură dată.`,
  summarySeries: (lead: string, days: string, time: string, min: number, from: string, until: string | null) =>
    `${lead}${days}, ${time}, ${min} min, din ${from} ${until ? `până pe ${until}` : "până la sfârșitul sezonului"}.`,
  // Lunar, variant A (user 2026-11-10): "Lunar, în a doua marți a lunii, 17:30, 60 min, din 11 noiembrie până la sfârșitul sezonului."
  summaryMonthly: (week: string, days: string, time: string, min: number, from: string, until: string | null) =>
    `Lunar, în ${week} ${days} a lunii, ${time}, ${min} min, din ${from} ${until ? `până pe ${until}` : "până la sfârșitul sezonului"}.`,
  monthlyNote: (day: string, nth: string) => `Săptămâna din lună se ia din "Din data": ${day} este ${nth}.`,
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
  nextTooltip: "Următorul antrenament",
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
  otherCoach: "Grupa altui antrenor. Poți ține antrenamentul de azi ca înlocuitor.",
  programLine: (program: string) => `Program: ${program}`,
  standIn: (time: string | null) => (time ? `Înlocuiesc azi, ${time}` : "Înlocuiesc azi"),
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
  completed: (n: number) => `Completat, ${count(n, "prezent", "prezenți")}`,
  save: "Salvează",
  willAppear: "Vei apărea ca antrenor la această ședință.",
  archived: "Arhivată. Nu mai poate fi modificată.",
  future: "Prezența se poate face din ziua antrenamentului.",
  outside: "În afara programului",
  noSubscription: "Fără abonament",
  reactivate: {
    title: "Sportiv inactiv",
    text: (name: string) => `${name} are statusul Inactiv. Reactivezi sportivul?`,
    keep: "Salvează fără",
    reactivate: "Reactivează și salvează",
  },
} as const;

export const LESSON = {
  title: "Lecție individuală",
  date: "Data",
  time: "Ora",
  ok: "OK",
  coach: "Antrenor",
  present: "Prezent",
  savePresence: "Salvează prezența",
  delete: "Șterge lecția",
  deleteConfirm: (date: string) => `Ștergi lecția din ${date}?`,
  repeat: "Se repetă",
  no: "Nu",
  edit: "Modifică lecția",
  when: (time: string, min: number) => `${time}, ${min} min`,
  seriesText: (freq: string, days: string, until: string | null) => (until ? `${freq}, ${days}, până pe ${until}` : `${freq}, ${days}, până la sfârșitul sezonului`),
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
  days: "Zile",
  dayLetters: { mon: "Lu", tue: "Ma", wed: "Mi", thu: "Jo", fri: "Vi", sat: "Sâ", sun: "Du" },
  appliesFrom: "Se aplică din",
  change: "Schimbă",
  drawerChange: "Schimbă programul",
  note: "Notă",
  endProgram: "Șterge programul",
  thisDate: "Această dată",
  cancel: "Anulează",
  move: "Mută",
  newDate: "Data nouă",
  breakNotice: (name: string) => `Pauză: ${name}.`,
  cancelled: "Anulată",
  nothingThisMonth: "Nimic programat în această lună.",
  publicLabel: "Arată programul pe site",
  publicHint: "Programul este public, îl vede oricine pe site.",
  weeklyHeading: "Program săptămânal",
  freqWord: { weekly: "săptămânal", biweekly: "la 2 săptămâni", monthly: "lunar" },
  changeLabel: (weekday: string) => `Schimbă programul de ${weekday}`,
  endLabel: (weekday: string) => `Șterge programul de ${weekday}`,
  nextHeading: "Următoarele date",
  showingNext: (n: number) => `Se arată următoarele ${n} date`,
  seeAll: "Vezi toate",
  monthlyRule: (week: string, weekday: string) => `lunar, în ${week} ${weekday} a lunii`,
  ruleTitle: (weekday: string, time: string) => `${weekday}, ${time}`,
  ruleSub: (min: number, freq: string, from: string, until: string | null) => (until ? `${min} min, ${freq}, din ${from}, până pe ${until}` : `${min} min, ${freq}, din ${from}`),
  movedFromSub: (when: string) => `mutată din ${when}`,
  moved: "Mutată",
  dateOnly: "Schimbi doar această dată. Programul săptămânal rămâne.",
  cancelSub: "Părinții văd data anulată și nota.",
  moveSub: "Alegi altă zi sau oră pentru această dată.",
  remove: "Șterge",
  removeSub: "Data dispare din program, fără notă.",
  giveUp: "Renunță",
  keepChoice: "Se ține",
  keepSub: "Data revine în program cum era.",
  endFrom: "Din data",
  changeSub: (rule: string) => `${rule}. Datele de dinainte rămân cum au fost.`,
  endTitle: (weekday: string) => `Ștergi programul de ${weekday}?`,
  endText: "Ședințele și prezențele de până atunci rămân. După data aleasă nu mai apare.",
  schoolLocked: "Programul Școlii îl schimbă administratorul.",
  save: "Salvează",
  toasts: {
    programAdded: "Program adăugat.",
    classAdded: (day: string) => `Ședință adăugată: ${day}.`,
    programChanged: "Program schimbat.",
    programEnded: "Program șters.",
    classDeleted: "Ședință ștearsă.",
    dateCancelled: (day: string) => `Ședința din ${day} a fost anulată.`,
    dateMoved: (day: string) => `Ședința din ${day} a fost mutată.`,
    dateKept: (day: string) => `Ședința din ${day} se ține.`,
    dateRemoved: (day: string) => `Ședința din ${day} a fost ștearsă.`,
  },
} as const;

/** Long lists: Azi shows a few rows and a link, Istoric and Concursuri show a page and a button. */
export const LIST = {
  azi: 5,
  page: 20,
  seeAll: (n: number) => `Vezi toate (${n})`,
  showMore: "Arată mai multe",
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
  notDoneSub: "grup, prezență necompletată",
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

