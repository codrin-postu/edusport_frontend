# Student notices, cancelled sessions, month bands and portal tracking (frontend) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** In the sportiv portal: a "Mesaje" list (desktop sidebar item and right panel, phone account button counter and sheet row) with per-account dismiss; cancelled and moved sessions on Acasă and in the calendar with their reason; multi-day bands in the portal month grids; Umami page views with normalised paths and hardened GlitchTip in both portals.

**Architecture:** Pure helpers in `src/lib/portal/*.ts` (Node tests in `scripts/portal/*.test.mjs`, type stripping), thin components in `src/app/_portal/ui` (shared) and `src/app/(sportiv)/sportiv/(app)` (sportiv only). One notices context per sportiv shell mount; the BFF allow-list forwards the two new routes. Umami is one client component per portal layout with manual page views; GlitchTip keeps the existing one-app Sentry init and gets a stricter scrub, no traces on portal paths, release and environment tags.

**Tech Stack:** Next.js 15.5 (App Router), React, Tailwind with portal tokens, Radix Dialog, `@sentry/nextjs` (already a dependency, already wired in `src/instrumentation*.ts` and `src/sentry.*.config.ts`), Umami script, Node test runner, Playwright.

**Spec:** `/Users/codrin/Documents/Programming/edusport_backend/docs/superpowers/specs/2026-11-14-breaks-notices-design.md` (sections 2 calendar bands, 3, 5, 6). Backend contract: plan `edusport_backend/docs/superpowers/plans/2026-11-14-breaks-notices-backend.md` (Contract section below is identical).

## Global Constraints

- Build on a new branch cut from frontend `main`; never push; Conventional Commits without AI attribution.
- Copy: Romanian, terse, no em or en dash, no middle dot, straight quotes, no emoji; missing copy is the marker `COPY NEEDED: <what>` and an open question, never invented.
- Visual: square corners (the date block and the phone floating menu excepted), no pills or circles (the counter is a square), no dashed lines, no red text except a date block's top word, no small uppercase eyebrows. Colours only through portal tokens (`npm run check:tokens` exits 0).
- Tests: behaviour only (no colour, size, position or screenshot assertions). Unit: `node --test scripts/portal/<file>.test.mjs`. E2E: `npx playwright test -c playwright.e2e.config.ts --workers=1 <spec>` (one shared mock).
- No dependency installs. The bell icon comes from the already installed `lucide-react` via `node scripts/icons/add-lucide.mjs bell` (writes `public/icons/bell.svg`).
- Never ports 1337, 1340, 3010, 5432, 55442 (the e2e config uses its own hosts on 3200).
- Tracking: no event, URL, title or referrer sent to Umami or GlitchTip carries a name, an e-mail or an id.

## Review Focus

1. A dismiss that fails (BFF 5xx or network): the card stays, the counter does not drop, the reader is told. Test in Task 4.
2. An account whose notices request fails: the shell still renders, "Mesaje" shows no counter and the panel shows the load error, never a crash. Test in Task 4.
3. A Umami page view on `/<athleteId>/concursuri/<resultId>?page=2` and on an invite link: the tracked url is `/[athlete]/concursuri/[result]` and `/invite`, no query. Test in Task 6.
4. A GlitchTip event thrown in a BFF route with an e-mail in the message, an athlete id in the URL and a cookie header: none of the three leave the process. Test in Task 7.
5. A band that starts in the previous month and ends mid-month, and two overlapping bands: one piece per week row, the second on its own lane. Test in Task 3.

## Contract (identical in the backend and frontend plans)

`src/club/portal/sportiv/api-types.ts` (copied verbatim to the frontend `src/lib/portal/sportiv-types.ts`):

```ts
export type MovedFrom = { date: string; startTime: string | null };
export type CalendarItem = {
  date: string; startTime: string | null; endTime: string | null; kind: CalendarKind; title: string; location: string | null; coaches: string[];
  cancelled: boolean; reason: string | null; movedFrom: MovedFrom | null;
};
export type CalendarBand = { title: string; from: string; to: string; kind: 'pauza' | 'eveniment' };
export type SportivCalendar = { month: string; prevMonth: string | null; nextMonth: string | null; items: CalendarItem[]; bands: CalendarBand[] };
export type NoticeRow = { date: string; text: string; reason: string | null };
export type SportivNotice = { id: string; date: string; title: string; body: string | null; rows: NoticeRow[] };
export type SportivNotices = { count: number; notices: SportivNotice[] };
export type NoticeDismissed = { count: number };
```

- Rename: `CalendarItem.note` -> `CalendarItem.reason`. `reason`: on a cancelled item the break name or the cancel note (null when there is none); always null on a held item. `movedFrom`: the planned date and start time of a moved group date or of a lesson whose date or time was changed; null otherwise.
- `SportivHome.upcoming`: the next 3 own items from now, cancelled ones included (before: left out).
- `SportivCalendar.bands` and `CoachCalendar.bands: CalendarBand[]` (coach `api-types.ts`, same `CalendarBand`): every break that applies to at least one of the reader's groups (athlete: groups listing him; coach: own groups) and every multi-day event of those groups, overlapping the month; `from`/`to` are the full span (may run outside the month). `kind`: `pauza` for a break, `eveniment` otherwise.
- Notices, newest `date` first: `GET /portal/sportiv/me/notices` -> `{ data: SportivNotices }`; `POST /portal/sportiv/me/notices/:noticeId/dismiss` -> `{ data: NoticeDismissed }` (the new count), 404 `Nu a fost găsit.` for an id the account has no live delivery of. `id` is a Strapi documentId. Automatic notice: `title` "<n> ședințe anulate" or "<n> ședințe anulate sau mutate" (n = 1: "1 ședință anulată" / "1 ședință anulată sau mutată"), `body` null, `rows` by date. Row `text`: "18:00 Intermediari Bronze" or "18:00 lecție individuală", plus ", Ana" (first name) when the account holds more than one athlete; `reason`: break name, cancel note, "Mutată: Vin 20 noi, 17:00" (where it moved to; row `date` is the planned date) or null. Hand-written notice: `title` and `body` of the announcement, `rows` []. `date`: automatic = the day it was created, hand-written = its start day.

### Task 1: Contract types, BFF allow-list and mocks

Risk: low.

**Files:**
- Modify: `src/lib/portal/sportiv-types.ts` (copy the backend `src/club/portal/sportiv/api-types.ts` verbatim after its Task 6 and Task 10), `src/lib/portal/api-types.ts` (`CalendarBand`, `CoachCalendar.bands`)
- Modify: `src/lib/portal/sportiv-routes.ts` (`["GET", "/me/notices"]`, `["POST", \`/me/notices/${ID}/dismiss\`]`)
- Modify: `src/app/_portal/ui/SessionRow.tsx` (rename old -> new: `item.note` -> `item.reason`)
- Modify: `tests/e2e/sportiv-fixtures.mjs`, `tests/e2e/mock-sportiv.mjs` (notices list and dismiss, kept per account in memory; items with `reason`, `movedFrom`; calendar `bands`), `tests/e2e/portal-fixtures.mjs` / `mock-portal.mjs` (coach calendar `bands`)
- Test: `scripts/portal/sportiv-routes.test.mjs`

**Interfaces:**
- Produces: the Contract types under `@/lib/portal/sportiv-types` and `@/lib/portal/api-types`.

- [ ] **Step 1: Failing test** in `sportiv-routes.test.mjs`: `allowedSportivRoute("GET", "/me/notices")` and `allowedSportivRoute("POST", "/me/notices/abc123/dismiss")` are true; `allowedSportivRoute("POST", "/me/notices/../x/dismiss")`, `("DELETE", "/me/notices/abc123")` and `("GET", "/me/notices/abc123")` are false; `sportivQuery("/me/notices", "?x=1")` is `""`.
- [ ] **Step 2:** `node --test scripts/portal/sportiv-routes.test.mjs` fails.
- [ ] **Step 3:** add the two routes; copy the types; rename `note` in `SessionRow`; extend the mocks (fixture: Ana and Matei on one account, two notices: one automatic with two rows, one hand-written).
- [ ] **Step 4:** the test passes; `npx tsc --noEmit` exits 0.
- [ ] **Step 5:** `git commit -m "feat(sportiv): notices routes in the BFF, reason and movedFrom on items"`

### Task 2: Cancelled and moved sessions on Acasă and in the calendar

Risk: medium.

**Files:**
- Modify: `src/lib/portal/sportiv-calendar.ts` (`sessionLine`), `src/lib/portal/copy-sportiv.ts` (`SESSION`)
- Modify: `src/app/_portal/ui/SessionRow.tsx`, `src/app/_portal/ui/DateBlock.tsx` (prop `struck`), `src/app/_portal/ui/EndBlock.tsx` (kind `cancelled` uses the new band token), `src/styles/portal-theme.css` (`--color-cancelled-band`)
- Test: `scripts/portal/sportiv-calendar.test.mjs`, `tests/e2e/sportiv-home.spec.ts`, `tests/e2e/sportiv-calendar.spec.ts`

**Interfaces:**
- Consumes: `CalendarItem.reason`, `CalendarItem.movedFrom` (Task 1).
- Produces: `sessionLine(item: CalendarItem): string | null` (the muted second line: the reason of a cancelled item, else "Mutată de pe <zi> <d> <lună>, <ora>" for a moved one, else null); `SESSION.cancelledBand = "Anulată"`; `SESSION.movedFrom(date: string, time: string | null): string`.

- [ ] **Step 1: Failing tests.** `sportiv-calendar.test.mjs`:
  ```js
  assert.equal(sessionLine({ ...item, cancelled: true, reason: "Vacanța de iarnă" }), "Vacanța de iarnă");
  assert.equal(sessionLine({ ...item, cancelled: true, reason: null }), null);
  assert.equal(sessionLine({ ...item, movedFrom: { date: "2026-11-18", startTime: "18:00" } }), "Mutată de pe Mie 18 noi, 18:00");
  assert.equal(sessionLine({ ...item, movedFrom: { date: "2026-11-18", startTime: null } }), "Mutată de pe Mie 18 noi");
  assert.equal(sessionLine(item), null);
  ```
  `sportiv-home.spec.ts`, "Acasă keeps a cancelled session": the upcoming list shows the cancelled row with "Anulată" and its reason line, and a moved row with "Mutată de pe ..."; `sportiv-calendar.spec.ts`, "the day list shows the reason of a cancelled session without opening it".
- [ ] **Step 2:** `node --test scripts/portal/sportiv-calendar.test.mjs` fails; the two specs fail.
- [ ] **Step 3: Implement.** `<zi> <d> <lună>` uses `weekdayShort` and `shortDate` ("Mie 18 noi", the date-block words; the backend notice uses the same forms). `SessionRow`: cancelled rows get `DateBlock dim struck` (the time struck through), end block `EndBlock kind="cancelled"` with `SESSION.cancelledBand`, and the `sessionLine` under the title (muted) in the summary, so it shows without opening; moved rows stay normal with the muted line. Token `--color-cancelled-band: #ccd5e3` (decided by Claude: one step darker than `--color-line-subtle` #dde6f3, on the ice scale) with its usage comment, exposed as the Tailwind colour `cancelled-band`; text in it stays `text-muted` unless `check:tokens` reports a contrast below 4.5, then `text-primary`.
- [ ] **Step 4:** the unit test and both specs pass; `npm run check:tokens` exits 0.
- [ ] **Step 5:** `git commit -m "feat(sportiv): cancelled and moved sessions on Acasă and in the day list"`

### Task 3: Multi-day bands in the portal month grids

Risk: medium. Depends on the answer to open question 1 (plan default: build it).

**Files:**
- Modify: `src/lib/portal/month-grid.ts` (`monthWeeks`, `weekBands`), `src/app/_portal/ui/MonthGrid.tsx` (prop `bands`), `src/app/(sportiv)/sportiv/(app)/[athleteId]/calendar/page.tsx`, `src/app/(antrenor)/antrenor/(app)/calendar/CalendarView.tsx`
- Test: `scripts/portal/month-grid.test.mjs`, `tests/e2e/sportiv-calendar.spec.ts`, `tests/e2e/portal-calendar.spec.ts`

**Interfaces:**
- Consumes: `CalendarBand` (Task 1), `SportivCalendar.bands`, `CoachCalendar.bands`.
- Produces: `monthWeeks(month: string): (string | null)[][]` (the `monthCells` in rows of 7); `type BandPiece = { key: string; title: string; kind: CalendarBand["kind"]; col: number; span: number; lane: number }`; `weekBands(week: (string | null)[], bands: CalendarBand[]): BandPiece[]` (same rule as the backend `weekBands`: clipped to the row's real days, col 0..6 Monday first, first-fit lanes by `from`, longer first).

- [ ] **Step 1: Failing tests.** `month-grid.test.mjs`: in November 2026 (1 Nov is a Sunday) a band from `2026-10-28` to `2026-11-03` gives two pieces, first row `{ col: 6, span: 1, lane: 0 }` and second row `{ col: 0, span: 2, lane: 0 }`, both with the title; two overlapping bands get lanes 0 and 1; a band entirely in another month gives no piece. `sportiv-calendar.spec.ts`: "a break shows once per week row with its name, and its cancelled sessions keep their mark"; `portal-calendar.spec.ts`: "the coach month shows the break band".
- [ ] **Step 2:** the unit test and the specs fail.
- [ ] **Step 3: Implement.** `MonthGrid` renders week rows (`monthWeeks`), each with its day buttons and, under them, a band strip with one element per piece (grid column `col + 1` span `span`, row `lane + 1`), the title at the start of each piece, `aria-hidden` false with the title as text. `pauza` uses `bg-cancelled-band`, `eveniment` uses `bg-ice-light`. The day buttons and marks stay as they are (cancelled sessions keep the "anulată" mark).
- [ ] **Step 4:** the unit test and the specs pass.
- [ ] **Step 5:** `git commit -m "feat(portal): multi-day events as one band per week in the month grids"`

### Task 4: Notices context, desktop "Mesaje" and the right panel

Risk: medium.

**Files:**
- Create: `src/app/(sportiv)/sportiv/(app)/_lib/notices-context.tsx`, `src/app/(sportiv)/sportiv/(app)/_ui/NoticeCard.tsx`, `src/app/(sportiv)/sportiv/(app)/_ui/NoticesPanel.tsx`, `src/app/(sportiv)/sportiv/(app)/_ui/NoticesButton.tsx`, `src/app/_portal/ui/SidePanel.tsx`, `public/icons/bell.svg` (via the script)
- Modify: `src/app/_portal/ui/Sidebar.tsx` (prop `above?: React.ReactNode`), `src/app/_portal/ui/PortalShell.tsx` (passes `sidebarAbove`), `src/app/(sportiv)/sportiv/(app)/_ui/SportivShell.tsx`, `src/app/(sportiv)/sportiv/(app)/layout.tsx` (wraps `NoticesProvider`), `src/lib/portal/copy-sportiv.ts` (`NOTICES`)
- Test: `tests/e2e/sportiv-notices.spec.ts` (create)

**Interfaces:**
- Consumes: `SportivNotices`, `NoticeDismissed` (Task 1).
- Produces: `useNotices(): { state: "loading" | "ready" | "error"; notices: SportivNotice[]; count: number; dismiss: (id: string) => Promise<boolean> }`; `NoticesPanel({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void })` (desktop panel; on phones Task 5 uses the same list inside `Sheet`); `NoticeList()` (the cards, shared by both).
- [ ] **Step 1: Failing spec** `sportiv-notices.spec.ts` (desktop viewport):
  - "Mesaje sits above the account row and shows the counter": the sidebar item "Mesaje" has the text "2" and comes before the account button in the sidebar's DOM order;
  - "the panel lists the cards": clicking opens a dialog named "Mesaje" with two cards: the automatic one shows "2 ședințe anulate", its two rows with the date words and "Vacanța de iarnă"; the hand-written one its title and body; each card shows its date "13 noi";
  - "closing a card dismisses it for the account": click "Închide" on one card, the counter shows "1"; reload, still "1" and the card is gone;
  - "a failed dismiss keeps the card": the mock answers 500 once; the card stays, the counter stays "2", the toast text is shown;
  - "a failed list load keeps the shell": the mock answers 500 to the list; the item shows no counter and the panel shows the load error.
- [ ] **Step 2:** `npx playwright test -c playwright.e2e.config.ts --workers=1 tests/e2e/sportiv-notices.spec.ts` fails.
- [ ] **Step 3: Implement.** `NOTICES = { title: "Mesaje", close: "Închide", empty: "COPY NEEDED: no messages", loadError: <the existing shared load error copy>, dismissFailed: "COPY NEEDED: dismiss failed" }`. The provider loads `sportiv/me/notices` once per shell mount through `portalApi`; `dismiss` posts `sportiv/me/notices/<id>/dismiss`, removes the card and sets `count` from the answer only on success. `NoticesButton` (desktop): bell icon, "Mesaje", and a square counter when `count > 0` (decided by Claude: no counter at 0); `Sidebar` renders `above` directly above the account row with a thin solid top line (`border-t border-line-subtle` equivalent on navy). `SidePanel`: Radix Dialog anchored right, full height, 420 px wide, with its own shadow on the panel edge only (cards keep the standard card shadow; the panel shadow is not applied to its inner list). `NoticeCard`: muted date (`dayMonthShort`), title, then the body or the rows (`DateBlock` with the row date, `text`, muted `reason`), "×" button with `aria-label="Închide"`.
- [ ] **Step 4:** the spec passes; `npx tsc --noEmit`, `npm run lint`, `npm run check:tokens` exit 0.
- [ ] **Step 5:** `git commit -m "feat(sportiv): Mesaje in the sidebar with a panel of dismissible cards"`

### Task 5: Phone "Mesaje" in the account button and sheet

Risk: medium.

**Files:**
- Modify: `src/app/(sportiv)/sportiv/(app)/_ui/AccountSheet.tsx` (`AccountButton` counter; first row "Mesaje")
- Test: `tests/e2e/sportiv-notices.spec.ts` (phone cases)

**Interfaces:**
- Consumes: `useNotices`, `NoticeList` (Task 4).
- [ ] **Step 1: Failing spec cases** (phone viewport): "no bell in the header"; "the account button shows the count" (accessible text contains "Ana" and "2"); "the sheet's first row is Mesaje with the counter, then the athletes"; "Mesaje opens the list as a sheet and closing a card updates both counters".
- [ ] **Step 2:** the spec fails.
- [ ] **Step 3: Implement.** `AccountButton`: first name, square counter when `count > 0`, chevron ("Ana 2 ▾"). In `AccountSheet` the first element is a row button with bell, "Mesaje" and the counter, separated from the athlete list by a solid line; it opens a second `Sheet` titled "Mesaje" with `NoticeList`.
- [ ] **Step 4:** the spec passes.
- [ ] **Step 5:** `git commit -m "feat(sportiv): Mesaje in the phone account sheet"`

### Task 6: Umami page views in both portals

Risk: medium (privacy).

**Files:**
- Create: `src/lib/portal/track-path.ts`, `src/app/_portal/ui/PortalUmami.tsx`
- Modify: `src/app/(sportiv)/layout.tsx`, `src/app/(antrenor)/layout.tsx`, `.env.example`, `Dockerfile.production` (ARG and ENV), `docker-compose.production.yml` (build args), `DEPLOY.md` (Umami section), `playwright.e2e.config.ts` (webServer env for the test ids and a local script URL)
- Test: `scripts/portal/track-path.test.mjs` (create), `tests/e2e/portal-tracking.spec.ts` (create)

**Interfaces:**
- Produces: `trackPath(portal: "sportiv" | "antrenor", path: string): string`; `PortalUmami({ portal, websiteId }: { portal: "sportiv" | "antrenor"; websiteId: string | undefined })`.
- Env: `NEXT_PUBLIC_UMAMI_WEBSITE_ID_SPORTIV`, `NEXT_PUBLIC_UMAMI_WEBSITE_ID_ANTRENOR` (one Umami website per portal host), the existing `NEXT_PUBLIC_UMAMI_URL` (same instance as the website). Unset id: no script.

- [ ] **Step 1: Failing tests.** `track-path.test.mjs`:
  ```js
  assert.equal(trackPath("sportiv", "/k2j3h4g5f6d7s8a9q0w1e2r3"), "/[athlete]");
  assert.equal(trackPath("sportiv", "/k2j3h4g5f6d7s8a9q0w1e2r3/istoric"), "/[athlete]/istoric");
  assert.equal(trackPath("sportiv", "/k2j3/concursuri/r_1-2?page=2"), "/[athlete]/concursuri/[result]");
  assert.equal(trackPath("sportiv", "/setari/sportiv/k2j3"), "/setari/sportiv/[athlete]");
  assert.equal(trackPath("sportiv", "/sportiv/k2j3/plati"), "/[athlete]/plati");        // the internal /sportiv prefix is dropped
  assert.equal(trackPath("sportiv", "/invite/SECRETVALUE"), "/invite");
  assert.equal(trackPath("antrenor", "/grupe/abc123/modifica"), "/grupe/[group]/modifica");
  assert.equal(trackPath("antrenor", "/lectie/abc123"), "/lectie/[lesson]");
  assert.equal(trackPath("antrenor", "/sportiv/abc123"), "/sportiv/[athlete]");
  assert.equal(trackPath("antrenor", "/ceva/necunoscut"), "/[other]");
  ```
  `portal-tracking.spec.ts`: the e2e server serves a stub Umami script that records every `umami.track` call on `window`; opening `/<athleteId>/calendar` on the sportiv host records one page view with url `/[athlete]/calendar`, empty title and referrer, and website id `test-sportiv`; navigating to Plăți records `/[athlete]/plati`; no recorded payload contains the athlete id, an e-mail or a `?`.
- [ ] **Step 2:** `node --test scripts/portal/track-path.test.mjs` and the spec fail.
- [ ] **Step 3: Implement.** Known patterns are listed per portal from the `page.tsx` tree (sportiv: `/`, `/[athlete]`, `/[athlete]/{calendar,istoric,parcurs,plati,concursuri}`, `/[athlete]/concursuri/[result]`, `/setari`, `/setari/{parola,dispozitive}`, `/setari/sportiv/[athlete]`, `/login`, `/forgot-password`, `/invite`; antrenor: `/`, `/{calendar,istoric,prezenta,concursuri,grupe,profil}`, `/grupe/[group]`, `/grupe/[group]/{modifica,adauga,sportiv-nou}`, `/lectie/noua`, `/lectie/[lesson]`, `/lectie/[lesson]/modifica`, `/sportiv/[athlete]`, `/antrenament/nou`, `/profil/{securitate,setari}`, `/login`, `/forgot-password`, `/invite`); anything else is `/[other]`. `PortalUmami` loads the script with `data-website-id`, `data-auto-track="false"`, `data-exclude-search="true"`, `data-exclude-hash="true"`, and on load and on every `usePathname()` change calls `window.umami.track((p) => ({ ...p, url: trackPath(portal, pathname), title: "", referrer: "" }))`. No custom events.
- [ ] **Step 4:** both pass.
- [ ] **Step 5:** `git commit -m "feat(portal): Umami page views with route patterns in both portals"`

### Task 7: GlitchTip in both portals: errors only, no personal data

Risk: medium (privacy).

**Files:**
- Modify: `src/lib/portal/sentry-scrub.ts`, `src/instrumentation-client.ts`, `src/sentry.server.config.ts`, `src/sentry.edge.config.ts`, `.env.example`, `Dockerfile.production`, `docker-compose.production.yml`, `DEPLOY.md`
- Test: `scripts/portal/sentry-scrub.test.mjs`

**Interfaces:**
- Produces: `scrubText(text: string): string` (e-mails -> `***@***`, 24-char lowercase alphanumeric ids and athlete/result/group/lesson path segments -> `[id]` via `trackPath` on portal URLs, invite secrets and query masked as today); `isPortalTransaction(name: string | undefined, url: string | undefined): boolean`; `tracesSampler(ctx: { name?: string; normalizedRequest?: { url?: string } }): number` (0 on portal paths, 0.1 elsewhere: the site's rate stays).
- Env: `NEXT_PUBLIC_SENTRY_RELEASE` (client) and `SENTRY_RELEASE` (server and edge, falls back to the public one), `NEXT_PUBLIC_SENTRY_ENVIRONMENT` / `SENTRY_ENVIRONMENT` (fall back to `NODE_ENV`); the DSNs stay as they are.

- [ ] **Step 1: Failing tests** in `sentry-scrub.test.mjs`:
  ```js
  const e = scrubEvent({ message: "fail for ana@example.com", user: { email: "ana@example.com", ip_address: "1.2.3.4" },
    request: { url: "https://sportiv.example/k2j3h4g5f6d7s8a9q0w1e2r3/istoric?page=2", cookies: { s: "x" }, headers: { cookie: "s=x" }, data: { name: "Ana Pop" } },
    exception: { values: [{ value: "athlete k2j3h4g5f6d7s8a9q0w1e2r3 not held by ana@example.com" }] } });
  assert.equal(e.user, undefined);
  assert.equal(e.request.url, "https://sportiv.example/[athlete]/istoric?***");
  assert.equal(e.request.cookies, undefined); assert.equal(e.request.headers.cookie, "***"); assert.equal(e.request.data, undefined);
  assert.ok(!JSON.stringify(e).includes("ana@example.com") && !JSON.stringify(e).includes("k2j3h4g5f6d7s8a9q0w1e2r3"));
  assert.equal(scrubBreadcrumb({ category: "ui.click", message: "button Ana Pop" }).message, undefined);
  assert.equal(tracesSampler({ name: "GET /sportiv/[athleteId]/calendar" }), 0);
  assert.equal(tracesSampler({ name: "GET /antrenor/api/portal/coach/[...path]" }), 0);
  assert.equal(tracesSampler({ name: "GET /cursuri" }), 0.1);
  ```
- [ ] **Step 2:** `node --test scripts/portal/sentry-scrub.test.mjs` fails.
- [ ] **Step 3: Implement.** All three inits: `sendDefaultPii: false`, `tracesSampler` in place of `tracesSampleRate`, `release`, `environment`, no replay integration (none is added today; keep it so), the existing `beforeSend*` hooks now also drop `event.user`, `request.cookies`, `request.data` and `extra`, and run `scrubText` over `message`, exception values and breadcrumb messages; `ui.click` / `ui.input` breadcrumbs lose their message. BFF route errors are already captured through `onRequestError` in `src/instrumentation.ts`; nothing to add there.
- [ ] **Step 4:** the test passes; `npx tsc --noEmit` exits 0.
- [ ] **Step 5:** `git commit -m "feat(portal): GlitchTip errors only, without personal data, with release and environment"`

### Task 8: Whole-branch verification

Risk: low.

- [ ] **Step 1:** `npx tsc --noEmit && npm run lint && npm run check:tokens && npm run test:scripts` exit 0.
- [ ] **Step 2:** `npx playwright test -c playwright.e2e.config.ts --workers=1` passes (all portal and sportiv specs; the site specs unchanged).
- [ ] **Step 3:** `npm run build` succeeds.
- [ ] **Step 4:** add to `DEPLOY.md` the deploy order (backend first or together: the frontend reads `reason`, `movedFrom`, `bands` and the notices routes) and the two new Umami websites to create; commit `docs(deploy): portal tracking env and deploy order`.

## Open questions (for the user)

1. The portal month grids (sportiv and coach) are compact day-mark grids without event names, and the coach calendar shows no breaks today. Add the labelled band strip there (plan default, frontend Task 3 and the `bands` fields), or leave the portal grids as they are?
2. Opening a portal announcement shows parents' e-mails and children's names. Keep that list on the `website` area (as asked), or show the accounts list only to `club` admins?
3. Copy marked `COPY NEEDED`: empty "Mesaje" list; failed dismiss toast; refusals "no place ticked" and "no group chosen"; "Oprește" confirmation; accounts list headings and "no recipients yet"; author unknown; the state words of the place icons (active, scheduled, ended).
