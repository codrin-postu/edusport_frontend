// Server only: a BFF context for server components, from the request headers.
import { cookies, headers } from "next/headers";
import type { BffContext } from "./bff";
import { cleanIp } from "./client-ip";
import { cookieNames, isSecureRequest } from "./cookies";

export async function serverContext(): Promise<{ ctx: BffContext; get: (name: string) => string | null }> {
  const h = await headers();
  const jar = await cookies();
  const secure = isSecureRequest("", h.get("x-forwarded-proto"));
  const names = cookieNames(secure);
  const get = (name: string): string | null => jar.get(name)?.value ?? null;
  const ctx: BffContext = {
    secure, names, host: h.get("host"), ip: cleanIp(h.get("x-real-ip")), userAgent: h.get("user-agent"),
    access: null, refresh: null, device: null,
  };
  return { ctx, get };
}
