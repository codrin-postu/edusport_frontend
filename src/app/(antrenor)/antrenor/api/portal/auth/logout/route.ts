import type { NextRequest, NextResponse } from "next/server";
import { callStrapi, guardPost } from "@/lib/portal/auth-route";
import { respond } from "@/lib/portal/bff";
import { clearSessionCookies } from "@/lib/portal/cookies";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const g = await guardPost(req, { limited: false, readBody: false, needSecret: false });
  if (!("ctx" in g)) return g;
  // The cookies are cleared whatever the backend answers, or whether it answers at all.
  if (g.ctx.refresh) {
    try {
      await callStrapi("auth/logout", { method: "POST", body: { refreshToken: g.ctx.refresh } }, g.ctx);
    } catch {
      // the local session still ends
    }
  }
  return respond(200, { data: { ok: true } }, clearSessionCookies(g.ctx.secure));
}
