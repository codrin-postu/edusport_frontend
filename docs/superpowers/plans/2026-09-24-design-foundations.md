# Design Foundations (SP0 + SP1) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Put a visual safety net in place (SP0), then move the whole site onto the approved design tokens (SP1) without changing the landing hero.

**Architecture:** SP0 adds a Playwright suite (full-page screenshots in Chromium and WebKit at 390/768/1440, a zero-tolerance landing hero check, a rendered-font check and an axe contrast check) plus a token checker that counts forbidden class patterns and only allows the count to go down. SP1 then lands one token group per task: define the tokens in `src/app/globals.css`, migrate usages with a scripted codemod driven by a mapping table, review the screenshot diff with the user, re-baseline, commit.

**Tech Stack:** Next.js 15, React 19, Tailwind CSS v4 (`@theme`, `@utility`), `@playwright/test`, `@axe-core/playwright`, Node 20 scripts (`node --test`), Python `fontTools` (font build only).

**Spec:** `docs/superpowers/specs/2026-09-24-design-foundations-design.md`

## Global Constraints

- Landing hero is frozen: `src/app/landing-v2/blocks/HeroSection.tsx` and `src/app/landing-v2/blocks/HeroWordmarkMorph.tsx` are never edited by a codemod or by hand, except the one non-visual `data-hero-frozen` attribute in Task 1. The hero snapshot test runs with `maxDiffPixels: 0` and its baseline is never updated.
- No opacity on text or borders. Allowed translucent values: `hover` (navy 5%), `hover-on-dark` (cream 10%), `bg-overlay` (navy 55%), and the two shadows (navy 16%).
- Square corners; `rounded-full` only for pills and dots.
- No dashed or dotted lines.
- Type in rem; minimum text size 12px.
- Fonts: Inter 400 and 600; League Spartan 800 and 900; Climate Crisis static at YEAR 1979 (woff2).
- No em dash or en dash in code comments, commit messages or copy. Romanian copy keeps ș and ț (comma below).
- Commit messages: conventional commits, no AI attribution. Never push; the user deploys on request.
- User gate: every task ends with the screenshot diff shown to the user. Do not update snapshots or commit a visual change until the user approves that task's diff.
- ESLint style of this repo: double quotes, semicolons, trailing commas on multiline, `eol-last`.

---

## File Structure

| Path | Responsibility |
|---|---|
| `playwright.config.ts` | Test runner config: projects (chromium, webkit), viewports, local server |
| `tests/visual/routes.ts` | The list of routes to capture, plus slug discovery |
| `tests/visual/stabilize.ts` | Shared page preparation: block analytics, hide cookie banner and announcement, disable animations, wait for fonts |
| `tests/visual/pages.spec.ts` | Full-page screenshots of every route |
| `tests/visual/hero.spec.ts` | Zero-tolerance landing hero screenshots |
| `tests/visual/fonts.spec.ts` | Rendered-font check (CDP) for `.font-display` text |
| `tests/a11y/contrast.spec.ts` | axe `color-contrast` ratchet |
| `tests/a11y/contrast-baseline.json` | Allowed contrast violation count per route (goes to 0) |
| `scripts/tokens/patterns.mjs` | The forbidden class patterns, one place |
| `scripts/tokens/check.mjs` | Token checker CLI (ratchet against baseline) |
| `scripts/tokens/check.test.mjs` | Unit tests for the patterns (`node --test`) |
| `scripts/tokens/baseline.json` | Current allowed counts per pattern (goes to 0) |
| `scripts/codemods/replace-classes.mjs` | Generic class codemod driven by a mapping module |
| `scripts/codemods/replace-classes.test.mjs` | Unit tests for the codemod engine |
| `scripts/codemods/maps/*.mjs` | One mapping module per token group |
| `scripts/fonts/build-climate-crisis.py` | Builds the static 1979 woff2 |
| `scripts/fonts/build-weekend-svg.py` | Turns "weekend!" in Caveat into SVG path data |
| `src/components/ui/weekend-note.tsx` | The SVG "weekend!" note |
| `src/app/globals.css` | All tokens and utilities |
| `src/app/layout.tsx` | Font loading |

Snapshot images are local only (gitignored): `tests/visual/__snapshots__/`. The SP0 set is copied once to `tests/visual/.baseline-sp0/` for the final before/after gallery.

---

### Task 1: SP0 visual safety net

**Files:**
- Create: `playwright.config.ts`, `tests/visual/routes.ts`, `tests/visual/stabilize.ts`, `tests/visual/pages.spec.ts`, `tests/visual/hero.spec.ts`
- Modify: `package.json` (devDependencies, scripts), `.gitignore`
- Modify (non-visual attributes only): `src/app/landing-v2/blocks/HeroSection.tsx:211` (add `data-hero-frozen`), `src/components/blocks/announcement-popup/Announcement.tsx:17-21` (wrap with `data-visual="announcement"`)

**Interfaces:**
- Produces: `npm run test:visual` (compare), `npm run test:visual:update` (re-baseline, never touches the hero), `stabilize(page)` and `blockThirdParty(page)` from `tests/visual/stabilize.ts`, `ROUTES`, `WIDTHS`, `slugName(route)` and `discoverSlugs(page, base)` from `tests/visual/routes.ts`.

- [ ] **Step 1: Create a working branch**

```bash
git switch -c design-foundations
```

- [ ] **Step 2: Install the test tooling and browsers**

```bash
npm install --save-dev @playwright/test@1.63.0 @axe-core/playwright
npx playwright install chromium webkit
```

Expected: both browsers download; `npx playwright --version` prints `Version 1.63.0` (matches the existing `playwright` package).

- [ ] **Step 3: Add scripts and ignore snapshots**

In `package.json` `"scripts"`, add:

```json
"test:visual": "playwright test tests/visual",
"test:visual:update": "playwright test tests/visual/pages.spec.ts --update-snapshots",
"test:fonts": "playwright test tests/visual/fonts.spec.ts --project=chromium",
"test:a11y": "playwright test tests/a11y --project=chromium --workers=1",
"check:tokens": "node scripts/tokens/check.mjs",
"test:scripts": "node --test scripts/"
```

Append to `.gitignore`:

```
# visual test output (local only)
/tests/visual/__snapshots__/
/tests/visual/.baseline-sp0/
/test-results/
/playwright-report/
```

- [ ] **Step 4: Write the Playwright config**

`playwright.config.ts`:

```ts
import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;

export default defineConfig({
  testDir: "tests",
  snapshotPathTemplate: "tests/visual/__snapshots__/{projectName}/{arg}{ext}",
  fullyParallel: false,
  workers: 2,
  timeout: 90_000,
  expect: {
    toHaveScreenshot: { maxDiffPixelRatio: 0.001, animations: "disabled", caret: "hide" },
  },
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    reducedMotion: "reduce",
    colorScheme: "light",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
  webServer: {
    command: `npm run build && npx next start -p ${PORT}`,
    url: `http://localhost:${PORT}/api/health`,
    reuseExistingServer: true,
    timeout: 300_000,
  },
});
```

- [ ] **Step 5: Write the route list**

`tests/visual/routes.ts`:

```ts
import type { Page } from "@playwright/test";

export const WIDTHS = [390, 768, 1440] as const;

export const ROUTES = [
  "/",
  "/despre-noi",
  "/despre-noi/echipa",
  "/despre-noi/sportivi",
  "/despre-noi/realizari",
  "/cursuri",
  "/cursuri/program",
  "/cursuri/regulament",
  "/cursuri/evenimente",
  "/noutati",
  "/contact",
  "/parteneri",
  "/voluntariat",
  "/voluntariat/inscriere",
  "/inscrieri",
  "/protectia-datelor",
  "/pagina-care-nu-exista",
] as const;

/** First detail page under each list, read from the live list at test time. */
export async function discoverSlugs(page: Page, base: string): Promise<string[]> {
  const found: string[] = [];
  for (const [list, prefix] of [
    ["/despre-noi/sportivi", "/despre-noi/sportivi/"],
    ["/noutati", "/noutati/"],
    ["/cursuri/evenimente", "/cursuri/evenimente/"],
  ] as const) {
    await page.goto(new URL(list, base).toString());
    const href = await page
      .locator(`a[href^="${prefix}"]`)
      .evaluateAll((as, p) => as.map((a) => a.getAttribute("href")).find((h) => h && h.length > p.length && !h.includes("/preview/")), prefix);
    if (href) found.push(href);
  }
  return found;
}

export function slugName(route: string): string {
  return route === "/" ? "home" : route.replace(/^\//, "").replace(/\//g, "__");
}
```

- [ ] **Step 6: Write the page stabilizer**

`tests/visual/stabilize.ts`:

```ts
import type { Page } from "@playwright/test";

const BLOCK = /analytics\.codrin\.space|glitchtip\.codrin\.space|youtube\.com|ytimg\.com/;

export async function blockThirdParty(page: Page): Promise<void> {
  await page.route(BLOCK, (route) => route.abort());
}

/** Makes a page deterministic before a screenshot. */
export async function stabilize(page: Page): Promise<void> {
  await page.addStyleTag({
    content: `
      #cc-main, [data-visual="announcement"] { display: none !important; }
      *, *::before, *::after { animation: none !important; transition: none !important; caret-color: transparent !important; }
      video { visibility: hidden !important; }
    `,
  });
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 700) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 80));
    }
    window.scrollTo(0, 0);
    await document.fonts.ready;
  });
  await page.waitForLoadState("networkidle", { timeout: 10_000 }).catch(() => {});
  await page.waitForTimeout(300);
}
```

- [ ] **Step 7: Write the full-page suite**

`tests/visual/pages.spec.ts`:

```ts
import { test, expect } from "@playwright/test";
import { ROUTES, WIDTHS, discoverSlugs, slugName } from "./routes";
import { blockThirdParty, stabilize } from "./stabilize";

let slugs: string[] = [];

test.beforeAll(async ({ browser }, testInfo) => {
  const page = await browser.newPage();
  await blockThirdParty(page);
  slugs = await discoverSlugs(page, String(testInfo.project.use.baseURL));
  await page.close();
});

for (const width of WIDTHS) {
  test.describe(`${width}px`, () => {
    test.use({ viewport: { width, height: 900 } });

    for (const route of ROUTES) {
      test(`${route}`, async ({ page }) => {
        await blockThirdParty(page);
        await page.goto(route);
        await stabilize(page);
        await expect(page).toHaveScreenshot(`${slugName(route)}-${width}.png`, { fullPage: true });
      });
    }

    test("detail pages", async ({ page }) => {
      await blockThirdParty(page);
      for (const route of slugs) {
        await page.goto(route);
        await stabilize(page);
        await expect(page).toHaveScreenshot(`${slugName(route.split("/").slice(0, -1).join("/"))}__detail-${width}.png`, { fullPage: true });
      }
    });
  });
}
```

- [ ] **Step 8: Mark the frozen hero and the announcement (no visual change)**

In `src/app/landing-v2/blocks/HeroSection.tsx` line 211, change only the opening tag:

```tsx
    <section data-hero-frozen className="relative h-[max(100svh,600px)] max-h-[1200px] -mt-20">
```

In `src/components/blocks/announcement-popup/Announcement.tsx`, replace the function body:

```tsx
export function Announcement({ announcement }: AnnouncementProps) {
  return (
    <div data-visual="announcement">
      {announcement.format === "modal" ? (
        <AnnouncementModal announcement={announcement} />
      ) : (
        <AnnouncementCard announcement={announcement} />
      )}
    </div>
  );
}
```

Both children are `position: fixed`, so the wrapper adds no layout.

- [ ] **Step 9: Write the frozen hero suite**

`tests/visual/hero.spec.ts`:

```ts
import { test, expect } from "@playwright/test";
import { WIDTHS } from "./routes";
import { blockThirdParty, stabilize } from "./stabilize";

// The hero baseline is captured once in SP0 and never updated.
for (const width of WIDTHS) {
  test(`landing hero is unchanged at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await blockThirdParty(page);
    await page.goto("/");
    await stabilize(page);
    // The header sits over the hero but is not part of the freeze.
    await page.addStyleTag({ content: "[data-site-header] { visibility: hidden !important; }" });
    await expect(page.locator("[data-hero-frozen]")).toHaveScreenshot(`hero-frozen-${width}.png`, { maxDiffPixels: 0 });
  });
}
```

- [ ] **Step 10: Capture the baseline twice and check it is stable**

Prerequisite: local Strapi answers `curl -s -o /dev/null -w "%{http_code}" http://localhost:1337/_health` with `204`.

```bash
npx playwright test tests/visual --update-snapshots
npx playwright test tests/visual
```

Expected: the first run writes the snapshots; the second run passes with 0 failures. If a route flickers (fails on the second run with nothing changed), add the moving element to the `stabilize` hide list or mask it, then repeat this step. Do not continue until two consecutive runs pass.

- [ ] **Step 11: Keep a copy of the SP0 baseline**

```bash
mkdir -p tests/visual/.baseline-sp0 && cp -R tests/visual/__snapshots__/* tests/visual/.baseline-sp0/
```

- [ ] **Step 12: Commit**

```bash
git add playwright.config.ts tests/visual package.json package-lock.json .gitignore src/app/landing-v2/blocks/HeroSection.tsx src/components/blocks/announcement-popup/Announcement.tsx
git commit -m "test(visual): add full-page and frozen-hero screenshot baseline"
```

---

### Task 2: Rendered-font and contrast checks

**Files:**
- Create: `tests/visual/fonts.spec.ts`, `tests/a11y/contrast.spec.ts`, `tests/a11y/contrast-baseline.json`

**Interfaces:**
- Consumes: `ROUTES`, `blockThirdParty`, `stabilize` (Task 1).
- Produces: `npm run test:fonts` (fails today, passes after Task 5); `npm run test:a11y` (ratchet: fails only if a route gets worse than its baseline).

- [ ] **Step 1: Write the rendered-font test**

`tests/visual/fonts.spec.ts`:

```ts
import { test, expect } from "@playwright/test";
import { ROUTES } from "./routes";
import { blockThirdParty } from "./stabilize";

test.skip(({ browserName }) => browserName !== "chromium", "CDP is Chromium only");

// Every text node inside a .font-display element must be drawn with League Spartan.
for (const route of ROUTES) {
  test(`display text renders in League Spartan on ${route}`, async ({ page }) => {
    await blockThirdParty(page);
    await page.goto(route);
    await page.evaluate(() => document.fonts.ready);
    const cdp = await page.context().newCDPSession(page);
    await cdp.send("DOM.enable");
    await cdp.send("CSS.enable");
    const { root } = await cdp.send("DOM.getDocument", { depth: -1, pierce: false });
    const { nodeIds } = await cdp.send("DOM.querySelectorAll", { nodeId: root.nodeId, selector: ".font-display, .font-display *" });
    const offenders: string[] = [];
    for (const nodeId of nodeIds) {
      const { fonts } = await cdp.send("CSS.getPlatformFontsForNode", { nodeId });
      if (fonts.length && !fonts.some((f) => /Spartan/i.test(f.familyName) || /LeagueSpartan/i.test(f.postScriptName))) {
        const { outerHTML } = await cdp.send("DOM.getOuterHTML", { nodeId });
        offenders.push(`${fonts.map((f) => f.postScriptName).join(",")} :: ${outerHTML.slice(0, 80)}`);
      }
    }
    expect(offenders, offenders.join("\n")).toEqual([]);
  });
}
```

- [ ] **Step 2: Run it and confirm it fails where the audit found the leak**

Run: `npm run test:fonts`
Expected: FAIL on `/` (AboutUsSection heading), `/despre-noi/sportivi` (spotlight name) and `/despre-noi/realizari` (season headers), with `Inter` postscript names in the message. All other routes PASS.

- [ ] **Step 3: Write the contrast ratchet**

`tests/a11y/contrast.spec.ts`:

```ts
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFileSync, writeFileSync } from "node:fs";
import { ROUTES } from "../visual/routes";
import { blockThirdParty, stabilize } from "../visual/stabilize";

const FILE = "tests/a11y/contrast-baseline.json";
const baseline: Record<string, number> = JSON.parse(readFileSync(FILE, "utf8"));
const record = process.env.RECORD_CONTRAST === "1";

for (const route of ROUTES) {
  test(`contrast on ${route}`, async ({ page }) => {
    await blockThirdParty(page);
    await page.goto(route);
    await stabilize(page);
    const result = await new AxeBuilder({ page }).withRules(["color-contrast"]).analyze();
    const count = result.violations.reduce((n, v) => n + v.nodes.length, 0);
    if (record) {
      baseline[route] = count;
      writeFileSync(FILE, JSON.stringify(baseline, null, 2) + "\n");
      return;
    }
    expect(count, `contrast failures on ${route}`).toBeLessThanOrEqual(baseline[route] ?? 0);
  });
}
```

`tests/a11y/contrast-baseline.json`:

```json
{}
```

- [ ] **Step 4: Record today's counts, then confirm the ratchet passes**

```bash
RECORD_CONTRAST=1 npm run test:a11y
npm run test:a11y
```

Expected: the first run fills `contrast-baseline.json` with a number per route (non-zero on routes with navy /40 to /55 text); the second run passes.

- [ ] **Step 5: Commit**

```bash
git add tests/visual/fonts.spec.ts tests/a11y package.json
git commit -m "test: add rendered-font check and contrast ratchet"
```

The font test is expected to fail until Task 5; commit it anyway (it documents the bug).

---

### Task 3: Token checker and codemod engine

**Files:**
- Create: `scripts/tokens/patterns.mjs`, `scripts/tokens/check.mjs`, `scripts/tokens/check.test.mjs`, `scripts/tokens/baseline.json`, `scripts/codemods/replace-classes.mjs`, `scripts/codemods/replace-classes.test.mjs`
- Modify: `.github/workflows/deploy.yml:51` (lint job)

**Interfaces:**
- Produces:
  - `PATTERNS: { id: string; regex: RegExp; why: string }[]` and `FROZEN: string[]` from `scripts/tokens/patterns.mjs`
  - `countMatches(source: string): Record<string, number>` from `scripts/tokens/check.mjs`
  - `applyMap(source: string, map: { rules: Rule[] }): { output: string; changes: number; flagged: string[] }` from `scripts/codemods/replace-classes.mjs`, where `Rule = { match: RegExp; replace: string | ((m: RegExpExecArray) => string | null) }` and a replace returning `null` flags the match for manual review instead of changing it
  - CLI: `node scripts/codemods/replace-classes.mjs <map-module> [--write]` (dry run by default; prints file:line for every change and every flag)

- [ ] **Step 1: Write the failing pattern tests**

`scripts/tokens/check.test.mjs`:

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { countMatches } from "./check.mjs";

test("counts text opacity classes", () => {
  const c = countMatches('<p className="text-navy/50 hover:text-retro-cream/70">');
  assert.equal(c["text-opacity"], 2);
});

test("counts default palette colors", () => {
  const c = countMatches('<div className="bg-gray-200 text-red-500">');
  assert.equal(c["default-palette"], 2);
});

test("ignores role tokens", () => {
  const c = countMatches('<p className="text-secondary bg-surface-subtle border-line">');
  assert.equal(Object.values(c).reduce((a, b) => a + b, 0), 0);
});

test("counts arbitrary px and off-scale spacing", () => {
  const c = countMatches('<div className="mt-[3px] p-2.5 gap-5 px-4">');
  assert.equal(c["arbitrary-px"], 1);
  assert.equal(c["off-scale-spacing"], 2);
});

test("counts rounded but not rounded-none or rounded-full", () => {
  const c = countMatches('<div className="rounded-md rounded rounded-full rounded-none">');
  assert.equal(c["radius"], 2);
});

test("counts numeric z-index", () => {
  const c = countMatches('<div className="z-[100] z-10 z-header">');
  assert.equal(c["z-index"], 2);
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `node --test scripts/tokens/`
Expected: FAIL with `Cannot find module` for `./check.mjs`.

- [ ] **Step 3: Write the patterns and the checker**

`scripts/tokens/patterns.mjs`:

```js
// Forbidden class patterns. Each one maps to a rule in the SP1 spec.
const V = "(?:^|[\\s\"'`:])"; // start of a class token, after any variant prefix

export const PATTERNS = [
  { id: "text-opacity", why: "text and borders never use opacity", regex: new RegExp(`${V}(?:text|border(?:-[trblxy])?|divide|ring|placeholder:text)-(?:navy|retro-cream|cream|white|black|mustard|rust|gold)\\/(?:\\d+|\\[[\\d.]+\\])`, "g") },
  { id: "bg-opacity", why: "use surface tokens, hover layers or bg-overlay", regex: new RegExp(`${V}bg-(?:navy|retro-cream|white|black)\\/(?:\\d+|\\[[\\d.]+\\])`, "g") },
  { id: "default-palette", why: "only theme tokens", regex: new RegExp(`${V}(?:text|bg|border|ring|divide|from|to|via|fill|stroke)-(?:gray|slate|zinc|neutral|stone|red|green|blue|amber|yellow|orange|emerald|rose|sky|indigo|teal|lime|purple|pink)-\\d{2,3}\\b`, "g") },
  { id: "arbitrary-px", why: "sizes and spacing come from the scale", regex: new RegExp(`${V}(?:text|p[trblxy]?|m[trblxy]?|gap(?:-[xy])?|space-[xy]|top|bottom|left|right|inset(?:-[xy])?)-\\[-?\\d+(?:\\.\\d+)?px\\]`, "g") },
  { id: "off-scale-spacing", why: "4px grid: 1,2,3,4,6,8,12,16,24", regex: new RegExp(`${V}-?(?:p[trblxy]?|m[trblxy]?|gap(?:-[xy])?|space-[xy])-(?:1\\.5|2\\.5|3\\.5|5|7|9|10|11|14|20|28|32|40|56)\\b`, "g") },
  { id: "arbitrary-shadow", why: "shadow-retro-sm or shadow-retro", regex: new RegExp(`${V}shadow-\\[`, "g") },
  { id: "radius", why: "square corners", regex: new RegExp(`${V}rounded(?:-[trbl]{1,2})?(?:-(?:sm|md|lg|xl|2xl|3xl|\\[[^\\]]+\\]))?(?=[\\s"'\`]|$)`, "g") },
  { id: "z-index", why: "use z-base ... z-popup", regex: new RegExp(`${V}-?z-(?:\\[\\d+\\]|\\d+)\\b`, "g") },
  { id: "arbitrary-type", why: "type roles set tracking and leading", regex: new RegExp(`${V}(?:tracking|leading)-\\[`, "g") },
  { id: "raw-duration", why: "duration-fast, -base, -slow, -long", regex: new RegExp(`${V}duration-\\d+\\b`, "g") },
];

// Frozen or third-party files the checker and codemods never touch.
export const FROZEN = [
  "src/app/landing-v2/blocks/HeroSection.tsx",
  "src/app/landing-v2/blocks/HeroWordmarkMorph.tsx",
  "src/components/blocks/fullcalendar/fullcalendar-overrides.css",
];
```

`scripts/tokens/check.mjs`:

```js
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { PATTERNS, FROZEN } from "./patterns.mjs";

export function countMatches(source) {
  const out = {};
  for (const p of PATTERNS) {
    const n = (source.match(p.regex) || []).length;
    if (n) out[p.id] = n;
  }
  return out;
}

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) yield* walk(full);
    else if (/\.(tsx?|css)$/.test(name)) yield full;
  }
}

export function scan(root = "src") {
  const totals = {};
  const perFile = {};
  for (const file of walk(root)) {
    const rel = relative(process.cwd(), file);
    if (FROZEN.includes(rel)) continue;
    const c = countMatches(readFileSync(file, "utf8"));
    for (const [k, v] of Object.entries(c)) {
      totals[k] = (totals[k] || 0) + v;
      (perFile[k] ||= []).push(`${rel} (${v})`);
    }
  }
  return { totals, perFile };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const BASE = "scripts/tokens/baseline.json";
  const { totals, perFile } = scan();
  if (process.argv.includes("--write-baseline")) {
    writeFileSync(BASE, JSON.stringify(totals, null, 2) + "\n");
    console.log("baseline written", totals);
    process.exit(0);
  }
  const baseline = JSON.parse(readFileSync(BASE, "utf8"));
  let failed = false;
  for (const p of PATTERNS) {
    const now = totals[p.id] || 0;
    const allowed = baseline[p.id] || 0;
    const mark = now > allowed ? "FAIL" : "ok";
    if (now > allowed) failed = true;
    console.log(`${mark.padEnd(4)} ${p.id.padEnd(18)} ${String(now).padStart(4)} (allowed ${allowed})  ${p.why}`);
    if (now > allowed && process.argv.includes("--verbose")) console.log("     " + perFile[p.id].join("\n     "));
  }
  process.exit(failed ? 1 : 0);
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `node --test scripts/tokens/`
Expected: 6 tests PASS.

- [ ] **Step 5: Write the failing codemod tests**

`scripts/codemods/replace-classes.test.mjs`:

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { applyMap } from "./replace-classes.mjs";

const map = {
  rules: [
    { match: /(^|[\s"'`:])text-navy\/(50|60)(?=[\s"'`]|$)/g, replace: "$1text-secondary" },
    { match: /(^|[\s"'`:])text-navy\/(15|20)(?=[\s"'`]|$)/g, replace: () => null },
  ],
};

test("replaces a class and keeps its variant prefix", () => {
  const r = applyMap('<p className="hover:text-navy/50 text-sm">', map);
  assert.equal(r.output, '<p className="hover:text-secondary text-sm">');
  assert.equal(r.changes, 1);
});

test("flags instead of changing when replace returns null", () => {
  const r = applyMap('<p className="text-navy/15">', map);
  assert.equal(r.output, '<p className="text-navy/15">');
  assert.equal(r.flagged.length, 1);
});

test("does not touch similar longer tokens", () => {
  const r = applyMap('<p className="text-navy/500">', map);
  assert.equal(r.changes, 0);
});
```

- [ ] **Step 6: Run to verify it fails**

Run: `node --test scripts/codemods/`
Expected: FAIL with `Cannot find module`.

- [ ] **Step 7: Write the codemod engine**

`scripts/codemods/replace-classes.mjs`:

```js
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { FROZEN } from "../tokens/patterns.mjs";

export function applyMap(source, map) {
  let output = source;
  let changes = 0;
  const flagged = [];
  for (const rule of map.rules) {
    output = output.replace(rule.match, (...args) => {
      const whole = args[0];
      const groups = args.slice(1, -2);
      if (typeof rule.replace === "function") {
        const res = rule.replace(groups, whole);
        if (res === null) {
          flagged.push(whole.trim());
          return whole;
        }
        if (res !== whole) changes++;
        return res;
      }
      changes++;
      return rule.replace.replace(/\$(\d)/g, (_, i) => groups[Number(i) - 1] ?? "");
    });
  }
  return { output, changes, flagged };
}

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) yield* walk(full);
    else if (/\.(tsx?|css)$/.test(name)) yield full;
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [, , mapPath, ...flags] = process.argv;
  const map = (await import(pathToFileURL(resolve(mapPath)).href)).default;
  const write = flags.includes("--write");
  let total = 0;
  for (const file of walk("src")) {
    const rel = relative(process.cwd(), file);
    if (FROZEN.includes(rel) || (map.skip || []).some((s) => rel.startsWith(s))) continue;
    const src = readFileSync(file, "utf8");
    const { output, changes, flagged } = applyMap(src, map);
    if (changes) console.log(`${rel}: ${changes} change(s)`);
    for (const f of flagged) console.log(`${rel}: REVIEW ${f}`);
    total += changes;
    if (write && output !== src) writeFileSync(file, output);
  }
  console.log(`${write ? "applied" : "dry run"}: ${total} change(s)`);
}
```

Maps use the capture convention `(^|[\s"'\`:])CLASS(?=[\s"'\`]|$)` so a class is matched as a whole token after any variant prefix (`hover:`, `md:`, `placeholder:`), and `$1` in the replacement keeps the separator.

- [ ] **Step 8: Run all script tests**

Run: `npm run test:scripts`
Expected: 9 tests PASS.

- [ ] **Step 9: Record the token baseline and wire it into CI**

```bash
node scripts/tokens/check.mjs --write-baseline
npm run check:tokens
```

Expected: the second command prints `ok` for every pattern.

In `.github/workflows/deploy.yml`, in the `lint` job after `- run: npm run lint` (line 51), add:

```yaml
      - run: npm run test:scripts
      - run: npm run check:tokens
```

- [ ] **Step 10: Commit**

```bash
git add scripts/tokens scripts/codemods/replace-classes.mjs scripts/codemods/replace-classes.test.mjs .github/workflows/deploy.yml package.json
git commit -m "build: add token checker ratchet and class codemod engine"
```

---

### Task 4: Free the role names from shadcn

The shadcn tokens `--color-primary`, `--color-secondary`, `--color-muted`, `--color-accent` (and their `-foreground`) already generate `text-primary`, `text-muted`, `text-accent`. They are used only in `src/components/ui/{card,calendar,badge,button,navigation-menu,dropdown-menu,table}.tsx` (about 100 uses). Rename them to `ui-*` with zero visual change.

**Files:**
- Create: `scripts/codemods/maps/shadcn-ui-prefix.mjs`
- Modify: `src/app/globals.css:128-200` (`@theme inline` block), the 7 files above (via codemod)

**Interfaces:**
- Produces: `--color-ui-primary`, `--color-ui-primary-foreground`, `--color-ui-secondary`, `--color-ui-secondary-foreground`, `--color-ui-muted`, `--color-ui-muted-foreground`, `--color-ui-accent`, `--color-ui-accent-foreground`. The names `primary`, `secondary`, `muted`, `accent` are free for Task 6.

- [ ] **Step 1: Write the map**

`scripts/codemods/maps/shadcn-ui-prefix.mjs`:

```js
const T = "(^|[\\s\"'`:])";
const E = "(?=[\\s\"'`]|$)";
const util = "(text|bg|border|ring|fill|stroke|from|to|via|outline|decoration|placeholder|shadow)";
const name = "(primary|secondary|muted|accent)(-foreground)?";

export default {
  rules: [
    { match: new RegExp(`${T}${util}-${name}(\\/\\d+)?${E}`, "g"), replace: "$1$2-ui-$3$4$5" },
  ],
};
```

- [ ] **Step 2: Dry run and check the scope**

Run: `node scripts/codemods/replace-classes.mjs scripts/codemods/maps/shadcn-ui-prefix.mjs`
Expected: changes only in the 7 `src/components/ui/` files; about 100 changes; no REVIEW lines.

- [ ] **Step 3: Rename the tokens in globals.css**

In the `@theme inline` block, rename exactly these eight lines (keep their `var(--...)` values):

```css
  --color-ui-primary: var(--primary);
  --color-ui-primary-foreground: var(--primary-foreground);
  --color-ui-secondary: var(--secondary);
  --color-ui-secondary-foreground: var(--secondary-foreground);
  --color-ui-muted: var(--muted);
  --color-ui-muted-foreground: var(--muted-foreground);
  --color-ui-accent: var(--accent);
  --color-ui-accent-foreground: var(--accent-foreground);
```

- [ ] **Step 4: Apply the codemod and build**

```bash
node scripts/codemods/replace-classes.mjs scripts/codemods/maps/shadcn-ui-prefix.mjs --write
npx tsc --noEmit && npm run lint
```

Expected: both pass.

- [ ] **Step 5: Verify zero visual change**

Run: `npm run test:visual`
Expected: PASS everywhere (no diffs). A diff here means a rename was missed; fix it before continuing.

- [ ] **Step 6: Commit**

```bash
git add scripts/codemods/maps/shadcn-ui-prefix.mjs src/app/globals.css src/components/ui
git commit -m "refactor(ui): prefix shadcn color tokens with ui to free role names"
```

---

### Task 5: Fonts and the font leak

**Files:**
- Create: `scripts/fonts/build-climate-crisis.py`, `scripts/fonts/build-weekend-svg.py`, `src/components/ui/weekend-note.tsx`, `public/fonts/ClimateCrisis-1979.woff2`
- Modify: `src/app/layout.tsx:18-55,121`, `src/app/globals.css:21-29,31-33,377`, `src/app/cursuri/blocks/ScheduleSection.tsx:114-124`, `src/app/landing-v2/blocks/CompetitionStrip.tsx:218-221,287-289`, `src/app/despre-noi/sportivi/[slug]/_View.tsx:179,239-243,298-301`
- Delete: `public/fonts/ClimateCrisis-Regular-VariableFont_YEAR.ttf`

**Interfaces:**
- Consumes: `npm run test:fonts` (Task 2) as the failing test.
- Produces: `WeekendNote` component (`src/components/ui/weekend-note.tsx`, props `className?: string`, `style?: CSSProperties`, renders an inline SVG, `aria-hidden`). CSS vars unchanged: `--font-inter`, `--font-league-spartan`, `--font-climate-crisis`, `--font-display`.

- [ ] **Step 1: Confirm the failing font test**

Run: `npm run test:fonts`
Expected: FAIL on `/`, `/despre-noi/sportivi`, `/despre-noi/realizari` (from Task 2).

- [ ] **Step 2: Fix the leak, keeping the hero on the old rule**

In `src/app/globals.css`, replace lines 21-29:

```css
body {
  font-family: var(--font-inter), system-ui, sans-serif;
}

/* The frozen landing hero keeps the old element-level rule so it renders
   exactly as before. Everywhere else, text inherits from its parent, so
   .font-display reaches its spans. */
[data-hero-frozen] :is(h4, h5, h6, p, span, div) {
  font-family: var(--font-inter), system-ui, sans-serif;
}
```

Also replace line 377 (`font-family: "League Spartan", sans-serif;`) with `font-family: var(--font-display);`.

- [ ] **Step 3: Run the font test**

Run: `npm run test:fonts`
Expected: PASS on every route.

- [ ] **Step 4: Build the static Climate Crisis**

`scripts/fonts/build-climate-crisis.py`:

```python
"""Freeze Climate Crisis at YEAR 1979 (the only value the site uses) as woff2."""
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

SRC = "public/fonts/ClimateCrisis-Regular-VariableFont_YEAR.ttf"
OUT = "public/fonts/ClimateCrisis-1979.woff2"

font = TTFont(SRC)
static = instancer.instantiateVariableFont(font, {"YEAR": 1979})
static.flavor = "woff2"
static.save(OUT)
print("wrote", OUT)
```

```bash
python3 scripts/fonts/build-climate-crisis.py
ls -l public/fonts/ClimateCrisis-1979.woff2
```

Expected: about 24 KB.

- [ ] **Step 5: Point layout.tsx at the new files and weights**

In `src/app/layout.tsx`:
- Remove the `Lora` and `Caveat` imports, their `const lora = ...` and `const caveat = ...` blocks, and `${caveat.variable}` / `${lora.variable}` from the `className` on line 121.
- Set `weight: ["400", "600"]` on `Inter(...)`.
- Set `weight: ["800", "900"]` on `League_Spartan(...)`.
- Change the `localFont` source:

```ts
const climateCrisis = localFont({
  src: "../../public/fonts/ClimateCrisis-1979.woff2",
  variable: "--font-climate-crisis",
  display: "swap",
});
```

Delete `.font-handwriting` in `src/app/globals.css` (lines 31-33); nothing uses it (`grep -rn font-handwriting src` returns nothing).

- [ ] **Step 6: Build the weekend SVG**

`scripts/fonts/build-weekend-svg.py`:

```python
"""Render 'weekend!' in Caveat 400 as SVG path data for src/components/ui/weekend-note.tsx."""
import urllib.request
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

URL = "https://github.com/google/fonts/raw/main/ofl/caveat/Caveat%5Bwght%5D.ttf"
urllib.request.urlretrieve(URL, "/tmp/Caveat.ttf")
font = instancer.instantiateVariableFont(TTFont("/tmp/Caveat.ttf"), {"wght": 400})
glyphs, cmap, hmtx = font.getGlyphSet(), font.getBestCmap(), font["hmtx"]
upm = font["head"].unitsPerEm
x, parts = 0, []
for ch in "weekend!":
    name = cmap[ord(ch)]
    pen = SVGPathPen(glyphs)
    glyphs[name].draw(TransformPen(pen, (1, 0, 0, -1, x, upm * 0.8)))
    parts.append(pen.getCommands())
    x += hmtx[name][0]
print(f'viewBox="0 0 {x} {upm}"')
print("d=" + " ".join(parts))
```

```bash
python3 scripts/fonts/build-weekend-svg.py > /tmp/weekend.txt
```

`src/components/ui/weekend-note.tsx` (paste the printed `viewBox` and `d` values):

```tsx
/* "weekend!" in Caveat 400, drawn as SVG so the Caveat font no longer loads.
   Generated by scripts/fonts/build-weekend-svg.py. */
import type { CSSProperties } from "react";

export function WeekendNote({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg aria-hidden viewBox="PASTE_VIEWBOX" className={className} style={style} fill="currentColor">
      <path d="PASTE_D" />
    </svg>
  );
}
```

The two `PASTE_` values are produced by the script in this step; replace them before saving.

- [ ] **Step 7: Use it in ScheduleSection**

In `src/app/cursuri/blocks/ScheduleSection.tsx:114-124`, replace the `<span aria-hidden ... fontFamily: "var(--font-caveat)" ...>weekend!</span>` element with:

```tsx
<WeekendNote
  className="absolute pointer-events-none select-none w-auto"
  style={{ right: 26, bottom: 12, height: 30, transform: "rotate(-7deg)", color: "#dc7f7d" }}
/>
```

`#dc7f7d` is rust at the old 0.6 opacity over the cream note, baked into a solid color (Global Constraints: no text opacity). The position stays an inline style exactly as before, so the token ratchet does not change. Import `WeekendNote` from `@/components/ui/weekend-note`, and give the component a `style?: React.CSSProperties` prop passed to the `<svg>`.

- [ ] **Step 8: Remove Lora**

- `src/app/landing-v2/blocks/CompetitionStrip.tsx` lines 218 and 288: replace `font-family: var(--font-lora), ...;` with `font-family: var(--font-inter), system-ui, sans-serif; font-weight: 400;`.
- `src/app/despre-noi/sportivi/[slug]/_View.tsx:239-243`: remove the `style={{ fontFamily: ... }}` prop and set `className="mt-6 max-w-[620px] text-base font-semibold text-navy"` (becomes `text-body` in Task 8).
- `src/app/despre-noi/sportivi/[slug]/_View.tsx:298-301`: remove the `style` prop and set `className="border-l-[3px] border-rust pl-3 text-base leading-relaxed text-navy/70"` (colors fixed in Task 6).

- [ ] **Step 9: Athlete name spacing**

In `src/app/despre-noi/sportivi/[slug]/_View.tsx:179` change `tracking-[-0.055em]` to `tracking-[-0.035em]` (Task 8 turns it into the named exception).

- [ ] **Step 10: Delete the old font file**

```bash
git rm public/fonts/ClimateCrisis-Regular-VariableFont_YEAR.ttf
```

- [ ] **Step 11: Verify**

```bash
npx tsc --noEmit && npm run lint && npm run test:fonts && npm run test:visual
```

Expected: typecheck, lint and font test PASS. `tests/visual/hero.spec.ts` PASS with 0 pixels changed. `pages.spec.ts` shows diffs ONLY at: landing AboutUsSection heading, landing CompetitionStrip heading, Sportivi spotlight name, athlete page name and fallbacks, Realizări season headers, `/cursuri/program` weekend note, footer column headings, and any Inter 300/500/700/800 text now rendered at 400/600. Anything else: investigate before continuing.

- [ ] **Step 12: User gate**

Open `playwright-report/index.html`, show the user the diffs from Step 11, wait for approval.

- [ ] **Step 13: Re-baseline and commit**

```bash
npm run test:visual:update
git add scripts/fonts src/components/ui/weekend-note.tsx public/fonts src/app/layout.tsx src/app/globals.css src/app/cursuri/blocks/ScheduleSection.tsx src/app/landing-v2/blocks/CompetitionStrip.tsx "src/app/despre-noi/sportivi/[slug]/_View.tsx"
git commit -m "fix(fonts): render display text in League Spartan and trim the font set

Inter moves to the body so .font-display reaches its spans. Lora and
Caveat are removed (the weekend note becomes an SVG), weights drop to
Inter 400/600 and League Spartan 800/900, and Climate Crisis ships as a
static woff2 frozen at YEAR 1979."
```

---

### Task 6: Color, surface, line and hover tokens

**Files:**
- Create: `scripts/codemods/maps/colors.mjs`
- Modify: `src/app/globals.css` (`@theme` block lines 47-126, new `@utility` rules, `html` block lines 5-17), all of `src/` via codemod, `src/components/blocks/cookie-consent/cookie-consent.css` (hex literals)

**Interfaces:**
- Produces: color classes `text-primary`, `text-secondary`, `text-muted`, `text-accent`, `text-primary-on-dark`, `text-secondary-on-dark`, `text-muted-on-dark`, `text-accent-on-dark`; `bg-surface`, `bg-surface-raised`, `bg-surface-subtle`, `bg-surface-dark`, `bg-surface-subtle-on-dark`, `bg-overlay`; `border-line`, `border-line-subtle`, `border-line-on-dark`, `border-line-subtle-on-dark` (also usable as `divide-*`); utilities `hover-layer`, `hover-layer-on-dark`.

- [ ] **Step 1: Add the tokens**

Append inside the `@theme` block in `src/app/globals.css` (before `--shadow-retro`):

```css
  /* Roles (SP1). Pages use these, never raw palette + opacity. */
  --color-primary: #0e1a3c;
  --color-secondary: #495269;
  --color-muted: #5f657a;
  --color-accent: #be3330;
  --color-primary-on-dark: #fbf8f1;
  --color-secondary-on-dark: #c0c0c4;
  --color-muted-on-dark: #979ba5;
  --color-accent-on-dark: #efb22b;

  --color-surface: #fbf8f1;
  --color-surface-raised: #ffffff;
  --color-surface-subtle: #ece8e0;
  --color-surface-dark: #0e1a3c;
  --color-surface-subtle-on-dark: #26304e;
  --color-overlay: rgb(14 26 60 / 0.55);

  --color-line: #0e1a3c;
  --color-line-subtle: #dfdddb;
  --color-line-on-dark: #fbf8f1;
  --color-line-subtle-on-dark: #3d4660;
```

Add after the last `@layer utilities` block:

```css
/* Hover is a translucent layer drawn over whatever the element already is. */
@utility hover-layer {
  &:hover {
    box-shadow: inset 0 0 0 100vmax rgb(14 26 60 / 0.05);
  }
}
@utility hover-layer-on-dark {
  &:hover {
    box-shadow: inset 0 0 0 100vmax rgb(251 248 241 / 0.1);
  }
}
```

In the `html` block, change `scrollbar-color: var(--color-edusport-blue) transparent;` to `scrollbar-color: var(--color-line) transparent;`.

- [ ] **Step 2: Write the color map**

`scripts/codemods/maps/colors.mjs`:

```js
const T = "(^|[\\s\"'`:])";
const E = "(?=[\\s\"'`]|$)";
const A = "(\\d+|\\[0?\\.\\d+\\])"; // opacity: 50 or [0.72]
const pct = (a) => (a.startsWith("[") ? Math.round(parseFloat(a.slice(1, -1)) * 100) : Number(a));

const LIGHT_INK = "navy|ink";
const DARK_INK = "retro-cream|white|cream";

export default {
  rules: [
    // text on light: /80 and up primary, /40 to /79 secondary, below 40 flagged (decorative)
    { match: new RegExp(`${T}text-(${LIGHT_INK})${E}`, "g"), replace: "$1text-primary" },
    { match: new RegExp(`${T}text-(?:${LIGHT_INK})\\/${A}${E}`, "g"), replace: ([s, a]) => { const p = pct(a); return p >= 80 ? `${s}text-primary` : p >= 40 ? `${s}text-secondary` : null; } },
    { match: new RegExp(`${T}placeholder:text-(?:${LIGHT_INK})\\/${A}${E}`, "g"), replace: ([s]) => `${s}placeholder:text-muted` },
    { match: new RegExp(`${T}text-gray-(900|800)${E}`, "g"), replace: "$1text-primary" },
    { match: new RegExp(`${T}text-gray-(700|600|500)${E}`, "g"), replace: "$1text-secondary" },
    { match: new RegExp(`${T}text-gray-(400|300)${E}`, "g"), replace: () => null },
    { match: new RegExp(`${T}text-rust${E}`, "g"), replace: "$1text-accent" },

    // text on dark
    { match: new RegExp(`${T}text-(${DARK_INK})${E}`, "g"), replace: "$1text-primary-on-dark" },
    { match: new RegExp(`${T}text-(?:${DARK_INK})\\/${A}${E}`, "g"), replace: ([s, a]) => { const p = pct(a); return p >= 80 ? `${s}text-primary-on-dark` : p >= 45 ? `${s}text-secondary-on-dark` : null; } },
    { match: new RegExp(`${T}placeholder:text-(?:${DARK_INK})\\/${A}${E}`, "g"), replace: ([s]) => `${s}placeholder:text-muted-on-dark` },

    // hover tints become the hover layer
    { match: new RegExp(`${T}hover:bg-navy\\/${A}${E}`, "g"), replace: ([s, a]) => (pct(a) <= 10 ? `${s}hover-layer` : null) },
    { match: new RegExp(`${T}hover:bg-(?:white|retro-cream)\\/${A}${E}`, "g"), replace: ([s, a]) => (pct(a) <= 20 ? `${s}hover-layer-on-dark` : null) },

    // backgrounds
    { match: new RegExp(`${T}bg-retro-cream${E}`, "g"), replace: "$1bg-surface" },
    { match: new RegExp(`${T}bg-white${E}`, "g"), replace: "$1bg-surface-raised" },
    { match: new RegExp(`${T}bg-navy${E}`, "g"), replace: "$1bg-surface-dark" },
    { match: new RegExp(`${T}bg-navy\\/${A}${E}`, "g"), replace: ([s, a]) => { const p = pct(a); return p <= 10 ? `${s}bg-surface-subtle` : p >= 45 && p <= 60 ? `${s}bg-overlay` : null; } },
    { match: new RegExp(`${T}bg-gray-(50|100|200)${E}`, "g"), replace: "$1bg-surface-subtle" },
    { match: new RegExp(`${T}bg-(?:white|retro-cream)\\/${A}${E}`, "g"), replace: ([s, a]) => (pct(a) <= 20 ? `${s}bg-surface-subtle-on-dark` : null) },

    // lines
    { match: new RegExp(`${T}(border|divide)(-[trblxy])?-navy${E}`, "g"), replace: "$1$2$3-line" },
    { match: new RegExp(`${T}(border|divide)(-[trblxy])?-navy\\/${A}${E}`, "g"), replace: ([s, k, side = ""]) => `${s}${k}${side}-line-subtle` },
    { match: new RegExp(`${T}(border|divide)(-[trblxy])?-(?:retro-cream|white)${E}`, "g"), replace: "$1$2$3-line-on-dark" },
    { match: new RegExp(`${T}(border|divide)(-[trblxy])?-(?:retro-cream|white)\\/${A}${E}`, "g"), replace: ([s, k, side = "", a]) => `${s}${k}${side}-${pct(a) <= 25 ? "line-subtle-on-dark" : "line-on-dark"}` },
    { match: new RegExp(`${T}(border|divide)(-[trblxy])?-gray-(100|200|300)${E}`, "g"), replace: "$1$2$3-line-subtle" },
  ],
};
```

- [ ] **Step 3: Dry run and review the flags**

Run: `node scripts/codemods/replace-classes.mjs scripts/codemods/maps/colors.mjs > /tmp/colors-dry.txt; grep -c "change" /tmp/colors-dry.txt; grep REVIEW /tmp/colors-dry.txt`
Expected: several hundred changes. REVIEW lines are the decorative low-opacity cases (`text-navy/15` to `/35`, `text-gray-400`, `bg-navy/20` to `/40`). For each REVIEW, decide by reading the element: decoration (large faded numbers, watermark) becomes `text-line-subtle` (solid `#dfdddb`) on light or `text-line-subtle-on-dark` on dark; real text becomes `text-secondary` / `text-muted`. Edit those by hand after Step 4.

- [ ] **Step 4: Apply, fix the REVIEW list by hand, typecheck**

```bash
node scripts/codemods/replace-classes.mjs scripts/codemods/maps/colors.mjs --write
npx tsc --noEmit && npm run lint
```

- [ ] **Step 5: Replace hex literals in the two retro CSS files**

In `src/components/blocks/cookie-consent/cookie-consent.css` replace `#0e1a3c` with `var(--color-primary)`, `#fbf8f1` with `var(--color-surface)`, `#be3330` with `var(--color-accent)`, `#efb22b` with `var(--color-accent-on-dark)`. `fullcalendar-overrides.css` is in `FROZEN` for the checker; replace its 4 `#0e1a3c` with `var(--color-primary)` too (same color, safe).

- [ ] **Step 6: Button tokens (spec section 10)**

The Button component rewrite is SP2; here only the token-level rules land on the two button styles in use.
- `src/components/ui/spotlight-button.tsx:80` and `:165`: replace the `px-8 py-3.5` / `px-6 py-3` padding with `h-12 px-6 inline-flex items-center justify-center`, so every button is 48px tall regardless of its label. Keep the primary layered hover exactly as it is.
- Secondary (outline) buttons: in `.btn-retro-ghost` (`globals.css:304-309`) replace `hover:bg-black hover:text-white` with `hover-layer`, and set `@apply h-12 px-6` instead of `px-8 py-3.5`. Do the same for the outline CTA links listed by the audit (`CoursesBannerSection.tsx:79`, `RegistrationSectionV2.tsx:83`, `Footer.tsx:356`); on navy use `hover-layer-on-dark`. `HeroSection.tsx:364` is frozen and stays.
- Disabled: add `disabled:bg-surface-subtle disabled:text-muted disabled:border-transparent disabled:cursor-not-allowed` to the submit buttons of the Contact, Parteneri, Înscrieri and Voluntariat forms (on navy panels: `disabled:bg-surface-subtle-on-dark disabled:text-muted-on-dark`), replacing `disabled:opacity-50` / `opacity-30`.

Note on `hover-layer`: it draws with `box-shadow`, so it must not go on an element that already has a `shadow-*` offset shadow. None of the elements above do.

- [ ] **Step 7: Verify**

```bash
npm run check:tokens -- --verbose
npm run test:visual
npm run test:a11y
```

Expected: `text-opacity`, `bg-opacity` and `default-palette` counts dropped a lot (note the new numbers). Hero test PASS with 0 pixels. Page diffs: grey and faded text becomes solid (subtitles darker), dividers slightly different, table greens and reds unchanged only if they were status colors (flagged ones), scrollbar navy. Contrast: every route is at or below baseline; write down the new counts.

- [ ] **Step 8: User gate**

Show the diffs and the contrast numbers. Wait for approval.

- [ ] **Step 9: Lower the ratchets, re-baseline, commit**

```bash
node scripts/tokens/check.mjs --write-baseline
RECORD_CONTRAST=1 npm run test:a11y
npm run test:visual:update
git add -A src scripts tests/a11y/contrast-baseline.json
git commit -m "feat(tokens): replace text, background and border opacity with solid role colors"
```

---

### Task 7: Shape, borders and shadows

**Files:**
- Create: `scripts/codemods/maps/shape.mjs`
- Modify: `src/app/globals.css` (`--shadow-retro` line 125, new utilities, `.marker-tag` and `.btn-retro-ghost` `@apply` lines), all of `src/` via codemod

**Interfaces:**
- Produces: `shadow-retro-sm`, `shadow-retro` (value changes from 0.12 to 0.16); border width utilities `border-retro`, `border-t-retro`, `border-b-retro`, `border-l-retro`, `border-r-retro`, `border-x-retro`, `border-y-retro`.

- [ ] **Step 1: Tokens**

In `@theme`, replace `--shadow-retro: 8px 8px 0 rgb(14 26 60 / 0.12);` with:

```css
  --shadow-retro-sm: 4px 4px 0 rgb(14 26 60 / 0.16);
  --shadow-retro: 8px 8px 0 rgb(14 26 60 / 0.16);
```

Add utilities:

```css
@utility border-retro { border-width: 1.5px; }
@utility border-t-retro { border-top-width: 1.5px; }
@utility border-b-retro { border-bottom-width: 1.5px; }
@utility border-l-retro { border-left-width: 1.5px; }
@utility border-r-retro { border-right-width: 1.5px; }
@utility border-x-retro { border-left-width: 1.5px; border-right-width: 1.5px; }
@utility border-y-retro { border-top-width: 1.5px; border-bottom-width: 1.5px; }
```

In `.marker-tag` and `.btn-retro-ghost`, change `border-[1.5px]` to `border-retro`.

- [ ] **Step 2: Write the map**

`scripts/codemods/maps/shape.mjs`:

```js
const T = "(^|[\\s\"'`:])";
const E = "(?=[\\s\"'`]|$)";
const NAVY = "(?:rgb\\(14_26_60_\\/_0?\\.(\\d+)\\)|rgba\\(14,26,60,0?\\.(\\d+)\\))";

export default {
  rules: [
    { match: new RegExp(`${T}border(-[trblxy])?-\\[1\\.5px\\]${E}`, "g"), replace: "$1border$2-retro" },
    { match: new RegExp(`${T}shadow-\\[(\\d)px_(\\d)px_0_${NAVY}\\]${E}`, "g"), replace: ([s, x, y]) => (x === y && (x === "4" || x === "6" || x === "8") ? `${s}${x === "4" ? "shadow-retro-sm" : "shadow-retro"}` : null) },
    { match: new RegExp(`${T}shadow-\\[[^\\]]+\\]${E}`, "g"), replace: () => null },
    { match: new RegExp(`${T}rounded(?:-[trbl]{1,2})?(?:-(?:sm|md|lg|xl|2xl|3xl|\\[[^\\]]+\\]))?${E}`, "g"), replace: "$1rounded-none" },
  ],
  skip: ["src/components/ui/SlidingPillToggle.tsx"],
};
```

The 6px shadows go to `shadow-retro` (8px) as approved. `rounded` classes become `rounded-none`, then Step 4 deletes the redundant ones; `rounded-full` is untouched.

- [ ] **Step 3: Dry run**

Run: `node scripts/codemods/replace-classes.mjs scripts/codemods/maps/shape.mjs`
Expected: REVIEW lines for the soft blurred shadows (`ScheduleSection.tsx:35`, `0_16px_40px` in `sportivi/[slug]/_View.tsx:186`) and the rust shadow `4px_4px_0_var(--color-rust)`. Decide per the spec: blurred shadows are removed; the rust offset shadow is part of the primary CTA layers and stays.

- [ ] **Step 4: Apply, clean up, handle hand-written CSS**

```bash
node scripts/codemods/replace-classes.mjs scripts/codemods/maps/shape.mjs --write
grep -rln "rounded-none" src | xargs sed -i '' -E 's/ ?rounded-none//g'
```

Then edit the REVIEW items by hand, and in `globals.css` replace the inline `rgba(14,26,60,0.16)` shadows at lines 461, 481 and 492 with `var(--shadow-retro)`. Check `SportspersonCard.tsx` (athlete card) is square after this.

- [ ] **Step 5: Verify, user gate, re-baseline, commit**

```bash
npx tsc --noEmit && npm run lint && npm run check:tokens && npm run test:visual
```

Expected diffs: athlete cards and any rounded chips become square, shadows unify (some lighter, the 6px ones longer), the page-hero photo frame loses its soft shadow. Hero PASS. Show the user, wait for approval, then:

```bash
node scripts/tokens/check.mjs --write-baseline
npm run test:visual:update
git add -A src scripts
git commit -m "feat(tokens): unify borders, shadows and corners"
```

---

### Task 8: Type roles

**Files:**
- Create: `scripts/codemods/maps/type.mjs`
- Modify: `src/app/globals.css` (type scale block lines 95-121, `.retro-eyebrow`, `.marker-tag`, `.btn-retro-ghost`, footer rules 374-380, rules at 430-453 and 499-500), all of `src/` via codemod

**Interfaces:**
- Produces: `text-display-lg`, `text-display`, `text-heading`, `text-title`, `text-body`, `text-body-sm`, `text-caption`, `text-label`, `text-button`, and the named exception `text-athlete-name`.

- [ ] **Step 1: Replace the type tokens**

In `@theme`, delete `--text-3xs`, `--text-2xs`, `--text-label*`, `--text-eyebrow*`, `--text-display-sm`, `--text-display-md`, `--text-display-lg`, `--text-display-xl`. Keep `--text-logo` and `--font-size-branding-xl` (hero). Add after the `@utility hover-layer-on-dark` block:

```css
/* Type roles: each sets size, weight, line-height and letter-spacing. */
@utility text-display-lg { font-family: var(--font-display); font-weight: 800; font-size: clamp(3rem, 6vw, 5rem); line-height: 1.05; letter-spacing: -0.02em; }
@utility text-display { font-family: var(--font-display); font-weight: 800; font-size: clamp(1.875rem, 4.2vw, 3rem); line-height: 1.05; letter-spacing: -0.02em; }
@utility text-heading { font-family: var(--font-display); font-weight: 800; font-size: clamp(1.625rem, 3vw, 2.25rem); line-height: 1.1; letter-spacing: -0.02em; }
@utility text-title {
  font-family: var(--font-display); font-weight: 800; font-size: 1.25rem; line-height: 1.2; letter-spacing: -0.01em;
  @media (width >= 48rem) { font-size: 1.5rem; }
}
@utility text-body { font-weight: 400; font-size: 1rem; line-height: 1.6; letter-spacing: 0; }
@utility text-body-sm { font-weight: 400; font-size: 0.875rem; line-height: 1.55; letter-spacing: 0; }
@utility text-caption { font-weight: 400; font-size: 0.75rem; line-height: 1.4; letter-spacing: 0; }
@utility text-label { font-weight: 600; font-size: 0.75rem; line-height: 1.1; letter-spacing: 0.14em; text-transform: uppercase; }
@utility text-button { font-weight: 600; font-size: 0.8125rem; line-height: 1; letter-spacing: 0.06em; text-transform: uppercase; }
/* Named exception: athlete page name. */
@utility text-athlete-name {
  font-family: var(--font-display); font-weight: 900; font-size: 3.5rem; line-height: 0.85; letter-spacing: -0.035em;
  @media (width >= 48rem) { font-size: 5.5rem; }
}
```

Update `.retro-eyebrow` to `@apply text-label text-primary;`, `.marker-tag` to use `text-label`, `.btn-retro-ghost` to use `text-button`. Footer rule 374-380: set `font-family: var(--font-display); font-weight: 800 !important; font-size: 1.25rem !important;`. Replace hard-coded sizes at 430-453 and 499-500 with the matching role values (13px nav text becomes `0.8125rem`, 8.5px and 11px become `0.75rem`).

- [ ] **Step 2: Write the map**

`scripts/codemods/maps/type.mjs`:

```js
// Picks a role from the size class, using font-display on the same element
// to tell headings from text, then strips the classes the role now owns.
const SIZE = /(^|\s)(?:(?:sm|md|lg|xl):)?text-(3xs|2xs|xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|eyebrow|label|display-(?:sm|md|lg|xl)|\[\d+(?:\.\d+)?px\])(?=\s|$)/g;
const OWNED = /(^|\s)(?:(?:sm|md|lg|xl):)?(?:font-(?:display|light|normal|medium|semibold|bold|extrabold|black)|leading-\S+|tracking-\S+)(?=\s|$)/g;

const px = (t) => ({ "3xs": 10, "2xs": 11, xs: 12, sm: 14, base: 16, lg: 18, xl: 20, "2xl": 24, "3xl": 30, "4xl": 36, "5xl": 48, "6xl": 60, eyebrow: 11, label: 11 })[t] ?? (t.startsWith("[") ? parseFloat(t.slice(1)) : null);

function role(classes) {
  const sizes = [...classes.matchAll(SIZE)].map((m) => m[2]);
  if (!sizes.length) return null;
  const top = sizes[sizes.length - 1];
  const caps = /\buppercase\b/.test(classes);
  const heading = /\bfont-display\b/.test(classes);
  if (top.startsWith("display-")) return { "display-sm": "text-heading", "display-md": "text-display", "display-lg": "text-display-lg", "display-xl": "text-display-lg" }[top];
  const size = px(top);
  if (size === null) return null;
  if (heading) return size >= 48 ? "text-display" : size >= 26 ? "text-heading" : "text-title";
  if (caps) return "text-label";
  if (size >= 16) return "text-body";
  if (size >= 14) return "text-body-sm";
  return "text-caption";
}

export default {
  rules: [
    {
      match: /className="([^"]*)"/g,
      replace: ([classes]) => {
        const r = role(classes);
        if (!r) return `className="${classes}"`;
        const kept = classes.replace(SIZE, " ").replace(OWNED, " ").replace(/\s+/g, " ").trim();
        return `className="${r}${kept ? " " + kept : ""}"`;
      },
    },
  ],
};
```

Classes inside `cn(...)` calls and template literals are not matched; the dry run lists them via `npm run check:tokens -- --verbose` (`arbitrary-type`) and they are done by hand in Step 4.

- [ ] **Step 3: Dry run**

Run: `node scripts/codemods/replace-classes.mjs scripts/codemods/maps/type.mjs`
Expected: several hundred changes. Spot-check 10 results against the spec's mapping table (Section 8).

- [ ] **Step 4: Apply, then hand-finish**

```bash
node scripts/codemods/replace-classes.mjs scripts/codemods/maps/type.mjs --write
grep -rnE "text-(3xs|2xs|eyebrow|display-sm|display-md)|text-\[[0-9.]+px\]|(tracking|leading)-\[" src | grep -v -e HeroSection.tsx -e HeroWordmarkMorph.tsx
```

Convert every remaining hit by hand using the same rules (`cn()` arguments, template strings, CSS files). Exceptions that keep a custom size: the athlete name (`sportivi/[slug]/_View.tsx:179` becomes `text-athlete-name`), large decorative numbers (`_View.tsx:352,566,625`, `text-[140px]`, `text-[220px]`), and the frozen hero.

- [ ] **Step 5: Verify, user gate, re-baseline, commit**

```bash
npx tsc --noEmit && npm run lint && npm run check:tokens && npm run test:fonts && npm run test:visual && npm run test:a11y
```

Expected diffs: small text grows to at least 12px, eyebrows 11 to 12px, card and form titles unify at 20 to 24px, headings unify. Hero PASS. Watch for wrapping in tight spots (athlete card stats, badges, nav). Show the user, wait for approval, then:

```bash
node scripts/tokens/check.mjs --write-baseline
npm run test:visual:update
git add -A src scripts
git commit -m "feat(tokens): replace ad-hoc font sizes with nine type roles"
```

---

### Task 9: Spacing scale

**Files:**
- Create: `scripts/codemods/maps/spacing.mjs`
- Modify: all of `src/` via codemod

**Interfaces:**
- Produces: only scale steps `0, 1, 2, 3, 4, 6, 8, 12, 16, 24` (plus `0.5` in `src/components/ui/badge.tsx` and the link underline) for `p/m/gap/space`.

- [ ] **Step 1: Write the map**

`scripts/codemods/maps/spacing.mjs`:

```js
// Nearest step on the 4px scale; ties go up. Pixel values in, Tailwind steps out.
const T = "(^|[\\s\"'`:])";
const E = "(?=[\\s\"'`]|$)";
const PROP = "(-?)(p[trblxy]?|m[trblxy]?|gap(?:-[xy])?|space-[xy])";
const SCALE = [0, 4, 8, 12, 16, 24, 32, 48, 64, 96];
const STEP = { 0: "0", 4: "1", 8: "2", 12: "3", 16: "4", 24: "6", 32: "8", 48: "12", 64: "16", 96: "24" };

export function snap(pxValue) {
  let best = SCALE[0];
  for (const s of SCALE) {
    const d = Math.abs(s - pxValue);
    const bd = Math.abs(best - pxValue);
    if (d < bd || (d === bd && s > best)) best = s;
  }
  return STEP[best];
}

const fromStep = (v) => Number(v) * 4;

export default {
  rules: [
    { match: new RegExp(`${T}${PROP}-(1\\.5|2\\.5|3\\.5|5|7|9|10|11|14|20|28|40|56)${E}`, "g"), replace: ([s, neg, prop, v]) => `${s}${neg}${prop}-${snap(fromStep(v))}` },
    { match: new RegExp(`${T}${PROP}-\\[(\\d+(?:\\.\\d+)?)px\\]${E}`, "g"), replace: ([s, neg, prop, v]) => `${s}${neg}${prop}-${snap(Number(v))}` },
  ],
  skip: ["src/components/ui/badge.tsx"],
};
```

Note `8` (32px) is on the scale; the ratchet pattern lists `32` (128px) as off-scale, which only section utilities (Task 10) produce.

- [ ] **Step 2: Add a test for snap()**

Append to `scripts/codemods/replace-classes.test.mjs`:

```js
import { snap } from "./maps/spacing.mjs";

test("snaps to the nearest step, ties up", () => {
  assert.equal(snap(6), "2");
  assert.equal(snap(10), "3");
  assert.equal(snap(14), "4");
  assert.equal(snap(18), "4");
  assert.equal(snap(20), "6");
  assert.equal(snap(28), "8");
  assert.equal(snap(40), "12");
  assert.equal(snap(80), "24");
});
```

Run: `npm run test:scripts`
Expected: PASS.

- [ ] **Step 3: Dry run, apply, verify**

```bash
node scripts/codemods/replace-classes.mjs scripts/codemods/maps/spacing.mjs
node scripts/codemods/replace-classes.mjs scripts/codemods/maps/spacing.mjs --write
npx tsc --noEmit && npm run lint && npm run check:tokens && npm run test:visual
```

Expected diffs: small shifts everywhere (this is the biggest diff). Hero PASS. Review route by route: where a snap looks wrong (for example a 20px gap that should read tighter), pick the other neighbour by hand, per the spec's "each snap is decided per use".

- [ ] **Step 4: Apply the fixed patterns**

By hand, per the spec table: card padding `p-6` (compact `p-4`, large panels `md:p-8`); card inner rhythm `mt-2`/`gap-2`; inputs `h-12 px-4` in `src/components/ui/form-field.tsx:5-14` and `select.tsx:45-46`; rows `py-3 px-4`; badge `px-2 py-1` and `px-3 py-1` in `badge.tsx` and `pill.tsx`.

- [ ] **Step 5: User gate, re-baseline, commit**

Show the diffs, wait for approval, then:

```bash
node scripts/tokens/check.mjs --write-baseline
npm run test:visual:update
git add -A src scripts
git commit -m "feat(tokens): move spacing onto the 4px scale"
```

---

### Task 10: Widths, sections, gutters and scroll offset

**Files:**
- Modify: `src/app/globals.css` (`--max-content-width` block lines 118-120, `.max-footer-content` 267-269, `html` block), `src/components/ui/section.tsx:31`, `src/components/blocks/header/Header.tsx:161`, `src/components/blocks/footer/Footer.tsx:200,340`, `src/app/layout.tsx:163`, `src/app/despre-noi/_View.tsx:121-219`, section wrappers across `src/app/**/_View.tsx` and `src/app/landing-v2/blocks/*` (not HeroSection)

**Interfaces:**
- Produces: `max-w-content` (1280, exists), `max-w-prose` (720), `max-w-narrow` (560), `max-w-aside` (320); `section-compact`, `section`, `section-feature`; `gutter` (16/32/48 side padding).

- [ ] **Step 1: Tokens and utilities**

In `@theme`, delete `--max-footer-width` and add:

```css
  --container-prose: 45rem;
  --container-narrow: 35rem;
  --container-aside: 20rem;
```

(`--container-*` generates `max-w-prose`, `max-w-narrow`, `max-w-aside`.) Delete the `.max-footer-content` rule. Add:

```css
@utility section-compact { padding-block: 3rem; @media (width >= 48rem) { padding-block: 4rem; } }
@utility section { padding-block: 4rem; @media (width >= 48rem) { padding-block: 6rem; } }
@utility section-feature { padding-block: 6rem; @media (width >= 48rem) { padding-block: 8rem; } }
@utility gutter { padding-inline: 1rem; @media (width >= 48rem) { padding-inline: 2rem; } @media (width >= 64rem) { padding-inline: 3rem; } }
```

In the `html` block add `scroll-padding-top: 7rem;` (header 80px plus the 32px contact strip).

- [ ] **Step 2: Apply sections and gutters**

- Replace `py-16 md:py-24` with `section`, `py-12 md:py-14` with `section-compact`, landing `py-20 md:py-28` (AthletesSpotlight, EventsNewsSection) with `section-feature`. Other section paddings from the layout audit (`py-16 md:py-20`, flat `py-20`, `pt-*/pb-*` pairs) go to `section` unless the user says otherwise at the gate.
- Replace `px-4 md:px-8 lg:px-12`, `px-6 md:px-8`, `px-8 lg:px-12` on section containers with `gutter`. `section.tsx:31` becomes `w-full max-w-content mx-auto gutter`.
- `Header.tsx:161`: `px-4` becomes `gutter`.
- `Footer.tsx:200`: `max-footer-content px-22 py-10` becomes `max-w-content mx-auto gutter py-12`. `Footer.tsx:340`: `px-6 md:px-8` becomes `gutter`.
- `layout.tsx:163`: remove `pb-24 md:pb-32` from `<main>`.

- [ ] **Step 3: Apply widths**

- `max-w-3xl` on text blocks becomes `max-w-prose`; `max-w-xl`/`max-w-lg` on hero subtitles, forms and dialogs becomes `max-w-narrow`; `md:max-w-xs` side notes become `max-w-aside`.
- Section containers at `max-w-4xl` (cursuri), `max-w-5xl` (LatestArticleSection), `max-w-6xl` (SeasonTableView) become `max-w-content`.
- `src/app/despre-noi/_View.tsx`: intro and both lists `max-w-prose`; stats grid and timeline full `max-w-content`; remove the timeline's `ml-20`.
- Leave `AboutUsSection.tsx:145` (`max-w-[1600px]` ribbon) and add above it: `{/* Decorative ribbon: intentionally wider than max-w-content (1600px). */}`.

- [ ] **Step 4: Verify, user gate, re-baseline, commit**

```bash
npx tsc --noEmit && npm run lint && npm run check:tokens && npm run test:visual
```

Expected diffs: footer content narrower and aligned with the header and sections; header logo and menu move inward on desktop; Despre noi right edges consistent; cursuri sections wider; landing sections below the hero taller. Hero PASS (the header is hidden in that test). Show the user, wait for approval, then:

```bash
node scripts/tokens/check.mjs --write-baseline
npm run test:visual:update
git add -A src
git commit -m "feat(layout): add width, section and gutter tokens and align header and footer"
```

---

### Task 11: Links

**Files:**
- Create: `scripts/codemods/maps/links.mjs`
- Modify: `src/app/globals.css:271-295` (link utilities), `src/components/ui/link.tsx:17,44`, `src/components/blocks/footer/Footer.tsx:136,290,318`, `src/components/blocks/cookie-consent/CookiePreferencesLink.tsx:30`

**Interfaces:**
- Produces: `link` (all links except footer), `link-on-dark`, `link-footer`.

- [ ] **Step 1: Utilities**

Replace `.link-underline-animate`, `.menu-link-underline` and `.link-underline-rust` in `globals.css` with:

```css
@utility link {
  font-weight: 600;
  color: var(--color-primary);
  background-image: linear-gradient(var(--color-accent), var(--color-accent));
  background-repeat: no-repeat;
  background-size: 100% 2px;
  background-position: right bottom;
  padding-bottom: 4px;
  -webkit-box-decoration-break: clone;
  box-decoration-break: clone;
  transition: color var(--duration-fast, 150ms) ease;
  &:hover { color: var(--color-accent); animation: link-slide 750ms ease-in-out; }
  @media (prefers-reduced-motion: reduce) { &:hover { animation: none; } }
}
@utility link-on-dark {
  color: var(--color-primary-on-dark);
  background-image: linear-gradient(var(--color-accent-on-dark), var(--color-accent-on-dark));
  &:hover { color: var(--color-accent-on-dark); }
}
@utility link-footer {
  position: relative;
  width: fit-content;
  padding-bottom: 2px;
  &::after { content: ""; position: absolute; left: 0; bottom: 0; height: 2px; width: 0; background: var(--color-mustard); transition: width 200ms; }
  &:hover::after { width: 100%; }
}
@keyframes link-slide {
  0% { background-size: 100% 2px; background-position: right bottom; }
  49% { background-size: 0% 2px; background-position: right bottom; }
  50% { background-size: 0% 2px; background-position: left bottom; }
  100% { background-size: 100% 2px; background-position: left bottom; }
}
```

`link-on-dark` is used together with `link` (`className="link link-on-dark"`).

- [ ] **Step 2: Map**

`scripts/codemods/maps/links.mjs`:

```js
const T = "(^|[\\s\"'`:])";
const E = "(?=[\\s\"'`]|$)";
const FOOTER = "relative w-fit pb-\\[2px\\] after:absolute after:left-0 after:bottom-0 after:h-\\[2px\\] after:w-0 after:bg-mustard after:transition-\\[width\\] after:duration-200 hover:after:w-full";

export default {
  rules: [
    { match: new RegExp(FOOTER, "g"), replace: "link-footer" },
    { match: new RegExp(`${T}(?:link-underline-rust|link-underline-animate|menu-link-underline)${E}`, "g"), replace: "$1link" },
    { match: new RegExp(`${T}hover:text-(?:rust|accent)${E}`, "g"), replace: () => null },
  ],
};
```

The `hover:text-*` flags are reviewed: on elements that now carry `link`, delete them (the utility owns hover); elsewhere keep.

- [ ] **Step 3: Apply and finish by hand**

```bash
node scripts/codemods/replace-classes.mjs scripts/codemods/maps/links.mjs --write
```

Then: in `ui/link.tsx` line 44 replace `<span className="link-underline-animate">` with `<span className="link">` and delete the gray and blue hover classes on line 17; add `link-on-dark` wherever a migrated link sits on navy (Footer RegisterBand, contact panel, parteneri panel: check each REVIEW line).

- [ ] **Step 4: Verify, user gate, re-baseline, commit**

```bash
npx tsc --noEmit && npm run lint && npm run test:visual
```

Expected diffs: every text link now shows a permanent 2px rust underline (mustard on navy); footer links unchanged. Hero PASS. Manually hover a few links in a browser (`npm run dev`) to confirm the 750ms slide. Show the user, wait for approval, then:

```bash
npm run test:visual:update
git add -A src scripts
git commit -m "feat(links): permanent underline with slide-through hover"
```

---

### Task 12: Motion, layers and icons

**Files:**
- Create: `scripts/codemods/maps/motion-layers-icons.mjs`
- Modify: `src/app/globals.css` (`@theme`), all of `src/` via codemod, motion-library call sites listed by the audit (`Header.tsx:34`, `MenuPanel.tsx:181`, `NavigationMenuInteractive.tsx:122,133`, `GalleryCarousel.tsx:169,352`, `YoutubeEmbed.tsx:144`, `AnnouncementModal.tsx:111`, `AnnouncementCard.tsx:35`, `_animations.tsx:25,58`, `_RegistrationForm.tsx:215`, `not-found.tsx:22,28,37`)

**Interfaces:**
- Produces: `duration-fast` (150ms), `duration-base` (250ms), `duration-slow` (400ms), `duration-long` (750ms); `ease-standard`, `ease-out` (redefined), `ease-in-out`, `ease-spring`; `z-base`, `z-raised`, `z-sticky`, `z-header`, `z-menu`, `z-dialog`, `z-popup`; `src/lib/motion.ts` exporting `DURATION = { fast: 0.15, base: 0.25, slow: 0.4, long: 0.75 }` and `EASE = { standard: [0.4, 0, 0.2, 1], out: [0.22, 1, 0.36, 1] }` for the motion library.

- [ ] **Step 1: Tokens**

In `@theme` add:

```css
  --duration-fast: 150ms;
  --duration-base: 250ms;
  --duration-slow: 400ms;
  --duration-long: 750ms;
  --ease-standard: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-in-out: ease-in-out;
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
```

Add utilities (Tailwind has no `--duration-*` or `--z-*` namespace):

```css
@utility duration-fast { transition-duration: 150ms; }
@utility duration-base { transition-duration: 250ms; }
@utility duration-slow { transition-duration: 400ms; }
@utility duration-long { transition-duration: 750ms; }
@utility z-base { z-index: 0; }
@utility z-raised { z-index: 10; }
@utility z-sticky { z-index: 50; }
@utility z-header { z-index: 100; }
@utility z-menu { z-index: 200; }
@utility z-dialog { z-index: 300; }
@utility z-popup { z-index: 400; }
```

`src/lib/motion.ts`:

```ts
// Motion tokens for the motion library (seconds), mirroring globals.css.
export const DURATION = { fast: 0.15, base: 0.25, slow: 0.4, long: 0.75 } as const;
export const EASE = {
  standard: [0.4, 0, 0.2, 1],
  out: [0.22, 1, 0.36, 1],
} as const;
```

- [ ] **Step 2: Map**

`scripts/codemods/maps/motion-layers-icons.mjs`:

```js
const T = "(^|[\\s\"'`:])";
const E = "(?=[\\s\"'`]|$)";
const dur = (ms) => (ms <= 200 ? "fast" : ms <= 300 ? "base" : ms <= 500 ? "slow" : "long");
const Z = { 0: "z-base", 1: "z-raised", 2: "z-raised", 4: "z-raised", 5: "z-raised", 6: "z-raised", 10: "z-raised", 20: "z-raised", 30: "z-raised", 50: "z-sticky", 90: "z-sticky", 100: "z-header", 200: "z-dialog", 900: "z-popup", 998: "z-menu", 999: "z-menu" };

export default {
  rules: [
    { match: new RegExp(`${T}duration-(\\d+)${E}`, "g"), replace: ([s, ms]) => `${s}duration-${dur(Number(ms))}` },
    { match: new RegExp(`${T}ease-\\[cubic-bezier\\([^\\]]+\\)\\]${E}`, "g"), replace: ([s]) => `${s}ease-standard` },
    { match: new RegExp(`${T}(-?)z-(?:\\[(\\d+)\\]|(\\d+))${E}`, "g"), replace: ([s, neg, a, b]) => { const v = Number(a ?? b); return neg ? null : Z[v] ? `${s}${Z[v]}` : null; } },
    { match: new RegExp(`${T}(size|w|h)-(3|3\\.5|\\[1[4-8]px\\])${E}`, "g"), replace: () => null },
  ],
};
```

Icon sizes are flagged, not auto-changed: `w-3`/`h-3`/`size-[14..18px]` on an icon next to text become `size-4` (16); standalone controls become `size-6` (24). `z-[9999]` (preview banner, editor only) stays and is added to `FROZEN`-style exceptions by leaving it flagged. The Înscrieri modal (`_RegistrationForm.tsx:168`, today `z-[100]`) must become `z-dialog`, not `z-header`: fix it by hand.

- [ ] **Step 3: Apply and finish by hand**

```bash
node scripts/codemods/replace-classes.mjs scripts/codemods/maps/motion-layers-icons.mjs --write
```

Then: replace literal durations and easings in the motion-library call sites with `DURATION.*` and `EASE.*` from `@/lib/motion`; resolve each icon REVIEW line; give every icon-only control a hit area of at least 40px (`size-10` wrapper with the icon centered): `SearchBar.tsx:84`, `AnnouncementCard.tsx:45`, `resume-registration.tsx:76`, `MobileSheets.tsx:34,115` (also add `aria-label`), `Footer.tsx:246`, `PricingSection.tsx:21` (make it a focusable `button`), `YoutubeEmbed.tsx:195`, `GalleryCarousel.tsx:268,294`, `fullcalendar-overrides.css:74` (`.fc-custom-nav-btn` to 40px), `ViewModeDropdown`, `Pagination.tsx:68`, `_SkateResults.tsx:220,234,253`, `cookie-consent.css:81` (`.pm__close-btn` to 40px). Gallery dots (8px) get a 40px transparent hit area around the visible dot.

- [ ] **Step 4: Verify, user gate, re-baseline, commit**

```bash
npx tsc --noEmit && npm run lint && npm run check:tokens && npm run test:visual
```

Expected diffs: icons at 16 or 24, small controls with larger tap areas (visible where they have a border or background). Hero PASS. Show the user, wait for approval, then:

```bash
node scripts/tokens/check.mjs --write-baseline
npm run test:visual:update
git add -A src scripts
git commit -m "feat(tokens): add motion, layer and icon size tokens"
```

---

### Task 13: Remove retired tokens, close the ratchet, final check

**Files:**
- Modify: `src/app/globals.css` (`@theme`), `scripts/tokens/baseline.json`, `tests/a11y/contrast-baseline.json`

- [ ] **Step 1: Delete retired tokens**

From `@theme` delete: `--color-gold`, `--color-cream`, `--color-surface-soft`, `--color-blue-tint`, `--color-scrim`, `--color-scrim-light`, `--color-ink`, `--color-silver`, `--color-bronze`, `--color-light`. Then:

```bash
grep -rnE "\b(text|bg|border|from|to|via|fill|stroke)-(gold|cream|surface-soft|blue-tint|scrim|scrim-light|ink|silver|bronze|light)\b" src
```

Expected: no output. Any hit is migrated to its role token (`gold` to `medal-gold` or `text-accent-on-dark`, `silver`/`bronze` to `medal-silver`/`medal-bronze`) before continuing.

- [ ] **Step 2: Drive the ratchet to zero**

```bash
npm run check:tokens -- --verbose
```

For every remaining count above zero, fix the listed files. Allowed leftovers must be real exceptions from the spec (athlete name, decorative numbers, `z-[9999]` preview banner, CTA rust layer shadow); move each into an explicit allowlist comment in `scripts/tokens/patterns.mjs` next to `FROZEN` rather than keeping a non-zero baseline. Then:

```bash
node scripts/tokens/check.mjs --write-baseline
cat scripts/tokens/baseline.json
```

Expected: `{}`.

- [ ] **Step 3: Contrast to zero**

```bash
RECORD_CONTRAST=1 npm run test:a11y && cat tests/a11y/contrast-baseline.json
```

Expected: every route `0`. If not, fix the listed elements and repeat.

- [ ] **Step 4: Full verification**

```bash
npm run lint && npx tsc --noEmit && npm run test:scripts && npm run check:tokens && npm run test:fonts && npm run test:visual && npm run test:a11y && npm run build
```

Expected: everything PASS; hero PASS with 0 pixels.

- [ ] **Step 5: Before/after gallery for the user**

Generate side-by-side images from `tests/visual/.baseline-sp0/` and `tests/visual/__snapshots__/` for every route at 1440 and 390, and show them in the companion. Wait for the user's final approval.

- [ ] **Step 6: Commit**

```bash
git add -A src scripts tests/a11y
git commit -m "chore(tokens): remove retired tokens and close the token ratchet"
```

Do not push or merge. Report to the user: branch `design-foundations`, commit list, and that deploy happens only when they ask.
