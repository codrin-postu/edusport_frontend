import { expect, test } from "@playwright/test";
import { mockLog, mockReset, mockState } from "./portal-helpers";
import { SPORTIV_BASE, loginSportiv } from "./sportiv-helpers";

const ANA = "athana0001";
const MATEI = "athmatei01";
const FOREIGN = "athforeign1";
const LOST = "Nu mai ai acces la acest sportiv.";

test.use({ baseURL: SPORTIV_BASE, viewport: { width: 390, height: 844 } });
test.beforeEach(async({ page }) => {
  await mockReset();
  await loginSportiv(page);
});

test("Abonament si plati shows the owed money, the abonament, the payments and the registration form", async({ page }) => {
  await page.goto(`/${ANA}/plati`);
  await expect(page.getByRole("heading", { name: "Abonament și plăți", level: 1 })).toBeVisible();
  await expect(page.getByText("Ana Ionescu").locator("visible=true").first()).toBeVisible();
  await expect(page.getByText("Rămas de plată")).toBeVisible();
  await expect(page.getByText("150 RON", { exact: true })).toBeVisible();
  await expect(page.getByText("Lecție 12 noi")).toBeVisible();
  await expect(page.getByText("Plata se face la club.")).toBeVisible();
  await expect(page.getByText("A-0124", { exact: true })).toBeVisible();
  await expect(page.getByText("Școala noiembrie, 1 noi - 30 noi")).toBeVisible();
  await expect(page.getByText("Ședința 5 din 8")).toBeVisible();

  await expect(page.getByText("Abonament noiembrie")).toBeVisible();
  await expect(page.getByText("2 noi, numerar")).toBeVisible();
  await expect(page.getByText("320 RON").first()).toBeVisible();
  await expect(page.getByText("22 oct, card")).toBeVisible();
  await expect(page.getByText("1 oct, transfer")).toBeVisible();
  const body = await page.locator("body").innerText();
  expect(body).not.toContain("anulată");
  expect(body).not.toContain("Admin");
  await expect(page.getByRole("button", { name: "Înainte" })).toHaveCount(0);

  await expect(page.getByText("Fișa de înscriere 2026-2027")).toBeVisible();
  await expect(page.getByText("PDF", { exact: true })).toBeVisible();
  const link = page.getByRole("link", { name: "Descarcă" });
  await expect(link).toHaveAttribute("href", `/api/portal/sportiv/athletes/${ANA}/documents/acord`);
  const answered = await page.evaluate(async(href) => {
    const res = await fetch(href);
    return { status: res.status, type: res.headers.get("content-type") };
  }, `/api/portal/sportiv/athletes/${ANA}/documents/acord`);
  expect(answered.status).toBe(200);
  expect(answered.type).toContain("application/pdf");
  const download = page.waitForEvent("download");
  await link.click();
  expect((await download).suggestedFilename()).toBe("fisa-inscriere.pdf");
  await expect(page.getByRole("button", { name: /Plătește/ })).toHaveCount(0);
  await expect(page.getByRole("link", { name: /Plătește/ })).toHaveCount(0);

  const paths = (await mockLog()).map((c) => c.path);
  for (const tail of ["money", "payments?page=1", "subscriptions"]) expect(paths.some((p) => p.endsWith(`/${ANA}/${tail}`))).toBe(true);
});

test("the page shows the money it is sent and never adds the lines up", async({ page }) => {
  await mockState({ moneyMismatch: true });
  await page.goto(`/${ANA}/plati`);
  await expect(page.getByText("170 RON", { exact: true })).toBeVisible();
  await expect(page.getByText("150 RON", { exact: true })).toHaveCount(0);
  await expect(page.getByText("Lecție 12 noi")).toBeVisible();
});

test("nothing owed says so and leaves out the pay at the club line", async({ page }) => {
  await mockState({ nothingOwed: true });
  await page.goto(`/${ANA}/plati`);
  await expect(page.getByText("Nimic de plată.")).toBeVisible();
  await expect(page.getByText("Plata se face la club.")).toHaveCount(0);
});

test("an advance is shown as sent", async({ page }) => {
  await mockState({ nothingOwed: true, advance: 40 });
  await page.goto(`/${ANA}/plati`);
  await expect(page.getByText("Avans: 40 RON")).toBeVisible();
});

test("Vezi zilele opens the days sheet and Escape returns focus to it", async({ page }) => {
  await page.goto(`/${ANA}/plati`);
  const open = page.getByRole("button", { name: "Vezi zilele ›" });
  await open.click();
  const sheet = page.getByRole("dialog");
  await expect(sheet.getByRole("listitem").filter({ hasText: /^\d/ })).toHaveCount(8);
  await expect(sheet.getByText("următoarea")).toHaveCount(1);
  await expect(sheet.getByText(/^\d+ noi$/)).toHaveCount(4);
  await expect(sheet.getByText("Valabil până la 30 noi, 4 rămase")).toBeVisible();
  await expect(sheet.getByText("Data se poate prelungi dacă școala are un weekend liber.")).toBeVisible();
  await expect(sheet.getByText("Alte abonamente")).toBeVisible();
  await expect(sheet.getByText("Școala octombrie, 8/8, valabil până la 31 oct")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(sheet).toHaveCount(0);
  await expect(open).toBeFocused();
});

test("payments page by 20 and the pager appears only above 20", async({ page }) => {
  await mockState({ manyPayments: true });
  await page.goto(`/${ANA}/plati`);
  await expect(page.getByText("1 - 20 din 26")).toBeVisible();
  await expect(page.getByRole("button", { name: "Înapoi" })).toBeDisabled();
  await page.getByRole("button", { name: "Înainte" }).click();
  await expect(page.getByText("21 - 26 din 26")).toBeVisible();
  expect((await mockLog()).some((c) => c.path.includes(`/${ANA}/payments?page=2`))).toBe(true);
  await expect(page.getByRole("button", { name: "Înainte" })).toBeDisabled();
});

test("without a registration form there is no document row, and an athlete without an abonament has no abonament card", async({ page }) => {
  await mockState({ noDocument: true });
  await page.goto(`/${ANA}/plati`);
  await expect(page.getByText("Abonament noiembrie")).toBeVisible();
  await expect(page.getByText("Fișa de înscriere")).toHaveCount(0);
  await page.goto(`/${MATEI}/plati`);
  await expect(page.getByText("Nimic de plată.")).toBeVisible();
  await expect(page.getByRole("button", { name: "Vezi zilele ›" })).toHaveCount(0);
});

test("the PDF link belongs to the athlete in the URL", async({ page }) => {
  await page.goto(`/${MATEI}/plati`);
  await expect(page.getByRole("link", { name: "Descarcă" })).toHaveAttribute("href", `/api/portal/sportiv/athletes/${MATEI}/documents/acord`);
});

test("a foreign athlete id ends on the access removed flow", async({ page }) => {
  await page.goto(`/${FOREIGN}/plati`);
  await expect(page.getByText(LOST)).toBeVisible();
  await expect(page).not.toHaveURL(/plati/);
  await expect(page.getByText("Rămas de plată")).toHaveCount(0);
});
