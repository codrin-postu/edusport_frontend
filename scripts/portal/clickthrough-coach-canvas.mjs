// Click-through of the coach canvas screens against a running app (a real throwaway Strapi, or the e2e mock stack).
//
//   node scripts/portal/clickthrough-coach-canvas.mjs <base> [--password <pw>] [--today YYYY-MM-DD] [--competitions down|up]
//
// <base> is the coach host, e.g. http://antrenor.localhost:3219. Logs in as antrenor1@example.invalid, opens every
// screen of the look sweep, moves the first child of the first own group from tomorrow, opens Concursuri and
// fails on any console error or any non-2xx answer of the BFF. Synthetic data only.
import { chromium } from "@playwright/test";

const args = process.argv.slice(2);
const flag = (name, fallback) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : fallback; };
const BASE = args[0];
if (!BASE || BASE.startsWith("--")) { console.error("usage: clickthrough-coach-canvas.mjs <base> [--password pw] [--today YYYY-MM-DD] [--competitions down|up]"); process.exit(2); }
const EMAIL = "antrenor1@example.invalid";
const PASSWORD = flag("--password", "Throwaway-Coach-1");
const COMPETITIONS = flag("--competitions", "down");

const bucharest = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Bucharest" }).format(new Date());
const today = flag("--today", bucharest());
const addDays = (iso, n) => { const d = new Date(`${iso}T12:00:00Z`); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
const tomorrow = addDays(today, 1);
const [ty, tm, td] = tomorrow.split("-");

const problems = [];
const note = (text) => { problems.push(text); console.error(`FAIL ${text}`); };

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, locale: "ro-RO", timezoneId: "Europe/Bucharest", colorScheme: "light", reducedMotion: "reduce", baseURL: BASE });
const page = await context.newPage();
page.on("console", (m) => { if (m.type() === "error") note(`console error: ${m.text()}`); });
page.on("pageerror", (e) => note(`page error: ${e.message}`));
page.on("response", (r) => {
  const url = new URL(r.url());
  if (url.pathname.startsWith("/api/portal/") && !r.ok()) note(`${r.request().method()} ${url.pathname} answered ${r.status()}`);
});

async function api(path) {
  return page.evaluate(async(p) => (await (await fetch(`/api/portal/coach${p}`)).json()).data, path);
}

await page.goto("/robots.txt");
const status = await page.evaluate(async(b) => (await fetch("/api/portal/auth/login", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(b) })).status, { email: EMAIL, password: PASSWORD });
if (status !== 200) { console.error(`login answered ${status}`); await browser.close(); process.exit(1); }

const groups = await api("/groups");
const own = groups?.mine?.[0];
if (!own) { console.error("no own group"); await browser.close(); process.exit(1); }
const detail = await api(`/groups/${own.groupId}`);
const child = detail?.members?.[0];
if (!child) { console.error("no member in the first own group"); await browser.close(); process.exit(1); }

const SCREENS = ["/", "/calendar", "/grupe", `/grupe/${own.groupId}`, `/grupe/${own.groupId}/modifica`, `/sportiv/${child.athleteId}`, "/concursuri", "/istoric", "/profil", "/profil/setari", "/lectie/noua"];
for (const path of SCREENS) {
  await page.goto(path);
  await page.locator("h1").first().waitFor({ timeout: 10_000 }).catch(() => note(`${path}: no h1`));
  await page.waitForLoadState("networkidle").catch(() => {});
  if ((await page.locator("h1").count()) !== 1) note(`${path}: ${await page.locator("h1").count()} h1`);
  console.log(`ok ${path}`);
}

// Move the first child to another own group from tomorrow, if there is one.
const target = groups.mine.find((g) => g.groupId !== own.groupId);
if (target) {
  await page.goto(`/grupe/${own.groupId}/modifica`);
  await page.getByRole("button", { name: "Mută", exact: true }).first().click();
  const sheet = page.getByRole("dialog");
  await sheet.getByRole("group", { name: "Din data" }).getByRole("spinbutton").first().click();
  await page.keyboard.type(`${td}${tm}${ty}`);
  await sheet.getByRole("button", { name: "Mută", exact: true }).click();
  await page.getByText("Salvat.").waitFor({ timeout: 10_000 }).catch(() => note("move: no Salvat. toast"));
  const after = await api(`/groups/${own.groupId}`);
  const still = after?.members?.find((m) => m.athleteId === child.athleteId);
  if (!still || still.leavesOn !== tomorrow) note(`move: expected the child listed with leavesOn ${tomorrow}, got ${still ? still.leavesOn : "gone"}`);
  else console.log(`ok moved ${child.name} from ${tomorrow}`);
}

await page.goto("/concursuri");
await page.waitForLoadState("networkidle").catch(() => {});
if (COMPETITIONS === "down") {
  if (!(await page.getByText("Rezultatele nu sunt disponibile acum.").isVisible().catch(() => false))) note("concursuri: expected \"Rezultatele nu sunt disponibile acum.\"");
  else console.log("ok concursuri unavailable line");
}

await browser.close();
if (problems.length > 0) { console.error(`${problems.length} problem(s)`); process.exit(1); }
console.log("click-through passed");
