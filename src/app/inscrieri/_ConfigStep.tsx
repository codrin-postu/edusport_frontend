"use client";

import React from "react";
import ConfigStep, { type ConfigStepProps } from "@/components/forms/config-step";

// The generic step renderer now lives in src/components/forms/config-step.tsx
// (shared with the Voluntariat form). This wrapper keeps the inscrieri imports
// and behaviour unchanged: "card" variant, no question filter, inscrieri
// placeholders baked in.
export { stepComplete } from "@/components/forms/config-step";

/**
 * Input hints. The CMS has no placeholder concept, so these stay in the
 * frontend as presentation. Keyed by built-in question key; a question without
 * an entry (any admin-added one) simply renders without a placeholder.
 */
const PLACEHOLDERS: Record<string, string> = {
  childName: "Numele complet al copilului",
  childBirthDate: "ex: 25 decembrie 2018",
  shirtSize: "ex: 128 cm / mărime 8 ani",
  parentName: "Numele complet al părintelui",
  phone: "+40 7xx xxx xxx",
  email: "adresa@exemplu.ro",
  priorExperience: "Detalii despre experiența anterioară pe gheață...",
  expectations: "Ce doriți să învețe copilul la curs...",
  howHeard: "ex: Facebook, prieteni, Google...",
};

const InscriereConfigStep: React.FC<
  Omit<ConfigStepProps, "variant" | "filterQuestion" | "placeholders">
> = (props) => <ConfigStep {...props} variant="card" placeholders={PLACEHOLDERS} />;

export default InscriereConfigStep;
