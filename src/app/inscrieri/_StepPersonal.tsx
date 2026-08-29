"use client";

import { FieldLabel } from "@/components/ui/form-field";
import { motion } from "motion/react";
import React, { useState } from "react";
import { inputBase, StepIndicator, StepNavigation } from "./_shared";
import type { FormState } from "./_types";
import CustomQuestions from "@/components/ui/custom-questions";
import {
  customFormatError,
  fieldHelp,
  fieldLabel,
  fieldType,
  getCustomQuestionsForStep,
  isCustomFilled,
  isHidden,
  isRequired,
  validateValueByType,
  INSCRIERE_BUILTIN_KEYS,
  type CustomAnswer,
  type FormConfig,
} from "@/lib/strapi-forms";

const PERSONAL_ANCHORS = [
  "childName",
  "childBirthDate",
  "shirtSize",
  "parentName",
  "phone",
  "email",
];

interface StepPersonalProps {
  form: FormState;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onNext: () => void;
  config?: FormConfig | null;
  extra: Record<string, CustomAnswer>;
  onCustomChange: (key: string, value: CustomAnswer) => void;
}

const fieldItem = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } },
};

// Hardcoded fallbacks (labels carry no asterisk — it is appended from the
// effective `required` flag so the UI matches today's copy exactly).
const FALLBACK = {
  childName: { label: "Nume complet copil", placeholder: "Numele complet al copilului", required: true, type: "text" as const },
  childBirthDate: { label: "Data nașterii copilului", placeholder: "ex: 25 decembrie 2018", required: true, type: "text" as const },
  shirtSize: { label: "Mărime tricou & înălțime", placeholder: "ex: 128 cm / mărime 8 ani", required: true, type: "text" as const },
  parentName: { label: "Nume complet părinte", placeholder: "Numele complet al părintelui", required: true, type: "text" as const },
  phone: { label: "Telefon", placeholder: "+40 7xx xxx xxx", required: true, type: "tel" as const },
  email: { label: "Email", placeholder: "adresa@exemplu.ro", required: true, type: "email" as const },
};

type FieldKey = keyof typeof FALLBACK;

const StepPersonal: React.FC<StepPersonalProps> = ({
  form,
  onChange,
  onNext,
  config = null,
  extra,
  onCustomChange,
}) => {
  const req = (key: FieldKey) => isRequired(config, key, FALLBACK[key].required);
  const shown = (key: FieldKey) => !isHidden(config, key);
  const typeOf = (key: FieldKey) => fieldType(config, key, FALLBACK[key].type);

  const customs = getCustomQuestionsForStep(
    config,
    PERSONAL_ANCHORS,
    INSCRIERE_BUILTIN_KEYS,
  );

  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({});
  const [customErrors, setCustomErrors] = useState<
    Record<string, string | undefined>
  >({});

  const validate = (key: FieldKey) =>
    validateValueByType(typeOf(key), form[key]);

  const handleBlur = (key: FieldKey) => () =>
    setErrors((prev) => ({ ...prev, [key]: validate(key) }));

  const handleCustomBlur = (key: string) => {
    const q = customs.find((c) => c.key === key);
    if (!q) return;
    setCustomErrors((prev) => ({
      ...prev,
      [key]: customFormatError(q, extra[key]),
    }));
  };

  // Validate all visible fields on advance; block if any is malformed.
  const handleNext = () => {
    const next: Partial<Record<FieldKey, string>> = {};
    let ok = true;
    (Object.keys(FALLBACK) as FieldKey[]).forEach((key) => {
      if (!shown(key)) return;
      const err = validate(key);
      if (err) {
        next[key] = err;
        ok = false;
      }
    });
    setErrors(next);

    const nextCustom: Record<string, string | undefined> = {};
    customs.forEach((q) => {
      const err = customFormatError(q, extra[q.key]);
      if (err) {
        nextCustom[q.key] = err;
        ok = false;
      }
    });
    setCustomErrors(nextCustom);

    if (ok) onNext();
  };

  const canProceed =
    (["childName", "childBirthDate", "shirtSize", "parentName", "phone", "email"] as FieldKey[])
      .filter((key) => shown(key) && req(key))
      .every((key) => form[key].trim() !== "") &&
    customs.every((q) => !q.required || isCustomFilled(q, extra[q.key]));

  // Render helper (a plain function returning JSX, NOT a nested component, so
  // inputs keep their identity across keystrokes and never lose focus).
  const renderField = (fieldKey: FieldKey) => {
    if (!shown(fieldKey)) return null;
    const fb = FALLBACK[fieldKey];
    const required = req(fieldKey);
    const type = typeOf(fieldKey);
    const label = fieldLabel(config, fieldKey, fb.label);
    const placeholder = fieldHelp(config, fieldKey, fb.placeholder);
    const inputType = type === "email" ? "email" : type === "tel" ? "tel" : "text";
    const inputMode =
      type === "tel" ? "tel" : type === "email" ? "email" : undefined;
    const error = errors[fieldKey];
    return (
      <motion.div variants={fieldItem} key={fieldKey}>
        <FieldLabel htmlFor={fieldKey}>
          {label}
          {required ? " *" : ""}
        </FieldLabel>
        <input
          id={fieldKey}
          name={fieldKey}
          type={inputType}
          inputMode={inputMode}
          required={required}
          placeholder={placeholder}
          value={form[fieldKey]}
          onChange={onChange}
          onBlur={handleBlur(fieldKey)}
          aria-invalid={error ? true : undefined}
          className={inputBase}
        />
        {error && (
          <p className="text-xs text-rust font-semibold mt-1.5">{error}</p>
        )}
      </motion.div>
    );
  };

  return (
    <div>
      <StepIndicator current={0} />

      {/* Child */}
      <div className="flex flex-col gap-3 mb-6">
        <p className="text-eyebrow font-bold uppercase text-rust">
          Date copil
        </p>
      </div>

      <motion.div
        className="flex flex-col gap-5"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } } }}
      >
        {renderField("childName")}
        {renderField("childBirthDate")}
        {renderField("shirtSize")}
      </motion.div>

      {/* Parent */}
      <div className="flex flex-col gap-3 mt-10 mb-6">
        <p className="text-eyebrow font-bold uppercase text-rust">
          Date părinte / tutore
        </p>
      </div>

      <motion.div
        className="flex flex-col gap-5"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.12, delayChildren: 0.34 } } }}
      >
        {renderField("parentName")}
        {renderField("phone")}
        {renderField("email")}
      </motion.div>

      {/* Custom (admin-added) questions for this step, in config order. */}
      <CustomQuestions
        questions={customs}
        values={extra}
        errors={customErrors}
        onChange={onCustomChange}
        onBlur={handleCustomBlur}
        variant="card"
        className={customs.length ? "mt-10" : undefined}
      />

      {/* Honeypot - hidden from users, catches bots. Must stay empty. */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: "hidden",
          clip: "rect(0 0 0 0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
      >
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={form.website}
          onChange={onChange}
        />
      </div>

      <StepNavigation
        onBack={() => {}}
        onNext={handleNext}
        canProceed={canProceed}
        backLabel=""
      />
    </div>
  );
};

export default StepPersonal;
