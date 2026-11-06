// Server only (the invite page). Reads the invite state for the secret held in the invite cookie.
import { callStrapi } from "./bff";
import { serverContext } from "./server-ctx";

export type InviteState = { state: "valid"; email: string } | { state: "expired"; email: null } | { state: "none" };

export async function readInviteState(): Promise<InviteState> {
  const { ctx, get } = await serverContext();
  const secret = get(ctx.names.invite);
  if (!secret) return { state: "none" };
  const res = await callStrapi("auth/invite/read", { method: "POST", body: { secret } }, ctx);
  const data = typeof res.body === "object" && res.body !== null ? (res.body as { data?: unknown }).data : null;
  if (res.status >= 200 && res.status < 300 && typeof data === "object" && data !== null) {
    const d = data as { state?: unknown; email?: unknown };
    if (d.state === "valid" && typeof d.email === "string") return { state: "valid", email: d.email };
  }
  return { state: "expired", email: null };
}
