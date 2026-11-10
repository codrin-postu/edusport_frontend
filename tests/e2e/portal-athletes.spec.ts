import { expect, test } from "@playwright/test";
import { COACH_BASE, TODAY, loginAs, mockLog, mockReset, mockState, shot } from "./portal-helpers";

test.use({ baseURL: COACH_BASE, viewport: { width: 390, height: 844 } });
test.beforeEach(async() => { await mockReset(); });

const searchCalls = async() => (await mockLog()).filter((c) => c.path.includes("/athletes/search"));

test("the search waits for three letters, picks two athletes and adds them from today", async({ page }) => {
  await loginAs(page);
  await page.goto("/grupe/gavansati/adauga");
  await expect(page.getByRole("heading", { name: "Adaugă în Avansați" })).toBeVisible();
  await page.getByLabel("Caută după nume").fill("An");
  await page.waitForTimeout(500);
  expect(await searchCalls()).toHaveLength(0);
  await page.getByLabel("Caută după nume").fill("Ana");
  await expect(page.getByRole("button", { name: "Ana Bălan, 9 ani" })).toBeVisible();
  await page.getByRole("button", { name: "Ana Bălan, 9 ani" }).click();
  await page.getByRole("button", { name: /Diana Ilie/ }).click();
  await expect(page.getByRole("button", { name: "Adaugă 2 sportivi" })).toBeVisible();
  await page.getByRole("button", { name: "Adaugă 2 sportivi" }).click();
  await expect(page).toHaveURL(/\/grupe\/gavansati$/);
  const post = (await mockLog()).find((c) => c.method === "POST" && c.path.endsWith("/groups/gavansati/members"));
  const body = post?.body as { athleteIds: string[]; from: string };
  expect(body.athleteIds).toHaveLength(2);
  expect(body.from).toBe(TODAY);
  await expect(page.getByText("Sportivi (11)")).toBeVisible();
  await expect(page.getByText("Ana Bălan")).toBeVisible();
});

test("a new athlete needs only a name", async({ page }) => {
  await loginAs(page);
  await page.goto("/grupe/gavansati/adauga");
  await page.getByRole("link", { name: /Nu e în listă: sportiv nou/ }).click();
  await expect(page.getByRole("heading", { name: "Sportiv nou" })).toBeVisible();
  const submit = page.getByRole("button", { name: "Adaugă în Avansați" });
  await expect(submit).toBeDisabled();
  await page.getByLabel("Nume și prenume").fill("Zoe Pavel");
  await submit.click();
  await expect(page).toHaveURL(/\/grupe\/gavansati$/);
  await expect(page.getByText("Salvat.")).toBeVisible();
  const post = (await mockLog()).find((c) => c.method === "POST" && c.path.endsWith("/coach/athletes"));
  expect(post?.body).toEqual({ groupId: "gavansati", name: "Zoe Pavel" });
});

test("a double tap on Adaugă creates one athlete only", async({ page }) => {
  await loginAs(page);
  await page.goto("/grupe/gavansati/sportiv-nou");
  await page.getByLabel("Nume și prenume").fill("Zoe Pavel");
  const submit = page.getByRole("button", { name: "Adaugă în Avansați" });
  await submit.dblclick();
  await expect(page).toHaveURL(/\/grupe\/gavansati$/);
  const posts = (await mockLog()).filter((c) => c.method === "POST" && c.path.endsWith("/coach/athletes"));
  expect(posts).toHaveLength(1);
});

test("a coach adds a new athlete to another coach's group", async({ page }) => {
  await loginAs(page);
  await page.goto("/grupe/gsilver/sportiv-nou");
  await page.getByLabel("Nume și prenume").fill("Zoe Pavel");
  await page.getByRole("button", { name: "Adaugă în Intermediari Silver" }).click();
  await expect(page).toHaveURL(/\/grupe\/gsilver$/);
  const post = (await mockLog()).find((c) => c.method === "POST" && c.path.endsWith("/coach/athletes"));
  expect(post?.body).toEqual({ groupId: "gsilver", name: "Zoe Pavel" });
});

const SIZES = [{ width: 390, height: 844 }, { width: 1280, height: 900 }];

for (const size of SIZES) {
  test.describe(`Sportiv ${size.width}`, () => {
    test.use({ viewport: size, timezoneId: "Europe/Bucharest" });

    test("an own child: contact, presence, competitions, groups and school", async({ page, context }, info) => {
      await context.grantPermissions(["clipboard-read", "clipboard-write"]);
      await loginAs(page);
      await page.goto("/sportiv/amaria?grupa=gavansati");
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("h1")).toHaveText("Maria Ionescu");
      await expect(page.getByRole("link", { name: "‹ Avansați" })).toHaveAttribute("href", "/grupe/gavansati");
      await expect(page.getByText("11 ani, Școala de patinaj")).toBeVisible();
      await expect(page.getByRole("heading", { name: "Contact" })).toBeVisible();
      await expect(page.getByText("Părinte", { exact: true })).toBeVisible();
      await expect(page.getByText("Părinte Exemplu")).toBeVisible();
      await expect(page.getByText("0722 000 222")).toBeVisible();
      await page.getByRole("button", { name: "Copiază numărul" }).click();
      await expect(page.getByText("Numărul a fost copiat.")).toBeVisible();
      expect(await page.evaluate(() => navigator.clipboard.readText())).toBe("0722 000 222");
      await expect(page.getByRole("link", { name: "Sună" })).toHaveAttribute("href", "tel:+40722000222");
      const wa = page.getByRole("link", { name: "WhatsApp" });
      await expect(wa).toHaveAttribute("href", "https://wa.me/40722000222");
      await expect(wa).toHaveAttribute("target", "_blank");
      await expect(wa).toHaveAttribute("rel", /noopener/);
      const kv = (key: string) => page.getByText(key, { exact: true }).locator("xpath=..");
      await expect(page.getByRole("heading", { name: "Prezențe" })).toBeVisible();
      await expect(page.locator("main").getByRole("link", { name: /Istoric/ })).toHaveCount(0);
      await expect(kv("În sezon")).toContainText("26 de prezențe");
      await expect(kv("Lecții individuale")).toContainText("4 în sezon");
      await expect(kv("Ultima")).toContainText("Marți, 3 noi");
      await expect(kv("Lipsă luna asta")).toContainText("1");
      await expect(page.getByRole("heading", { name: "Concursuri" })).toBeVisible();
      await expect(page.getByRole("link", { name: "Toate ›" })).toHaveAttribute("href", "/concursuri");
      await expect(page.getByText("Categoria 2026-2027")).toBeVisible();
      await expect(page.getByText("Advanced Novice Girls")).toBeVisible();
      await expect(page.locator("[data-date-block]")).toHaveCount(3);
      await expect(page.getByText("Loc", { exact: true })).toHaveCount(3);
      await expect(page.getByText("Cupa României")).toBeVisible();
      await expect(page.getByText("26 oct 2026, Brașov")).toBeVisible();
      const groupRow = page.locator("main a[href='/grupe/gavansati']");
      await expect(groupRow).toContainText("Ma, Mi 18:15");
      await expect(page.getByRole("heading", { name: "Școala" })).toBeVisible();
      await expect(kv("Abonament")).toContainText("A-0124, Ședința 5/8");
      await expect(kv("Valabil până la")).toContainText("30 noi");
      await expect(kv("Locație")).toContainText("AFI Cotroceni");
      const contact = (await page.getByRole("heading", { name: "Contact" }).boundingBox())!;
      const comps = (await page.getByRole("heading", { name: "Concursuri" }).boundingBox())!;
      if (size.width >= 900) expect(comps.x).toBeGreaterThan(contact.x);
      else expect(comps.y).toBeGreaterThan((await page.getByRole("heading", { name: "Prezențe" }).boundingBox())!.y);
      await shot(page, info, "sportiv");
    });

    test("without ?grupa the back link goes to Grupe", async({ page }) => {
      await loginAs(page);
      await page.goto("/sportiv/amaria");
      await expect(page.getByRole("link", { name: "‹ Grupe" })).toHaveAttribute("href", "/grupe");
    });

    test("a stand-in child has no contact data, no Școala section and no copy button", async({ page }) => {
      await loginAs(page);
      await page.goto("/sportiv/adara");
      await expect(page.getByRole("heading", { name: "Dara Constantin" })).toBeVisible();
      await expect(page.getByRole("heading", { name: "Prezențe" })).toBeVisible();
      await expect(page.getByRole("heading", { name: "Contact" })).toHaveCount(0);
      await expect(page.locator("a[href^='tel:']")).toHaveCount(0);
      await expect(page.locator("a[href*='wa.me']")).toHaveCount(0);
      await expect(page.getByRole("button", { name: "Copiază numărul" })).toHaveCount(0);
      await expect(page.getByRole("link", { name: "Sună" })).toHaveCount(0);
      await expect(page.getByRole("heading", { name: "Școala" })).toHaveCount(0);
    });

    test("competitions unavailable: the line shows and the rest renders", async({ page }) => {
      await mockState({ competitionsDown: true });
      await loginAs(page);
      await page.goto("/sportiv/amaria");
      await expect(page.getByText("Rezultatele nu sunt disponibile acum.")).toBeVisible();
      await expect(page.getByRole("heading", { name: "Contact" })).toBeVisible();
      await expect(page.getByRole("heading", { name: "Școala" })).toBeVisible();
    });

    test("a refused clipboard write shows a short failure", async({ page }) => {
      await loginAs(page);
      await page.goto("/sportiv/amaria");
      await page.evaluate(() => { navigator.clipboard.writeText = () => Promise.reject(new Error("denied")); });
      await page.getByRole("button", { name: "Copiază numărul" }).click();
      await expect(page.getByText("Nu am putut copia numărul.")).toBeVisible();
    });
  });
}
