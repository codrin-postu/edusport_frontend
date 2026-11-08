import { expect, test } from "@playwright/test";
import { COACH_BASE, COACH_EMAIL, COACH_PASSWORD, isolate, mockReset, mockState } from "./portal-helpers";

test.use({ baseURL: COACH_BASE, viewport: { width: 390, height: 844 } });
test.beforeEach(async({ page }) => {
  await mockReset();
  await isolate(page);
});

const INVITE_OLD = "inv-old-00000000000000000000000000";
const INVITE_VALID = "inv-valid-0000000000000000000000";

async function noStrayText(page: import("@playwright/test").Page): Promise<void> {
  const text = await page.locator("body").innerText();
  expect(text).not.toMatch(/Email/);
  expect(text).not.toContain("·");
}

test("a wrong password shows the refusal and empties the password", async({ page }) => {
  await page.goto("/intrare");
  await page.getByLabel("E-mail").fill(COACH_EMAIL);
  await page.getByLabel("Parolă", { exact: true }).fill("wrong-password-1");
  await page.getByRole("button", { name: "Intră" }).click();
  await expect(page.getByRole("main").getByRole("alert")).toHaveText("E-mailul sau parola nu sunt corecte.");
  await expect(page.getByLabel("Parolă", { exact: true })).toHaveValue("");
  await expect(page.getByLabel("E-mail")).toHaveValue(COACH_EMAIL);
  await noStrayText(page);
});

test("the eye button shows the password", async({ page }) => {
  await page.goto("/intrare");
  const field = page.getByLabel("Parolă", { exact: true });
  await field.fill("abc");
  await expect(field).toHaveAttribute("type", "password");
  await page.getByRole("button", { name: "Arată parola" }).click();
  await expect(field).toHaveAttribute("type", "text");
  await expect(page.getByRole("button", { name: "Ascunde parola" })).toBeVisible();
});

test("inputs carry the right autocomplete", async({ page }) => {
  await page.goto("/intrare");
  await expect(page.getByLabel("E-mail")).toHaveAttribute("autocomplete", "email");
  await expect(page.getByLabel("Parolă", { exact: true })).toHaveAttribute("autocomplete", "current-password");
});

test("a good login lands on Azi", async({ page }) => {
  await page.goto("/intrare");
  await page.getByLabel("E-mail").fill(COACH_EMAIL);
  await page.getByLabel("Parolă", { exact: true }).fill(COACH_PASSWORD);
  await page.getByRole("button", { name: "Intră" }).click();
  await expect(page).toHaveURL(/localhost:3200\/$/);
  await expect(page.getByRole("link", { name: "Profil" }).first()).toHaveText("AP");
});

test("a signed in coach is moved off the login screen", async({ page }) => {
  await page.goto("/intrare");
  await page.getByLabel("E-mail").fill(COACH_EMAIL);
  await page.getByLabel("Parolă", { exact: true }).fill(COACH_PASSWORD);
  await page.getByRole("button", { name: "Intră" }).click();
  await expect(page).toHaveURL(/localhost:3200\/$/);
  await page.goto("/intrare");
  await expect(page).toHaveURL(/localhost:3200\/$/);
});

test("reset: an unknown e-mail gets the same text, the code logs in", async({ page }) => {
  await page.goto("/intrare");
  await page.getByRole("link", { name: "Am uitat parola" }).click();
  await expect(page).toHaveURL(/\/am-uitat-parola$/);
  await page.getByLabel("E-mail").fill("necunoscut@example.invalid");
  await page.getByRole("button", { name: "Trimite codul" }).click();
  await expect(page.getByText("Dacă adresa are cont, am trimis un cod.")).toBeVisible();
  const code = page.getByLabel("Cod din e-mail");
  await expect(code).toHaveAttribute("autocomplete", "one-time-code");
  await expect(code).toHaveAttribute("inputmode", "numeric");
  await expect(page.getByLabel("Parolă nouă")).toHaveAttribute("autocomplete", "new-password");
  await expect(page.getByRole("link", { name: "Înapoi la intrare" })).toBeVisible();
  await noStrayText(page);
});

test("reset: the mock code logs a known coach in", async({ page }) => {
  await page.goto("/am-uitat-parola");
  await page.getByLabel("E-mail").fill(COACH_EMAIL);
  await page.getByRole("button", { name: "Trimite codul" }).click();
  await page.getByLabel("Cod din e-mail").fill("123456");
  await page.getByLabel("Parolă nouă").fill("Alta-Parola-12345");
  await page.getByRole("button", { name: "Salvează parola" }).click();
  await expect(page).toHaveURL(/localhost:3200\/$/);
});

test("an old invite shows the expired text and no secret stays in the URL", async({ page }) => {
  await page.goto(`/invitatie/${INVITE_OLD}`);
  await expect(page).toHaveURL(/\/invitatie$/);
  await expect(page.getByText("Invitația a expirat. Cere administratorului una nouă.")).toBeVisible();
  await expect(page.getByRole("link", { name: "Înapoi la intrare" })).toBeVisible();
});

test("a failed invite read shows the load error, not the expired text", async({ page }) => {
  await mockState({ refuseSecret: true });
  await page.goto(`/invitatie/${INVITE_VALID}`);
  await expect(page.getByText("Nu am putut încărca datele.")).toBeVisible();
  await expect(page.getByText("Invitația a expirat.")).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Înapoi la intrare" })).toBeVisible();
});

test("no invite cookie shows the expired text", async({ page }) => {
  await page.goto("/invitatie");
  await expect(page.getByText("Invitația a expirat. Cere administratorului una nouă.")).toBeVisible();
});

test("a valid invite saves a password and lands on Azi", async({ page }) => {
  await page.goto(`/invitatie/${INVITE_VALID}`);
  expect(page.url()).not.toContain(INVITE_VALID);
  await expect(page.getByText("Bun venit")).toBeVisible();
  await expect(page.getByText("Contul tău: antrenor2@example.invalid")).toBeVisible();
  await expect(page.getByLabel("Parolă nouă")).toHaveAttribute("autocomplete", "new-password");
  await expect(page.getByRole("link", { name: "Continuă cu Google" })).toHaveAttribute("href", "/api/portal/google/start?invite=1");
  await noStrayText(page);
  await page.getByLabel("Parolă nouă").fill("doisprezece12");
  await page.getByRole("button", { name: "Salvează parola" }).click();
  await expect(page).toHaveURL(/localhost:3200\/$/);
});

test("without a Google client id there is no Google link", async({ page }) => {
  await mockState({ googleClientId: null });
  await page.goto("/intrare");
  await expect(page.getByRole("button", { name: "Intră" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Continuă cu Google" })).toHaveCount(0);
  await page.goto(`/invitatie/${INVITE_VALID}`);
  await expect(page.getByText("Contul tău: antrenor2@example.invalid")).toBeVisible();
  await expect(page.getByRole("link", { name: "Continuă cu Google" })).toHaveCount(0);
});

test("with Google configured the login shows the link before the form", async({ page }) => {
  await page.goto("/intrare");
  await expect(page.getByRole("link", { name: "Continuă cu Google" })).toHaveAttribute("href", "/api/portal/google/start");
});

test("a signed in Google only coach sets a password: e-mail prefilled, code logs in", async({ page, request }) => {
  await isolate(page);
  const raw = "http://localhost:3200";
  const host = { host: "antrenor.localhost:3200" };
  const cookiesOf = (res: Awaited<ReturnType<typeof request.get>>): string[] =>
    res.headersArray().filter((h) => h.name.toLowerCase() === "set-cookie").map((h) => h.value.split(";")[0]);
  const start = await request.get(`${raw}/api/portal/google/start`, { headers: host, maxRedirects: 0 });
  const state = new URL(start.headers().location).searchParams.get("state") ?? "";
  const jar = cookiesOf(start).join("; ");
  const cb = await request.get(`${raw}/api/portal/google/callback?code=ok:antrenor3@example.invalid&state=${state}`, { headers: { ...host, cookie: jar }, maxRedirects: 0 });
  const session = cookiesOf(cb).map((c) => ({ name: c.slice(0, c.indexOf("=")), value: c.slice(c.indexOf("=") + 1) })).filter((c) => c.value !== "");
  await page.context().addCookies(session.map((c) => ({ ...c, url: COACH_BASE })));
  await page.goto("/profil/setari");
  await page.getByRole("link", { name: "Setează o parolă" }).click();
  await expect(page).toHaveURL(/\/am-uitat-parola$/);
  await expect(page.getByText("antrenor3@example.invalid")).toBeVisible();
  await expect(page.getByRole("link", { name: "Înapoi", exact: true })).toHaveAttribute("href", "/profil/setari");
  await page.getByRole("button", { name: "Trimite codul" }).click();
  await page.getByLabel("Cod din e-mail").fill("123456");
  await page.getByLabel("Parolă nouă").fill("Alta-Parola-12345");
  await page.getByRole("button", { name: "Salvează parola" }).click();
  await expect(page).toHaveURL(/localhost:3200\/$/);
  await page.goto("/profil/setari");
  await expect(page.getByLabel("Parola actuală")).toBeVisible();
});

const RIBBON = ["rgb(239, 178, 43)", "rgb(234, 114, 51)", "rgb(190, 51, 48)", "rgb(110, 66, 86)"];

test.describe("branded frame", () => {
  test("desktop: panel with brand and ribbon, form card to its right", async({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/intrare");
    const frame = page.locator("[data-auth-frame]");
    await expect(frame.getByText(/^clubul sportiv$/i)).toBeVisible();
    await expect(frame.getByText("Portal antrenor", { exact: true })).toBeVisible();
    const word = frame.getByText("EDUSPORT", { exact: true });
    await expect(word).toBeVisible();
    const style = await word.evaluate(async(el) => {
      const cs = getComputedStyle(el);
      await document.fonts.ready;
      const loaded = [...document.fonts].some((f) => /climate ?crisis/i.test(f.family) && f.status === "loaded");
      return { family: cs.fontFamily, size: cs.fontSize, loaded };
    });
    expect(style.family).toMatch(/climate ?crisis/i);
    expect(style.size).toBe("62px");
    expect(style.loaded).toBe(true);
    const strokes = await page.locator("[data-auth-frame] svg:visible path").evaluateAll((els) => els.map((el) => getComputedStyle(el).stroke));
    expect(strokes).toEqual(RIBBON);
    const brand = await word.boundingBox();
    const card = await page.getByRole("heading", { name: "Intră în cont" }).boundingBox();
    expect(card!.x).toBeGreaterThan(brand!.x + brand!.width);
  });

  test("phone: 31px wordmark, form below the navy block", async({ page }) => {
    await page.goto("/intrare");
    const word = page.locator("[data-auth-frame]").getByText("EDUSPORT", { exact: true });
    expect(await word.evaluate((el) => getComputedStyle(el).fontSize)).toBe("31px");
    const strokes = await page.locator("[data-auth-frame] svg:visible path").evaluateAll((els) => els.map((el) => getComputedStyle(el).stroke));
    expect(strokes).toEqual(RIBBON);
    const form = await page.getByRole("heading", { name: "Intră în cont" }).boundingBox();
    expect(form!.y).toBeGreaterThanOrEqual(330);
  });

  test("a 320 x 568 phone scrolls to the button and the brand keeps clear of the form", async({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto("/intrare");
    const brand = await page.locator("[data-auth-frame]").getByText("Portal antrenor", { exact: true }).boundingBox();
    const heading = await page.getByRole("heading", { name: "Intră în cont" }).boundingBox();
    expect(brand!.y + brand!.height).toBeLessThan(heading!.y);
    const button = page.getByRole("button", { name: "Intră" });
    await button.scrollIntoViewIfNeeded();
    await expect(button).toBeInViewport();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });

  test("only the spinner may have rounded corners, on every auth screen", async({ page }) => {
    for (const path of ["/intrare", "/am-uitat-parola", `/invitatie/${INVITE_VALID}`]) {
      for (const size of [{ width: 1280, height: 800 }, { width: 390, height: 844 }]) {
        await page.setViewportSize(size);
        await page.goto(path);
        await expect(page.locator("[data-auth-frame]")).toBeVisible();
        const rounded = await page.evaluate(() =>
          [...document.querySelectorAll("body *")].filter((el) => getComputedStyle(el).borderRadius !== "0px" && !el.closest("[role=status]")).map((el) => el.tagName));
        expect(rounded, `${path} ${size.width}`).toEqual([]);
      }
    }
  });
});
