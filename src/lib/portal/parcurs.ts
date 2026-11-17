// Parcurs pins: the shapes copied verbatim from the backend (club/parcurs/api-types.ts) and the texts of a pin. Pure, no runtime imports (loaded by Node tests).
/** Equals the PNG basename, e.g. `antrenamente-25`, `saritura-2lz`, `prietenie-07`. */
export type PinId = string;
export type JumpCode = "s" | "t" | "lo" | "f" | "lz" | "a";
export type JumpLevel = 1 | 2 | 3;

/** One pin as the portals show it. Dates are ISO `YYYY-MM-DD`; formatting happens in the UI. */
export type PinView = { pin: PinId; label: string; earnedOn: string | null; count: number };

export type ReceivedPin = { id: string; design: number; message: string; from: string; givenOn: string };

/** What the athlete sees: pins by group, the friendship pins received and how many can still be given today. */
export type Parcurs = {
  antrenamente: PinView[]; concursuri: PinView[]; membru: PinView[]; insigne: PinView[];
  sarituri: PinView[][]; received: ReceivedPin[]; pinsLeft: number;
};

/** Coach and admin: the same with who gave each award and the friendship pins the athlete gave; every name is the full one. */
export type ParcursStaff = Parcurs & {
  awards: { id: string; pin: PinId; givenOn: string; givenBy: string }[];
  given: (ReceivedPin & { to: string })[];
};

/** Screen reader label of a pin: "Podium, 3" (the number only above one), an unearned one "Podium, blocat". */
export function pinAria(p: PinView): string {
  if (p.earnedOn === null) return `${p.label}, blocat`;
  return showCount(p) ? `${p.label}, ${p.count}` : p.label;
}

/** The count number is shown only for a pin earned more than once. */
export function showCount(p: PinView): boolean {
  return p.earnedOn !== null && p.count > 1;
}

/** Friendship design 7 -> "prietenie-07" (the PNG basename). */
export function friendPinId(design: number): PinId {
  return `prietenie-${String(design).padStart(2, "0")}`;
}

/** One fixed message per friendship design (index = design - 1), the same list as the backend catalogue. */
export const FRIENDSHIP_MESSAGES: readonly string[] = [
  "Bate palma!", "Ai strălucit.", "Te susțin!", "Un gând bun pentru tine.", "Mă bucur că ești în echipă.",
  "Crești frumos.", "Mi-ai făcut ziua mai bună.", "Cred în tine!", "Patinezi frumos.", "Prieteni pe gheață.",
  "Echipă bună!", "Te ridici de fiecare dată.", "Ai fost o vedetă.", "Ușor ca un fluture.", "Hai la o ciocolată caldă!",
];
