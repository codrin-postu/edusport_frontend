import { expect, test } from "@playwright/test";
import { mockLog, mockReset, mockState } from "./portal-helpers";
import { SPORTIV_BASE, loginSportiv } from "./sportiv-helpers";

const ANA = "athana0001";
const FAILED = "Nu s-a putut închide. Încearcă din nou.";

test.use({ baseURL: SPORTIV_BASE });
test.beforeEach(async() => { await mockReset(); });

test.describe("desktop", () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  // Located without a role: an open dialog hides the page behind it from the accessibility tree.
  const item = (page: import("@playwright/test").Page) => page.locator("aside[data-sidebar] button").filter({ hasText: "Mesaje" });
  const card = (page: import("@playwright/test").Page, title: string) => page.locator("[data-notice]").filter({ has: page.getByRole("heading", { name: title }) });

  test("Mesaje sits above the account row and shows the counter", async({ page }) => {
    await loginSportiv(page);
    await page.goto(`/${ANA}`);
    await expect(item(page)).toContainText("2");
    const before = await page.locator("aside[data-sidebar]").evaluate((aside) => {
      const nodes = [...aside.querySelectorAll("button, a")];
      const mesaje = nodes.findIndex((n) => n.textContent?.startsWith("Mesaje"));
      const account = nodes.findIndex((n) => n.hasAttribute("data-sidebar-account"));
      return mesaje >= 0 && mesaje < account;
    });
    expect(before).toBe(true);
  });

  test("the panel lists the cards", async({ page }) => {
    await loginSportiv(page);
    await page.goto(`/${ANA}`);
    await item(page).click();
    const panel = page.getByRole("dialog", { name: "Mesaje" });
    await expect(panel).toBeVisible();
    await expect(panel.getByRole("heading", { level: 3 })).toHaveCount(2);
    const auto = card(page, "Modificări în program");
    await expect(auto).toContainText("5 noi");
    await expect(auto).toContainText("Ana: Intermediari Bronze, anulată");
    await expect(auto).toContainText("Vacanță");
    await expect(auto).toContainText("Matei: Începători, mutată");
    const hand = card(page, "Ședință cu părinții");
    await expect(hand).toContainText("4 noi");
    await expect(hand).toContainText("Vă așteptăm sâmbătă la ora 10.");
  });

  test("closing a card dismisses it for the account", async({ page }) => {
    await loginSportiv(page);
    await page.goto(`/${ANA}`);
    await item(page).click();
    const panel = page.getByRole("dialog", { name: "Mesaje" });
    await panel.getByRole("button", { name: "Închide" }).first().click();
    await expect(item(page)).toContainText("1");
    await expect(panel.getByRole("heading", { level: 3 })).toHaveCount(1);
    await page.reload();
    await expect(item(page)).toContainText("1");
    await item(page).click();
    await expect(page.getByRole("dialog", { name: "Mesaje" }).getByRole("heading", { level: 3 })).toHaveCount(1);
  });

  test("a failed dismiss keeps the card", async({ page }) => {
    await loginSportiv(page);
    await page.goto(`/${ANA}`);
    await item(page).click();
    const panel = page.getByRole("dialog", { name: "Mesaje" });
    await mockState({ dismissFailsOnce: true });
    await panel.getByRole("button", { name: "Închide" }).first().click();
    await expect(panel.getByRole("status").filter({ hasText: FAILED })).toBeVisible();
    await expect(page.getByRole("status", { includeHidden: true }).filter({ hasText: FAILED })).toHaveCount(2);
    await expect(panel.getByRole("heading", { level: 3 })).toHaveCount(2);
    await expect(item(page)).toContainText("2");
  });

  test("a dismiss answered 404 drops the card without a message", async({ page }) => {
    await loginSportiv(page);
    await page.goto(`/${ANA}`);
    await item(page).click();
    const panel = page.getByRole("dialog", { name: "Mesaje" });
    await expect(panel.getByRole("heading", { level: 3 })).toHaveCount(2);
    await mockState({ dismissGoneOnce: true });
    await panel.getByRole("button", { name: "Închide" }).first().click();
    await expect(panel.getByRole("heading", { level: 3 })).toHaveCount(1);
    await expect(item(page)).toContainText("1");
    await expect(page.getByText(FAILED)).toHaveCount(0);
  });

  test("opening the panel reads the list with seen=1, the mount-time load does not", async({ page }) => {
    await loginSportiv(page);
    await page.goto(`/${ANA}`);
    await expect(item(page)).toContainText("2");
    const lists = async() => (await mockLog()).filter((c) => c.method === "GET" && c.path.startsWith("/api/portal/sportiv/me/notices")).map((c) => c.path);
    expect((await lists()).some((p) => p.includes("seen"))).toBe(false);
    await item(page).click();
    await expect(page.getByRole("dialog", { name: "Mesaje" }).getByRole("heading", { level: 3 })).toHaveCount(2);
    await expect.poll(async() => (await lists()).filter((p) => p.endsWith("?seen=1")).length).toBe(1);
  });

  test("a failed list load keeps the shell", async({ page }) => {
    await mockState({ noticesDown: true });
    await loginSportiv(page);
    await page.goto(`/${ANA}`);
    await expect(item(page)).toBeVisible();
    await expect(item(page)).not.toContainText(/\d/);
    await item(page).click();
    await expect(page.getByRole("dialog", { name: "Mesaje" })).toContainText("Nu am putut încărca datele.");
  });
});

test.describe("phone", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("no bell in the header", async({ page }) => {
    await loginSportiv(page);
    await page.goto(`/${ANA}`);
    await expect(page.getByRole("button", { name: /^Ana/ })).toBeVisible();
    await expect(page.getByRole("button", { name: /^Mesaje/ })).toHaveCount(0);
  });

  test("the account button shows the count", async({ page }) => {
    await loginSportiv(page);
    await page.goto(`/${ANA}`);
    const button = page.getByRole("button", { name: /^Ana/ });
    await expect(button).toContainText("2");
  });

  test("the sheet's first row is Mesaje with the counter, then the athletes", async({ page }) => {
    await loginSportiv(page);
    await page.goto(`/${ANA}`);
    await page.getByRole("button", { name: /^Ana/ }).click();
    const sheet = page.getByRole("dialog", { name: "Alege sportivul" });
    const row = sheet.getByRole("button", { name: /^Mesaje/ });
    await expect(row).toContainText("2");
    const first = await sheet.evaluate((el) => {
      const all = [...el.querySelectorAll("button, a")];
      return all[0]?.textContent?.startsWith("Mesaje") ?? false;
    });
    expect(first).toBe(true);
    await expect(sheet.getByRole("link", { name: /Ana/ })).toBeVisible();
  });

  test("Mesaje opens the list as a sheet and closing a card updates both counters", async({ page }) => {
    await loginSportiv(page);
    await page.goto(`/${ANA}`);
    await page.getByRole("button", { name: /^Ana/ }).click();
    await page.getByRole("dialog", { name: "Alege sportivul" }).getByRole("button", { name: /^Mesaje/ }).click();
    const list = page.getByRole("dialog", { name: "Mesaje" });
    await expect(list.getByRole("heading", { level: 3 })).toHaveCount(2);
    // The account sheet closed first, so the sheets do not stack.
    await expect(page.getByRole("dialog", { name: "Alege sportivul" })).toHaveCount(0);
    await list.getByRole("button", { name: "Închide" }).first().click();
    await expect(list.getByRole("heading", { level: 3 })).toHaveCount(1);
    await expect(page.locator("header button").filter({ hasText: "Ana" })).toContainText("1");
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog", { name: "Mesaje" })).toHaveCount(0);
    await page.getByRole("button", { name: /^Ana/ }).click();
    await expect(page.getByRole("dialog", { name: "Alege sportivul" }).getByRole("button", { name: /^Mesaje/ })).toContainText("1");
  });
});
