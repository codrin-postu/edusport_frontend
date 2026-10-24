import type { CustomAnswer } from "@/lib/strapi-forms";
import { buildPayload, parseSubmitResponse, type SubmitFailure, type SubmitSuccess } from "./_rules";

// Public url on purpose: this request and the PDF links are made from the browser.
export const PUBLIC_STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337";

/**
 * POST /api/forms/inscriere?scoala=<slug> (plan 2A Task 9, extended by 2D).
 * Never throws: a network failure is a failure without a code or message, and
 * the form shows its generic error.
 */
export async function submitRegistration(
  answers: Record<string, CustomAnswer>,
  website: string,
  schoolSlug: string,
): Promise<SubmitSuccess | SubmitFailure> {
  try {
    const res = await fetch(`${PUBLIC_STRAPI_URL}/api/forms/inscriere?scoala=${encodeURIComponent(schoolSlug)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildPayload(answers, website)),
    });
    const data = (await res.json().catch(() => null)) as unknown;
    return parseSubmitResponse(data, res.ok);
  } catch {
    return { ok: false, code: null, error: null };
  }
}
