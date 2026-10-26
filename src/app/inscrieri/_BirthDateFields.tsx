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
  // three), so the parent echoes that same "" (or any other in-progress
  // composed value) answer straight back. Local state carries the three
  // picks across that round trip; it resyncs from the external answer only
  // when that answer is NOT the one we just told the parent to expect (a
  // draft restored after mount, or a restart clearing it) — never on the
  // render that simply echoes our own last `onChange` back, however
  // incomplete that composed value is. Comparing against the raw previous
  // `value` instead (as opposed to what we expect our own echo to be) would
  // misfire whenever the starting value is a non-empty old-format draft: the
  // first pick's "" echo would then read as a real external change and wipe
  // the pick that just happened.
  const normalized = typeof value === "string" ? value : "";
  const [parts, setParts] = React.useState<BirthDateParts>(() => parseBirthDate(normalized));
  const expected = React.useRef(normalized);
  if (expected.current !== normalized) {
    expected.current = normalized;
    setParts(parseBirthDate(normalized));
  }
  const years = birthYearOptions();

  const update = (key: keyof BirthDateParts, next: string) => {
    const merged = { ...parts, [key]: next };
    setParts(merged);
    const composed = composeBirthDate(merged);
    expected.current = composed;
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
