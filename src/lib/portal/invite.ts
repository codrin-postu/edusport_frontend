// Server only (the invite page). Reads the invite state for the secret held in the invite cookie.
import { cookies, headers } from "next/headers";
import { callStrapi } from "./bff";
import { cookieNames, isSecureRequest } from "./cookies";

export type InviteState = { state: "valid"; email: string } | { state: "expired"; email: null } | { state: "none" };

export async function readInviteState(): Promise<InviteState> {
  const h = await headers();
  const secure = isSecureRequest("", h.get("x-forwarded-proto"));
  const names = cookieNames(secure);
  const secret = (await cookies()).get(names.invite)?.value;
  if (!secret) return { state: "none" };
  const ctx = {
    secure, names, host: h.get("host"), ip: h.get("x-real-ip"), userAgent: h.get("user-agent"), access: null, refresh: null, device: null,
  };
  const res = await callStrapi("auth/invite/read", { method: "POST", body: { secret } }, ctx);
  const data = typeof res.body === "object" && res.body !== null ? (res.body as { data?: unknown }).data : null;
  if (res.status >= 200 && res.status < 300 && typeof data === "object" && data !== null) {
    const d = data as { state?: unknown; email?: unknown };
    if (d.state === "valid" && typeof d.email === "string") return { state: "valid", email: d.email };
  }
  return { state: "expired", email: null };
}
