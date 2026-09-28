import { inputBaseOnCard } from "@/components/ui/form-field";
import type { IconName } from "@/components/ui/icon";

// inputBase alias for inscrieri - on-card variant (white bg + navy border)
export const inputBase = inputBaseOnCard;

// ---------------------------------------------------------------------------
// Step definitions
// ---------------------------------------------------------------------------

export const STEPS: { label: string; icon: IconName }[] = [
  { label: "Date personale", icon: "user" },
  { label: "Experiență", icon: "calendar-days" },
  { label: "Confirmare", icon: "clipboard-check" },
];

// ---------------------------------------------------------------------------
// Step chrome now lives in src/components/forms/step-chrome.tsx (shared with
// the Voluntariat form). Re-exported here so existing inscrieri imports keep
// working; the default "card" variant renders exactly as before.
// ---------------------------------------------------------------------------

export { StepIndicator, StepNavigation } from "@/components/forms/step-chrome";
