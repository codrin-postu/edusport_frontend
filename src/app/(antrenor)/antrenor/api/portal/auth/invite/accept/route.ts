import type { NextRequest, NextResponse } from "next/server";
import { callStrapi, guardPost, invalid, sessionAnswer, text } from "@/lib/portal/auth-route";
import { refusal, respond } from "@/lib/portal/bff";
import { isSessionless } from "@/lib/portal/upstream";
import { INVITE } from "@/lib/portal/copy";
import { shortCookie } from "@/lib/portal/cookies";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const g = await guardPost(req, "antrenor", { limited: true, readBody: true });
  if (!("ctx" in g)) return g;
  const password = text(g.body, "password");
  if (!password) return invalid();
  const secret = req.cookies.get(g.ctx.names.invite)?.value ?? null;
  if (!secret) return respond(410, refusal(410, INVITE.expired), []);
  const res = await callStrapi(
    "auth/invite/accept",
    { method: "POST", body: { secret, password, deviceKey: g.ctx.device }, userAgent: true },
    g.ctx,
  );
  const spent = [shortCookie(g.ctx.names.invite, "", 0, g.ctx.secure)];
  // Accepted but not allowed to enter this host: no session, the form sends the person to the login.
  if (res.status >= 200 && res.status < 300 && isSessionless(res.body)) return respond(200, { data: { ok: true, signedIn: false } }, spent);
  return sessionAnswer(res, g.ctx, spent);
}
