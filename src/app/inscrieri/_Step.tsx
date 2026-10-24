"use client";

import { motion } from "motion/react";
import React from "react";
import CustomQuestions from "@/components/ui/custom-questions";
import { StepIndicator, StepNavigation } from "@/components/forms/step-chrome";
import { stepComplete } from "@/components/forms/config-step";
import {
  customFormatError,
  scrollToFirstInvalidField,
  type CustomAnswer,
  type FormQuestion,
  type FormStepConfig,
} from "@/lib/strapi-forms";

/**
 * One step of the registration form. Same chrome and question rendering as
 * the shared ConfigStep (components/forms/config-step.tsx), plus three things
 * the script form needs and ConfigStep has no place for:
 * - `before` / `after`: blocks placed around a question (the schedule before
 *   the membership question, the price box and the upsell after it);
 * - `replace`: a question drawn by the parent (the consent lines);
 * - `extraError`: a check the CMS config cannot express (the child's height).
 * The step passed in is already prepared (follow-ups and abonament options,
 * see `prepareStep` in _rules.ts), so `stepComplete` sees what the parent sees.
 */

export interface InscriereStepProps {
  step: FormStepConfig;
  stepLabels: string[];
  index: number;
  answers: Record<string, CustomAnswer>;
  onAnswerChange: (key: string, value: CustomAnswer) => void;
  onNext: () => void;
  onBack: () => void;
  placeholders?: Record<string, string>;
  before?: Record<string, React.ReactNode>;
  after?: Record<string, React.ReactNode>;
  replace?: Record<string, React.ReactNode>;
  extraError?: (key: string, value: CustomAnswer | undefined) => string | undefined;
  /** Rendered after the questions: the honeypot on the first step. */
  children?: React.ReactNode;
  /** Replaces the Continue button on the final step. */
  footer?: React.ReactNode;
}

const visible = (step: FormStepConfig) => (step.questions ?? []).filter((q) => q.hidden !== true);

function errorFor(q: FormQuestion, value: CustomAnswer | undefined, extraError: InscriereStepProps["extraError"]) {
  return customFormatError(q, value) ?? extraError?.(q.key, value);
}

/** Every required answer given and nothing malformed, including the extra checks. */
export function inscriereStepComplete(
  step: FormStepConfig,
  answers: Record<string, CustomAnswer>,
  extraError?: InscriereStepProps["extraError"],
): boolean {
  return stepComplete(step, answers) && visible(step).every((q) => !extraError?.(q.key, answers[q.key]));
}

const InscriereStep: React.FC<InscriereStepProps> = ({
  step,
  stepLabels,
  index,
  answers,
  onAnswerChange,
  onNext,
  onBack,
  placeholders,
  before = {},
  after = {},
  replace = {},
  extraError,
  children,
  footer,
}) => {
  const [errors, setErrors] = React.useState<Record<string, string | undefined>>({});
  const questions = visible(step);

  const handleBlur = (key: string) => {
    const q = questions.find((item) => item.key === key);
    if (q) setErrors((prev) => ({ ...prev, [key]: errorFor(q, answers[key], extraError) }));
  };

  const handleNext = () => {
    const next: Record<string, string | undefined> = {};
    for (const q of questions) next[q.key] = errorFor(q, answers[q.key], extraError);
    setErrors(next);
    if (Object.values(next).some(Boolean)) requestAnimationFrame(() => scrollToFirstInvalidField());
    else onNext();
  };

  return (
    <div>
      <StepIndicator current={index} labels={stepLabels} variant="card" />

      <motion.div
        className="flex flex-col gap-6"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } } }}
      >
        {questions.map((q) => (
          <React.Fragment key={q.key}>
            {before[q.key]}
            {replace[q.key] ?? (
              <CustomQuestions
                questions={[q]}
                values={answers}
                errors={errors}
                onChange={onAnswerChange}
                onBlur={handleBlur}
                variant="card"
                placeholders={placeholders}
              />
            )}
            {after[q.key]}
          </React.Fragment>
        ))}
      </motion.div>

      {children}

      {footer ?? (
        <StepNavigation
          onBack={onBack}
          onNext={handleNext}
          canProceed={inscriereStepComplete(step, answers, extraError)}
          backLabel={index === 0 ? "" : "Înapoi"}
          variant="card"
        />
      )}
    </div>
  );
};

export default InscriereStep;
