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

import { STRAPI_BASE } from "./strapi-base";

import type { SelectItemOption } from "@/components/ui/select";

export type FormType = "inscriere" | "contact";

export type FormQuestionType =
  | "text"
  | "email"
  | "tel"
  | "longtext"
  | "select"
  | "checkbox"
  | "date"
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
  /**
   * Card fields. A `checkbox` or `info` question renders as a bordered card
   * with an icon, heading, description and link once `title` or `icon` is set;
   * with neither it falls back to a plain checkbox / paragraph. Supplied by the
   * CMS, which is why the consent cards survive without hardcoding them here.
   */
  title?: string;
  icon?: string;
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

const STRAPI_URL = STRAPI_BASE;

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
  required: "Acest câmp este obligatoriu.",
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

// ---------------------------------------------------------------------------
// Custom (admin-added) questions. Any question whose `key` is not part of a
// form's known built-in set is "custom": it is rendered generically from its
// `type` and its answer is submitted under the `extra` object, keyed by the
// custom key (e.g. `extra: { "c_ab12": "Praf, polen" }`). Everything degrades
// to zero customs when the config is absent, so the built-in forms are
// unchanged in fallback mode.
// ---------------------------------------------------------------------------

/** Built-in keys for the Contact form (everything else in config is custom). */
export const CONTACT_BUILTIN_KEYS = new Set<string>([
  "name",
  "email",
  "phone",
  "reason",
  "message",
]);

/** Built-in keys for the Înscriere form (everything else in config is custom). */
export const INSCRIERE_BUILTIN_KEYS = new Set<string>([
  "email",
  "phone",
  "childName",
  "childBirthDate",
  "parentName",
  "howHeard",
  "level",
  "priorExperience",
  "expectations",
  "shirtSize",
  "clubInterest",
  "website",
  "regulationsAgreement",
  "privacyConsent",
]);

/** A custom answer is a string (text/select/date/...) or a boolean (checkbox). */
export type CustomAnswer = string | boolean;

function isRenderableCustom(
  q: FormQuestion | undefined,
  builtins: Set<string>,
  notice: FormQuestion | undefined,
): q is FormQuestion {
  return (
    !!q &&
    typeof q.key === "string" &&
    !builtins.has(q.key) &&
    q.hidden !== true &&
    q !== notice
  );
}

/**
 * Every custom question across all steps, in config order. Excludes hidden
 * questions and the single `info` block already consumed as the confirm notice
 * (see `getInfoQuestion`) so it is never rendered twice.
 */
export function getCustomQuestions(
  config: FormConfig | null | undefined,
  builtins: Set<string>,
): FormQuestion[] {
  if (!config?.steps) return [];
  const notice = getInfoQuestion(config);
  const out: FormQuestion[] = [];
  for (const step of config.steps) {
    for (const q of step.questions ?? []) {
      if (isRenderableCustom(q, builtins, notice)) out.push(q);
    }
  }
  return out;
}

/**
 * Custom questions belonging to the config step that contains any of `anchors`
 * (a set of built-in keys unique to that step), in config order. Used to place
 * customs inside the right multi-step page of the Înscriere form.
 */
export function getCustomQuestionsForStep(
  config: FormConfig | null | undefined,
  anchors: string[],
  builtins: Set<string>,
): FormQuestion[] {
  if (!config?.steps) return [];
  const notice = getInfoQuestion(config);
  const step = config.steps.find((s) =>
    s.questions?.some((q) => q && anchors.includes(q.key)),
  );
  if (!step) return [];
  return (step.questions ?? []).filter((q) =>
    isRenderableCustom(q, builtins, notice),
  );
}

/** Enabled options of a custom `select`, mapped to the Select component shape. */
export function optionItems(question: FormQuestion): SelectItemOption[] {
  const opts = question.options;
  if (!Array.isArray(opts)) return [];
  return opts
    .filter((o) => o && o.enabled !== false && typeof o.value === "string")
    .map((o) => ({ value: o.value, label: o.label ?? o.value }));
}

/** Whether a required custom question has been answered. */
export function isCustomFilled(
  question: FormQuestion,
  value: CustomAnswer | undefined,
): boolean {
  if (question.type === "checkbox") return value === true;
  return typeof value === "string" && value.trim() !== "";
}

/** Format error (email / tel) for a custom answer, or `undefined` when valid. */
export function customFormatError(
  question: FormQuestion,
  value: CustomAnswer | undefined,
): string | undefined {
  if (typeof value !== "string") return undefined;
  return validateValueByType(question.type, value);
}

/**
 * Build the `extra` payload from the collected custom answers. Empty strings
 * are dropped; booleans (checkboxes) are always kept. `info` items carry no
 * answer. Returns `{}` when there is nothing to submit so callers can omit it.
 */
export function buildCustomPayload(
  questions: FormQuestion[],
  values: Record<string, CustomAnswer>,
): Record<string, CustomAnswer> {
  const extra: Record<string, CustomAnswer> = {};
  for (const q of questions) {
    if (q.type === "info") continue;
    const v = values[q.key];
    if (typeof v === "boolean") {
      extra[q.key] = v;
    } else if (typeof v === "string" && v.trim() !== "") {
      extra[q.key] = v;
    }
  }
  return extra;
}
