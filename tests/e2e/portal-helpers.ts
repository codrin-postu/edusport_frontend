import type { Page } from "@playwright/test";

export const COACH_BASE = "http://antrenor.localhost:3200";
export const MOCK_PORTAL = "http://localhost:18891";
export const COACH_EMAIL = "antrenor1@example.invalid";
export const COACH_PASSWORD = "Throwaway-Coach-1";

export type MockCall = {
  method: string;
  path: string;
  body: unknown;
  headers: { secret: string | null; ip: string | null; ua: string | null; device: string | null; auth: string | null };
};

export type MockState = {
  accessTtlSec?: number;
  cutAccount?: boolean;
  revokeAll?: boolean;
  failGoogle?: boolean;
  googleClientId?: string | null;
  emptyToday?: boolean;
};

/** Logs in through the BFF from the page, so the session cookies land in the browser context. */
export async function loginAs(page: Page, email: string = COACH_EMAIL, password: string = COACH_PASSWORD): Promise<void> {
  await page.goto(`${COACH_BASE}/robots.txt`);
  const status = await page.evaluate(async({ email: e, password: p }) => {
    const res = await fetch("/api/portal/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: e, password: p }),
    });
    return res.status;
  }, { email, password });
  if (status !== 200) throw new Error(`loginAs(${email}) answered ${status}`);
}

export async function mockState(s: MockState): Promise<void> {
  await fetch(`${MOCK_PORTAL}/__mock/state`, { method: "POST", body: JSON.stringify(s) });
}

export async function mockLog(): Promise<MockCall[]> {
  const res = await fetch(`${MOCK_PORTAL}/__mock/log`);
  return ((await res.json()) as { calls: MockCall[] }).calls;
}

export async function mockRefreshCount(): Promise<number> {
  const res = await fetch(`${MOCK_PORTAL}/__mock/log`);
  return ((await res.json()) as { refreshes: number }).refreshes;
}

export async function mockReset(): Promise<void> {
  await fetch(`${MOCK_PORTAL}/__mock/reset`, { method: "POST" });
}
