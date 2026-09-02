"use client";

import { motion } from "motion/react";
import React from "react";
import CustomQuestions from "@/components/ui/custom-questions";
import {
  customFormatError,
  isCustomFilled,
  type CustomAnswer,
  type FormQuestion,
  type FormStepConfig,
} from "@/lib/strapi-forms";
import { StepIndicator, StepNavigation } from "./_shared";

/**
 * One step of the registration form, rendered entirely from the CMS config.
 *
 * Nothing here knows which questions exist. The step's question list, its
 * order, each field's type, label, help text, required flag and select options
 * all come from `/api/forms/inscriere/config`, which the backend already
 * returns fully merged: overlay order applied, removed built-ins dropped, and
 * admin-added questions interleaved in position.
 *
 * This replaces three hand-written step components that each hardcoded their
 * own field list and order. Reordering a question in the admin editor, or
 * adding one, changed nothing on the site because the render ignored the
 * `questions` array it was given.
 *
 * Built-in and custom questions are deliberately NOT distinguished here. Both
 * are just questions with a key; the parent decides where each answer lands in
 * the submit payload.
 */

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

interface ConfigStepProps {
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
}

/** Questions that hold an answer. `info` blocks are copy, never validated. */
const answerable = (questions: FormQuestion[]) =>
  questions.filter((q) => q.type !== "info" && q.hidden !== true);

/** Every required question answered and no malformed value: enables Continue. */
export function stepComplete(
  step: FormStepConfig,
  answers: Record<string, CustomAnswer>,
): boolean {
  return answerable(step.questions ?? []).every((q) => {
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
}) => {
  const [errors, setErrors] = React.useState<Record<string, string | undefined>>({});

  const questions = (step.questions ?? []).filter((q) => q.hidden !== true);

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
      <StepIndicator current={index} labels={stepLabels} />

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
          variant="card"
          placeholders={PLACEHOLDERS}
        />
      </motion.div>

      {children}

      {footer ?? (
        <StepNavigation
          onBack={onBack}
          onNext={handleNext}
          canProceed={stepComplete(step, answers)}
          backLabel={index === 0 ? "" : "Înapoi"}
        />
      )}
    </div>
  );
};

export default ConfigStep;
