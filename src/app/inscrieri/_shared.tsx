import { inputBaseOnCard } from "@/components/ui/form-field";
import { User, CalendarDays, ClipboardCheck } from "lucide-react";

// inputBase alias for inscrieri - on-card variant (white bg + navy border)
export const inputBase = inputBaseOnCard;

// ---------------------------------------------------------------------------
// Step definitions
// ---------------------------------------------------------------------------

export const STEPS = [
  { label: "Date personale", icon: User },
  { label: "Experiență", icon: CalendarDays },
  { label: "Confirmare", icon: ClipboardCheck },
] as const;

// ---------------------------------------------------------------------------
// Step chrome now lives in src/components/forms/step-chrome.tsx (shared with
// the Voluntariat form). Re-exported here so existing inscrieri imports keep
// working; the default "card" variant renders exactly as before.
// ---------------------------------------------------------------------------

export { StepIndicator, StepNavigation } from "@/components/forms/step-chrome";
