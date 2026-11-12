import type { NextRequest, NextResponse } from "next/server";
import { callStrapi, guardPost, invalid, sessionAnswer, text } from "@/lib/portal/auth-route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const g = await guardPost(req, "antrenor", { limited: true, readBody: true });
  if (!("ctx" in g)) return g;
  const email = text(g.body, "email");
  const code = text(g.body, "code");
  const password = text(g.body, "password");
  if (!email || !code || !password) return invalid();
  const res = await callStrapi(
    "auth/reset/confirm",
    { method: "POST", body: { host: g.ctx.site, email, code, password, deviceKey: g.ctx.device }, userAgent: true },
    g.ctx,
  );
  return sessionAnswer(res, g.ctx);
}
