import { expect, test } from "@playwright/test";

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
