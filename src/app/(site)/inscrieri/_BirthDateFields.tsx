"use client";

import React from "react";
import { DatePickerField } from "@/components/ui/date-picker-field";
import type { CustomAnswer } from "@/lib/strapi-forms";
import { composeBirthDate, parseBirthDate } from "./_rules";

/**
 * "Data nașterii copilului" as the shared date picker: type the date or pick it
 * from the calendar (its heading opens a year grid). The answer stays one
 * "ZZ.LL.AAAA" string under the single `childBirthDate` key, so the draft, the
 * submit payload and the admin panel are unaffected; the picker speaks
 * "YYYY-MM-DD", converted at this edge.
 */
interface BirthDateFieldsProps {
  value: CustomAnswer | undefined;
  onChange: (value: string) => void;
  label: string;
  required?: boolean;
  error?: string;
  onBlur?: () => void;
}

/** "ZZ.LL.AAAA" to "YYYY-MM-DD", or "" when incomplete. */
function toIso(value: CustomAnswer | undefined): string {
  const { day, month, year } = parseBirthDate(typeof value === "string" ? value : "");
  return day && month && year ? `${year}-${month}-${day}` : "";
}

/** "YYYY-MM-DD" to "ZZ.LL.AAAA", or "" when empty. */
function fromIso(iso: string): string {
  const [year, month, day] = iso.split("-");
  return iso ? composeBirthDate({ day, month, year }) : "";
}

const BirthDateFields: React.FC<BirthDateFieldsProps> = ({
  value,
  onChange,
  label,
  required,
  error,
  onBlur,
}) => (
  <div>
    <DatePickerField
      id="childBirthDate"
      name="childBirthDate"
      label={label}
      value={toIso(value)}
      onChange={(iso) => {
        const next = fromIso(iso);
        onChange(next);
        // A date typed to the end never closes the calendar; report it the
        // moment it is complete, as a blur would.
        if (next) onBlur?.();
      }}
      onBlur={onBlur}
      required={required}
      invalid={Boolean(error)}
    />
    {error && <p className="text-caption text-accent mt-2">{error}</p>}
  </div>
);

export default BirthDateFields;
