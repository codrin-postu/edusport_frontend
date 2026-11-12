// Server only (the invite page). Reads the invite state for the secret held in the invite cookie.
import { callStrapi } from "./bff";
import type { PortalSite } from "./site";
import { serverContext } from "./server-ctx";

export type InviteState = { state: "valid"; email: string } | { state: "expired"; email: null } | { state: "none" } | { state: "failed"; email: null };

export async function readInviteState(site: PortalSite): Promise<InviteState> {
  const { ctx, get } = await serverContext(site);
  const secret = get(ctx.names.invite);
  if (!secret) return { state: "none" };
  const res = await callStrapi("auth/invite/read", { method: "POST", body: { secret } }, ctx);
  const data = typeof res.body === "object" && res.body !== null ? (res.body as { data?: unknown }).data : null;
  if (res.status >= 200 && res.status < 300 && typeof data === "object" && data !== null) {
    const d = data as { state?: unknown; email?: unknown };
    if (d.state === "valid" && typeof d.email === "string") return { state: "valid", email: d.email };
  }
  // Only a clean answer of "expired" (or an unusable invite) reads as expired. A network error,
  // a 429 or a 5xx says nothing about the invite, so it must not tell the coach to ask for a new one.
  if (res.status >= 200 && res.status < 300) return { state: "expired", email: null };
  return { state: "failed", email: null };
}
