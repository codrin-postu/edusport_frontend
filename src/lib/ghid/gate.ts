// Password gate of the staff wiki. Pure (node:crypto only): loaded by Node tests.
import { createHmac, timingSafeEqual } from "node:crypto";

export const GHID_COOKIE = "ghid";
export const GHID_LOGIN_PATH = "/ghid/intra";
export const GHID_MAX_AGE = 15552000;

export type GhidGate = { action: "next" } | { action: "redirect"; to: string };

export function ghidToken(password: string): string {
  return createHmac("sha256", password).update("ghid-v1").digest("base64url");
}

export function isGhidCookieValid(cookie: string | undefined, password: string | undefined): boolean {
  if (!cookie || !password) return false;
  const a = Buffer.from(cookie);
  const b = Buffer.from(ghidToken(password));
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function isGhidPath(pathname: string): boolean {
  return pathname === "/ghid" || pathname.startsWith("/ghid/");
}

/**
 * The path as Next routes it: percent-decoded (repeatedly, so double encoding is caught) and lower-cased.
 * Returns null when it cannot be decoded; callers then treat the request as gated.
 */
export function normalizeGhidPath(rawPathname: string): string | null {
  let p = rawPathname;
  try {
    for (let i = 0; i < 3; i++) {
      const d = decodeURIComponent(p);
      if (d === p) break;
      p = d;
    }
  } catch {
    return null;
  }
  return p.toLowerCase();
}

/** True when the raw path is, or cannot be proven not to be, under /ghid. */
export function isGhidRequest(rawPathname: string): boolean {
  const n = normalizeGhidPath(rawPathname);
  return n === null || isGhidPath(n);
}

/** `search` (with its leading "?") only rides along in the `next` value. */
export function ghidGate(pathname: string, cookie: string | undefined, password: string | undefined, search = ""): GhidGate {
  const path = normalizeGhidPath(pathname);
  if (path === GHID_LOGIN_PATH) return { action: "next" };
  if (path !== null && isGhidCookieValid(cookie, password)) return { action: "next" };
  return { action: "redirect", to: `${GHID_LOGIN_PATH}?next=${encodeURIComponent(pathname + search)}` };
}
