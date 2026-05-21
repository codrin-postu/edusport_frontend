// ---------------------------------------------------------------------------
// Form state - mirrors the Google Form fields exactly so this page acts as a
// thin wrapper that POSTs to the original form.
// https://docs.google.com/forms/d/e/1FAIpQLSe7wZIvQ1r6VvlElJP320qW99KB--QDZJbAaJiizSEm0TMz0w/viewform
// ---------------------------------------------------------------------------

export interface FormState {
  phone: string;
  childName: string;
  childBirthDate: string; // free text per source form, e.g. "25 decembrie 2018"
  parentName: string;
  howHeard: string;
  level: string;          // one of LEVEL_OPTIONS values (exact match required)
  priorExperience: string;
  expectations: string;
  shirtSize: string;
  clubInterest: string;   // "Da" | "Nu"
}

export type SubmitStatus = "idle" | "sending" | "sent" | "error";

export const INITIAL_FORM: FormState = {
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
};

// ---------------------------------------------------------------------------
// Select options - values must match the Google Form's option strings exactly
// or the submission is rejected silently.
// ---------------------------------------------------------------------------

export const LEVEL_OPTIONS = [
  { value: "", label: "Selectează nivelul..." },
  { value: "Nu a mai patinat niciodata", label: "Nu a mai patinat niciodata" },
  {
    value: "Vin pentru prima oara la cursuri, dar a mai patinat in alta parte.",
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
// Google Forms submission — temporarily pointing at the TEST form to validate
// the wire-up. Swap FORM_ACTION_URL + FIELD_MAP back once verified.
// Test form: 1FAIpQLSc96O1WzyaRmzCO4qXYoaqQFNHC74pN9xb_hyvJ4YiQQSBwGA
// ---------------------------------------------------------------------------

const FORM_ACTION_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSc96O1WzyaRmzCO4qXYoaqQFNHC74pN9xb_hyvJ4YiQQSBwGA/formResponse";

const FIELD_MAP: Record<keyof FormState, string> = {
  phone: "entry.1420679341",
  childName: "entry.855727190",
  childBirthDate: "entry.1218012492",
  parentName: "entry.123257503",
  howHeard: "entry.3218150",
  level: "entry.1755282559",
  priorExperience: "entry.463245855",
  expectations: "entry.1033551407",
  shirtSize: "entry.534712275",
  clubInterest: "entry.797981877",
};

// The test form has an "Email" field that the live form does not — required,
// so we send a static placeholder until the UI gets a real email input.
const EMAIL_FIELD = "entry.1110255729";
const EMAIL_PLACEHOLDER = "test@edusport.dev";

// Test form option strings differ from production — values the UI stores are
// the live form's labels, so we translate them at submit time.
const LEVEL_VALUE_TO_TEST: Record<string, string> = {
  "Nu a mai patinat niciodata": "nu a mai fost",
  "Vin pentru prima oara la cursuri, dar a mai patinat in alta parte.":
    "prima data",
  Incepatori: "incepatori",
  Intermediari: "intermediari",
  Avansati: "avansati",
  Performanta: "performanta",
};

// Consent / regulament are stored as booleans in the UI; we submit the exact
// option strings the TEST form's checkboxes/selects expect.
const GDPR_FIELD = "entry.1651976306";
const GDPR_CONSENT_VALUE = "am citit";

const REGULAMENT_FIELD = "entry.1581044451";
const REGULAMENT_AGREE_VALUE = "da";

export async function submitToGoogleForms(
  form: FormState,
  agreements: { gdpr: boolean; regulament: boolean },
): Promise<void> {
  const body = new URLSearchParams();
  body.append(EMAIL_FIELD, EMAIL_PLACEHOLDER);
  (Object.keys(form) as (keyof FormState)[]).forEach((key) => {
    const value =
      key === "level" ? LEVEL_VALUE_TO_TEST[form.level] ?? form.level : form[key];
    body.append(FIELD_MAP[key], value);
  });
  if (agreements.gdpr) body.append(GDPR_FIELD, GDPR_CONSENT_VALUE);
  if (agreements.regulament) body.append(REGULAMENT_FIELD, REGULAMENT_AGREE_VALUE);

  await fetch(FORM_ACTION_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });
}
