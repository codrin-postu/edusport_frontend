import { expect, test } from "@playwright/test";
import { mockLog, mockReset, mockState } from "./portal-helpers";
import { ADULT_EMAIL, SPORTIV_BASE, loginSportiv } from "./sportiv-helpers";

const ANA = "athana0001";
const MATEI = "athmatei01";
const IOANA = "athadult01";
const LOST = "Nu mai ai acces la acest sportiv.";

test.use({ baseURL: SPORTIV_BASE, viewport: { width: 390, height: 844 } });
test.beforeEach(async() => { await mockReset(); });

const bottomNav = (page: import("@playwright/test").Page) => page.locator("[data-bottom-nav]");

test("the picker lists both athletes and choosing one opens it", async({ page }) => {
  await loginSportiv(page);
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Sportivi" })).toBeVisible();
  await expect(page.getByText("Alege sportivul.").locator("visible=true")).toBeVisible();
  await expect(page.getByRole("link", { name: /Ana Ionescu/ })).toBeVisible();
  await page.getByRole("link", { name: /Matei Ionescu/ }).click();
  await expect(page).toHaveURL(`${SPORTIV_BASE}/${MATEI}`);
});

test("an account with one athlete lands on that athlete, and the entry flag is gone", async({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/login");
  await page.getByLabel("E-mail").fill(ADULT_EMAIL);
  await page.getByLabel("Parolă", { exact: true }).fill("Throwaway-Sportiv-1");
  await page.getByRole("button", { name: "Intră" }).click();
  await expect(page).toHaveURL(`${SPORTIV_BASE}/${IOANA}`, { timeout: 15_000 });
  await expect(page.locator("[data-entry-reveal]")).toHaveCount(0, { timeout: 15_000 });
  expect(await page.evaluate(() => window.sessionStorage.getItem("es-entry"))).toBeNull();
});

test("the phone header button opens the sheet; Matei Ionescu goes to Matei", async({ page }) => {
  await loginSportiv(page);
  await page.goto(`/${ANA}`);
  await page.getByRole("button", { name: "Ana" }).click();
  const dialog = page.getByRole("dialog", { name: "Alege sportivul" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("link", { name: /Ana Ionescu/ })).toHaveAttribute("aria-current", "true");
  await expect(dialog.getByRole("link", { name: /Matei Ionescu/ })).not.toHaveAttribute("aria-current", "true");
  await expect(dialog.getByText("Intermediari Bronze, 9 ani")).toBeVisible();
  await expect(dialog.getByRole("link", { name: "Setări" })).toHaveAttribute("href", "/setari");
  await dialog.getByRole("link", { name: /Matei Ionescu/ }).click();
  await expect(page).toHaveURL(`${SPORTIV_BASE}/${MATEI}`);
  await expect(page.getByRole("button", { name: "Matei" })).toBeVisible();
});

test("two tabs keep their own athlete", async({ page }) => {
  await loginSportiv(page);
  const tab2 = await page.context().newPage();
  await page.goto(`/${ANA}`);
  await expect(page.getByRole("button", { name: "Ana" })).toBeVisible();
  await tab2.goto(`${SPORTIV_BASE}/${ANA}`);
  await tab2.getByRole("button", { name: "Ana" }).click();
  await tab2.getByRole("link", { name: /Matei Ionescu/ }).click();
  await expect(tab2).toHaveURL(`${SPORTIV_BASE}/${MATEI}`);
  await page.reload();
  await tab2.reload();
  await expect(page.getByRole("button", { name: "Ana" })).toBeVisible();
  await expect(tab2.getByRole("button", { name: "Matei" })).toBeVisible();
  await expect(page).toHaveURL(`${SPORTIV_BASE}/${ANA}`);
  const homes = (await mockLog()).filter((c) => c.path.endsWith("/home")).map((c) => c.path);
  expect(homes.slice(-2).sort()).toEqual([`/api/portal/sportiv/athletes/${ANA}/home`, `/api/portal/sportiv/athletes/${MATEI}/home`].sort());
  expect((await page.context().cookies(SPORTIV_BASE)).every((c) => !c.value.includes(MATEI))).toBe(true);
});

test("the nav has four items for a school athlete and five for a performance one", async({ page }) => {
  await loginSportiv(page);
  await page.goto(`/${ANA}`);
  await expect(bottomNav(page).getByRole("link")).toHaveCount(4);
  await expect(bottomNav(page).getByRole("link", { name: "Concursuri" })).toHaveCount(0);
  await expect(bottomNav(page).getByRole("link", { name: "Acasă" })).toHaveAttribute("aria-current", "page");
  await expect(bottomNav(page).getByRole("link", { name: "Istoric" })).not.toHaveAttribute("aria-current", "page");
  await loginSportiv(page, ADULT_EMAIL);
  await page.goto(`/${IOANA}`);
  await expect(bottomNav(page).getByRole("link")).toHaveCount(5);
  await expect(bottomNav(page).getByRole("link", { name: "Concursuri" })).toBeVisible();
});

test.describe("desktop", () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test("hovering the account button lists the others; Escape closes it", async({ page }) => {
    await loginSportiv(page);
    await page.goto(`/${ANA}`);
    const account = page.locator("[data-sidebar-account]");
    await expect(account).toHaveText("Ana");
    await expect(page.getByRole("menuitem", { name: "Matei Ionescu" })).toBeHidden();
    await account.hover();
    await expect(page.getByRole("menuitem", { name: "Matei Ionescu" })).toBeVisible();
    await expect(page.getByRole("menuitem", { name: "Setări cont" })).toBeVisible();
    await expect(page.getByRole("menuitem", { name: "Ieși din cont" })).toBeVisible();
    await account.focus();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("menuitem", { name: "Setări cont" })).toBeHidden();
  });

  test("Ieși din cont posts the logout and lands on the login", async({ page }) => {
    await loginSportiv(page);
    await page.goto(`/${ANA}`);
    await page.locator("[data-sidebar-account]").hover();
    await page.getByRole("menuitem", { name: "Ieși din cont" }).click();
    await expect(page).toHaveURL(/\/login$/);
    expect((await mockLog()).some((c) => c.method === "POST" && c.path.endsWith("/auth/logout"))).toBe(true);
  });
});

test("access removed while open lands on the picker with the toast and Ana gone", async({ page }) => {
  await loginSportiv(page);
  await page.goto(`/${ANA}`);
  await expect(page.getByRole("button", { name: "Ana" })).toBeVisible();
  await mockState({ lostAthlete: ANA });
  await page.reload();
  await expect(page.getByText(LOST)).toBeVisible();
  // One athlete is left, so the picker moves on to it.
  await expect(page).toHaveURL(`${SPORTIV_BASE}/${MATEI}`);
  await page.getByRole("button", { name: "Matei" }).click();
  await expect(page.getByRole("dialog").getByRole("link", { name: /Ana Ionescu/ })).toHaveCount(0);
});

test("a cut account lands on the login", async({ page }) => {
  await loginSportiv(page);
  await page.goto(`/${ANA}`);
  await expect(page.getByRole("button", { name: "Ana" })).toBeVisible();
  await mockState({ cutAccount: true });
  await page.reload();
  await expect(page).toHaveURL(/\/login$/);
});

test("a session row opens from the keyboard and closes with Space", async({ page }) => {
  await loginSportiv(page);
  await page.goto(`/${ANA}`);
  const row = page.locator("details").first();
  const summary = row.locator("summary");
  await expect(row.getByText("Antrenor: Alina Gheorghe")).toBeHidden();
  await summary.focus();
  await page.keyboard.press("Enter");
  await expect(row.getByText("Antrenor: Alina Gheorghe")).toBeVisible();
  await expect(row.getByText("Ora: 17:30 - 18:30")).toBeVisible();
  await page.keyboard.press("Space");
  await expect(row.getByText("Antrenor: Alina Gheorghe")).toBeHidden();
});

test("an inactive athlete's Acasă says so", async({ page }) => {
  await loginSportiv(page);
  await mockState({ inactive: ANA });
  await page.goto(`/${ANA}`);
  await expect(page.getByText("Sportiv inactiv.").locator("visible=true")).toBeVisible();
});

test("an athlete outside the picker is not listed but still opens", async({ page }) => {
  await loginSportiv(page);
  await mockState({ unlisted: MATEI });
  await page.goto(`/${ANA}`);
  await page.getByRole("button", { name: "Ana" }).click();
  await expect(page.getByRole("dialog").getByRole("link", { name: /Matei Ionescu/ })).toHaveCount(0);
  await page.goto(`/${MATEI}`);
  await expect(page.getByRole("button", { name: "Matei" })).toBeVisible();
  // With one athlete listed, the root goes straight to it.
  await page.goto("/");
  await expect(page).toHaveURL(`${SPORTIV_BASE}/${ANA}`);
});

test("Concursuri with the athletes list down offers a retry, not the 404 page", async({ page }) => {
  await loginSportiv(page, ADULT_EMAIL);
  await mockState({ athletesDown: true });
  await page.goto(`/${IOANA}/concursuri`);
  await expect(page.getByText("Nu am putut încărca datele.")).toBeVisible();
  await expect(page.getByText("Pagina nu a fost găsită")).toHaveCount(0);
  await mockState({ athletesDown: false });
  await page.getByRole("button", { name: "Încearcă din nou" }).click();
  await expect(page.getByRole("heading", { name: "Concursuri", level: 1 })).toBeVisible();
});

test.describe("desktop shell", () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test("after the last athlete is lost the sidebar has no links to it", async({ page }) => {
    await loginSportiv(page, ADULT_EMAIL);
    await page.goto(`/${IOANA}/istoric`);
    await expect(page.locator(`a[href^="/${IOANA}"]`).first()).toBeVisible();
    await mockState({ lostAthlete: IOANA });
    await page.getByRole("link", { name: "Plăți" }).first().click();
    await expect(page.getByText(LOST)).toBeVisible();
    await expect(page.locator(`a[href^="/${IOANA}"]`)).toHaveCount(0);
  });

  test("switching athlete keeps the section root only when the other athlete has it", async({ page }) => {
    await loginSportiv(page);
    const matei = () => page.getByRole("menuitem", { name: "Matei Ionescu" });
    await page.goto(`/${ANA}/istoric`);
    await page.locator("[data-sidebar-account]").hover();
    await expect(matei()).toHaveAttribute("href", `/${MATEI}/istoric`);
    await mockState({ listPerformance: [ANA] });
    await page.goto(`/${ANA}/concursuri/abc123`);
    await page.locator("[data-sidebar-account]").hover();
    await expect(matei()).toHaveAttribute("href", `/${MATEI}`);
    await mockState({ listPerformance: [ANA, MATEI] });
    await page.goto(`/${ANA}/concursuri/abc123`);
    await page.locator("[data-sidebar-account]").hover();
    await expect(matei()).toHaveAttribute("href", `/${MATEI}/concursuri`);
  });
});
