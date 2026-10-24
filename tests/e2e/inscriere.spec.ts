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
const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

async function saveDraft(page: Page, step: number, answers: Record<string, string | boolean>, submissionKey?: string) {
  const draft = JSON.stringify({ step, savedAt: Date.now(), answers, submissionKey });
  await page.evaluate(([key, value]) => localStorage.setItem(key, value), [DRAFT_KEY, draft]);
}

const DRAFT_SUBMISSION_KEY = "0b6f3c1e-2a4d-4c8e-9f10-123456789abc";

async function savedSubmissionKey(page: Page): Promise<string | undefined> {
  return page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? "{}").submissionKey, DRAFT_KEY);
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
  await expect(page.locator(":focus")).toContainText("Pasul 2 din 3");
  await expect(page.getByText("Programul pe următoarea lună")).toBeVisible();
  await expect(page.getByText("Curs", { exact: true }).first()).toBeVisible();
  await expect(page.locator("#subscriptionChoice")).toHaveText("Alegeți mai întâi opțiunea de membru...");

  await choose(page, "membershipAnswer", "Nu, optez pentru tarife neafiliați");
  await expect(page.getByText("Pentru Neafiliați")).toBeVisible();
  await expect(page.getByText("180 RON")).toBeVisible();
  await expect(page.getByText(
    "Economisești 120 RON la fiecare abonament de 8 ședințe. Taxa de membru (270 RON pe sezon) se recuperează de la al treilea abonament. Doar membrii au acces la Avansați Gold.",
  )).toBeVisible();
  await expect(page.locator("s")).toHaveText(["890 RON", "790 RON"]);
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
  expect(body.submissionKey).toMatch(UUID_V4);

  // Success screen.
  await expect(page.getByRole("heading", { name: "Înscriere trimisă!" })).toBeFocused();
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

  // A new registration gets a new key.
  await page.getByRole("button", { name: "Fă o altă înscriere" }).click();
  await page.locator("#email").fill("ion.pop@example.com");
  await expect.poll(() => savedSubmissionKey(page)).toMatch(UUID_V4);
  expect(await savedSubmissionKey(page)).not.toBe(body.submissionKey);
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

test("Alege școala moves with the arrow keys", async({ page }) => {
  await page.goto("/inscrieri");
  const afi = page.getByRole("radio", { name: "Școala de Patinaj - AFI Cotroceni" });
  const two = page.getByRole("radio", { name: "Școala de Patinaj - Patinoar 2" });
  await expect(afi).toHaveAttribute("tabindex", "0");
  await expect(two).toHaveAttribute("tabindex", "-1");
  await afi.focus();
  const moves = [["ArrowDown", two, afi], ["ArrowRight", afi, two], ["ArrowUp", two, afi], ["ArrowLeft", afi, two]] as const;
  for (const [key, target, other] of moves) {
    await page.keyboard.press(key);
    await expect(target).toBeFocused();
    await expect(target).toHaveAttribute("aria-checked", "true");
    await expect(target).toHaveAttribute("tabindex", "0");
    await expect(other).toHaveAttribute("aria-checked", "false");
    await expect(other).toHaveAttribute("tabindex", "-1");
  }
});

test("a refused submit is announced; a retry sends the draft's key again, a changed answer a new one", async({ page }) => {
  const sentKeys: string[] = [];
  await page.route("**/api/forms/inscriere?*", (route) => {
    if (route.request().method() !== "POST") return route.fallback();
    sentKeys.push(route.request().postDataJSON().submissionKey);
    return route.fulfill({
      status: 400,
      headers: { "access-control-allow-origin": "*" },
      contentType: "application/json",
      body: JSON.stringify({ ok: false, code: "invalid", error: "Abonamentul ales nu este disponibil." }),
    });
  });
  await page.goto("/inscrieri?scoala=afi-cotroceni");
  await saveDraft(page, 2, {
    email: "ana.pop@example.com", parentName: "Ana Pop", relationship: "parinte", phone: "0712345678",
    childName: "Maria Pop", childBirthDate: "14.03.2016", childHeight: "132", shirtSize: "S",
    lastSeason: "Nu a participat", priorExperience: "Nu este cazul", expectations: "Să patineze",
    membershipAnswer: "nu", subscriptionChoice: "Abonament 8 ședințe grup",
    source: "Facebook", gdprConsent: true, regulationsConsent: true,
  }, DRAFT_SUBMISSION_KEY);
  await page.reload();
  const submit = page.getByRole("button", { name: "Trimite înscrierea" });
  await submit.click();
  await expect(page.getByRole("alert").filter({ hasText: "Abonamentul ales nu este disponibil." })).toBeVisible();
  await submit.click();
  await expect.poll(() => sentKeys.length).toBe(2);
  expect(sentKeys).toEqual([DRAFT_SUBMISSION_KEY, DRAFT_SUBMISSION_KEY]);

  await choose(page, "source", "Instagram");
  await submit.click();
  await expect.poll(() => sentKeys.length).toBe(3);
  expect(sentKeys[2]).toMatch(UUID_V4);
  expect(sentKeys[2]).not.toBe(DRAFT_SUBMISSION_KEY);
  expect(await savedSubmissionKey(page)).toBe(sentKeys[2]);
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
