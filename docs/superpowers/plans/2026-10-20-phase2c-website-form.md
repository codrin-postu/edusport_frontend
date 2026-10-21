# Phase 2C: Website and Registration Form Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the website (Cursuri, homepage, Regulament, Program, Înscrieri) read season, fee and prices from `GET /api/club/public`, and rebuild the registration form as the club's script form in the 3 approved steps, ending on a success screen with the registration number, the PDF downloads and the WhatsApp channel.

**Architecture:** All price and season rules live in one import-free module (`src/lib/club-public.ts`: parse the public read, offer items per audience, build the website cards, the form's price box and the non-member upsell), so they are tested with `node --test` like `src/lib/pages.ts` today. The form keeps its rules in import-free modules too (`_rules.ts`, `_school.ts`, `_schedule.ts`) and its screens in small client components; the step renderer reuses the shared step chrome and `CustomQuestions`, with slots for the blocks the script form puts between questions. A Playwright flow test runs the 3 steps in a real browser against a mock Strapi.

**Tech Stack:** Next.js 15.5 (App Router, React 19, TypeScript strict), Tailwind 4 with the site's token check, Radix, date-fns; tests: `node --test` on TypeScript sources (Node 22.18+ strips types), Playwright 1.63.

**Validated:** the code in this plan was applied to a scratch copy of the frontend on 2026-10-20 and again with the 2026-10-21 rulings (against a mock of the 2A/2D responses): `npx tsc --noEmit` zero errors at every task boundary, `npm run lint` no new warnings (17 before and after, all pre-existing), `npm run check:tokens` passes, `npm run test:scripts` 87 pass, `npm run test:e2e` 5 pass. `FALLBACK_CONFIG` was compared with the public model of the 2A Task 2 registry (built from the 2A plan's code) with `npm run check:inscriere-config`: identical.

**Rulings applied (coordinator and user, 2026-10-21):** base branch `design-foundations` (= `origin/main`, a6e2ae6); 2A's public read returns only `kind = 'school'` sections, so the frontend needs no `kind`; the schedule box is accepted as is while there is one school; the success-screen texts are approved as written; /cursuri says "Pentru Neafiliați"; with no current Sezon registrations show as closed and no season label is shown anywhere (the stale fallback "Octombrie 2025 - Mai 2026" and "2025–2026" are removed); deploy both repos in one window with "Înscrieri deschise" off during the switch; a new page `/inscrieri/link-expirat` receives the 2D redirect for an expired or invalid PDF link.

**Spec:** `../edusport_backend/docs/superpowers/specs/2026-10-19-registration-rebuild-design.md`, sections 3.1 to 3.4 (and 1.3, 1.4 for the closed state and the per-audience prices). Decisions: `docs/portal/DECISIONS.md` (dated decisions win over the spec), in particular 2026-10-03 (form mirrors the script form, upsell, schedule box), 2026-10-05 (3 steps, form-3steps-v1 option B; success copy), 2026-10-19 (multi-school, one "Înscrieri deschise" switch) and 2026-10-20 (per-audience prices, no list switch, script option lists). Interfaces: plan 2A `../edusport_backend/docs/superpowers/plans/2026-10-19-phase2a-registration-data.md` (Task 2 registry, Task 6 public read, Task 7 request body, Task 9 submit response). Mockups: `docs/portal/mockups/screens/form-3steps-v1.html` (option B), `form-steps-v4.html` (price boxes, upsell, "După trimitere"), generators `mockups/gen_steps3.py`, `gen_steps.py`, `gen_form.py`; wording: the live script form (decoded copy read 2026-10-20).

## Global Constraints

- Frontend repo `/Users/codrin/Documents/Programming/edusport_frontend`, Next.js. Double quotes, semicolons, trailing commas (eslint.config.mjs). Explicit types on exported functions.
- Checks after every task: `npx tsc --noEmit` (zero errors), `npm run lint` (no new warnings; 17 exist today), `npm run check:tokens` (exit 0), `npm run test:scripts` (all pass). The Playwright flow test (`npm run test:e2e`) runs in Task 7 and Task 8 only (it builds the app).
- Tests on TypeScript sources go in `scripts/**/*.test.mjs` (the glob of `npm run test:scripts`, run in CI) and follow `scripts/pages/pages.test.mjs`: import the `.ts` file directly, skip on Node without type stripping. A module loaded this way may have only `import type` imports.
- Design tokens only (`scripts/tokens/patterns.mjs`): no rounded shapes, no opacity, no default palette, spacing on the 4px scale. No dashed or dotted lines.
- Copy rules for user-visible text: no em dash, no middle dot, no emoji; terse; UI copy in Romanian, code and docs in English; never pad the client's own wording; Romanian ș and ț with the comma below, never the cedilla.
- The form uses the script form's questions, wording, order and options (registry `inscriere` of plan 2A); labels, help, required flags and options come from the CMS config at runtime, with `FALLBACK_CONFIG` as the offline copy.
- Backend contracts (fixed): `GET /api/club/public` -> `{ data: PublicClubInfo }`; `POST /api/forms/inscriere?scoala=<slug>` with `subscriptionChoice: { priceItemName }` -> 200 `{ ok: true, registrationNumber, downloadToken, documents }` (2D extends 2A's `{ ok: true, registrationNumber }`) or 400 `{ ok: false, code, error }`; PDF link `${API}/api/forms/inscriere/documents?token=...&kind=acord|adeziune`.
- "Înscrieri deschise" still comes from `site-settings.registration.open`. The old `pricing` single type and the season fields of `site-settings.registration` are no longer read.
- Commits: Conventional Commits, no AI attribution, no `Co-Authored-By`. Never push. Never run anything against production.
- Branch: `feat/registration-rebuild`, created from `design-foundations` (same commit as `main` and `origin/main`, a6e2ae6; the checkout may be on `docs/portal-design`, which is that commit plus one docs commit). Deploy only together with backend plan 2A, as in "Deploy" at the end.
- No current Sezon means registrations closed and no season label anywhere on the site (no fallback label).

## Review Focus

- A parent picks an abonament, then changes the membership answer to one that does not offer it (Gold chosen, then "Nu"): the choice is cleared, the select shows "Alegeți opțiunea dorită..." and Continuă stays disabled; an item offered to both audiences stays selected (Task 4 `applyAnswer` tests; Task 7 e2e flips Nu -> Da with "Vreau să devin membru").
- A link with an unknown `?scoala=` (a typo, `club`, an old school): never mapped to another school; "Școala nu a fost găsită." above "Alege școala" (Task 4 `resolveSchool` tests; Task 7 e2e).
- Registrations switched off, no current Sezon (`season: null`) or no school with a public page: "Înscrierile sunt închise." and no form on Înscrieri, the closed panel on the homepage, "Înscrieri închise" on /cursuri, and no season label, matching the backend's `closed` (Task 1 `registrationsOpen` test).
- A submit that succeeds without PDFs (2D not deployed yet, or the PDF build failed after the registration was saved): the success screen still shows the number and the signing sentence, with no broken download button (Task 4 `parseSubmitResponse` tests).
- A draft saved by the old form, or a draft restored on step 3 while steps 1-2 are incomplete: the old draft is removed, and "Trimite înscrierea" stays disabled until every step is complete (Task 7 e2e "old-form draft").

---

## File Structure

```
src/lib/
  club-public.ts              types of GET /api/club/public, parsePublicClubInfo, offeredItems, registrationsOpen,
                              websitePriceTiers, priceBox, subscriptionOptions, upsell, seasonMonthBounds (Task 1; import-free)
  club-public-fetch.ts        fetchPublicClubInfo() server fetch, React cache (Task 1)
  site-settings.ts            drops currentSeason (Task 6)
  strapi-forms.ts             INSCRIERE_BUILTIN_KEYS = the new registry keys (Task 6)
src/components/ui/custom-questions.tsx   select placeholder per key (Task 5)
src/app/cursuri/
  blocks/WeekendRow.tsx       one row of the Weekenduri list, lifted from SeasonCalendarViewV2 (Task 3)
  blocks/ItemTooltip.tsx      price tooltip button, lifted from PricingSection (Task 3)
  blocks/PricingSection.tsx   no note line (Task 2)
  page.tsx, _types.ts, _types_pricing.ts, _data.ts, _View.tsx, blocks/CoursesBannerSection.tsx,
  regulament/page.tsx, regulament/_View.tsx, program/page.tsx, program/_types.ts, program/_data.ts,
  blocks/SeasonCalendarViewV2.tsx           read the public read; no label without a current Sezon (Task 2)
src/app/page.tsx, homepage/blocks/RegistrationClosedSection.tsx, landing-v2/blocks/RegistrationSectionV2.tsx
                              season label and open/closed from the public read (Task 2)
src/app/inscrieri/
  _rules.ts                   follow-ups, abonament options per membership, height rule, payload, response, closed (Task 4)
  _school.ts                  resolveSchool, showsPinnedSchool (Task 4)
  _schedule.ts                next-month window, weekend rows, grouping by month (Task 4)
  _submit.ts                  POST /api/forms/inscriere?scoala= (Task 5)
  _Step.tsx                   step renderer with before/after/replace slots and extra checks (Task 5)
  _Abonament.tsx              ScheduleBox, PriceBoxView, UpsellBox (Task 5)
  _Consent.tsx                consent line "Titlu: text <link>" (Task 5)
  _SchoolPicker.tsx           "Alege școala" and the pinned school (Task 5)
  _Success.tsx                success screen (Task 5)
  _types.ts                   FALLBACK_CONFIG (= 2A registry), placeholders (Task 6; import-free)
  _draft.ts                   draft v2, drops v1 (Task 6)
  _RegistrationForm.tsx, _View.tsx, page.tsx   the assembled form and page (Task 6)
  _ConfigStep.tsx             deleted (Task 6)
  link-expirat/page.tsx       "Linkul a expirat", target of the 2D redirect, noindex (Task 7)
scripts/club/club-public.test.mjs, scripts/inscrieri/{rules,school,schedule,config}.test.mjs   node tests
scripts/inscrieri/compare-config.mjs     FALLBACK_CONFIG vs a live backend (Task 6)
tests/e2e/mock-strapi.mjs, tests/e2e/inscriere.spec.ts, playwright.e2e.config.ts   flow test (Task 7)
```

## Tasks and parallel groups

| Group | Tasks | Runs after |
|---|---|---|
| A | 1 Public club data, 3 Shared Cursuri rows | nothing; both in parallel (separate files) |
| B | 2 Website pages, 4 Form rules | group A; both in parallel (separate files) |
| C | 5 Form building blocks | Tasks 1, 3, 4 |
| D | 6 Form assembly and offline config | Task 5 |
| E | 7 Browser flow test and the expired-link page | Tasks 2 and 6 |
| F | 8 Final checks | everything |

Before Task 1: create the branch: `git switch -c feat/registration-rebuild design-foundations`.

---

### Task 1: Public club data module

**Files:**
- Create: `src/lib/club-public.ts`
- Create: `src/lib/club-public-fetch.ts`
- Test: `scripts/club/club-public.test.mjs`

**Interfaces:**
- Consumes: `GET /api/club/public` (2A Task 6): `{ data: PublicClubInfo }`; `PricingTier` from `src/app/cursuri/_types_pricing.ts` (type only).
- Produces (`src/lib/club-public.ts`):
  - `type PriceItemKind = "subscription" | "session" | "individual"`, `type Audience = "member" | "nonMember"`
  - `type PublicPriceItem`, `PublicPriceList`, `PublicSchool`, `PublicSeason`, `PublicClubInfo` (same fields as 2A)
  - `parsePublicClubInfo(raw: unknown): PublicClubInfo | null`
  - `priceFor(item, audience): number | null`, `offeredItems(items, audience): PublicPriceItem[]`, `schoolItems(school): PublicPriceItem[]`
  - `audienceFor(membershipAnswer: string): Audience | null` (`"da"` member, `"nu"` non-member)
  - `formatRon(amount: number): string` (`"770 RON"`), `MEMBER_FEE_LABEL = "Taxa de membru (o dată/sezon)"`
  - `registrationsOpen(switchOpen: boolean, club: PublicClubInfo | null): boolean` (switch on, a current Sezon and a school; with `club === null`, the switch alone)
  - `seasonMonthBounds(season: PublicSeason | null): { seasonStart: string; seasonEnd: string } | null` ("YYYY-MM")
  - `websitePriceTiers(school: PublicSchool | null, membershipFee: number | null): PricingTier[] | null` (titles "Pentru Membri", "Pentru Neafiliați")
  - `type PriceRow = { label; price; tooltip }`, `type PriceBox = { title; rows }`, `priceBox(school, audience, membershipFee): PriceBox`
  - `subscriptionOptions(school, audience: Audience | null): { value: string; label: string }[]`
  - `ordinalRo(n)`, `joinRo(names)`, `type UpsellRow`, `type Upsell = { rows; text }`, `upsell(school, membershipFee): Upsell | null`
- Produces (`src/lib/club-public-fetch.ts`): `fetchPublicClubInfo(): Promise<PublicClubInfo | null>` (React `cache`, revalidate 60 s, null on any failure).

The rule (DECISIONS 2026-10-20, 2A Task 3): an item is offered to members when it has a member price and to non-members when it has a non-member price; the backend already drops items with neither price. The upsell text is the approved mockup's ("Economisești 120 RON la fiecare abonament de 8 ședințe. Taxa de membru (270 RON pe sezon) se recuperează de la al treilea abonament. Doar membrii au acces la Avansați Gold."), computed from the prices: the saving of the largest abonament offered to both audiences, the fee divided by that saving rounded up as an ordinal, and the member-only lists by name.

- [ ] **Step 1: Write the failing test**

`scripts/club/club-public.test.mjs`:

```js
// Loads the TypeScript source directly (node >= 22.18 strips types natively).
// src/lib/club-public.ts has only type imports, which is what makes this possible.
import { test } from "node:test";
import assert from "node:assert/strict";

// CI runs Node 20, which cannot import .ts files: skip there instead of failing.
const canStripTypes = Boolean(process.features?.typescript);
const lib = canStripTypes ? await import("../../src/lib/club-public.ts") : {};
const it = canStripTypes ? test : (name) => test.skip(name);

// Prices from the approved mockup (form-steps-v4); the real ones come from the Prețuri screen.
const TOOLTIP_1 = "Disponibil doar pentru prima ședință";
const item = (over) => ({ name: "Abonament 8 ședințe grup", kind: "subscription", sessions: 8, memberPrice: 770, nonMemberPrice: 890, tooltip: null, ...over });
const SCHOOL = {
  name: "Școala de Patinaj - AFI Cotroceni",
  slug: "afi-cotroceni",
  priceNotes: ["Nota 1"],
  priceLists: [
    {
      name: "Standard",
      items: [
        item({ name: "1 ședință grup", kind: "session", sessions: null, memberPrice: null, nonMemberPrice: 180, tooltip: TOOLTIP_1 }),
        item({ name: "Abonament 6 ședințe grup", sessions: 6, memberPrice: 660, nonMemberPrice: 790 }),
        item({}),
      ],
    },
    { name: "Avansați Gold", items: [item({ name: "Abonament Avansați Gold 8 ședințe", memberPrice: 1080, nonMemberPrice: null })] },
  ],
};
const INFO = { season: { label: "2026-2027", startMonth: "2026-10-01", endMonth: "2027-05-31" }, membershipFee: 270, schools: [SCHOOL] };

it("parsePublicClubInfo keeps a well-formed response as is", () => {
  assert.deepEqual(lib.parsePublicClubInfo(INFO), INFO);
});

it("parsePublicClubInfo drops malformed parts instead of failing", () => {
  const raw = {
    season: { label: "2026-2027" },
    membershipFee: "270",
    schools: [
      { name: "Fără slug" },
      {
        ...SCHOOL,
        priceNotes: ["", 7, "Nota 1"],
        priceLists: [
          { name: "Goală", items: [item({ memberPrice: null, nonMemberPrice: null }), item({ kind: "altceva" }), "x"] },
          SCHOOL.priceLists[0],
        ],
      },
    ],
  };
  const out = lib.parsePublicClubInfo(raw);
  assert.equal(out.season, null);
  assert.equal(out.membershipFee, null);
  assert.deepEqual(out.schools.map((s) => s.slug), ["afi-cotroceni"]);
  assert.deepEqual(out.schools[0].priceLists.map((l) => l.name), ["Standard"]);
  assert.deepEqual(out.schools[0].priceNotes, ["Nota 1"]);
  assert.equal(lib.parsePublicClubInfo(null), null);
  assert.equal(lib.parsePublicClubInfo({ season: null }), null);
});

it("offers each item to the audience it has a price for", () => {
  const items = lib.schoolItems(SCHOOL);
  assert.deepEqual(lib.offeredItems(items, "member").map((i) => i.name), [
    "Abonament 6 ședințe grup",
    "Abonament 8 ședințe grup",
    "Abonament Avansați Gold 8 ședințe",
  ]);
  assert.deepEqual(lib.offeredItems(items, "nonMember").map((i) => i.name), [
    "1 ședință grup",
    "Abonament 6 ședințe grup",
    "Abonament 8 ședințe grup",
  ]);
});

it("audienceFor reads the stored membership answer", () => {
  assert.equal(lib.audienceFor("da"), "member");
  assert.equal(lib.audienceFor("nu"), "nonMember");
  assert.equal(lib.audienceFor(""), null);
  assert.equal(lib.audienceFor("Da"), null);
});

it("websitePriceTiers builds the two cards, tooltips kept, no note line", () => {
  const [members, nonMembers] = lib.websitePriceTiers(SCHOOL, 270);
  assert.deepEqual(members, {
    title: "Pentru Membri",
    priceItems: [
      { label: "Abonament 6 ședințe grup", price: "660 RON" },
      { label: "Abonament 8 ședințe grup", price: "770 RON" },
      { label: "Abonament Avansați Gold 8 ședințe", price: "1080 RON" },
    ],
    bottomItem: { label: "Taxa de membru (o dată/sezon)", price: "270 RON" },
  });
  assert.equal(nonMembers.title, "Pentru Neafiliați");
  assert.deepEqual(nonMembers.priceItems[0], { label: "1 ședință grup", price: "180 RON", tooltip: TOOLTIP_1 });
  assert.equal(JSON.stringify(nonMembers).includes("note"), false);
});

it("websitePriceTiers: no fee row without a fee; null when nothing is offered", () => {
  assert.equal(lib.websitePriceTiers(SCHOOL, null)[0].bottomItem, undefined);
  assert.equal(lib.websitePriceTiers({ ...SCHOOL, priceLists: [] }, 270), null);
  assert.equal(lib.websitePriceTiers(null, 270), null);
});

it("priceBox shows the annual fee in the member box only", () => {
  const member = lib.priceBox(SCHOOL, "member", 270);
  assert.equal(member.title, "Pentru Membri");
  assert.deepEqual(member.rows.at(-1), { label: "Taxa de membru (o dată/sezon)", price: "270 RON", tooltip: null });
  const nonMember = lib.priceBox(SCHOOL, "nonMember", 270);
  assert.equal(nonMember.title, "Pentru Neafiliați");
  assert.deepEqual(nonMember.rows.map((r) => r.price), ["180 RON", "790 RON", "890 RON"]);
  assert.equal(nonMember.rows[0].tooltip, TOOLTIP_1);
});

it("subscriptionOptions depend on membership", () => {
  assert.deepEqual(lib.subscriptionOptions(SCHOOL, null), []);
  assert.deepEqual(lib.subscriptionOptions(SCHOOL, "member").map((o) => o.value), [
    "Abonament 6 ședințe grup",
    "Abonament 8 ședințe grup",
    "Abonament Avansați Gold 8 ședințe",
  ]);
  assert.ok(!lib.subscriptionOptions(SCHOOL, "member").some((o) => o.value === "1 ședință grup"));
});

it("upsell computes the savings from the prices (mockup text)", () => {
  assert.deepEqual(lib.upsell(SCHOOL, 270), {
    rows: [
      { label: "Abonament 8 ședințe grup", nonMemberPrice: 890, memberPrice: 770 },
      { label: "Abonament 6 ședințe grup", nonMemberPrice: 790, memberPrice: 660 },
    ],
    text:
      "Economisești 120 RON la fiecare abonament de 8 ședințe. Taxa de membru (270 RON pe sezon) se recuperează de la al treilea abonament. Doar membrii au acces la Avansați Gold.",
  });
});

it("upsell follows other prices and drops sentences it cannot back", () => {
  const cheap = { ...SCHOOL, priceLists: [{ name: "Standard", items: [item({ memberPrice: 500, nonMemberPrice: 800 })] }] };
  assert.equal(lib.upsell(cheap, 270).text, "Economisești 300 RON la fiecare abonament de 8 ședințe. Taxa de membru (270 RON pe sezon) se recuperează de la primul abonament.");
  assert.equal(lib.upsell(cheap, null).text, "Economisești 300 RON la fiecare abonament de 8 ședințe.");
  const same = { ...SCHOOL, priceLists: [{ name: "Standard", items: [item({ memberPrice: 890 })] }] };
  assert.equal(lib.upsell(same, 270), null);
});

it("ordinals and lists read as Romanian", () => {
  assert.equal(lib.ordinalRo(1), "primul");
  assert.equal(lib.ordinalRo(2), "al doilea");
  assert.equal(lib.ordinalRo(12), "al 12-lea");
  assert.equal(lib.joinRo(["A"]), "A");
  assert.equal(lib.joinRo(["A", "B"]), "A și B");
  assert.equal(lib.joinRo(["A", "B", "C"]), "A, B și C");
});

it("registrations are open only with the switch on, a current Sezon and a school", () => {
  assert.equal(lib.registrationsOpen(true, INFO), true);
  assert.equal(lib.registrationsOpen(false, INFO), false);
  assert.equal(lib.registrationsOpen(true, { ...INFO, season: null }), false);
  assert.equal(lib.registrationsOpen(true, { ...INFO, schools: [] }), false);
  // Public read unavailable: the switch alone decides.
  assert.equal(lib.registrationsOpen(true, null), true);
  assert.equal(lib.registrationsOpen(false, null), false);
});

it("seasonMonthBounds gives the Program calendar range", () => {
  assert.deepEqual(lib.seasonMonthBounds(INFO.season), { seasonStart: "2026-10", seasonEnd: "2027-05" });
  assert.equal(lib.seasonMonthBounds(null), null);
  assert.equal(lib.seasonMonthBounds({ label: "x", startMonth: "oct", endMonth: "mai" }), null);
});

it("user-visible text uses comma-below ș and ț, never the cedilla", () => {
  const all = JSON.stringify([lib.upsell(SCHOOL, 270), lib.priceBox(SCHOOL, "nonMember", 270), lib.MEMBER_FEE_LABEL, lib.ordinalRo(6)]);
  assert.doesNotMatch(all, /[şţŞŢ]/);
});
```

- [ ] **Step 2: Run the test to see it fail**

Run: `node --test scripts/club/club-public.test.mjs`
Expected: FAIL (`Cannot find module .../src/lib/club-public.ts`).

- [ ] **Step 3: Implement the module**

`src/lib/club-public.ts`:

```ts
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

import type { PricingTier } from "@/app/cursuri/_types_pricing";

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
```

`src/lib/club-public-fetch.ts`:

```ts
import { cache } from "react";

import { STRAPI_BASE } from "./strapi-base";
import { parsePublicClubInfo, type PublicClubInfo } from "./club-public";

/** The backend caches this response for 60 s (`Cache-Control: public, max-age=60`). */
const REVALIDATE_SECONDS = 60;

/**
 * GET /api/club/public: current season, membership fee and the public prices.
 * Null when the backend is unreachable or the body is unusable, so each page
 * keeps its own fallback (the "Prețurile nu sunt disponibile" card, the
 * fallback season label). React `cache` shares one call per request.
 */
export const fetchPublicClubInfo = cache(async(): Promise<PublicClubInfo | null> => {
  try {
    const res = await fetch(`${STRAPI_BASE}/api/club/public`, { next: { revalidate: REVALIDATE_SECONDS } });
    if (!res.ok) return null;
    const json = (await res.json().catch(() => null)) as { data?: unknown } | null;
    return parsePublicClubInfo(json?.data);
  } catch {
    return null;
  }
});
```

- [ ] **Step 4: Run the tests to see them pass**

Run: `node --test scripts/club/club-public.test.mjs`
Expected: PASS (14 tests). Then `npx tsc --noEmit`, `npm run lint`, `npm run check:tokens`, `npm run test:scripts`: all pass.

- [ ] **Step 5: Commit**

```bash
git add src/lib/club-public.ts src/lib/club-public-fetch.ts scripts/club/club-public.test.mjs
git commit -m "feat(club): read season, fee and prices from the public club endpoint"
```

---

### Task 2: Website pages read the public endpoint

**Files:**
- Modify (replace whole file): `src/app/cursuri/page.tsx`, `src/app/cursuri/regulament/page.tsx`, `src/app/cursuri/program/page.tsx`
- Modify: `src/app/cursuri/_types.ts` (delete `PricingTierItem`, `PricingTiersJson`, `CoursePricingData`), `src/app/cursuri/_types_pricing.ts` (delete `note`)
- Modify: `src/app/cursuri/_View.tsx`, `src/app/cursuri/blocks/CoursesBannerSection.tsx`, `src/app/cursuri/blocks/PricingSection.tsx`, `src/app/cursuri/regulament/_View.tsx`, `src/app/cursuri/program/_types.ts`, `src/app/cursuri/program/_data.ts`, `src/app/cursuri/blocks/SeasonCalendarViewV2.tsx` (season label optional)
- Modify: `src/app/page.tsx`, `src/app/homepage/blocks/RegistrationClosedSection.tsx`, `src/app/landing-v2/blocks/RegistrationSectionV2.tsx`
- Test: Task 1 (`websitePriceTiers`, `registrationsOpen`) and Task 7 (`the Cursuri prices come from the public read`).

**Interfaces:**
- Consumes: Task 1 `fetchPublicClubInfo`, `websitePriceTiers`, `registrationsOpen`, `seasonMonthBounds`; Task 3 `ItemTooltip` (already imported by `PricingSection` after Task 3).
- Produces: `PriceItem` loses `note`; `CURRENT_SEASON` is no longer used by Cursuri and Regulament (Task 6 deletes it with the old Înscrieri page, its last user); the season label props become `string | null` (`CoursesPage.currentSeason`, `CoursesBannerSection.currentSeason`, `PricingSection.currentSeason`, Regulament `currentSeason`, `ProgramPageData.seasonLabel`, `SeasonCalendarViewV2.seasonLabel`); `ProgramPageDefaults` no longer has `seasonLabel`.

Same look as today, except the rulings: "Pentru Neafiliați" (Task 1), and with no current Sezon no season label and registrations shown as closed. `/cursuri` is the Școala de patinaj page, so it shows the first school of the public read (2A returns only `kind = 'school'` sections, sorted by section order). Tooltips stay; the note line is gone (its text is now the tooltip of "1 ședință grup", 2A copy script). Footer notes are the school's `priceNotes`. "Înscrieri deschise" still comes from Setări site, combined with the current Sezon by `registrationsOpen` on /cursuri and the homepage. `site-settings.ts` keeps `currentSeason` until Task 6, because the Înscrieri page still reads it. The header and footer buttons (layout) still follow the switch alone (see "Needs user decision").

- [ ] **Step 1: Cursuri page**

Replace the whole `src/app/cursuri/page.tsx` with:

```tsx
import type { Metadata } from "next";
import { fetchStrapi } from "@/lib/strapi";
import { getSiteSettings } from "@/lib/site-settings";
import { fetchPublicClubInfo } from "@/lib/club-public-fetch";
import { registrationsOpen, websitePriceTiers } from "@/lib/club-public";
import { mapsHref } from "@/lib/mapsLink";
import { FALLBACK_ADDRESS_DISPLAY, FALLBACK_ADDRESS_MAPS_URL } from "@/lib/location";
import CoursesPage from "./_View";
import type { CoursePageContent } from "./_types";
import { CURSURI_PAGE_DATA, IS_REGISTRATION_OPEN } from "./_data";
import { requireEnabled } from "@/lib/strapi-navigation";

export const metadata: Metadata = {
  title: "Cursuri de Patinaj",
  description:
    "Cursuri de patinaj artistic pentru copii și adulți la EduSport. Prețuri, grupe de nivel, program și informații despre înscriere.",
  alternates: { canonical: "/cursuri" },
  openGraph: {
    title: "Cursuri de Patinaj | EduSport",
    description:
      "Cursuri de patinaj artistic pentru copii și adulți. Prețuri, grupe și program.",
    type: "website",
    locale: "ro_RO",
    images: [{ url: "/images/courses_generated.png", width: 1200, height: 630, alt: "EduSport - Școala de Patinaj" }],
  },
};

export const revalidate = 300; // 5 min

export default async function Page() {
  await requireEnabled("scoala");
  let switchOpen = IS_REGISTRATION_OPEN;
  let cursuriPageData = CURSURI_PAGE_DATA;
  let locationDisplay = FALLBACK_ADDRESS_DISPLAY;
  let locationHref: string | undefined = FALLBACK_ADDRESS_MAPS_URL;

  const [clubResult, settingsResult, cursuriPageResult] = await Promise.allSettled([
    // Season, fee and prices: Sezoane and Prețuri in the admin (GET /api/club/public).
    fetchPublicClubInfo(),
    getSiteSettings(),
    fetchStrapi<CoursePageContent>("cursuri-page"),
  ]);
  const club = clubResult.status === "fulfilled" ? clubResult.value : null;

  // This page is the Școala de patinaj page: the first school of the public read.
  const school = club?.schools[0] ?? null;
  const pricingData = websitePriceTiers(school, club?.membershipFee ?? null);
  const footerNotes = school?.priceNotes.length ? school.priceNotes : null;
  // No current Sezon: no season label, and registrations show as closed.
  const currentSeason = club?.season?.label ?? null;

  if (settingsResult.status === "fulfilled") {
    const settings = settingsResult.value;
    if (settings.registrationOpen !== undefined)
      switchOpen = settings.registrationOpen;
    if (settings.contact.addressDisplay) {
      locationDisplay = settings.contact.addressDisplay;
      locationHref =
        mapsHref(settings.contact.addressDisplay, settings.contact.addressMapsUrl) ??
        FALLBACK_ADDRESS_MAPS_URL;
    }
  }

  if (cursuriPageResult.status === "fulfilled" && cursuriPageResult.value) {
    const cms = cursuriPageResult.value;
    cursuriPageData = {
      banner: cms.banner ?? CURSURI_PAGE_DATA.banner,
      aboutSection: cms.aboutSection ?? CURSURI_PAGE_DATA.aboutSection,
      promoCard: cms.promoCard ?? CURSURI_PAGE_DATA.promoCard,
      infoSection: cms.infoSection ?? CURSURI_PAGE_DATA.infoSection,
    };
  }

  const isRegistrationOpen = registrationsOpen(switchOpen, club);

  return (
    <CoursesPage
      pricingData={pricingData}
      footerNotes={footerNotes}
      currentSeason={currentSeason}
      isRegistrationOpen={isRegistrationOpen}
      cursuriPageData={cursuriPageData}
      locationDisplay={locationDisplay}
      locationHref={locationHref}
    />
  );
}
```

In `src/app/cursuri/_View.tsx` replace `  currentSeason: string;` with

```tsx
  /** Current Sezon label; null when no Sezon is current (no label shown). */
  currentSeason: string | null;
```

In `src/app/cursuri/blocks/CoursesBannerSection.tsx` replace `  currentSeason: string;` with

```tsx
  /** Null when no Sezon is current: no label. */
  currentSeason: string | null;
```

and replace

```tsx
        <span className="text-label uppercase text-primary-on-dark">
          Sezonul {currentSeason}
        </span>
```

with

```tsx
        {currentSeason && (
          <span className="text-label uppercase text-primary-on-dark">
            Sezonul {currentSeason}
          </span>
        )}
```

- [ ] **Step 2: Types without the old pricing shape and the note**

In `src/app/cursuri/_types.ts` delete the three interfaces `PricingTierItem`, `PricingTiersJson` and `CoursePricingData` (the file then starts with `export interface CoursePageContent {`).

In `src/app/cursuri/_types_pricing.ts` replace

```ts
export interface PriceItem {
  label: string;
  price: string;
  tooltip?: string;
  note?: string;
}
```

with

```ts
export interface PriceItem {
  label: string;
  price: string;
  tooltip?: string;
}
```

- [ ] **Step 3: Price cards without the note line**

In `src/app/cursuri/blocks/PricingSection.tsx` replace

```tsx
          <div className="flex flex-col gap-0.5">
            <span className="text-body-sm text-secondary">
              {item.label}
              {item.tooltip && (
                <span className="inline-flex items-center ml-1 translate-y-[2px]">
                  <ItemTooltip text={item.tooltip} />
                </span>
              )}
            </span>
            {item.note && (
              <span className="text-caption text-secondary">{item.note}</span>
            )}
          </div>
```

with

```tsx
          <span className="text-body-sm text-secondary">
            {item.label}
            {item.tooltip && (
              <span className="inline-flex items-center ml-1 translate-y-[2px]">
                <ItemTooltip text={item.tooltip} />
              </span>
            )}
          </span>
```

replace

```tsx
  /** Canonical season label (site-settings, falls back to CURRENT_SEASON). */
  currentSeason: string;
```

with

```tsx
  /** Current Sezon label (GET /api/club/public); null when none is current. */
  currentSeason: string | null;
```

and replace `<SectionHeader eyebrow={currentSeason} title="Prețuri cursuri grup" />` with `<SectionHeader eyebrow={currentSeason ?? undefined} title="Prețuri cursuri grup" />` (`SectionHeader` draws no eyebrow when it is undefined).

- [ ] **Step 4: Homepage season label and open/closed panel**

In `src/app/page.tsx`:

After `import { getSiteSettings } from "@/lib/site-settings";` add

```tsx
import { fetchPublicClubInfo } from "@/lib/club-public-fetch";
import { registrationsOpen } from "@/lib/club-public";
```

Delete the line `  let currentSeason: string | undefined;`.

In the destructuring of `await Promise.allSettled([`, after `    clubFiguresResult,` add `    clubResult,`; in the array, after `    fetchStrapi<ClubFiguresCms>("club-figures"),` add `    fetchPublicClubInfo(),`.

Replace

```tsx
      registrationOpen = settingsResult.value.registrationOpen;
    }
    currentSeason = settingsResult.value.currentSeason;
  }
```

with

```tsx
      registrationOpen = settingsResult.value.registrationOpen;
    }
  }
  // The current Sezon (admin Sezoane); "Înscrieri deschise" stays in Setări site.
  // No current Sezon: no season label, and the closed panel.
  const club = clubResult.status === "fulfilled" ? clubResult.value : null;
  const currentSeason = club?.season?.label;
  registrationOpen = registrationsOpen(registrationOpen, club);
```

In `src/app/landing-v2/blocks/RegistrationSectionV2.tsx`:
- replace `  /** Canonical season from site-settings.registration.currentSeason. */` with `  /** Current Sezon label from GET /api/club/public. */`;
- delete `  const seasonLabel = season ? `Sezonul ${season}` : "Sezonul curent";`;
- replace

```tsx
          <p className="text-label uppercase text-accent">
            {seasonLabel}
          </p>
```

with

```tsx
          {season && (
            <p className="text-label uppercase text-accent">
              Sezonul {season}
            </p>
          )}
```

In `src/app/homepage/blocks/RegistrationClosedSection.tsx`:
- replace `  /** Canonical season from site-settings.registration.currentSeason (e.g. "2025-2026"). */` with `  /** Current Sezon label from GET /api/club/public (e.g. "2026-2027"). */`;
- delete `  const seasonLabel = season ? `Sezonul ${season}` : "Sezonul curent";`;
- replace

```tsx
                <p className="text-label uppercase text-accent-on-dark">
                  {seasonLabel}
                </p>
```

with

```tsx
                {season && (
                  <p className="text-label uppercase text-accent-on-dark">
                    Sezonul {season}
                  </p>
                )}
```

- [ ] **Step 5: Regulament**

Replace the whole `src/app/cursuri/regulament/page.tsx` with:

```tsx
import type { Metadata } from "next";
import { fetchStrapi } from "@/lib/strapi";
import { fetchPublicClubInfo } from "@/lib/club-public-fetch";
import RegulamentPage from "./_View";
import type { CourseRegulationsData, RegulationCategory } from "./_types";
import { requireEnabled } from "@/lib/strapi-navigation";

export const metadata: Metadata = {
  title: "Regulament Cursuri",
  description:
    "Regulamentul cursurilor de patinaj EduSport. Reguli de participare, echipament necesar și informații importante.",
  alternates: { canonical: "/cursuri/regulament" },
  openGraph: {
    title: "Regulament Cursuri | EduSport",
    description:
      "Regulamentul cursurilor de patinaj EduSport. Reguli de participare, echipament necesar și informații importante.",
    type: "website",
    locale: "ro_RO",
    images: [{ url: "/images/courses_generated.png", width: 1200, height: 630, alt: "EduSport - Școala de Patinaj" }],
  },
};

export const revalidate = 86400; // 24h - regulations rarely change

export default async function Page() {
  await requireEnabled("regulament");
  let categories: RegulationCategory[] = [];

  try {
    const data = await fetchStrapi<CourseRegulationsData>(
      "course-regulations",
      "populate=categories",
    );
    categories = data?.categories ?? [];
  } catch {
    // Fall through with empty array - _View renders an empty state
  }

  // No current Sezon: no season label.
  const club = await fetchPublicClubInfo();
  const currentSeason = club?.season?.label ?? null;

  return <RegulamentPage categories={categories} currentSeason={currentSeason} />;
}
```

In `src/app/cursuri/regulament/_View.tsx` replace

```tsx
  /** Canonical season label (site-settings, falls back to CURRENT_SEASON). */
  currentSeason: string;
```

with

```tsx
  /** Current Sezon label (GET /api/club/public); null when none is current. */
  currentSeason: string | null;
```

and replace `            <span className="text-label uppercase text-accent">{currentSeason}</span>` with `            {currentSeason && <span className="text-label uppercase text-accent">{currentSeason}</span>}`.

- [ ] **Step 6: Program**

Replace the whole `src/app/cursuri/program/page.tsx` with:

```tsx
import type { Metadata } from "next";
import { fetchStrapi } from "@/lib/strapi";
import { fetchSeasonOccurrences } from "@/lib/strapi-calendar";
import { fetchPublicClubInfo } from "@/lib/club-public-fetch";
import { seasonMonthBounds } from "@/lib/club-public";
import { occurrencesToCalendarEvents } from "@/utils/occurrences-to-calendar";
import ProgramPage from "./_View";
import type { ProgramPageData, ScheduleGroup, CalendarEvent } from "./_types";
import { PROGRAM_PAGE_DATA } from "./_data";
import { requireEnabled } from "@/lib/strapi-navigation";

export const metadata: Metadata = {
  title: "Program Cursuri",
  description:
    "Programul cursurilor de patinaj EduSport. Orarul sesiunilor pe grupe de vârstă și nivel.",
  alternates: { canonical: "/cursuri/program" },
  openGraph: {
    title: "Program Cursuri | EduSport",
    description:
      "Programul cursurilor de patinaj EduSport. Orarul sesiunilor pe grupe de vârstă și nivel.",
    type: "website",
    locale: "ro_RO",
    images: [{ url: "/images/courses_generated.png", width: 1200, height: 630, alt: "EduSport - Școala de Patinaj" }],
  },
};

// No caching - always fetch fresh from Strapi during development.
// Switch to: export const revalidate = 300; once content is stable.
export const revalidate = 300;

type CmsShape = {
  banner?: { title?: string; subtitle?: string } | null;
  pageInfo?: {
    scheduleSubtitle?: string;
  } | null;
  disclaimers?: { id: number; text: string }[];
};

// The new unified `program` single type owns the schedule series.
type ProgramShape = {
  scheduleGroups?: ScheduleGroup[];
};

// "YYYY-MM" -> "YYYY-MM-DD" of that month's last day.
function lastDayOfMonth(yyyymm: string): string {
  const [y, m] = yyyymm.split("-").map(Number);
  const day = new Date(y, m, 0).getDate();
  return `${yyyymm}-${String(day).padStart(2, "0")}`;
}

// Shift a "YYYY-MM" month by `delta` months (negative = earlier).
function shiftMonth(yyyymm: string, delta: number): string {
  const [y, m] = yyyymm.split("-").map(Number);
  const d = new Date(y, m - 1 + delta, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

// Widen the season window so the calendar shows shoulder months (empty is fine):
// 2 months before the season starts, 3 months after it ends.
const PAD_BEFORE = 2;
const PAD_AFTER = 3;
function padSeasonBounds(
  bounds: { seasonStart: string; seasonEnd: string } | null,
): { seasonStart: string; seasonEnd: string } | null {
  if (!bounds) return null;
  return {
    seasonStart: shiftMonth(bounds.seasonStart, -PAD_BEFORE),
    seasonEnd: shiftMonth(bounds.seasonEnd, PAD_AFTER),
  };
}

export default async function Page() {
  await requireEnabled("program");

  // program-page still owns the banner / disclaimers; the new `program` single
  // type owns the schedule series; the current Sezon owns the season window.
  const [cmsResult, programResult, clubResult] = await Promise.allSettled([
    fetchStrapi<CmsShape>(
      "program-page",
      // Only `disclaimers` is a real component; the rest are JSON custom-fields.
      "populate[disclaimers]=true",
      false,
    ),
    fetchStrapi<ProgramShape>("program"),
    fetchPublicClubInfo(),
  ]);

  const cms = cmsResult.status === "fulfilled" ? cmsResult.value : null;
  const program = programResult.status === "fulfilled" ? programResult.value : null;
  const season = clubResult.status === "fulfilled" ? clubResult.value?.season ?? null : null;

  // Season window: the current Sezon's start and end month, else the default
  // season bounds so the occurrence fetch always has a range to query.
  const rawBounds =
    seasonMonthBounds(season)
    ?? (PROGRAM_PAGE_DATA.seasonStart && PROGRAM_PAGE_DATA.seasonEnd
      ? { seasonStart: PROGRAM_PAGE_DATA.seasonStart, seasonEnd: PROGRAM_PAGE_DATA.seasonEnd }
      : null);

  // Pad the window (2 months before start, 3 after end) so the calendar and its
  // navigation range include the shoulder months, even when they are empty.
  const bounds = padSeasonBounds(rawBounds);

  // The calendar-event collection (via /api/calendar/occurrences) is the only
  // source of the season calendar now. When it returns nothing, the page
  // renders with an empty calendar (see SeasonCalendarViewV2's empty state)
  // rather than falling back to any seed/legacy data.
  const rangeFrom = bounds ? `${bounds.seasonStart}-01` : null;
  const rangeTo = bounds ? lastDayOfMonth(bounds.seasonEnd) : null;
  let calendarEvents: CalendarEvent[] = [];
  if (rangeFrom && rangeTo) {
    const { occurrences } = await fetchSeasonOccurrences(rangeFrom, rangeTo);
    if (occurrences.length) calendarEvents = occurrencesToCalendarEvents(occurrences);
  }

  const data: ProgramPageData = {
    seasonLabel: season?.label ?? null,
    seasonStart: bounds?.seasonStart ?? PROGRAM_PAGE_DATA.seasonStart,
    seasonEnd: bounds?.seasonEnd ?? PROGRAM_PAGE_DATA.seasonEnd,
    bannerTitle: cms?.banner?.title ?? PROGRAM_PAGE_DATA.bannerTitle,
    bannerSubtitle: cms?.banner?.subtitle ?? PROGRAM_PAGE_DATA.bannerSubtitle,
    scheduleSubtitle: cms?.pageInfo?.scheduleSubtitle ?? PROGRAM_PAGE_DATA.scheduleSubtitle,
    scheduleGroups: program?.scheduleGroups?.length ? program.scheduleGroups : [],
    calendarEvents,
    disclaimers: cms?.disclaimers?.length
      ? cms.disclaimers.map((d) => d.text)
      : PROGRAM_PAGE_DATA.disclaimers,
  };

  return <ProgramPage data={data} />;
}
```

In `src/app/cursuri/program/_types.ts`:
- replace `  seasonLabel: string;` (in `ProgramPageData`) with

```ts
  /** Current Sezon label; null when none is current (no label shown). */
  seasonLabel: string | null;
```

- replace ` * Static text defaults (banner, disclaimers, season label/bounds) used when` with ` * Static text defaults (banner, disclaimers, season bounds) used when`;
- replace `export type ProgramPageDefaults = Omit<ProgramPageData, "scheduleGroups" | "calendarEvents">;` with `export type ProgramPageDefaults = Omit<ProgramPageData, "scheduleGroups" | "calendarEvents" | "seasonLabel">;`.

In `src/app/cursuri/program/_data.ts` delete the line `  seasonLabel: "2025–2026",`.

In `src/app/cursuri/blocks/SeasonCalendarViewV2.tsx`:
- replace `  seasonLabel?: string;` (in `SeasonCalendarViewV2Props`) with

```tsx
  /** Current Sezon label; no heading when null. */
  seasonLabel?: string | null;
```

- replace `  seasonLabel = "2025–2026",` with `  seasonLabel = null,`;
- replace

```tsx
            <h2 className="text-heading text-primary mt-2">
              Sezonul {seasonLabel}
            </h2>
```

with

```tsx
            {seasonLabel && (
              <h2 className="text-heading text-primary mt-2">
                Sezonul {seasonLabel}
              </h2>
            )}
```

- [ ] **Step 7: Run the checks**

Run: `npx tsc --noEmit`, `npm run lint`, `npm run check:tokens`, `npm run test:scripts`.
Expected: zero type errors, no new lint warnings, tokens exit 0, all tests pass. `grep -rn "\"pricing\"\|2025–2026\|Sezonul curent" src/app` finds nothing; `CURRENT_SEASON` is left only in `cursuri/_data.ts` and the old `inscrieri/page.tsx`.

- [ ] **Step 8: Commit**

```bash
git add src/app/cursuri/page.tsx src/app/cursuri/_types.ts src/app/cursuri/_types_pricing.ts \
  src/app/cursuri/_View.tsx src/app/cursuri/blocks/CoursesBannerSection.tsx src/app/cursuri/blocks/PricingSection.tsx \
  src/app/cursuri/blocks/SeasonCalendarViewV2.tsx src/app/cursuri/regulament/page.tsx src/app/cursuri/regulament/_View.tsx \
  src/app/cursuri/program/page.tsx src/app/cursuri/program/_types.ts src/app/cursuri/program/_data.ts src/app/page.tsx \
  src/app/landing-v2/blocks/RegistrationSectionV2.tsx src/app/homepage/blocks/RegistrationClosedSection.tsx
git commit -m "feat(site): season and prices from the Sezoane and Prețuri admin data"
```

---

### Task 3: Shared Cursuri rows (WeekendRow, ItemTooltip)

**Files:**
- Create: `src/app/cursuri/blocks/WeekendRow.tsx` (moved verbatim from `SeasonCalendarViewV2.tsx`)
- Create: `src/app/cursuri/blocks/ItemTooltip.tsx` (moved verbatim from `PricingSection.tsx`)
- Modify: `src/app/cursuri/blocks/SeasonCalendarViewV2.tsx` (imports; delete the moved code)
- Modify: `src/app/cursuri/blocks/PricingSection.tsx` (imports; delete the moved code)
- Test: no behaviour change; type-check, lint and tokens. Task 7's flow test renders both through the form and /cursuri.

**Interfaces:**
- Consumes: nothing new.
- Produces:
  - `WeekendRow` (default and named export), props `{ card: WeekendCardData; nextActiveWeekend: WeekendDate | null }`; `type WeekendKind = "curs" | "liber" | "anulat"`; `interface WeekendCardData { weekend: WeekendDate; type: WeekendKind }`
  - `ItemTooltip` (default export), props `{ text: string }`

The registration form shows the next weekends "with the site Weekenduri Școala patinaj design" (DECISIONS 2026-10-03) and the price tooltips of the Cursuri cards. Moving the two components keeps one copy of each; importing them from `SeasonCalendarViewV2` would pull FullCalendar into the form's bundle.

- [ ] **Step 1: Create the two files**

`src/app/cursuri/blocks/WeekendRow.tsx`:

```tsx
"use client";

import { cn } from "@/utils/cn";
import React from "react";
import { WeekendDate, isWeekendInPast, isNextWeekend } from "@/utils/date";
import {
  CALENDAR_GROUP,
  type CalendarGroup,
} from "@/components/blocks/fullcalendar/calendar-colors";
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { renderMarkdown } from "@/utils/markdown";
import { format } from "date-fns";
import { ro } from "date-fns/locale";

// One row of the "Weekenduri Școala Patinaj" list: status square, dates and
// state (Curs / Liber / Curs anulat), the next weekend highlighted, cancelled
// ones struck through with their reason in a tooltip. Lifted out of
// SeasonCalendarViewV2 so the registration form shows the same rows.

export type WeekendKind = "curs" | "liber" | "anulat";

export interface WeekendCardData {
  weekend: WeekendDate;
  type: WeekendKind;
}

const STATE_LABEL: Record<WeekendKind, string> = {
  curs: "Curs",
  liber: "Liber",
  anulat: "Curs anulat",
};

// Same colours as the grid tiles and the legend.
const STATE_GROUP: Record<WeekendKind, CalendarGroup> = {
  curs: "scoala",
  liber: "liber",
  anulat: "anulat",
};

export const WeekendRow: React.FC<{
  card: WeekendCardData;
  nextActiveWeekend: WeekendDate | null;
}> = ({ card, nextActiveWeekend }) => {
  const isPast = isWeekendInPast(card.weekend);
  const isCancelled = card.type === "anulat";
  const isNext = !isCancelled && isNextWeekend(card.weekend, nextActiveWeekend);

  const startLabel = format(card.weekend.startDate, "d MMM", { locale: ro });
  const endLabel =
    card.weekend.startDate.getTime() !== card.weekend.endDate.getTime()
      ? format(card.weekend.endDate, "d MMM", { locale: ro })
      : null;

  const stateLabel = isNext ? "Curs" : STATE_LABEL[card.type];
  const description = card.weekend.description ?? null;
  const hasDescription =
    isCancelled && !!description && description.trim().length > 0;

  const squareColor = CALENDAR_GROUP[STATE_GROUP[card.type]].bg;
  const stateColor = isPast
    ? "text-disabled"
    : isNext
    ? "text-primary font-bold"
    : isCancelled
      ? "text-accent font-medium"
      : card.type === "curs"
        ? "text-secondary"
        : "text-secondary";

  const row = (
    <div
      className={cn(
        "flex items-center px-4 py-3 text-sm border-t border-line-subtle first:border-t-0 transition-colors",
        isNext && "bg-surface-highlight",
        hasDescription && "cursor-help",
      )}
    >
      {/* Status square */}
      <span
        className="w-2.5 h-2.5 flex-shrink-0 mr-3"
        style={{ backgroundColor: squareColor }}
      />

      {/* Date */}
      <span
        className={cn(
          "flex-1 tabular-nums whitespace-nowrap text-primary",
          isCancelled && "line-through text-secondary",
          isPast && "text-disabled",
        )}
      >
        {startLabel}
        {endLabel ? ` - ${endLabel}` : ""}
      </span>

      {/* Status label */}
      <span className={cn("text-xs", stateColor)}>{stateLabel}</span>
    </div>
  );

  if (!hasDescription) return row;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{row}</TooltipTrigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          side="top"
          align="center"
          sideOffset={2}
          collisionPadding={12}
          className="text-caption z-sticky max-w-[320px] bg-surface text-secondary border-retro border-line shadow-retro px-3 py-3 space-y-2 animate-in fade-in-0 zoom-in-95"
        >
          <p className="text-label uppercase text-accent">
            {stateLabel}
          </p>
          <div className="space-y-2 [&_p]:m-0 [&_p]:text-inherit [&_strong]:font-semibold [&_strong]:text-primary">
            {renderMarkdown(description)}
          </div>
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </Tooltip>
  );
};

export default WeekendRow;
```

`src/app/cursuri/blocks/ItemTooltip.tsx`:

```tsx
"use client";

import React, { useState } from "react";
import IconButton from "@/components/ui/icon-button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/**
 * The "i" button next to a price name, opening the price item's tooltip
 * (Prețuri: "Tooltip"). Tap toggles it, so it also works on phones. Shared by
 * the Cursuri price cards and the price box of the registration form.
 */
const ItemTooltip: React.FC<{ text: string }> = ({ text }) => {
  const [open, setOpen] = useState(false);
  return (
    <Tooltip open={open} onOpenChange={setOpen}>
      <TooltipTrigger asChild>
        <IconButton
          icon="info"
          label="Detalii"
          size="sm"
          onClick={() => setOpen((v) => !v)}
          className="-my-3 -mx-3 text-secondary"
        />
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-60">
        {text}
      </TooltipContent>
    </Tooltip>
  );
};

export default ItemTooltip;
```

- [ ] **Step 2: SeasonCalendarViewV2 uses WeekendRow**

In `src/app/cursuri/blocks/SeasonCalendarViewV2.tsx`:

Replace `import { WeekendDate, isWeekendInPast, isNextWeekend } from "@/utils/date";` with

```tsx
import { WeekendDate, isWeekendInPast } from "@/utils/date";
import WeekendRow, { type WeekendCardData } from "./WeekendRow";
```

In the `calendar-colors` import delete the line `  CALENDAR_GROUP,` (keep `CALENDAR_GROUPS` and `type CalendarGroup`). Delete the three imports

```tsx
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { renderMarkdown } from "@/utils/markdown";
```

Delete, under `// ─── Weekend card data ───`, the `type WeekendKind = ...;` line and the `interface WeekendCardData { ... }` block (keep `interface MonthGroup`). Delete, under `// ─── Sub-components ───`, `const STATE_LABEL`, `const STATE_GROUP` (with its comment) and the whole `const WeekendRow: React.FC<...> = (...) => { ... };` component, up to (not including) `const MonthColumn: React.FC<{`. `MonthColumn` keeps rendering `<WeekendRow ... />`, now the imported one.

- [ ] **Step 3: PricingSection uses ItemTooltip**

In `src/app/cursuri/blocks/PricingSection.tsx` replace

```tsx
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/utils/cn";
import IconButton from "@/components/ui/icon-button";
import React, { useState } from "react";
import type { PricingTier } from "../_types_pricing";
```

with

```tsx
import { cn } from "@/utils/cn";
import React from "react";
import type { PricingTier } from "../_types_pricing";
import ItemTooltip from "./ItemTooltip";
```

and delete the local `const ItemTooltip: React.FC<{ text: string }> = ... };` component (up to `const CARD =`).

- [ ] **Step 4: Run the checks**

Run: `npx tsc --noEmit`, `npx eslint src/app/cursuri/blocks`, `npm run check:tokens`.
Expected: zero errors, no warnings in these files, tokens exit 0.

- [ ] **Step 5: Commit**

```bash
git add src/app/cursuri/blocks/WeekendRow.tsx src/app/cursuri/blocks/ItemTooltip.tsx \
  src/app/cursuri/blocks/SeasonCalendarViewV2.tsx src/app/cursuri/blocks/PricingSection.tsx
git commit -m "refactor(cursuri): share the weekend row and the price tooltip"
```

---

### Task 4: Form rules (follow-ups, school, schedule, payload, response)

**Files:**
- Create: `src/app/inscrieri/_rules.ts`, `src/app/inscrieri/_school.ts`, `src/app/inscrieri/_schedule.ts`
- Test: `scripts/inscrieri/rules.test.mjs`, `scripts/inscrieri/school.test.mjs`, `scripts/inscrieri/schedule.test.mjs`

**Interfaces:**
- Consumes: `CustomAnswer`, `FormStepConfig` from `src/lib/strapi-forms.ts` (types only); the 2A request body (`readRegistrationInput`) and response (`SubmitResult` + 2D fields).
- Produces (`_rules.ts`):
  - `RELATIONSHIP_OTHER = "alta"`, `SOURCE_OTHER = "Altele"`, `MEMBERSHIP_YES = "da"`, `type DocumentKind = "acord" | "adeziune"`
  - `isFollowUpShown(key, answers): boolean`, `prepareStep(step, answers, subscription: { value; label }[]): FormStepConfig`
  - `applyAnswer(answers, key, value, offeredFor: (membershipAnswer: string) => string[]): Record<string, CustomAnswer>`
  - `CHILD_HEIGHT_ERROR`, `childHeightError(value): string | undefined`
  - `buildPayload(answers, website): Record<string, unknown>`
  - `type SubmitSuccess = { ok: true; registrationNumber: string; downloadToken: string | null; documents: DocumentKind[] }`, `type SubmitFailure = { ok: false; code: string | null; error: string | null }`, `parseSubmitResponse(data: unknown, httpOk: boolean)`
  - `documentUrl(base, token, kind): string`, `DOWNLOAD_LABELS`, `expectedDocuments(membershipAnswer): DocumentKind[]`, `signingSentence(documentCount): string`
  - `splitOnLink(label, linkLabel): { before; link; after } | null`
- Produces (`_school.ts`): `type SchoolResolution<T>`, `resolveSchool<T extends { slug: string }>(schools: T[], slug: string | null)`, `showsPinnedSchool(schoolCount): boolean`
- Produces (`_schedule.ts`): `type WeekendState`, `type ScheduleWeekend = { startDate; endDate; state; description }`, `type ScheduleMonth`, `nextMonthWindow(today: Date): { from; to }`, `scheduleWeekends(events, window): ScheduleWeekend[]`, `groupByMonth(weekends): ScheduleMonth[]`

Rules, from the script form and 2A: "Specificați calitatea" appears and is required only with "Alta", "Vă rugăm să specificați de unde ați aflat de noi" only with "Altele", and their text is cleared when the trigger answer changes (the script does the same). The abonament options depend on membership; changing the membership answer drops a choice the new answer does not offer. Child height uses the backend rule (whole centimetres, 50-230) and the backend message. The body carries `subscriptionChoice: { priceItemName }` only; price and membership are set by the server. A school is chosen by `?scoala=`, or is the only one; an unknown slug shows the chooser with "Școala nu a fost găsită." (2A refuses it as `unknown-school`). "Programul pe următoarea lună" covers today to the same day next month (the mockup shows 10 oct to 8 noi for 10 October).

- [ ] **Step 1: Write the failing tests**

`scripts/inscrieri/rules.test.mjs`:

```js
// Loads the TypeScript source directly (node >= 22.18 strips types natively).
// src/app/inscrieri/_rules.ts has only type imports, which is what makes this possible.
import { test } from "node:test";
import assert from "node:assert/strict";

// CI runs Node 20, which cannot import .ts files: skip there instead of failing.
const canStripTypes = Boolean(process.features?.typescript);
const rules = canStripTypes ? await import("../../src/app/inscrieri/_rules.ts") : {};
const it = canStripTypes ? test : (name) => test.skip(name);

const STEP = {
  key: "date",
  title: "Date înscriere",
  questions: [
    { key: "relationship", type: "select", label: "Calitatea față de sportiv:", required: true },
    { key: "relationshipOther", type: "text", label: "Specificați calitatea (ex: Bunic, Frate):", required: false },
    { key: "subscriptionChoice", type: "select", label: "La primul modul doriți să achiziționați:", required: true, options: [] },
    { key: "source", type: "select", required: true },
    { key: "sourceOther", type: "text", required: false },
  ],
};
const keys = (step) => step.questions.map((q) => q.key);

it("prepareStep hides the Alta / Altele fields until their answer is picked", () => {
  assert.deepEqual(keys(rules.prepareStep(STEP, {}, [])), ["relationship", "subscriptionChoice", "source"]);
  const shown = rules.prepareStep(STEP, { relationship: "alta", source: "Altele" }, []);
  assert.deepEqual(keys(shown), ["relationship", "relationshipOther", "subscriptionChoice", "source", "sourceOther"]);
  assert.equal(shown.questions[1].required, true);
  assert.equal(shown.questions[4].required, true);
});

it("prepareStep fills the abonament options from the price lists", () => {
  const step = rules.prepareStep(STEP, {}, [{ value: "Abonament 8 ședințe grup", label: "Abonament 8 ședințe grup" }]);
  assert.deepEqual(step.questions.find((q) => q.key === "subscriptionChoice").options, [
    { value: "Abonament 8 ședințe grup", label: "Abonament 8 ședințe grup", enabled: true },
  ]);
  assert.deepEqual(STEP.questions[2].options, [], "input untouched");
});

const offeredFor = (m) => (m === "da" ? ["Abonament 8 ședințe grup", "Abonament Avansați Gold 8 ședințe"] : ["Abonament 8 ședințe grup", "1 ședință grup"]);

it("applyAnswer clears a follow-up when its answer goes away", () => {
  const before = { relationship: "alta", relationshipOther: "Bunic" };
  assert.deepEqual(rules.applyAnswer(before, "relationship", "parinte", offeredFor), { relationship: "parinte" });
  assert.deepEqual(rules.applyAnswer(before, "relationshipOther", "Frate", offeredFor), { relationship: "alta", relationshipOther: "Frate" });
  assert.deepEqual(rules.applyAnswer({ source: "Altele", sourceOther: "Ziar" }, "source", "Facebook", offeredFor), { source: "Facebook" });
});

it("applyAnswer drops an abonament the new membership answer does not offer", () => {
  const gold = { membershipAnswer: "da", subscriptionChoice: "Abonament Avansați Gold 8 ședințe" };
  assert.deepEqual(rules.applyAnswer(gold, "membershipAnswer", "nu", offeredFor), { membershipAnswer: "nu" });
  const eight = { membershipAnswer: "da", subscriptionChoice: "Abonament 8 ședințe grup" };
  assert.deepEqual(rules.applyAnswer(eight, "membershipAnswer", "nu", offeredFor), { membershipAnswer: "nu", subscriptionChoice: "Abonament 8 ședințe grup" });
});

it("childHeightError follows the backend rule", () => {
  for (const ok of ["132", "50", "230", " 99 ", "", undefined]) assert.equal(rules.childHeightError(ok), undefined, String(ok));
  for (const bad of ["49", "231", "13a", "1.32", "1320", "1,32 m"]) assert.equal(rules.childHeightError(bad), rules.CHILD_HEIGHT_ERROR, bad);
});

const ANSWERS = {
  email: " ana.pop@example.com ",
  parentName: "Ana Pop",
  relationship: "parinte",
  relationshipOther: "rămas din altă alegere",
  phone: "0712345678",
  childName: "Maria Pop",
  childBirthDate: "14.03.2016",
  childHeight: "132",
  shirtSize: "S",
  lastSeason: "Nu a participat",
  priorExperience: "Nu este cazul",
  expectations: "Să învețe să patineze",
  membershipAnswer: "da",
  subscriptionChoice: "Abonament 8 ședințe grup",
  source: "Altele",
  sourceOther: "Ziar",
  gdprConsent: true,
  regulationsConsent: true,
  level: "câmp vechi din draft",
};

it("buildPayload sends the script form answers and only the abonament name", () => {
  assert.deepEqual(rules.buildPayload(ANSWERS, ""), {
    email: "ana.pop@example.com",
    parentName: "Ana Pop",
    relationship: "parinte",
    phone: "0712345678",
    childName: "Maria Pop",
    childBirthDate: "14.03.2016",
    childHeight: "132",
    shirtSize: "S",
    lastSeason: "Nu a participat",
    priorExperience: "Nu este cazul",
    expectations: "Să învețe să patineze",
    membershipAnswer: "da",
    source: "Altele",
    sourceOther: "Ziar",
    subscriptionChoice: { priceItemName: "Abonament 8 ședințe grup" },
    gdprConsent: true,
    regulationsConsent: true,
    website: "",
  });
});

it("buildPayload keeps the honeypot and unticked consents as they are", () => {
  const out = rules.buildPayload({ gdprConsent: "true" }, "spam");
  assert.equal(out.website, "spam");
  assert.equal(out.gdprConsent, false);
  assert.equal(out.regulationsConsent, false);
  assert.deepEqual(out.subscriptionChoice, { priceItemName: "" });
});

it("parseSubmitResponse reads the 2A + 2D success", () => {
  assert.deepEqual(
    rules.parseSubmitResponse({ ok: true, registrationNumber: "2026-0142", downloadToken: "tok", documents: ["acord", "adeziune", "x"] }, true),
    { ok: true, registrationNumber: "2026-0142", downloadToken: "tok", documents: ["acord", "adeziune"] },
  );
});

it("parseSubmitResponse: a success without a token offers no download", () => {
  assert.deepEqual(rules.parseSubmitResponse({ ok: true, registrationNumber: "2026-0142", documents: ["acord"] }, true), {
    ok: true,
    registrationNumber: "2026-0142",
    downloadToken: null,
    documents: [],
  });
});

it("parseSubmitResponse passes the backend error through, else none", () => {
  assert.deepEqual(rules.parseSubmitResponse({ ok: false, code: "closed", error: "Înscrierile sunt închise." }, false), {
    ok: false,
    code: "closed",
    error: "Înscrierile sunt închise.",
  });
  assert.deepEqual(rules.parseSubmitResponse(null, false), { ok: false, code: null, error: null });
  assert.equal(rules.parseSubmitResponse({ ok: true }, true).ok, false, "no number is not a success");
  assert.equal(rules.parseSubmitResponse({ ok: true, registrationNumber: "2026-0001" }, false).ok, false);
});

it("documentUrl builds the 2D link", () => {
  assert.equal(
    rules.documentUrl("https://cms.example.ro", "a.b+c/=", "adeziune"),
    "https://cms.example.ro/api/forms/inscriere/documents?token=a.b%2Bc%2F%3D&kind=adeziune",
  );
});

it("signing sentence: plural, or singular with only the Acord", () => {
  assert.equal(rules.signingSentence(2), "Documentele vor fi semnate la prima ședință de curs.");
  assert.equal(rules.signingSentence(1), "Documentul va fi semnat la prima ședință de curs.");
  assert.deepEqual(rules.expectedDocuments("da"), ["acord", "adeziune"]);
  assert.deepEqual(rules.expectedDocuments("nu"), ["acord"]);
});

it("splitOnLink turns the document name into a link", () => {
  assert.deepEqual(
    rules.splitOnLink("Confirm citirea documentului Politica de Confidențialitate și sunt de acord cu prelucrarea datelor.", "Politica de Confidențialitate"),
    { before: "Confirm citirea documentului ", link: "Politica de Confidențialitate", after: " și sunt de acord cu prelucrarea datelor." },
  );
  assert.equal(rules.splitOnLink("Text schimbat de admin.", "Politica de Confidențialitate"), null);
  assert.equal(rules.splitOnLink("Orice", ""), null);
});
```

`scripts/inscrieri/school.test.mjs`:

```js
import { test } from "node:test";
import assert from "node:assert/strict";

// CI runs Node 20, which cannot import .ts files: skip there instead of failing.
const canStripTypes = Boolean(process.features?.typescript);
const { resolveSchool, showsPinnedSchool } = canStripTypes ? await import("../../src/app/inscrieri/_school.ts") : {};
const it = canStripTypes ? test : (name) => test.skip(name);

const afi = { name: "Școala de Patinaj - AFI Cotroceni", slug: "afi-cotroceni" };
const two = { name: "Școala de Patinaj - Patinoar 2", slug: "patinoar-2" };

it("one school: chosen without asking", () => {
  assert.deepEqual(resolveSchool([afi], null), { state: "chosen", school: afi });
  assert.deepEqual(resolveSchool([afi], "afi-cotroceni"), { state: "chosen", school: afi });
  assert.equal(showsPinnedSchool(1), false);
});

it("?scoala picks the school, ignoring case and spaces", () => {
  assert.deepEqual(resolveSchool([afi, two], " Patinoar-2 "), { state: "chosen", school: two });
});

it("2+ schools and no ?scoala: Alege școala, pinned afterwards", () => {
  assert.deepEqual(resolveSchool([afi, two], null), { state: "choose", schools: [afi, two], unknownSlug: false });
  assert.equal(showsPinnedSchool(2), true);
});

it("an unknown ?scoala is never mapped to another school", () => {
  assert.deepEqual(resolveSchool([afi], "club"), { state: "choose", schools: [afi], unknownSlug: true });
  assert.deepEqual(resolveSchool([afi, two], "nu-exista"), { state: "choose", schools: [afi, two], unknownSlug: true });
});

it("no school: nothing to register for", () => {
  assert.deepEqual(resolveSchool([], null), { state: "none" });
  assert.deepEqual(resolveSchool([], "afi-cotroceni"), { state: "none" });
});
```

`scripts/inscrieri/schedule.test.mjs`:

```js
import { test } from "node:test";
import assert from "node:assert/strict";

// CI runs Node 20, which cannot import .ts files: skip there instead of failing.
const canStripTypes = Boolean(process.features?.typescript);
const s = canStripTypes ? await import("../../src/app/inscrieri/_schedule.ts") : {};
const it = canStripTypes ? test : (name) => test.skip(name);

it("nextMonthWindow runs to the same day next month", () => {
  assert.deepEqual(s.nextMonthWindow(new Date(2026, 9, 10)), { from: "2026-10-10", to: "2026-11-10" });
  assert.deepEqual(s.nextMonthWindow(new Date(2026, 11, 20)), { from: "2026-12-20", to: "2027-01-20" });
  assert.deepEqual(s.nextMonthWindow(new Date(2027, 0, 31)), { from: "2027-01-31", to: "2027-02-28" });
});

const ev = (type, startDate, endDate, description = null) => ({ type, startDate, endDate, description });
const EVENTS = [
  ev("scoala", "2026-10-10", "2026-10-10"),
  ev("curs", "2026-10-17", "2026-10-18"),
  ev("curs", "2026-10-10", "2026-10-11"),
  ev("anulat", "2026-10-24", "2026-10-25", "Patinoar închis"),
  ev("liber", "2026-10-31", "2026-11-01"),
  ev("concurs", "2026-11-07", "2026-11-08"),
  ev("curs", "2026-11-07", "2026-11-08"),
  ev("curs", "2026-11-14", "2026-11-15"),
  ev("curs", "2026-10-03", "2026-10-04"),
];
const WINDOW = { from: "2026-10-10", to: "2026-11-10" };

it("scheduleWeekends keeps the weekend events in the window, oldest first", () => {
  assert.deepEqual(s.scheduleWeekends(EVENTS, WINDOW), [
    { startDate: "2026-10-10", endDate: "2026-10-11", state: "curs", description: null },
    { startDate: "2026-10-17", endDate: "2026-10-18", state: "curs", description: null },
    { startDate: "2026-10-24", endDate: "2026-10-25", state: "anulat", description: "Patinoar închis" },
    { startDate: "2026-10-31", endDate: "2026-11-01", state: "liber", description: null },
    { startDate: "2026-11-07", endDate: "2026-11-08", state: "curs", description: null },
  ]);
});

it("a weekend that started yesterday still shows", () => {
  assert.equal(s.scheduleWeekends([ev("curs", "2026-10-10", "2026-10-11")], { from: "2026-10-11", to: "2026-11-11" }).length, 1);
});

it("groupByMonth splits by the month a weekend starts in", () => {
  const months = s.groupByMonth(s.scheduleWeekends(EVENTS, WINDOW));
  assert.deepEqual(months.map((m) => [m.month, m.weekends.length]), [["2026-10", 4], ["2026-11", 1]]);
  assert.deepEqual(s.groupByMonth([]), []);
});
```

- [ ] **Step 2: Run the tests to see them fail**

Run: `node --test scripts/inscrieri/rules.test.mjs scripts/inscrieri/school.test.mjs scripts/inscrieri/schedule.test.mjs`
Expected: FAIL (`Cannot find module .../src/app/inscrieri/_rules.ts` and the two others).

- [ ] **Step 3: Implement the three modules**

`src/app/inscrieri/_rules.ts`:

```ts
// ---------------------------------------------------------------------------
// Rules of the registration form that are not in the CMS config: the "Alta" /
// "Altele" follow-up fields, the abonament options per membership, the child
// height check, the submit payload and the submit response.
//
// Values mirror the backend (src/club/registration-form-options.ts and
// src/club/registration-input.ts, plan 2A). No runtime imports on purpose:
// scripts/inscrieri/rules.test.mjs loads this file with node's type stripping.
// ---------------------------------------------------------------------------

import type { CustomAnswer, FormStepConfig } from "@/lib/strapi-forms";

export const RELATIONSHIP_OTHER = "alta";
export const SOURCE_OTHER = "Altele";
export const MEMBERSHIP_YES = "da";

export type DocumentKind = "acord" | "adeziune";

/** A follow-up text field, shown and required only for one answer of its parent select. */
const FOLLOW_UPS: Record<string, { parent: string; value: string }> = {
  relationshipOther: { parent: "relationship", value: RELATIONSHIP_OTHER },
  sourceOther: { parent: "source", value: SOURCE_OTHER },
};

export function isFollowUpShown(key: string, answers: Record<string, CustomAnswer>): boolean {
  const rule = FOLLOW_UPS[key];
  return !rule || answers[rule.parent] === rule.value;
}

/**
 * The step as the parent sees it: follow-ups hidden unless their trigger answer
 * is picked (then required, as in the script form), and the abonament select
 * filled with the options offered for the chosen membership.
 */
export function prepareStep(
  step: FormStepConfig,
  answers: Record<string, CustomAnswer>,
  subscription: { value: string; label: string }[],
): FormStepConfig {
  const questions = (step.questions ?? [])
    .filter((q) => isFollowUpShown(q.key, answers))
    .map((q) => {
      if (FOLLOW_UPS[q.key]) return { ...q, required: true };
      if (q.key === "subscriptionChoice") {
        return { ...q, options: subscription.map((o) => ({ ...o, enabled: true })) };
      }
      return q;
    });
  return { ...step, questions };
}

/**
 * One answer changed. A follow-up loses its text when its trigger answer goes
 * away (the script form clears it too), and the abonament choice is dropped
 * when the new membership answer does not offer it.
 */
export function applyAnswer(
  answers: Record<string, CustomAnswer>,
  key: string,
  value: CustomAnswer,
  offeredFor: (membershipAnswer: string) => string[],
): Record<string, CustomAnswer> {
  const next: Record<string, CustomAnswer> = { ...answers, [key]: value };
  for (const [child, rule] of Object.entries(FOLLOW_UPS)) {
    if (rule.parent === key && value !== rule.value) delete next[child];
  }
  if (key === "membershipAnswer" && typeof next.subscriptionChoice === "string") {
    if (!offeredFor(String(value)).includes(next.subscriptionChoice)) delete next.subscriptionChoice;
  }
  return next;
}

export const CHILD_HEIGHT_ERROR = "Înălțimea copilului nu este validă.";

/** Same rule as the backend: whole centimetres, 50 to 230. Empty passes (required is checked apart). */
export function childHeightError(value: CustomAnswer | undefined): string | undefined {
  if (typeof value !== "string" || value.trim() === "") return undefined;
  const raw = value.trim();
  if (!/^\d{2,3}$/.test(raw)) return CHILD_HEIGHT_ERROR;
  const cm = Number(raw);
  return cm >= 50 && cm <= 230 ? undefined : CHILD_HEIGHT_ERROR;
}

const TEXT_KEYS = [
  "email",
  "parentName",
  "relationship",
  "phone",
  "childName",
  "childBirthDate",
  "childHeight",
  "shirtSize",
  "lastSeason",
  "priorExperience",
  "expectations",
  "membershipAnswer",
  "source",
] as const;

const str = (v: CustomAnswer | undefined): string => (typeof v === "string" ? v.trim() : "");

/**
 * The POST /api/forms/inscriere body (backend `readRegistrationInput`). Only the
 * item name of the abonament is sent: the server sets the price and membership.
 */
export function buildPayload(answers: Record<string, CustomAnswer>, website: string): Record<string, unknown> {
  const payload: Record<string, unknown> = Object.fromEntries(TEXT_KEYS.map((k) => [k, str(answers[k])]));
  if (isFollowUpShown("relationshipOther", answers)) payload.relationshipOther = str(answers.relationshipOther);
  if (isFollowUpShown("sourceOther", answers)) payload.sourceOther = str(answers.sourceOther);
  payload.subscriptionChoice = { priceItemName: str(answers.subscriptionChoice) };
  payload.gdprConsent = answers.gdprConsent === true;
  payload.regulationsConsent = answers.regulationsConsent === true;
  payload.website = website;
  return payload;
}

export type SubmitSuccess = {
  ok: true;
  registrationNumber: string;
  downloadToken: string | null;
  documents: DocumentKind[];
};
export type SubmitFailure = { ok: false; code: string | null; error: string | null };

const isKind = (v: unknown): v is DocumentKind => v === "acord" || v === "adeziune";

/**
 * Reads `{ ok: true, registrationNumber, downloadToken, documents }` (plans 2A + 2D)
 * or `{ ok: false, code, error }`. A success without a token (2D not deployed,
 * or the PDFs failed) still counts: the success screen then has no download.
 */
export function parseSubmitResponse(data: unknown, httpOk: boolean): SubmitSuccess | SubmitFailure {
  const body = (typeof data === "object" && data !== null ? data : {}) as Record<string, unknown>;
  const number = typeof body.registrationNumber === "string" ? body.registrationNumber : "";
  if (httpOk && body.ok === true && number) {
    const token = typeof body.downloadToken === "string" && body.downloadToken ? body.downloadToken : null;
    const documents = Array.isArray(body.documents) ? body.documents.filter(isKind) : [];
    return { ok: true, registrationNumber: number, downloadToken: token, documents: token ? documents : [] };
  }
  return {
    ok: false,
    code: typeof body.code === "string" ? body.code : null,
    error: typeof body.error === "string" && body.error ? body.error : null,
  };
}

/** The public PDF route of plan 2D; the token is valid 24 hours. */
export function documentUrl(base: string, token: string, kind: DocumentKind): string {
  return `${base}/api/forms/inscriere/documents?token=${encodeURIComponent(token)}&kind=${kind}`;
}

export const DOWNLOAD_LABELS: Record<DocumentKind, string> = {
  acord: "Descarcă formularul (PDF)",
  adeziune: "Descarcă cererea de adeziune (PDF)",
};

/** Acord always; Cerere de adeziune with "Da" to membership (spec 4.1). */
export function expectedDocuments(membershipAnswer: CustomAnswer | undefined): DocumentKind[] {
  return membershipAnswer === MEMBERSHIP_YES ? ["acord", "adeziune"] : ["acord"];
}

/** DECISIONS 2026-10-05: plural, or singular with only the Acord. */
export function signingSentence(documentCount: number): string {
  return documentCount > 1
    ? "Documentele vor fi semnate la prima ședință de curs."
    : "Documentul va fi semnat la prima ședință de curs.";
}

/**
 * A consent label with its document name turned into a link: the label text
 * around the first occurrence of `linkLabel`. Null when the label does not
 * contain it (an admin reworded one of them), so the caller links separately.
 */
export function splitOnLink(label: string, linkLabel: string): { before: string; link: string; after: string } | null {
  const at = linkLabel ? label.indexOf(linkLabel) : -1;
  if (at < 0) return null;
  return { before: label.slice(0, at), link: linkLabel, after: label.slice(at + linkLabel.length) };
}
```

`src/app/inscrieri/_school.ts`:

```ts
// ---------------------------------------------------------------------------
// Which school a registration is for (spec 3.3): `?scoala=<slug>`, or the only
// school with a public page, or "Alege școala" when there are 2 or more.
// No runtime imports: scripts/inscrieri/school.test.mjs loads this file.
// ---------------------------------------------------------------------------

export type SchoolResolution<T> =
  | { state: "chosen"; school: T }
  | { state: "choose"; schools: T[]; unknownSlug: boolean }
  | { state: "none" };

/**
 * An unknown slug is never mapped to another school (the backend refuses it
 * too): the parent sees "Școala nu a fost găsită." above the list.
 */
export function resolveSchool<T extends { slug: string }>(schools: T[], slug: string | null): SchoolResolution<T> {
  if (!schools.length) return { state: "none" };
  const wanted = (slug ?? "").trim().toLowerCase();
  if (wanted) {
    const hit = schools.find((s) => s.slug === wanted);
    return hit ? { state: "chosen", school: hit } : { state: "choose", schools, unknownSlug: true };
  }
  if (schools.length === 1) return { state: "chosen", school: schools[0] };
  return { state: "choose", schools, unknownSlug: false };
}

/** The chosen school stays at the top of every step only when there was a choice. */
export function showsPinnedSchool(schoolCount: number): boolean {
  return schoolCount >= 2;
}
```

`src/app/inscrieri/_schedule.ts`:

```ts
// ---------------------------------------------------------------------------
// "Programul pe următoarea lună" on the Abonament step: the Școala de patinaj
// weekends from today to the same day next month, from the site calendar
// (/api/calendar/occurrences, turned into weekend events by
// utils/occurrences-to-calendar.ts, as on /cursuri/program).
// No runtime imports: scripts/inscrieri/schedule.test.mjs loads this file.
// ---------------------------------------------------------------------------

export type WeekendState = "curs" | "liber" | "anulat";

/** One weekend row. Plain strings, so the server page can pass it to the client form. */
export type ScheduleWeekend = {
  startDate: string; // YYYY-MM-DD
  endDate: string;
  state: WeekendState;
  description: string | null;
};

export type ScheduleMonth = { month: string; weekends: ScheduleWeekend[] }; // month = "YYYY-MM"

const pad = (n: number) => String(n).padStart(2, "0");
const ymd = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

/** Today to the same day next month (31 January -> 28/29 February), local dates. */
export function nextMonthWindow(today: Date): { from: string; to: string } {
  const y = today.getFullYear();
  const m = today.getMonth();
  const lastDay = new Date(y, m + 2, 0).getDate();
  const to = new Date(y, m + 1, Math.min(today.getDate(), lastDay));
  return { from: ymd(today), to: ymd(to) };
}

const STATES: readonly WeekendState[] = ["curs", "liber", "anulat"];

/** The weekend events touching the window, oldest first. Other calendar events are dropped. */
export function scheduleWeekends(
  events: { type: string; startDate: string; endDate: string; description?: string | null }[],
  window: { from: string; to: string },
): ScheduleWeekend[] {
  return events
    .filter((e) => (STATES as readonly string[]).includes(e.type))
    .filter((e) => e.endDate >= window.from && e.startDate <= window.to)
    .map((e) => ({ startDate: e.startDate, endDate: e.endDate, state: e.type as WeekendState, description: e.description ?? null }))
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
}

export function groupByMonth(weekends: ScheduleWeekend[]): ScheduleMonth[] {
  const months: ScheduleMonth[] = [];
  for (const w of weekends) {
    const month = w.startDate.slice(0, 7);
    const last = months[months.length - 1];
    if (last && last.month === month) last.weekends.push(w);
    else months.push({ month, weekends: [w] });
  }
  return months;
}
```

- [ ] **Step 4: Run the tests to see them pass**

Run: `node --test scripts/inscrieri/rules.test.mjs scripts/inscrieri/school.test.mjs scripts/inscrieri/schedule.test.mjs`
Expected: PASS. Then `npx tsc --noEmit`, `npm run lint`, `npm run test:scripts`: all pass.

- [ ] **Step 5: Commit**

```bash
git add src/app/inscrieri/_rules.ts src/app/inscrieri/_school.ts src/app/inscrieri/_schedule.ts \
  scripts/inscrieri/rules.test.mjs scripts/inscrieri/school.test.mjs scripts/inscrieri/schedule.test.mjs
git commit -m "feat(inscrieri): rules of the script form, school choice and next-month schedule"
```

---

### Task 5: Form building blocks

**Files:**
- Create: `src/app/inscrieri/_submit.ts`, `_Step.tsx`, `_Abonament.tsx`, `_Consent.tsx`, `_SchoolPicker.tsx`, `_Success.tsx`
- Modify: `src/components/ui/custom-questions.tsx` (select placeholder per key)
- Test: type-check, lint and tokens here; behaviour is exercised by the flow test in Task 7 (the repo has no component test runner, and these files have runtime imports, so `node --test` cannot load them).

**Interfaces:**
- Consumes: Task 1 (`formatRon`, `PriceBox`, `Upsell`); Task 3 (`WeekendRow`, `ItemTooltip`); Task 4 (`buildPayload`, `parseSubmitResponse`, `SubmitSuccess`, `SubmitFailure`, `splitOnLink`, `DOWNLOAD_LABELS`, `documentUrl`, `signingSentence`, `DocumentKind`, `groupByMonth`, `ScheduleWeekend`); shared `StepIndicator`, `StepNavigation` (`components/forms/step-chrome.tsx`), `stepComplete` (`components/forms/config-step.tsx`), `CustomQuestions`, `Checkbox`, `Button`, `Icon`, `getNextActiveWeekend` (`utils/date.tsx`).
- Produces:
  - `_submit.ts`: `PUBLIC_STRAPI_URL: string`, `submitRegistration(answers, website, schoolSlug): Promise<SubmitSuccess | SubmitFailure>` (never throws)
  - `_Step.tsx`: default `InscriereStep` (props `step, stepLabels, index, answers, onAnswerChange, onNext, onBack, placeholders?, before?, after?, replace?, extraError?, children?, footer?`), `inscriereStepComplete(step, answers, extraError?): boolean`
  - `_Abonament.tsx`: `ScheduleBox({ weekends })`, `PriceBoxView({ box })`, `UpsellBox({ upsell, onBecomeMember })`
  - `_Consent.tsx`: default `ConsentCheckbox({ question, checked, onChange })`
  - `_SchoolPicker.tsx`: `SchoolPicker({ schools, unknownSlug, onChoose })`, `PinnedSchool({ name, onChange })`
  - `_Success.tsx`: default `SuccessScreen({ registrationNumber, downloadToken, documents, expectedCount, apiBase, whatsappUrl?, onRestart })`
  - `CustomQuestions`: a select's placeholder is `placeholders[key]`, else "Selectează..." as before.

Wording and layout follow the approved mockups: "Programul pe următoarea lună" with month headers, weekend rows and "Calendar complet" (link to /cursuri/program); price box titled "Pentru Membri" / "Pentru Neafiliați", prices as "770 RON", "Vezi toate tarifele" opening /cursuri#preturi in a new tab; upsell "Ca membru plătești mai puțin" with the struck non-member price and "Vreau să devin membru"; consent lines "**Consimțământ GDPR:** Confirm citirea documentului <Politica de Confidențialitate> ..." as in the script form; success "Înscriere trimisă!", "Nr. înscriere **2026-0142**.", the download button(s), "Fă o altă înscriere". "Alege școala", the pinned "Școala ... Schimbă" follow the multi-school-registration-v1 companion screen.

- [ ] **Step 1: Select placeholder per key**

In `src/components/ui/custom-questions.tsx` replace

```tsx
                options={optionItems(q)}
                placeholder="Selectează..."
```

with

```tsx
                options={optionItems(q)}
                placeholder={placeholders?.[key] ?? "Selectează..."}
```

and replace the `placeholders` prop comment

```tsx
  /**
   * Input placeholders by question key. The CMS has no placeholder concept, so
   * these are supplied by the caller as presentation only; a question without
   * an entry renders without one.
   */
```

with

```tsx
  /**
   * Input and select placeholders by question key. The CMS has no placeholder
   * concept, so these are supplied by the caller as presentation only; an input
   * without an entry renders without one, a select shows "Selectează...".
   */
```

The Voluntariat and Parteneri placeholder maps have no select keys, so their selects are unchanged.

- [ ] **Step 2: Submit call**

`src/app/inscrieri/_submit.ts`:

```ts
import type { CustomAnswer } from "@/lib/strapi-forms";
import { buildPayload, parseSubmitResponse, type SubmitFailure, type SubmitSuccess } from "./_rules";

// Public url on purpose: this request and the PDF links are made from the browser.
export const PUBLIC_STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337";

/**
 * POST /api/forms/inscriere?scoala=<slug> (plan 2A Task 9, extended by 2D).
 * Never throws: a network failure is a failure without a code or message, and
 * the form shows its generic error.
 */
export async function submitRegistration(
  answers: Record<string, CustomAnswer>,
  website: string,
  schoolSlug: string,
): Promise<SubmitSuccess | SubmitFailure> {
  try {
    const res = await fetch(`${PUBLIC_STRAPI_URL}/api/forms/inscriere?scoala=${encodeURIComponent(schoolSlug)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildPayload(answers, website)),
    });
    const data = (await res.json().catch(() => null)) as unknown;
    return parseSubmitResponse(data, res.ok);
  } catch {
    return { ok: false, code: null, error: null };
  }
}
```

- [ ] **Step 3: Step renderer**

`src/app/inscrieri/_Step.tsx`:

```tsx
"use client";

import { motion } from "motion/react";
import React from "react";
import CustomQuestions from "@/components/ui/custom-questions";
import { StepIndicator, StepNavigation } from "@/components/forms/step-chrome";
import { stepComplete } from "@/components/forms/config-step";
import {
  customFormatError,
  scrollToFirstInvalidField,
  type CustomAnswer,
  type FormQuestion,
  type FormStepConfig,
} from "@/lib/strapi-forms";

/**
 * One step of the registration form. Same chrome and question rendering as
 * the shared ConfigStep (components/forms/config-step.tsx), plus three things
 * the script form needs and ConfigStep has no place for:
 * - `before` / `after`: blocks placed around a question (the schedule before
 *   the membership question, the price box and the upsell after it);
 * - `replace`: a question drawn by the parent (the consent lines);
 * - `extraError`: a check the CMS config cannot express (the child's height).
 * The step passed in is already prepared (follow-ups and abonament options,
 * see `prepareStep` in _rules.ts), so `stepComplete` sees what the parent sees.
 */

export interface InscriereStepProps {
  step: FormStepConfig;
  stepLabels: string[];
  index: number;
  answers: Record<string, CustomAnswer>;
  onAnswerChange: (key: string, value: CustomAnswer) => void;
  onNext: () => void;
  onBack: () => void;
  placeholders?: Record<string, string>;
  before?: Record<string, React.ReactNode>;
  after?: Record<string, React.ReactNode>;
  replace?: Record<string, React.ReactNode>;
  extraError?: (key: string, value: CustomAnswer | undefined) => string | undefined;
  /** Rendered after the questions: the honeypot on the first step. */
  children?: React.ReactNode;
  /** Replaces the Continue button on the final step. */
  footer?: React.ReactNode;
}

const visible = (step: FormStepConfig) => (step.questions ?? []).filter((q) => q.hidden !== true);

function errorFor(q: FormQuestion, value: CustomAnswer | undefined, extraError: InscriereStepProps["extraError"]) {
  return customFormatError(q, value) ?? extraError?.(q.key, value);
}

/** Every required answer given and nothing malformed, including the extra checks. */
export function inscriereStepComplete(
  step: FormStepConfig,
  answers: Record<string, CustomAnswer>,
  extraError?: InscriereStepProps["extraError"],
): boolean {
  return stepComplete(step, answers) && visible(step).every((q) => !extraError?.(q.key, answers[q.key]));
}

const InscriereStep: React.FC<InscriereStepProps> = ({
  step,
  stepLabels,
  index,
  answers,
  onAnswerChange,
  onNext,
  onBack,
  placeholders,
  before = {},
  after = {},
  replace = {},
  extraError,
  children,
  footer,
}) => {
  const [errors, setErrors] = React.useState<Record<string, string | undefined>>({});
  const questions = visible(step);

  const handleBlur = (key: string) => {
    const q = questions.find((item) => item.key === key);
    if (q) setErrors((prev) => ({ ...prev, [key]: errorFor(q, answers[key], extraError) }));
  };

  const handleNext = () => {
    const next: Record<string, string | undefined> = {};
    for (const q of questions) next[q.key] = errorFor(q, answers[q.key], extraError);
    setErrors(next);
    if (Object.values(next).some(Boolean)) requestAnimationFrame(() => scrollToFirstInvalidField());
    else onNext();
  };

  return (
    <div>
      <StepIndicator current={index} labels={stepLabels} variant="card" />

      <motion.div
        className="flex flex-col gap-6"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } } }}
      >
        {questions.map((q) => (
          <React.Fragment key={q.key}>
            {before[q.key]}
            {replace[q.key] ?? (
              <CustomQuestions
                questions={[q]}
                values={answers}
                errors={errors}
                onChange={onAnswerChange}
                onBlur={handleBlur}
                variant="card"
                placeholders={placeholders}
              />
            )}
            {after[q.key]}
          </React.Fragment>
        ))}
      </motion.div>

      {children}

      {footer ?? (
        <StepNavigation
          onBack={onBack}
          onNext={handleNext}
          canProceed={inscriereStepComplete(step, answers, extraError)}
          backLabel={index === 0 ? "" : "Înapoi"}
          variant="card"
        />
      )}
    </div>
  );
};

export default InscriereStep;
```

- [ ] **Step 4: Abonament blocks**

`src/app/inscrieri/_Abonament.tsx`:

```tsx
"use client";

import React from "react";
import { format } from "date-fns";
import { ro } from "date-fns/locale";
import Button from "@/components/ui/button";
import { formatRon, type PriceBox, type Upsell } from "@/lib/club-public";
import ItemTooltip from "@/app/cursuri/blocks/ItemTooltip";
import WeekendRow from "@/app/cursuri/blocks/WeekendRow";
import { getNextActiveWeekend, type WeekendDate } from "@/utils/date";
import { groupByMonth, type ScheduleWeekend } from "./_schedule";

// The blocks of the Abonament step (mockup form-3steps-v1 option B, step 2):
// the next month's schedule, the price box per audience and the upsell for
// non-members. Prices and the fee come from GET /api/club/public.

const BOX = "border-retro border-line bg-surface-raised px-4 py-3";
const LINK = "text-body-sm link text-accent";

const toWeekendDate = (w: ScheduleWeekend): WeekendDate => ({
  startDate: new Date(`${w.startDate}T00:00:00`),
  endDate: new Date(`${w.endDate}T00:00:00`),
  displayText: "",
  description: w.description,
});

/** "Programul pe următoarea lună", drawn with the rows of the Weekenduri list. Nothing when empty. */
export const ScheduleBox: React.FC<{ weekends: ScheduleWeekend[] }> = ({ weekends }) => {
  if (!weekends.length) return null;
  // Same "next weekend" as the Weekenduri list: the first Curs weekend from today.
  const next = getNextActiveWeekend(weekends.filter((w) => w.state === "curs").map(toWeekendDate));
  return (
    <div>
      <p className="text-label block mb-2 text-secondary">Programul pe următoarea lună</p>
      <div className="border-retro border-line bg-surface">
        {groupByMonth(weekends).map((m) => (
          <div key={m.month}>
            <div className="px-4 py-3 border-b-retro border-line">
              <span className="text-label uppercase text-primary capitalize">
                {format(new Date(`${m.month}-01T00:00:00`), "LLLL yyyy", { locale: ro })}
              </span>
            </div>
            {m.weekends.map((w) => (
              <WeekendRow key={w.startDate + w.state} card={{ weekend: toWeekendDate(w), type: w.state }} nextActiveWeekend={next} />
            ))}
          </div>
        ))}
      </div>
      <a href="/cursuri/program" target="_blank" rel="noopener noreferrer" className={`${LINK} inline-block mt-3`}>
        Calendar complet
      </a>
    </div>
  );
};

/** The member or non-member prices; the member box ends with the annual fee. */
export const PriceBoxView: React.FC<{ box: PriceBox }> = ({ box }) => (
  <div className={BOX}>
    <p className="text-body-sm font-bold text-primary mb-2">{box.title}</p>
    {box.rows.map((row) => (
      <div key={row.label} className="flex items-start justify-between gap-3 py-1 text-body-sm text-primary">
        <span>
          {row.label}
          {row.tooltip && (
            <span className="inline-flex items-center ml-1 translate-y-[2px]">
              <ItemTooltip text={row.tooltip} />
            </span>
          )}
        </span>
        <b className="whitespace-nowrap">{row.price}</b>
      </div>
    ))}
    <a href="/cursuri#preturi" target="_blank" rel="noopener noreferrer" className={`${LINK} inline-block mt-3`}>
      Vezi toate tarifele
    </a>
  </div>
);

/** Non-members: what members pay less, computed from the same prices; the button flips the answer to Da. */
export const UpsellBox: React.FC<{ upsell: Upsell; onBecomeMember: () => void }> = ({ upsell, onBecomeMember }) => (
  <div className={BOX}>
    <p className="text-body-sm font-bold text-primary mb-2">Ca membru plătești mai puțin</p>
    {upsell.rows.map((row) => (
      <div key={row.label} className="flex items-start justify-between gap-3 py-1 text-body-sm text-primary">
        <span>{row.label}</span>
        <span className="whitespace-nowrap">
          <s className="text-secondary">{row.nonMemberPrice}</s> <b>{formatRon(row.memberPrice)}</b>
        </span>
      </div>
    ))}
    {upsell.text && <p className="text-caption text-secondary mt-2 mb-3">{upsell.text}</p>}
    <Button variant="secondary" onClick={onBecomeMember} className="w-full">
      Vreau să devin membru
    </Button>
  </div>
);
```

- [ ] **Step 5: Consent line, school choice, success screen**

`src/app/inscrieri/_Consent.tsx`:

```tsx
"use client";

import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import type { FormQuestion } from "@/lib/strapi-forms";
import { splitOnLink } from "./_rules";

const LINK = "link font-semibold text-accent";

/**
 * A consent line as in the script form: "**Consimțământ GDPR:** Confirm citirea
 * documentului <Politica de Confidențialitate> și sunt de acord ...". Title,
 * text and link come from the CMS config. When an admin rewords the text so
 * it no longer contains the link label, the link follows the text.
 */
const ConsentCheckbox: React.FC<{
  question: FormQuestion;
  checked: boolean;
  onChange: (checked: boolean) => void;
}> = ({ question, checked, onChange }) => {
  const label = question.label ?? "";
  const linkLabel = question.linkLabel ?? "";
  const parts = question.linkUrl ? splitOnLink(label, linkLabel) : null;
  const link = (text: string) => (
    <a href={question.linkUrl} target="_blank" rel="noopener noreferrer" className={LINK}>
      {text}
    </a>
  );
  return (
    <Checkbox
      id={question.key}
      name={question.key}
      checked={checked}
      required={question.required === true}
      onChange={(e) => onChange(e.target.checked)}
      className="items-start"
      label={
        <span className="text-xs font-semibold text-primary">
          {question.title && <b>{question.title}:</b>} {parts ? <>{parts.before}{link(parts.link)}{parts.after}</> : label}
          {!parts && question.linkUrl && linkLabel && <> {link(linkLabel)}</>}
        </span>
      }
    />
  );
};

export default ConsentCheckbox;
```

`src/app/inscrieri/_SchoolPicker.tsx`:

```tsx
"use client";

import React, { useState } from "react";
import Button from "@/components/ui/button";
import { cn } from "@/utils/cn";

type School = { name: string; slug: string };

/** "Alege școala" (spec 3.3): shown only with 2 or more schools, or after an unknown `?scoala=`. */
export const SchoolPicker: React.FC<{
  schools: School[];
  unknownSlug: boolean;
  onChoose: (slug: string) => void;
}> = ({ schools, unknownSlug, onChoose }) => {
  const [picked, setPicked] = useState("");
  return (
    <div className="flex flex-col gap-6">
      <h3 className="text-title text-primary">Alege școala</h3>
      {unknownSlug && <p className="text-caption text-accent">Școala nu a fost găsită.</p>}
      <div className="flex flex-col gap-3" role="radiogroup" aria-label="Alege școala">
        {schools.map((s) => (
          <button
            key={s.slug}
            type="button"
            role="radio"
            aria-checked={picked === s.slug}
            onClick={() => setPicked(s.slug)}
            className={cn(
              "border-retro p-4 text-left text-body-sm font-semibold text-primary transition-colors",
              picked === s.slug ? "border-rust bg-surface-raised" : "border-line bg-surface",
            )}
          >
            {s.name}
          </button>
        ))}
      </div>
      <div className="flex justify-end pt-6 border-t-retro border-line-subtle">
        <Button face="black" onClick={() => onChoose(picked)} disabled={!picked}>
          Continuă
        </Button>
      </div>
    </div>
  );
};

/** The chosen school, pinned above every step when there was a choice. */
export const PinnedSchool: React.FC<{ name: string; onChange: () => void }> = ({ name, onChange }) => (
  <div className="flex items-baseline justify-between gap-3 mb-8 pb-4 border-b-retro border-line-subtle">
    <span className="text-body-sm text-primary">
      <span className="text-label uppercase text-secondary block mb-1">Școala</span>
      {name}
    </span>
    <button type="button" onClick={onChange} className="text-body-sm link text-accent">
      Schimbă
    </button>
  </div>
);
```

`src/app/inscrieri/_Success.tsx`:

```tsx
"use client";

import React from "react";
import Button from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { DOWNLOAD_LABELS, documentUrl, signingSentence, type DocumentKind } from "./_rules";

/**
 * After submit (spec 3.4, mockup form-steps-v4 "După trimitere"): the
 * registration number, the signing sentence, a download per PDF while the
 * 24-hour token lasts, and the WhatsApp channel when Setări site has one.
 */
const SuccessScreen: React.FC<{
  registrationNumber: string;
  downloadToken: string | null;
  documents: DocumentKind[];
  /** Documents the registration has, for the sentence when the PDFs cannot be offered here. */
  expectedCount: number;
  apiBase: string;
  whatsappUrl?: string;
  onRestart: () => void;
}> = ({ registrationNumber, downloadToken, documents, expectedCount, apiBase, whatsappUrl, onRestart }) => {
  const downloads = downloadToken ? documents : [];
  const count = downloads.length || expectedCount;
  const intro =
    downloads.length > 1
      ? "Puteți descărca de mai jos documentele completate de dvs."
      : "Puteți descărca de mai jos formularul completat de dvs.";
  return (
    <div className="flex flex-col items-center justify-center py-24 px-8 text-center gap-4">
      <div className="w-16 h-16 bg-surface-dark flex items-center justify-center">
        <Icon name="circle-check" size="md" className="text-mustard" />
      </div>
      <h3 className="text-title text-primary">Înscriere trimisă!</h3>
      <p className="text-body-sm text-secondary max-w-sm">
        Nr. înscriere <b className="text-primary">{registrationNumber}</b>.{" "}
        {downloads.length > 0 && `${intro} `}
        {signingSentence(count)}
      </p>
      {downloads.map((kind) => (
        <Button key={kind} face="black" href={documentUrl(apiBase, downloadToken ?? "", kind)} external>
          {DOWNLOAD_LABELS[kind]}
        </Button>
      ))}
      {whatsappUrl && (
        <Button variant="secondary" href={whatsappUrl} external>
          <Icon name="whatsapp" />
          Canalul WhatsApp
        </Button>
      )}
      <button type="button" onClick={onRestart} className="text-body-sm mt-2 link text-accent">
        Fă o altă înscriere
      </button>
    </div>
  );
};

export default SuccessScreen;
```

- [ ] **Step 6: Run the checks**

Run: `npx tsc --noEmit`, `npx eslint src/app/inscrieri src/components/ui`, `npm run check:tokens`, `npm run test:scripts`.
Expected: zero type errors; eslint shows only the 3 existing warnings (`date-picker-field.tsx` unused `id`, `select.tsx` two aria warnings); tokens exit 0; all tests pass. The old form still builds: these are new files beside it.

- [ ] **Step 7: Commit**

```bash
git add src/app/inscrieri/_submit.ts src/app/inscrieri/_Step.tsx src/app/inscrieri/_Abonament.tsx \
  src/app/inscrieri/_Consent.tsx src/app/inscrieri/_SchoolPicker.tsx src/app/inscrieri/_Success.tsx \
  src/components/ui/custom-questions.tsx
git commit -m "feat(inscrieri): steps, price box, upsell, consents and success screen of the new form"
```

---

### Task 6: Form assembly and offline config

**Files:**
- Modify (replace whole file): `src/app/inscrieri/_types.ts`, `_draft.ts`, `_RegistrationForm.tsx`, `_View.tsx`, `page.tsx`
- Delete: `src/app/inscrieri/_ConfigStep.tsx`
- Modify: `src/lib/site-settings.ts` (drop `currentSeason`), `src/lib/strapi-forms.ts` (`INSCRIERE_BUILTIN_KEYS`), `src/app/cursuri/_data.ts` (delete `CURRENT_SEASON`), `package.json` (`check:inscriere-config`)
- Create: `scripts/inscrieri/compare-config.mjs`
- Test: `scripts/inscrieri/config.test.mjs`

**Interfaces:**
- Consumes: Tasks 1, 3, 4, 5; `GET /api/forms/inscriere/config` (2A registry `inscriere` merged with the admin overlay); `fetchCalendarOccurrences` (`lib/strapi-calendar.ts`), `occurrencesToCalendarEvents` (`utils/occurrences-to-calendar.ts`), `getSiteSettings` (`registrationOpen`, `contact.whatsappChannelUrl`).
- Produces:
  - `_types.ts`: `FALLBACK_CONFIG: FormConfig` (= public model of the 2A registry with an empty overlay), `CONSENT_KEYS`, `PLACEHOLDERS`, `SUBSCRIPTION_PLACEHOLDER`, `type SubmitStatus`
  - `_draft.ts`: `loadDraft`, `saveDraft`, `clearDraft`, `clearLegacyDraft` (key `edusport.inscrieri.draft.v2`; v1 removed)
  - `RegistrationForm` props `{ config?, club: PublicClubInfo, weekends: ScheduleWeekend[], whatsappUrl? }`; `InscrieriView` props `{ formConfig?, club: PublicClubInfo | null, registrationOpen: boolean, weekends, whatsappUrl? }`
  - `npm run check:inscriere-config` (compares `FALLBACK_CONFIG` with a running backend's public config)

How the page works: the server page reads the CMS config, Setări site, the public read and the calendar for today to the same day next month, and builds the weekend rows exactly as /cursuri/program (`occurrencesToCalendarEvents`). The view shows "Înscrierile sunt închise." when `registrationsOpen` (Task 1) is false (switch off, no current Sezon, no school), the existing "nu este disponibil" message when the public read failed, and otherwise the form. The form reads `?scoala=` after mount (the page stays static, revalidated every 60 s), resolves the school, prepares each step for the current answers, places the schedule before the membership question and the price box and upsell after it, draws the consents as script-form lines, checks the child's height, and submits with the school's slug. Submit is enabled only when every step is complete. The WhatsApp link is Setări site, contact, "WhatsApp channel" (already used by the footer and the homepage); no URL is written in code.

- [ ] **Step 1: Write the failing config test**

`scripts/inscrieri/config.test.mjs`:

```js
// The offline config must be the public model of the backend registry
// `inscriere` (plan 2A Task 2). Run `npm run check:inscriere-config` against a
// running backend to compare with the live endpoint as well.
import { test } from "node:test";
import assert from "node:assert/strict";

// CI runs Node 20, which cannot import .ts files: skip there instead of failing.
const canStripTypes = Boolean(process.features?.typescript);
const t = canStripTypes ? await import("../../src/app/inscrieri/_types.ts") : {};
const it = canStripTypes ? test : (name) => test.skip(name);

const q = () => Object.fromEntries(t.FALLBACK_CONFIG.steps.flatMap((s) => s.questions).map((x) => [x.key, x]));

it("has the 3 approved steps with the script form questions in order", () => {
  assert.deepEqual(
    t.FALLBACK_CONFIG.steps.map((s) => [s.key, s.title, s.questions.map((x) => x.key)]),
    [
      ["date", "Date înscriere", ["email", "parentName", "relationship", "relationshipOther", "phone", "childName", "childBirthDate", "childHeight", "shirtSize", "lastSeason", "priorExperience", "expectations"]],
      ["abonament", "Abonament", ["membershipAnswer", "subscriptionChoice"]],
      ["finalizare", "Finalizare înscriere", ["source", "sourceOther", "gdprConsent", "regulationsConsent"]],
    ],
  );
});

it("uses the script form's option values and labels", () => {
  const opts = (key) => q()[key].options.map((o) => [o.value, o.label]);
  assert.deepEqual(opts("relationship"), [["parinte", "Părinte"], ["tutore", "Tutore Legal"], ["alta", "Alta (Vă rugăm specificați)"]]);
  assert.deepEqual(opts("membershipAnswer"), [["da", "Da, doresc să devin membru"], ["nu", "Nu, optez pentru tarife neafiliați"]]);
  assert.deepEqual(opts("lastSeason").map(([v]) => v), ["Nu a participat", "Începători", "Intermediari", "Avansați"]);
  assert.deepEqual(opts("source").map(([v]) => v), ["Facebook", "Instagram", "Recomandare", "Căutare Google", "Altele"]);
  assert.deepEqual(q().subscriptionChoice.options, []);
});

it("follow-ups are optional in the config; the form requires them when shown", () => {
  assert.equal(q().relationshipOther.required, false);
  assert.equal(q().sourceOther.required, false);
  assert.equal(q().relationshipOther.label, "Specificați calitatea (ex: Bunic, Frate):");
  assert.equal(q().sourceOther.label, "Vă rugăm să specificați de unde ați aflat de noi:");
});

it("consents carry their title and the document link inside the text", () => {
  const { gdprConsent, regulationsConsent } = q();
  assert.equal(gdprConsent.title, "Consimțământ GDPR");
  assert.ok(gdprConsent.label.includes(gdprConsent.linkLabel));
  assert.equal(gdprConsent.linkUrl, "/protectia-datelor");
  assert.equal(regulationsConsent.title, "Acord Regulament");
  assert.ok(regulationsConsent.label.includes(regulationsConsent.linkLabel));
  assert.equal(regulationsConsent.linkUrl, "/cursuri/regulament");
});

it("drops the questions only the old website form had", () => {
  for (const key of ["level", "howHeard", "clubInterest", "privacyConsent", "regulationsAgreement"]) assert.equal(q()[key], undefined, key);
});

it("uses comma-below ș and ț, never the cedilla", () => {
  assert.doesNotMatch(JSON.stringify([t.FALLBACK_CONFIG, t.PLACEHOLDERS, t.SUBSCRIPTION_PLACEHOLDER]), /[şţŞŢ]/);
});
```

- [ ] **Step 2: Run it to see it fail**

Run: `node --test scripts/inscrieri/config.test.mjs`
Expected: FAIL (the current `_types.ts` imports `@/lib/strapi-forms` at runtime and has the old steps `personal` / `experienta` / `confirmare`).

- [ ] **Step 3: Offline config and presentation constants**

Replace the whole `src/app/inscrieri/_types.ts` with:

```ts
// ---------------------------------------------------------------------------
// The registration form's offline config and presentation constants.
//
// No runtime imports on purpose: scripts/inscrieri/config.test.mjs loads this
// file with node's type stripping.
// ---------------------------------------------------------------------------

import type { FormConfig } from "@/lib/strapi-forms";

export type SubmitStatus = "idle" | "sending" | "sent" | "error";

// ---------------------------------------------------------------------------
// Offline fallback. The CMS is the source of truth for the form
// (GET /api/forms/inscriere/config); this exists only so an outage of the
// config endpoint does not take registrations offline. It is the public model
// of the backend registry `inscriere` (src/api/form-config/registry.ts, plan 2A
// Task 2) with no admin overlay: same steps, keys, order, types, labels, help,
// required flags, options and consent links. Keep the two in step.
// ---------------------------------------------------------------------------

const same = (values: string[]) => values.map((v) => ({ value: v, label: v, enabled: true }));

export const FALLBACK_CONFIG: FormConfig = {
  type: "inscriere",
  steps: [
    {
      key: "date",
      title: "Date înscriere",
      questions: [
        { key: "email", type: "email", label: "Adresă de e-mail", help: "", required: true, hidden: false },
        { key: "parentName", type: "text", label: "Numele și prenumele persoanei care completează formularul", help: "", required: true, hidden: false },
        {
          key: "relationship",
          type: "select",
          label: "Calitatea față de sportiv:",
          help: "",
          required: true,
          hidden: false,
          options: [
            { value: "parinte", label: "Părinte", enabled: true },
            { value: "tutore", label: "Tutore Legal", enabled: true },
            { value: "alta", label: "Alta (Vă rugăm specificați)", enabled: true },
          ],
        },
        { key: "relationshipOther", type: "text", label: "Specificați calitatea (ex: Bunic, Frate):", help: "", required: false, hidden: false },
        { key: "phone", type: "tel", label: "Telefon de contact", help: "", required: true, hidden: false },
        { key: "childName", type: "text", label: "Numele și prenumele copilului", help: "", required: true, hidden: false },
        { key: "childBirthDate", type: "text", label: "Data nașterii copilului", help: "", required: true, hidden: false },
        { key: "childHeight", type: "text", label: "Înălțimea copilului (cm)", help: "", required: true, hidden: false },
        { key: "shirtSize", type: "text", label: "Măsura bluză", help: "", required: true, hidden: false },
        {
          key: "lastSeason",
          type: "select",
          label: "Sezonul trecut fiul/fiica dvs. a participat la cursurile ACS EduSport?",
          help: "",
          required: true,
          hidden: false,
          options: same(["Nu a participat", "Începători", "Intermediari", "Avansați"]),
        },
        {
          key: "priorExperience",
          type: "longtext",
          label: "Nivel de experiență / Elemente cunoscute",
          help: "Dacă este prima participare, menționați dacă a mai luat lecții. Dacă a mai fost înscris la ACS EduSport, completați cu 'Nu este cazul'.",
          required: true,
          hidden: false,
        },
        { key: "expectations", type: "longtext", label: "Așteptări de la cursurile de patinaj", help: "", required: true, hidden: false },
      ],
    },
    {
      key: "abonament",
      title: "Abonament",
      questions: [
        {
          key: "membershipAnswer",
          type: "select",
          label: "Doriți înscrierea ca membru A.C.S. EduSport pentru tarife preferențiale?",
          help: "",
          required: true,
          hidden: false,
          options: [
            { value: "da", label: "Da, doresc să devin membru", enabled: true },
            { value: "nu", label: "Nu, optez pentru tarife neafiliați", enabled: true },
          ],
        },
        { key: "subscriptionChoice", type: "select", label: "La primul modul doriți să achiziționați:", help: "", required: true, hidden: false, options: [] },
      ],
    },
    {
      key: "finalizare",
      title: "Finalizare înscriere",
      questions: [
        {
          key: "source",
          type: "select",
          label: "De unde ați aflat de cursurile noastre?",
          help: "",
          required: true,
          hidden: false,
          options: same(["Facebook", "Instagram", "Recomandare", "Căutare Google", "Altele"]),
        },
        { key: "sourceOther", type: "text", label: "Vă rugăm să specificați de unde ați aflat de noi:", help: "", required: false, hidden: false },
        {
          key: "gdprConsent",
          type: "checkbox",
          label: "Confirm citirea documentului Politica de Confidențialitate și sunt de acord cu prelucrarea datelor.",
          help: "",
          required: true,
          hidden: false,
          title: "Consimțământ GDPR",
          icon: "",
          linkUrl: "/protectia-datelor",
          linkLabel: "Politica de Confidențialitate",
        },
        {
          key: "regulationsConsent",
          type: "checkbox",
          label: "Confirm că am citit, înțeles și acceptat condițiile prezentate în Regulamentul Școlii de Patinaj.",
          help: "",
          required: true,
          hidden: false,
          title: "Acord Regulament",
          icon: "",
          linkUrl: "/cursuri/regulament",
          linkLabel: "Regulamentul Școlii de Patinaj",
        },
      ],
    },
  ],
};

/** Keys rendered as the script form's consent lines ("Titlu: text with link"). */
export const CONSENT_KEYS = ["gdprConsent", "regulationsConsent"] as const;

/**
 * Placeholders. The CMS has no placeholder concept; these stay presentation.
 * Select placeholders are the script form's "Alegeți...".
 */
export const PLACEHOLDERS: Record<string, string> = {
  email: "adresa@exemplu.ro",
  phone: "+40 7xx xxx xxx",
  relationship: "Alegeți...",
  lastSeason: "Alegeți...",
  membershipAnswer: "Alegeți...",
  source: "Alegeți...",
};

/** The abonament select before and after the membership answer, as in the script form. */
export const SUBSCRIPTION_PLACEHOLDER = {
  waiting: "Alegeți mai întâi opțiunea de membru...",
  ready: "Alegeți opțiunea dorită...",
} as const;
```

Run: `node --test scripts/inscrieri/config.test.mjs`
Expected: PASS (6 tests). (`tsc` fails until Step 6: the old form still imports `submitRegistration` from here.)

- [ ] **Step 4: Draft v2**

Replace the whole `src/app/inscrieri/_draft.ts` with:

```ts
import { createDraftStore, hasContent } from "@/lib/form-draft";

/**
 * The registration form's draft.
 *
 * v2 since the form mirrors the club's script form (phase 2): a v1 draft holds
 * the old questions and step order, so it is dropped instead of restored.
 *
 * This is the one form that advertises its draft elsewhere on the site: the
 * resume bar reads this store to offer the way back. See
 * components/blocks/resume-registration.tsx.
 */
const store = createDraftStore("edusport.inscrieri.draft.v2");
const legacy = createDraftStore("edusport.inscrieri.draft.v1");

export const loadDraft = store.load;
export const saveDraft = store.save;
export const clearDraft = store.clear;
/** Removes a draft saved by the old form, once, when the new form mounts. */
export const clearLegacyDraft = legacy.clear;
export { hasContent };
export type { FormDraft } from "@/lib/form-draft";
```

- [ ] **Step 5: Page, view and form**

Replace the whole `src/app/inscrieri/page.tsx` with:

```tsx
import type { Metadata } from "next";
import InscrieriView from "./_View";
import { fetchFormConfig } from "@/lib/strapi-forms";
import { getSiteSettings } from "@/lib/site-settings";
import { fetchPublicClubInfo } from "@/lib/club-public-fetch";
import { fetchCalendarOccurrences } from "@/lib/strapi-calendar";
import { occurrencesToCalendarEvents } from "@/utils/occurrences-to-calendar";
import { requireEnabled } from "@/lib/strapi-navigation";
import { nextMonthWindow, scheduleWeekends } from "./_schedule";

export const metadata: Metadata = {
  title: "Înscrieri",
  description:
    "Înscrie-ți copilul la cursurile de patinaj artistic EduSport. Completează formularul în trei pași simpli.",
  alternates: { canonical: "/inscrieri" },
  openGraph: {
    title: "Înscrieri | EduSport",
    description:
      "Înscrie-ți copilul la cursurile de patinaj artistic EduSport.",
    type: "website",
    locale: "ro_RO",
    images: [{ url: "/images/courses_generated.png", width: 1200, height: 630, alt: "EduSport - Școala de Patinaj" }],
  },
};

// The form shape is CMS-driven, so edits in the admin must show up quickly.
// At 3600 a reordered or renamed question stayed invisible for up to an hour,
// which read as the editor being broken. Prices and the season follow the
// same 60 seconds (GET /api/club/public is cached for 60 s by the backend).
export const revalidate = 60;

export default async function Page() {
  await requireEnabled("inscrieri");
  const range = nextMonthWindow(new Date());
  const [formConfig, settings, club, calendar] = await Promise.all([
    fetchFormConfig("inscriere"),
    getSiteSettings(),
    fetchPublicClubInfo(),
    fetchCalendarOccurrences(range.from, range.to, 300),
  ]);
  // The Școala de patinaj weekends, built exactly as on /cursuri/program.
  const weekends = scheduleWeekends(occurrencesToCalendarEvents(calendar.occurrences), range);
  return (
    <InscrieriView
      formConfig={formConfig}
      club={club}
      registrationOpen={settings.registrationOpen !== false}
      weekends={weekends}
      whatsappUrl={settings.contact.whatsappChannelUrl}
    />
  );
}
```

Replace the whole `src/app/inscrieri/_View.tsx` with:

```tsx
"use client";

import PageHeroSection from "@/components/blocks/page-hero-section";
import React from "react";
import Card from "@/components/ui/card";
import RegistrationForm from "./_RegistrationForm";
import type { FormConfig } from "@/lib/strapi-forms";
import { registrationsOpen, type PublicClubInfo } from "@/lib/club-public";
import type { ScheduleWeekend } from "./_schedule";

interface InscrieriViewProps {
  formConfig?: FormConfig | null;
  /** GET /api/club/public; null when the backend could not be read. */
  club: PublicClubInfo | null;
  /** "Înscrieri deschise" (Setări site). */
  registrationOpen: boolean;
  weekends: ScheduleWeekend[];
  /** Setări site, contact: the WhatsApp channel shown after submit. */
  whatsappUrl?: string;
}

const Message: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="py-16 px-8 text-center">
    <p className="text-body-sm text-secondary">{children}</p>
  </div>
);

const InscrieriView: React.FC<InscrieriViewProps> = ({
  formConfig = null,
  club,
  registrationOpen,
  weekends,
  whatsappUrl,
}) => {
  const body = !club ? (
    <Message>
      Formularul de înscriere nu este disponibil momentan. Te rugăm să încerci din nou mai
      târziu sau să ne contactezi direct.
    </Message>
  ) : !registrationsOpen(registrationOpen, club) ? (
    <Message>Înscrierile sunt închise.</Message>
  ) : (
    <RegistrationForm config={formConfig} club={club} weekends={weekends} whatsappUrl={whatsappUrl} />
  );

  return (
    <div className="min-h-screen bg-surface">
      <PageHeroSection title={["ÎNSCRIERI"]} backgroundImage="/images/courses.png">
        <h1 className="text-display text-primary-on-dark">
          Înscrieri
        </h1>
        <p className="text-body text-secondary-on-dark max-w-md">
          Completează formularul de mai jos pentru a înscrie copilul tău la
          cursurile de patinaj artistic EduSport.
        </p>
      </PageHeroSection>

      <section className="relative z-raised bg-surface">
        <div className="max-w-content mx-auto gutter section">
          <div className="max-w-narrow mx-auto">
            <div className="flex flex-col gap-3">
              {club?.season && (
                <p className="text-label uppercase text-accent">
                  {club.season.label}
                </p>
              )}
              <h2 className="text-heading text-primary">
                Înscrie-ți copilul
              </h2>
              <p className="text-body-sm text-secondary">
                Completează pașii de mai jos. Vom confirma înscrierea în cel mai
                scurt timp.
              </p>
            </div>

            <Card as="div" padding="md" className="mt-12 min-h-[480px] md:p-8">
              {body}
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default InscrieriView;
```

Replace the whole `src/app/inscrieri/_RegistrationForm.tsx` with:

```tsx
"use client";

import { motion } from "motion/react";
import React, { useEffect, useRef, useState } from "react";
import { track } from "@/lib/analytics";
import { DURATION, EASE } from "@/lib/motion";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import { Dialog, DialogActions } from "@/components/ui/dialog";
import type { CustomAnswer, FormConfig } from "@/lib/strapi-forms";
import {
  audienceFor,
  priceBox,
  subscriptionOptions,
  upsell,
  type PublicClubInfo,
  type PublicSchool,
} from "@/lib/club-public";
import LeaveNotice from "./_LeaveNotice";
import InscriereStep, { inscriereStepComplete } from "./_Step";
import ConsentCheckbox from "./_Consent";
import SuccessScreen from "./_Success";
import { PinnedSchool, SchoolPicker } from "./_SchoolPicker";
import { PriceBoxView, ScheduleBox, UpsellBox } from "./_Abonament";
import { clearDraft, clearLegacyDraft, loadDraft, saveDraft } from "./_draft";
import { PUBLIC_STRAPI_URL, submitRegistration } from "./_submit";
import { resolveSchool, showsPinnedSchool } from "./_school";
import type { ScheduleWeekend } from "./_schedule";
import {
  CONSENT_KEYS,
  FALLBACK_CONFIG,
  PLACEHOLDERS,
  SUBSCRIPTION_PLACEHOLDER,
  type SubmitStatus,
} from "./_types";
import {
  MEMBERSHIP_YES,
  applyAnswer,
  childHeightError,
  expectedDocuments,
  prepareStep,
  type SubmitSuccess,
} from "./_rules";

/**
 * The registration form: the club's script form in the 3 approved steps
 * (DECISIONS 2026-10-05, form-3steps-v1 option B). Labels, help, required
 * flags and options come from the CMS config (GET /api/forms/inscriere/config);
 * season, fee and prices from GET /api/club/public; the schedule from the site
 * calendar. Answers live in one flat map keyed by question key.
 */

interface RegistrationFormProps {
  config?: FormConfig | null;
  club: PublicClubInfo;
  weekends: ScheduleWeekend[];
  whatsappUrl?: string;
}

const HONEYPOT_STYLE: React.CSSProperties = {
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
  whiteSpace: "nowrap",
  border: 0,
};

/** `?scoala=` from the address; undefined until read after mount (the page itself is static). */
function useSchoolParam(): string | null | undefined {
  const [slug, setSlug] = useState<string | null | undefined>(undefined);
  useEffect(() => {
    setSlug(new URLSearchParams(window.location.search).get("scoala"));
  }, []);
  return slug;
}

/** Blocks of the Abonament step around the membership question. */
function abonamentSlots(
  school: PublicSchool,
  club: PublicClubInfo,
  weekends: ScheduleWeekend[],
  membershipAnswer: CustomAnswer | undefined,
  onBecomeMember: () => void,
) {
  const audience = audienceFor(typeof membershipAnswer === "string" ? membershipAnswer : "");
  const offer = audience === "nonMember" ? upsell(school, club.membershipFee) : null;
  return {
    before: { membershipAnswer: <ScheduleBox weekends={weekends} /> },
    after: {
      membershipAnswer: audience && (
        <>
          <PriceBoxView box={priceBox(school, audience, club.membershipFee)} />
          {offer && <UpsellBox upsell={offer} onBecomeMember={onBecomeMember} />}
        </>
      ),
    },
  };
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ config = null, club, weekends, whatsappUrl }) => {
  // The CMS is the source of truth. The bundled fallback exists only so a
  // transient CMS outage does not take registrations offline entirely.
  const activeConfig = config?.steps?.length ? config : FALLBACK_CONFIG;

  const slugParam = useSchoolParam();
  const [chosenSlug, setChosenSlug] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, CustomAnswer>>({});
  const [website, setWebsite] = useState(""); // honeypot, must stay empty
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [result, setResult] = useState<(SubmitSuccess & { expectedCount: number }) | null>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);
  // Set when answers came back from a previous visit, so the notice above the
  // form is shown only to someone who actually left and returned.
  const [restored, setRestored] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  // Nothing is written until the draft has been read, otherwise the empty
  // initial state would overwrite the saved answers on first render.
  const readyRef = useRef(false);

  const resolution = resolveSchool(club.schools, chosenSlug ?? slugParam ?? null);
  const school = resolution.state === "chosen" ? resolution.school : null;
  const offeredFor = (membership: string) =>
    school ? subscriptionOptions(school, audienceFor(membership)).map((o) => o.value) : [];
  const membership = typeof answers.membershipAnswer === "string" ? answers.membershipAnswer : "";
  const audience = audienceFor(membership);
  const steps = (activeConfig.steps ?? []).map((s) =>
    prepareStep(s, answers, school ? subscriptionOptions(school, audience) : []),
  );

  // Fire once, when the user first interacts: start -> submit drop-off.
  const markStarted = () => {
    if (startedRef.current) return;
    startedRef.current = true;
    track("inscriere.start");
  };

  useEffect(() => {
    clearLegacyDraft();
    const draft = loadDraft();
    if (draft) {
      setAnswers(draft.answers);
      setStep(draft.step);
      setRestored(true);
      // They have already started; do not count the return as a new start.
      startedRef.current = true;
    }
    readyRef.current = true;
  }, []);

  useEffect(() => {
    if (!readyRef.current) return;
    saveDraft(step, answers);
  }, [step, answers]);

  useEffect(() => {
    // Skip the scroll on the very first render, which would otherwise yank a
    // returning user down the page before they have read anything.
    if (!readyRef.current) return;
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step]);

  const handleAnswerChange = (key: string, value: CustomAnswer) => {
    markStarted();
    setAnswers((prev) => applyAnswer(prev, key, value, offeredFor));
  };

  const restart = () => {
    clearDraft();
    setRestored(false);
    setAnswers({});
    setWebsite("");
    setSubmitError(null);
    setResult(null);
    setStatus("idle");
    setStep(0);
  };

  const handleSubmit = async() => {
    if (!school) return;
    setStatus("sending");
    setSubmitError(null);
    const res = await submitRegistration(answers, website, school.slug);
    if (!res.ok) {
      setSubmitError(res.error);
      setStatus("error");
      return;
    }
    track("inscriere.submit_success");
    // The answers are with us now; leaving them on the device would show a
    // stranger's registration to the next person on a shared phone.
    clearDraft();
    setResult({ ...res, expectedCount: expectedDocuments(answers.membershipAnswer).length });
    setStatus("sent");
  };

  if (status === "sent" && result) {
    return (
      <SuccessScreen
        registrationNumber={result.registrationNumber}
        downloadToken={result.downloadToken}
        documents={result.documents}
        expectedCount={result.expectedCount}
        apiBase={PUBLIC_STRAPI_URL}
        whatsappUrl={whatsappUrl}
        onRestart={restart}
      />
    );
  }

  // Wait for `?scoala=` before choosing for the parent; with one school there is nothing to wait for.
  if (slugParam === undefined && club.schools.length > 1) return null;
  if (resolution.state === "choose") {
    return <SchoolPicker schools={resolution.schools} unknownSlug={resolution.unknownSlug} onChoose={setChosenSlug} />;
  }
  if (!school || !steps.length) {
    return (
      <div className="py-16 px-8 text-center">
        <p className="text-body-sm text-secondary">
          Formularul de înscriere nu este disponibil momentan. Te rugăm să încerci din nou
          mai târziu sau să ne contactezi direct.
        </p>
      </div>
    );
  }

  const index = Math.min(step, steps.length - 1);
  const current = steps[index]!;
  const isLast = index === steps.length - 1;
  const slots = abonamentSlots(school, club, weekends, answers.membershipAnswer, () =>
    handleAnswerChange("membershipAnswer", MEMBERSHIP_YES),
  );
  const consentSlots = Object.fromEntries(
    current.questions
      .filter((q) => (CONSENT_KEYS as readonly string[]).includes(q.key))
      .map((q) => [
        q.key,
        <ConsentCheckbox key={q.key} question={q} checked={answers[q.key] === true} onChange={(v) => handleAnswerChange(q.key, v)} />,
      ]),
  );
  const extraError = (key: string, value: CustomAnswer | undefined) =>
    key === "childHeight" ? childHeightError(value) : undefined;
  // A restored draft can land on the last step; every step must still be complete.
  const allStepsComplete = steps.every((s) => inscriereStepComplete(s, answers, extraError));

  return (
    <div ref={formRef}>
      {/* Scoped to the form: a link in the header or footer is someone
          navigating on purpose, and is left alone. */}
      <LeaveNotice scope={formRef} />

      {showsPinnedSchool(club.schools.length) && (
        <PinnedSchool name={school.name} onChange={() => setChosenSlug(null)} />
      )}

      {restored && (
        <Card as="div" surface="raised" shadow="none" padding="none" className="mb-6 px-4 py-3">
          <p className="text-body-sm text-primary">Formular salvat.</p>
          <button type="button" onClick={() => setConfirmReset(true)} className="text-caption link mt-1 text-accent">
            Începe de la capăt
          </button>
        </Card>
      )}

      <Dialog
        open={confirmReset}
        onOpenChange={setConfirmReset}
        title="Ștergi răspunsurile salvate?"
        description="Toate datele introduse vor fi pierdute."
        width="sm"
      >
        <DialogActions>
          <Button variant="secondary" onClick={() => setConfirmReset(false)}>
            Renunță
          </Button>
          <Button
            variant="primary"
            face="black"
            onClick={() => {
              restart();
              setConfirmReset(false);
            }}
          >
            Șterge
          </Button>
        </DialogActions>
      </Dialog>

      <motion.div
        key={index}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.slow, ease: EASE.out }}
      >
        <InscriereStep
          step={current}
          stepLabels={steps.map((s) => s.title || "")}
          index={index}
          answers={answers}
          onAnswerChange={handleAnswerChange}
          onNext={() => {
            track("inscriere.step_next", { step: index + 1 });
            setStep(Math.min(index + 1, steps.length - 1));
          }}
          onBack={() => setStep(Math.max(index - 1, 0))}
          placeholders={{
            ...PLACEHOLDERS,
            subscriptionChoice: audience ? SUBSCRIPTION_PLACEHOLDER.ready : SUBSCRIPTION_PLACEHOLDER.waiting,
          }}
          before={slots.before}
          after={slots.after}
          replace={consentSlots}
          extraError={extraError}
          footer={
            isLast ? (
              <div className="mt-8 pt-6 border-t-retro border-line-subtle">
                {status === "error" && (
                  <p className="text-caption text-accent mb-4">
                    {submitError ?? "Înscrierea nu a putut fi trimisă. Te rugăm să încerci din nou."}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(Math.max(index - 1, 0))}
                    className="text-body-sm text-secondary hover:text-accent transition-colors"
                  >
                    Înapoi
                  </button>
                  <Button
                    face="black"
                    type="button"
                    onClick={handleSubmit}
                    disabled={status === "sending" || !allStepsComplete}
                  >
                    {status === "sending" ? "Se trimite..." : "Trimite înscrierea"}
                  </Button>
                </div>
              </div>
            ) : undefined
          }
        >
          {index === 0 && (
            // Honeypot: hidden from users, catches bots. Must stay empty.
            <div aria-hidden="true" style={HONEYPOT_STYLE}>
              <label htmlFor="website">Website</label>
              <input
                id="website"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>
          )}
        </InscriereStep>
      </motion.div>
    </div>
  );
};

export default RegistrationForm;
```

Delete the old step wrapper:

```bash
git rm src/app/inscrieri/_ConfigStep.tsx
```

- [ ] **Step 6: Site settings and builtin keys**

In `src/lib/site-settings.ts`:
- in `interface SiteSettingsData` delete `  currentSeason?: string;`;
- replace `      registration?: { open?: boolean; currentSeason?: string };` with `      registration?: { open?: boolean };`;
- delete `      currentSeason: settings?.registration?.currentSeason,`;
- in the doc comment replace ` * plus the registration open/season flags. This is the one place that fetches` with ` * plus the "Înscrieri deschise" flag. This is the one place that fetches`.

In `src/app/cursuri/_data.ts` delete the line `export const CURRENT_SEASON = "Octombrie 2025 - Mai 2026";` and the blank line after it (the stale fallback label; with no current Sezon no label is shown).

In `src/lib/strapi-forms.ts` replace the whole `INSCRIERE_BUILTIN_KEYS` declaration and its comment with:

```ts
/** Built-in keys for the Înscriere form (registry `inscriere`, the club's script form). */
export const INSCRIERE_BUILTIN_KEYS = new Set<string>([
  "email",
  "parentName",
  "relationship",
  "relationshipOther",
  "phone",
  "childName",
  "childBirthDate",
  "childHeight",
  "shirtSize",
  "lastSeason",
  "priorExperience",
  "expectations",
  "membershipAnswer",
  "subscriptionChoice",
  "source",
  "sourceOther",
  "gdprConsent",
  "regulationsConsent",
  "website",
]);
```

- [ ] **Step 7: Live comparison script**

`scripts/inscrieri/compare-config.mjs`:

```js
// Compares the form's offline config (src/app/inscrieri/_types.ts) with the
// live public config of a running backend: GET <STRAPI>/api/forms/inscriere/config.
// Usage: STRAPI_URL=http://localhost:1338 npm run check:inscriere-config
// The live config includes admin overlay edits (renamed labels), so run it
// against a backend whose `inscriere` overlay is empty, e.g. the 2A boot check.
import assert from "node:assert/strict";

const base = process.env.STRAPI_URL ?? "http://localhost:1337";
const { FALLBACK_CONFIG } = await import("../../src/app/inscrieri/_types.ts");

// `display` is backend-only (the frontend draws consents its own way).
const strip = (config) => ({
  type: config.type,
  steps: config.steps.map((s) => ({
    key: s.key,
    title: s.title,
    questions: s.questions.map((q) => {
      const out = { ...q };
      delete out.display;
      return out;
    }),
  })),
});

const res = await fetch(`${base}/api/forms/inscriere/config`);
if (!res.ok) throw new Error(`GET ${base}/api/forms/inscriere/config: ${res.status}`);
assert.deepEqual(strip(await res.json()), strip(FALLBACK_CONFIG));
console.log("FALLBACK_CONFIG matches the live inscriere config.");
```

In `package.json` scripts, after `"test:scripts": ...`, add:

```json
    "check:inscriere-config": "node scripts/inscrieri/compare-config.mjs"
```

(add the comma after the `test:scripts` line).

- [ ] **Step 8: Run the checks**

Run: `npx tsc --noEmit`, `npm run lint`, `npm run check:tokens`, `npm run test:scripts`.
Expected: zero type errors; no new lint warnings; tokens exit 0; 87 tests pass. `grep -rn "currentSeason" src/lib src/app/inscrieri` and `grep -rn "CURRENT_SEASON\|Octombrie 2025" src` find nothing.

- [ ] **Step 9: Commit**

```bash
git add src/app/inscrieri/_types.ts src/app/inscrieri/_draft.ts src/app/inscrieri/page.tsx \
  src/app/inscrieri/_View.tsx src/app/inscrieri/_RegistrationForm.tsx src/lib/site-settings.ts \
  src/lib/strapi-forms.ts src/app/cursuri/_data.ts scripts/inscrieri/config.test.mjs scripts/inscrieri/compare-config.mjs package.json
git commit -m "feat(inscrieri): the club's script form in 3 steps, with prices, schedule and documents"
```

---

### Task 7: Browser flow test and the expired-link page

**Files:**
- Create: `tests/e2e/mock-strapi.mjs`, `tests/e2e/inscriere.spec.ts`, `playwright.e2e.config.ts`
- Create: `src/app/inscrieri/link-expirat/page.tsx`
- Modify: `playwright.config.ts` (`testIgnore`), `package.json` (`test:e2e`), `.gitignore` (`/.next-e2e/`), `tsconfig.json` (`.next-e2e/types/**/*.ts`)
- Test: `tests/e2e/inscriere.spec.ts`

**Interfaces:**
- Consumes: the app from Tasks 2 and 6; the response shapes of 2A Task 6 and Task 9 plus 2D (mocked).
- Produces: `npm run test:e2e` (builds into `.next-e2e`, starts a mock Strapi on 18890 and the app on 3200); the page `/inscrieri/link-expirat`, where 2D redirects (302) a PDF link whose token is invalid or expired.

The repo already runs Playwright (visual and a11y tests against a build). This test uses its own config so it never touches the real CMS: the app is built with `STRAPI_INTERNAL_URL` and `NEXT_PUBLIC_STRAPI_URL` pointing at the mock. Five tests: the full 3-step flow (both follow-ups, the height check, non-member box and upsell, the upsell button, per-membership options, the consents, the posted body and `?scoala=`, the success screen with both PDFs and WhatsApp), an unknown `?scoala=`, an old or incomplete draft, the expired-link page, and the Cursuri prices (with "Pentru Neafiliați").

The expired-link page (user, 2026-10-21): title "Linkul a expirat", the text "Documentele sunt atașate în e-mailul de înscriere.", a button "Înapoi la site" to "/", not indexed. It is always on (not switched off with the Înscrieri page, since the link comes from an e-mail) and is not in the sitemap.

- [ ] **Step 1: Mock Strapi, config and spec**

`tests/e2e/mock-strapi.mjs`:

```js
// A stand-in for Strapi during the registration e2e test. Serves the public
// club data (plan 2A shape), Setări site, the Școala de patinaj weekends of
// any requested window, and the registration submit (plans 2A + 2D shape).
// Everything else is a 404, which every page already tolerates.
// Usage: node tests/e2e/mock-strapi.mjs <port>
import { createServer } from "node:http";

const PORT = Number(process.argv[2] ?? 18890);

// Prices from the approved mockup (form-steps-v4); not the club's real prices.
const item = (name, kind, sessions, memberPrice, nonMemberPrice, tooltip = null) => ({ name, kind, sessions, memberPrice, nonMemberPrice, tooltip });
export const CLUB = {
  season: { label: "2026-2027", startMonth: "2026-10-01", endMonth: "2027-05-31" },
  membershipFee: 270,
  schools: [
    {
      name: "Școala de Patinaj - AFI Cotroceni",
      slug: "afi-cotroceni",
      priceNotes: ["Taxa de membru se achită o singură dată pe sezon."],
      priceLists: [
        {
          name: "Standard",
          items: [
            item("1 ședință grup", "session", null, null, 180, "Disponibil doar pentru prima ședință"),
            item("Abonament 6 ședințe grup", "subscription", 6, 660, 790),
            item("Abonament 8 ședințe grup", "subscription", 8, 770, 890),
          ],
        },
        { name: "Avansați Gold", items: [item("Abonament Avansați Gold 8 ședințe", "subscription", 8, 1080, null)] },
      ],
    },
  ],
};

const SETTINGS = { contact: { whatsappChannelUrl: "https://example.com/canal-whatsapp" }, registration: { open: true } };

const CORS = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, OPTIONS",
  "access-control-allow-headers": "content-type",
};

function json(res, status, body) {
  res.writeHead(status, { "content-type": "application/json", ...CORS });
  res.end(JSON.stringify(body));
}

const pad = (n) => String(n).padStart(2, "0");
const ymd = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

/** Every Saturday and Sunday in [from, to] as a scheduled Școala date. */
function weekendOccurrences(from, to) {
  const out = [];
  const [y, m, d] = from.split("-").map(Number);
  for (let day = new Date(y, m - 1, d); ymd(day) <= to; day.setDate(day.getDate() + 1)) {
    if (day.getDay() !== 0 && day.getDay() !== 6) continue;
    out.push({ eventId: 1, title: "Școala de patinaj", type: "scoala", label: null, color: null, order: 0, date: ymd(day), startTime: "10:00", endTime: "10:50", status: "scheduled", cancelReason: null, state: "curs" });
  }
  return out;
}

createServer((req, res) => {
  const url = new URL(req.url ?? "/", `http://localhost:${PORT}`);
  if (req.method === "OPTIONS") return json(res, 204, {});
  if (url.pathname === "/api/club/public") return json(res, 200, { data: CLUB });
  if (url.pathname === "/api/site-settings") return json(res, 200, { data: SETTINGS });
  if (url.pathname === "/api/calendar/occurrences") {
    return json(res, 200, { data: weekendOccurrences(url.searchParams.get("from"), url.searchParams.get("to")), blackouts: [] });
  }
  if (url.pathname === "/api/forms/inscriere" && req.method === "POST") {
    return json(res, 200, { ok: true, registrationNumber: "2026-0142", downloadToken: "tok-e2e", documents: ["acord", "adeziune"] });
  }
  return json(res, 404, { data: null, error: { status: 404 } });
}).listen(PORT, () => console.log(`mock strapi on ${PORT}`));
```

`playwright.e2e.config.ts`:

```ts
import { defineConfig, devices } from "@playwright/test";

// Browser tests of whole flows against a mock Strapi (tests/e2e/mock-strapi.mjs),
// never the real CMS: the app is built with both Strapi URLs pointing at the mock.
const PORT = 3200;
const MOCK_PORT = 18890;
const MOCK_URL = `http://localhost:${MOCK_PORT}`;

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: false,
  workers: 1,
  timeout: 90_000,
  reporter: [["list"]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    reducedMotion: "reduce",
    colorScheme: "light",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  // Started in order: the mock must answer before `next build` prerenders the pages.
  webServer: [
    {
      command: `node tests/e2e/mock-strapi.mjs ${MOCK_PORT}`,
      url: `${MOCK_URL}/api/club/public`,
      reuseExistingServer: false,
    },
    {
      command: `NEXT_DIST_DIR=.next-e2e npm run build && NEXT_DIST_DIR=.next-e2e npx next start -p ${PORT}`,
      url: `http://localhost:${PORT}/api/health`,
      env: { STRAPI_INTERNAL_URL: MOCK_URL, NEXT_PUBLIC_STRAPI_URL: MOCK_URL },
      reuseExistingServer: false,
      timeout: 300_000,
    },
  ],
});
```

`tests/e2e/inscriere.spec.ts`:

```ts
import { test, expect, type Page } from "@playwright/test";

// The 3-step registration form against tests/e2e/mock-strapi.mjs:
// one school, Standard + Avansați Gold lists, fee 270, every weekend a Curs.

// The Select is a Radix dropdown menu: wait for it to open and to close, so a
// click never lands on a menu that is still animating.
async function choose(page: Page, key: string, option: string) {
  await page.locator(`#${key}`).click();
  await expect(page.getByRole("menu")).toBeVisible();
  await page.getByRole("menuitemradio", { name: option, exact: true }).click();
  await expect(page.getByRole("menu")).toHaveCount(0);
}

async function optionsOf(page: Page, key: string): Promise<string[]> {
  await page.locator(`#${key}`).click();
  await expect(page.getByRole("menu")).toBeVisible();
  const names = await page.getByRole("menuitemradio").allTextContents();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("menu")).toHaveCount(0);
  return names.map((n) => n.trim());
}

const continueButton = (page: Page) => page.getByRole("button", { name: "Continuă" });

test("a parent registers in 3 steps and gets the number, the PDFs and the WhatsApp link", async({ page }) => {
  await page.goto("/inscrieri?scoala=afi-cotroceni");
  await expect(page.getByText("2026-2027", { exact: true })).toBeVisible();
  await expect(page.getByText("Pasul 1 din 3")).toBeVisible();

  // Step 1: Date înscriere, with the "Alta" follow-up.
  await page.locator("#email").fill("ana.pop@example.com");
  await page.locator("#parentName").fill("Ana Pop");
  await expect(page.locator("#relationshipOther")).toHaveCount(0);
  await choose(page, "relationship", "Alta (Vă rugăm specificați)");
  await expect(page.getByText("Specificați calitatea (ex: Bunic, Frate): *")).toBeVisible();
  await page.locator("#relationshipOther").fill("Bunic");
  await page.locator("#phone").fill("0712345678");
  await page.locator("#childName").fill("Maria Pop");
  await page.locator("#childBirthDate").fill("14.03.2016");
  await page.locator("#childHeight").fill("13");
  await page.locator("#shirtSize").fill("S");
  await choose(page, "lastSeason", "Nu a participat");
  await page.locator("#priorExperience").fill("Nu este cazul");
  await page.locator("#expectations").fill("Să învețe să patineze");
  await expect(continueButton(page)).toBeDisabled();
  await page.locator("#childHeight").fill("132");
  await continueButton(page).click();

  // Step 2: Abonament.
  await expect(page.getByText("Pasul 2 din 3")).toBeVisible();
  await expect(page.getByText("Programul pe următoarea lună")).toBeVisible();
  await expect(page.getByText("Curs", { exact: true }).first()).toBeVisible();
  await expect(page.locator("#subscriptionChoice")).toHaveText("Alegeți mai întâi opțiunea de membru...");

  await choose(page, "membershipAnswer", "Nu, optez pentru tarife neafiliați");
  await expect(page.getByText("Pentru Neafiliați")).toBeVisible();
  await expect(page.getByText("180 RON")).toBeVisible();
  await expect(page.getByText(
    "Economisești 120 RON la fiecare abonament de 8 ședințe. Taxa de membru (270 RON pe sezon) se recuperează de la al treilea abonament. Doar membrii au acces la Avansați Gold.",
  )).toBeVisible();
  expect(await optionsOf(page, "subscriptionChoice")).toEqual([
    "1 ședință grup",
    "Abonament 6 ședințe grup",
    "Abonament 8 ședințe grup",
  ]);
  await choose(page, "subscriptionChoice", "Abonament 8 ședințe grup");

  await page.getByRole("button", { name: "Vreau să devin membru" }).click();
  await expect(page.locator("#membershipAnswer")).toHaveText("Da, doresc să devin membru");
  await expect(page.getByText("Pentru Membri")).toBeVisible();
  await expect(page.getByText("Taxa de membru (o dată/sezon)")).toBeVisible();
  await expect(page.getByText("Ca membru plătești mai puțin")).toHaveCount(0);
  await expect(page.locator("#subscriptionChoice")).toHaveText("Abonament 8 ședințe grup");
  expect(await optionsOf(page, "subscriptionChoice")).toEqual([
    "Abonament 6 ședințe grup",
    "Abonament 8 ședințe grup",
    "Abonament Avansați Gold 8 ședințe",
  ]);
  await continueButton(page).click();

  // Step 3: Finalizare înscriere, with the "Altele" follow-up and both consents.
  await expect(page.getByText("Pasul 3 din 3")).toBeVisible();
  await choose(page, "source", "Altele");
  await page.locator("#sourceOther").fill("Ziar");
  const submit = page.getByRole("button", { name: "Trimite înscrierea" });
  await expect(submit).toBeDisabled();
  // Click the box, not the middle of the line, which holds the document link.
  await page.locator("label[for=gdprConsent]").click({ position: { x: 10, y: 10 } });
  await page.locator("label[for=regulationsConsent]").click({ position: { x: 10, y: 10 } });
  await expect(page.locator("#gdprConsent")).toBeChecked();
  await expect(page.locator("#regulationsConsent")).toBeChecked();
  await expect(page.getByRole("link", { name: "Politica de Confidențialitate", exact: true })).toHaveAttribute("href", "/protectia-datelor");

  const posted = page.waitForRequest((r) => r.method() === "POST" && r.url().includes("/api/forms/inscriere?"));
  await submit.click();
  const request = await posted;
  expect(new URL(request.url()).searchParams.get("scoala")).toBe("afi-cotroceni");
  const body = request.postDataJSON();
  expect(body).toMatchObject({
    relationship: "alta",
    relationshipOther: "Bunic",
    childHeight: "132",
    membershipAnswer: "da",
    subscriptionChoice: { priceItemName: "Abonament 8 ședințe grup" },
    source: "Altele",
    sourceOther: "Ziar",
    gdprConsent: true,
    regulationsConsent: true,
    website: "",
  });
  expect(JSON.stringify(body)).not.toContain("\"price\"");

  // Success screen.
  await expect(page.getByText("Înscriere trimisă!")).toBeVisible();
  await expect(page.getByText("2026-0142")).toBeVisible();
  await expect(page.getByText("Documentele vor fi semnate la prima ședință de curs.", { exact: false })).toBeVisible();
  await expect(page.getByRole("link", { name: "Descarcă formularul (PDF)" })).toHaveAttribute(
    "href",
    /\/api\/forms\/inscriere\/documents\?token=tok-e2e&kind=acord$/,
  );
  await expect(page.getByRole("link", { name: "Descarcă cererea de adeziune (PDF)" })).toHaveAttribute(
    "href",
    /kind=adeziune$/,
  );
  await expect(page.getByRole("link", { name: "Canalul WhatsApp" })).toHaveAttribute("href", "https://example.com/canal-whatsapp");
});

test("an unknown ?scoala is not mapped to the school", async({ page }) => {
  await page.goto("/inscrieri?scoala=club");
  await expect(page.getByText("Școala nu a fost găsită.")).toBeVisible();
  await page.getByRole("radio", { name: "Școala de Patinaj - AFI Cotroceni" }).click();
  await page.getByRole("button", { name: "Continuă" }).click();
  await expect(page.getByText("Pasul 1 din 3")).toBeVisible();
});

test("an old-form draft is dropped and an incomplete draft cannot submit", async({ page }) => {
  await page.goto("/inscrieri");
  await page.evaluate(() => {
    const savedAt = Date.now();
    localStorage.setItem("edusport.inscrieri.draft.v1", JSON.stringify({ step: 2, savedAt, answers: { level: "Incepatori", email: "a@b.ro" } }));
    localStorage.setItem(
      "edusport.inscrieri.draft.v2",
      JSON.stringify({ step: 2, savedAt, answers: { email: "a@b.ro", source: "Facebook", gdprConsent: true, regulationsConsent: true } }),
    );
  });
  await page.reload();
  await expect(page.getByText("Formular salvat.")).toBeVisible();
  await expect(page.getByText("Pasul 3 din 3")).toBeVisible();
  // Step 3 is complete, steps 1 and 2 are not: no submit.
  await expect(page.getByRole("button", { name: "Trimite înscrierea" })).toBeDisabled();
  expect(await page.evaluate(() => localStorage.getItem("edusport.inscrieri.draft.v1"))).toBeNull();
});

test("an expired PDF link lands on a page that is not indexed", async({ page }) => {
  await page.goto("/inscrieri/link-expirat");
  await expect(page.getByRole("heading", { level: 1, name: "Linkul a expirat" })).toBeVisible();
  await expect(page.getByText("Documentele sunt atașate în e-mailul de înscriere.")).toBeVisible();
  await expect(page.getByRole("link", { name: "Înapoi la site" })).toHaveAttribute("href", "/");
  await expect(page.locator("meta[name=robots]")).toHaveAttribute("content", /noindex/);
});

test("the Cursuri prices come from the public read", async({ page }) => {
  await page.goto("/cursuri");
  const prices = page.locator("#preturi");
  await expect(prices.getByText("2026-2027")).toBeVisible();
  await expect(prices.getByText("Abonament Avansați Gold 8 ședințe")).toBeVisible();
  await expect(prices.getByText("1080 RON")).toBeVisible();
  await expect(prices.getByText("270 RON")).toBeVisible();
  await expect(prices.getByText("Pentru Neafiliați")).toBeVisible();
  await expect(prices.getByText("Taxa de membru se achită o singură dată pe sezon.")).toBeVisible();
  // The old note line is gone; its text is the tooltip of "1 ședință grup".
  await expect(prices.getByText("Disponibil doar pentru prima ședință")).toHaveCount(0);
});
```

- [ ] **Step 2: The expired-link page**

Run the flow test once now (Step 4's command): the test "an expired PDF link lands on a page that is not indexed" FAILS (404 page). Then create `src/app/inscrieri/link-expirat/page.tsx`:

```tsx
import type { Metadata } from "next";
import Button from "@/components/ui/button";

// Where the backend (plan 2D) redirects a PDF link whose 24-hour token is
// expired or invalid. Always on: it is not switched with the Înscrieri page,
// because the link comes from an e-mail.
export const metadata: Metadata = {
  title: "Linkul a expirat",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <div className="min-h-screen bg-surface text-primary flex items-center justify-center gutter py-24">
      <div className="max-w-xl w-full text-center flex flex-col items-center gap-6">
        <h1 className="text-heading text-primary">Linkul a expirat</h1>
        <p className="text-body text-secondary">Documentele sunt atașate în e-mailul de înscriere.</p>
        <Button face="black" href="/">
          Înapoi la site
        </Button>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Wire it into the repo**

In `playwright.config.ts`, after `  testDir: "tests",` add:

```ts
  // Flow tests run against a mock Strapi with their own config (playwright.e2e.config.ts).
  testIgnore: ["e2e/**"],
```

In `package.json` scripts, after the `"test:a11y": ...,` line add:

```json
    "test:e2e": "playwright test -c playwright.e2e.config.ts",
```

In `.gitignore`, after `/.next-visual/` add `/.next-e2e/`. In `tsconfig.json` `include`, add `".next-e2e/types/**/*.ts"` (next to `.next-visual/types/**/*.ts`; `next build` with `NEXT_DIST_DIR=.next-e2e` adds it itself and may reorder the list: commit the file as the build leaves it).

- [ ] **Step 4: Run the flow test**

Run: `npm run test:e2e`
Expected: 5 passed (the first run builds the app, about a minute). If port 3200 or 18890 is busy, stop that process first; `reuseExistingServer` is off on purpose.

- [ ] **Step 5: Check that it catches a broken rule**

Temporarily change `if (FOLLOW_UPS[q.key]) return { ...q, required: true };` in `src/app/inscrieri/_rules.ts` to `return q;` for follow-ups (keep the line, make it `if (FOLLOW_UPS[q.key]) return q;`), run `npm run test:e2e`: the flow test FAILS at "Specificați calitatea (ex: Bunic, Frate): *". Restore the line and run again: 5 passed.

- [ ] **Step 6: Run the checks and commit**

Run: `npx tsc --noEmit`, `npm run lint`, `npm run check:tokens`, `npm run test:scripts`: all pass.

```bash
git add tests/e2e/mock-strapi.mjs tests/e2e/inscriere.spec.ts playwright.e2e.config.ts \
  playwright.config.ts package.json .gitignore tsconfig.json src/app/inscrieri/link-expirat/page.tsx
git commit -m "feat(inscrieri): expired-link page and the browser flow test of the 3-step form"
```

---

### Task 8: Final checks

**Files:** none changed unless a check fails (a fix goes into the owning task's files with a `fix(...)` commit).

- [ ] **Step 1: Everything that runs without a backend**

Run: `npx tsc --noEmit`, `npm run lint`, `npm run check:tokens`, `npm run test:scripts`, `npm run build`, `npm run test:e2e`.
Expected: zero type errors, no new lint warnings, tokens exit 0, 87 tests pass, build succeeds, 5 e2e tests pass.

- [ ] **Step 2: Offline config against the 2A backend**

With plan 2A merged and its boot check running (throwaway Postgres, Strapi on 1338, empty `inscriere` overlay):

Run: `STRAPI_URL=http://localhost:1338 npm run check:inscriere-config`
Expected: `FALLBACK_CONFIG matches the live inscriere config.` Never point this at production.

- [ ] **Step 3: Visual snapshots (background, never blocking)**

The visual suite (`npm run test:visual`) renders /, /cursuri, /cursuri/program, /cursuri/regulament and /inscrieri from the local CMS, so those snapshots change once the local backend runs 2A. Run it in a background agent's worktree against a local Strapi with the 2A data. Review the crop of every changed area before any `test:visual:update`: the Cursuri price cards must look as before except the missing note line under "1 ședință grup" (its info icon stays) and the title "Pentru Neafiliați"; season labels show the local current Sezon (or are absent without one); Înscrieri shows the new form. Do not rebaseline anything else.

- [ ] **Step 4: Manual check against a local backend (2A + 2D)**

`npm run dev` with `NEXT_PUBLIC_STRAPI_URL` at the local 2A/2D backend: register once as "Da" (two PDFs download) and once as "Nu" (one PDF, singular sentence); open /inscrieri with "Înscrieri deschise" off (closed message) and with no current Sezon (closed message, no season label on /, /cursuri, Regulament, Program); try `/inscrieri?scoala=club` (school not found); open a PDF link with a wrong token (lands on "Linkul a expirat").

---

## Notes for other plans

- 2A: the form posts `?scoala=<slug>` always (the chosen school's slug, also with one school), `subscriptionChoice: { priceItemName }`, `relationshipOther` only with "alta", `sourceOther` only with "Altele", consents as booleans, `website` (honeypot). It sends no `extra` (custom questions are gone). The public read is expected to contain only `kind = 'school'` sections (ruling 2026-10-21).
- 2D: the success screen reads `downloadToken` and `documents`; with no token it shows no download button. Links are `${NEXT_PUBLIC_STRAPI_URL}/api/forms/inscriere/documents?token=<encoded>&kind=acord|adeziune`, opened in a new tab. Button labels (approved): "Descarcă formularul (PDF)" and "Descarcă cererea de adeziune (PDF)". A bad or expired token is answered with a 302 to the website page `/inscrieri/link-expirat` (Task 7); 2D needs the website's public URL for that redirect.
- 2B: the form-config admin editor may still rename labels of the new questions; the form reads them at runtime. A reworded consent text that no longer contains the link label keeps a separate link after the text.
- Needed from the club: the WhatsApp channel link, entered in Setări site, contact, "WhatsApp" (`site-settings.contact.whatsappChannelUrl`). Until it is set, the success screen shows no WhatsApp button.

## Deploy

One window for both repos (ruling 2026-10-21): switch "Înscrieri deschise" off in Setări site, deploy the backend (2A and the rest of phase 2, with its backup and copy script), deploy this frontend, check /inscrieri, /cursuri and a test registration against the new backend outside production data, then switch "Înscrieri deschise" on. While the switch is off the site shows registrations closed, so neither the old form against the new backend nor the new form against the old backend is ever used.

## Needs user decision

1. **Header and footer buttons without a current Sezon.** The layout (header "Înscrie-te" button, footer band) still follows only "Înscrieri deschise", so with the switch on and no current Sezon they keep pointing to /inscrieri, which then shows "Înscrierile sunt închise.". The homepage panel and /cursuri already show closed. Options: (a) accept (the switch is normally off between seasons); (b) the layout also reads the public read (one cached request per page, 60 s) and uses `registrationsOpen`; (c) the backend sets "Înscrieri deschise" off when no Sezon is current.

## Self-review

- Spec 3.1: Cursuri (Task 2 Steps 1-3), homepage (Step 4), Regulament (Step 5), Program (Step 6), Înscrieri (Task 6) read `/api/club/public`; "Înscrieri deschise" stays in Setări site; tooltips stay, the note line is gone, footer notes from `priceNotes`, per-audience columns via `offeredItems` (Task 1).
- Spec 3.2: 3 steps with the script form's questions, order, options and wording (`FALLBACK_CONFIG` = 2A registry, checked by `config.test.mjs` and `check:inscriere-config`); follow-ups (Task 4 `prepareStep`/`applyAnswer`); next month's school dates from the site calendar (Task 4 `_schedule.ts`, Task 6 page); Da/Nu; price box per audience plus the annual fee in the member box (Task 1 `priceBox`); upsell with savings from the prices (Task 1 `upsell`); options per membership (Task 1 `subscriptionOptions`); honeypot kept (Task 6); old-only fields gone (config test).
- Spec 3.3: `?scoala=`, chooser only with 2+ schools, pinned school with "Schimbă" (Task 4 `_school.ts`, Task 5 `_SchoolPicker.tsx`); only school sections come from 2A, and the schedule is one calendar while there is one school (rulings 2026-10-21).
- Spec 3.4: number, plural/singular sentence, PDF buttons from `downloadToken` + `documents`, WhatsApp from config (Task 4, Task 5 `_Success.tsx`); 24-hour expiry is the backend's (2D); the expired link lands on `/inscrieri/link-expirat` (Task 7, with its test).
- Rulings 2026-10-21: base branch (Global Constraints, before Task 1); "Pentru Neafiliați" (Task 1 test, Task 7 e2e); no current Sezon = closed and no label (Task 1 `registrationsOpen` test; Task 2 removes every fallback label; Task 6 view); deploy note ("Deploy").
- Spec 5 "a browser test of the 3-step form": Task 7.
- Placeholders: none; every code step carries the code. Type names match across tasks (`PublicClubInfo`, `ScheduleWeekend`, `SubmitSuccess`, `inscriereStepComplete`, `registrationsOpen`); `registrationClosed` no longer exists anywhere.
