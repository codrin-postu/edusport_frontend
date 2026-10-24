// ---------------------------------------------------------------------------
// The registration form's offline config and presentation constants.
//
// No runtime imports on purpose: scripts/inscrieri/config.test.mjs loads this
// file with node's type stripping.
// ---------------------------------------------------------------------------

import type { FormConfig } from "@/lib/strapi-forms";

export type SubmitStatus = "idle" | "sending" | "sent" | "error";

// ---------------------------------------------------------------------------
// Offline fallback. The CMS is the source of truth for the form
// (GET /api/forms/inscriere/config); this exists only so an outage of the
// config endpoint does not take registrations offline. It is the public model
// of the backend registry `inscriere` (src/api/form-config/registry.ts, plan 2A
// Task 2) with no admin overlay: same steps, keys, order, types, labels, help,
// required flags, options and consent links. Keep the two in step.
// ---------------------------------------------------------------------------

const same = (values: string[]) => values.map((v) => ({ value: v, label: v, enabled: true }));

export const FALLBACK_CONFIG: FormConfig = {
  type: "inscriere",
  steps: [
    {
      key: "date",
      title: "Date înscriere",
      questions: [
        { key: "email", type: "email", label: "Adresă de e-mail", help: "", required: true, hidden: false },
        { key: "parentName", type: "text", label: "Numele și prenumele persoanei care completează formularul", help: "", required: true, hidden: false },
        {
          key: "relationship",
          type: "select",
          label: "Calitatea față de sportiv:",
          help: "",
          required: true,
          hidden: false,
          options: [
            { value: "parinte", label: "Părinte", enabled: true },
            { value: "tutore", label: "Tutore Legal", enabled: true },
            { value: "alta", label: "Alta (Vă rugăm specificați)", enabled: true },
          ],
        },
        { key: "relationshipOther", type: "text", label: "Specificați calitatea (ex: Bunic, Frate):", help: "", required: false, hidden: false },
        { key: "phone", type: "tel", label: "Telefon de contact", help: "", required: true, hidden: false },
        { key: "childName", type: "text", label: "Numele și prenumele copilului", help: "", required: true, hidden: false },
        { key: "childBirthDate", type: "text", label: "Data nașterii copilului", help: "", required: true, hidden: false },
        { key: "childHeight", type: "text", label: "Înălțimea copilului (cm)", help: "", required: true, hidden: false },
        { key: "shirtSize", type: "text", label: "Măsura bluză", help: "", required: true, hidden: false },
        {
          key: "lastSeason",
          type: "select",
          label: "Sezonul trecut fiul/fiica dvs. a participat la cursurile ACS EduSport?",
          help: "",
          required: true,
          hidden: false,
          options: same(["Nu a participat", "Începători", "Intermediari", "Avansați"]),
        },
        {
          key: "priorExperience",
          type: "longtext",
          label: "Nivel de experiență / Elemente cunoscute",
          help: "Dacă este prima participare, menționați dacă a mai luat lecții. Dacă a mai fost înscris la ACS EduSport, completați cu 'Nu este cazul'.",
          required: true,
          hidden: false,
        },
        { key: "expectations", type: "longtext", label: "Așteptări de la cursurile de patinaj", help: "", required: true, hidden: false },
      ],
    },
    {
      key: "abonament",
      title: "Abonament",
      questions: [
        {
          key: "membershipAnswer",
          type: "select",
          label: "Doriți înscrierea ca membru A.C.S. EduSport pentru tarife preferențiale?",
          help: "",
          required: true,
          hidden: false,
          options: [
            { value: "da", label: "Da, doresc să devin membru", enabled: true },
            { value: "nu", label: "Nu, optez pentru tarife neafiliați", enabled: true },
          ],
        },
        { key: "subscriptionChoice", type: "select", label: "La primul modul doriți să achiziționați:", help: "", required: true, hidden: false, options: [] },
      ],
    },
    {
      key: "finalizare",
      title: "Finalizare înscriere",
      questions: [
        {
          key: "source",
          type: "select",
          label: "De unde ați aflat de cursurile noastre?",
          help: "",
          required: true,
          hidden: false,
          options: same(["Facebook", "Instagram", "Recomandare", "Căutare Google", "Altele"]),
        },
        { key: "sourceOther", type: "text", label: "Vă rugăm să specificați de unde ați aflat de noi:", help: "", required: false, hidden: false },
        {
          key: "gdprConsent",
          type: "checkbox",
          label: "Confirm citirea documentului Politica de Confidențialitate și sunt de acord cu prelucrarea datelor.",
          help: "",
          required: true,
          hidden: false,
          title: "Consimțământ GDPR",
          icon: "",
          linkUrl: "/protectia-datelor",
          linkLabel: "Politica de Confidențialitate",
        },
        {
          key: "regulationsConsent",
          type: "checkbox",
          label: "Confirm că am citit, înțeles și acceptat condițiile prezentate în Regulamentul Școlii de Patinaj.",
          help: "",
          required: true,
          hidden: false,
          title: "Acord Regulament",
          icon: "",
          linkUrl: "/cursuri/regulament",
          linkLabel: "Regulamentul Școlii de Patinaj",
        },
      ],
    },
  ],
};

/** Keys rendered as the script form's consent lines ("Titlu: text with link"). */
export const CONSENT_KEYS = ["gdprConsent", "regulationsConsent"] as const;

/**
 * Placeholders. The CMS has no placeholder concept; these stay presentation.
 * Select placeholders are the script form's "Alegeți...".
 */
export const PLACEHOLDERS: Record<string, string> = {
  email: "adresa@exemplu.ro",
  phone: "+40 7xx xxx xxx",
  relationship: "Alegeți...",
  lastSeason: "Alegeți...",
  membershipAnswer: "Alegeți...",
  source: "Alegeți...",
};

/** The abonament select before and after the membership answer, as in the script form. */
export const SUBSCRIPTION_PLACEHOLDER = {
  waiting: "Alegeți mai întâi opțiunea de membru...",
  ready: "Alegeți opțiunea dorită...",
} as const;
