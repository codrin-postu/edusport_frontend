// Invite bridge: the secret arrives in the path once, moves into an HttpOnly cookie and the
// browser is sent on to /invitatie, so no later URL, referrer or log line carries it.
import { NextResponse, type NextRequest } from "next/server";
import { bffContext } from "@/lib/portal/bff";
import { shortCookie } from "@/lib/portal/cookies";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SECRET = /^[A-Za-z0-9_-]{16,128}$/;
const INVITE_MAX_AGE = 1800;

export async function GET(req: NextRequest, { params }: { params: Promise<{ secret: string }> }): Promise<NextResponse> {
  const { secret } = await params;
  const res = new NextResponse(null, {
    status: 303,
    headers: { Location: "/invitatie", "Cache-Control": "no-store", "Referrer-Policy": "no-referrer" },
  });
  if (!SECRET.test(secret)) return res;
  const ctx = bffContext(req);
  const c = shortCookie(ctx.names.invite, secret, INVITE_MAX_AGE, ctx.secure);
  res.cookies.set({ name: c.name, value: c.value, maxAge: c.maxAge, httpOnly: c.httpOnly, secure: c.secure, sameSite: c.sameSite, path: c.path });
  return res;
}
