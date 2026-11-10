import { expect, test } from "@playwright/test";
import { COACH_BASE, loginAs, mockReset, mockState } from "./portal-helpers";

test.use({ baseURL: COACH_BASE });
test.beforeEach(async() => { await mockReset(); });

test("logged out, a coach page lands on the login screen", async({ page }) => {
  await page.goto("/grupe");
  await expect(page).toHaveURL(/\/login$/);
});

test("a cut account ends on the login screen", async({ page }) => {
  await loginAs(page);
  await mockState({ cutAccount: true });
  await page.goto("/");
  await expect(page).toHaveURL(/\/login$/);
});

test.describe("phone 390", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("bottom nav with five items, Azi current, no header bar", async({ page }) => {
    await loginAs(page);
    await page.goto("/");
    const bar = page.locator("[data-bottom-nav]");
    await expect(bar).toBeVisible();
    for (const name of ["Azi", "Grupe", "Concursuri", "Istoric", "Profil"]) {
      const link = bar.getByRole("link", { name, exact: true });
      await expect(link).toBeVisible();
      await expect(link.locator("svg")).toHaveCount(1);
    }
    await expect(bar.getByRole("link")).toHaveCount(5);
    const azi = bar.getByRole("link", { name: "Azi", exact: true });
    await expect(azi).toHaveAttribute("aria-current", "page");
    await expect(azi).toHaveCSS("background-color", "rgb(143, 184, 245)");
    await expect(page.locator("header nav")).toHaveCount(0);
    await expect(page.getByRole("link", { name: "AP", exact: true })).toHaveCount(0);
    await expect(page.locator("[data-sidebar]")).toBeHidden();
  });

  test("Azi stays current under the calendar and Grupe under an athlete", async({ page }) => {
    await loginAs(page);
    await page.goto("/grupe");
    await expect(page.locator("[data-bottom-nav]").getByRole("link", { name: "Grupe", exact: true })).toHaveAttribute("aria-current", "page");
    await page.goto("/sportiv/amaria");
    await expect(page.locator("[data-bottom-nav]").getByRole("link", { name: "Grupe", exact: true })).toHaveAttribute("aria-current", "page");
  });

  test("no bottom nav on the presence page", async({ page }) => {
    await loginAs(page);
    await page.goto("/prezenta?id=s-today");
    await expect(page.getByText("Avansați").first()).toBeVisible();
    await expect(page.locator("[data-bottom-nav]")).toHaveCount(0);
  });

  test("no shell element except the nav bar and its tile is rounded", async({ page }) => {
    await loginAs(page);
    await page.goto("/");
    await expect(page.locator("[data-bottom-nav]")).toBeVisible();
    const rounded = await page.evaluate(() =>
      [...document.querySelectorAll("[data-bottom-nav], [data-bottom-nav] *, [data-sidebar], [data-sidebar] *")]
        .filter((el) => getComputedStyle(el).borderRadius !== "0px" && !el.closest("[data-bottom-nav]"))
        .map((el) => el.tagName));
    expect(rounded).toEqual([]);
  });
});

test.describe("desktop 1280", () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test("sidebar with the brand, four links and the account link", async({ page }) => {
    await loginAs(page);
    await page.goto("/");
    const side = page.locator("[data-sidebar]");
    await expect(side).toBeVisible();
    await expect(side.getByText("CLUBUL SPORTIV")).toBeVisible();
    await expect(side.getByText("EDUSPORT")).toBeVisible();
    for (const name of ["Azi", "Grupe", "Concursuri", "Istoric"]) await expect(side.getByRole("link", { name, exact: true })).toBeVisible();
    // The account button is the one link to Profil: labelled "Profil", not a dropdown.
    await expect(side.getByRole("link", { name: "Profil", exact: true })).toHaveCount(1);
    const account = side.getByRole("link", { name: "Profil", exact: true });
    await expect(account).toHaveAttribute("href", "/profil");
    await expect(account).toHaveText("Andrei");
    await expect(page.locator("[data-bottom-nav]")).toBeHidden();
  });

  test("Grupe is current on the list and on an athlete", async({ page }) => {
    await loginAs(page);
    await page.goto("/grupe");
    await expect(page.locator("[data-sidebar]").getByRole("link", { name: "Grupe", exact: true })).toHaveAttribute("aria-current", "page");
    await page.goto("/sportiv/amaria");
    await expect(page.locator("[data-sidebar]").getByRole("link", { name: "Grupe", exact: true })).toHaveAttribute("aria-current", "page");
    await expect(page.locator("[data-bottom-nav]")).toBeHidden();
  });
});
