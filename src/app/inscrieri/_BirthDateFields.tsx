"use client";

import React from "react";
import { Select } from "@/components/ui/select";
import type { CustomAnswer } from "@/lib/strapi-forms";
import {
  BIRTH_DAY_OPTIONS,
  BIRTH_MONTH_OPTIONS,
  birthYearOptions,
  composeBirthDate,
  parseBirthDate,
  type BirthDateParts,
} from "./_rules";

/**
 * "Data nașterii copilului" as three selects (zi / lună / an) instead of free
 * text [SPEC 9]. The combined answer stays one "ZZ.LL.AAAA" string under the
 * single `childBirthDate` key, same as before this picker existed, so the
 * draft, the submit payload and the admin panel are unaffected.
 */
interface BirthDateFieldsProps {
  value: CustomAnswer | undefined;
  onChange: (value: string) => void;
  label: string;
  required?: boolean;
  error?: string;
  onBlur?: () => void;
}

const BirthDateFields: React.FC<BirthDateFieldsProps> = ({
  value,
  onChange,
  label,
  required,
  error,
  onBlur,
}) => {
  // A day or month picked alone composes to "" (composeBirthDate needs all
  // three), so the parent echoes the same "" answer back and a `parts`
  // derived fresh from `value` on every render would forget that pick on the
  // very next render. Local state carries the three picks across that gap;
  // it resyncs from the external answer only when that answer actually
  // changes (a draft restored after mount, or a restart clearing it), not on
  // every render echoing back the same value. "undefined" (no answer yet) and
  // "" (an incomplete composed answer) both mean "nothing typed", so they are
  // normalized to the same string before comparing — otherwise the very
  // first pick's undefined -> "" echo reads as a real external change and
  // wipes the pick that just happened.
  const normalized = typeof value === "string" ? value : "";
  const [parts, setParts] = React.useState<BirthDateParts>(() => parseBirthDate(normalized));
  const lastValue = React.useRef(normalized);
  if (lastValue.current !== normalized) {
    lastValue.current = normalized;
    setParts(parseBirthDate(normalized));
  }
  const years = birthYearOptions();

  const update = (key: keyof BirthDateParts, next: string) => {
    const merged = { ...parts, [key]: next };
    setParts(merged);
    const composed = composeBirthDate(merged);
    onChange(composed);
    // The three selects never get a native blur worth listening to (Radix
    // closes the menu and returns focus to the trigger); report once the
    // date is complete, the same moment a real blur would have fired.
    if (composed) onBlur?.();
  };

  return (
    <fieldset>
      <legend className="text-label block mb-2 text-secondary">{label}</legend>
      <div className="flex gap-3">
        <Select
          id="childBirthDateDay"
          name="childBirthDateDay"
          value={parts.day}
          onValueChange={(v) => update("day", v)}
          options={BIRTH_DAY_OPTIONS}
          placeholder="Zi"
          required={required}
          aria-invalid={error ? true : undefined}
        />
        <Select
          id="childBirthDateMonth"
          name="childBirthDateMonth"
          value={parts.month}
          onValueChange={(v) => update("month", v)}
          options={BIRTH_MONTH_OPTIONS}
          placeholder="Lună"
          required={required}
          aria-invalid={error ? true : undefined}
        />
        <Select
          id="childBirthDateYear"
          name="childBirthDateYear"
          value={parts.year}
          onValueChange={(v) => update("year", v)}
          options={years}
          placeholder="An"
          required={required}
          aria-invalid={error ? true : undefined}
        />
      </div>
      {error && <p className="text-caption text-accent mt-2">{error}</p>}
    </fieldset>
  );
};

export default BirthDateFields;
