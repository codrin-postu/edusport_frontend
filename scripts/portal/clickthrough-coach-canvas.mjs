// Click-through of the coach canvas screens against a running app (a real throwaway Strapi, or the e2e mock stack).
//
//   node scripts/portal/clickthrough-coach-canvas.mjs <base> [--password <pw>] [--today YYYY-MM-DD] [--competitions down|up]
//
// <base> is the coach host, e.g. http://antrenor.localhost:3219. Logs in as antrenor1@example.invalid, opens every
// screen of the look sweep, moves the first child of the first own group from tomorrow, opens Concursuri and
// then runs the training steps (weekly group program with "Până la", end one weekday, remove and keep dates, one-off class,
// weekly lesson series, edit from the second lesson on, delete the following) and fails on any console error or non-2xx answer
// of the BFF. Synthetic data only. The training steps write to the database: use a throwaway Strapi.
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

const SCREENS = ["/", "/calendar", "/grupe", `/grupe/${own.groupId}`, `/grupe/${own.groupId}/modifica`, `/sportiv/${child.athleteId}`, "/concursuri", "/istoric", "/profil", "/profil/setari", "/antrenament/nou", `/antrenament/nou?grupa=${own.groupId}`, `/grupe/${own.groupId}?tab=program`];
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

// ---------- training steps ----------
const WEEKDAYS = ["Duminică", "Luni", "Marți", "Miercuri", "Joi", "Vineri", "Sâmbătă"];
const weekdayOf = (iso) => WEEKDAYS[new Date(`${iso}T12:00:00Z`).getUTCDay()];
const ddmmyyyy = (iso) => `${iso.slice(8)}${iso.slice(5, 7)}${iso.slice(0, 4)}`;
const typeDate = async(root, label, iso) => {
  await root.getByRole("group", { name: label }).getByRole("spinbutton").first().click();
  await page.keyboard.type(ddmmyyyy(iso));
};
const toast = (text) => page.getByText(text).first().waitFor({ timeout: 10_000 }).catch(() => note(`no toast "${text}"`));
const step = (name) => console.log(`ok ${name}`);
const dayA = addDays(today, 1);
const dayB = addDays(today, 2);
const dialog = page.getByRole("dialog");
const programOf = async(month) => api(`/groups/${own.groupId}/program?month=${month}`);

// 1. A weekly group program for two weekdays, until a date (not the season end).
await page.goto(`/antrenament/nou?grupa=${own.groupId}`);
await page.getByLabel("Ora").fill("19:10");
const squares = page.getByRole("group", { name: "Zile" });
await typeDate(page, "Din data", dayA);
await squares.getByRole("checkbox", { name: "luni" }).waitFor();
const wantA = weekdayOf(dayA);
const wantB = weekdayOf(dayB);
for (const name of [wantB]) {
  const box = squares.getByRole("checkbox", { name: name.toLowerCase() });
  if ((await box.getAttribute("aria-checked")) !== "true") await box.click();
}
await page.getByLabel("Până la", { exact: true }).click();
await page.getByRole("menuitemradio", { name: "Alege data", exact: true }).click();
await typeDate(page, "Data de sfârșit", addDays(today, 42));
await page.getByRole("button", { name: "Adaugă antrenamentul" }).click();
await toast("Program adăugat.");
await page.waitForURL(/tab=program/, { timeout: 10_000 }).catch(() => note("add program: no redirect to the Program tab"));
const rules = (await programOf(today.slice(0, 7)))?.rules ?? [];
const ruleA = rules.find((r) => r.startTime === "19:10" && r.day === ["sun", "mon", "tue", "wed", "thu", "fri", "sat"][new Date(`${dayA}T12:00:00Z`).getUTCDay()]);
if (!ruleA) note("add program: no rule at 19:10 for the first weekday"); else step("added a weekly program with Până la");

// 2. End one weekday (the first one).
await page.goto(`/grupe/${own.groupId}?tab=program`);
await page.getByRole("button", { name: `Șterge programul de ${wantA.toLowerCase()}` }).last().click();
await dialog.getByRole("button", { name: "Șterge programul" }).click();
await toast("Program șters.");
step(`ended the ${wantA.toLowerCase()} program`);

// 3. Remove one date of the other weekday, then cancel another and keep it back.
await page.goto(`/grupe/${own.groupId}?tab=program`);
const timed = () => page.getByRole("button").filter({ hasText: "19:10" });
await timed().first().waitFor({ timeout: 10_000 }).catch(() => note("no date row at 19:10"));
const before = await timed().count();
await timed().first().click();
await dialog.getByRole("radio", { name: /^Șterge/ }).click();
await dialog.getByRole("button", { name: "Salvează" }).click();
await toast("a fost ștearsă.");
await page.waitForTimeout(500);
if ((await timed().count()) !== before - 1) note(`remove date: ${before} rows before, ${await timed().count()} after`); else step("removed one date");
await timed().first().click();
await dialog.getByRole("radio", { name: /^Anulează/ }).click();
await dialog.getByLabel("Notă").fill("Patinoar închis.");
await dialog.getByRole("button", { name: "Salvează" }).click();
await toast("a fost anulată.");
await timed().first().click();
await dialog.getByRole("radio", { name: /^Se ține/ }).click();
await dialog.getByRole("button", { name: "Salvează" }).click();
await toast("se ține.");
step("cancelled a date and kept it back");

// 4. A one-off class.
await page.goto(`/antrenament/nou?grupa=${own.groupId}`);
await page.getByLabel("Se repetă", { exact: true }).click();
await page.getByRole("menuitemradio", { name: "Nu se repetă", exact: true }).click();
await typeDate(page, "Data", addDays(today, 3));
await page.getByLabel("Ora").fill("19:40");
await page.getByRole("button", { name: "Adaugă antrenamentul" }).click();
await toast("Ședință adăugată");
step("added a one-off class");

// 5. A weekly lesson series.
await page.goto("/antrenament/nou?tip=individual");
await page.getByLabel("Caută după nume").fill(child.name.split(" ")[0]);
await page.getByRole("button", { name: new RegExp(`^${child.name}`) }).first().click();
await page.getByLabel("Se repetă", { exact: true }).click();
await page.getByRole("menuitemradio", { name: "Săptămânal", exact: true }).click();
await page.getByLabel("Ora").fill("20:00");
await typeDate(page, "Din data", dayA);
await page.getByLabel("Până la", { exact: true }).click();
await page.getByRole("menuitemradio", { name: "Alege data", exact: true }).click();
await typeDate(page, "Data de sfârșit", addDays(today, 29));
await page.getByRole("button", { name: "Adaugă antrenamentul" }).click();
await page.waitForURL(/\/lectie\/[^/]+$/, { timeout: 10_000 }).catch(() => note("add lessons: no redirect to the lesson page"));
const lessonsAt = async(time) => {
  const out = [];
  for (const m of new Set([today.slice(0, 7), addDays(today, 29).slice(0, 7)])) {
    for (const day of (await api(`/calendar?month=${m}`))?.days ?? []) for (const i of day.items) if (i.kind === "individual" && i.startTime === time) out.push({ date: day.date, id: i.lessonId });
  }
  return out.sort((a, b) => a.date.localeCompare(b.date));
};
let series = await lessonsAt("20:00");
if (series.length < 3) note(`lesson series: expected at least 3 lessons at 20:00, got ${series.length}`); else step(`added a weekly lesson series (${series.length} lessons)`);

// 6. Edit from the second lesson on.
await page.goto(`/lectie/${series[1].id}/modifica`);
await page.getByLabel("Ora").fill("20:30");
await page.getByRole("button", { name: "Salvează", exact: true }).click();
await dialog.getByRole("radio", { name: "Și lecțiile următoare" }).click();
await dialog.getByRole("button", { name: "Salvează", exact: true }).click();
await page.waitForURL(/\/lectie\/[^/]+$/, { timeout: 10_000 }).catch(() => note("edit lessons: no redirect"));
const edited = await lessonsAt("20:30");
const kept = await lessonsAt("20:00");
if (edited.length !== series.length - 1 || kept.length !== 1) note(`edit following: ${kept.length} at 20:00 and ${edited.length} at 20:30, expected 1 and ${series.length - 1}`); else step("edited from the second lesson on");

// 7. Delete the following lessons from the edited one.
await page.goto(`/lectie/${edited[0].id}`);
await page.getByRole("button", { name: "Șterge lecția" }).click();
await dialog.getByRole("radio", { name: "Și lecțiile următoare" }).click();
await dialog.getByRole("button", { name: "Șterge lecția" }).click();
await toast("Lecții șterse.");
if ((await lessonsAt("20:30")).length !== 0) note("delete following: lessons at 20:30 remain"); else step("deleted the following lessons");

await page.goto("/concursuri");
await page.waitForLoadState("networkidle").catch(() => {});
if (COMPETITIONS === "down") {
  if (!(await page.getByText("Rezultatele nu sunt disponibile acum.").isVisible().catch(() => false))) note("concursuri: expected \"Rezultatele nu sunt disponibile acum.\"");
  else console.log("ok concursuri unavailable line");
}

await browser.close();
if (problems.length > 0) { console.error(`${problems.length} problem(s)`); process.exit(1); }
console.log("click-through passed");
