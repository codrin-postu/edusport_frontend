# Phase 6 Frontend, part 1: hosts and BFF (Tasks 1 to 9)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

Read first: `2026-11-06-phase6-frontend-index.md` (Global Constraints, Review Focus, gaps, rulings). Every task below implicitly includes the Global Constraints. Contracts: p3be `docs/superpowers/plans/2026-11-04-phase6-index.md` "HTTP contracts".

---

### Task 1: Move the site into the `(site)` route group (Haiku, normal)

**Files:**
- Move (git mv): `src/app/{layout.tsx,page.tsx,not-found.tsx,opengraph-image.tsx,contact,cursuri,despre-noi,homepage,inscrieri,landing-v2,noutati,parteneri,protectia-datelor,voluntariat}` to `src/app/(site)/`
- Stay at root: `src/app/{api,globals.css,favicon.ico,manifest.ts,robots.ts,sitemap.ts}`
- Modify: relative imports that break (`./globals.css` becomes `../globals.css`; `../components/...` becomes `@/components/...`), `tests/visual/routes.ts` only if it holds file paths

**Interfaces:**
- Produces: `src/app/(site)/layout.tsx` (today's root layout, unchanged behaviour, Umami stays here only). No `src/app/layout.tsx` remains.

- [ ] **Step 1:** `git mv` each listed entry; fix imports until `npx tsc --noEmit` is clean. `grep -rn "app/inscrieri\|app/cursuri" src scripts tests` and repoint any path-based import to `@/app/(site)/...`.
- [ ] **Step 2: Verify nothing changed for visitors**
Run: `npm run build && npm run test:scripts && npm run test:e2e`
Expected: build lists the same routes as before (`/`, `/cursuri/...`, `/inscrieri`, ...), all green. `npm run test:visual` may run in the background; any diff is reported, never re-recorded.
- [ ] **Step 3: Commit**
`git add -A src/app scripts tests && git commit -m "refactor(app): move the site into the (site) route group"`

---

### Task 2: Host routing, portal root layout, noindex (Sonnet, HIGH, RB1)

**Files:**
- Create: `src/lib/portal/host.ts`, `scripts/portal/host.test.mjs`, `src/middleware.ts`, `src/app/(antrenor)/layout.tsx`, `src/app/(antrenor)/antrenor/page.tsx` (placeholder "Azi" heading, replaced in T12), `src/app/(antrenor)/antrenor/not-found.tsx`, `src/app/(antrenor)/antrenor/robots.txt/route.ts`, `tests/e2e/portal-hosts.spec.ts`
- Modify: `playwright.e2e.config.ts` (env added in T4; this task only adds the spec file)

**Interfaces:**
- Produces:
  - `type Site = "site" | "antrenor" | "reserved"`
  - `siteForHost(host: string | null, antrenorHost: string | undefined): Site`: lower-case, port stripped; `antrenor` when equal to `antrenorHost` or `antrenor.localhost`; `reserved` when the first label is `sportiv`; else `site`.
  - `routeRequest(site: Site, pathname: string): { action: "next" } | { action: "rewrite"; pathname: string } | { action: "notFound" }`
  - Portal root layout: `<html lang="ro">`, `globals.css`, Inter font, `metadata.robots = { index: false, follow: false }`, title "EduSport antrenor", no Header, Footer, cookie banner, announcement or `Script`.

Rules of `routeRequest`:
- `site`: `/antrenor` or `/antrenor/...` or `/api/portal/...` -> notFound; else next.
- `reserved`: `/api/health` -> next; else notFound.
- `antrenor`: `/_next/...`, `/api/health`, and any path whose last segment has a file extension except `.txt`, `.xml`, `.webmanifest` -> next (public files: logo, fonts, icons); `/robots.txt` -> rewrite `/antrenor/robots.txt`; `/sitemap.xml`, `/manifest.webmanifest`, `/opengraph-image...`, `/antrenor/...` -> notFound; anything else -> rewrite `/antrenor` + pathname (`/` -> `/antrenor`).

- [ ] **Step 1: Write the failing tests** (`scripts/portal/host.test.mjs`, same skip pattern as `scripts/club/club-schedule.test.mjs`)

```js
it("routes hosts", () => {
  assert.equal(siteForHost("antrenor.localhost:3200", undefined), "antrenor");
  assert.equal(siteForHost("ANTRENOR.scoaladepatinaj.com", "antrenor.scoaladepatinaj.com"), "antrenor");
  assert.equal(siteForHost("antrenor.evil.com", "antrenor.scoaladepatinaj.com"), "site");
  assert.equal(siteForHost("sportiv.scoaladepatinaj.com", "antrenor.scoaladepatinaj.com"), "reserved");
  assert.equal(siteForHost(null, undefined), "site");
});
it("keeps each host to its pages", () => {
  assert.deepEqual(routeRequest("site", "/antrenor/grupe"), { action: "notFound" });
  assert.deepEqual(routeRequest("site", "/api/portal/auth/login"), { action: "notFound" });
  assert.deepEqual(routeRequest("site", "/cursuri"), { action: "next" });
  assert.deepEqual(routeRequest("antrenor", "/"), { action: "rewrite", pathname: "/antrenor" });
  assert.deepEqual(routeRequest("antrenor", "/grupe/abc"), { action: "rewrite", pathname: "/antrenor/grupe/abc" });
  assert.deepEqual(routeRequest("antrenor", "/robots.txt"), { action: "rewrite", pathname: "/antrenor/robots.txt" });
  assert.deepEqual(routeRequest("antrenor", "/sitemap.xml"), { action: "notFound" });
  assert.deepEqual(routeRequest("antrenor", "/antrenor/grupe"), { action: "notFound" });
  assert.deepEqual(routeRequest("antrenor", "/logo.png"), { action: "next" });
  assert.deepEqual(routeRequest("reserved", "/"), { action: "notFound" });
});
```

- [ ] **Step 2:** Run `node --test scripts/portal/host.test.mjs`; expected FAIL (module missing).
- [ ] **Step 3:** Implement `host.ts`; `src/middleware.ts` with `export const config = { runtime: "nodejs", matcher: ["/((?!_next/static|_next/image).*)"] }`: notFound answers `new NextResponse(null, { status: 404 })`; on the `antrenor` and `reserved` sites every response (next or rewrite) gets `X-Robots-Tag: noindex, nofollow` and `Referrer-Policy: no-referrer`. `robots.txt/route.ts` answers `User-agent: *\nDisallow: /\n` as `text/plain`. `antrenor.localhost` matches in every mode (local runs and e2e use `next start`, a production build); it cannot reach the VM because nginx only forwards its own server names.
- [ ] **Step 4:** Run `node --test scripts/portal/host.test.mjs`; expected PASS.
- [ ] **Step 5: e2e** (`tests/e2e/portal-hosts.spec.ts`, base `http://antrenor.localhost:3200` via `test.use({ baseURL })`; the main host is the config base)
  - `antrenor` `/robots.txt` body contains `Disallow: /`; `/` response header `x-robots-tag` is `noindex, nofollow`; `/sitemap.xml` and `/cursuri` answer 404.
  - main host `/antrenor` and `/api/portal/auth/login` (POST) answer 404; `/cursuri/program` answers 200.
  - the coach host page source has no `script[src*="umami"]` and has `meta[name="robots"][content*="noindex"]` (the e2e build sets `NEXT_PUBLIC_UMAMI_WEBSITE_ID`, T4).
  Run: `npm run test:e2e -- tests/e2e/portal-hosts.spec.ts` (after T4 is merged; before that run the node test only). Expected PASS.
- [ ] **Step 6: Commit** `git commit -m "feat(portal): route the antrenor host to its own app, noindex"`

---

### Task 3: Backend types, copy and format helpers (Haiku, normal)

**Files:**
- Create: `src/lib/portal/api-types.ts`, `src/lib/portal/copy.ts`, `src/lib/portal/format.ts`, `scripts/portal/format.test.mjs`, `scripts/portal/copy.test.mjs`

**Interfaces:**
- Produces:
  - `api-types.ts`: verbatim copy of p3be `src/club/portal/coach/api-types.ts` with its imports inlined (gap G3 list in the index: `Occurrence` from `src/api/calendar-event/services/expand.ts`, `GroupProgram`, `ProgramRow`, `SeasonRef`, `RepeatFreq`, `DayKey`, `WeekOfMonth`, `AddedSession`, `SectionKind`, `SessionCheck`, `SavedOnDay`, `SessionSaveBody`, `Tick`, `SessionSaved`, `LessonBody`, `LessonPatch`, `LessonSaved`, `LessonState`, `JoinResult`, `DateAnswer`), plus `PortalSession` (contracts), `ApiRefusal = { data: null; error: { status: number; name: string; message: string } }`, and the four body types of gap G3:
    `ProgramAddBody = { repeat: true; freq: RepeatFreq; days: DayKey[]; weekOfMonth?: WeekOfMonth; startTime: string; durationMin: number; from: string } | { repeat: false; date: string; startTime: string; durationMin: number; note?: string }`, `ProgramChangeBody = Omit<Extract<ProgramAddBody, { repeat: true }>, "repeat">` (check against `readSeriesInput` / the change reader in p3be `src/club/groups/program-plan.ts` and correct the shape to what the reader accepts), `ProgramEndBody = { from: string }`, `DateBody = { mode: "keep" } | { mode: "cancel"; reason?: string; notifyParents?: boolean } | { mode: "move"; newDate: string; newStartTime: string; reason?: string; notifyParents?: boolean }`. A header comment names the p3be commit (0474a2f) and files copied.
  - `copy.ts`: one exported `const` per area (`LOGIN`, `INVITE`, `RESET`, `EYE`, `NAV`, `AZI`, `GRUPE`, `GROUP`, `PRESENCE`, `LESSON`, `ADD_ATHLETE`, `NEW_ATHLETE`, `CARD`, `PROGRAM`, `HISTORY`, `PROFILE`, `SETTINGS`, `SECURITY`, `STATES`, `A11Y`) holding every string below; functions for strings with values.
  - `format.ts`: `dayTile(date: string): string` ("2026-10-06" -> "MA 6 OCT"; days LU MA MI JO VI SÂ DU, months IAN FEB MAR APR MAI IUN IUL AUG SEP OCT NOI DEC), `dateTile(date): { day: string; weekday: string }` ("7", "MI"), `shortDate(date)` ("30 sep"; lower-case months, "noi" for November), `pickLabel(date)` ("vineri 16 oct"), `durationText(min: number)` ("50 min", "1 h", "1 h 15 min"), `relativeDay(iso: string, today: string)` ("azi", "ieri", else `shortDate`), `firstOfMonth`, `addMonths(month: string, n: number): string`.

Strings (spec 9 and 5, approved; `<x>` = value; counts via `roCount`):
- LOGIN: "Intră în cont", "Continuă cu Google", "sau", "E-mail", "Parolă", "Intră", "Am uitat parola". EYE: "Arată parola", "Ascunde parola".
- INVITE: "Bun venit", "Contul tău: <e-mail>", "Parolă nouă", "Salvează parola", "sau", "Continuă cu Google", "Invitația a expirat. Cere administratorului una nouă.".
- RESET: "Am uitat parola", "E-mail", "Trimite codul", "Cod din e-mail", "Parolă nouă", "Salvează parola", "Înapoi la intrare".
- NAV: "Azi", "Grupe", "Istoric", "Profil".
- AZI: "Bună, <prenume>", "Grupe", "Lecții individuale", "De făcut", "Completat", "+ Lecție individuală", "Nicio ședință azi.", "grup, <n copii>", "individuală, <durată>", "grup, <data>".
- GRUPE: "Grupele mele", "Alte grupe", "<program>, <n copii>", "Antrenor: <nume>, <nume>".
- GROUP: "Sportivi", "Program", "Antrenori: <nume>, <nume>", "Fă prezența", "Sportivi (<n>)", "<n ani>", "nou", "și în <grupă>", "+ Adaugă sportiv", "Grupa altui antrenor", "Program: <program>", "Înlocuiesc azi", "Fă prezența ca înlocuitor".
- PRESENCE: "Antrenor", "<nume> (tu)", "+ Adaugă alți antrenori", "Sportiv", "Grup", "Uscat", "<n prezenți>" (roCount "prezent" / "prezenți"), "Salvează", "Alege ziua pentru care faci prezența.", "are prezență salvată", "Alege <zi> <dată>", "Vei apărea ca antrenor la această ședință.", "Arhivată. Nu mai poate fi modificată.", "În afara programului", "Fără abonament", and phase 5 verbatim from p3be `src/club/presence/copy/attendance.ts`: `EXISTING_SESSION` ("Există deja o ședință salvată", "Deschide prezența salvată", "Adaugă încă o ședință în ziua asta", "Salvată de <nume>") and `REACTIVATE_DIALOG` ("Sportiv inactiv", "<nume> are statusul Inactiv. Reactivezi sportivul?", "Salvează fără", "Reactivează și salvează").
- LESSON: "Lecție individuală", "Sportiv", "Data", "Ora", "Durată", "Ore", "Minute", "OK", "Antrenor", "Prezent", "Salvează lecția", "Salvează prezența", "Șterge lecția", "Ștergi lecția din <shortDate>?", "Renunță" (phase 5 `LESSON_COPY.deleteLink`, `deleteConfirm`, `PREZENTA_COPY.giveUp`).
- ADD_ATHLETE: "Adaugă în <grupă>", "Caută după nume", "<nume>, <n ani>", "Nu e în listă: sportiv nou", "Din data", "Adaugă <n sportivi>" (roCount "sportiv" / "sportivi").
- NEW_ATHLETE: "Sportiv nou", "Nume și prenume", "Data nașterii", "zz.ll.aaaa", "Părinte", "Telefon", "E-mail", "opțional", "Adaugă în <grupă>".
- CARD: "Grupe", "Școala", "Contact", "Sună".
- PROGRAM: "Listă", "Lună", "+ Adaugă program", "Se repetă", "Cât de des", "Săptămânal", "La 2 săptămâni", "Lunar", "Zile", "De la", "Durată", "Se aplică din", "Schimbă", "Șterge programul", "Ține", "Anulează", "Mută", "Anunță părinții pe e-mail", "Program public", "Programul apare în calendarul de pe site.", "trecut", "Programul Școlii îl schimbă administratorul.", and from p3be `src/club/groups/copy/grupe-ui.ts` verbatim: `breakNotice` ("Pauză: <nume>."), day letters, the date panel and drawer labels the admin uses for the same fields (copy, do not invent).
- HISTORY: "<n ședințe de grup>, <n lecții individuale>, <ore> ore", "grup, <n prezenți>", "individuală, <durată>", "înlocuitor, <n prezenți>".
- PROFILE: "Antrenor", "Setări cont", "Securitate", "Ieși din cont". SETTINGS: "Nume", "E-mail", "Numele și e-mailul le schimbă administratorul. După schimbarea e-mailului, intri cu adresa nouă.", "Telefon", "Schimbă parola", "Parola actuală", "Parola nouă", "Salvează", "Setează o parolă". SECURITY: "Dispozitiv", "Ultima dată", "acesta", "Deconectează".
- STATES: "Nu am putut încărca datele.", "Nu mai ai acces la această grupă.", "Cerere invalidă.". A11Y (ruling 8): "Înapoi", "Luna anterioară", "Luna următoare", "Profil".

- [ ] **Step 1: Failing tests.** `format.test.mjs`: `dayTile("2026-10-06") === "MA 6 OCT"`, `dayTile("2026-11-01") === "DU 1 NOI"`, `shortDate("2026-09-30") === "30 sep"`, `pickLabel("2026-10-16") === "vineri 16 oct"`, `durationText(50) === "50 min"`, `durationText(60) === "1 h"`, `durationText(75) === "1 h 15 min"`, `relativeDay("2026-11-05T21:30:00Z", "2026-11-06") === "azi"` (Bucharest day), `relativeDay("2026-11-04T10:00:00Z", "2026-11-06") === "4 noi"`, `addMonths("2026-12", 1) === "2027-01"`. `copy.test.mjs`: walks every string and function output (functions called with "X" / 3) of `copy.ts` and asserts none matches `/[–—·“”„]|Email|\p{Extended_Pictographic}/u`.
- [ ] **Step 2:** `node --test scripts/portal/format.test.mjs scripts/portal/copy.test.mjs`; expected FAIL.
- [ ] **Step 3:** Write the three modules (type-only imports; `copy.ts` imports `roCount` at runtime, so `copy.test.mjs` loads `src/lib/ro-plural.ts` first through the same relative import: write the import as `import { roCount } from "../ro-plural.ts"` only if tsconfig has `allowImportingTsExtensions`; otherwise inline a local `count()` copy of `roCount` in `copy.ts` with a comment naming the source).
- [ ] **Step 4:** Run the two tests and `npx tsc --noEmit`; expected PASS.
- [ ] **Step 5: Commit** `git commit -m "feat(portal): coach api types, copy and date formats"`

---

### Task 4: Mock Strapi portal (Sonnet, normal)

**Files:**
- Create: `tests/e2e/mock-portal.mjs`, `tests/e2e/portal-fixtures.mjs`, `tests/e2e/portal-helpers.ts`
- Modify: `playwright.e2e.config.ts` (third webServer `node tests/e2e/mock-portal.mjs 18891`; Next env adds `PORTAL_BFF_SECRET=test-bff-secret-000000000000000000`, `PORTAL_STRAPI_URL=http://localhost:18891`, `NEXT_PUBLIC_UMAMI_WEBSITE_ID=e2e-umami`)

**Interfaces:**
- Consumes: the contracts table (auth and coach routes, shapes from `api-types.ts` of T3).
- Produces: a mock answering every auth route and all 27 coach routes under `/api/portal/...` with synthetic data; `PORTAL_STRAPI_URL` (BFF base for portal calls; defaults to `STRAPI_BASE` when unset, T6).
  - Fixtures: coach "Andrei Popa" (`antrenor1@example.invalid`, password `Throwaway-Coach-1`), own Club group "Avansați" (Ma, Mi 18:15, 9 children, one `nou`, one also in "Uscat Juniori"), own Școala group "Primii Pași", other group "Intermediari Silver" (coach "Bianca Ene"), a saved session today, an undone class 6 days ago in `todo`, an archived session 9 days ago, two lessons today (one done), a Google-only coach `antrenor3@example.invalid`, an invite secret `inv-valid-0000000000000000000000` (valid, `antrenor2@example.invalid`) and `inv-old-00000000000000000000000000` (expired). Dates are computed from the run day.
  - More fixtures: reset code `123456` for any e-mail; an inactive child in "Avansați" (409 reactivation on save when ticked); a child of "Intermediari Silver" on a stand-in session of the coach from 3 days ago (card without contact); two devices, one matching the e2e device cookie; history of the current month with one "inlocuitor" row of 10 present.
  - `portal-helpers.ts`: `COACH_BASE = "http://antrenor.localhost:3200"`, `loginAs(page: Page, email?: string): Promise<void>` (POST `/api/portal/auth/login` from the page with `Origin: COACH_BASE`), `mockState(s: object): Promise<void>`, `mockLog(): Promise<MockCall[]>`.
  - Behaviour switches the specs drive through `POST /__mock/state` `{ accessTtlSec?, cutAccount?, revokeAll?, failGoogle?, googleClientId?: string | null, emptyToday? }` and inspect through `GET /__mock/log` (list of `{ method, path, headers: { secret, ip, ua, device, auth } }`, refresh count).
  - Refresh rules as the backend: rotate on use; the previous token answers 401 `""` for 30 s without revoking; a token older than that, or reused after the grace, revokes the session (all later calls 401). Every route without `x-portal-secret` equal to the env value answers 403 `Forbidden` (auth: `ClubAdminError` shape; coach: `{ error: { name: "ForbiddenError", message: "Policy Failed" } }`). `cutAccount` makes coach routes answer that policy 403.
  - Writes answer the contract success shapes and record the body; refusals used by specs: session save on the archived session -> 403 `ClubAdminError` "Arhivată. Nu mai poate fi modificată."; any write on "Intermediari Silver" except stand-in presence -> 403 "Nu mai ai acces la această grupă.".

- [ ] **Step 1:** Write the fixtures and the server (plain Node `http`, same style as `tests/e2e/mock-strapi.mjs`).
- [ ] **Step 2: Smoke** Run: `node tests/e2e/mock-portal.mjs 18891 & sleep 1; curl -s -XPOST localhost:18891/api/portal/auth/login -H 'x-portal-secret: test-bff-secret-000000000000000000' -H 'content-type: application/json' -d '{"host":"antrenor","email":"antrenor1@example.invalid","password":"Throwaway-Coach-1"}'; kill %1`
Expected: `{"data":{"accessToken":...,"refreshToken":...,"accessExpiresAt":...,"deviceKey":...}}`.
- [ ] **Step 3: Commit** `git commit -m "test(portal): mock Strapi portal routes for e2e"`

---

### Task 5: Cookie, origin, header and route rules (Sonnet, HIGH, RB1)

**Files:**
- Create: `src/lib/portal/{cookies,origin,upstream,coach-routes}.ts`, `scripts/portal/{cookies,origin,upstream,coach-routes}.test.mjs`

**Interfaces:**
- Produces:
  - `type CookieNames = { access: string; refresh: string; device: string; google: string; invite: string; flash: string }`; `cookieNames(secure: boolean): CookieNames` (`__Host-es_at`, `__Host-es_rt`, `__Host-es_dev`, `__Host-es_g`, `__Host-es_inv`, `__Host-es_flash`; without the prefix when not secure).
  - `type CookieSpec = { name: string; value: string; maxAge: number; httpOnly: true; secure: boolean; sameSite: "lax"; path: "/" }`
  - `sessionCookies(s: PortalSession, nowMs: number, secure: boolean): CookieSpec[]`: access max-age `clamp(floor((accessExpiresAt - now) / 1000) - 15, 0, 600)`, refresh 2592000, device 34560000 only when `deviceKey !== null`.
  - `clearSessionCookies(secure: boolean): CookieSpec[]` (access and refresh, value "", max-age 0; device kept); `shortCookie(name: string, value: string, maxAge: number, secure: boolean): CookieSpec`.
  - `isSecureRequest(url: string, forwardedProto: string | null): boolean` (https url or `x-forwarded-proto` "https").
  - `originAllowed(method: string, origin: string | null, host: string | null, secure: boolean): boolean`: GET and HEAD true; otherwise `origin === (secure ? "https://" : "http://") + host`, host compared lower-case; missing origin or host false.
  - `bffHeaders(i: { secret: string; ip: string | null; userAgent?: string | null; device?: string | null; access?: string | null }): Record<string, string>`: `x-portal-secret`, `x-portal-client-ip` (`ip` trimmed, at most 64 chars, else "unknown"), `x-portal-user-agent` (at most 512 chars, only when given), `x-portal-device` (only when given), `authorization: Bearer <access>` (only when given), `content-type: application/json`.
  - `type Outcome = "ok" | "refresh" | "cut" | "refusal"`; `classifyCoach(status: number, body: unknown): Outcome`: 2xx ok; 401 refresh; 403 with `body.error.name !== "ClubAdminError"` cut; anything else refusal.
  - `readSession(body: unknown): PortalSession | null` (strings for both tokens and `accessExpiresAt` parseable as a date; `deviceKey` string or null).
  - `maskSecrets(text: string): string`: `/invitatie/<anything up to ?, # or space>` -> `/invitatie/***`; JSON `"secret":"..."`, `"password":"..."`, `"current":"..."`, `"code":"..."`, `"refreshToken":"..."`, `"accessToken":"..."` values -> `"***"`.
  - `allowedCoachRoute(method: string, path: string): boolean` for `path` after `/api/portal/coach`: exactly the 27 routes of p3be `src/api/portal/routes/02-coach.ts`; `:documentId`, `:eventId`, `:id` match `^[A-Za-z0-9]{1,64}$`, `:date` matches `^\d{4}-\d{2}-\d{2}$`.

- [ ] **Step 1: Failing tests** (four files). Assertions, among others:
  - `cookieNames(true).refresh === "__Host-es_rt"`, `cookieNames(false).refresh === "es_rt"`.
  - `sessionCookies({ accessToken: "a", refreshToken: "r", accessExpiresAt: new Date(now + 600000).toISOString(), deviceKey: null }, now, true)` has two entries, access `maxAge` 585, both `secure` true, `httpOnly` true, `sameSite` "lax", `path` "/", no device cookie; with `deviceKey: "d"` a third entry with `maxAge` 34560000.
  - `clearSessionCookies(true).map(c => c.name)` deep-equals `["__Host-es_at", "__Host-es_rt"]`.
  - `originAllowed("POST", "https://antrenor.x.ro", "antrenor.x.ro", true)` true; `"http://antrenor.x.ro"` with secure false for https host false; `null` origin false; `"https://evil.ro"` false; `"GET"` with null true.
  - `bffHeaders({ secret: "s", ip: null })["x-portal-client-ip"] === "unknown"`; no `authorization` key when `access` is absent.
  - `classifyCoach(403, { error: { name: "ForbiddenError", message: "x" } }) === "cut"`; `classifyCoach(403, { data: null, error: { status: 403, name: "ClubAdminError", message: "Nu mai ai acces la această grupă." } }) === "refusal"`; `classifyCoach(401, {}) === "refresh"`; `classifyCoach(404, {}) === "refusal"`.
  - `maskSecrets("GET /invitatie/abcDEF123?x=1")` contains `/invitatie/***?x=1`; `maskSecrets('{"secret":"abc","email":"a@b"}') === '{"secret":"***","email":"a@b"}'`.
  - `allowedCoachRoute("PUT", "/program/abc123/dates/2026-11-06")` true; `("GET", "/program/abc123")` false; `("DELETE", "/me/devices/x1")` true; `("GET", "/../club/athletes")` false; `("GET", "/groups/a/b")` false.
- [ ] **Step 2:** Run `node --test scripts/portal/cookies.test.mjs scripts/portal/origin.test.mjs scripts/portal/upstream.test.mjs scripts/portal/coach-routes.test.mjs`; expected FAIL.
- [ ] **Step 3:** Implement the four modules (type-only imports of `PortalSession`).
- [ ] **Step 4:** Run the same command; expected PASS. `npx tsc --noEmit`, `npm run lint`.
- [ ] **Step 5: Commit** `git commit -m "feat(portal): cookie, origin and BFF header rules"`

---

### Task 6: Refresh serializer and BFF core (Sonnet, HIGH, RB1)

**Files:**
- Create: `src/lib/portal/refresh.ts`, `scripts/portal/refresh.test.mjs`, `src/lib/portal/bff.ts`

**Interfaces:**
- Consumes: T5 (`cookieNames`, `sessionCookies`, `clearSessionCookies`, `bffHeaders`, `classifyCoach`, `readSession`, `isSecureRequest`).
- Produces:
  - `type RefreshResult = { ok: true; session: PortalSession } | { ok: false }`
  - `createRefresher(run: (refreshToken: string) => Promise<RefreshResult>, nowMs: () => number, graceMs?: number): (refreshToken: string) => Promise<RefreshResult>`: one in-flight promise per SHA-256 of the token (`node:crypto`); a finished result is reused for `graceMs` (default 30000) for the same token; entries older than the grace are dropped on each call; a rejected `run` gives `{ ok: false }` and is not cached.
  - `bff.ts` (server only, `import "server-only"` if present in deps, else a comment):
    - `type BffContext = { secure: boolean; names: CookieNames; host: string | null; ip: string | null; userAgent: string | null; access: string | null; refresh: string | null; device: string | null }`; `bffContext(req: NextRequest): BffContext`.
    - `callStrapi(path: string, init: { method: string; body?: unknown; access?: string | null; device?: string | null; userAgent?: boolean }, ctx: BffContext): Promise<{ status: number; body: unknown }>`: base `PORTAL_STRAPI_URL ?? STRAPI_BASE`, path under `/api/portal/`, 10 s timeout, `cache: "no-store"`; a network error or timeout answers `{ status: 502, body: refusal(502, STATES.loadFailed) }`; logs only `portal-bff <method> <maskSecrets(path)> <status>`.
    - `secretReady(): boolean` (`PORTAL_BFF_SECRET` at least 32 chars; logs `portal-bff: PORTAL_BFF_SECRET missing` once when false).
    - `coachCall(ctx: BffContext, method: string, path: string, body: unknown): Promise<{ status: number; body: unknown; cookies: CookieSpec[] }>`: no refresh cookie -> 401 and clear; no access cookie -> refresh first; call; outcome `refresh` -> refresh once, retry once; refresh failure -> 401 body `{ data: null, error: { status: 401, name: "SessionEnded", message: "" } }` and clear; outcome `cut` -> the same 401 and clear; otherwise pass status and body; any successful refresh adds `sessionCookies`.
    - `respond(status: number, body: unknown, cookies: CookieSpec[]): NextResponse` (JSON, `Cache-Control: no-store`, each cookie set with its flags).
    - `refusal(status: number, message: string): ApiRefusal`.
  - The module-level refresher: `createRefresher((rt) => callStrapi("auth/refresh", { method: "POST", body: { refreshToken: rt } }, ctx)...)`; the refresher key must not depend on `ctx`, so `run` takes the token and a captured header set (ip, secret) of the first caller.

- [ ] **Step 1: Failing tests** (`refresh.test.mjs`, fake `run` counting calls, controllable clock):
  - two parallel calls with "rt1" -> `run` called once, both results deep-equal.
  - a call with "rt1" 5 s after the first resolved -> `run` not called again, same session.
  - a call with "rt1" 31 s after -> `run` called a second time.
  - different tokens "rt1", "rt2" in parallel -> `run` called twice.
  - `run` rejecting -> `{ ok: false }`, and the next call runs again.
- [ ] **Step 2:** `node --test scripts/portal/refresh.test.mjs`; expected FAIL.
- [ ] **Step 3:** Implement `refresh.ts`, then `bff.ts` (exercised by the T9 e2e).
- [ ] **Step 4:** Run the test; expected PASS. `npx tsc --noEmit`, `npm run lint`.
- [ ] **Step 5: Commit** `git commit -m "feat(portal): one refresh per session and the BFF core"`

---

### Task 7: Auth handlers, invite bridge, log masking (Sonnet, HIGH, RB2)

**Files:**
- Create under `src/app/(antrenor)/antrenor/`: `api/portal/auth/login/route.ts`, `api/portal/auth/logout/route.ts`, `api/portal/auth/reset/request/route.ts`, `api/portal/auth/reset/confirm/route.ts`, `api/portal/auth/invite/accept/route.ts`, `api/portal/auth/flash/route.ts`, `invitatie/[secret]/route.ts`; `src/lib/portal/invite.ts` (`readInviteState(): Promise<{ state: "valid"; email: string } | { state: "expired"; email: null } | { state: "none" }>` for the T11 server page)
- Modify: `src/sentry.server.config.ts`, `src/instrumentation-client.ts` (Sentry client init, if it holds `Sentry.init`), adding `beforeSend` and `beforeBreadcrumb` that run `maskSecrets` on `request.url`, `request.data`, breadcrumb `data.url` and `message`
- Test: `tests/e2e/portal-auth.spec.ts`

**Interfaces:**
- Consumes: T5, T6 (`bffContext`, `callStrapi`, `respond`, `refusal`, `secretReady`, `originAllowed`, `sessionCookies`, `clearSessionCookies`, `shortCookie`), `rateLimit` from `src/lib/rate-limit.ts`.
- Produces (browser-facing, all `runtime = "nodejs"`, `dynamic = "force-dynamic"`; every POST runs the Origin check first, 403 `refusal(403, STATES.invalid)` on failure, then `secretReady()` else 503 `STATES.loadFailed`; bodies over 64 KB 413):
  - `POST /api/portal/auth/login` `{ email, password }` -> Strapi `auth/login` `{ host: "antrenor", email, password, deviceKey }` with user agent; success sets `sessionCookies`, answers `{ data: { ok: true } }`; refusal passes status and body unchanged.
  - `POST /api/portal/auth/logout` -> Strapi `auth/logout` `{ refreshToken }` when the cookie exists; always clears and answers `{ data: { ok: true } }`.
  - `POST /api/portal/auth/reset/request` `{ email }` -> pass through (`data.message` shown by the screen).
  - `POST /api/portal/auth/reset/confirm` `{ email, code, password }` -> Strapi with `host: "antrenor"`, `deviceKey`; success as login.
  - `POST /api/portal/auth/invite/accept` `{ password }` -> secret from the `invite` cookie (none: 410 with INVITE expired text); success as login and clears the invite cookie.
  - `GET /api/portal/auth/flash` -> `{ data: { message: string | null } }` and clears the flash cookie.
  - `GET /invitatie/<secret>`: secret must match `^[A-Za-z0-9_-]{16,128}$` (else 303 to `/invitatie` with no cookie); sets `shortCookie(names.invite, secret, 1800, secure)`; answers 303 `Location: /invitatie`, `Cache-Control: no-store`, `Referrer-Policy: no-referrer`.
  - `readInviteState()` (server only): reads the invite cookie through `cookies()`, calls Strapi `auth/invite/read` `{ secret }` (POST, body), maps 2xx data, anything else `{ state: "expired", email: null }`, no cookie `{ state: "none" }`.
  - Login, reset request, reset confirm and invite accept first run `rateLimit("portal-auth:" + (ip ?? "unknown"), { max: 30, windowMs: 900000 })`; refused answers 429 with "Prea multe încercări. Încearcă din nou peste 15 minute.".
  - Any 403 from an auth route of Strapi (gap G4): log `portal-bff: secret refused`, answer 503 `STATES.loadFailed`.

- [ ] **Step 1: Failing e2e** (`tests/e2e/portal-auth.spec.ts`, coach host base):
  - login with the fixture password -> response `set-cookie` holds `es_at` and `es_rt` with `HttpOnly` and `SameSite=Lax`, the JSON body has no `accessToken` or `refreshToken` key; mock log shows `x-portal-secret`, `x-portal-client-ip`, `x-portal-user-agent` on the login call.
  - wrong password and unknown e-mail -> both 401 with the identical body `"E-mailul sau parola nu sunt corecte."`.
  - POST login with header `Origin: https://evil.example` -> 403 and the mock log has no login call.
  - `/invitatie/inv-valid-0000000000000000000000` -> final URL `/invitatie`, no request in the page's network log contains `inv-valid`, and `POST /api/portal/auth/invite/accept` with a valid password sets the session cookies.
  - logout clears `es_at` and `es_rt` (max-age 0) and keeps `es_dev`.
- [ ] **Step 2:** `npm run test:e2e -- tests/e2e/portal-auth.spec.ts`; expected FAIL.
- [ ] **Step 3:** Implement the handlers, the bridge, `invite.ts` and the Sentry hooks.
- [ ] **Step 4:** Run the spec; expected PASS. `npx tsc --noEmit`, `npm run lint`.
- [ ] **Step 5: Commit** `git commit -m "feat(portal): BFF login, reset, invite and logout handlers"`

---

### Task 8: Google start and callback (Sonnet, HIGH, RB2)

**Files:**
- Create: `src/lib/portal/google.ts`, `src/lib/portal/google-config.ts` (`googleEnabled(): Promise<boolean>`, server only: Strapi `auth/google/config`, true when `clientId` is a non-empty string, false on any failure), `scripts/portal/google.test.mjs`, `src/app/(antrenor)/antrenor/api/portal/google/start/route.ts`, `.../google/callback/route.ts`
- Test: `tests/e2e/portal-google.spec.ts`

**Interfaces:**
- Consumes: T5, T6, T7 (invite and flash cookies).
- Produces:
  - `randomToken(bytes: number): string` (base64url), `pkcePair(): { verifier: string; challenge: string }` (32 bytes, S256), `authUrl(i: { clientId: string; redirectUri: string; state: string; nonce: string; challenge: string; loginHint?: string }): string` (`https://accounts.google.com/o/oauth2/v2/auth`, `response_type=code`, `scope=openid email`, `code_challenge_method=S256`, `prompt=select_account`).
  - `type GoogleCookie = { state: string; nonce: string; verifier: string; invite: boolean; exp: number }`; `encodeGoogleCookie(v: GoogleCookie): string` (base64url JSON), `decodeGoogleCookie(raw: string | null, nowMs: number): GoogleCookie | null` (null when malformed or `exp` passed).
  - `GET /api/portal/google/start?invite=1`: Strapi `auth/google/config`; `clientId` null -> 303 `/intrare`; else set `names.google` (600 s) and 303 to `authUrl` with `redirectUri = (secure ? "https" : "http") + "://" + host + "/api/portal/google/callback"`.
  - `GET /api/portal/google/callback?code&state` (or `?error`): decode the cookie, clear it; state missing or different, or `error` present -> flash nothing, 303 to `/intrare` (or `/invitatie` when `invite`); else POST Strapi `auth/google` `{ host: "antrenor", code, codeVerifier, redirectUri, nonce, invite?: <invite cookie>, deviceKey? }` with user agent; success -> session cookies, clear invite cookie, 303 `/`; refusal -> flash cookie with `error.message` (60 s), 303 to `/invitatie` when `invite`, else `/intrare`.

- [ ] **Step 1: Failing tests.** Node: `pkcePair().challenge` equals base64url SHA-256 of the verifier; `authUrl(...)` parsed has each param above and the given `state`, `nonce`; `decodeGoogleCookie(encodeGoogleCookie(v), v.exp - 1)` deep-equals `v`; `decodeGoogleCookie(..., v.exp + 1) === null`; `decodeGoogleCookie("%%%", 0) === null`. e2e (mock config answers a client id; the test calls `/api/portal/google/start`, reads the 303 `Location`, then calls the callback itself with the `state` from that URL and code `ok-andrei`): session cookies set and redirect `/`; a wrong `state` redirects `/intrare` and the mock log has no `auth/google` call; mock `failGoogle` -> `/intrare` and `GET /api/portal/auth/flash` returns "Nu am găsit un cont pentru adresa asta.".
- [ ] **Step 2:** Run `node --test scripts/portal/google.test.mjs` and `npm run test:e2e -- tests/e2e/portal-google.spec.ts`; expected FAIL.
- [ ] **Step 3:** Implement.
- [ ] **Step 4:** Run both; expected PASS.
- [ ] **Step 5: Commit** `git commit -m "feat(portal): Google sign-in through the BFF"`

---

### Task 9: Coach proxy (Sonnet, HIGH, RB2)

**Files:**
- Create: `src/app/(antrenor)/antrenor/api/portal/coach/[...path]/route.ts`, `tests/e2e/portal-proxy.spec.ts`

**Interfaces:**
- Consumes: T5 (`allowedCoachRoute`, `originAllowed`), T6 (`bffContext`, `coachCall`, `respond`, `secretReady`).
- Produces: `GET`, `POST`, `PUT`, `DELETE` handlers. Path = joined segments; query string passed as is for GET. Order: allow-list (404 `refusal(404, "Nu a fost găsit.")`, no Strapi call) -> Origin for non-GET -> `secretReady` -> body size and JSON parse (400 `STATES.invalid`) -> `coachCall`. `GET /me/devices` sends `x-portal-device` from the device cookie. `DELETE /me/devices/:id` answering `data.revokedCurrent === true` adds `clearSessionCookies`. Strapi `set-cookie` headers are never forwarded.

- [ ] **Step 1: Failing e2e** (log in through T7 first):
  - `GET /api/portal/coach/today` -> 200 `{ data: CoachToday }`; mock log shows `authorization` and `x-portal-secret`.
  - "parallel requests after expiry": mock `accessTtlSec: 1`, wait 2 s, fire `today`, `groups` and `me` in parallel -> all 200, mock refresh count 1; then 5 s later a request sent with the OLD `es_rt` cookie value (set it back by hand) -> 200, refresh count still 1.
  - mock `cutAccount` -> `GET today` answers 401 name `SessionEnded`, `es_at` and `es_rt` cleared.
  - a `ClubAdminError` 403 (`PUT /api/portal/coach/groups/<other>/program-public`) -> 403 with the Romanian message, cookies kept.
  - `GET /api/portal/coach/../../club/athletes` and `GET /api/portal/coach/payments` -> 404, no mock call.
  - `PUT /api/portal/coach/me` with `Origin: https://evil.example` -> 403, no mock call.
  - `DELETE /api/portal/coach/me/devices/<current>` -> cookies cleared.
- [ ] **Step 2:** `npm run test:e2e -- tests/e2e/portal-proxy.spec.ts`; expected FAIL.
- [ ] **Step 3:** Implement the route file.
- [ ] **Step 4:** Run the spec and `npm run test:e2e -- tests/e2e/portal-auth.spec.ts tests/e2e/portal-hosts.spec.ts`; expected PASS.
- [ ] **Step 5: Commit** `git commit -m "feat(portal): coach API proxy with refresh and cut handling"`
