// ---------------------------------------------------------------------------
// Form state for the EduSport partner form. Submits to the in-house backend
// endpoint /api/forms/parteneri.
// ---------------------------------------------------------------------------

import {
  PARTENERI_BUILTIN_BOOL_KEYS,
  PARTENERI_BUILTIN_KEYS,
  PARTENERI_BUILTIN_STRING_KEYS,
  type CustomAnswer,
  type FormConfig,
} from "@/lib/strapi-forms";

export type SubmitStatus = "idle" | "sending" | "sent" | "error";

// ---------------------------------------------------------------------------
// Backend submission — POSTs JSON to the in-house endpoint and drives the
// success / error states from the { ok, error } response.
// ---------------------------------------------------------------------------

// Public url on purpose: this request is made from the browser.
const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337";

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
 * driven by `PARTENERI_BUILTIN_KEYS`: any question the CMS added that is not
 * a built-in is sent under `extra`, which is exactly what the backend expects.
 */
export async function submitPartner(
  config: { steps?: { questions?: { key: string; type?: string }[] }[] },
  answers: Record<string, CustomAnswer>,
  website: string,
): Promise<void> {
  const extra: Record<string, CustomAnswer> = {};
  for (const step of config.steps ?? []) {
    for (const q of step.questions ?? []) {
      if (!q?.key || PARTENERI_BUILTIN_KEYS.has(q.key) || q.type === "info") continue;
      const v = answers[q.key];
      if (typeof v === "boolean") extra[q.key] = v;
      else if (typeof v === "string" && v.trim() !== "") extra[q.key] = v;
    }
  }

  const payload: Record<string, unknown> = {
    ...Object.fromEntries(
      PARTENERI_BUILTIN_STRING_KEYS.map((k) => [k, asString(answers[k])]),
    ),
    ...Object.fromEntries(
      PARTENERI_BUILTIN_BOOL_KEYS.map((k) => [k, asBool(answers[k])]),
    ),
    website,
    ...(Object.keys(extra).length ? { extra } : {}),
  };

  const res = await fetch(`${STRAPI_URL}/api/forms/parteneri`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = (await res.json().catch(() => null)) as
    | { ok?: boolean; error?: string }
    | null;

  if (!res.ok || !data || data.ok !== true) {
    throw new Error(data?.error ?? "Mesajul nu a putut fi trimis.");
  }
}

// ---------------------------------------------------------------------------
// Offline fallback. The CMS is the source of truth for the form; this exists
// only so a transient outage of the config endpoint does not take partner
// inquiries offline. Keep it in step with the backend registry.
// ---------------------------------------------------------------------------

const opts = (values: string[]) =>
  values.map((value) => ({ value, label: value, enabled: true }));

export const FALLBACK_CONFIG = {
  type: "parteneri",
  steps: [
    {
      key: "contact",
      title: "Date de contact",
      questions: [
        {
          key: "companyName",
          type: "text",
          label: "Companie / Organizație",
          required: true,
        },
        {
          key: "contactName",
          type: "text",
          label: "Persoană de contact",
          required: true,
        },
        { key: "email", type: "email", label: "E-mail", required: true },
        { key: "phone", type: "tel", label: "Telefon" },
      ],
    },
    {
      key: "colaborare",
      title: "Colaborare",
      questions: [
        {
          key: "collaborationType",
          type: "select",
          label: "Tip colaborare",
          required: true,
          options: opts([
            "Sponsorizarea clubului",
            "Organizarea unui eveniment special",
            "Altă colaborare",
          ]),
        },
        {
          key: "message",
          type: "longtext",
          label: "Descrie colaborarea",
          required: true,
        },
        {
          key: "privacyConsent",
          type: "checkbox",
          label: "Sunt de acord cu prelucrarea datelor personale",
          required: true,
        },
      ],
    },
  ],
} as const satisfies FormConfig;
