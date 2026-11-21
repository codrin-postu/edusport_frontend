import { expect, test } from "@playwright/test";

test.describe("ghid gate", () => {
  test("without the cookie /ghid redirects to the password screen, noindex", async({ request }) => {
    const res = await request.get("/ghid", { maxRedirects: 0 });
    expect(res.status()).toBe(307);
    expect(new URL(res.headers().location, "http://x").pathname + new URL(res.headers().location, "http://x").search).toBe("/ghid/intra?next=%2Fghid");
    expect(res.headers()["x-robots-tag"]).toBe("noindex, nofollow");
  });

  test("robots.txt disallows /ghid", async({ request }) => {
    const res = await request.get("/robots.txt");
    expect(await res.text()).toContain("Disallow: /ghid");
  });

  test("portal hosts answer 404 for /ghid", async({ request }) => {
    const res = await request.get("http://antrenor.localhost:3200/ghid", { maxRedirects: 0 });
    expect(res.status()).toBe(404);
  });
});
