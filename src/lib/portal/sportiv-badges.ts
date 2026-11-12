// Texts of the badges of Parcurs (spec 7). Pure, type imports only (loaded by Node tests).
import type { Badge, Tier } from "./sportiv-types.ts";

const TIER_WORD: Record<Tier, string> = { bronze: "bronz", silver: "argint", gold: "aur", platinum: "platină", ice: "gheață" };

/** "bronze" -> "bronz", "platinum" -> "platină" (what a screen reader says). */
export function tierWord(t: Tier): string {
  return TIER_WORD[t];
}

/** "50 antrenamente" -> "50 de antrenamente": Romanian puts "de" after a number ending in 00 or 20 to 99. */
function spoken(label: string): string {
  const m = /^(\d+) (\S+)$/.exec(label);
  if (!m) return label;
  const last = Number(m[1]) % 100;
  return last === 0 || last >= 20 ? `${m[1]} de ${m[2]}` : label;
}

/** The screen reader label of a badge: "50 de antrenamente, nivel argint"; a locked one: "Concursuri, încă niciunul (blocat)". */
export function badgeAria(b: Badge): string {
  if (b.tier === null) return `${b.label}, încă niciunul (blocat)`;
  return `${spoken(b.label)}, nivel ${tierWord(b.tier)}`;
}

/** "63 din 100" toward the next tier; null when the top tier is reached. */
export function badgeProgress(b: Badge): string | null {
  return b.next === null ? null : `${b.count} din ${b.next}`;
}
