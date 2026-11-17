// Server only. The Google client id lives on Strapi; the BFF asks for it.
import { callStrapi, type BffContext } from "./bff";
import type { PortalSite } from "./site";
import { serverContext } from "./server-ctx";

export async function googleClientId(ctx: BffContext): Promise<string | null> {
  const res = await callStrapi("auth/google/config", { method: "GET" }, ctx);
  const data = typeof res.body === "object" && res.body !== null ? (res.body as { data?: unknown }).data : null;
  const id = typeof data === "object" && data !== null ? (data as { clientId?: unknown }).clientId : null;
  return res.status === 200 && typeof id === "string" && id.length > 0 ? id : null;
}

export async function googleEnabled(site: PortalSite): Promise<boolean> {
  try {
    const { ctx } = await serverContext(site);
    return (await googleClientId(ctx)) !== null;
  } catch {
    return false;
  }
}
