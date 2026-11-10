import { expect, test } from "@playwright/test";
import { COACH_BASE, loginAs, mockReset, shot } from "./portal-helpers";

test.beforeEach(async() => { await mockReset(); });
test.use({ baseURL: COACH_BASE, timezoneId: "Europe/Bucharest" });

test.describe("desktop shell", () => {
  test.use({ viewport: { width: 1600, height: 900 } });

  test("sidebar full height, sticky header band, content centred at 1040px", async({ page }, info) => {
    await loginAs(page);
    await page.goto("/");
    await expect(page.locator("h1")).toHaveText("Azi");
    const side = (await page.locator("[data-sidebar]").boundingBox())!;
    expect(side.x).toBe(0);
    expect(Math.round(side.height)).toBe(900);
    const body = (await page.locator("[data-page-body]").boundingBox())!;
    expect(Math.round(body.width)).toBe(1040);
    // Centred in the area right of the 240px sidebar.
    expect(Math.round(body.x - 240)).toBe(Math.round((1600 - 240 - 1040) / 2));
    // The header band stays at the top while the page scrolls under it.
    await page.locator("main").evaluate((el) => { el.style.paddingBottom = "2400px"; });
    await page.evaluate(() => window.scrollTo(0, 700));
    const header = (await page.locator("[data-page-header]").boundingBox())!;
    expect(Math.round(header.y)).toBe(0);
    const side2 = (await page.locator("[data-sidebar]").boundingBox())!;
    expect(Math.round(side2.y)).toBe(0);
    await page.evaluate(() => window.scrollTo(0, 0));
    await shot(page, info, "azi-desktop-v2");
  });

  test("a single column page is centred at 640px", async({ page }) => {
    await loginAs(page);
    await page.goto("/profil");
    await expect(page.locator("h1")).toHaveCount(1);
    const col = (await page.locator("[data-page-body] > div").first().boundingBox())!;
    expect(Math.round(col.width)).toBe(640);
    const body = (await page.locator("[data-page-body]").boundingBox())!;
    expect(Math.round(col.x - body.x)).toBe(Math.round((body.width - 640) / 2));
  });

  test("the sidebar account button links to Profil with a right chevron", async({ page }) => {
    await loginAs(page);
    await page.goto("/");
    const account = page.locator("[data-sidebar-account]");
    await expect(account).toHaveAttribute("href", "/profil");
    await expect(account).toHaveAttribute("aria-label", "Profil");
    await expect(page.getByRole("link", { name: "Profil", exact: true }).locator("visible=true").first()).toBeVisible();
    await expect(account.locator("svg, use").first()).toBeAttached();
    expect(await account.evaluate((el) => (el.innerHTML.match(/portal-chevron-(right|down)/) ?? [""])[0])).not.toBe("portal-chevron-down");
    await account.click();
    await expect(page).toHaveURL(/\/profil$/);
  });

  test("the select chevron points down and turns up while the menu is open", async({ page }) => {
    await loginAs(page);
    await page.goto("/?nou=1");
    const select = page.getByLabel("Se repetă", { exact: true });
    const icon = select.locator("svg").last();
    expect(await icon.evaluate((el) => getComputedStyle(el).rotate)).toMatch(/^(none|0deg)$/);
    await select.click();
    await expect(page.getByRole("menuitemradio", { name: "Lunar" })).toBeVisible();
    await expect.poll(() => icon.evaluate((el) => getComputedStyle(el).rotate)).toBe("180deg");
    // Navy, not red, while open.
    expect(await icon.evaluate((el) => getComputedStyle(el).color)).toBe("rgb(14, 26, 60)");
    await page.getByRole("menuitemradio", { name: "Nu se repetă", exact: true }).click();
    await expect.poll(() => icon.evaluate((el) => getComputedStyle(el).rotate)).toMatch(/^(none|0deg)$/);
  });
});

test.describe("not found", () => {
  for (const size of [{ width: 390, height: 844 }, { width: 1280, height: 900 }]) {
    test(`the 404 is inside the portal frame (${size.width})`, async({ page }, info) => {
      await page.setViewportSize(size);
      await loginAs(page);
      const res = await page.goto("/nu-exista-pagina");
      expect(res?.status()).toBe(404);
      await expect(page.locator("h1")).toHaveText("Pagina nu există");
      await expect(page.getByRole("link", { name: "Înapoi la Azi" })).toHaveAttribute("href", "/");
      if (size.width >= 900) await expect(page.locator("[data-sidebar]")).toBeVisible();
      else await expect(page.locator("[data-bottom-nav]")).toBeVisible();
      await shot(page, info, "nu-exista");
    });
  }
});
