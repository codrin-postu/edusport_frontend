import type { NextRequest, NextResponse } from "next/server";
import { callStrapi, guardPost, invalid, text } from "@/lib/portal/auth-route";
import { refusal, respond } from "@/lib/portal/bff";
import { STATES } from "@/lib/portal/copy";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const g = await guardPost(req, "sportiv", { limited: true, readBody: true });
  if (!("ctx" in g)) return g;
  const email = text(g.body, "email");
  if (!email) return invalid();
  const res = await callStrapi("auth/reset/request", { method: "POST", body: { email } }, g.ctx);
  if (res.status === 403) {
    console.error("portal-bff: secret refused");
    return respond(503, refusal(503, STATES.loadFailed), []);
  }
  return respond(res.status, res.body, []);
}
