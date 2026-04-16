// ---------------------------------------------------------------------------
// Form state
// ---------------------------------------------------------------------------

export interface FormState {
  childName: string;
  childBirthDate: string;
  shirtSize: string;
  parentName: string;
  phone: string;
  level: string;
  priorExperience: string;
  expectations: string;
  howHeard: string;
  clubInterest: string;
}

export type SubmitStatus = "idle" | "sending" | "sent" | "error";

export const INITIAL_FORM: FormState = {
  childName: "",
  childBirthDate: "",
  shirtSize: "",
  parentName: "",
  phone: "",
  level: "",
  priorExperience: "",
  expectations: "",
  howHeard: "",
  clubInterest: "",
};

// ---------------------------------------------------------------------------
// Select options
// ---------------------------------------------------------------------------

export const LEVEL_OPTIONS = [
  { value: "", label: "Selectează nivelul..." },
  { value: "incepator", label: "Începător (prima dată pe gheață)" },
  { value: "elementar", label: "Elementar (câteva ședințe anterioare)" },
  { value: "mediu", label: "Mediu (mers sigur, câteva elemente)" },
  { value: "avansat", label: "Avansat (experiență anterioară solidă)" },
];

export const CLUB_OPTIONS = [
  { value: "", label: "Selectează răspunsul..." },
  { value: "da", label: "Da, sunt interesat(ă)" },
  { value: "nu", label: "Nu, deocamdată" },
  { value: "poate", label: "Poate, vreau mai multe informații" },
];

// ---------------------------------------------------------------------------
// Google Forms submission
// ---------------------------------------------------------------------------

// Replace FORM_ACTION_URL and entry IDs with your actual Google Form values.
const FORM_ACTION_URL =
  "https://docs.google.com/forms/d/e/REPLACE_WITH_YOUR_FORM_ID/formResponse";

const FIELD_MAP: Record<keyof FormState, string> = {
  childName: "entry.000000001",
  childBirthDate: "entry.000000002",
  shirtSize: "entry.000000003",
  parentName: "entry.000000004",
  phone: "entry.000000005",
  level: "entry.000000006",
  priorExperience: "entry.000000007",
  expectations: "entry.000000008",
  howHeard: "entry.000000009",
  clubInterest: "entry.000000010",
};

export async function submitToGoogleForms(form: FormState): Promise<void> {
  const body = new URLSearchParams();
  (Object.keys(form) as (keyof FormState)[]).forEach((key) => {
    body.append(FIELD_MAP[key], form[key]);
  });

  await fetch(FORM_ACTION_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });
}
