// Google sign-in rules of the BFF. Pure; node:crypto only.
import { createHash, randomBytes } from "node:crypto";

export const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";

export type GoogleCookie = { state: string; nonce: string; verifier: string; invite: boolean; exp: number };

export function randomToken(bytes: number): string {
  return randomBytes(bytes).toString("base64url");
}

export function pkcePair(): { verifier: string; challenge: string } {
  const verifier = randomToken(32);
  return { verifier, challenge: createHash("sha256").update(verifier).digest("base64url") };
}

export function authUrl(i: { clientId: string; redirectUri: string; state: string; nonce: string; challenge: string; loginHint?: string }): string {
  const q = new URLSearchParams({
    client_id: i.clientId, redirect_uri: i.redirectUri, response_type: "code", scope: "openid email",
    state: i.state, nonce: i.nonce, code_challenge: i.challenge, code_challenge_method: "S256", prompt: "select_account",
  });
  if (i.loginHint) q.set("login_hint", i.loginHint);
  return `${GOOGLE_AUTH_URL}?${q.toString()}`;
}

export function encodeGoogleCookie(v: GoogleCookie): string {
  return Buffer.from(JSON.stringify(v), "utf8").toString("base64url");
}

export function decodeGoogleCookie(raw: string | null, nowMs: number): GoogleCookie | null {
  if (!raw) return null;
  try {
    const v: unknown = JSON.parse(Buffer.from(raw, "base64url").toString("utf8"));
    if (typeof v !== "object" || v === null) return null;
    const { state, nonce, verifier, invite, exp } = v as Record<string, unknown>;
    if (typeof state !== "string" || typeof nonce !== "string" || typeof verifier !== "string") return null;
    if (typeof invite !== "boolean" || typeof exp !== "number" || exp <= nowMs) return null;
    return { state, nonce, verifier, invite, exp };
  } catch {
    return null;
  }
}
