import type { Page } from "@playwright/test";
import { isolate } from "./portal-helpers";

export const SPORTIV_BASE = "http://sportiv.localhost:3200";
export const PARENT_EMAIL = "parinte1@example.invalid";
export const ADULT_EMAIL = "sportiv18@example.invalid";
export const SPORTIV_PASSWORD = "Throwaway-Sportiv-1";

/** Logs in through the sportiv BFF from the page, so the session cookies land in the browser context. */
export async function loginSportiv(page: Page, email: string = PARENT_EMAIL, password: string = SPORTIV_PASSWORD): Promise<void> {
  await isolate(page);
  await page.goto(`${SPORTIV_BASE}/robots.txt`);
  const status = await page.evaluate(async({ email: e, password: p }) => {
    const res = await fetch("/api/portal/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: e, password: p }),
    });
    return res.status;
  }, { email, password });
  if (status !== 200) throw new Error(`loginSportiv(${email}) answered ${status}`);
}
