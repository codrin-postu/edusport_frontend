import { expect, test } from "@playwright/test";

const COACH_BASE = "http://antrenor.localhost:3200";

test.describe("coach host", () => {
  test.use({ baseURL: COACH_BASE });

  test("robots.txt disallows everything", async({ request }) => {
    const res = await request.get("/robots.txt");
    expect(await res.text()).toContain("Disallow: /");
  });

  test("pages are noindex and carry no site extras", async({ page }) => {
    const res = await page.goto("/");
    expect(res?.headers()["x-robots-tag"]).toBe("noindex, nofollow");
    await expect(page.locator("script[src*=\"umami\"]")).toHaveCount(0);
    await expect(page.locator("meta[name=\"robots\"][content*=\"noindex\"]")).toHaveCount(1);
  });

  test("site pages and sitemap answer 404", async({ request }) => {
    expect((await request.get("/sitemap.xml")).status()).toBe(404);
    expect((await request.get("/cursuri")).status()).toBe(404);
  });
});

test.describe("main host", () => {
  test("coach paths answer 404", async({ request }) => {
    expect((await request.get("/antrenor")).status()).toBe(404);
    expect((await request.post("/api/portal/auth/login", { data: {} })).status()).toBe(404);
  });

  test("site pages still serve", async({ request }) => {
    expect((await request.get("/cursuri/program")).status()).toBe(200);
  });
});
