// ---------------------------------------------------------------------------
// Public club data: GET /api/club/public (backend plan 2A, Task 6).
//
// Season label and period, the membership fee, and per school every price list
// with the items that have at least one price. The website (Cursuri, homepage,
// Regulament, Program) and the registration form read only this.
//
// Prices are offered per audience, as in the club's script form: members see
// the items with a member price, non-members the items with a non-member
// price. This file is the frontend copy of that rule (`offeredItems`).
//
// No runtime imports on purpose: scripts/club/club-public.test.mjs loads this
// file directly with node's type stripping. Type-only imports are erased.
// ---------------------------------------------------------------------------

import type { PricingTier } from "@/app/(site)/cursuri/_types_pricing";

export type PriceItemKind = "subscription" | "session" | "individual";
export type Audience = "member" | "nonMember";

export type PublicPriceItem = {
  name: string;
  kind: PriceItemKind;
  sessions: number | null;
  memberPrice: number | null;
  nonMemberPrice: number | null;
  tooltip: string | null;
};
export type PublicPriceList = { name: string; items: PublicPriceItem[] };
export type PublicSchool = { name: string; slug: string; priceLists: PublicPriceList[]; priceNotes: string[] };
export type PublicSeason = { label: string; startMonth: string; endMonth: string };
export type PublicClubInfo = { season: PublicSeason | null; membershipFee: number | null; schools: PublicSchool[] };

const KINDS: readonly PriceItemKind[] = ["subscription", "session", "individual"];

const text = (v: unknown): string => (typeof v === "string" ? v.trim() : "");
const price = (v: unknown): number | null =>
  typeof v === "number" && Number.isFinite(v) && v >= 0 ? v : null;
const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);
const list = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);

function parseItem(raw: unknown): PublicPriceItem | null {
  if (!isRecord(raw)) return null;
  const name = text(raw.name);
  const kind = KINDS.find((k) => k === raw.kind);
  const memberPrice = price(raw.memberPrice);
  const nonMemberPrice = price(raw.nonMemberPrice);
  if (!name || !kind || (memberPrice === null && nonMemberPrice === null)) return null;
  const sessions = typeof raw.sessions === "number" && Number.isInteger(raw.sessions) ? raw.sessions : null;
  return { name, kind, sessions, memberPrice, nonMemberPrice, tooltip: text(raw.tooltip) || null };
}

function parseList(raw: unknown): PublicPriceList | null {
  if (!isRecord(raw)) return null;
  const items = list(raw.items).map(parseItem).filter((i): i is PublicPriceItem => i !== null);
  return items.length ? { name: text(raw.name), items } : null;
}

function parseSchool(raw: unknown): PublicSchool | null {
  if (!isRecord(raw)) return null;
  const name = text(raw.name);
  const slug = text(raw.slug);
  if (!name || !slug) return null;
  return {
    name,
    slug,
    priceLists: list(raw.priceLists).map(parseList).filter((l): l is PublicPriceList => l !== null),
    priceNotes: list(raw.priceNotes).map(text).filter(Boolean),
  };
}

function parseSeason(raw: unknown): PublicSeason | null {
  if (!isRecord(raw)) return null;
  const label = text(raw.label);
  const startMonth = text(raw.startMonth);
  const endMonth = text(raw.endMonth);
  return label && startMonth && endMonth ? { label, startMonth, endMonth } : null;
}

/** The `data` of GET /api/club/public, checked field by field; null when unusable. */
export function parsePublicClubInfo(raw: unknown): PublicClubInfo | null {
  if (!isRecord(raw) || !Array.isArray(raw.schools)) return null;
  return {
    season: parseSeason(raw.season),
    membershipFee: price(raw.membershipFee),
    schools: raw.schools.map(parseSchool).filter((s): s is PublicSchool => s !== null),
  };
}

// ---------------------------------------------------------------------------
// Per-audience rule
// ---------------------------------------------------------------------------

export function priceFor(item: PublicPriceItem, audience: Audience): number | null {
  return audience === "member" ? item.memberPrice : item.nonMemberPrice;
}

export function offeredItems(items: PublicPriceItem[], audience: Audience): PublicPriceItem[] {
  return items.filter((i) => priceFor(i, audience) !== null);
}

/** Every item of the school, list by list, in the order the backend returns. */
export function schoolItems(school: PublicSchool): PublicPriceItem[] {
  return school.priceLists.flatMap((l) => l.items);
}

/** The membership answer of the form as an audience; null before it is answered. */
export function audienceFor(membershipAnswer: string): Audience | null {
  if (membershipAnswer === "da") return "member";
  if (membershipAnswer === "nu") return "nonMember";
  return null;
}

export function formatRon(amount: number): string {
  return `${amount} RON`;
}

export const MEMBER_FEE_LABEL = "Taxa de membru (o dată/sezon)";

/**
 * Whether the website offers registrations: the "Înscrieri deschise" switch
 * (Setări site), a current Sezon and at least one school, the same cases in
 * which the backend accepts a submission. When the public read could not be
 * loaded (null) the switch alone decides, so a backend hiccup does not close
 * the site.
 */
export function registrationsOpen(switchOpen: boolean, club: PublicClubInfo | null): boolean {
  if (!switchOpen) return false;
  return club === null || (club.season !== null && club.schools.length > 0);
}

/** "2026-10-01" / "2027-05-31" as the "YYYY-MM" bounds the Program calendar takes. */
export function seasonMonthBounds(season: PublicSeason | null): { seasonStart: string; seasonEnd: string } | null {
  const isoMonth = /^\d{4}-\d{2}/;
  if (!season || !isoMonth.test(season.startMonth) || !isoMonth.test(season.endMonth)) return null;
  return { seasonStart: season.startMonth.slice(0, 7), seasonEnd: season.endMonth.slice(0, 7) };
}

// ---------------------------------------------------------------------------
// Website: the two price cards of /cursuri
// ---------------------------------------------------------------------------

function tierItems(school: PublicSchool, audience: Audience) {
  return offeredItems(schoolItems(school), audience).map((item) => ({
    label: item.name,
    price: formatRon(priceFor(item, audience) ?? 0),
    ...(item.tooltip ? { tooltip: item.tooltip } : {}),
  }));
}

/** Member and non-member cards, or null when the school offers nothing (the "not available" card). */
export function websitePriceTiers(school: PublicSchool | null, membershipFee: number | null): PricingTier[] | null {
  if (!school) return null;
  const members = tierItems(school, "member");
  const nonMembers = tierItems(school, "nonMember");
  if (!members.length && !nonMembers.length) return null;
  const fee = membershipFee === null ? {} : { bottomItem: { label: MEMBER_FEE_LABEL, price: formatRon(membershipFee) } };
  return [
    { title: "Pentru Membri", priceItems: members, ...fee },
    { title: "Pentru Neafiliați", priceItems: nonMembers },
  ];
}

// ---------------------------------------------------------------------------
// Form: price box, abonament options, upsell for non-members
// ---------------------------------------------------------------------------

export type PriceRow = { label: string; price: string; tooltip: string | null };
export type PriceBox = { title: string; rows: PriceRow[] };

export function priceBox(school: PublicSchool, audience: Audience, membershipFee: number | null): PriceBox {
  const rows: PriceRow[] = offeredItems(schoolItems(school), audience).map((item) => ({
    label: item.name,
    price: formatRon(priceFor(item, audience) ?? 0),
    tooltip: item.tooltip,
  }));
  if (audience === "member" && membershipFee !== null) {
    rows.push({ label: MEMBER_FEE_LABEL, price: formatRon(membershipFee), tooltip: null });
  }
  return { title: audience === "member" ? "Pentru Membri" : "Pentru Neafiliați", rows };
}

/** Options of "La primul modul doriți să achiziționați": the items offered to this audience. */
export function subscriptionOptions(school: PublicSchool, audience: Audience | null): { value: string; label: string }[] {
  if (!audience) return [];
  return offeredItems(schoolItems(school), audience).map((i) => ({ value: i.name, label: i.name }));
}

const ORDINALS = ["primul", "al doilea", "al treilea", "al patrulea", "al cincilea", "al șaselea", "al șaptelea", "al optulea", "al nouălea", "al zecelea"];

/** Romanian ordinal for an abonament count: 1 "primul", 3 "al treilea", 12 "al 12-lea". */
export function ordinalRo(n: number): string {
  return ORDINALS[n - 1] ?? `al ${n}-lea`;
}

/** "A", "A și B", "A, B și C". */
export function joinRo(names: string[]): string {
  if (names.length < 2) return names[0] ?? "";
  return `${names.slice(0, -1).join(", ")} și ${names[names.length - 1]}`;
}

export type UpsellRow = { label: string; nonMemberPrice: number; memberPrice: number };
export type Upsell = { rows: UpsellRow[]; text: string };

type Cheaper = PublicPriceItem & { memberPrice: number; nonMemberPrice: number };

function cheaperForMembers(items: PublicPriceItem[]): Cheaper[] {
  return items
    .filter((i): i is Cheaper => i.memberPrice !== null && i.nonMemberPrice !== null && i.memberPrice < i.nonMemberPrice)
    .sort((a, b) => (b.sessions ?? -1) - (a.sessions ?? -1));
}

/** Lists whose items are all member-only go by the list name ("Avansați Gold"), other items by their own name. */
function memberOnlyNames(school: PublicSchool): string[] {
  const names = school.priceLists.flatMap((l) => {
    const only = l.items.filter((i) => i.memberPrice !== null && i.nonMemberPrice === null);
    if (!only.length) return [];
    return only.length === l.items.length && l.name ? [l.name] : only.map((i) => i.name);
  });
  return [...new Set(names)];
}

function savingSentences(reference: Cheaper | undefined, fee: number | null): string[] {
  if (!reference || reference.sessions === null) return [];
  const saving = reference.nonMemberPrice - reference.memberPrice;
  const out = [`Economisești ${saving} RON la fiecare abonament de ${reference.sessions} ședințe.`];
  if (fee !== null && fee > 0) {
    out.push(`Taxa de membru (${fee} RON pe sezon) se recuperează de la ${ordinalRo(Math.ceil(fee / saving))} abonament.`);
  }
  return out;
}

/**
 * The non-member upsell (mockup form-steps-v4): items members pay less for, the
 * saving on the largest abonament, after how many abonaments the fee pays back,
 * and what only members can buy. Null when members pay less for nothing.
 */
export function upsell(school: PublicSchool, membershipFee: number | null): Upsell | null {
  const cheaper = cheaperForMembers(schoolItems(school));
  if (!cheaper.length) return null;
  const reference = cheaper.find((i) => i.kind === "subscription" && i.sessions !== null);
  const only = memberOnlyNames(school);
  const sentences = [
    ...savingSentences(reference, membershipFee),
    ...(only.length ? [`Doar membrii au acces la ${joinRo(only)}.`] : []),
  ];
  return {
    rows: cheaper.map((i) => ({ label: i.name, nonMemberPrice: i.nonMemberPrice, memberPrice: i.memberPrice })),
    text: sentences.join(" "),
  };
}
