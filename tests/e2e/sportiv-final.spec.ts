import { expect, test } from "@playwright/test";
import { mockLog, mockReset, mockState } from "./portal-helpers";
import { ADULT_EMAIL, PARENT_EMAIL, SPORTIV_BASE, loginSportiv } from "./sportiv-helpers";

const ANA = "athana0001";
const MATEI = "athmatei01";
const IOANA = "athadult01";

test.use({ baseURL: SPORTIV_BASE, viewport: { width: 390, height: 844 } });
test.beforeEach(async() => { await mockReset(); });

test("a signed-in parent's reset page shows the account e-mail without a field", async({ page }) => {
  await loginSportiv(page);
  await page.goto("/forgot-password");
  await expect(page.getByText(PARENT_EMAIL, { exact: true })).toBeVisible();
  await expect(page.getByLabel("E-mail")).toHaveCount(0);
  const paths = (await mockLog()).map((c) => c.path);
  expect(paths.some((p) => p.endsWith("/sportiv/me"))).toBe(true);
  expect(paths.some((p) => p.endsWith("/coach/me"))).toBe(false);
});

test("Setări lists every athlete, also the ones outside the picker", async({ page }) => {
  await mockState({ unlisted: MATEI });
  await loginSportiv(page);
  await page.goto("/setari");
  await expect(page.getByRole("link", { name: /Ana Ionescu/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /Matei Ionescu/ })).toBeVisible();
});

test("Acasă without upcoming sessions says so; an inactive athlete does not get that line", async({ page }) => {
  await mockState({ noUpcoming: true });
  await loginSportiv(page);
  await page.goto(`/${ANA}`);
  await expect(page.getByText("Nicio ședință programată.")).toBeVisible();
  await mockState({ inactive: ANA });
  await page.goto(`/${ANA}`);
  await expect(page.getByText("Sportiv inactiv.").locator("visible=true")).toBeVisible();
  await expect(page.getByText("Nicio ședință programată.")).toHaveCount(0);
});

test("an inactive athlete keeps the status sub line and the inactive line comes under it", async({ page }) => {
  await mockState({ inactive: ANA });
  await loginSportiv(page);
  await page.goto(`/${ANA}`);
  await expect(page.getByText("Școala de patinaj, AFI Cotroceni, 9 ani").locator("visible=true")).toBeVisible();
  await expect(page.getByText("Sportiv inactiv.").locator("visible=true")).toBeVisible();
});

test("Istoric keeps its pager and its focus while the next page loads", async({ page }) => {
  await loginSportiv(page);
  await page.goto(`/${ANA}/istoric`);
  const next = page.getByRole("button", { name: "Înainte" });
  await expect(next).toBeEnabled();
  await page.route("**/history?page=2", async(route) => {
    await new Promise((r) => setTimeout(r, 600));
    await route.continue();
  });
  await next.click();
  await expect(next).toBeFocused();
  await expect(page.getByText("1 - 20 din 26")).toBeVisible();
  await expect(page.getByText("21 - 26 din 26")).toBeVisible();
  await expect(next).toBeDisabled();
});

test("Plăți keeps its pager and focus while the next page loads", async({ page }) => {
  await mockState({ manyPayments: true });
  await loginSportiv(page);
  await page.goto(`/${ANA}/plati`);
  const next = page.getByRole("button", { name: "Înainte" });
  await expect(next).toBeEnabled();
  await page.route("**/payments?page=2", async(route) => {
    await new Promise((r) => setTimeout(r, 600));
    await route.continue();
  });
  await next.click();
  await expect(next).toBeFocused();
  await expect(page.getByText("21 - 26 din 26")).toBeVisible();
});

test("Concursuri keeps its pager and focus while the next page loads", async({ page }) => {
  await loginSportiv(page, ADULT_EMAIL);
  await page.goto(`/${IOANA}/concursuri`);
  const next = page.getByRole("button", { name: "Înainte" });
  await expect(next).toBeEnabled();
  await page.route("**/competitions?*page=2*", async(route) => {
    await new Promise((r) => setTimeout(r, 600));
    await route.continue();
  });
  await next.click();
  await expect(next).toBeFocused();
  await expect(page.getByText("21 - 40 din 41")).toBeVisible();
});

test("Calendar: Luna trecută is disabled without an earlier month, and an empty day says so", async({ page }) => {
  await mockState({ noPrevMonth: true });
  await loginSportiv(page);
  await page.goto(`/${ANA}/calendar`);
  await expect(page.getByRole("button", { name: "Luna trecută" }).locator("visible=true")).toBeDisabled();
  await page.getByRole("button", { name: "3 noiembrie", exact: true }).click();
  await expect(page.getByText("Nicio ședință în această zi.")).toBeVisible();
  await page.getByRole("button", { name: "12 noiembrie", exact: true }).click();
  await expect(page.getByText("Nicio ședință în această zi.")).toHaveCount(0);
});

test("the registration form downloads under the name the server sends, with a fixed name when it sends none", async({ page }) => {
  await mockState({ documentFile: "fisa-ana-2026.pdf" });
  await loginSportiv(page);
  await page.goto(`/${ANA}/plati`);
  let download = page.waitForEvent("download");
  await page.getByRole("link", { name: "Descarcă" }).click();
  expect((await download).suggestedFilename()).toBe("fisa-ana-2026.pdf");
  await mockState({ documentFile: null });
  download = page.waitForEvent("download");
  await page.getByRole("link", { name: "Descarcă" }).click();
  expect((await download).suggestedFilename()).toBe("fisa-inscriere.pdf");
});

test("a 403 that is not the lost access one only shows the failure and stays on the page", async({ page }) => {
  await loginSportiv(page);
  await page.goto(`/${ANA}/plati`);
  await expect(page.getByRole("link", { name: "Descarcă" })).toBeVisible();
  await mockState({ documentForbidden: true });
  await page.getByRole("link", { name: "Descarcă" }).click();
  await expect(page.getByText("Nu am putut încărca datele.")).toBeVisible();
  await expect(page.getByText("Nu mai ai acces la acest sportiv.")).toHaveCount(0);
  await expect(page).toHaveURL(/plati$/);
});

test("the picker of an account without athletes says so", async({ page }) => {
  await loginSportiv(page);
  await mockState({ noAthletes: true });
  await page.goto("/");
  await expect(page.getByText("Niciun sportiv în cont.")).toBeVisible();
});

test.describe("desktop Plăți", () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test("the owed card, the abonament, the payments table and the documents are all shown", async({ page }) => {
    await loginSportiv(page);
    await page.goto(`/${ANA}/plati`);
    await expect(page.getByRole("region", { name: "Rămas de plată" }).or(page.getByRole("heading", { name: "Rămas de plată" }))).toBeVisible();
    await expect(page.getByRole("heading", { name: "Abonament", level: 2 })).toBeVisible();
    await expect(page.getByRole("table")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Documente", level: 2 })).toBeVisible();
    await expect(page.getByRole("link", { name: "Descarcă" })).toBeVisible();
  });
});
