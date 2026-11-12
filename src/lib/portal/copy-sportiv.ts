// Every string of the sportiv app quoted in the phase 7 plans. Romanian, terse.
// No em or en dash, no middle dot, straight quotes, "E-mail" not "Email", no emoji.
// Values go in through functions; counts agree through `roCount` (src/lib/ro-plural.ts).

import { LOGIN, RESET, INVITE, type AuthCopy } from "./copy-shared.ts";

/** The sportiv sign-in copy: the coach strings shared by the login, reset and invite forms; the invite heading is "Bine ai venit". */
export const SPORTIV_AUTH: AuthCopy = { login: LOGIN, reset: RESET, invite: { ...INVITE, title: "Bine ai venit" } };

/** Bottom nav and sidebar labels (`sportivNav`). */
export const NAV_SPORTIV = {
  home: "Acasă",
  history: "Istoric",
  competitions: "Concursuri",
  path: "Parcurs",
  money: "Plăți",
} as const;

/** Shown on Concursuri, the competition detail and the Acasă card when the results are not available. */
export const COMP_DOWN = "Rezultatele nu sunt disponibile acum.";

/** Toast after a 403 `ClubAdminError`; the athlete leaves the menu. */
export const LOST_ATHLETE = "Nu mai ai acces la acest sportiv.";

/** Shown in place of the athlete's status line when the athlete is inactive. */
export const INACTIVE = "Sportiv inactiv.";

/** Picker (`/`), account sheet and sidebar account menu. */
export const ACCOUNT = {
  picker: { title: "Sportivi", sub: "Alege sportivul.", empty: "Niciun sportiv în cont." },
  sheet: { title: "Alege sportivul", list: "Sportivi în cont", settings: "Setări", logout: "Ieșire" },
  menu: { settingsAccount: "Setări cont", logout: "Ieși din cont" },
  row: (group: string, age: number | null) => (age === null ? group : `${group}, ${age} ani`),
} as const;

/** Acasă, with the performance variant and the promotion moment. */
export const HOME = {
  greeting: (firstName: string) => `Bună, ${firstName}`,
  presences: "prezențe în sezon",
  months: "Prezențe pe lună",
  upcoming: "Următoarele ședințe",
  noUpcoming: "Nicio ședință programată.",
  calendarLink: "Calendar ›",
  abonament: { details: "Detalii ›", session: (next: number, slots: number) => `Ședința ${next}/${slots}`, validUntil: (date: string) => `valabil până la ${date}` },
  lastCompetition: { title: "Ultimul concurs", place: "Locul", all: "Toate ›", field: (category: string, place: number, field: number) => `${category}, ${place} din ${field}`, total: "Total", stale: (date: string) => `Rezultatele pot fi mai vechi. Actualizate ${date}.` },
  promotion: { title: "Nivel nou", text: (firstName: string) => `Felicitări, ${firstName}! Ai trecut la nivelul următor.`, done: "Mai departe" },
} as const;

/** Istoric prezență. */
export const HISTORY = {
  title: "Istoric prezență",
  sub: (name: string, season: string) => `${name}, sezonul ${season}`,
  group: "grup",
  individual: "individuale",
  kindGroup: "Grup",
  kindLesson: "Individual",
  lesson: "Lecție",
  coachedBy: (names: string) => `cu ${names}`,
  empty: "Nicio prezență în acest sezon.",
  presences: (n: number) => (n === 1 ? "prezență" : "prezențe"),
} as const;

/** The page controls under a server paged list (`Pager`). */
export const PAGER = { prev: "Înapoi", next: "Înainte" } as const;

/** The sportiv BFF answer for a route it does not proxy. */
export const API_NOT_FOUND = "Nu a fost găsit.";

/** Calendar. */
export const CAL = {
  title: "Calendar",
  sub: (name: string) => `${name}, doar ședințele proprii`,
  prevMonth: "Luna trecută",
  nextMonth: "Luna viitoare",
  legend: { grup: "grupă", individual: "individual", concurs: "concurs", anulata: "anulată" },
  addToPhone: "Adaugă în calendarul telefonului",
  emptyDay: "Nicio ședință în această zi.",
} as const;

/** Session rows (`SessionRow`) on Acasă and the calendar day list. */
export const SESSION = {
  group: "Grup",
  lesson: "Individual",
  competition: "Concurs",
  cancelled: "anulată",
  coaches: (names: string) => `Antrenor: ${names}`,
  time: (start: string, end: string) => `Ora: ${start} - ${end}`,
  place: (location: string) => `Loc: ${location}`,
} as const;

/** Parcurs and badges. */
export const PATH = {
  title: "Parcurs",
  sub: (name: string, school: string) => `${name}, ${school}`,
  now: { title: "Nivelul tău acum", since: (date: string, location: string | null) => (location === null ? `din ${date}` : `din ${date}, ${location}`) },
  next: { title: "Următorul nivel", hint: "Antrenorul decide când treci mai departe." },
  before: { title: "Până acum", range: (from: string, to: string) => `${from} - ${to}` },
  badges: { title: "Realizări" },
  dialog: { close: "Închide", notYet: "încă nu", progress: (count: number, next: number) => `${count} din ${next}` },
} as const;

/** Concursuri and one competition. */
export const COMP = {
  title: "Concursuri",
  sub: (name: string, count: string) => `${name}, ${count}`,
  category: { title: (season: string) => `Categoria de concurs, sezonul ${season}`, since: (year: number) => `din ${year}`, before: (short: string) => `înainte: ${short}` },
  records: { best: "record total", podiums: "podiumuri", wins: "victorii" },
  search: { label: "Caută", placeholder: "Nume concurs sau oraș" },
  seasons: "Toate sezoanele",
  seasonLabel: "Sezon",
  sortLabel: "Ordine",
  sort: { recent: "Cele mai noi", place: "Cel mai bun loc", points: "Cele mai multe puncte" },
  empty: "Niciun rezultat în acest sezon.",
  columns: { date: "Data", event: "Concurs", city: "Oraș", category: "Categorie", place: "Loc", total: "Total" },
  detail: {
    back: "‹ Concursuri",
    place: (place: number, field: number) => `Locul ${place} din ${field}`,
    total: (points: string) => `Total ${points}`,
    best: (points: string) => `record: ${points}`,
    short: "Program scurt",
    free: "Program liber",
    columns: { element: "Element", base: "Bază", score: "Scor" },
    totals: { tes: "TES", pcs: "PCS", deductions: "Deduceri" },
    official: "Clasamentul complet (pagina oficială) ›",
  },
} as const;

/** Abonament și plăți. */
export const MONEY = {
  title: "Abonament și plăți",
  owed: { label: "Rămas de plată", payAtClub: "Plata se face la club.", nothing: "Nimic de plată.", advance: (amount: string) => `Avans: ${amount}` },
  ticket: { title: "Abonament", seeDays: "Vezi zilele ›", next: "următoarea", left: (n: number) => `${n} rămase`, slotsOf: (next: number, slots: number) => `Ședința ${next} din ${slots}` },
  sheet: { validUntil: (date: string) => `Valabil până la ${date}`, mayExtend: "Data se poate prelungi dacă școala are un weekend liber.", others: "Alte abonamente", earlier: (name: string, used: number, slots: number, date: string) => `${name}, ${used}/${slots}, valabil până la ${date}` },
  payments: { title: "Plăți", columns: { what: "Plată", date: "Data", method: "Metodă", amount: "Sumă" }, method: { numerar: "numerar", card: "card", transfer: "transfer" } },
  documents: "Documente",
  document: { title: (season: string) => `Fișa de înscriere ${season}`, pdf: "PDF", download: "Descarcă" },
} as const;

/** Setări, Date sportiv and the password and devices pages. */
export const SETARI = {
  title: "Setări",
  account: (email: string) => `Cont: ${email}`,
  back: "Înapoi",
  me: { title: "Contul meu", name: "Nume", email: "E-mail", emailNote: "îl schimbă clubul", phone: "Telefon", saved: "Salvat." },
  athletes: { title: "Sportivi", school: "Școala", club: "Club" },
  athleteData: { title: "Date sportiv", name: "Nume", birthDate: "Data nașterii", age: "Vârsta", contact: "Persoană de contact", phone: "Telefon", email: "E-mail", note: "Le schimbă clubul." },
  security: {
    title: "Securitate",
    password: { label: "Parolă", changed: (since: string) => `schimbată ${since}`, unset: "nesetată" },
    devices: { label: "Dispozitive", count: (n: number) => (n === 1 ? "1 dispozitiv conectat" : `${n} dispozitive conectate`), signOut: "Deconectează" },
  },
  notifications: {
    title: "Notificări",
    schedule: { label: "E-mail la schimbări de program", on: "pornit", off: "oprit" },
    device: { label: "E-mail la dispozitiv nou", always: "mereu pornit" },
  },
  logout: "Ieșire",
} as const;
