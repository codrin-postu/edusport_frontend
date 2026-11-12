// Header, outcome and masking rules for calls from the BFF to Strapi. Pure.
import type { PortalSession } from "./api-types";
import { LOST_ATHLETE } from "./copy-sportiv.ts";

export type Outcome = "ok" | "refresh" | "cut" | "refusal";

const IP_MAX = 64;
const UA_MAX = 512;

export function bffHeaders(i: { secret: string; ip: string | null; userAgent?: string | null; device?: string | null; access?: string | null }): Record<string, string> {
  const ip = i.ip?.trim() ?? "";
  const out: Record<string, string> = {
    "x-portal-secret": i.secret,
    "x-portal-client-ip": ip && ip.length <= IP_MAX ? ip : "unknown",
    "content-type": "application/json",
  };
  if (i.userAgent) out["x-portal-user-agent"] = i.userAgent.slice(0, UA_MAX);
  if (i.device) out["x-portal-device"] = i.device;
  if (i.access) out.authorization = `Bearer ${i.access}`;
  return out;
}

function errorName(body: unknown): string | null {
  if (typeof body !== "object" || body === null) return null;
  const error = (body as { error?: unknown }).error;
  if (typeof error !== "object" || error === null) return null;
  const name = (error as { name?: unknown }).name;
  return typeof name === "string" ? name : null;
}

export function classifyCoach(status: number, body: unknown): Outcome {
  if (status >= 200 && status < 300) return "ok";
  if (status === 401) return "refresh";
  if (status === 403 && errorName(body) !== "ClubAdminError") return "cut";
  return "refusal";
}

function errorMessage(body: unknown): string | null {
  const error = typeof body === "object" && body !== null ? (body as { error?: unknown }).error : null;
  const message = typeof error === "object" && error !== null ? (error as { message?: unknown }).message : null;
  return typeof message === "string" ? message : null;
}

/**
 * What a sportiv answer asks of the BFF: "refresh" (401: renew once, then the login), "cut" (a policy 403: the account
 * or its access ended, clear the cookies), "lost-athlete" (the holder no longer holds this athlete: the page goes to `/`
 * with the toast), "show" (anything else goes through as it is).
 */
export function classifySportiv(status: number, body: unknown): "refresh" | "cut" | "lost-athlete" | "show" {
  if (status === 401) return "refresh";
  if (status !== 403) return "show";
  if (errorName(body) !== "ClubAdminError") return "cut";
  return errorMessage(body) === LOST_ATHLETE ? "lost-athlete" : "show";
}

export function readSession(body: unknown): PortalSession | null {
  const data = typeof body === "object" && body !== null ? (body as { data?: unknown }).data : null;
  if (typeof data !== "object" || data === null) return null;
  const d = data as Record<string, unknown>;
  const { accessToken, refreshToken, accessExpiresAt, deviceKey } = d;
  if (typeof accessToken !== "string" || typeof refreshToken !== "string" || typeof accessExpiresAt !== "string") return null;
  if (Number.isNaN(new Date(accessExpiresAt).getTime())) return null;
  if (deviceKey !== null && typeof deviceKey !== "string") return null;
  return { accessToken, refreshToken, accessExpiresAt, deviceKey };
}

/** A success with no session: the invite was accepted but the account cannot enter this host, so the login page shows. */
export function isSessionless(body: unknown): boolean {
  const data = typeof body === "object" && body !== null ? (body as { data?: unknown }).data : null;
  return typeof data === "object" && data !== null && (data as { session?: unknown }).session === null;
}

const SECRET_KEYS = "secret|password|current|code|refreshToken|accessToken";

export function maskSecrets(text: string): string {
  return text
    .replace(/\/invite\/[^?#\s"]*/g, "/invite/***")
    .replace(/([?&](?:code|state|secret)=)[^&#\s"]*/g, "$1***")
    .replace(new RegExp(`"(${SECRET_KEYS})"\\s*:\\s*"[^"]*"`, "g"), "\"$1\":\"***\"");
}

/** What a failed auth/refresh means: null ends the session (backend 401 or 400, a garbage token), a number is the status to answer. */
export function refreshFailure(status: number): number | null {
  if (status === 401 || status === 400) return null;
  return status === 403 || status === 503 ? 503 : 502;
}
