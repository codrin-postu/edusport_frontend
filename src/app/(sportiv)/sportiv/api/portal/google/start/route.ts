import type { NextRequest, NextResponse } from "next/server";
import { googleStart } from "@/lib/portal/google-route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const GET = (req: NextRequest): Promise<NextResponse> => googleStart(req, "sportiv");
