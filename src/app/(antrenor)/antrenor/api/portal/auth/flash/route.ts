import type { NextRequest, NextResponse } from "next/server";
import { flashGet } from "@/lib/portal/auth-route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const GET = (req: NextRequest): NextResponse => flashGet(req, "antrenor");
