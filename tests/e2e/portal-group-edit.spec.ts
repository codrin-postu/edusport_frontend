import { expect, test, type Page } from "@playwright/test";
import { COACH_BASE, TODAY, loginAs, mockLog, mockReset, mockState } from "./portal-helpers";

test.use({ baseURL: COACH_BASE, viewport: { width: 390, height: 844 } });
test.beforeEach(async() => { await mockReset(); });

const SIZES = [{ width: 390, height: 844 }, { width: 1280, height: 900 }];
const posts = async(tail: RegExp) => (await mockLog()).filter((c) => c.method === "POST" && tail.test(c.path));

/** The i-th member row's button (rows follow the fixture order). */
const rowButton = (page: Page, name: "Mută" | "Scoate", i: number) => page.getByRole("button", { name: new RegExp(`^${name} `) }).nth(i);

async function typeDate(page: Page, label: string, ddmmyyyy: string): Promise<void> {
  const field = page.getByRole("dialog").getByRole("group", { name: label });
  await field.getByRole("spinbutton").first().click();
  await page.keyboard.type(ddmmyyyy);
}

for (const size of SIZES) {
  test.describe(`Modifică grupa ${size.width}`, () => {
    test.use({ viewport: size, timezoneId: "Europe/Bucharest" });

    test("header, rows and both sheets", async({ page }) => {
      await loginAs(page);
      await page.goto("/grupe/gavansati/modifica");
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("h1")).toHaveText("Modifică grupa");
      await expect(page.getByText("Avansați, 9 sportivi").locator("visible=true")).toBeVisible();
      await expect(page.getByRole("link", { name: "‹ Avansați" })).toHaveAttribute("href", "/grupe/gavansati");
      await expect(page.getByRole("button", { name: /^Mută / })).toHaveCount(9);
      await expect(page.getByRole("button", { name: /^Scoate / })).toHaveCount(9);
      const add = page.getByRole("link", { name: "+ Adaugă sportiv" }).locator("visible=true");
      await expect(add).toHaveAttribute("href", "/grupe/gavansati/adauga");
      await expect(page.getByRole("link", { name: "Gata" }).locator("visible=true")).toHaveAttribute("href", "/grupe/gavansati");

      await rowButton(page, "Mută", 0).click();
      const sheet = page.getByRole("dialog");
      await expect(sheet.getByRole("heading", { name: "Muți pe Maria Ionescu în altă grupă" })).toBeVisible();
      await expect(sheet.getByText("Prezențele de până acum rămân în Avansați.")).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(sheet).toHaveCount(0);
      await expect(rowButton(page, "Mută", 0)).toBeFocused();

      await rowButton(page, "Scoate", 1).click();
      await expect(sheet.getByRole("heading", { name: "Scoți pe Luca Dumitru din grupă?" })).toBeVisible();
      await expect(sheet.getByText("Prezențele de până acum rămân. Nu mai apare la ședințele grupei.")).toBeVisible();
    });
  });
}

test("Mută offers only own groups and posts the target and the date", async({ page }) => {
  await loginAs(page);
  await page.goto("/grupe/gavansati/modifica");
  await rowButton(page, "Mută", 0).click();
  const sheet = page.getByRole("dialog");
  await sheet.getByLabel("Grupa nouă").click();
  const options = page.getByRole("menuitemradio");
  await expect(options).toHaveText(["Primii Pași"]);
  await options.first().click();
  await expect(sheet.getByLabel("Grupa nouă")).toContainText("Primii Pași");
  await sheet.getByRole("button", { name: "Mută", exact: true }).click();
  await expect(page.getByText("Salvat.")).toBeVisible();
  await expect(sheet).toHaveCount(0);
  const call = (await posts(/\/groups\/gavansati\/members\/amaria\/move$/))[0];
  expect(call?.body).toEqual({ toGroupId: "gprimii", from: TODAY });
  await expect(page.getByText("Maria Ionescu")).toHaveCount(0);
  await expect(page.getByText("Avansați, 8 sportivi").locator("visible=true")).toBeVisible();
});

test("Scoate from a later date keeps the row and marks it until that day", async({ page }) => {
  await loginAs(page);
  await page.goto("/grupe/gavansati/modifica");
  await rowButton(page, "Scoate", 1).click();
  await typeDate(page, "Din data", "20112026");
  await page.getByRole("dialog").getByRole("button", { name: "Scoate din grupă" }).click();
  await expect(page.getByText("Salvat.")).toBeVisible();
  const call = (await posts(/\/groups\/gavansati\/members\/aluca\/remove$/))[0];
  expect(call?.body).toEqual({ from: "2026-11-20" });
  await expect(page.getByText("Luca Dumitru")).toBeVisible();
  await expect(page.getByText("10 ani, până pe 20 noi")).toBeVisible();
  await page.goto("/grupe/gavansati");
  await expect(page.locator("a[href^='/sportiv/aluca']")).toContainText("10 ani, până pe 20 noi");
});

test("an earlier date is refused before anything is sent", async({ page }) => {
  await loginAs(page);
  await page.goto("/grupe/gavansati/modifica");
  await rowButton(page, "Scoate", 1).click();
  const sheet = page.getByRole("dialog");
  await typeDate(page, "Din data", "01112026");
  await expect(sheet.getByRole("alert")).toHaveText("Alege o dată de azi încolo.");
  await expect(sheet.getByRole("button", { name: "Scoate din grupă" })).toBeDisabled();
  expect(await posts(/\/remove$/)).toHaveLength(0);
});

test("Scoate from today removes the row only after the server answered", async({ page }) => {
  await loginAs(page);
  await page.goto("/grupe/gavansati/modifica");
  await rowButton(page, "Scoate", 1).click();
  await expect(page.getByText("Luca Dumitru")).toHaveCount(2);
  await page.getByRole("dialog").getByRole("button", { name: "Scoate din grupă" }).click();
  await expect(page.getByText("Salvat.")).toBeVisible();
  await expect(page.getByText("Luca Dumitru")).toHaveCount(0);
  expect((await posts(/\/aluca\/remove$/))[0]?.body).toEqual({ from: TODAY });
});

test("a refusal shows inline and the row stays", async({ page }) => {
  await page.route("**/api/portal/coach/groups/gavansati/members/*/remove", (route) => route.fulfill({
    status: 409, json: { error: { message: "Datele s-au schimbat. Reîncarcă pagina." } },
  }));
  await loginAs(page);
  await page.goto("/grupe/gavansati/modifica");
  await rowButton(page, "Scoate", 1).click();
  const sheet = page.getByRole("dialog");
  await sheet.getByRole("button", { name: "Scoate din grupă" }).click();
  await expect(sheet.getByRole("alert")).toHaveText("Datele s-au schimbat. Reîncarcă pagina.");
  await expect(sheet).toBeVisible();
  await sheet.getByRole("button", { name: "Renunță" }).click();
  await expect(sheet).toHaveCount(0);
  await expect(page.getByText("Luca Dumitru")).toBeVisible();
});

test("a forged move to another coach's group answers 403 and nothing changes", async({ page }) => {
  await loginAs(page);
  await page.goto("/grupe/gavansati/modifica");
  const res = await page.evaluate(async() => {
    const r = await fetch("/api/portal/coach/groups/gavansati/members/amaria/move", {
      method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ toGroupId: "gsilver", from: "2026-11-05" }),
    });
    return { status: r.status, body: await r.json() };
  });
  expect(res.status).toBe(403);
  expect(res.body.error.message).toBe("Nu mai ai acces la această grupă.");
  await page.reload();
  await expect(page.getByText("Maria Ionescu")).toBeVisible();
  await expect(page.getByText("Avansați, 9 sportivi").locator("visible=true")).toBeVisible();
});

test("without another own group the sheet says so", async({ page }) => {
  await page.route("**/api/portal/coach/groups", (route) => route.fulfill({
    json: { mine: [{ groupId: "gavansati", name: "Avansați", kind: "club", program: ["Ma, Mi 18:15"], children: 9, next: null }], others: [] },
  }));
  await loginAs(page);
  await page.goto("/grupe/gavansati/modifica");
  await rowButton(page, "Mută", 0).click();
  const sheet = page.getByRole("dialog");
  await expect(sheet.getByText("Nu ai altă grupă în care să-l muți.")).toBeVisible();
  await expect(sheet.getByRole("button", { name: "Mută", exact: true })).toHaveCount(0);
  await expect(sheet.getByRole("button", { name: "Renunță" })).toBeVisible();
});

test("another coach's group redirects to its page", async({ page }) => {
  await loginAs(page);
  await page.goto("/grupe/gsilver/modifica");
  await expect(page).toHaveURL(/\/grupe\/gsilver$/);
  await expect(page.getByRole("heading", { name: "Intermediari Silver" })).toBeVisible();
});

test("a double click on Scoate din grupă sends one request", async({ page }) => {
  await loginAs(page);
  await page.goto("/grupe/gavansati/modifica");
  await rowButton(page, "Scoate", 1).click();
  await page.getByRole("dialog").getByRole("button", { name: "Scoate din grupă" }).dblclick();
  await expect(page.getByText("Salvat.")).toBeVisible();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  expect(await posts(/\/aluca\/remove$/)).toHaveLength(1);
});

test("a double click on Mută sends one request", async({ page }) => {
  await loginAs(page);
  await page.goto("/grupe/gavansati/modifica");
  await rowButton(page, "Mută", 0).click();
  await page.getByRole("dialog").getByRole("button", { name: "Mută", exact: true }).dblclick();
  await expect(page.getByText("Salvat.")).toBeVisible();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  expect(await posts(/\/amaria\/move$/)).toHaveLength(1);
});

test("after a save the list updates in place and the focus stays on a row button", async({ page }) => {
  await loginAs(page);
  await page.goto("/grupe/gavansati/modifica");
  await expect(page.getByText("Luca Dumitru")).toBeVisible();
  await page.evaluate(() => {
    const w = window as unknown as { __spinner: number };
    w.__spinner = 0;
    new MutationObserver(() => { if (document.querySelector("[data-spinner]")) w.__spinner += 1; }).observe(document.body, { childList: true, subtree: true });
  });
  await rowButton(page, "Scoate", 1).click();
  await page.getByRole("dialog").getByRole("button", { name: "Scoate din grupă" }).click();
  await expect(page.getByText("Luca Dumitru")).toHaveCount(0);
  await expect(page.getByText("Avansați, 8 sportivi").locator("visible=true")).toBeVisible();
  expect(await page.evaluate(() => (window as unknown as { __spinner: number }).__spinner)).toBe(0);
  await expect(page.locator("[data-roster-move]").nth(1)).toBeFocused();
});

test("the server answers 400, 403 and 409 as the backend does", async({ page }) => {
  await mockState({ inactiveGroups: ["gprimii"] });
  await loginAs(page);
  await page.goto("/grupe/gavansati/modifica");
  const send = (path: string, body: unknown) => page.evaluate(async({ p, b }) => {
    const r = await fetch(`/api/portal/coach/groups/gavansati/members/${p}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(b) });
    return { status: r.status, message: (await r.json()).error?.message as string };
  }, { p: path, b: body });
  expect((await send("amaria/remove", { from: "2027-06-01" })).status).toBe(400);
  expect((await send("amaria/move", { toGroupId: "gprimii", from: TODAY })).status).toBe(400);
  expect((await send("amaria/remove", { from: "2026-12-01" })).status).toBe(200);
  const again = await send("amaria/remove", { from: "2026-12-02" });
  expect(again.status).toBe(409);
  expect(again.message).toBe("Datele s-au schimbat. Reîncarcă pagina.");
});
