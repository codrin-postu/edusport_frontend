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
  inactiveGroups?: string[];
  schoolEditable?: boolean;
  accessTtlSec?: number;
  cutAccount?: boolean;
  revokeAll?: boolean;
  failGoogle?: boolean;
  googleClientId?: string | null;
  emptyToday?: boolean;
  refreshStatus?: number;
  refuseSecret?: boolean;
  competitionsDown?: boolean;
  coachDown?: boolean;
  unscheduledGroup?: boolean;
  lostAthlete?: string | null;
  athletesDown?: boolean;
  listPerformance?: string[];
  skateDown?: boolean;
  stale?: boolean;
  noCompetitions?: boolean;
  noOfficialUrl?: boolean;
  promotion?: boolean | string;
  inactive?: boolean | string;
  emptyHistory?: boolean;
  nothingOwed?: boolean;
  noDocument?: boolean;
  noPathNow?: boolean;
  moneyMismatch?: boolean;
  advance?: number | null;
  manyPayments?: boolean;
  unlisted?: string | null;
  noPassword?: boolean;
  noUpcoming?: boolean;
  noPrevMonth?: boolean;
  noAthletes?: boolean;
  documentFile?: string | null;
  documentForbidden?: boolean;
};

/** The mock portal's fixed "today" (a Thursday); see FROZEN_TODAY in portal-fixtures.mjs. */
export const TODAY = "2026-11-05";

/**
 * Per-test isolation: the BFF limits auth calls per client address (30 per 15 minutes), so every test
 * sends its own x-real-ip, and the browser clock stands on the mock's "today".
 */
export async function isolate(page: Page): Promise<void> {
  const octet = (): number => 1 + Math.floor(Math.random() * 254);
  await page.context().setExtraHTTPHeaders({ "x-real-ip": `10.${octet()}.${octet()}.${octet()}` });
  await page.clock.setFixedTime(new Date(`${TODAY}T12:00:00Z`));
}

/** Logs in through the BFF from the page, so the session cookies land in the browser context. */
export async function loginAs(page: Page, email: string = COACH_EMAIL, password: string = COACH_PASSWORD): Promise<void> {
  await isolate(page);
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
