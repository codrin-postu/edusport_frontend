import { expect, test, type Page } from "@playwright/test";
import { COACH_BASE, loginAs, mockLog, mockReset, mockState } from "./portal-helpers";

test.beforeEach(async() => { await mockReset(); });
test.use({ baseURL: COACH_BASE, viewport: { width: 1280, height: 900 } });

const parcursCalls = async() => (await mockLog()).filter((c) => c.path.includes("/parcurs") || c.path.includes("/awards"));

async function openParcurs(page: Page) {
  await loginAs(page);
  await page.goto("/sportiv/amaria");
  const header = page.locator("button[aria-expanded]").filter({ hasText: "Parcurs" });
  await header.click();
  await expect(page.getByRole("heading", { name: "Prietenie", level: 2, exact: true })).toBeVisible();
  return header;
}

async function awardLutzDouble(page: Page) {
  await page.getByRole("button", { name: "Dă o insignă", exact: true }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("button", { name: "Selectează" }).click();
  await page.getByRole("menuitemradio", { name: "Săritură" }).click();
  await dialog.getByRole("button", { name: "Selectează" }).first().click();
  await page.getByRole("menuitemradio", { name: "Lutz" }).click();
  await dialog.getByRole("button", { name: "Selectează" }).click();
  await page.getByRole("menuitemradio", { name: "Dublu" }).click();
  await dialog.getByRole("button", { name: "Acordă", exact: true }).click();
  return dialog;
}

test("Parcurs is collapsed and fetched on the first open, with the friendship pins received", async({ page }) => {
  await loginAs(page);
  await page.goto("/sportiv/amaria");
  const header = page.locator("button[aria-expanded]").filter({ hasText: "Parcurs" });
  await expect(header).toHaveAttribute("aria-expanded", "false");
  expect(await parcursCalls()).toEqual([]);
  await header.click();
  await expect(page.getByRole("button", { name: "Bate palma!, Matei V." })).toBeVisible();
  expect((await parcursCalls()).map((c) => c.path)).toEqual(["/api/portal/coach/athletes/amaria/parcurs"]);
  await header.click();
  await expect(header).toHaveAttribute("aria-expanded", "false");
});

test("awarding Săritură, Lutz, Dublu earns the double and the single Lutz; removing returns them to grey", async({ page }) => {
  await openParcurs(page);
  await expect(page.getByRole("button", { name: "Dublu Lutz, blocat" })).toBeVisible();
  const dialog = await awardLutzDouble(page);
  await expect(dialog).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Dublu Lutz", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Simplu Lutz", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Triplu Lutz, blocat" })).toBeVisible();
  const posts = (await mockLog()).filter((c) => c.method === "POST" && c.path.endsWith("/awards"));
  expect(posts.map((c) => c.body)).toEqual([{ kind: "jump", jump: "lz", level: 2 }]);

  await page.getByRole("button", { name: "Șterge" }).click();
  await expect(page.getByRole("button", { name: "Dublu Lutz, blocat" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Simplu Lutz, blocat" })).toBeVisible();
  const dels = (await mockLog()).filter((c) => c.method === "DELETE");
  expect(dels).toHaveLength(1);
});

test("the Steaua antrenorului award sends only its kind", async({ page }) => {
  await openParcurs(page);
  await page.getByRole("button", { name: "Dă o insignă", exact: true }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("button", { name: "Selectează" }).click();
  await page.getByRole("menuitemradio", { name: "Steaua antrenorului" }).click();
  await dialog.getByRole("button", { name: "Acordă", exact: true }).click();
  await expect(dialog).toHaveCount(0);
  const posts = (await mockLog()).filter((c) => c.method === "POST" && c.path.endsWith("/awards"));
  expect(posts.map((c) => c.body)).toEqual([{ kind: "steaua" }]);
});

test("the pins the athlete gave show without a remove button", async({ page }) => {
  await openParcurs(page);
  await expect(page.getByRole("heading", { name: "Prietenie date" })).toBeVisible();
  await expect(page.getByText("către Luca P.")).toBeVisible();
  await expect(page.getByRole("button", { name: "Șterge" })).toHaveCount(0);
});

test("Renunță closes without sending; a failed award keeps the dialog with the generic line", async({ page }) => {
  await openParcurs(page);
  await page.getByRole("button", { name: "Dă o insignă", exact: true }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Renunță" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  expect((await mockLog()).filter((c) => c.method === "POST" && c.path.endsWith("/awards"))).toHaveLength(0);

  await mockState({ awardBroken: true });
  const dialog = await awardLutzDouble(page);
  await expect(dialog.getByRole("alert")).toHaveText("Nu am putut încărca datele.");
});
