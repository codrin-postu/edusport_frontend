import { expect, test } from "@playwright/test";
import { mockLog, mockReset, mockState } from "./portal-helpers";
import { SPORTIV_BASE, loginSportiv } from "./sportiv-helpers";

const ANA = "athana0001";

test.use({ baseURL: SPORTIV_BASE, viewport: { width: 390, height: 844 } });
test.beforeEach(async({ page }) => {
  await mockReset();
  await loginSportiv(page);
});

test("the give button shows the pins left and is hidden with none", async({ page }) => {
  await page.goto(`/${ANA}/parcurs`);
  await expect(page.getByRole("button", { name: "Dă o insignă (2)" })).toBeVisible();

  await mockState({ pinsLeft: 0 });
  await page.reload();
  await expect(page.getByRole("heading", { name: "Prietenie", level: 2 })).toBeVisible();
  await expect(page.getByRole("button", { name: /Dă o insignă/ })).toHaveCount(0);
});

test("giving a pin sends the design and the friend, and the count drops", async({ page }) => {
  await page.goto(`/${ANA}/parcurs`);
  await page.getByRole("button", { name: "Dă o insignă (2)" }).click();
  const dialog = page.getByRole("dialog");
  const send = dialog.getByRole("button", { name: "Trimite" });
  await expect(send).toBeDisabled();

  await dialog.getByRole("button", { name: "Insigna 5" }).click();
  await expect(dialog.getByText("Mă bucur că ești în echipă.")).toBeVisible();
  await dialog.getByRole("button", { name: "Selectează" }).click();
  await page.getByRole("menuitemradio", { name: "Ana P." }).click();
  await expect(send).toBeEnabled();
  await send.click();

  await expect(dialog).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Dă o insignă (1)" })).toBeVisible();
  const posts = (await mockLog()).filter((c) => c.method === "POST" && c.path.endsWith("/pins"));
  expect(posts.map((c) => c.body)).toEqual([{ recipientId: "athanap0001", design: 5 }]);
});

test("Renunță closes without sending", async({ page }) => {
  await page.goto(`/${ANA}/parcurs`);
  await page.getByRole("button", { name: "Dă o insignă (2)" }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Renunță" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  expect((await mockLog()).filter((c) => c.method === "POST" && c.path.endsWith("/pins"))).toHaveLength(0);
});

async function giveToAna(page: import("@playwright/test").Page) {
  await page.goto(`/${ANA}/parcurs`);
  await page.getByRole("button", { name: "Dă o insignă (2)" }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("button", { name: "Selectează" }).click();
  await page.getByRole("menuitemradio", { name: "Ana P." }).click();
  await dialog.getByRole("button", { name: "Trimite" }).click();
  return dialog;
}

test("NO_PINS_LEFT shows its one line and keeps the dialog open", async({ page }) => {
  await mockState({ givePinsGone: true });
  const dialog = await giveToAna(page);
  await expect(dialog.getByRole("alert")).toHaveText("Nu mai ai insigne.");
});

test("any other failure shows the portal's generic line", async({ page }) => {
  await mockState({ giveBroken: true });
  const dialog = await giveToAna(page);
  await expect(dialog.getByRole("alert")).toHaveText("Nu am putut încărca datele.");
});
