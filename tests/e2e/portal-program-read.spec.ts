import { expect, test } from "@playwright/test";
import { COACH_BASE, loginAs, mockLog, mockReset } from "./portal-helpers";

test.use({ baseURL: COACH_BASE, viewport: { width: 390, height: 844 } });
test.beforeEach(async() => { await mockReset(); });

test("an own Club group shows the series and toggles Program public", async({ page }) => {
  await loginAs(page);
  await page.goto("/grupe/gavansati?tab=program");
  await expect(page.getByText("Ma, Mi 18:15", { exact: true })).toBeVisible();
  const sw = page.getByRole("switch", { name: "Program public" });
  await expect(sw).toHaveAttribute("aria-checked", "true");
  await expect(page.getByText("Programul apare în calendarul de pe site.")).toBeVisible();
  await sw.click();
  await expect(page.getByText("Salvat.")).toBeVisible();
  const put = (await mockLog()).find((c) => c.method === "PUT" && c.path.endsWith("/groups/gavansati/program-public"));
  expect(put?.body).toEqual({ value: false });
  await expect(sw).toHaveAttribute("aria-checked", "false");
});

test("a past date is marked trecut", async({ page }) => {
  await loginAs(page);
  await page.goto("/grupe/gavansati?tab=program");
  await expect(page.getByText("trecut").first()).toBeVisible();
});

test("the month view is a grid", async({ page }) => {
  await loginAs(page);
  await page.goto("/grupe/gavansati?tab=program");
  await page.getByRole("button", { name: "Lună" }).click();
  await expect(page.getByTestId("program-month")).toBeVisible();
  await expect(page.getByTestId("program-month").getByText("18:15").first()).toBeVisible();
});

test("Scoala is read only", async({ page }) => {
  await loginAs(page);
  await page.goto("/grupe/gprimii?tab=program");
  await expect(page.getByText("Programul Școlii îl schimbă administratorul.")).toBeVisible();
  await expect(page.getByRole("switch")).toHaveCount(0);
});
