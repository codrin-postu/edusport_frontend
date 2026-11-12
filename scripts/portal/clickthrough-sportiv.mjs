// Click-through renders of the sportiv app (phase 7 frontend, task 13).
//
//   node scripts/portal/clickthrough-sportiv.mjs http://sportiv.localhost:3218 [--out <dir>] [--invite <secret>]
//
// Runs against the Next app pointed at a throwaway Strapi loaded with the backend fixtures phase4-shape.js to phase7-shape.js
// (synthetic data only). Signs in as parinte1@example.invalid and sportiv18@example.invalid, opens every screen at 390 and
// 1280 wide, and saves <nn>-<screen>-390.png and -1280.png plus index.html (docs/portal/mockups/companion-light.html prepended)
// for a comparison with the boards by eye. No visual assertions. Exits 1 on any page error, any 5xx answer of the app, any
// step that cannot finish, or when "Rămas de plată" differs from the `left` of the money response.
//
// Precondition for the promotion screen: Ana's athlete_accesses.level_seen_group holds an earlier group than her current one
// (the backend stores the first read silently), for example the id of "Primii Paşi":
//   update athlete_accesses set level_seen_group = '<Primii Paşi id>' where athlete_key = '<Ana id>';
// The promotion step shows it on both widths and ends it ("Mai departe") on the desktop pass, so run it before "Acasă Ana".
// "Concursuri, serviciul oprit" answers the list with { available: false } in the browser (the real service stays up).
import { chromium } from "@playwright/test";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const args = process.argv.slice(2);
const flag = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : null; };
const BASE = args[0];
if (!BASE || BASE.startsWith("--")) { console.error("usage: clickthrough-sportiv.mjs <sportiv base> [--out dir] [--invite secret]"); process.exit(2); }
const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = flag("--out") ?? join(HERE, "../../docs/portal/mockups/screens/phase7-renders");
const INVITE = flag("--invite");
mkdirSync(OUT, { recursive: true });

const PARENT = { email: "parinte1@example.invalid", password: "Throwaway-Parent-1" };
const ADULT = { email: "sportiv18@example.invalid", password: "Throwaway-Adult-18" };
const VIEWPORTS = { phone: { width: 390, height: 844 }, desktop: { width: 1280, height: 900 } };
const WIDTH = { phone: 390, desktop: 1280 };
const pad = (n) => String(n).padStart(2, "0");
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

let octet = 40;
const nextIp = () => `10.${(octet += 1)}.${Math.floor(Math.random() * 250) + 1}.${Math.floor(Math.random() * 250) + 1}`;

/** 150 -> "150 RON", 1250.5 -> "1.250,50 RON" (the page's own format, restated here so the check is independent of it). */
function ron(n) {
  const cents = Math.round(n * 100);
  const abs = Math.abs(cents);
  const whole = Math.floor(abs / 100).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const fraction = abs % 100;
  return `${cents < 0 ? "-" : ""}${whole}${fraction === 0 ? "" : `,${String(fraction).padStart(2, "0")}`} RON`;
}

async function settle(page, ms = 350) {
  await page.waitForLoadState("networkidle").catch(() => {});
  await page.waitForFunction(() => !document.querySelector(".animate-spin"), null, { timeout: 8000 }).catch(() => {});
  await page.waitForTimeout(ms);
}

async function newContext(browser, vp) {
  const context = await browser.newContext({
    viewport: VIEWPORTS[vp], locale: "ro-RO", colorScheme: "light", reducedMotion: "reduce", baseURL: BASE,
    extraHTTPHeaders: { "x-real-ip": nextIp() },
  });
  const page = await context.newPage();
  return { context, page };
}

async function login(page, who) {
  await page.goto("/robots.txt");
  const status = await page.evaluate(async(b) => (await fetch("/api/portal/auth/login", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(b) })).status, who);
  if (status !== 200) throw new Error(`login ${who.email} answered ${status}`);
}

/** athlete ids by name, read once through the signed in page (the picker's own request) */
async function athletesOf(page) {
  const res = await page.evaluate(async() => (await fetch("/api/portal/sportiv/athletes")).json());
  return Object.fromEntries(res.data.athletes.map((a) => [a.name, a.id]));
}

const ids = {};
const heading = (page, name) => page.getByRole("heading", { name }).first().waitFor({ timeout: 15000 });
const visible = (loc) => loc.locator("visible=true").first();

const steps = [
  // ---- signed out
  { slug: "login", caption: "Intrare: e-mail, parolă și Google.", anon: true, run: async({ page }) => {
    await page.goto("/login"); await heading(page, "Intră în cont"); await settle(page);
  } },
  { slug: "login-eroare", caption: "Parolă greșită: mesajul de la server.", anon: true, run: async({ page }) => {
    await page.goto("/login");
    await page.getByLabel("E-mail").fill(PARENT.email);
    await page.getByLabel("Parolă", { exact: true }).fill("parola-gresita-1");
    await page.getByRole("button", { name: "Intră" }).click();
    await page.getByRole("main").getByRole("alert").waitFor({ timeout: 15000 }); await settle(page);
  } },
  { slug: "reset", caption: "Resetare parolă, pasul 1: adresa de e-mail.", anon: true, run: async({ page }) => {
    await page.goto("/forgot-password"); await heading(page, "Am uitat parola"); await settle(page);
  } },
  { slug: "invitatie", caption: "Invitație: pagina cu parola nouă (secret din fixtura backend) sau, fără secret, invitația necunoscută.", anon: true, run: async({ page }) => {
    await page.goto(INVITE ? `/invite/${INVITE}` : "/invite/invite-necunoscuta-000000000000000"); await settle(page, 700);
  } },

  // ---- picker and account menu (the account with two athletes)
  { slug: "picker", caption: "Alegerea sportivului (două sportive în cont).", user: "parent", run: async({ page }) => {
    await page.goto("/"); await visible(page.getByText("Alege sportivul.")).waitFor({ timeout: 15000 }); await settle(page);
  } },
  { slug: "meniu-cont", caption: "Meniul contului: sportivii, Setări, Ieșire (telefon: foaia de jos, desktop: meniul din bara laterală).", user: "parent", run: async({ page, vp }) => {
    await page.goto(`/${ids.Ana}/istoric`); await heading(page, "Istoric prezență");
    if (vp === "phone") {
      await page.getByRole("button", { name: "Ana" }).click();
      await page.getByRole("dialog", { name: "Alege sportivul" }).waitFor();
    } else {
      await page.locator("[data-sidebar-account]").hover();
      await page.getByRole("menuitem", { name: "Setări cont" }).waitFor();
    }
    await settle(page);
  } },

  // ---- Acasă
  { slug: "promotie", caption: "Nivel nou: momentul de trecere (vezi precondiția din antet; se încheie pe desktop).", user: "parent", run: async({ page, vp }) => {
    await page.goto(`/${ids.Ana}`);
    await page.getByRole("dialog").waitFor({ timeout: 15000 }); await settle(page);
    if (vp === "desktop") { await page.screenshot({ path: join(OUT, `${current.nn}-${current.slug}-${WIDTH[vp]}.png`) }); current.taken[vp] = true; await page.getByRole("button", { name: "Mai departe" }).click(); }
  } },
  { slug: "acasa-ana", caption: "Acasă, Ana (Școala): prezențe, ședința din abonament.", user: "parent", run: async({ page }) => {
    await page.goto(`/${ids.Ana}`); await heading(page, "Intermediari Bronze"); await settle(page, 500);
  } },
  { slug: "acasa-ioana", caption: "Acasă, Ioana (Club Performanță): cu ultimul concurs.", user: "adult", run: async({ page }) => {
    await page.goto(`/${ids.Ioana}`); await page.getByText("Ultimul concurs").first().waitFor({ timeout: 15000 }); await settle(page, 500);
  } },

  // ---- Istoric, Calendar, Parcurs
  { slug: "istoric", caption: "Istoric prezență, pagina 1.", user: "parent", run: async({ page }) => {
    await page.goto(`/${ids.Ana}/istoric`); await heading(page, "Istoric prezență"); await settle(page);
  } },
  { slug: "istoric-2", caption: "Istoric prezență, pagina 2 (Înainte).", user: "parent", run: async({ page }) => {
    await page.goto(`/${ids.Ana}/istoric`); await heading(page, "Istoric prezență");
    await page.getByRole("button", { name: "Înainte" }).click();
    await page.getByText("21 - 26 din 26").waitFor({ timeout: 15000 }); await settle(page);
  } },
  { slug: "calendar", caption: "Calendar, luna curentă.", user: "parent", run: async({ page }) => {
    await page.goto(`/${ids.Ana}/calendar`); await heading(page, "Calendar"); await settle(page);
  } },
  { slug: "calendar-zi", caption: "Calendar, o zi aleasă (azi).", user: "parent", run: async({ page }) => {
    await page.goto(`/${ids.Ana}/calendar`); await heading(page, "Calendar");
    const today = new Date().toLocaleDateString("ro-RO", { day: "numeric", month: "long" });
    await page.getByRole("button", { name: today, exact: true }).click(); await settle(page);
  } },
  { slug: "parcurs", caption: "Parcurs: nivelul acum, următorul, până acum, realizări.", user: "parent", run: async({ page }) => {
    await page.goto(`/${ids.Ana}/parcurs`); await heading(page, "Parcurs"); await settle(page);
  } },
  { slug: "parcurs-insigna", caption: "Parcurs: insigna mărită.", user: "parent", run: async({ page }) => {
    await page.goto(`/${ids.Ana}/parcurs`); await heading(page, "Parcurs");
    await page.getByRole("button", { name: /antrenamente/ }).first().click();
    await page.getByRole("dialog").waitFor({ timeout: 15000 }); await settle(page);
  } },

  // ---- Concursuri
  { slug: "concursuri", caption: "Concursuri: categoria, recorduri, lista.", user: "adult", run: async({ page }) => {
    await page.goto(`/${ids.Ioana}/concursuri`); await visible(page.getByText("Cupa Brașov")).waitFor({ timeout: 20000 }); await settle(page);
  } },
  { slug: "concursuri-filtrat", caption: "Concursuri filtrate: căutare \"brasov\", sezonul 2025-2026, cele mai multe puncte.", user: "adult", run: async({ page }) => {
    await page.goto(`/${ids.Ioana}/concursuri`); await visible(page.getByText("Cupa Brașov")).waitFor({ timeout: 20000 });
    await visible(page.getByLabel("Caută")).fill("brasov");
    await visible(page.getByLabel("Sezon")).selectOption({ label: "2025-2026" });
    await visible(page.getByLabel("Ordine")).selectOption({ label: "Cele mai multe puncte" });
    await settle(page, 700);
  } },
  { slug: "concurs", caption: "Un concurs: programul scurt și liber, elementele.", user: "adult", run: async({ page }) => {
    await page.goto(`/${ids.Ioana}/concursuri`); await visible(page.getByText("Cupa Brașov")).waitFor({ timeout: 20000 });
    await visible(page.locator("a[href*='/concursuri/']")).click();
    await visible(page.getByText("Program scurt")).waitFor({ timeout: 20000 }); await settle(page);
  } },
  { slug: "concursuri-oprit", caption: "Concursuri când serviciul de rezultate nu răspunde (răspuns { available: false } pus în browser).", user: "adult", run: async({ page }) => {
    await page.route("**/api/portal/sportiv/athletes/*/competitions*", (route) => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ data: { available: false } }) }));
    await page.goto(`/${ids.Ioana}/concursuri`); await visible(page.getByText("Rezultatele nu sunt disponibile acum.")).waitFor({ timeout: 20000 }); await settle(page);
    await page.unroute("**/api/portal/sportiv/athletes/*/competitions*");
  } },

  // ---- Plăți
  { slug: "plati", caption: "Abonament și plăți: rămas de plată, abonamentul, documentul.", user: "parent", money: "Ana", run: async({ page }) => {
    await page.goto(`/${ids.Ana}/plati`); await heading(page, "Abonament și plăți"); await page.getByText("Rămas de plată").waitFor({ timeout: 15000 }); await settle(page);
  } },
  { slug: "plati-ioana", caption: "Abonament și plăți, Ioana (cealaltă sportivă).", user: "adult", money: "Ioana", run: async({ page }) => {
    await page.goto(`/${ids.Ioana}/plati`); await heading(page, "Abonament și plăți"); await page.getByText("Rămas de plată").waitFor({ timeout: 15000 }); await settle(page);
  } },
  { slug: "plati-zile", caption: "Abonament: foaia cu zilele (Vezi zilele).", user: "parent", run: async({ page }) => {
    await page.goto(`/${ids.Ana}/plati`); await heading(page, "Abonament și plăți");
    await page.getByRole("button", { name: /Vezi zilele/ }).click();
    await page.getByRole("dialog").waitFor({ timeout: 15000 }); await settle(page);
  } },

  // ---- Setări
  { slug: "setari", caption: "Setări: contul, sportivii, securitate, notificări.", user: "parent", run: async({ page }) => {
    await page.goto("/setari"); await heading(page, "Setări"); await settle(page);
  } },
  { slug: "date-sportiv", caption: "Date sportiv: citire, fără editare.", user: "parent", run: async({ page }) => {
    await page.goto(`/setari/sportiv/${ids.Ana}`); await heading(page, "Date sportiv"); await settle(page);
  } },
  { slug: "dispozitive", caption: "Dispozitive conectate.", user: "parent", run: async({ page }) => {
    await page.goto("/setari/dispozitive"); await visible(page.getByText(/dispozitiv/i)).waitFor({ timeout: 15000 }); await settle(page);
  } },
];

const browser = await chromium.launch();
const contexts = {};
const meta = [];
let failed = false;
let current = null;

async function sessionFor(vp, user) {
  const key = `${vp}:${user}`;
  if (!contexts[key]) {
    const c = await newContext(browser, vp);
    await login(c.page, user === "adult" ? ADULT : PARENT);
    contexts[key] = c;
  }
  return contexts[key];
}

try {
  {
    const c = await sessionFor("desktop", "parent");
    Object.assign(ids, await athletesOf(c.page));
    ids.Ana = ids["Ana Ionescu"];
    const a = await sessionFor("desktop", "adult");
    ids.Ioana = (await athletesOf(a.page))["Ioana Marin"];
    if (!ids.Ana || !ids.Ioana) throw new Error("the fixture athletes Ana Ionescu and Ioana Marin are missing");
  }
  let n = 0;
  for (const step of steps) {
    n += 1;
    const nn = pad(n);
    current = { nn, slug: step.slug, taken: {} };
    const entry = { nn, slug: step.slug, caption: step.caption, files: {}, errors: [] };
    for (const vp of ["phone", "desktop"]) {
      const file = `${nn}-${step.slug}-${WIDTH[vp]}.png`;
      let c;
      try {
        c = step.anon ? await newContext(browser, vp) : await sessionFor(vp, step.user);
        const problems = [];
        const onError = (e) => problems.push(`pageerror: ${e.message}`);
        const onResponse = (r) => { if (r.status() >= 500) problems.push(`${r.status()} ${r.request().method()} ${r.url().replace(BASE, "")}`); };
        c.page.on("pageerror", onError);
        c.page.on("response", onResponse);
        const money = step.money ? c.page.waitForResponse((r) => r.url().includes(`/${ids[step.money]}/money`), { timeout: 20000 }) : null;
        try {
          await step.run({ page: c.page, vp });
          if (money) {
            const left = (await (await money).json()).data.left;
            const shown = await c.page.getByText("Rămas de plată").first().locator("xpath=..").innerText();
            if (!shown.includes(ron(left))) problems.push(`Rămas de plată shows "${shown.replace(/\s+/g, " ")}", the money response says left ${left} (${ron(left)})`);
          }
        } finally {
          c.page.off("pageerror", onError);
          c.page.off("response", onResponse);
        }
        if (!current.taken[vp]) await c.page.screenshot({ path: join(OUT, file), fullPage: true });
        entry.files[vp] = file;
        if (problems.length) { entry.errors.push(`${vp}: ${problems.join("; ")}`); failed = true; }
        console.log(`${problems.length ? "FAIL" : "ok  "} ${file}${problems.length ? `: ${problems.join("; ")}` : ""}`);
      } catch (e) {
        failed = true;
        const msg = String(e.message).split("\n")[0];
        try { await c?.page.screenshot({ path: join(OUT, file), fullPage: true }); entry.files[vp] = file; } catch { /* no page */ }
        entry.errors.push(`${vp}: ${msg}`);
        console.log(`FAIL ${file}: ${msg}`);
      } finally {
        if (step.anon) await c?.context.close().catch(() => {});
      }
    }
    meta.push(entry);
  }
} finally {
  writeFileSync(join(OUT, "steps.json"), JSON.stringify(meta, null, 2));
  await browser.close();
}

const light = readFileSync(join(HERE, "../../docs/portal/mockups/companion-light.html"), "utf8");
const body = meta.map((s) => `
<section id="s${s.nn}">
  <h2><span class="n">${Number(s.nn)}</span> ${esc(s.caption)}</h2>
  <div class="pair">
    ${s.files.phone ? `<figure class="phone"><img src="${s.files.phone}" alt="${esc(s.caption)}, telefon" loading="lazy"><figcaption>telefon 390</figcaption></figure>` : ""}
    ${s.files.desktop ? `<figure class="desktop"><img src="${s.files.desktop}" alt="${esc(s.caption)}, desktop" loading="lazy"><figcaption>desktop 1280</figcaption></figure>` : ""}
  </div>
  ${s.errors.length ? `<p class="note">${esc(s.errors.join(" | "))}</p>` : ""}
</section>`).join("\n");
writeFileSync(join(OUT, "index.html"), `<!doctype html>
<html lang="ro"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Faza 7, aplicația sportivului: parcurgere</title>
${light}
<style>
body{font-family:system-ui,sans-serif;margin:0;padding:24px;background:#f5f5f7;color:#1d1d1f}
h1{font-size:22px;margin:0 0 8px} h2{font-size:16px;margin:0 0 12px} .n{display:inline-block;min-width:28px;padding:2px 6px;background:#1d1d1f;color:#fff;text-align:center;margin-right:6px}
section{background:#fff;border:1px solid #d1d1d6;padding:16px;margin:0 0 20px}
.pair{display:flex;gap:16px;align-items:flex-start;flex-wrap:wrap}
figure{margin:0} img{display:block;border:1px solid #d1d1d6;max-width:100%;height:auto}
.phone img{width:390px} .desktop img{width:760px} figcaption{font-size:12px;color:#86868b;margin-top:4px}
.note{font-size:13px;color:#8a6d00;margin:10px 0 0}
</style></head><body>
<h1>Aplicația sportivului, faza 7: parcurgere pe serverul real</h1>
<p>Imagini în mod luminos, pe un Strapi și un Postgres de unică folosință, cu date inventate. Pentru compararea cu planșele, cu ochiul liber.</p>
${body}
</body></html>`);
console.log(failed ? "SOME FAILED" : "ALL OK");
process.exit(failed ? 1 : 0);
