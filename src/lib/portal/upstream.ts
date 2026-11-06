// Header, outcome and masking rules for calls from the BFF to Strapi. Pure.
import type { PortalSession } from "./api-types";

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

const SECRET_KEYS = "secret|password|current|code|refreshToken|accessToken";

export function maskSecrets(text: string): string {
  return text
    .replace(/\/invitatie\/[^?#\s"]*/g, "/invitatie/***")
    .replace(new RegExp(`"(${SECRET_KEYS})"\\s*:\\s*"[^"]*"`, "g"), "\"$1\":\"***\"");
}
