import type { NextRequest, NextResponse } from "next/server";
import { logoutPost } from "@/lib/portal/auth-route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const POST = (req: NextRequest): Promise<NextResponse> => logoutPost(req, "sportiv");
