# Phase 3-3: Website Birth Date Picker Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** On `/inscrieri`, replace the free-text "Data nașterii copilului" field with three selects (zi / lună / an), years from 25 years ago to 2 years ago, stored and submitted as `ZZ.LL.AAAA`, with the error "Alegeți data nașterii."; keep the existing draft save/restore and config-fallback contracts unchanged; update the config and e2e tests.

**Architecture:** The CMS-driven question list keeps `childBirthDate` as a normal `type: "text"` question (backend registry unchanged, out of scope for this repo); the three-select UI is a `replace` slot keyed on `childBirthDate` in the registration form's own step renderer (`_Step.tsx`), the same escape hatch the form already uses for the consent checkboxes. `_Step.tsx`'s `replace` contract is generalized from a static node to a small render function so a replaced question can still receive its computed validation error and report its own blur, which it currently drops on the floor. A new `_BirthDateFields.tsx` component renders the three `Select`s and composes/parses the single `childBirthDate` answer string, so every other contract (draft shape, submit payload, required-field gating) is untouched. Pure range/parse/validation helpers live in `_rules.ts` next to `childHeightError`, tested the same way (Node's type-stripped `.ts` import, no new test runner).

**Tech Stack:** Next.js (React 18+), TypeScript, Radix-based `Select` (`src/components/ui/select.tsx`), Node `--test` for pure-logic scripts, Playwright for e2e against the mock Strapi server.

**Spec:** `/Users/codrin/Documents/Programming/edusport_backend/docs/superpowers/specs/2026-10-26-athletes-registrations-design.md`, section 9 (Website change), with section 1.3 (`childBirthDate` storage and readable formats) and section 4.7 (the e11 unreadable-date rule, unaffected here since it governs the admin confirm flow in the backend repo). Decisions: `/Users/codrin/Documents/Programming/edusport_frontend/docs/portal/DECISIONS.md` (phase3a-r5 m3; gaps #43; d39) — later dated entries win; this plan folds them in.

## Needs decision

The spec leaves one piece of section 9 genuinely open, and it crosses into the not-yet-written backend 3B plan, so this plan does not decide it:

- **Storage of the merged-away public profile's old address** (`1.2`: "When a merge deletes the second public profile, its web address redirects to the kept profile's address … Storage of the old address: plan."; `9`: "an address removed by a merge redirects to the kept profile's address"). The frontend's `/despre-noi/sportivi/[slug]` page needs *some* signal to redirect an old slug to the surviving one, but the backend schema/endpoint that carries that signal does not exist yet and is not this repo's call. Neutral options for whoever writes the 3B backend plan:
  - **A.** The kept `sportsperson` record gains a repeatable field of its former slugs (e.g. `previousSlugs: string[]`); the public detail fetch falls back to filtering on it when the primary `slug` lookup misses.
  - **B.** A separate lightweight mapping record (`fromSlug` → `toSlug`), queried only on a primary-lookup miss, so the `sportsperson` schema itself stays unchanged.
  - Either way, a second open question rides along: redirect status code, `next/navigation`'s `redirect()` (307) vs `permanentRedirect()` (308) — a merge is permanent, so 308 reads right, but nothing in the spec says so.

  Task 6 below builds the frontend half against Option A (the smallest surface change, and it matches "its web address redirects" reading naturally as "the surviving record now remembers the old one"), using `permanentRedirect()`. If the 3B backend plan picks Option B instead, only `fetchSportspersonBySlug`'s fallback query in Task 6 needs to change; the page-level redirect call does not.

## Global Constraints

- Repo `/Users/codrin/Documents/Programming/edusport_frontend`, branch `feat/athletes` off `main`. TypeScript, single quotes are not enforced here (existing file style: double quotes, as in `_rules.ts`/`_Step.tsx`); match the surrounding file's quote style per file.
- Tests after every task: `npx tsc --noEmit`, `npm run lint`, `npm run check:tokens`, `npm run test:scripts` (`node --test 'scripts/**/*.test.mjs'`), `npm run test:e2e` (mock Strapi, `playwright.e2e.config.ts`). Never `npm run test:visual:update`.
- Copy: Romanian UI copy exactly as the spec gives it — error "Alegeți data nașterii." verbatim; ș/ț comma-below, never the cedilla (checked by the existing `config.test.mjs` "comma-below" assertion, which also covers any new copy added to `_types.ts`/`_rules.ts`); no em dash; no middle dot; no emoji; terse.
- No rounded pills or circles, no dashed or dotted lines (existing `Select`/`fieldset` styling already satisfies this; do not introduce new one-off borders).
- The CMS (`GET /api/forms/inscriere/config`) is the source of truth for `childBirthDate`'s `type`, `label` and `required`; keep it `type: "text"` in `FALLBACK_CONFIG` too. The three-select UI is dispatched by the fixed question **key** `childBirthDate` in this form's own step renderer, not by a config `type`, exactly like the consent checkboxes (`CONSENT_KEYS`) already are — changing the type to anything else would only affect the admin's generic custom-question renderer, not this built-in field, and would desync the live CMS registry (a backend change, out of scope here) from the bundled fallback.
- `childBirthDate` stays a single flat string answer under one key in `answers`, the draft (`edusport.inscrieri.draft.v2`) and the submit payload (`buildPayload`'s `TEXT_KEYS`) — no schema version bump, no new answer keys. This is what keeps every untouched contract (draft restore, submit, admin panel's raw `childBirthDate` string) working unchanged.
- Tests: synthetic data only, never production. Commits: no `Co-Authored-By` or any AI attribution. Never push.

## Review Focus

- An old draft saved before this change (or any value the admin's registration-edit UI once allowed) can hold a non-`ZZ.LL.AAAA` string, e.g. free-text "14 martie 2016": the three selects must render blank rather than throw, and Continuă must stay disabled until the parent re-picks a real date (Task 1 `parseBirthDate`/`childBirthDateError` tests; Task 5 e2e restore test).
- The three selects are independent (every "Zi" option 01–31 is always offered, not filtered by the chosen month), so a composed date can be calendar-impossible (31 February, 31 April): this must be caught and blocked with the same "Alegeți data nașterii." error, not silently accepted or silently clamped (Task 1 `childBirthDateError` test; Task 5 e2e test).
- The offered year range is relative to **today**, not a fixed list: it must recompute year-to-year (25 years ago to 2 years ago from the current date), and the boundary years themselves (`currentYear - 25` and `currentYear - 2`) must be reachable, not excluded by an off-by-one (Task 1 `birthYearOptions` test with an injected fixed date for determinism; Task 5 e2e test computing the same bounds from `new Date()` at run time).
- Replacing a question's rendering via `_Step.tsx`'s `replace` slot must not silently lose its validation error display: before this plan, a replaced question's computed `errors[key]` was calculated but never passed to the replacement node (only the consent checkboxes used `replace`, and a checkbox has no separate error text, so the gap was invisible). Task 2's generalized `replace` signature and Task 3's wiring must be verified to actually surface "Alegeți data nașterii." under the selects, not just gate the Continuă button silently (Task 5 e2e test asserts the visible error text, not just `toBeDisabled()`).
- `isCustomFilled` (used by `stepComplete`/`inscriereStepComplete` to gate Continuă) treats any non-empty string as "filled", including a restored old-format free-text value — so completeness alone would wrongly let a stale, malformed date through. The gate that actually catches this is `extraError`/`childBirthDateError` via `inscriereStepComplete`'s separate `!extraError(...)` check; Task 5's restored-old-draft e2e test must assert Continuă is disabled for that reason, not assume `isCustomFilled` already handles it.

---

## File Structure

```
src/app/inscrieri/
  _rules.ts            + BIRTH_DATE_ERROR, BIRTH_DAY_OPTIONS, BIRTH_MONTH_OPTIONS,
                          birthYearRange, birthYearOptions, BirthDateParts,
                          EMPTY_BIRTH_DATE_PARTS, parseBirthDate, composeBirthDate,
                          childBirthDateError (Task 1)
  _Step.tsx             replace: Record<string, ReactNode> -> Record<string, (error, onBlur) => ReactNode> (Task 2)
  _BirthDateFields.tsx  new: the zi/lună/an fieldset (Task 3)
  _RegistrationForm.tsx consentSlots become functions; new childBirthDate replace slot (Task 3)
scripts/inscrieri/
  rules.test.mjs        + tests for the Task 1 helpers (Task 1)
  config.test.mjs       + regression assertions (type stays "text", no placeholder) (Task 4)
tests/e2e/
  inscriere.spec.ts     #childBirthDate fill -> three choose() calls; new range/error/draft tests (Task 5)
src/lib/strapi-sportsperson.ts   + redirectSlug on StrapiSportsperson, fallback lookup (Task 6, Needs decision)
src/app/despre-noi/sportivi/[slug]/page.tsx   + permanentRedirect when the fetched profile carries one (Task 6, Needs decision)
```

## Tasks and order

| Task | Depends on | Can run in parallel with |
|---|---|---|
| 1 Birth date rules | — | — |
| 2 Generalize `_Step.tsx` replace | — | Task 1 |
| 3 `_BirthDateFields` + form wiring | Tasks 1, 2 | — |
| 4 Config regression test | — | Tasks 1-3 |
| 5 e2e update | Task 3 | — |
| 6 Public profile redirect (Needs decision) | — | Tasks 1-5 |

---

### Task 1: Birth date range, parsing and validation rules

**Files:**
- Modify: `src/app/inscrieri/_rules.ts` (after `childHeightError`, line 82, before `const TEXT_KEYS = [` at line 84)
- Test: `scripts/inscrieri/rules.test.mjs`

**Interfaces:**
- Consumes: `CustomAnswer` (already imported in `_rules.ts`).
- Produces (stable names, consumed by Task 3's `_BirthDateFields.tsx` and by `_RegistrationForm.tsx`'s `extraError`):
  - `BIRTH_DATE_ERROR: string` = `"Alegeți data nașterii."`
  - `BIRTH_DAY_OPTIONS: { value: string; label: string }[]` (01..31)
  - `BIRTH_MONTH_OPTIONS: { value: string; label: string }[]` (01..12, Romanian month names)
  - `birthYearRange(now?: Date): { minYear: number; maxYear: number }`
  - `birthYearOptions(now?: Date): { value: string; label: string }[]`
  - `type BirthDateParts = { day: string; month: string; year: string }`, `EMPTY_BIRTH_DATE_PARTS: BirthDateParts`
  - `parseBirthDate(value: CustomAnswer | undefined): BirthDateParts`
  - `composeBirthDate(parts: BirthDateParts): string`
  - `childBirthDateError(value: CustomAnswer | undefined, now?: Date): string | undefined`

- [ ] **Step 1: Write the failing tests**

Append to `scripts/inscrieri/rules.test.mjs` (after the existing `childHeightError` test, before the `ANSWERS` object):

```js
it("birthYearOptions spans 25 to 2 years ago, oldest first, inclusive of both ends", () => {
  const now = new Date("2026-06-15T00:00:00Z");
  const years = rules.birthYearOptions(now);
  assert.equal(years.length, 24);
  assert.deepEqual(years[0], { value: "2001", label: "2001" });
  assert.deepEqual(years.at(-1), { value: "2024", label: "2024" });
});

it("parseBirthDate reads ZZ.LL.AAAA and blanks anything else without throwing", () => {
  assert.deepEqual(rules.parseBirthDate("14.03.2016"), { day: "14", month: "03", year: "2016" });
  assert.deepEqual(rules.parseBirthDate("14 martie 2016"), rules.EMPTY_BIRTH_DATE_PARTS);
  assert.deepEqual(rules.parseBirthDate(""), rules.EMPTY_BIRTH_DATE_PARTS);
  assert.deepEqual(rules.parseBirthDate(undefined), rules.EMPTY_BIRTH_DATE_PARTS);
  assert.deepEqual(rules.parseBirthDate(true), rules.EMPTY_BIRTH_DATE_PARTS);
});

it("composeBirthDate joins only once all three parts are picked", () => {
  assert.equal(rules.composeBirthDate({ day: "14", month: "03", year: "2016" }), "14.03.2016");
  assert.equal(rules.composeBirthDate({ day: "14", month: "03", year: "" }), "");
  assert.equal(rules.composeBirthDate(rules.EMPTY_BIRTH_DATE_PARTS), "");
});

it("childBirthDateError enforces the picker's range and rejects impossible calendar dates", () => {
  const now = new Date("2026-06-15T00:00:00Z");
  for (const ok of ["14.03.2016", "01.01.2001", "28.02.2024", undefined, ""]) {
    assert.equal(rules.childBirthDateError(ok, now), undefined, String(ok));
  }
  assert.equal(rules.childBirthDateError("30.02.2016", now), rules.BIRTH_DATE_ERROR, "30 February does not exist");
  assert.equal(rules.childBirthDateError("31.04.2016", now), rules.BIRTH_DATE_ERROR, "31 April does not exist");
  assert.equal(rules.childBirthDateError("14.03.2000", now), rules.BIRTH_DATE_ERROR, "older than 25 years");
  assert.equal(rules.childBirthDateError("14.03.2025", now), rules.BIRTH_DATE_ERROR, "younger than 2 years");
  assert.equal(rules.childBirthDateError("14 martie 2016", now), rules.BIRTH_DATE_ERROR, "old free-text format");
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `node --test scripts/inscrieri/rules.test.mjs`
Expected: FAIL — `rules.birthYearOptions is not a function` (and the other three new names).

- [ ] **Step 3: Implement the helpers**

In `src/app/inscrieri/_rules.ts`, insert after `childHeightError` (after line 82) and before `const TEXT_KEYS = [`:

```ts
export const BIRTH_DATE_ERROR = "Alegeți data nașterii.";

const BIRTH_DATE_RE = /^(\d{2})\.(\d{2})\.(\d{4})$/;

const pad2 = (n: number): string => String(n).padStart(2, "0");

/** "Zi" options, 01 to 31. Not filtered by the chosen month: an impossible
 * combination (31 April) is caught by childBirthDateError once composed. */
export const BIRTH_DAY_OPTIONS = Array.from({ length: 31 }, (_, i) => {
  const v = pad2(i + 1);
  return { value: v, label: v };
});

const BIRTH_MONTH_NAMES = [
  "ianuarie", "februarie", "martie", "aprilie", "mai", "iunie",
  "iulie", "august", "septembrie", "octombrie", "noiembrie", "decembrie",
] as const;

/** "Lună" options; value is zero-padded so it composes straight into ZZ.LL.AAAA. */
export const BIRTH_MONTH_OPTIONS = BIRTH_MONTH_NAMES.map((label, i) => ({ value: pad2(i + 1), label }));

/** 25 years ago to 2 years ago, by the calendar year at `now` [SPEC 9]. */
export function birthYearRange(now: Date = new Date()): { minYear: number; maxYear: number } {
  const year = now.getFullYear();
  return { minYear: year - 25, maxYear: year - 2 };
}

/** "An" options from birthYearRange, oldest first. */
export function birthYearOptions(now: Date = new Date()): { value: string; label: string }[] {
  const { minYear, maxYear } = birthYearRange(now);
  const out: { value: string; label: string }[] = [];
  for (let y = minYear; y <= maxYear; y++) out.push({ value: String(y), label: String(y) });
  return out;
}

export interface BirthDateParts {
  day: string;
  month: string;
  year: string;
}

export const EMPTY_BIRTH_DATE_PARTS: BirthDateParts = { day: "", month: "", year: "" };

/**
 * Splits a stored "ZZ.LL.AAAA" answer into the three selects' values. Anything
 * else — empty, or an old free-text answer from before this picker existed —
 * comes back blank, so the selects render unset instead of crashing on it.
 */
export function parseBirthDate(value: CustomAnswer | undefined): BirthDateParts {
  const m = typeof value === "string" ? BIRTH_DATE_RE.exec(value.trim()) : null;
  return m ? { day: m[1]!, month: m[2]!, year: m[3]! } : EMPTY_BIRTH_DATE_PARTS;
}

/** Joins the three selects back into "ZZ.LL.AAAA", or "" until all three are picked. */
export function composeBirthDate(parts: BirthDateParts): string {
  return parts.day && parts.month && parts.year ? `${parts.day}.${parts.month}.${parts.year}` : "";
}

/**
 * The stored answer must be a real calendar date within the offered year
 * range [SPEC 9]. Empty passes here (required-ness is gated separately, same
 * convention as childHeightError).
 */
export function childBirthDateError(value: CustomAnswer | undefined, now: Date = new Date()): string | undefined {
  if (typeof value !== "string" || value.trim() === "") return undefined;
  const m = BIRTH_DATE_RE.exec(value.trim());
  if (!m) return BIRTH_DATE_ERROR;
  const day = Number(m[1]);
  const month = Number(m[2]);
  const year = Number(m[3]);
  const { minYear, maxYear } = birthYearRange(now);
  if (year < minYear || year > maxYear) return BIRTH_DATE_ERROR;
  const asDate = new Date(year, month - 1, day);
  const real = asDate.getFullYear() === year && asDate.getMonth() === month - 1 && asDate.getDate() === day;
  return real ? undefined : BIRTH_DATE_ERROR;
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `node --test scripts/inscrieri/rules.test.mjs`
Expected: PASS, all tests including the pre-existing ones.

- [ ] **Step 5: Commit**

```bash
git add src/app/inscrieri/_rules.ts scripts/inscrieri/rules.test.mjs
git commit -m "feat(inscrieri): add zi/lună/an birth date range, parsing and validation rules"
```

---

### Task 2: Let a replaced question keep its validation error and blur

**Files:**
- Modify: `src/app/inscrieri/_Step.tsx` (the `replace` prop type at line 41, the doc comment at line 22, and the render site at lines 112-121)

**Interfaces:**
- Consumes: nothing new.
- Produces: `InscriereStepProps["replace"]` changes shape from `Record<string, React.ReactNode>` to `Record<string, (error: string | undefined, onBlur: () => void) => React.ReactNode>`. Task 3 updates every caller (`_RegistrationForm.tsx`'s `consentSlots` and the new `childBirthDate` slot) to the new shape. No other file constructs a `replace` map today.

Why: `_Step.tsx` already computes `errors[key]` for every question in the step (including a replaced one, via `handleNext`/`handleBlur`), but today it only ever hands `errors` to `CustomQuestions` — a replaced question's error is computed and then dropped. This has been invisible so far because the only existing `replace` use (the consent checkboxes) has no separate error text to show. The birth date picker (Task 3) does need its error shown, so the gap has to close first.

- [ ] **Step 1: Write the failing test**

This is a type-level/structural change with no isolated pure-logic test of its own (it has no behavior without a caller); Task 3's e2e test (Task 5) is what actually exercises it. Skip straight to the change and verify with the type checker and the full existing e2e suite, which must keep passing unmodified (the consent checkboxes must still render identically).

Run first, to record the baseline: `npx tsc --noEmit` (expected: PASS, before any edit) and `npx playwright test -c playwright.e2e.config.ts tests/e2e/inscriere.spec.ts` (expected: PASS, before any edit).

- [ ] **Step 2: Change the `replace` contract**

In `src/app/inscrieri/_Step.tsx`, update the doc comment (around line 22):

```ts
 * - `replace`: a question drawn by the parent (the consent lines, the birth
 *   date picker), given this question's current error and an onBlur to
 *   report back into this step's own `errors` state;
```

Change the prop type (line 41):

```ts
  replace?: Record<string, (error: string | undefined, onBlur: () => void) => React.ReactNode>;
```

Change the render site (lines 112-121):

```tsx
            {replace[q.key]
              ? replace[q.key]!(errors[q.key], () => handleBlur(q.key))
              : (
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
```

- [ ] **Step 3: Update the one existing caller to match**

In `src/app/inscrieri/_RegistrationForm.tsx`, change `consentSlots` (around line 267) from building `ReactNode`s to building the new render-function shape:

```tsx
  const consentSlots = Object.fromEntries(
    current.questions
      .filter((q) => (CONSENT_KEYS as readonly string[]).includes(q.key))
      .map((q) => [
        q.key,
        () => (
          <ConsentCheckbox
            key={q.key}
            question={q}
            checked={answers[q.key] === true}
            onChange={(v) => handleAnswerChange(q.key, v)}
          />
        ),
      ]),
  );
```

(Signature match only — a consent checkbox has no separate error text, so the function ignores its two arguments.)

- [ ] **Step 4: Run the type checker and the existing e2e suite**

Run: `npx tsc --noEmit`
Expected: PASS.

Run: `npx playwright test -c playwright.e2e.config.ts tests/e2e/inscriere.spec.ts`
Expected: PASS, unchanged — the consent checkboxes render and behave exactly as before (this confirms the refactor is behavior-preserving for the one existing `replace` user before Task 3 adds a second one).

- [ ] **Step 5: Commit**

```bash
git add src/app/inscrieri/_Step.tsx src/app/inscrieri/_RegistrationForm.tsx
git commit -m "refactor(inscrieri): let a replaced step question report its validation error"
```

---

### Task 3: The zi/lună/an birth date fieldset, wired into the form

**Files:**
- Create: `src/app/inscrieri/_BirthDateFields.tsx`
- Modify: `src/app/inscrieri/_RegistrationForm.tsx` (imports; `extraError` around line 275; the `replace` object passed at line 347)
- Test: covered by Task 1 (pure logic) and Task 5 (e2e, the only way to test rendered component behavior in this repo — there is no component/unit test runner here, only `node --test` on pure-logic scripts and Playwright)

**Interfaces:**
- Consumes: `BIRTH_DAY_OPTIONS`, `BIRTH_MONTH_OPTIONS`, `parseBirthDate`, `composeBirthDate`, `childBirthDateError` (Task 1); `Select` (`@/components/ui/select`); the generalized `replace` shape (Task 2).
- Produces: `BirthDateFields` component, default export of `_BirthDateFields.tsx`:
  ```ts
  interface BirthDateFieldsProps {
    value: CustomAnswer | undefined;
    onChange: (value: string) => void;
    label: string;
    required?: boolean;
    error?: string;
    onBlur?: () => void;
  }
  ```

- [ ] **Step 1: Write the component**

Create `src/app/inscrieri/_BirthDateFields.tsx`:

```tsx
"use client";

import React from "react";
import { Select } from "@/components/ui/select";
import type { CustomAnswer } from "@/lib/strapi-forms";
import {
  BIRTH_DAY_OPTIONS,
  BIRTH_MONTH_OPTIONS,
  birthYearOptions,
  composeBirthDate,
  parseBirthDate,
  type BirthDateParts,
} from "./_rules";

/**
 * "Data nașterii copilului" as three selects (zi / lună / an) instead of free
 * text [SPEC 9]. The combined answer stays one "ZZ.LL.AAAA" string under the
 * single `childBirthDate` key, same as before this picker existed, so the
 * draft, the submit payload and the admin panel are unaffected.
 */
interface BirthDateFieldsProps {
  value: CustomAnswer | undefined;
  onChange: (value: string) => void;
  label: string;
  required?: boolean;
  error?: string;
  onBlur?: () => void;
}

const BirthDateFields: React.FC<BirthDateFieldsProps> = ({
  value,
  onChange,
  label,
  required,
  error,
  onBlur,
}) => {
  const parts = parseBirthDate(value);
  const years = birthYearOptions();

  const update = (key: keyof BirthDateParts, next: string) => {
    const composed = composeBirthDate({ ...parts, [key]: next });
    onChange(composed);
    // The three selects never get a native blur worth listening to (Radix
    // closes the menu and returns focus to the trigger); report once the
    // date is complete, the same moment a real blur would have fired.
    if (composed) onBlur?.();
  };

  return (
    <fieldset>
      <legend className="text-label block mb-2 text-secondary">{label}</legend>
      <div className="flex gap-3">
        <Select
          id="childBirthDateDay"
          name="childBirthDateDay"
          value={parts.day}
          onValueChange={(v) => update("day", v)}
          options={BIRTH_DAY_OPTIONS}
          placeholder="Zi"
          required={required}
          aria-invalid={error ? true : undefined}
        />
        <Select
          id="childBirthDateMonth"
          name="childBirthDateMonth"
          value={parts.month}
          onValueChange={(v) => update("month", v)}
          options={BIRTH_MONTH_OPTIONS}
          placeholder="Lună"
          required={required}
          aria-invalid={error ? true : undefined}
        />
        <Select
          id="childBirthDateYear"
          name="childBirthDateYear"
          value={parts.year}
          onValueChange={(v) => update("year", v)}
          options={years}
          placeholder="An"
          required={required}
          aria-invalid={error ? true : undefined}
        />
      </div>
      {error && <p className="text-caption text-accent mt-2">{error}</p>}
    </fieldset>
  );
};

export default BirthDateFields;
```

- [ ] **Step 2: Wire it into the form**

In `src/app/inscrieri/_RegistrationForm.tsx`, add the import next to `ConsentCheckbox` (line 21):

```ts
import BirthDateFields from "./_BirthDateFields";
```

Add `childBirthDateError` to the `_rules` import list.

Change `extraError` (around line 275) to cover both custom checks:

```tsx
  const extraError = (key: string, value: CustomAnswer | undefined) => {
    if (key === "childHeight") return childHeightError(value);
    if (key === "childBirthDate") return childBirthDateError(value);
    return undefined;
  };
```

Build the birth date slot from the current step's own question (so a CMS label/required override, if an admin ever sets one, still applies) and merge it with `consentSlots` before the `replace={consentSlots}` prop (line 347):

```tsx
  const birthDateQuestion = current.questions.find((q) => q.key === "childBirthDate");
  const replaceSlots = {
    ...consentSlots,
    ...(birthDateQuestion && {
      childBirthDate: (error: string | undefined, onBlur: () => void) => (
        <BirthDateFields
          value={answers.childBirthDate}
          onChange={(v) => handleAnswerChange("childBirthDate", v)}
          onBlur={onBlur}
          label={`${birthDateQuestion.label ?? "Data nașterii copilului"}${birthDateQuestion.required ? " *" : ""}`}
          required={birthDateQuestion.required === true}
          error={error}
        />
      ),
    }),
  };
```

Pass `replace={replaceSlots}` instead of `replace={consentSlots}` at line 347.

- [ ] **Step 3: Run the type checker and lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: PASS.

- [ ] **Step 4: Manual check against the mock form (optional but recommended before Task 5)**

Run: `npm run dev`, open `/inscrieri?scoala=afi-cotroceni` (or whichever school slug the local Strapi offers), confirm the three selects render where the free-text field used to be, with no leftover "ex: 25 decembrie 2018" placeholder anywhere on the page.

- [ ] **Step 5: Commit**

```bash
git add src/app/inscrieri/_BirthDateFields.tsx src/app/inscrieri/_RegistrationForm.tsx
git commit -m "feat(inscrieri): render the birth date field as zi/lună/an selects"
```

---

### Task 4: Config regression test

**Files:**
- Modify: `scripts/inscrieri/config.test.mjs`

**Interfaces:**
- Consumes: `FALLBACK_CONFIG`, `PLACEHOLDERS` (already imported in this test file as `t`).

Why this task exists even though `_types.ts` itself needs no code change (the dispatch is by question **key** in `_RegistrationForm.tsx`/`_Step.tsx`, not by config `type` — see Global Constraints): the config test is the guard that stops a future edit from "fixing" `childBirthDate`'s type to `"date"` (which would silently break this feature, since the generic custom-question renderer's `"date"` type is a different widget — the calendar `DatePickerField` — and only applies to admin-added custom questions, never to this built-in key) or from desyncing `FALLBACK_CONFIG` from the live backend registry (`type: 'text'`, `required: true`), and that the removed free-text placeholder stays removed.

- [ ] **Step 1: Write the failing test**

Append to `scripts/inscrieri/config.test.mjs`, after the "drops the questions only the old website form had" test:

```js
it("keeps childBirthDate a plain text answer key; the zi/lună/an UI is a replace slot keyed on childBirthDate, not a config type", () => {
  assert.equal(q().childBirthDate.type, "text");
  assert.equal(q().childBirthDate.required, true);
  assert.equal(q().childBirthDate.label, "Data nașterii copilului");
  assert.equal(t.PLACEHOLDERS.childBirthDate, undefined, "the free-text placeholder stays removed");
});
```

- [ ] **Step 2: Run the test to verify it currently passes (a true regression guard, not a new behavior)**

Run: `node --test scripts/inscrieri/config.test.mjs`
Expected: PASS already, since Tasks 1-3 did not touch `_types.ts`. This step exists to prove the guard is correctly written against the real current values before it starts protecting them — flip `q().childBirthDate.type` to `"date"` temporarily and re-run to see it fail, then revert.

- [ ] **Step 3: Commit**

```bash
git add scripts/inscrieri/config.test.mjs
git commit -m "test(inscrieri): guard childBirthDate's config type and removed placeholder"
```

---

### Task 5: e2e coverage

**Files:**
- Modify: `tests/e2e/inscriere.spec.ts`

**Interfaces:**
- Consumes: the existing `choose(page, key, option)` and `optionsOf(page, key)` helpers (already in this file), the new `childBirthDateDay` / `childBirthDateMonth` / `childBirthDateYear` select ids (Task 3).

- [ ] **Step 1: Replace the existing fill with the three selects**

In `tests/e2e/inscriere.spec.ts`, add a small helper next to `choose`/`optionsOf` (after `optionsOf`, before `continueButton`):

```ts
async function fillBirthDate(page: Page, day: string, month: string, year: string) {
  await choose(page, "childBirthDateDay", day);
  await choose(page, "childBirthDateMonth", month);
  await choose(page, "childBirthDateYear", year);
}
```

Replace the existing line (62):

```ts
  await page.locator("#childBirthDate").fill("14.03.2016");
```

with:

```ts
  await fillBirthDate(page, "14", "martie", String(new Date().getFullYear() - 10));
```

(A year 10 years ago is always inside the 25-to-2-years-ago window, so this one line does not need updating as calendar years pass. The two existing draft literals at lines 171-ish and 242, which set `childBirthDate: "14.03.2016"` directly into `localStorage` rather than through the UI, are left as-is: they already exercise a *valid new-format* restored draft and must keep passing unchanged.)

- [ ] **Step 2: Run to verify the updated flow still passes**

Run: `npx playwright test -c playwright.e2e.config.ts tests/e2e/inscriere.spec.ts -g "a parent registers in 3 steps"`
Expected: PASS.

- [ ] **Step 3: Add the range, impossible-date and old-draft tests**

Append new tests at the end of `tests/e2e/inscriere.spec.ts`:

```ts
test("Data nașterii copilului offers years 25 to 2 years ago and blocks an impossible calendar date", async({ page }) => {
  await page.goto("/inscrieri?scoala=afi-cotroceni");
  const now = new Date();
  const minYear = String(now.getFullYear() - 25);
  const maxYear = String(now.getFullYear() - 2);

  await expect(page.locator("#childBirthDate")).toHaveCount(0);
  const years = await optionsOf(page, "childBirthDateYear");
  expect(years[0]).toBe(minYear);
  expect(years.at(-1)).toBe(maxYear);

  await choose(page, "childBirthDateDay", "31");
  await choose(page, "childBirthDateMonth", "februarie");
  await choose(page, "childBirthDateYear", maxYear);
  await expect(page.getByText("Alegeți data nașterii.")).toBeVisible();
  await expect(continueButton(page)).toBeDisabled();

  await choose(page, "childBirthDateDay", "14");
  await choose(page, "childBirthDateMonth", "martie");
  await expect(page.getByText("Alegeți data nașterii.")).toHaveCount(0);
});

test("an old free-text birth date draft restores with blank selects and blocks Continuă until re-picked", async({ page }) => {
  await page.goto("/inscrieri?scoala=afi-cotroceni");
  await saveDraft(page, 0, {
    email: "ana.pop@example.com", parentName: "Ana Pop", relationship: "parinte", phone: "0712345678",
    childName: "Maria Pop", childBirthDate: "14 martie 2016", childHeight: "132", shirtSize: "S",
    lastSeason: "Nu a participat", priorExperience: "Nu este cazul", expectations: "Să patineze",
  });
  await page.reload();
  await expect(page.getByText("Formular salvat.")).toBeVisible();
  await expect(page.locator("#childBirthDateDay")).toContainText("Zi");
  await expect(page.locator("#childBirthDateMonth")).toContainText("Lună");
  await expect(page.locator("#childBirthDateYear")).toContainText("An");
  await expect(continueButton(page)).toBeDisabled();

  await fillBirthDate(page, "14", "martie", String(new Date().getFullYear() - 10));
  await expect(continueButton(page)).toBeEnabled();
});

test("a valid zi/lună/an draft restores into the same selects", async({ page }) => {
  await page.goto("/inscrieri?scoala=afi-cotroceni");
  const year = String(new Date().getFullYear() - 10);
  await saveDraft(page, 0, { childBirthDate: `05.11.${year}` });
  await page.reload();
  await expect(page.locator("#childBirthDateDay")).toContainText("05");
  await expect(page.locator("#childBirthDateMonth")).toContainText("noiembrie");
  await expect(page.locator("#childBirthDateYear")).toContainText(year);
});
```

- [ ] **Step 4: Run the full file**

Run: `npx playwright test -c playwright.e2e.config.ts tests/e2e/inscriere.spec.ts`
Expected: PASS, all tests in the file.

- [ ] **Step 5: Commit**

```bash
git add tests/e2e/inscriere.spec.ts
git commit -m "test(inscrieri): cover the zi/lună/an birth date picker's range, errors and drafts"
```

---

### Task 6: Public profile redirect after a merge (Needs decision — see top of plan)

**Files:**
- Modify: `src/lib/strapi-sportsperson.ts` (`StrapiSportsperson` interface; `fetchSportspersonBySlug`)
- Modify: `src/app/despre-noi/sportivi/[slug]/page.tsx`

**Interfaces:**
- Consumes: a not-yet-decided backend field, assumed here (per the "Needs decision" note at the top of this plan) to be a repeatable `previousSlugs: string[]` on the surviving `sportsperson` record.
- Produces: `fetchSportspersonBySlug` returns the surviving record (with its real `slug`) when the requested slug matches one of its `previousSlugs`, so the page can tell "found directly" apart from "found via an old address" by comparing the returned `slug` to the requested one.

This task is written against Option A of the open decision. **Do not build this task until the 3B backend plan confirms the field shape** (Option A, Option B, or something else); if it lands on Option B (a separate redirect mapping), only Step 3 below (the fallback query) changes — Steps 1, 4 and 5 stay the same.

- [ ] **Step 1: Add the field**

In `src/lib/strapi-sportsperson.ts`, add to `StrapiSportsperson` (after `skateResultsSlug`):

```ts
  /** Former slugs that now redirect here, set when a 3B merge deletes the
   *  other profile [DEC 2026-10-26 d39]. Empty/absent for a profile that was
   *  never the kept side of a merge. */
  previousSlugs?: string[] | null;
```

- [ ] **Step 2: Write the failing test expectation (documented, not an automated unit test — see note)**

This repo has no mocked-Strapi unit test for `src/lib/strapi-sportsperson.ts` fetch helpers today (they are exercised indirectly through the page's e2e/visual tests against a real or mocked backend). Add the behavior directly and verify it through a manual check against a local Strapi with a `previousSlugs` value seeded by hand, since seeding this through the mock Strapi server would require the 3B backend schema to exist first.

- [ ] **Step 3: Add the fallback lookup**

In `fetchSportspersonBySlug` (`src/lib/strapi-sportsperson.ts`), after the primary lookup returns nothing, fall back to `previousSlugs`:

```ts
export async function fetchSportspersonBySlug(
  slug: string,
): Promise<StrapiSportsperson | null> {
  const params = new URLSearchParams({
    "filters[slug][$eq]": slug,
    ...DETAIL_POPULATE_PARAMS,
  });
  const data = await fetchStrapi<StrapiSportsperson[]>(
    "sportspeople",
    params.toString(),
    300,
  );
  if (data?.[0]) return data[0];

  // The slug may belong to a profile a 3B merge deleted; the surviving
  // record remembers it in previousSlugs [DEC 2026-10-26 d39].
  const redirectParams = new URLSearchParams({
    "filters[previousSlugs][$contains]": slug,
    ...DETAIL_POPULATE_PARAMS,
  });
  const redirected = await fetchStrapi<StrapiSportsperson[]>(
    "sportspeople",
    redirectParams.toString(),
    300,
  );
  return redirected?.[0] ?? null;
}
```

- [ ] **Step 4: Redirect at the page level**

In `src/app/despre-noi/sportivi/[slug]/page.tsx`, import `permanentRedirect` alongside `notFound` and redirect before the `showPublicPage` guard:

```ts
import { notFound, permanentRedirect } from "next/navigation";
```

After `sp = await fetchSportspersonBySlug(slug);` and its `catch { notFound(); }`, before the `if (!sp || !sp.showPublicPage) notFound();` guard:

```ts
  if (sp && sp.slug !== slug) {
    permanentRedirect(`/despre-noi/sportivi/${sp.slug}`);
  }
```

(Placed before the `showPublicPage` guard so a merge into a profile that is itself private still 404s rather than redirecting into a private page — the existing guard runs next and handles that.)

- [ ] **Step 5: Manual verification**

Against a local Strapi seeded with a `sportsperson` whose `previousSlugs` includes an old address: `GET /despre-noi/sportivi/<old-slug>` returns a 308 to `/despre-noi/sportivi/<new-slug>`. `GET /despre-noi/sportivi/<unrelated-unknown-slug>` still 404s.

- [ ] **Step 6: Commit**

```bash
git add src/lib/strapi-sportsperson.ts src/app/despre-noi/sportivi/\[slug\]/page.tsx
git commit -m "feat(sportivi): redirect a merged-away profile's old address to the kept one"
```

---

## Self-review

**1. Spec coverage (section 9):**
- "three selects zi / lună / an" — Task 3 (`_BirthDateFields.tsx`).
- "years from 25 years ago to 2 years ago" — Task 1 (`birthYearRange`/`birthYearOptions`), tested with a fixed date; Task 5 e2e re-derives the same bounds from the live clock.
- "stored as ZZ.LL.AAAA" — Task 1 (`composeBirthDate`), unchanged `TEXT_KEYS`/`buildPayload` contract (Global Constraints).
- "error 'Alegeți data nașterii.'" — Task 1 (`childBirthDateError`/`BIRTH_DATE_ERROR`), wired through Task 2/3, shown in Task 5's e2e test.
- "the free-text placeholder … goes" — already true on `main` (verified: `PLACEHOLDERS` has no `childBirthDate` entry); Task 4 adds a regression guard so it stays that way.
- "Older free-text dates keep the e11 rule" — this governs how the backend's admin confirm flow reads old registrations (`docs/.../design.md` 4.7); no frontend action, not this repo. Noted in the plan header's Spec line.
- "Public profile … redirects to the kept profile's address" — Task 6, flagged under "Needs decision" per the spec's own "Storage of the old address: plan." note.

**2. Placeholder scan:** none of the task steps contain TBD/"add appropriate"/"similar to Task N" — every step has real code or a concrete manual-verification command. Task 6 is explicitly conditional (not built until the backend contract is confirmed) rather than containing a placeholder; its code is nonetheless complete and real against the stated assumption.

**3. Type consistency:** `BirthDateFieldsProps.value: CustomAnswer | undefined` matches `answers.childBirthDate`'s type everywhere it's read; `onChange: (value: string) => void` matches `handleAnswerChange`'s second parameter (`CustomAnswer`, and `string` is one of its members); the `replace` function signature `(error: string | undefined, onBlur: () => void) => React.ReactNode` is identical between Task 2's definition and Task 3's two implementations (`consentSlots`'s entries and the new `childBirthDate` entry). `childBirthDateError`'s optional `now` parameter matches `birthYearRange`'s.

**4. Review Focus:** all five items above have an owning task and an owning test (three in Task 1's unit tests with a fixed `now`, two in Task 5's e2e tests against the real clock and a simulated legacy draft).

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-10-26-phase3-3-website-birth-date.md`. Please review the plan. Which execution approach would you prefer?

- **Subagent-driven** — A fresh subagent implements each task and a fresh reviewer checks it before the next one starts, then a whole-branch review at the end. Most thorough; costs a fresh context per task and per review.
- **Native** — I implement every task myself in this session, then one fresh reviewer on the most capable model checks the whole branch. Cheapest and fastest; no independent review until the end.

For this plan I recommend **Native**: five of the six tasks touch a small, already-understood corner of one form (four small files plus two test files) with tight, already-stated interfaces between them, and Task 6 is explicitly gated on an external decision anyway — the coordination overhead of per-task fresh subagents buys little here, and a shipped mistake (a wrong year boundary, a dropped error message) is cheap to catch in the final review and cheap to fix. Does the plan capture what you want, and which approach should we use?
