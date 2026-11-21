"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { GHID_COOKIE, GHID_MAX_AGE, ghidToken, isGhidCookieValid } from "@/lib/ghid/gate";
import { isBlocked, takeFailure } from "@/lib/ghid/limit";
import { safeNext } from "@/lib/ghid/next";

export type EnterState = { error?: string };

export async function enterGhid(_prev: EnterState, form: FormData): Promise<EnterState> {
  const key = (await headers()).get("x-real-ip") ?? "unknown";
  const now = Date.now();
  if (isBlocked(key, now)) return { error: "Prea multe încercări. Încearcă din nou peste 15 minute." };
  const password = process.env.GHID_PASSWORD;
  const given = form.get("password");
  const token = typeof given === "string" && given !== "" ? ghidToken(given) : undefined;
  if (!password || !isGhidCookieValid(token, password)) {
    takeFailure(key, now);
    return { error: "Parolă greșită." };
  }
  (await cookies()).set(GHID_COOKIE, ghidToken(password), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/ghid",
    maxAge: GHID_MAX_AGE,
  });
  const next = form.get("next");
  redirect(safeNext(typeof next === "string" ? next : null));
}
