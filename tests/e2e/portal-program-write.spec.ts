import { expect, test } from "@playwright/test";
import { COACH_BASE, TODAY, loginAs, mockLog, mockReset } from "./portal-helpers";

test.use({ baseURL: COACH_BASE, viewport: { width: 390, height: 844 } });
test.beforeEach(async() => { await mockReset(); });

const calls = async(method: string, tail: RegExp) => (await mockLog()).filter((c) => c.method === method && tail.test(c.path));

test("adding a weekly series sends the days, time, duration and start", async({ page }) => {
  await loginAs(page);
  await page.goto("/grupe/gavansati?tab=program");
  await page.getByRole("button", { name: "+ Adaugă program" }).click();
  const sheet = page.getByRole("dialog");
  await expect(sheet.getByRole("button", { name: "Salvează" })).toBeDisabled();
  await sheet.getByRole("button", { name: "Ma", exact: true }).click();
  await sheet.getByRole("button", { name: "Jo", exact: true }).click();
  await sheet.getByLabel("De la").fill("17:00");
  await sheet.getByLabel("Durată").click();
  await page.getByRole("menuitemradio", { name: "60 min", exact: true }).click();
  await sheet.getByRole("button", { name: "Salvează" }).click();
  await expect(page.getByText("Program adăugat.")).toBeVisible();
  const post = (await calls("POST", /\/groups\/gavansati\/program$/))[0];
  expect(post?.body).toEqual({ repeat: true, freq: "weekly", days: ["tue", "thu"], startTime: "17:00", durationMin: 60, from: TODAY });
});

test("cancelling a future date addresses the event by its documentId and notifies the parents", async({ page }) => {
  await loginAs(page);
  await page.goto("/grupe/gavansati?tab=program");
  const row = page.getByRole("listitem").filter({ has: page.getByText("10", { exact: true }) });
  await row.getByRole("button", { name: "Anulează" }).click();
  await page.getByRole("dialog").getByLabel("Anunță părinții pe e-mail").evaluate((el) => (el as HTMLInputElement).click());
  await page.getByRole("dialog").getByRole("button", { name: "Salvează" }).click();
  await expect(page.getByText("Ședința din 10 noiembrie a fost anulată.")).toBeVisible();
  const put = (await calls("PUT", /\/program\/[^/]+\/dates\//))[0];
  expect(put?.path).toMatch(/\/program\/evavansati\/dates\/2026-11-10$/);
  expect(put?.body).toEqual({ mode: "cancel", notifyParents: true });
});

test("past dates have no action buttons", async({ page }) => {
  await loginAs(page);
  await page.goto("/grupe/gavansati?tab=program");
  const past = page.getByRole("listitem").filter({ has: page.getByText("trecut") });
  await expect(past.first()).toBeVisible();
  await expect(past.getByRole("button")).toHaveCount(0);
});

test("ending the program posts the date after a confirmation", async({ page }) => {
  await loginAs(page);
  await page.goto("/grupe/gavansati?tab=program");
  await page.getByRole("button", { name: "Schimbă", exact: true }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Șterge programul" }).click();
  await expect(page.getByText(/^Ștergi programul din/)).toBeVisible();
  await page.getByRole("dialog").getByRole("button", { name: "Șterge programul" }).click();
  await expect(page.getByText("Program șters.")).toBeVisible();
  const post = (await calls("POST", /\/program\/evavansati\/end$/))[0];
  expect(post?.body).toEqual({ from: TODAY });
});

test("the Scoala group has no program buttons", async({ page }) => {
  await loginAs(page);
  await page.goto("/grupe/gprimii?tab=program");
  await expect(page.getByText("Programul Școlii îl schimbă administratorul.")).toBeVisible();
  await expect(page.getByRole("button", { name: "+ Adaugă program" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Anulează" })).toHaveCount(0);
});
