import { test, expect, type Page } from "@playwright/test";

// The 3-step registration form against tests/e2e/mock-strapi.mjs:
// two schools (the flow registers at AFI Cotroceni: Standard + Avansați Gold
// lists), fee 270, every weekend a Curs.

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

const DRAFT_KEY = "edusport.inscrieri.draft.v2";

async function saveDraft(page: Page, step: number, answers: Record<string, string | boolean>) {
  await page.evaluate(([key, value]) => localStorage.setItem(key, value), [DRAFT_KEY, JSON.stringify({ step, savedAt: Date.now(), answers })]);
}

/** Waits past hydration and any smooth scroll, then reads the scroll position. */
async function settledScrollY(page: Page): Promise<number> {
  await page.waitForLoadState("load");
  await page.waitForTimeout(1500);
  return page.evaluate(() => window.scrollY);
}

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
  await page.goto("/inscrieri?scoala=afi-cotroceni");
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

test("a fresh load and a restored draft leave the page at the top", async({ page }) => {
  await page.goto("/inscrieri?scoala=afi-cotroceni");
  await expect(page.getByText("Pasul 1 din 3")).toBeVisible();
  expect(await settledScrollY(page)).toBe(0);

  await saveDraft(page, 1, { email: "a@b.ro" });
  await page.reload();
  await expect(page.getByText("Pasul 2 din 3")).toBeVisible();
  expect(await settledScrollY(page)).toBe(0);
});

test("Schimbă opens Alege școala even when the link named a school", async({ page }) => {
  await page.goto("/inscrieri?scoala=afi-cotroceni");
  await expect(page.getByText("Școala de Patinaj - AFI Cotroceni")).toBeVisible();
  await page.getByRole("button", { name: "Schimbă" }).click();
  await expect(page.getByRole("heading", { name: "Alege școala" })).toBeVisible();
  await expect(page.getByText("Școala nu a fost găsită.")).toHaveCount(0);
  await page.getByRole("radio", { name: "Școala de Patinaj - Patinoar 2" }).click();
  await continueButton(page).click();
  await expect(page.getByText("Pasul 1 din 3")).toBeVisible();
  await expect(page.getByText("Școala de Patinaj - Patinoar 2")).toBeVisible();
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
