import { expect, test } from "@playwright/test";
import { mockLog, mockReset, mockState } from "./portal-helpers";
import { ADULT_EMAIL, SPORTIV_BASE, loginSportiv } from "./sportiv-helpers";

const ANA = "athana0001";
const IOANA = "athadult01";
const DOWN = "Rezultatele nu sunt disponibile acum.";

test.use({ baseURL: SPORTIV_BASE, viewport: { width: 390, height: 844 } });
test.beforeEach(async({ page }) => {
  await mockReset();
  await loginSportiv(page, ADULT_EMAIL);
});

const listCalls = async() => (await mockLog()).filter((c) => c.path.includes(`/${IOANA}/competitions`) && !c.path.includes("/competitions/"));

test("Concursuri shows the category, the records and the first page of 20", async({ page }) => {
  await page.goto(`/${IOANA}/concursuri`);
  await expect(page.getByRole("heading", { name: "Concursuri", level: 1 })).toBeVisible();
  await expect(page.getByText("Ioana Marin, 41 de concursuri").locator("visible=true")).toBeVisible();
  await expect(page.getByText("Categoria de concurs, sezonul 2026-2027")).toBeVisible();
  await expect(page.getByText("Advanced Novice Girls", { exact: true })).toBeVisible();
  await expect(page.getByText("din 2025")).toBeVisible();
  await expect(page.getByText("înainte: Basic Novice")).toBeVisible();
  for (const t of ["101,07", "record total"]) await expect(page.getByText(t, { exact: true })).toBeVisible();
  for (const t of ["12", "5"]) await expect(page.locator("b", { hasText: new RegExp(`^${t}$`) })).toBeVisible();
  for (const t of ["12 podiumuri", "5 victorii"]) await expect(page.getByText(t)).toBeVisible();
  await expect(page.getByLabel("Caută")).toHaveAttribute("placeholder", "Nume concurs sau oraș");
  await expect(page.getByRole("option", { name: "Toate sezoanele" })).toHaveCount(1);
  for (const s of ["2026-2027", "2025-2026"]) await expect(page.getByRole("option", { name: s })).toHaveCount(1);
  for (const s of ["Cele mai noi", "Cel mai bun loc", "Cele mai multe puncte"]) await expect(page.getByRole("option", { name: s })).toHaveCount(1);
  await expect(page.locator("[data-comp-row]")).toHaveCount(20);
  await expect(page.getByText("1 - 20 din 41")).toBeVisible();
  await page.getByRole("button", { name: "Înainte" }).click();
  await expect(page.getByText("21 - 40 din 41")).toBeVisible();
  await expect(page).toHaveURL(/page=2/);
});

test("search waits 300 ms, sends one request and survives a reload", async({ page }) => {
  await page.goto(`/${IOANA}/concursuri`);
  await expect(page.locator("[data-comp-row]")).toHaveCount(20);
  const before = (await listCalls()).length;
  await page.getByLabel("Caută").pressSequentially("brasov", { delay: 40 });
  await expect(page).toHaveURL(/\?q=brasov$/);
  await expect.poll(async() => (await listCalls()).length).toBe(before + 1);
  const calls = (await listCalls()).slice(before);
  expect(calls).toHaveLength(1);
  expect(calls[0].path).toContain("q=brasov");
  await expect(page.locator("[data-comp-row]")).not.toHaveCount(20);
  const filtered = await page.locator("[data-comp-row]").count();
  expect(filtered).toBeGreaterThan(0);
  await page.reload();
  await expect(page.getByLabel("Caută")).toHaveValue("brasov");
  await expect(page.locator("[data-comp-row]")).toHaveCount(filtered);
});

test("season and sort go to the server; an empty season says so", async({ page }) => {
  await page.goto(`/${IOANA}/concursuri`);
  await expect(page.locator("[data-comp-row]")).toHaveCount(20);
  await page.getByLabel("Ordine").selectOption({ label: "Cel mai bun loc" });
  await expect(page).toHaveURL(/sort=place/);
  expect((await listCalls()).some((c) => c.path.includes("sort=place"))).toBe(true);
  await page.getByLabel("Sezon").selectOption({ label: "2024-2025" });
  await expect(page.getByText("Niciun rezultat în acest sezon.")).toBeVisible();
  await expect(page.getByRole("button", { name: "Înainte" })).toHaveCount(0);
});

test("a row opens the competition", async({ page }) => {
  await page.goto(`/${IOANA}/concursuri`);
  await page.locator("[data-comp-row]").first().click();
  await expect(page).toHaveURL(new RegExp(`/${IOANA}/concursuri/res-0001$`));
  await expect(page.getByRole("link", { name: "‹ Concursuri" }).first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "Cupa României 2026", level: 1 })).toBeVisible();
  await expect(page.getByText("Locul 2 din 18")).toBeVisible();
  await expect(page.getByText("Total 98,42")).toBeVisible();
  await expect(page.getByText("record: 101,07")).toBeVisible();
  for (const h of ["Program scurt", "Program liber"]) await expect(page.getByRole("heading", { name: h })).toBeVisible();
  for (const t of ["TES", "PCS", "Deduceri"]) await expect(page.getByText(t, { exact: true }).first()).toBeVisible();
  for (const t of ["Element", "Bază", "Scor"]) await expect(page.getByRole("columnheader", { name: t }).first()).toBeVisible();
  const official = page.getByRole("link", { name: "Clasamentul complet (pagina oficială) ›" });
  await expect(official).toHaveAttribute("target", "_blank");
  await expect(official).toHaveAttribute("rel", "noopener noreferrer");
  expect(await page.locator("body").innerText()).not.toContain("Ionescu");
});

test("no official link when there is none", async({ page }) => {
  await mockState({ noOfficialUrl: true });
  await page.goto(`/${IOANA}/concursuri/res-0001`);
  await expect(page.getByRole("heading", { name: "Cupa României 2026", level: 1 })).toBeVisible();
  await expect(page.getByRole("link", { name: /Clasamentul complet/ })).toHaveCount(0);
});

test("an unknown result id is the not-found page", async({ page }) => {
  await page.goto(`/${IOANA}/concursuri/res-9999`);
  await expect(page.getByRole("heading", { name: "Pagina nu există", level: 1 })).toBeVisible();
  await expect(page.getByText("Total")).toHaveCount(0);
  await expect(page.getByText("Program scurt")).toHaveCount(0);
});

test("results source down: both pages say so", async({ page }) => {
  await mockState({ skateDown: true });
  await page.goto(`/${IOANA}/concursuri`);
  await expect(page.getByText(DOWN)).toBeVisible();
  await expect(page.locator("[data-comp-row]")).toHaveCount(0);
  await page.goto(`/${IOANA}/concursuri/res-0001`);
  await expect(page.getByText(DOWN)).toBeVisible();
});

test("stale results say how old they are", async({ page }) => {
  await mockState({ stale: true });
  await page.goto(`/${IOANA}/concursuri`);
  await expect(page.getByText("Rezultatele pot fi mai vechi. Actualizate 5 noi.")).toBeVisible();
  await page.goto(`/${IOANA}/concursuri/res-0001`);
  await expect(page.getByText("Rezultatele pot fi mai vechi. Actualizate 5 noi.")).toBeVisible();
});

test("a school athlete gets the 404 page and no competitions request", async({ page }) => {
  await loginSportiv(page, "parinte1@example.invalid");
  await page.goto(`/${ANA}/concursuri`);
  await expect(page.getByRole("heading", { name: "Pagina nu există", level: 1 })).toBeVisible();
  await expect(page.getByRole("link", { name: "Concursuri" })).toHaveCount(0);
  await page.waitForTimeout(500);
  expect((await mockLog()).filter((c) => c.path.includes("/competitions"))).toHaveLength(0);
});

test.describe("desktop", () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test("the list is a table of linked rows under the filter row", async({ page }) => {
    await page.goto(`/${IOANA}/concursuri`);
    const table = page.getByRole("table");
    for (const h of ["Data", "Concurs", "Oraș", "Categorie", "Loc", "Total"]) await expect(table.getByRole("columnheader", { name: h })).toBeVisible();
    await expect(page.locator("[data-comp-table-row]")).toHaveCount(20);
    const link = table.getByRole("row").nth(1).getByRole("link");
    await expect(link).toHaveAttribute("href", new RegExp(`^/${IOANA}/concursuri/.+`));
    await expect(page.getByLabel("Caută")).toBeVisible();
    await expect(page.getByLabel("Sezon")).toBeVisible();
    await expect(page.getByLabel("Ordine")).toBeVisible();
    await expect(page.getByText("1 - 20 din 41")).toBeVisible();
    await link.click();
    await expect(page).toHaveURL(new RegExp(`/${IOANA}/concursuri/.+`));
  });
});
