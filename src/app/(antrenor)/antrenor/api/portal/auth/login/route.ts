import type { NextRequest, NextResponse } from "next/server";
import { loginPost } from "@/lib/portal/auth-route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const POST = (req: NextRequest): Promise<NextResponse> => loginPost(req, "antrenor");
