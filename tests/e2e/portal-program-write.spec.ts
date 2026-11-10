import { expect, test, type Locator, type Page } from "@playwright/test";
import { COACH_BASE, TODAY, loginAs, mockLog, mockReset } from "./portal-helpers";

test.beforeEach(async() => { await mockReset(); });

const SIZES = [{ width: 390, height: 844 }, { width: 1280, height: 900 }];

const calls = async(method: string, tail: RegExp) => (await mockLog()).filter((c) => c.method === method && tail.test(c.path));
const dateRow = (page: Page, word: string, day: string): Locator => page.getByRole("button", { name: new RegExp(`^${word}\\s*${day}\\s`, "i") });
const dialog = (page: Page): Locator => page.getByRole("dialog");
const block = (page: Page, word: string, day: string): Locator => page.locator("[data-date-block]").filter({ hasText: new RegExp(`^${word}\\s*${day}$`, "i") });

async function typeDate(page: Page, label: string, ddmmyyyy: string): Promise<void> {
  await dialog(page).getByRole("group", { name: label }).getByRole("spinbutton").first().click();
  await page.keyboard.type(ddmmyyyy);
}

/** A write through the BFF from the page (setup, and the refusals the form never lets through). */
async function bff(page: Page, method: string, path: string, body?: unknown): Promise<{ status: number; json: { error?: { message: string } } | null }> {
  return page.evaluate(async({ method: m, path: p, body: b }) => {
    const res = await fetch(`/api/portal/coach/${p}`, { method: m, headers: { "content-type": "application/json" }, body: b === undefined ? undefined : JSON.stringify(b) });
    return { status: res.status, json: await res.json().catch(() => null) };
  }, { method, path, body });
}

for (const size of SIZES) {
  test.describe(`Program writes ${size.width}`, () => {
    test.use({ baseURL: COACH_BASE, viewport: size, timezoneId: "Europe/Bucharest" });

    test("an open date: Anulează with a note, then the row reads Anulată", async({ page }) => {
      await loginAs(page);
      await page.goto("/grupe/gavansati?tab=program");
      await dateRow(page, "Mar", "10").click();
      const d = dialog(page);
      await expect(d.getByRole("heading", { name: "Marți, 10 noiembrie, 18:15" })).toBeVisible();
      await expect(d.getByText("Schimbi doar această dată. Programul săptămânal rămâne.")).toBeVisible();
      await expect(d.getByRole("radio", { name: /^Anulează/ })).toHaveAttribute("aria-checked", "true");
      await expect(d.getByLabel("Notă")).toBeVisible();
      for (const name of [/^Anulează/, /^Mută/, /^Șterge/]) await expect(d.getByRole("radio", { name })).toBeVisible();
      await expect(d.getByRole("radio", { name: /^Se ține/ })).toHaveCount(0);
      await expect(d.locator("[role=radio] span[aria-hidden]").first()).toHaveCSS("border-top-left-radius", "0px");
      const box = (await d.boundingBox())!;
      if (size.width >= 900) {
        expect(Math.round(box.width)).toBe(460);
        expect(Math.abs(box.x + box.width / 2 - size.width / 2)).toBeLessThan(2);
      } else {
        expect(Math.round(box.y + box.height)).toBe(size.height);
      }
      // The footer stays in view and the changes wait for Salvează.
      await d.getByLabel("Notă").fill("Patinoarul este închis.");
      await d.getByRole("button", { name: "Renunță" }).click();
      await expect(d).toHaveCount(0);
      expect(await calls("PUT", /\/dates\//)).toHaveLength(0);
      await dateRow(page, "Mar", "10").click();
      await expect(d.getByLabel("Notă")).toHaveValue("");
      await d.getByLabel("Notă").fill("Patinoarul este închis.");
      await expect(d.getByRole("button", { name: "Salvează" })).toBeInViewport();
      await d.getByRole("button", { name: "Salvează" }).click();
      await expect(page.getByText("Ședința din 10 noiembrie a fost anulată.")).toBeVisible();
      const put = (await calls("PUT", /\/program\/[^/]+\/dates\//))[0];
      expect(put?.path).toMatch(/\/program\/evavansati\/dates\/2026-11-10$/);
      expect(put?.body).toEqual({ mode: "cancel", reason: "Patinoarul este închis." });
      await expect(block(page, "Mar", "10").locator("xpath=../..").locator("[data-end-block]")).toHaveText("Anulată");
      // A cancelled row opens again with its note, and "Se ține" brings the date back.
      await dateRow(page, "Mar", "10").click();
      await expect(d.getByRole("radio", { name: /^Anulează/ })).toHaveAttribute("aria-checked", "true");
      await expect(d.getByLabel("Notă")).toHaveValue("Patinoarul este închis.");
      await d.getByRole("radio", { name: /^Se ține/ }).click();
      await d.getByRole("button", { name: "Salvează" }).click();
      await expect(page.getByText("Ședința din 10 noiembrie se ține.")).toBeVisible();
      expect((await calls("PUT", /\/dates\//)).at(-1)?.body).toEqual({ mode: "keep" });
      await expect(block(page, "Mar", "10").locator("xpath=../..").locator("[data-end-block]")).toHaveCount(0);
    });

    test("Mută sends the new date and time", async({ page }) => {
      await loginAs(page);
      await page.goto("/grupe/gavansati?tab=program");
      await dateRow(page, "Mar", "10").click();
      const d = dialog(page);
      await d.getByRole("radio", { name: /^Mută/ }).click();
      await expect(d.getByRole("group", { name: "Data nouă" })).toBeVisible();
      await expect(d.getByLabel("Ora")).toBeVisible();
      await typeDate(page, "Data nouă", "12112026");
      await d.getByLabel("Ora").fill("18:15");
      await d.getByRole("button", { name: "Salvează" }).click();
      await expect(page.getByText("Ședința din 10 noiembrie a fost mutată.")).toBeVisible();
      expect((await calls("PUT", /\/dates\//))[0]?.body).toEqual({ mode: "move", newDate: "2026-11-12", newStartTime: "18:15", reason: null });
      await expect(dateRow(page, "Joi", "12")).toContainText("mutată din marți, 10 noiembrie");
      // A moved row is clickable and opens on Mută with its values.
      await dateRow(page, "Joi", "12").click();
      await expect(d.getByRole("radio", { name: /^Mută/ })).toHaveAttribute("aria-checked", "true");
      await expect(d.getByLabel("Ora")).toHaveValue("18:15");
      await expect(d.getByRole("radio", { name: /^Se ține/ })).toBeVisible();
    });

    test("Șterge on a series date removes it", async({ page }) => {
      await loginAs(page);
      await page.goto("/grupe/gavansati?tab=program");
      await dateRow(page, "Mar", "10").click();
      await dialog(page).getByRole("radio", { name: /^Șterge/ }).click();
      await dialog(page).getByRole("button", { name: "Salvează" }).click();
      await expect(page.getByText("Ședința din 10 noiembrie a fost ștearsă.")).toBeVisible();
      expect((await calls("PUT", /\/dates\//))[0]?.body).toEqual({ mode: "remove" });
      await expect(block(page, "Mar", "10")).toHaveCount(0);
    });

    test("a date with a saved session refuses a delete in the sheet", async({ page }) => {
      await loginAs(page);
      // Thursday is today and has a saved session; a Thursday program makes it a series date.
      expect((await bff(page, "POST", "groups/gavansati/program", { repeat: true, freq: "weekly", days: ["thu"], startTime: "18:15", durationMin: 60, from: TODAY })).status).toBe(200);
      await page.goto("/grupe/gavansati?tab=program");
      await dateRow(page, "Joi", "5").click();
      const d = dialog(page);
      await d.getByRole("radio", { name: /^Șterge/ }).click();
      await d.getByRole("button", { name: "Salvează" }).click();
      await expect(d.getByText("Data are prezența salvată. Poți doar să o anulezi.")).toBeVisible();
      await expect(d).toBeVisible();
      // The same refusal for a one-off class of that day.
      await d.getByRole("button", { name: "Renunță" }).click();
      expect((await bff(page, "POST", "groups/gavansati/program", { repeat: false, date: TODAY, startTime: "19:30", durationMin: 60 })).status).toBe(200);
      await page.reload();
      await dateRow(page, "Joi", "5").filter({ hasText: "19:30" }).click();
      await d.getByRole("radio", { name: /^Șterge/ }).click();
      await d.getByRole("button", { name: "Salvează" }).click();
      await expect(d.getByText("Data are prezența salvată. Poți doar să o anulezi.")).toBeVisible();
    });

    test("Șterge on a one-off class deletes the class", async({ page }) => {
      await loginAs(page);
      const added = await bff(page, "POST", "groups/gavansati/program", { repeat: false, date: "2026-11-12", startTime: "19:00", durationMin: 60 });
      expect(added.status).toBe(200);
      await page.goto("/grupe/gavansati?tab=program");
      await dateRow(page, "Joi", "12").click();
      await dialog(page).getByRole("radio", { name: /^Șterge/ }).click();
      await dialog(page).getByRole("button", { name: "Salvează" }).click();
      await expect(page.getByText("Ședință ștearsă.")).toBeVisible();
      const del = (await calls("DELETE", /\/program\/[^/]+$/))[0];
      expect(del?.path).toMatch(/\/program\/evnew\d+$/);
      await expect(block(page, "Joi", "12")).toHaveCount(0);
    });

    test("Schimbă programul of one weekday", async({ page }) => {
      await loginAs(page);
      await page.goto("/grupe/gavansati?tab=program");
      await page.getByRole("button", { name: "Schimbă programul de marți" }).click();
      const d = dialog(page);
      await expect(d.getByRole("heading", { name: "Schimbă programul" })).toBeVisible();
      await expect(d.getByText("Marți, 18:15. Datele de dinainte rămân cum au fost.")).toBeVisible();
      await expect(d.getByRole("checkbox", { name: "Ma" })).toHaveAttribute("aria-checked", "true");
      await expect(d.getByRole("checkbox", { name: "Mi" })).toHaveAttribute("aria-checked", "false");
      await expect(d.getByLabel("Ora")).toHaveValue("18:15");
      await expect(d.getByRole("group", { name: "Se aplică din" })).toBeVisible();
      // Renunță drops the draft without a request.
      await d.getByLabel("Ora").fill("17:00");
      await d.getByRole("button", { name: "Renunță" }).click();
      await expect(d).toHaveCount(0);
      expect(await calls("PUT", /\/program\/[^/]+$/)).toHaveLength(0);
      await page.getByRole("button", { name: "Schimbă programul de marți" }).click();
      await expect(d.getByLabel("Ora")).toHaveValue("18:15");
      await d.getByLabel("Ora").fill("18:00");
      await d.getByRole("button", { name: "Schimbă", exact: true }).click();
      await expect(page.getByText("Program schimbat.")).toBeVisible();
      const put = (await calls("PUT", /\/program\/[^/]+$/))[0];
      expect(put?.body).toEqual({ freq: "weekly", days: ["tue"], startTime: "18:00", durationMin: 60, from: "2026-11-10", day: "tue" });
      await expect(page.getByText("Marți, 18:00", { exact: true }).first()).toBeVisible();
      await expect(page.getByText("Miercuri, 18:15", { exact: true }).first()).toBeVisible();
    });

    test("Șterge programul of one weekday", async({ page }) => {
      await loginAs(page);
      await page.goto("/grupe/gavansati?tab=program");
      await page.getByRole("button", { name: "Șterge programul de miercuri" }).click();
      const d = dialog(page);
      await expect(d.getByRole("heading", { name: "Ștergi programul de miercuri?" })).toBeVisible();
      await expect(d.getByText("Ședințele și prezențele de până atunci rămân. După data aleasă nu mai apare.")).toBeVisible();
      await expect(d.getByRole("group", { name: "Din data" })).toBeVisible();
      await d.getByRole("button", { name: "Renunță" }).click();
      expect(await calls("POST", /\/end$/)).toHaveLength(0);
      await page.getByRole("button", { name: "Șterge programul de miercuri" }).click();
      await d.getByRole("button", { name: "Șterge programul" }).click();
      await expect(page.getByText("Program șters.")).toBeVisible();
      // The cancelled Wednesday 11 November is skipped: the next Wednesday date is 18 November.
      const post = (await calls("POST", /\/program\/evavansati\/end$/))[0];
      expect(post?.body).toEqual({ from: "2026-11-18", day: "wed" });
      await expect(page.getByText("Miercuri, 18:15", { exact: true })).toHaveCount(0);
      await expect(page.getByText("Marți, 18:15", { exact: true }).first()).toBeVisible();
    });

    test("past dates are refused", async({ page }) => {
      await loginAs(page);
      await page.goto("/grupe/gavansati?tab=program");
      const past = "2026-11-04";
      expect((await bff(page, "POST", "program/evavansati/end", { from: past, day: "tue" })).status).toBe(400);
      expect((await bff(page, "PUT", "program/evavansati", { freq: "weekly", days: ["tue"], startTime: "18:00", durationMin: 60, from: past, day: "tue" })).status).toBe(400);
      expect((await bff(page, "PUT", `program/evavansati/dates/${past}`, { mode: "cancel" })).status).toBe(400);
      // The sheets do not confirm a date before today.
      await page.getByRole("button", { name: "Șterge programul de marți" }).click();
      await typeDate(page, "Din data", "01112026");
      await expect(dialog(page).getByRole("button", { name: "Șterge programul" })).toBeDisabled();
      await typeDate(page, "Din data", "10112026");
      await expect(dialog(page).getByRole("button", { name: "Șterge programul" })).toBeEnabled();
    });

    test("the Scoala group has no program buttons", async({ page }) => {
      await loginAs(page);
      await page.goto("/grupe/gprimii?tab=program");
      await expect(page.getByText("Programul Școlii îl schimbă administratorul.")).toBeVisible();
      await expect(page.getByRole("link", { name: "+ Adaugă program" })).toHaveCount(0);
      await expect(page.getByRole("button", { name: /^Mar\s*\d+\s/i })).toHaveCount(0);
    });
  });
}
