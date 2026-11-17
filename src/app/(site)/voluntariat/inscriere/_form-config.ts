// ---------------------------------------------------------------------------
// Form state for the EduSport volunteer form. Submits to the in-house backend
// endpoint /api/forms/voluntariat.
// ---------------------------------------------------------------------------

import {
  VOLUNTARIAT_BUILTIN_BOOL_KEYS,
  VOLUNTARIAT_BUILTIN_KEYS,
  VOLUNTARIAT_BUILTIN_STRING_KEYS,
  type CustomAnswer,
  type FormConfig,
} from "@/lib/strapi-forms";

export type SubmitStatus = "idle" | "sending" | "sent" | "error";

// ---------------------------------------------------------------------------
// Minor-volunteer logic. Volunteers aged 15-17 must provide a parent's name,
// phone and consent; adults never see those fields; under 15 cannot apply.
// ---------------------------------------------------------------------------

/** Questions only shown (and then required) for volunteers aged 15-17. */
export const MINOR_ONLY_KEYS = new Set<string>([
  "parentName",
  "parentPhone",
  "parentalConsent",
]);

export const MIN_VOLUNTEER_AGE = 15;

/**
 * Age in full years from a date-input value (YYYY-MM-DD). Returns `null` when
 * the value is empty, unparseable or implausible, so callers can treat
 * "unknown" separately from "adult" / "minor".
 */
export function ageFromBirthDate(v: string): number | null {
  if (!v || v.trim() === "") return null;
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age -= 1;
  if (age < 0 || age > 120) return null;
  return age;
}

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
 * driven by `VOLUNTARIAT_BUILTIN_KEYS`: any question the CMS added that is not
 * a built-in is sent under `extra`, which is exactly what the backend expects.
 */
export async function submitVolunteer(
  config: { steps?: { questions?: { key: string; type?: string }[] }[] },
  answers: Record<string, CustomAnswer>,
  website: string,
): Promise<void> {
  const extra: Record<string, CustomAnswer> = {};
  for (const step of config.steps ?? []) {
    for (const q of step.questions ?? []) {
      if (!q?.key || VOLUNTARIAT_BUILTIN_KEYS.has(q.key) || q.type === "info") continue;
      const v = answers[q.key];
      if (typeof v === "boolean") extra[q.key] = v;
      else if (typeof v === "string" && v.trim() !== "") extra[q.key] = v;
    }
  }

  const payload: Record<string, unknown> = {
    ...Object.fromEntries(
      VOLUNTARIAT_BUILTIN_STRING_KEYS.map((k) => [k, asString(answers[k])]),
    ),
    ...Object.fromEntries(
      VOLUNTARIAT_BUILTIN_BOOL_KEYS.map((k) => [k, asBool(answers[k])]),
    ),
    // Multiselect answers travel as string arrays to matching json columns.
    helpAreas: Array.isArray(answers.helpAreas) ? answers.helpAreas : [],
    website,
    ...(Object.keys(extra).length ? { extra } : {}),
  };

  const res = await fetch(`${STRAPI_URL}/api/forms/voluntariat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = (await res.json().catch(() => null)) as
    | { ok?: boolean; error?: string }
    | null;

  if (!res.ok || !data || data.ok !== true) {
    throw new Error(data?.error ?? "Cererea nu a putut fi trimisă.");
  }
}

// ---------------------------------------------------------------------------
// Offline fallback. The CMS is the source of truth for the form; this exists
// only so a transient outage of the config endpoint does not take volunteer
// applications offline. Keep it in step with the backend registry.
// ---------------------------------------------------------------------------

const opts = (values: string[]) =>
  values.map((value) => ({ value, label: value, enabled: true }));

export const FALLBACK_CONFIG = {
  type: "voluntariat",
  steps: [
    {
      key: "personal",
      title: "Date personale",
      questions: [
        { key: "fullName", type: "text", label: "Nume complet", required: true },
        { key: "birthDate", type: "date", label: "Data nașterii", required: true },
        { key: "email", type: "email", label: "Email", required: true },
        { key: "phone", type: "tel", label: "Telefon", required: true },
        { key: "city", type: "text", label: "Oraș", required: true },
        {
          key: "occupation",
          type: "select",
          label: "Ocupație",
          required: true,
          options: opts(["Elev", "Student", "Angajat", "Altele"]),
        },
        { key: "parentName", type: "text", label: "Nume complet părinte/tutore" },
        { key: "parentPhone", type: "tel", label: "Telefon părinte/tutore" },
        {
          key: "parentalConsent",
          type: "checkbox",
          label: "Am acordul părintelui/tutorelui pentru a face voluntariat",
        },
      ],
    },
    {
      key: "implicare",
      title: "Implicare",
      questions: [
        {
          key: "helpAreas",
          type: "multiselect",
          label: "Cum vrei să ajuți?",
          options: opts([
            "Sprijin la antrenamente pe gheață",
            "Supraveghere / însoțire copii",
            "Organizare competiții și evenimente",
            "Foto-video & social media",
            "Suport logistic (echipament, patine)",
          ]),
        },
        {
          key: "availability",
          type: "select",
          label: "Disponibilitate",
          required: true,
          options: opts(["În timpul săptămânii", "În weekend", "Ambele"]),
        },
        {
          key: "frequency",
          type: "select",
          label: "Cât de des te poți implica?",
          required: true,
          options: opts(["Săptămânal", "De câteva ori pe lună", "Doar la evenimente"]),
        },
        {
          key: "skatingExperience",
          type: "select",
          label: "Ai experiență pe patine?",
          required: true,
          options: opts(["Da, patinez", "Puțin", "Deloc"]),
        },
        {
          key: "childrenExperience",
          type: "longtext",
          label: "Experiență în lucrul cu copiii",
        },
      ],
    },
    {
      key: "motivatie",
      title: "Motivație",
      questions: [
        {
          key: "motivation",
          type: "longtext",
          label: "De ce vrei să fii voluntar?",
          required: true,
        },
        {
          key: "howHeard",
          type: "select",
          label: "De unde ai aflat de noi?",
          options: opts([
            "Social media",
            "Prieteni sau familie",
            "La patinoar",
            "Google",
            "Altele",
          ]),
        },
        {
          key: "volunteerNotice",
          type: "info",
          title: "Bine de știut",
          icon: "shield",
          label:
            "Voluntarii semnează un contract de voluntariat (Legea 78/2014) și, pentru activitățile cu copii, prezintă certificatul de integritate comportamentală (Legea 118/2019). Te ghidăm noi prin ambele.",
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
