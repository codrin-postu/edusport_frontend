import { expect, test } from "@playwright/test";
import { mockLog, mockReset } from "./portal-helpers";
import { SPORTIV_BASE, loginSportiv } from "./sportiv-helpers";

const ANA = "athana0001";

test.use({ baseURL: SPORTIV_BASE, viewport: { width: 390, height: 844 } });
test.beforeEach(async({ page }) => {
  await mockReset();
  await loginSportiv(page);
});

test("Calendar loads without a month, follows the arrows and lists a chosen day", async({ page }) => {
  await page.goto(`/${ANA}/calendar`);
  await expect(page.getByRole("heading", { name: "Calendar", level: 1 })).toBeVisible();
  await expect(page.getByText("Ana Ionescu, doar ședințele proprii").locator("visible=true")).toBeVisible();
  await expect(page.getByText("Noiembrie 2026").locator("visible=true")).toBeVisible();
  const calls = (await mockLog()).filter((c) => c.path.includes(`/${ANA}/calendar`) && !c.path.includes(".ics"));
  expect(calls[0].path).toMatch(/\/calendar$/);

  for (const legend of ["grupă", "individual", "concurs", "anulată"]) await expect(page.getByText(legend, { exact: true }).first()).toBeVisible();

  await page.getByRole("button", { name: "12 noiembrie", exact: true }).click();
  await expect(page.getByText("Joi, 12 noiembrie")).toBeVisible();
  await expect(page.getByText("Individual", { exact: true })).toBeVisible();
  await expect(page.getByText("Intermediari Bronze", { exact: true })).toBeVisible();
  await page.locator("summary", { hasText: "Individual" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByText("Antrenor: Andrei Pop")).toBeVisible();
  await expect(page.getByText("Ora: 16:00 - 16:45")).toBeVisible();

  await page.getByRole("button", { name: "Luna trecută" }).locator("visible=true").click();
  await expect(page.getByText("Octombrie 2026").locator("visible=true")).toBeVisible();
  expect((await mockLog()).some((c) => c.path.includes(`/${ANA}/calendar?month=2026-10`))).toBe(true);
});

test("Calendar shows a cancelled session and a competition", async({ page }) => {
  await page.goto(`/${ANA}/calendar`);
  await page.getByRole("button", { name: "7 noiembrie", exact: true }).click();
  const row = page.locator("details");
  const body = row.locator(":scope > div").getByText("anulată", { exact: true });
  await expect(row.locator("summary").getByText("Anulată", { exact: true })).toBeVisible();
  await expect(body).toBeHidden();
  await row.locator("summary").click();
  await expect(row.getByText("Antrenor: Alina Gheorghe")).toBeVisible();
  await expect(body).toBeVisible();
  await page.getByRole("button", { name: "20 noiembrie", exact: true }).click();
  await expect(page.getByText("Concurs", { exact: true })).toBeVisible();
});

test("the day list shows the reason of a cancelled session without opening it", async({ page }) => {
  await page.goto(`/${ANA}/calendar`);
  await page.getByRole("button", { name: "7 noiembrie", exact: true }).click();
  const row = page.locator("details");
  await expect(row.locator("summary").getByText("Vacanță", { exact: true })).toBeVisible();
  await expect(row).not.toHaveAttribute("open", "");
  await page.getByRole("button", { name: "9 noiembrie", exact: true }).click();
  await expect(page.locator("details summary").getByText("Mutată de pe Dum 8 noi, 17:30", { exact: true })).toBeVisible();
});

test("Calendar next month is disabled when the answer has none, and the phone calendar link downloads the file", async({ page }) => {
  await page.goto(`/${ANA}/calendar`);
  const next = page.getByRole("button", { name: "Luna viitoare" }).locator("visible=true");
  await expect(next).toBeEnabled();
  await next.click();
  await expect(page.getByText("Decembrie 2026").locator("visible=true")).toBeVisible();
  await expect(next).toBeDisabled();
  const link = page.getByRole("link", { name: "Adaugă în calendarul telefonului" });
  await expect(link).toHaveAttribute("href", `/api/portal/sportiv/athletes/${ANA}/calendar.ics`);
  const download = page.waitForEvent("download");
  await link.click();
  expect((await download).suggestedFilename()).toBe("edusport-ana.ics");
});
