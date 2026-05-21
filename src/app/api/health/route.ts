import { NextResponse } from "next/server";

// Never cache the health endpoint — it must report live container state.
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    ok: true,
    commit: process.env.NEXT_PUBLIC_COMMIT_SHA ?? null,
    time: new Date().toISOString(),
  });
}
