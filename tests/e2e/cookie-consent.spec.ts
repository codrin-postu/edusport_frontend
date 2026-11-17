import { expect, test, type Page } from "@playwright/test";
import { COACH_BASE, loginAs, mockReset } from "./portal-helpers";
import { SPORTIV_BASE, loginSportiv } from "./sportiv-helpers";

// The library hides the banner from automated browsers (navigator.webdriver); real visitors see it.
test.beforeEach(async({ page }) => {
  await mockReset();
  await page.addInitScript(() => Object.defineProperty(navigator, "webdriver", { get: () => false }));
});

const banner = (page: Page) => page.locator("#cc-main .cm");
const preferences = (page: Page) => page.locator("#cc-main .pm");
const refuse = (page: Page) => page.locator("#cc-main .cm [data-role=\"necessary\"]").click();

test("site: banner on first visit, Refuz hides it for good, the footer link reopens the preferences", async({ page }) => {
  await page.goto("/");
  await expect(banner(page)).toBeVisible();
  await refuse(page);
  await expect(banner(page)).toBeHidden();
  await page.reload();
  await expect(page.locator("footer")).toBeVisible();
  await expect(banner(page)).toBeHidden();
  await page.getByRole("link", { name: "Preferințe cookies" }).click();
  await expect(preferences(page)).toBeVisible();
});

test("site: Accept tot stores the functionality choice", async({ page }) => {
  await page.goto("/");
  await page.locator("#cc-main .cm [data-role=\"all\"]").click();
  await expect(banner(page)).toBeHidden();
  const cookie = (await page.context().cookies()).find((c) => c.name === "cc_cookie");
  expect(decodeURIComponent(cookie?.value ?? "")).toContain("functionality");
});

test.describe("coach portal", () => {
  test.use({ baseURL: COACH_BASE });

  test("banner on the login page, Refuz hides it", async({ page }) => {
    await page.goto("/login");
    await expect(banner(page)).toBeVisible();
    await refuse(page);
    await expect(banner(page)).toBeHidden();
  });

  test("Setări has a row that reopens the preferences", async({ page }) => {
    await loginAs(page);
    await page.goto("/profil/setari");
    await refuse(page);
    await page.getByRole("button", { name: "Preferințe cookies" }).click();
    await expect(preferences(page)).toBeVisible();
  });
});

test.describe("student portal", () => {
  test.use({ baseURL: SPORTIV_BASE });

  test("banner on the login page, preferences open from the banner", async({ page }) => {
    await page.goto("/login");
    await expect(banner(page)).toBeVisible();
    await page.locator("#cc-main .cm [data-role=\"show\"]").click();
    await expect(preferences(page)).toBeVisible();
  });

  test("Setări has a row that reopens the preferences", async({ page }) => {
    await loginSportiv(page);
    await page.goto("/setari");
    await refuse(page);
    await page.getByRole("button", { name: "Preferințe cookies" }).click();
    await expect(preferences(page)).toBeVisible();
  });
});
