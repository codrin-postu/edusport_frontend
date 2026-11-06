import type { NextRequest, NextResponse } from "next/server";
import { bffContext, respond } from "@/lib/portal/bff";
import { shortCookie } from "@/lib/portal/cookies";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_FLASH = 300;

export function GET(req: NextRequest): NextResponse {
  const ctx = bffContext(req);
  const value = req.cookies.get(ctx.names.flash)?.value ?? "";
  const message = value ? value.slice(0, MAX_FLASH) : null;
  return respond(200, { data: { message } }, message === null ? [] : [shortCookie(ctx.names.flash, "", 0, ctx.secure)]);
}
