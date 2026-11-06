import { expect, test } from "@playwright/test";
import { COACH_BASE, TODAY, loginAs, mockLog, mockReset } from "./portal-helpers";

test.use({ baseURL: COACH_BASE, viewport: { width: 390, height: 844 } });
test.beforeEach(async() => { await mockReset(); });

const searchCalls = async() => (await mockLog()).filter((c) => c.path.includes("/athletes/search"));

test("the search waits for three letters, picks two athletes and adds them from today", async({ page }) => {
  await loginAs(page);
  await page.goto("/grupe/gavansati/adauga");
  await expect(page.getByRole("heading", { name: "Adaugă în Avansați" })).toBeVisible();
  await page.getByLabel("Caută după nume").fill("An");
  await page.waitForTimeout(500);
  expect(await searchCalls()).toHaveLength(0);
  await page.getByLabel("Caută după nume").fill("Ana");
  await expect(page.getByRole("button", { name: "Ana Bălan, 9 ani" })).toBeVisible();
  await page.getByRole("button", { name: "Ana Bălan, 9 ani" }).click();
  await page.getByRole("button", { name: /Diana Ilie/ }).click();
  await expect(page.getByRole("button", { name: "Adaugă 2 sportivi" })).toBeVisible();
  await page.getByRole("button", { name: "Adaugă 2 sportivi" }).click();
  await expect(page).toHaveURL(/\/grupe\/gavansati$/);
  const post = (await mockLog()).find((c) => c.method === "POST" && c.path.endsWith("/groups/gavansati/members"));
  const body = post?.body as { athleteIds: string[]; from: string };
  expect(body.athleteIds).toHaveLength(2);
  expect(body.from).toBe(TODAY);
  await expect(page.getByText("Sportivi (11)")).toBeVisible();
  await expect(page.getByText("Ana Bălan")).toBeVisible();
});

test("a new athlete needs only a name", async({ page }) => {
  await loginAs(page);
  await page.goto("/grupe/gavansati/adauga");
  await page.getByRole("link", { name: /Nu e în listă: sportiv nou/ }).click();
  await expect(page.getByRole("heading", { name: "Sportiv nou" })).toBeVisible();
  const submit = page.getByRole("button", { name: "Adaugă în Avansați" });
  await expect(submit).toBeDisabled();
  await page.getByLabel("Nume și prenume").fill("Zoe Pavel");
  await submit.click();
  await expect(page).toHaveURL(/\/grupe\/gavansati$/);
  await expect(page.getByText("Salvat.")).toBeVisible();
  const post = (await mockLog()).find((c) => c.method === "POST" && c.path.endsWith("/coach/athletes"));
  expect(post?.body).toEqual({ groupId: "gavansati", name: "Zoe Pavel" });
});

test("the card of an own child shows the contact and a call link", async({ page }) => {
  await loginAs(page);
  await page.goto("/sportiv/amaria");
  await expect(page.getByRole("heading", { name: "Maria Ionescu" })).toBeVisible();
  await expect(page.getByText("11 ani")).toBeVisible();
  await expect(page.getByText("Contact")).toBeVisible();
  await expect(page.getByRole("link", { name: "Sună" })).toHaveAttribute("href", "tel:0722000222");
});

test("the card of a stand-in child has no contact", async({ page }) => {
  await loginAs(page);
  await page.goto("/sportiv/adara");
  await expect(page.getByRole("heading", { name: "Dara Constantin" })).toBeVisible();
  await expect(page.getByText("Contact")).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Sună" })).toHaveCount(0);
});
