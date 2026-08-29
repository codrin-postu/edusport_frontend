// ---------------------------------------------------------------------------
// CMS-driven form configuration.
//
// Fetches an optional config document that describes the labels, help text,
// required flags, dropdown options, order and hidden state for the public
// forms (Înscriere, Contact). Every consumer MUST fall back gracefully to its
// hardcoded values when the config is unavailable (endpoint absent / 404 /
// malformed response) so the live forms never break.
//
// Shared contract (produced by the backend):
//   GET {NEXT_PUBLIC_STRAPI_URL ?? http://localhost:1337}/api/forms/:type/config
//   { type, steps: [ { key, title, questions: [
//       { key, type, label, help, required, hidden,
//         options?: [{ value, label, enabled }],
//         linkUrl?, linkLabel? } ] } ] }
// ---------------------------------------------------------------------------

import type { SelectItemOption } from "@/components/ui/select";

export type FormType = "inscriere" | "contact";

export type FormQuestionType =
  | "text"
  | "email"
  | "tel"
  | "longtext"
  | "select"
  | "checkbox"
  | "info";

export interface FormOption {
  value: string;
  label: string;
  enabled: boolean;
}

export interface FormQuestion {
  key: string;
  type: FormQuestionType;
  label?: string;
  help?: string;
  required?: boolean;
  hidden?: boolean;
  options?: FormOption[];
  // Only meaningful for `info` blocks (e.g. the confirm-step notice + link).
  linkUrl?: string;
  linkLabel?: string;
}

export interface FormStepConfig {
  key: string;
  title?: string;
  questions: FormQuestion[];
}

export interface FormConfig {
  type: string;
  steps: FormStepConfig[];
}

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337";

/**
 * Fetch the CMS config for a form. Returns `null` on any failure (network
 * error, non-2xx, malformed body) so callers can fall back to hardcoded copy.
 */
export async function fetchFormConfig(
  type: FormType,
): Promise<FormConfig | null> {
  try {
    const res = await fetch(`${STRAPI_URL}/api/forms/${type}/config`, {
      // Server-side: cache briefly, revalidate in the background. Ignored on
      // the client, harmless either way.
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const data = (await res.json().catch(() => null)) as unknown;
    if (!isFormConfig(data)) return null;
    return data;
  } catch {
    return null;
  }
}

function isFormConfig(data: unknown): data is FormConfig {
  if (!data || typeof data !== "object") return false;
  const steps = (data as { steps?: unknown }).steps;
  return Array.isArray(steps);
}

// ---------------------------------------------------------------------------
// Resolver helpers — every one takes a fallback so a missing config, missing
// step, or missing question key degrades cleanly to the current hardcoded UI.
// ---------------------------------------------------------------------------

/** Find a question by key across every step (keys are unique per form). */
export function getQuestion(
  config: FormConfig | null | undefined,
  key: string,
): FormQuestion | undefined {
  if (!config?.steps) return undefined;
  for (const step of config.steps) {
    const q = step.questions?.find((item) => item?.key === key);
    if (q) return q;
  }
  return undefined;
}

/** Effective label (config wins, else fallback). No asterisk is baked in. */
export function fieldLabel(
  config: FormConfig | null | undefined,
  key: string,
  fallback: string,
): string {
  const label = getQuestion(config, key)?.label;
  return typeof label === "string" && label.trim() !== "" ? label : fallback;
}

/** Effective help / placeholder text (config wins, else fallback). */
export function fieldHelp(
  config: FormConfig | null | undefined,
  key: string,
  fallback?: string,
): string | undefined {
  const help = getQuestion(config, key)?.help;
  return typeof help === "string" && help.trim() !== "" ? help : fallback;
}

/** Effective required flag (config wins, else fallback). */
export function isRequired(
  config: FormConfig | null | undefined,
  key: string,
  fallback: boolean,
): boolean {
  const required = getQuestion(config, key)?.required;
  return typeof required === "boolean" ? required : fallback;
}

/** Effective hidden flag. Defaults to visible when not specified. */
export function isHidden(
  config: FormConfig | null | undefined,
  key: string,
): boolean {
  return getQuestion(config, key)?.hidden === true;
}

/**
 * Effective select options. Config options are `{ value, label, enabled }`;
 * only enabled ones are rendered and their `value` is submitted. Falls back to
 * the hardcoded option list when config is missing or provides none.
 */
export function selectOptions(
  config: FormConfig | null | undefined,
  key: string,
  fallback: SelectItemOption[],
): SelectItemOption[] {
  const opts = getQuestion(config, key)?.options;
  if (!Array.isArray(opts)) return fallback;
  const enabled = opts
    .filter((o) => o && o.enabled !== false && typeof o.value === "string")
    .map((o) => ({ value: o.value, label: o.label ?? o.value }));
  return enabled.length > 0 ? enabled : fallback;
}

/** First `info`-type question within the form (used for confirm-step notice). */
export function getInfoQuestion(
  config: FormConfig | null | undefined,
): FormQuestion | undefined {
  if (!config?.steps) return undefined;
  for (const step of config.steps) {
    const q = step.questions?.find((item) => item?.type === "info");
    if (q) return q;
  }
  return undefined;
}

// ---------------------------------------------------------------------------
// Type-driven client-side validation. The effective question `type` decides
// which check runs, so it works whether the field type comes from config or
// from the hardcoded fallback.
// ---------------------------------------------------------------------------

/** Effective question type (config wins, else fallback). */
export function fieldType(
  config: FormConfig | null | undefined,
  key: string,
  fallback: FormQuestionType,
): FormQuestionType {
  return getQuestion(config, key)?.type ?? fallback;
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const VALIDATION_MESSAGES = {
  email: "Adresa de email nu este validă.",
  phone: "Numărul de telefon nu este valid.",
} as const;

/** Valid email per the shared rule. */
export function isValidEmail(value: string): boolean {
  return EMAIL_RE.test(value.trim());
}

/** Looks like a phone: digits/spaces/+/-/() with at least 7 digits. */
export function isValidPhone(value: string): boolean {
  const v = value.trim();
  if (!/^[0-9\s+\-()]+$/.test(v)) return false;
  return v.replace(/\D/g, "").length >= 7;
}

/**
 * Validate a value against its effective type. Empty values pass here (empty
 * required fields are gated separately), so this only flags a non-empty value
 * that is malformed. Returns an error message or `undefined` when valid.
 */
export function validateValueByType(
  type: FormQuestionType,
  value: string,
): string | undefined {
  if (!value || value.trim() === "") return undefined;
  if (type === "email" && !isValidEmail(value)) return VALIDATION_MESSAGES.email;
  if (type === "tel" && !isValidPhone(value)) return VALIDATION_MESSAGES.phone;
  return undefined;
}
