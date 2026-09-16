"use client";

import { motion } from "motion/react";
import React from "react";
import CustomQuestions, { type CustomVariant } from "@/components/ui/custom-questions";
import {
  customFormatError,
  isCustomFilled,
  type CustomAnswer,
  type FormQuestion,
  type FormStepConfig,
} from "@/lib/strapi-forms";
import { StepIndicator, StepNavigation } from "./step-chrome";

/**
 * One step of a config-driven multi-step form, lifted from
 * src/app/inscrieri/_ConfigStep.tsx so every form (Înscriere, Voluntariat,
 * Parteneri) can reuse it.
 *
 * Nothing here knows which questions exist. The step's question list, its
 * order, each field's type, label, help text, required flag and select options
 * all come from `/api/forms/:type/config`, which the backend already returns
 * fully merged: overlay order applied, removed built-ins dropped, and
 * admin-added questions interleaved in position.
 *
 * Built-in and custom questions are deliberately NOT distinguished here. Both
 * are just questions with a key; the parent decides where each answer lands in
 * the submit payload.
 */

export interface ConfigStepProps {
  step: FormStepConfig;
  stepLabels: string[];
  index: number;
  answers: Record<string, CustomAnswer>;
  onAnswerChange: (key: string, value: CustomAnswer) => void;
  onNext: () => void;
  onBack: () => void;
  /** Rendered after the questions: honeypot on the first step, submit on the last. */
  children?: React.ReactNode;
  /** Replaces the Continue button on the final step. */
  footer?: React.ReactNode;
  /** Visual surface: "card" (light — Înscriere) or "navy" (dark panel). */
  variant?: CustomVariant;
  /**
   * Extra visibility predicate applied on top of the `hidden` flag. Lets the
   * parent hide questions conditionally (e.g. parent fields for adults on the
   * volunteer form). A hidden question is neither rendered nor validated.
   */
  filterQuestion?: (q: FormQuestion) => boolean;
  /** Input placeholders by question key (presentation only, see CustomQuestions). */
  placeholders?: Record<string, string>;
}

const visible = (
  questions: FormQuestion[],
  filterQuestion?: (q: FormQuestion) => boolean,
) =>
  questions.filter(
    (q) => q.hidden !== true && (!filterQuestion || filterQuestion(q)),
  );

/** Questions that hold an answer. `info` blocks are copy, never validated. */
const answerable = (
  questions: FormQuestion[],
  filterQuestion?: (q: FormQuestion) => boolean,
) => visible(questions, filterQuestion).filter((q) => q.type !== "info");

/** Every required question answered and no malformed value: enables Continue. */
export function stepComplete(
  step: FormStepConfig,
  answers: Record<string, CustomAnswer>,
  filterQuestion?: (q: FormQuestion) => boolean,
): boolean {
  return answerable(step.questions ?? [], filterQuestion).every((q) => {
    if (q.required === true && !isCustomFilled(q, answers[q.key])) return false;
    return !customFormatError(q, answers[q.key]);
  });
}

const ConfigStep: React.FC<ConfigStepProps> = ({
  step,
  stepLabels,
  index,
  answers,
  onAnswerChange,
  onNext,
  onBack,
  children,
  footer,
  variant = "card",
  filterQuestion,
  placeholders,
}) => {
  const [errors, setErrors] = React.useState<Record<string, string | undefined>>({});

  const questions = visible(step.questions ?? [], filterQuestion);

  const handleBlur = (key: string) => {
    const q = questions.find((item) => item.key === key);
    if (!q) return;
    setErrors((prev) => ({ ...prev, [key]: customFormatError(q, answers[key]) }));
  };

  const handleNext = () => {
    const next: Record<string, string | undefined> = {};
    let ok = true;
    for (const q of answerable(questions)) {
      const err = customFormatError(q, answers[q.key]);
      if (err) {
        next[q.key] = err;
        ok = false;
      }
    }
    setErrors(next);
    if (ok) onNext();
  };

  return (
    <div>
      <StepIndicator current={index} labels={stepLabels} variant={variant} />

      <motion.div
        className="flex flex-col gap-5"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } } }}
      >
        <CustomQuestions
          questions={questions}
          values={answers}
          errors={errors}
          onChange={onAnswerChange}
          onBlur={handleBlur}
          variant={variant}
          placeholders={placeholders}
        />
      </motion.div>

      {children}

      {footer ?? (
        <StepNavigation
          onBack={onBack}
          onNext={handleNext}
          canProceed={stepComplete(step, answers, filterQuestion)}
          backLabel={index === 0 ? "" : "Înapoi"}
          variant={variant}
        />
      )}
    </div>
  );
};

export default ConfigStep;
