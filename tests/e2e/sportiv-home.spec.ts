import { expect, test } from "@playwright/test";
import { mockLog, mockReset, mockState } from "./portal-helpers";
import { ADULT_EMAIL, SPORTIV_BASE, loginSportiv } from "./sportiv-helpers";

const ANA = "athana0001";
const IOANA = "athadult01";
const SEEN = (id: string) => `/api/portal/sportiv/athletes/${id}/promotion/seen`;

test.use({ baseURL: SPORTIV_BASE, viewport: { width: 390, height: 844 } });
test.beforeEach(async() => { await mockReset(); });

const seenPosts = async(id: string) => (await mockLog()).filter((c) => c.method === "POST" && c.path === SEEN(id));

test("Acasă of a school athlete: presences, sessions and the abonament", async({ page }) => {
  await loginSportiv(page);
  await page.goto(`/${ANA}`);
  await expect(page.getByText("Bună, Ana").locator("visible=true")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Intermediari Bronze", level: 1 })).toBeVisible();
  await expect(page.getByText("Școala de patinaj, AFI Cotroceni, 9 ani").locator("visible=true")).toBeVisible();
  await expect(page.getByText("26", { exact: true })).toBeVisible();
  await expect(page.getByText("prezențe în sezon")).toBeVisible();
  for (const month of ["sep", "oct", "noi", "dec", "ian", "feb"]) await expect(page.getByText(month, { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Următoarele ședințe" })).toBeVisible();
  const rows = page.locator("details.group\\/session");
  await expect(rows).toHaveCount(3);
  await expect(rows.nth(0)).toContainText("17:30");
  await expect(rows.nth(0)).toContainText("AFI Cotroceni");
  await expect(rows.nth(0)).toContainText("Intermediari Bronze");
  await expect(rows.nth(1)).toContainText("Individual");
  await page.getByRole("link", { name: "Calendar ›" }).click();
  await expect(page).toHaveURL(`${SPORTIV_BASE}/${ANA}/calendar`);
  await page.goBack();
  await expect(page.getByText("Ședința 5/8")).toBeVisible();
  await expect(page.getByText("A-0124, valabil până la 30 noi")).toBeVisible();
  await expect(page.getByText("Ultimul concurs")).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Detalii ›" })).toHaveAttribute("href", `/${ANA}/plati`);
});

test("Acasă keeps a cancelled session", async({ page }) => {
  await mockState({ sessionNotices: true });
  await loginSportiv(page);
  await page.goto(`/${ANA}`);
  const rows = page.locator("details.group\\/session");
  await expect(rows).toHaveCount(2);
  await expect(rows.nth(0).locator("summary")).toContainText("Anulată");
  await expect(rows.nth(0).locator("summary")).toContainText("Vacanță");
  await expect(rows.nth(0).locator("summary s")).toHaveText("17:30");
  await expect(rows.nth(1).locator("summary")).toContainText("Mutată de pe Dum 8 noi, 17:30");
  await expect(rows.nth(1).locator("summary")).not.toContainText("Anulată");
  await expect(rows.nth(1).locator("summary s")).toHaveCount(0);
});

test("Acasă of a performance athlete shows the last competition", async({ page }) => {
  await loginSportiv(page, ADULT_EMAIL);
  await page.goto(`/${IOANA}`);
  await expect(page.getByRole("heading", { name: "Club Performanță", level: 1 })).toBeVisible();
  await expect(page.getByText("Advanced Novice Girls, Patinoar Nord, 13 ani").locator("visible=true")).toBeVisible();
  const card = page.locator("section").filter({ has: page.getByRole("heading", { name: "Ultimul concurs" }) });
  await expect(card.getByText("Locul")).toBeVisible();
  await expect(card.getByText("2", { exact: true })).toBeVisible();
  await expect(card.getByText("Cupa României 2026")).toBeVisible();
  await expect(card.getByText("Advanced Novice Girls, 2 din 18")).toBeVisible();
  await expect(card.getByText("98,42")).toBeVisible();
  await expect(card.getByRole("link", { name: "Toate ›" })).toHaveAttribute("href", `/${IOANA}/concursuri`);
  await expect(page.locator("details.group\\/session").filter({ hasText: "Concurs" })).toHaveCount(1);
});

test("results source down: the card says so and the rest of Acasă stays", async({ page }) => {
  await mockState({ skateDown: true });
  await loginSportiv(page, ADULT_EMAIL);
  await page.goto(`/${IOANA}`);
  await expect(page.getByText("Rezultatele nu sunt disponibile acum.")).toBeVisible();
  await expect(page.getByText("Bună, Ioana").locator("visible=true")).toBeVisible();
  await expect(page.locator("details.group\\/session")).toHaveCount(3);
});

test("no competitions at all: no card", async({ page }) => {
  await mockState({ noCompetitions: true });
  await loginSportiv(page, ADULT_EMAIL);
  await page.goto(`/${IOANA}`);
  await expect(page.getByText("Bună, Ioana").locator("visible=true")).toBeVisible();
  await expect(page.getByText("Ultimul concurs")).toHaveCount(0);
  await expect(page.getByText("Rezultatele nu sunt disponibile acum.")).toHaveCount(0);
});

test("a stale result carries its date", async({ page }) => {
  await mockState({ stale: true });
  await loginSportiv(page, ADULT_EMAIL);
  await page.goto(`/${IOANA}`);
  await expect(page.getByText("Rezultatele pot fi mai vechi. Actualizate 5 noi.")).toBeVisible();
});

test("promotion with reduced motion: the new level at once, focus on the button, Mai departe posts once", async({ page }) => {
  await mockState({ promotion: ANA });
  await loginSportiv(page);
  await page.goto(`/${ANA}`);
  const dialog = page.getByRole("dialog", { name: "Nivel nou" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText("Intermediari Silver")).toBeVisible();
  await expect(dialog.getByText("Intermediari Bronze")).toHaveCount(0);
  await expect(dialog.getByText("Felicitări, Ana! Ai trecut la nivelul următor.")).toBeVisible();
  await expect(dialog.getByRole("button", { name: "Mai departe" })).toBeFocused();
  await dialog.getByRole("button", { name: "Mai departe" }).click();
  await expect(dialog).toHaveCount(0);
  expect(await seenPosts(ANA)).toHaveLength(1);
  await page.reload();
  await expect(page.getByText("Bună, Ana").locator("visible=true")).toBeVisible();
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("promotion: Escape posts once and the dialog is gone after a reload", async({ page }) => {
  await mockState({ promotion: ANA });
  await loginSportiv(page);
  await page.goto(`/${ANA}`);
  const dialog = page.getByRole("dialog", { name: "Nivel nou" });
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await page.keyboard.press("Escape");
  expect(await seenPosts(ANA)).toHaveLength(1);
  await page.reload();
  await expect(page.getByText("Bună, Ana").locator("visible=true")).toBeVisible();
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("promotion with motion allowed shows both levels in the dialog", async({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await mockState({ promotion: ANA });
  await loginSportiv(page);
  await page.goto(`/${ANA}`);
  const dialog = page.getByRole("dialog", { name: "Nivel nou" });
  await expect(dialog.locator("[data-promo-old]")).toHaveCount(1);
  await expect(dialog.locator("[data-promo-new]")).toHaveText("Intermediari Silver");
  await expect(dialog.getByRole("button", { name: "Mai departe" })).toBeFocused();
});
