import { parsePhoneNumberFromString } from "libphonenumber-js/min";
import type { CustomAnswer } from "@/lib/strapi-forms";

export const PHONE_ERROR = "Numărul de telefon nu este valid.";

/** Same rule as the backend: a valid number, national numbers read as Romanian. Empty passes (required is checked apart). */
export function phoneError(value: CustomAnswer | undefined): string | undefined {
  if (typeof value !== "string" || value.trim() === "") return undefined;
  return parsePhoneNumberFromString(value.trim(), "RO")?.isValid() ? undefined : PHONE_ERROR;
}
