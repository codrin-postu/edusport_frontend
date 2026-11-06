// Click-through renders of the coach app (phase 6, task 20).
//
//   node scripts/portal/clickthrough.mjs <real base> <out dir> --ids <ids.json> --gold-event <eventId> [--mock <mock base> --mock-api <mock portal url>] [--only 07,08]
//
// The real base is the Next build pointed at a throwaway Strapi (host antrenor.localhost:<port>); the mock base is the
// same build pointed at tests/e2e/mock-portal.mjs, used only for the screens the throwaway fixture cannot reach
// (archived session, reactivate dialog, Google only account, empty day). Synthetic data only.
import { chromium } from "@playwright/test";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const args = process.argv.slice(2);
const flag = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : null; };
const REAL = args[0];
const OUT = args[1];
const MOCK = flag("--mock");
const MOCK_API = flag("--mock-api");
const IDS = flag("--ids");
const GOLD_EVENT = flag("--gold-event");
const ONLY = flag("--only")?.split(",") ?? null;
if (!REAL || !OUT || !IDS) { console.error("usage: clickthrough.mjs <real base> <out dir> --ids ids.json [--gold-event id] [--mock <base> --mock-api <url>]"); process.exit(2); }
mkdirSync(OUT, { recursive: true });

const COACH = { email: "antrenor1@example.invalid", password: "Throwaway-Coach-1" };
const VIEWPORTS = { phone: { width: 390, height: 844 }, desktop: { width: 1280, height: 900 } };
const MOCK_TODAY = "2026-11-05";
const ids = JSON.parse(readFileSync(IDS, "utf8"));
const G = { prof: ids.groups["Profesioniști"], gold: ids.groups["Avansați Gold"], silver: ids.groups["Intermediari Silver"] };

let octet = 10;
const nextIp = () => `10.${(octet += 1)}.${Math.floor(Math.random() * 250) + 1}.${Math.floor(Math.random() * 250) + 1}`;
const pad = (n) => String(n).padStart(2, "0");
const TODAY_DAY = new Date().getDate();
const tick = (page, label) => page.getByLabel(label).evaluate((el) => el.click());
const DAY_BUTTON = /^(LU|MA|MI|JO|VI|SÂ|DU) \d+ [A-ZĂÂÎȘȚ]{3}/;

/** Waits for the spinner to go and the network to calm down. */
async function settle(page, ms = 350) {
  await page.waitForLoadState("networkidle").catch(() => {});
  await page.waitForFunction(() => !document.querySelector(".animate-spin"), null, { timeout: 8000 }).catch(() => {});
  await page.waitForTimeout(ms);
}

const log = (...m) => console.log(...m);

async function newContext(browser, vp, base, { frozen } = {}) {
  const context = await browser.newContext({
    viewport: VIEWPORTS[vp], locale: "ro-RO", colorScheme: "light", reducedMotion: "reduce", baseURL: base,
    extraHTTPHeaders: { "x-real-ip": nextIp() },
  });
  const page = await context.newPage();
  if (frozen) await page.clock.setFixedTime(new Date(`${frozen}T12:00:00Z`));
  return { context, page };
}

async function login(page, base, who = COACH) {
  await page.goto(`${base}/robots.txt`);
  const status = await page.evaluate(async(b) => (await fetch("/api/portal/auth/login", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(b) })).status, who);
  if (status !== 200) throw new Error(`login ${who.email} answered ${status}`);
}

async function googleOnlySession(context, base) {
  const raw = new URL(base);
  const rawBase = `http://localhost:${raw.port}`;
  const host = { host: raw.host };
  const cookiesOf = (res) => res.headersArray().filter((h) => h.name.toLowerCase() === "set-cookie").map((h) => h.value.split(";")[0]);
  const request = context.request;
  const start = await request.get(`${rawBase}/api/portal/google/start`, { headers: host, maxRedirects: 0 });
  const state = new URL(start.headers().location).searchParams.get("state") ?? "";
  const jar = cookiesOf(start).join("; ");
  const cb = await request.get(`${rawBase}/api/portal/google/callback?code=ok:antrenor3@example.invalid&state=${state}`, { headers: { ...host, cookie: jar }, maxRedirects: 0 });
  const session = cookiesOf(cb).map((c) => ({ name: c.slice(0, c.indexOf("=")), value: c.slice(c.indexOf("=") + 1) })).filter((c) => c.value !== "");
  await context.addCookies(session.map((c) => ({ ...c, url: base })));
}

/** shared across steps and viewports (ids created by an earlier step) */
const shared = {};
const mockPost = (path, body) => fetch(`${MOCK_API}${path}`, { method: "POST", body: JSON.stringify(body ?? {}) });
const pathOf = (url) => url.replace(/^https?:\/\/[^/]+/, "");

const steps = [
  // ---- signed out
  { slug: "login", caption: "Intrare: e-mail, parolă și Google.", anon: true, run: async({ page, shot }) => {
    await page.goto("/intrare"); await settle(page); await shot();
  } },
  { slug: "login-eroare", caption: "Parolă greșită: mesajul de la server și parola golită.", anon: true, run: async({ page, shot }) => {
    await page.goto("/intrare");
    await page.getByLabel("E-mail").fill(COACH.email);
    await page.getByLabel("Parolă", { exact: true }).fill("parola-gresita-1");
    await page.getByRole("button", { name: "Intră" }).click();
    await page.getByRole("main").getByRole("alert").waitFor(); await settle(page); await shot();
  } },
  { slug: "reset-1", caption: "Resetare parolă, pasul 1: adresa de e-mail.", anon: true, run: async({ page, shot }) => {
    await page.goto("/am-uitat-parola"); await settle(page); await shot();
  } },
  { slug: "reset-2", caption: "Resetare parolă, pasul 2: codul din e-mail și parola nouă.", anon: true, mock: true, note: "Imagine din serverul fals (mock): pe serverul real fără cheie de e-mail cererea răspunde 503 \"Nu am putut trimite e-mailul.\", deci pasul 2 nu se deschide.", run: async({ page, shot }) => {
    await page.goto("/am-uitat-parola");
    await page.getByLabel("E-mail").fill(COACH.email);
    await page.getByRole("button", { name: "Trimite codul" }).click();
    await page.getByLabel("Cod din e-mail").waitFor({ timeout: 10000 }).catch(() => {}); await settle(page); await shot();
  } },
  { slug: "reset-eroare", caption: "Resetare fără e-mail configurat: serverul răspunde că nu a putut trimite codul.", anon: true, run: async({ page, shot }) => {
    await page.goto("/am-uitat-parola"); await page.getByLabel("E-mail").fill(COACH.email);
    await page.getByRole("button", { name: "Trimite codul" }).click(); await page.getByRole("alert").waitFor({ timeout: 10000 }).catch(() => {}); await settle(page); await shot();
  } },
  { slug: "invitatie", caption: "Invitație valabilă: contul se activează cu o parolă nouă.", anon: true, run: async({ page, shot }) => {
    await page.goto(`/invitatie/${ids.invite2}`); await settle(page); await shot();
  } },
  { slug: "invitatie-expirata", caption: "Invitație expirată sau necunoscută.", anon: true, run: async({ page, shot }) => {
    await page.goto("/invitatie/invitatie-necunoscuta-000000000000000"); await settle(page); await shot();
  } },

  // ---- Azi, Grupe
  { slug: "azi", caption: "Azi: ședința de astăzi, încă nesalvată.", run: async({ page, shot }) => {
    await page.goto("/"); await page.getByRole("heading", { name: /^Bună,/ }).waitFor(); await settle(page); await shot();
  } },
  { slug: "azi-gol", caption: "Azi fără nicio ședință (zi liberă).", mock: true, note: "Imagine din serverul fals (mock): fixtura reală nu are o zi liberă.", run: async({ page, shot }) => {
    await mockPost("/__mock/state", { emptyToday: true });
    await page.goto("/"); await page.getByText("Nicio ședință azi.").waitFor(); await settle(page); await shot();
    await mockPost("/__mock/state", { emptyToday: false });
  } },
  { slug: "grupe", caption: "Grupele mele; celelalte grupe sunt strânse.", run: async({ page, shot }) => {
    await page.goto("/grupe"); await page.getByRole("heading", { name: "Grupele mele" }).waitFor(); await settle(page); await shot();
  } },
  { slug: "grupe-deschise", caption: "Grupele mele, cu celelalte grupe deschise.", run: async({ page, shot }) => {
    await page.goto("/grupe"); await page.getByRole("button", { name: "Alte grupe" }).click(); await settle(page); await shot();
  } },
  { slug: "grupa-sportivi", caption: "Grupa mea: tabul Sportivi, cu sportivii noi și cei din alte grupe.", run: async({ page, shot }) => {
    await page.goto(`/grupe/${G.prof}`); await page.getByText(/^Sportivi \(/).waitFor(); await settle(page); await shot();
  } },
  { slug: "grupa-program", caption: "Grupa mea: tabul Program, în listă.", run: async({ page, shot }) => {
    await page.goto(`/grupe/${G.prof}?tab=program`); await settle(page); await shot();
  } },
  { slug: "grupa-program-luna", caption: "Programul pe lună.", run: async({ page, shot }) => {
    await page.goto(`/grupe/${G.prof}?tab=program`); await page.getByRole("button", { name: "Lună", exact: true }).click(); await settle(page); await shot();
  } },
  { slug: "program-adauga", caption: "Adaugă program: zilele, ora, durata și data de început.", run: async({ page, shot }) => {
    await page.goto(`/grupe/${G.prof}?tab=program`); await page.getByRole("button", { name: "+ Adaugă program" }).click();
    await page.getByRole("dialog").waitFor(); await settle(page); await shot({ fullPage: false });
  } },
  { slug: "program-data", caption: "Foaia unei date: anulează sau mută ședința.", run: async({ page, shot }) => {
    await page.goto(`/grupe/${G.prof}?tab=program`); await settle(page);
    await page.getByRole("button", { name: "Anulează" }).first().click();
    await page.getByRole("dialog").waitFor(); await settle(page); await shot({ fullPage: false });
  } },
  { slug: "grupa-alt-antrenor", caption: "Grupa altui antrenor: fără lista de sportivi, cu \"Înlocuiesc azi\".", run: async({ page, shot }) => {
    await page.goto(`/grupe/${G.gold}`); await page.getByText("Grupa altui antrenor").waitFor(); await settle(page); await shot();
  } },
  { slug: "inlocuitor-foaie", caption: "Fă prezența ca înlocuitor: ședințele recente ale grupei.", run: async({ page, shot }) => {
    await page.goto(`/grupe/${G.silver}`); await page.getByRole("button", { name: "Fă prezența ca înlocuitor" }).click();
    await page.getByRole("dialog").waitFor(); await settle(page); await shot({ fullPage: false });
  } },

  // ---- presence
  { slug: "prezenta", caption: "Prezența la grupa mea: bifele, numărătoarea și antrenorii.", run: async({ page, shot }) => {
    await page.goto(`/grupe/${G.prof}`); await page.getByText(/^Sportivi \(/).waitFor();
    await page.getByRole("link", { name: "Fă prezența" }).click(); await page.getByText(/prezenți/).waitFor(); await settle(page);
    await tick(page, "Filip Radu, Grup"); await tick(page, "Ioana Marin, Grup"); await tick(page, "Ioana Marin, Uscat"); await tick(page, "Teodora Anghel, Grup"); await page.waitForTimeout(400);
    await shot();
  } },
  { slug: "prezenta-scoala", caption: "Prezența la o grupă a Școlii (ca înlocuitor): fără coloana Uscat, cu abonamentul sub nume.", run: async({ page, shot }) => {
    await page.goto(`/grupe/${G.gold}`); await page.getByRole("link", { name: "Înlocuiesc azi" }).click();
    await page.getByText(/Vei apărea ca antrenor/).waitFor({ timeout: 10000 }).catch(() => {}); await settle(page); await shot();
  } },
  { slug: "prezenta-salvata", caption: "Prezența salvată: pagina se redeschide cu \"Salvată de\".", run: async({ page, shot, first }) => {
    if (first) {
      await page.goto(`/grupe/${G.prof}`); await page.getByRole("link", { name: "Fă prezența" }).click(); await page.getByText(/prezenți/).waitFor(); await settle(page);
      await tick(page, "Filip Radu, Grup"); await tick(page, "Ioana Marin, Grup"); await tick(page, "Ioana Marin, Uscat"); await tick(page, "Teodora Anghel, Grup");
      await page.getByRole("button", { name: "Salvează", exact: true }).click();
      await page.waitForURL(/prezenta\?id=/, { timeout: 15000 }); shared.sessionUrl = pathOf(page.url());
      await settle(page, 250);
    } else {
      await page.goto(shared.sessionUrl); await settle(page);
    }
    await shot();
  } },
  { slug: "prezenta-inlocuitor", caption: "Prezența ca înlocuitor, salvată (antrenorul apare pe ședință).", run: async({ page, shot, first }) => {
    if (first) {
      await page.goto(`/grupe/${G.gold}`); await page.getByRole("link", { name: "Înlocuiesc azi" }).click();
      await page.getByText(/prezenți/).waitFor(); await settle(page);
      const boxes = page.locator("input[type=\"checkbox\"]");
      if (await boxes.count() > 0) await boxes.first().evaluate((el) => el.click());
      await page.getByRole("button", { name: "Salvează", exact: true }).click();
      await page.waitForURL(/prezenta\?id=/, { timeout: 15000 }); shared.standInUrl = pathOf(page.url());
      await settle(page, 250);
    } else {
      await page.goto(shared.standInUrl); await settle(page);
    }
    await shot();
  } },
  { slug: "prezenta-arhivata", caption: "Ședință veche: arhivată, doar de citit.", mock: true, note: "Imagine din serverul fals (mock): fereastra de 7 zile nu lasă fixtura reală să creeze o ședință arhivată.", run: async({ page, shot }) => {
    await page.goto("/prezenta?id=s-archived"); await page.getByText("Arhivată. Nu mai poate fi modificată.").waitFor(); await settle(page); await shot();
  } },
  { slug: "prezenta-ziua", caption: "Alegerea zilei: zilele cu prezență salvată sunt marcate.", run: async({ page, shot }) => {
    await page.goto(shared.sessionUrl); await settle(page);
    await page.getByRole("button", { name: DAY_BUTTON }).first().click();
    await page.getByText("Alege ziua pentru care faci prezența.").waitFor(); await settle(page); await shot({ fullPage: false });
  } },
  { slug: "prezenta-existenta", caption: "Ziua are deja o ședință salvată: deschizi sau adaugi alta.", run: async({ page, shot }) => {
    await page.goto(shared.sessionUrl); await settle(page);
    await page.getByRole("button", { name: DAY_BUTTON }).first().click();
    await page.getByRole("button", { name: new RegExp(`, ${TODAY_DAY} [a-zăâîșț]+`) }).first().click();
    await page.getByRole("button", { name: /^Alege / }).click();
    await page.getByText("Există deja o ședință salvată").waitFor(); await settle(page); await shot({ fullPage: false });
  } },
  { slug: "prezenta-reactivare", caption: "Sportiv inactiv bifat: întrebarea de reactivare înainte de salvare.", mock: true, note: "Imagine din serverul fals (mock): fixtura reală nu are sportivi inactivi.", run: async({ page, shot }) => {
    await page.goto(`/prezenta?occurrence=${encodeURIComponent("occ:gavansati:2026-11-03")}`); await page.getByText(/prezenți/).waitFor(); await settle(page);
    await tick(page, "Robert Toma, Grup");
    await page.getByRole("button", { name: "Salvează", exact: true }).click();
    await page.getByText("Robert Toma are statusul Inactiv. Reactivezi sportivul?").waitFor(); await settle(page); await shot({ fullPage: false });
  } },

  // ---- lessons
  { slug: "lectie-noua", caption: "Lecție individuală nouă: sportivul, ora și durata.", run: async({ page, shot }) => {
    await page.goto("/lectie/noua"); await page.getByRole("heading", { name: "Lecție individuală" }).waitFor(); await settle(page);
    await page.getByLabel("Caută după nume").fill("Filip");
    await page.getByRole("button", { name: /Filip Radu/ }).first().click();
    await page.getByLabel("Ora").fill("15:30"); await settle(page); await shot();
  } },
  { slug: "lectie-durata", caption: "Durata lecției: ore și minute.", run: async({ page, shot }) => {
    await page.goto("/lectie/noua"); await settle(page);
    await page.getByRole("button", { name: /\bmin$/ }).first().click();
    await page.getByRole("dialog").waitFor(); await settle(page); await shot({ fullPage: false });
  } },
  { slug: "lectie-prezenta", caption: "Pagina lecției după salvare: prezența sportivului.", run: async({ page, shot, first }) => {
    if (first) {
      await page.goto("/lectie/noua"); await settle(page);
      await page.getByLabel("Caută după nume").fill("Filip");
      await page.getByRole("button", { name: /Filip Radu/ }).first().click();
      await page.getByLabel("Ora").fill("15:30");
      await page.getByRole("button", { name: "Salvează lecția" }).click();
      await page.waitForURL(/\/lectie\/(?!noua)/, { timeout: 15000 }); shared.lessonUrl = pathOf(page.url());
      await settle(page, 250);
    } else {
      await page.goto(shared.lessonUrl); await settle(page);
    }
    await shot();
  } },
  { slug: "lectie-sterge", caption: "Ștergerea lecției cere o confirmare.", run: async({ page, shot }) => {
    await page.goto(shared.lessonUrl); await settle(page);
    await page.getByRole("button", { name: "Șterge lecția" }).click();
    await page.getByRole("dialog").waitFor(); await settle(page); await shot({ fullPage: false });
  } },

  // ---- athletes
  { slug: "adauga-sportiv", caption: "Adaugă sportiv: căutarea după nume, cu rezultate bifate.", run: async({ page, shot }) => {
    await page.goto(`/grupe/${G.prof}/adauga`); await settle(page);
    await page.getByLabel("Caută după nume").fill("Ion");
    await page.getByRole("button", { name: /Ionescu/ }).first().waitFor({ timeout: 10000 });
    await page.getByRole("button", { name: /Ionescu/ }).first().click(); await settle(page); await shot();
  } },
  { slug: "sportiv-nou", caption: "Sportiv nou: nume, data nașterii și datele părintelui.", run: async({ page, shot }) => {
    await page.goto(`/grupe/${G.prof}/sportiv-nou`); await settle(page);
    await page.getByLabel("Nume și prenume").fill("Mara Dinu");
    await page.getByRole("spinbutton").first().click(); await page.keyboard.type("05052015");
    await page.getByLabel("Părinte").fill("Elena Dinu"); await page.getByLabel("Telefon").fill("0722000333"); await settle(page, 200); await shot();
  } },
  { slug: "sportiv-nou-salvat", caption: "Sportiv nou salvat: apare în lista grupei, marcat \"nou\".", run: async({ page, shot, first }) => {
    if (first) {
      await page.goto(`/grupe/${G.prof}/sportiv-nou`); await settle(page);
      await page.getByLabel("Nume și prenume").fill("Mara Dinu");
      await page.getByRole("spinbutton").first().click(); await page.keyboard.type("05052015");
      await page.getByRole("button", { name: /^Adaugă în / }).click();
      await page.waitForURL(new RegExp(`/grupe/${G.prof}$`), { timeout: 15000 });
    } else {
      await page.goto(`/grupe/${G.prof}`);
    }
    await page.getByText("Mara Dinu").waitFor({ timeout: 10000 }); await settle(page); await shot();
  } },
  { slug: "sportiv-fisa", caption: "Fișa sportivului din grupa mea: vârsta, grupele și contactul.", run: async({ page, shot }) => {
    await page.goto(`/grupe/${G.prof}`); await page.getByText(/^Sportivi \(/).waitFor(); await settle(page);
    await page.getByRole("link", { name: /Teodora Anghel/ }).first().click();
    await page.getByRole("heading", { name: "Teodora Anghel" }).waitFor(); await settle(page); await shot();
  } },

  // ---- history, profile
  { slug: "istoric", caption: "Istoric: luna curentă, cu totalurile și rândurile.", run: async({ page, shot }) => {
    await page.goto("/istoric"); await settle(page, 600); await shot();
  } },
  { slug: "profil", caption: "Profil: contul și legăturile spre setări.", run: async({ page, shot }) => {
    await page.goto("/profil"); await settle(page); await shot();
  } },
  { slug: "setari", caption: "Setări cont: telefonul și schimbarea parolei.", run: async({ page, shot }) => {
    await page.goto("/profil/setari"); await settle(page); await shot();
  } },
  { slug: "setari-google", caption: "Setări cont pentru un cont doar cu Google: \"Setează o parolă\".", google: true, mock: true, note: "Imagine din serverul fals (mock): fixtura reală nu are un cont doar cu Google.", run: async({ page, shot }) => {
    await page.goto("/profil/setari"); await page.getByRole("link", { name: "Setează o parolă" }).waitFor(); await settle(page); await shot();
  } },
  { slug: "securitate", caption: "Securitate: dispozitivele conectate.", run: async({ page, shot }) => {
    await page.goto("/profil/securitate"); await settle(page); await shot();
  } },

  // ---- errors
  { slug: "eroare-grupa", caption: "Eroare de încărcare: grupa nu există.", run: async({ page, shot }) => {
    await page.goto("/grupe/nu-exista"); await page.getByText("Nu am putut încărca datele.").waitFor(); await settle(page); await shot();
  } },
  { slug: "eroare-acces", caption: "Ședință din afara ferestrei de 7 zile: înapoi la Grupe, cu mesaj.", run: async({ page, shot }) => {
    await page.goto(`/prezenta?occurrence=${encodeURIComponent(`${GOLD_EVENT}|2026-10-24|18:00`)}`);
    await page.waitForTimeout(1500); await settle(page); await shot();
  } },
  { slug: "eroare-sesiune", caption: "Sesiune încheiată: orice pagină te duce la Intrare.", run: async({ page, context, shot }) => {
    await context.clearCookies(); await page.goto("/grupe"); await page.waitForURL(/\/intrare/, { timeout: 10000 }).catch(() => {}); await settle(page); await shot();
  } },
];

const browser = await chromium.launch();
const meta = [];
const contexts = {};

async function ctxFor(vp, kind) {
  const key = `${vp}:${kind}`;
  if (contexts[key]) return contexts[key];
  const base = kind === "real" ? REAL : MOCK;
  const c = await newContext(browser, vp, base, { frozen: kind === "real" ? null : MOCK_TODAY });
  await login(c.page, base);
  contexts[key] = c;
  return c;
}

try {
  let n = 0;
  for (const step of steps) {
    n += 1;
    const nn = pad(n);
    if (ONLY && !ONLY.includes(nn)) continue;
    const entry = { nn, slug: step.slug, caption: step.caption, note: step.note ?? null, mock: Boolean(step.mock), files: {}, errors: [] };
    if (step.mock && !MOCK) { entry.errors.push("skipped: no mock base"); meta.push(entry); continue; }
    if (step.mock) {
      await mockPost("/__mock/reset");
      for (const k of Object.keys(contexts)) if (k.endsWith(":mock")) { await contexts[k].context.close().catch(() => {}); delete contexts[k]; }
    }
    for (const vp of ["phone", "desktop"]) {
      let c;
      const file = `${nn}-${step.slug}-${vp}.png`;
      try {
        const base = step.mock ? MOCK : REAL;
        if (step.anon) c = await newContext(browser, vp, base);
        else if (step.google) {
          c = await newContext(browser, vp, base, { frozen: MOCK_TODAY });
          await googleOnlySession(c.context, base);
        } else c = await ctxFor(vp, step.mock ? "mock" : "real");
        let taken = false;
        const shot = async(opts = {}) => {
          // A tall page is shot at its full height by growing the viewport, so the fixed bottom bar sits at the true bottom.
          const full = opts.fullPage ?? true;
          const h = full ? await c.page.evaluate(() => document.documentElement.scrollHeight) : 0;
          if (full && h > VIEWPORTS[vp].height) { await c.page.setViewportSize({ width: VIEWPORTS[vp].width, height: Math.min(h, 4000) }); await c.page.waitForTimeout(250); }
          await c.page.screenshot({ path: join(OUT, file) });
          await c.page.setViewportSize(VIEWPORTS[vp]);
          taken = true;
        };
        const problems = [];
        const onError = (e) => problems.push(`pageerror: ${e.message}`);
        c.page.on("pageerror", onError);
        await step.run({ page: c.page, context: c.context, vp, shot, first: vp === "phone" });
        c.page.off("pageerror", onError);
        if (!taken) await shot();
        entry.files[vp] = file;
        if (problems.length) entry.errors.push(`${vp}: ${problems.join("; ")}`);
        log(`ok   ${file}`);
      } catch (e) {
        try { await c?.page.setViewportSize(VIEWPORTS[vp]); await c?.page.screenshot({ path: join(OUT, file), fullPage: true }); entry.files[vp] = file; } catch { /* no page */ }
        entry.errors.push(`${vp}: ${String(e.message).split("\n")[0]}`);
        log(`FAIL ${file}: ${String(e.message).split("\n")[0]}`);
      } finally {
        if (step.anon || step.google) await c?.context.close().catch(() => {});
      }
    }
    meta.push(entry);
  }
} finally {
  writeFileSync(join(OUT, "steps.json"), JSON.stringify(meta, null, 2));
  await browser.close();
}
