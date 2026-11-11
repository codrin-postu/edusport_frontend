// Strings both portals use: sign-in screens, state lines, accessibility labels.
// Romanian, terse. No em or en dash, no middle dot, straight quotes, "E-mail" not "Email", no emoji.

export const PORTAL_LABEL = { antrenor: "Portal antrenor", sportiv: "Portal sportiv" } as const;

export const LOGIN = {
  title: "Intră în cont",
  google: "Continuă cu Google",
  or: "sau",
  email: "E-mail",
  password: "Parolă",
  submit: "Intră",
  forgot: "Am uitat parola",
} as const;

export const EYE = { show: "Arată parola", hide: "Ascunde parola" } as const;

export const INVITE = {
  title: "Bun venit",
  account: "Contul tău: {email}",
  newPassword: "Parolă nouă",
  save: "Salvează parola",
  or: "sau",
  google: "Continuă cu Google",
  expired: "Invitația a expirat. Cere administratorului una nouă.",
} as const;

export const RESET = {
  title: "Am uitat parola",
  email: "E-mail",
  sendCode: "Trimite codul",
  code: "Cod din e-mail",
  newPassword: "Parolă nouă",
  save: "Salvează parola",
  back: "Înapoi la intrare",
  backSigned: "Înapoi",
} as const;

export const STATES = {
  loadFailed: "Nu am putut încărca datele.",
  noAccess: "Nu mai ai acces la această grupă.",
  invalid: "Cerere invalidă.",
  tooMany: "Prea multe încercări. Încearcă din nou peste 15 minute.",
  retry: "Încearcă din nou",
} as const;

export const A11Y = { prevMonth: "Luna anterioară", nextMonth: "Luna următoare" } as const;

/** The sign-in copy a portal passes to the shared login, reset and invite forms. */
export type AuthCopy = {
  login: { title: string; google: string; or: string; email: string; password: string; submit: string; forgot: string };
  reset: { title: string; email: string; sendCode: string; code: string; newPassword: string; save: string; back: string; backSigned: string };
  // `account` holds the placeholder {email}: a function cannot cross from a server page to a client form.
  invite: { title: string; account: string; newPassword: string; save: string; or: string; google: string; expired: string };
};

export const KIT = {
  completat: "completat",
  necompletat: "necompletat",
  individual: "Individual",
  standIn: "Înlocuitor",
  school: "Școala",
  copied: "Numărul a fost copiat.",
  copyFailed: "Nu am putut copia numărul.",
  place: "Loc",
  points: "puncte",
  weekdays: ["L", "Ma", "Mi", "J", "V", "S", "D"],
  legend: { grup: "grup", individual: "individual", anulata: "anulată" },
} as const;
