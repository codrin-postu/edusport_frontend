import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";

import { STRAPI_BASE } from "@/lib/strapi-base";

const STRAPI_URL = STRAPI_BASE;
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

const REASONS = new Set([
  "inscriere",
  "informatii-cursuri",
  "program",
  "tarife",
  "partenariat",
  "feedback",
  "altele",
]);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MESSAGE_MAX = 5000;

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  // Honeypot — return fake-success so bots can't tell.
  if (typeof body._botField === "string" && body._botField.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const ip = clientIp(req);
  const limit = rateLimit(`contact:${ip}`, { max: 5, windowMs: 5 * 60_000 });
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, error: "Prea multe încercări, încearcă mai târziu." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSec) } },
    );
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const reason = typeof body.reason === "string" ? body.reason.trim() : "";
  const message =
    typeof body.message === "string" ? body.message.trim().slice(0, MESSAGE_MAX) : "";

  if (!name || !email || !reason || !message) {
    return NextResponse.json({ ok: false, error: "Câmpuri obligatorii lipsă." }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "Email invalid." }, { status: 400 });
  }
  if (!REASONS.has(reason)) {
    return NextResponse.json({ ok: false, error: "Motiv invalid." }, { status: 400 });
  }

  const userAgent = req.headers.get("user-agent")?.slice(0, 255) ?? "";

  // Custom (admin-added) answers, forwarded verbatim under `extra`. Kept only
  // when it is a non-empty plain object so built-in behaviour is unchanged.
  const extra =
    body.extra &&
    typeof body.extra === "object" &&
    !Array.isArray(body.extra) &&
    Object.keys(body.extra as object).length > 0
      ? (body.extra as Record<string, unknown>)
      : undefined;

  const res = await fetch(`${STRAPI_URL}/api/contact-submissions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(STRAPI_TOKEN ? { Authorization: `Bearer ${STRAPI_TOKEN}` } : {}),
    },
    body: JSON.stringify({
      data: {
        name,
        email,
        phone: phone || undefined,
        reason,
        message,
        submitterIp: ip,
        userAgent,
        ...(extra ? { extra } : {}),
      },
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    return NextResponse.json(
      { ok: false, error: "Nu am putut trimite mesajul. Încearcă din nou." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
