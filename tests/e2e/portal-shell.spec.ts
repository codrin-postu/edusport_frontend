import { expect, test } from "@playwright/test";
import { COACH_BASE, loginAs, mockReset, mockState } from "./portal-helpers";

test.use({ baseURL: COACH_BASE, viewport: { width: 390, height: 844 } });
test.beforeEach(async() => { await mockReset(); });

test("logged out, a coach page lands on the login screen", async({ page }) => {
  await page.goto("/grupe");
  await expect(page).toHaveURL(/\/intrare$/);
});

test("phone: initials tile and the four bottom items", async({ page }) => {
  await loginAs(page);
  await page.goto("/");
  await expect(page.getByRole("link", { name: "Profil" }).first()).toHaveText("AP");
  const bar = page.locator("nav").filter({ has: page.getByRole("link", { name: "Istoric" }) });
  for (const name of ["Azi", "Grupe", "Istoric", "Profil"]) await expect(bar.getByRole("link", { name, exact: true })).toBeVisible();
  await expect(bar.getByRole("link")).toHaveCount(4);
});

test("desktop: no bottom bar, top menu and name menu", async({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await loginAs(page);
  await page.goto("/");
  const top = page.locator("header nav");
  for (const name of ["Azi", "Grupe", "Istoric"]) await expect(top.getByRole("link", { name, exact: true })).toBeVisible();
  await expect(page.locator("nav").filter({ has: page.locator("li") })).toBeHidden();
  await page.locator("header").getByRole("button").click();
  await expect(page.getByRole("menuitem", { name: "Profil" })).toBeVisible();
  await expect(page.getByRole("menuitem", { name: "Ieși din cont" })).toBeVisible();
});

test("a cut account ends on the login screen", async({ page }) => {
  await loginAs(page);
  await mockState({ cutAccount: true });
  await page.goto("/");
  await expect(page).toHaveURL(/\/intrare$/);
});

test("no shell element except the spinner is rounded", async({ page }) => {
  await loginAs(page);
  await page.goto("/");
  await expect(page.getByRole("link", { name: "Profil" }).first()).toHaveText("AP");
  const rounded = await page.evaluate(() =>
    [...document.querySelectorAll("header *, nav *")].filter((el) => getComputedStyle(el).borderRadius !== "0px").map((el) => el.tagName));
  expect(rounded).toEqual([]);
});
