// ---------------------------------------------------------------------------
// Form state for the EduSport registration form. Submits to the in-house
// backend endpoint /api/forms/inscriere.
// ---------------------------------------------------------------------------

import type { CustomAnswer } from "@/lib/strapi-forms";

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

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337";

export async function submitRegistration(
  form: FormState,
  agreements: { gdpr: boolean; regulament: boolean },
  extra?: Record<string, CustomAnswer>,
): Promise<void> {
  const payload = {
    email: form.email,
    phone: form.phone,
    childName: form.childName,
    childBirthDate: form.childBirthDate,
    parentName: form.parentName,
    shirtSize: form.shirtSize,
    howHeard: form.howHeard,
    level: form.level,
    priorExperience: form.priorExperience,
    expectations: form.expectations,
    clubInterest: form.clubInterest === "Da",
    regulationsAgreement: agreements.regulament,
    privacyConsent: agreements.gdpr,
    website: form.website,
    // Custom (admin-added) answers keyed by their custom key; omitted when none.
    ...(extra && Object.keys(extra).length ? { extra } : {}),
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
