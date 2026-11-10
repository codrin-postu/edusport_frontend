import { expect, test } from "@playwright/test";
import { COACH_BASE, TODAY, loginAs, mockLog, mockReset } from "./portal-helpers";

test.use({ baseURL: COACH_BASE, viewport: { width: 390, height: 844 } });
test.beforeEach(async() => { await mockReset(); });

const calls = async(method: string, tail: RegExp) => (await mockLog()).filter((c) => c.method === method && tail.test(c.path));

test("cancelling a future date addresses the event by its documentId and notifies the parents", async({ page }) => {
  await loginAs(page);
  await page.goto("/grupe/gavansati?tab=program");
  await page.getByRole("button", { name: /^Mar\s*10\s/i }).click();
  await page.getByRole("dialog").getByLabel("Anunță părinții pe e-mail").evaluate((el) => (el as HTMLInputElement).click());
  await page.getByRole("dialog").getByRole("button", { name: "Salvează" }).click();
  await expect(page.getByText("Ședința din 10 noiembrie a fost anulată.")).toBeVisible();
  const put = (await calls("PUT", /\/program\/[^/]+\/dates\//))[0];
  expect(put?.path).toMatch(/\/program\/evavansati\/dates\/2026-11-10$/);
  expect(put?.body).toEqual({ mode: "cancel", notifyParents: true });
});

test("ending the program posts the date after a confirmation", async({ page }) => {
  await loginAs(page);
  await page.goto("/grupe/gavansati?tab=program");
  await page.getByRole("button", { name: "Schimbă programul de marți" }).click();
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
  await expect(page.getByRole("link", { name: "+ Adaugă program" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: /^Mar\s*\d+\s/i })).toHaveCount(0);
});
