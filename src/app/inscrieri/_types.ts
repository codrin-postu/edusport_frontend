// ---------------------------------------------------------------------------
// Form state for the EduSport registration form. Submits to the in-house
// backend endpoint /api/forms/inscriere.
// ---------------------------------------------------------------------------

import type { CustomAnswer, FormConfig } from "@/lib/strapi-forms";

export interface FormState {
  email: string;
  phone: string;
  childName: string;
  childBirthDate: string; // free text, e.g. "25 decembrie 2018"
  parentName: string;
  howHeard: string;
  level: string;          // one of LEVEL_OPTIONS values (exact backend string)
  priorExperience: string;
  expectations: string;
  shirtSize: string;
  clubInterest: string;   // "Da" | "Nu"
  website: string;        // honeypot - must stay empty
}

export type SubmitStatus = "idle" | "sending" | "sent" | "error";

export const INITIAL_FORM: FormState = {
  email: "",
  phone: "",
  childName: "",
  childBirthDate: "",
  parentName: "",
  howHeard: "",
  level: "",
  priorExperience: "",
  expectations: "",
  shirtSize: "",
  clubInterest: "",
  website: "",
};

// ---------------------------------------------------------------------------
// Select options - `value` is the exact string the backend expects, `label`
// is the text shown to the user (kept identical to the original form copy).
// ---------------------------------------------------------------------------

export const LEVEL_OPTIONS = [
  { value: "", label: "Selectează nivelul..." },
  { value: "Nu a mai patinat", label: "Nu a mai patinat niciodata" },
  {
    value: "A mai patinat in alta parte",
    label: "Vin pentru prima oara la cursuri, dar a mai patinat in alta parte.",
  },
  { value: "Incepatori", label: "Incepatori" },
  { value: "Intermediari", label: "Intermediari" },
  { value: "Avansati", label: "Avansati" },
  { value: "Performanta", label: "Performanta" },
];

export const CLUB_OPTIONS = [
  { value: "", label: "Selectează răspunsul..." },
  { value: "Da", label: "Da" },
  { value: "Nu", label: "Nu" },
];

// ---------------------------------------------------------------------------
// Backend submission — POSTs JSON to the in-house endpoint and drives the
// success / error states from the { ok, error } response.
// ---------------------------------------------------------------------------

// Public url on purpose: this request is made from the browser.
const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337";

/**
 * Built-in keys that map to real columns on the submission. Anything else in
 * the config is an admin-added question and travels in `extra`.
 */
const BUILTIN_STRING_KEYS = [
  "email",
  "phone",
  "childName",
  "childBirthDate",
  "parentName",
  "shirtSize",
  "howHeard",
  "level",
  "priorExperience",
  "expectations",
] as const;

const BUILTIN_BOOL_KEYS = [
  "clubInterest",
  "regulationsAgreement",
  "privacyConsent",
] as const;

const BUILTIN_KEYS = new Set<string>([
  ...BUILTIN_STRING_KEYS,
  ...BUILTIN_BOOL_KEYS,
]);

const asString = (v: CustomAnswer | undefined): string =>
  typeof v === "string" ? v : v === true ? "Da" : v === false ? "Nu" : "";

/** Checkbox answers arrive as booleans; older select-style ones as "Da"/"Nu". */
const asBool = (v: CustomAnswer | undefined): boolean =>
  v === true || v === "Da";

/**
 * Submit the collected answers.
 *
 * Answers are held in one flat map keyed by question key, because the form is
 * rendered from the CMS config and does not know in advance which questions
 * exist. The split into real columns versus the `extra` object happens here,
 * driven by `BUILTIN_KEYS`: any question the CMS added that is not a built-in
 * is sent under `extra`, which is exactly what the backend expects.
 */
export async function submitRegistration(
  config: { steps?: { questions?: { key: string; type?: string }[] }[] },
  answers: Record<string, CustomAnswer>,
  website: string,
): Promise<void> {
  const extra: Record<string, CustomAnswer> = {};
  for (const step of config.steps ?? []) {
    for (const q of step.questions ?? []) {
      if (!q?.key || BUILTIN_KEYS.has(q.key) || q.type === "info") continue;
      const v = answers[q.key];
      if (typeof v === "boolean") extra[q.key] = v;
      else if (typeof v === "string" && v.trim() !== "") extra[q.key] = v;
    }
  }

  const payload: Record<string, unknown> = {
    ...Object.fromEntries(
      BUILTIN_STRING_KEYS.map((k) => [k, asString(answers[k])]),
    ),
    ...Object.fromEntries(BUILTIN_BOOL_KEYS.map((k) => [k, asBool(answers[k])])),
    website,
    ...(Object.keys(extra).length ? { extra } : {}),
  };

  const res = await fetch(`${STRAPI_URL}/api/forms/inscriere`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = (await res.json().catch(() => null)) as
    | { ok?: boolean; error?: string }
    | null;

  if (!res.ok || !data || data.ok !== true) {
    throw new Error(data?.error ?? "Înscrierea nu a putut fi trimisă.");
  }
}

// ---------------------------------------------------------------------------
// Offline fallback. The CMS is the source of truth for the form; this exists
// only so a transient outage of the config endpoint does not take registrations
// offline. Keep it in step with the backend registry.
// ---------------------------------------------------------------------------

export const FALLBACK_CONFIG = {
  type: "inscriere",
  steps: [
    {
      key: "personal",
      title: "Date personale",
      questions: [
        { key: "childName", type: "text", label: "Nume complet copil", required: true },
        { key: "childBirthDate", type: "text", label: "Data nașterii copilului", required: true },
        { key: "shirtSize", type: "text", label: "Mărime tricou & înălțime", required: true },
        { key: "parentName", type: "text", label: "Nume complet părinte", required: true },
        { key: "phone", type: "tel", label: "Telefon", required: true },
        { key: "email", type: "email", label: "Email", required: true },
      ],
    },
    {
      key: "experienta",
      title: "Experiență",
      questions: [
        {
          key: "level",
          type: "select",
          label:
            "Sezonul trecut, fiul/fiica dvs. a participat la cursurile noastre, la grupa",
          required: true,
          options: LEVEL_OPTIONS.filter((o) => o.value !== "").map((o) => ({
            value: o.value,
            label: o.label,
            enabled: true,
          })),
        },
        {
          key: "priorExperience",
          type: "longtext",
          label: "Pentru o încadrare cât mai corectă în grupe",
          required: true,
        },
        {
          key: "expectations",
          type: "longtext",
          label: "Care sunt așteptările dvs. de la cursurile de patinaj?",
          required: true,
        },
        {
          key: "howHeard",
          type: "text",
          label: "De unde ați aflat de cursurile oferite de Școala de Patinaj",
          required: true,
        },
      ],
    },
    {
      key: "confirmare",
      title: "Confirmare",
      questions: [
        {
          key: "clubInterest",
          type: "checkbox",
          label: "Doriți ca fiul/fiica dvs. să devină membru A.C.S. EduSport?",
          required: true,
        },
        {
          key: "regulationsAgreement",
          type: "checkbox",
          label: "Sunt de acord cu regulamentul",
          required: true,
        },
        {
          key: "privacyConsent",
          type: "checkbox",
          label: "Sunt de acord cu politica de confidențialitate",
          required: true,
        },
      ],
    },
  ],
} as const satisfies FormConfig;
