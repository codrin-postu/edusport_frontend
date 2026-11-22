import { expect, test } from "@playwright/test";
import { ghidToken } from "../../src/lib/ghid/gate";

const PASSWORD = "test-ghid-parola";
const COOKIE = `ghid=${ghidToken(PASSWORD)}`;

test.describe("ghid gate", () => {
  test("without the cookie /ghid redirects to the password screen, noindex", async({ request }) => {
    const res = await request.get("/ghid", { maxRedirects: 0 });
    expect(res.status()).toBe(307);
    expect(new URL(res.headers().location, "http://x").pathname + new URL(res.headers().location, "http://x").search).toBe("/ghid/intra?next=%2Fghid");
    expect(res.headers()["x-robots-tag"]).toBe("noindex, nofollow");
  });

  test("case and encoded variants of /ghid show no wiki content without the cookie", async({ request }) => {
    for (const path of ["/GHID", "/%67hid", "/ghid%2f"]) {
      const res = await request.get(path, { maxRedirects: 0 });
      const body = await res.text();
      expect(body, path).not.toContain("Ghid EduSport");
      expect([307, 404], path).toContain(res.status());
    }
  });

  test("//ghid and /GHID without the cookie never show the rail", async({ request }) => {
    for (const url of ["http://localhost:3200//ghid", "http://localhost:3200/GHID", "http://localhost:3200/GHID/ce-este-edusport"]) {
      const res = await request.get(url, { maxRedirects: 0 });
      expect([307, 308, 404], url).toContain(res.status());
      expect(await res.text(), url).not.toContain("Cuprins");
    }
  });

  test("an image without the cookie redirects to the password screen", async({ request }) => {
    const res = await request.get("/ghid/img/x.jpg", { maxRedirects: 0 });
    expect(res.status()).toBe(307);
    expect(res.headers().location).toContain("/ghid/intra");
  });

  test("robots.txt disallows /ghid", async({ request }) => {
    const res = await request.get("/robots.txt");
    expect(await res.text()).toContain("Disallow: /ghid");
  });

  test("portal hosts answer 404 for /ghid", async({ request }) => {
    const res = await request.get("/ghid", { headers: { host: "antrenor.localhost:3200" }, maxRedirects: 0 });
    expect(res.status()).toBe(404);
  });
});

test.describe("ghid password screen", () => {
  test("a wrong password stays on the screen with the error", async({ page }) => {
    await page.goto("/ghid/intra");
    await page.getByLabel("Parolă").fill("gresita");
    await page.getByRole("button", { name: "Intră" }).click();
    await expect(page.locator("p[role=alert]")).toHaveText("Parolă greșită.");
    expect(new URL(page.url()).pathname).toBe("/ghid/intra");
  });

  test("the right password opens /ghid and a reload stays", async({ page }) => {
    await page.goto("/ghid");
    await expect(page).toHaveURL(/\/ghid\/intra\?next=%2Fghid$/);
    await page.getByLabel("Parolă").fill("test-ghid-parola");
    await page.getByRole("button", { name: "Intră" }).click();
    await page.waitForURL((u) => u.pathname === "/ghid");
    await page.reload();
    expect(new URL(page.url()).pathname).toBe("/ghid");
  });

  test("a next outside the wiki lands on /ghid", async({ page }) => {
    await page.goto("/ghid/intra?next=%2F%2Fevil.com");
    await page.getByLabel("Parolă").fill("test-ghid-parola");
    await page.getByRole("button", { name: "Intră" }).click();
    await page.waitForURL((u) => u.pathname === "/ghid");
    expect(new URL(page.url()).origin).toBe("http://localhost:3200");
  });
});

test.describe("ghid wiki", () => {
  test.beforeEach(async({ context }) => {
    await context.addCookies([{ name: "ghid", value: ghidToken(PASSWORD), domain: "localhost", path: "/ghid" }]);
  });

  test("/ghid shows the first page and the contents rail", async({ page }) => {
    await page.goto("/ghid");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Ce este EduSport");
    await expect(page.getByRole("navigation", { name: "Cuprins" }).first()).toBeVisible();
  });

  test("the group of the current page is open, another opens on click", async({ page }) => {
    await page.goto("/ghid/inregistreaza-o-plata");
    const rail = page.getByRole("navigation", { name: "Cuprins" }).first();
    const bani = rail.locator("details", { hasText: "Bani" });
    const inscrieri = rail.locator("details", { hasText: "Înscrieri" });
    await expect(bani).toHaveAttribute("open", "");
    await expect(rail.getByRole("link", { name: "Corectează sau anulează o plată" })).toBeVisible();
    await expect(inscrieri).not.toHaveAttribute("open", "");
    await inscrieri.locator("summary").click();
    await expect(rail.getByRole("link", { name: "Contactează părintele" })).toBeVisible();
  });

  test("client navigation into another group opens it", async({ page }) => {
    await page.goto("/ghid/inregistreaza-o-plata");
    const rail = page.getByRole("navigation", { name: "Cuprins" }).first();
    await rail.locator("details", { hasText: "Prezență" }).locator("summary").click();
    await rail.getByRole("link", { name: "Completează prezența" }).click();
    await page.waitForURL((u) => u.pathname === "/ghid/completeaza-prezenta");
    await expect(rail.locator("details", { hasText: "Prezență" })).toHaveAttribute("open", "");
    await expect(rail.locator("details", { hasText: "Bani" })).not.toHaveAttribute("open", "");
  });

  test("the site group lists its pages and the team group ends with the personal data pages", async({ page }) => {
    await page.goto("/ghid/competitii-si-rezultate");
    const rail = page.getByRole("navigation", { name: "Cuprins" }).first();
    const site = rail.locator("details", { hasText: "Site și anunțuri" });
    await expect(site).toHaveAttribute("open", "");
    await expect(site.getByRole("link", { name: "Setări site" })).toBeVisible();
    await expect(site.getByRole("link", { name: "Echipa, sponsori și alte liste" })).toBeVisible();
    const team = rail.locator("details", { hasText: "Echipa și acces" });
    await team.locator("summary").click();
    await expect(team.getByRole("link", { name: "Schimbă rolul sau oprește accesul" })).toBeVisible();
    await expect(team.getByRole("link", { name: "Sportivi inactivi" })).toBeVisible();
  });

  test("an unknown page is the 404 page", async({ request }) => {
    const res = await request.get("/ghid/nu-exista", { headers: { cookie: COOKIE } });
    expect(res.status()).toBe(404);
  });

  test("image path tricks and missing files are 404", async({ request }) => {
    for (const path of ["/ghid/img/..%2F..%2Fpackage.json", "/ghid/img/%2e%2e/%2e%2e/package.json", "/ghid/img/nu.jpg", "/ghid/img/x.png"]) {
      const res = await request.get(path, { headers: { cookie: COOKIE }, maxRedirects: 0 });
      expect(res.status(), path).toBe(404);
    }
  });

  test("a real screenshot is served as a jpeg with the cookie", async({ request }) => {
    const res = await request.get("/ghid/img/contabilitate-plati.jpg", { headers: { cookie: COOKIE }, maxRedirects: 0 });
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toBe("image/jpeg");
  });

  test("on a phone the contents open from the Cuprins button", async({ page }) => {
    await page.setViewportSize({ width: 375, height: 760 });
    await page.goto("/ghid");
    await page.getByRole("button", { name: "Cuprins" }).click();
    await expect(page.getByRole("dialog").getByRole("link", { name: "Ce este EduSport" })).toBeVisible();
  });

  test("search lists a page, says when nothing matches, and / focuses the field", async({ page }) => {
    await page.goto("/ghid");
    const field = page.getByRole("combobox", { name: "Caută în ghid" }).first();
    await page.keyboard.press("/");
    await expect(field).toBeFocused();
    await field.fill("ce este");
    await expect(page.getByRole("option", { name: /Ce este EduSport/ })).toBeVisible();
    await field.fill("zzzz");
    await expect(page.getByText("Niciun rezultat.")).toBeVisible();
    await field.fill("   ");
    await expect(page.getByRole("listbox")).toHaveCount(0);
  });

  test("search opens a page with Enter", async({ page }) => {
    await page.goto("/ghid");
    const field = page.getByRole("combobox", { name: "Caută în ghid" }).first();
    await field.fill("ce este");
    await field.press("Enter");
    await page.waitForURL((u) => u.pathname === "/ghid/ce-este-edusport");
  });

  test("on a phone the search field sits beside Cuprins", async({ page }) => {
    await page.setViewportSize({ width: 375, height: 760 });
    await page.goto("/ghid");
    const field = page.getByRole("combobox", { name: "Caută în ghid" }).filter({ visible: true });
    await expect(field).toHaveCount(1);
    await page.keyboard.press("/");
    await expect(field).toBeFocused();
    await field.fill("ce este");
    await expect(page.getByRole("option", { name: /Ce este EduSport/ })).toBeVisible();
  });
});
