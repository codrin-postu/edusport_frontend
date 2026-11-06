import type { NextRequest, NextResponse } from "next/server";
import { callStrapi, guardPost } from "@/lib/portal/auth-route";
import { respond } from "@/lib/portal/bff";
import { clearSessionCookies } from "@/lib/portal/cookies";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const g = await guardPost(req, { limited: false, readBody: false });
  if (!("ctx" in g)) return g;
  if (g.ctx.refresh) await callStrapi("auth/logout", { method: "POST", body: { refreshToken: g.ctx.refresh } }, g.ctx);
  return respond(200, { data: { ok: true } }, clearSessionCookies(g.ctx.secure));
}
