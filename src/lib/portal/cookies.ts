// Cookie rules of the BFF (spec 5.2). Pure; type-only imports (loaded by Node tests).
import type { PortalSession } from "./api-types";

export type CookieNames = { access: string; refresh: string; device: string; google: string; invite: string; flash: string };
export type CookieSpec = { name: string; value: string; maxAge: number; httpOnly: true; secure: boolean; sameSite: "lax"; path: "/" };

const ACCESS_MAX = 600;
const ACCESS_MARGIN = 15;
const REFRESH_MAX_AGE = 2592000;
const DEVICE_MAX_AGE = 34560000;

export function cookieNames(secure: boolean): CookieNames {
  const p = secure ? "__Host-" : "";
  return {
    access: `${p}es_at`, refresh: `${p}es_rt`, device: `${p}es_dev`,
    google: `${p}es_g`, invite: `${p}es_inv`, flash: `${p}es_flash`,
  };
}

export function shortCookie(name: string, value: string, maxAge: number, secure: boolean): CookieSpec {
  return { name, value, maxAge, httpOnly: true, secure, sameSite: "lax", path: "/" };
}

const clamp = (n: number, lo: number, hi: number): number => Math.min(hi, Math.max(lo, n));

export function sessionCookies(s: PortalSession, nowMs: number, secure: boolean): CookieSpec[] {
  const names = cookieNames(secure);
  const left = Math.floor((new Date(s.accessExpiresAt).getTime() - nowMs) / 1000) - ACCESS_MARGIN;
  const out = [
    shortCookie(names.access, s.accessToken, clamp(left, 0, ACCESS_MAX), secure),
    shortCookie(names.refresh, s.refreshToken, REFRESH_MAX_AGE, secure),
  ];
  if (s.deviceKey !== null) out.push(shortCookie(names.device, s.deviceKey, DEVICE_MAX_AGE, secure));
  return out;
}

/** Access and refresh only: the device cookie outlives a logout (it marks the browser). */
export function clearSessionCookies(secure: boolean): CookieSpec[] {
  const names = cookieNames(secure);
  return [shortCookie(names.access, "", 0, secure), shortCookie(names.refresh, "", 0, secure)];
}

export function isSecureRequest(url: string, forwardedProto: string | null): boolean {
  return url.startsWith("https://") || forwardedProto?.split(",")[0].trim().toLowerCase() === "https";
}
