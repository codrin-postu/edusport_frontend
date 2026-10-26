// ---------------------------------------------------------------------------
// Rules of the registration form that are not in the CMS config: the "Alta" /
// "Altele" follow-up fields, the abonament options per membership, the child
// height check, the submit payload and the submit response.
//
// Values mirror the backend (src/club/registration-form-options.ts and
// src/club/registration-input.ts, plan 2A). No runtime imports on purpose:
// scripts/inscrieri/rules.test.mjs loads this file with node's type stripping.
// ---------------------------------------------------------------------------

import type { CustomAnswer, FormStepConfig } from "@/lib/strapi-forms";

export const RELATIONSHIP_OTHER = "alta";
export const SOURCE_OTHER = "Altele";
export const MEMBERSHIP_YES = "da";

export type DocumentKind = "acord" | "adeziune";

/** A follow-up text field, shown and required only for one answer of its parent select. */
const FOLLOW_UPS: Record<string, { parent: string; value: string }> = {
  relationshipOther: { parent: "relationship", value: RELATIONSHIP_OTHER },
  sourceOther: { parent: "source", value: SOURCE_OTHER },
};

export function isFollowUpShown(key: string, answers: Record<string, CustomAnswer>): boolean {
  const rule = FOLLOW_UPS[key];
  return !rule || answers[rule.parent] === rule.value;
}

/**
 * The step as the parent sees it: follow-ups hidden unless their trigger answer
 * is picked (then required, as in the script form), and the abonament select
 * filled with the options offered for the chosen membership.
 */
export function prepareStep(
  step: FormStepConfig,
  answers: Record<string, CustomAnswer>,
  subscription: { value: string; label: string }[],
): FormStepConfig {
  const questions = (step.questions ?? [])
    .filter((q) => isFollowUpShown(q.key, answers))
    .map((q) => {
      if (FOLLOW_UPS[q.key]) return { ...q, required: true };
      if (q.key === "subscriptionChoice") {
        return { ...q, options: subscription.map((o) => ({ ...o, enabled: true })) };
      }
      return q;
    });
  return { ...step, questions };
}

/**
 * One answer changed. A follow-up loses its text when its trigger answer goes
 * away (the script form clears it too), and the abonament choice is dropped
 * when the new membership answer does not offer it.
 */
export function applyAnswer(
  answers: Record<string, CustomAnswer>,
  key: string,
  value: CustomAnswer,
  offeredFor: (membershipAnswer: string) => string[],
): Record<string, CustomAnswer> {
  const next: Record<string, CustomAnswer> = { ...answers, [key]: value };
  for (const [child, rule] of Object.entries(FOLLOW_UPS)) {
    if (rule.parent === key && value !== rule.value) delete next[child];
  }
  if (key === "membershipAnswer" && typeof next.subscriptionChoice === "string") {
    if (!offeredFor(String(value)).includes(next.subscriptionChoice)) delete next.subscriptionChoice;
  }
  return next;
}

export const CHILD_HEIGHT_ERROR = "Înălțimea copilului nu este validă.";

/** Same rule as the backend: whole centimetres, 50 to 230. Empty passes (required is checked apart). */
export function childHeightError(value: CustomAnswer | undefined): string | undefined {
  if (typeof value !== "string" || value.trim() === "") return undefined;
  const raw = value.trim();
  if (!/^\d{2,3}$/.test(raw)) return CHILD_HEIGHT_ERROR;
  const cm = Number(raw);
  return cm >= 50 && cm <= 230 ? undefined : CHILD_HEIGHT_ERROR;
}

const TEXT_KEYS = [
  "email",
  "parentName",
  "relationship",
  "phone",
  "childName",
  "childBirthDate",
  "childHeight",
  "shirtSize",
  "lastSeason",
  "priorExperience",
  "expectations",
  "membershipAnswer",
  "source",
] as const;

const str = (v: CustomAnswer | undefined): string => (typeof v === "string" ? v.trim() : "");

const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

/** A saved `submissionKey` is reused only when it is a UUID v4. */
export function isSubmissionKey(value: unknown): value is string {
  return typeof value === "string" && UUID_V4.test(value);
}

/**
 * One key per draft, a UUID v4: the backend answers a repeated submit with
 * the first registration. `randomUUID` exists only on https and localhost, so
 * a plain-http origin builds the same format from `getRandomValues`.
 */
export function newSubmissionKey(): string {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

/**
 * The POST /api/forms/inscriere body (backend `readRegistrationInput`). Only the
 * item name of the abonament is sent: the server sets the price and membership.
 */
export function buildPayload(
  answers: Record<string, CustomAnswer>,
  website: string,
  submissionKey: string,
): Record<string, unknown> {
  const payload: Record<string, unknown> = Object.fromEntries(TEXT_KEYS.map((k) => [k, str(answers[k])]));
  if (isFollowUpShown("relationshipOther", answers)) payload.relationshipOther = str(answers.relationshipOther);
  if (isFollowUpShown("sourceOther", answers)) payload.sourceOther = str(answers.sourceOther);
  payload.subscriptionChoice = { priceItemName: str(answers.subscriptionChoice) };
  payload.gdprConsent = answers.gdprConsent === true;
  payload.regulationsConsent = answers.regulationsConsent === true;
  payload.website = website;
  payload.submissionKey = submissionKey;
  return payload;
}

export type SubmitSuccess = {
  ok: true;
  registrationNumber: string;
  downloadToken: string | null;
  documents: DocumentKind[];
};
export type SubmitFailure = { ok: false; code: string | null; error: string | null };

const isKind = (v: unknown): v is DocumentKind => v === "acord" || v === "adeziune";

/**
 * Reads `{ ok: true, registrationNumber, downloadToken, documents }` (plans 2A + 2D)
 * or `{ ok: false, code, error }`. A success without a token (2D not deployed,
 * or the PDFs failed) still counts: the success screen then has no download.
 */
export function parseSubmitResponse(data: unknown, httpOk: boolean): SubmitSuccess | SubmitFailure {
  const body = (typeof data === "object" && data !== null ? data : {}) as Record<string, unknown>;
  const number = typeof body.registrationNumber === "string" ? body.registrationNumber : "";
  if (httpOk && body.ok === true && number) {
    const token = typeof body.downloadToken === "string" && body.downloadToken ? body.downloadToken : null;
    const documents = Array.isArray(body.documents) ? body.documents.filter(isKind) : [];
    return { ok: true, registrationNumber: number, downloadToken: token, documents: token ? documents : [] };
  }
  return {
    ok: false,
    code: typeof body.code === "string" ? body.code : null,
    error: typeof body.error === "string" && body.error ? body.error : null,
  };
}

/** The public PDF route of plan 2D; the token is valid 24 hours. */
export function documentUrl(base: string, token: string, kind: DocumentKind): string {
  return `${base}/api/forms/inscriere/documents?token=${encodeURIComponent(token)}&kind=${kind}`;
}

export const DOWNLOAD_LABELS: Record<DocumentKind, string> = {
  acord: "Descarcă formularul (PDF)",
  adeziune: "Descarcă cererea de adeziune (PDF)",
};

/** Acord always; Cerere de adeziune with "Da" to membership (spec 4.1). */
export function expectedDocuments(membershipAnswer: CustomAnswer | undefined): DocumentKind[] {
  return membershipAnswer === MEMBERSHIP_YES ? ["acord", "adeziune"] : ["acord"];
}

/** DECISIONS 2026-10-05: plural, or singular with only the Acord. */
export function signingSentence(documentCount: number): string {
  return documentCount > 1
    ? "Documentele vor fi semnate la prima ședință de curs."
    : "Documentul va fi semnat la prima ședință de curs.";
}

/**
 * A consent label with its document name turned into a link: the label text
 * around the first occurrence of `linkLabel`. Null when the label does not
 * contain it (an admin reworded one of them), so the caller links separately.
 */
export function splitOnLink(label: string, linkLabel: string): { before: string; link: string; after: string } | null {
  const at = linkLabel ? label.indexOf(linkLabel) : -1;
  if (at < 0) return null;
  return { before: label.slice(0, at), link: linkLabel, after: label.slice(at + linkLabel.length) };
}
