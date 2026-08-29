"use client";

import { cn } from "@/utils/cn";
import { FieldLabel } from "@/components/ui/form-field";
import { Select } from "@/components/ui/select";
import { motion } from "motion/react";
import React from "react";
import { inputBase, StepIndicator, StepNavigation } from "./_shared";
import type { FormState } from "./_types";
import { LEVEL_OPTIONS, CLUB_OPTIONS } from "./_types";
import CustomQuestions from "@/components/ui/custom-questions";
import {
  customFormatError,
  fieldHelp,
  fieldLabel,
  getCustomQuestionsForStep,
  isCustomFilled,
  isHidden,
  isRequired,
  selectOptions,
  INSCRIERE_BUILTIN_KEYS,
  type CustomAnswer,
  type FormConfig,
} from "@/lib/strapi-forms";

const EXPERIENCE_ANCHORS = [
  "level",
  "priorExperience",
  "expectations",
  "howHeard",
  "clubInterest",
];

interface StepExperienceProps {
  form: FormState;
  onChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;
  onValueChange: (name: keyof FormState) => (value: string) => void;
  onNext: () => void;
  onBack: () => void;
  config?: FormConfig | null;
  extra: Record<string, CustomAnswer>;
  onCustomChange: (key: string, value: CustomAnswer) => void;
}

const fieldItem = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } },
};

// Hardcoded fallbacks (labels without asterisk — appended from effective
// `required`). Placeholders stay hardcoded (not part of the config contract).
const FALLBACK = {
  level: {
    label: "Sezonul trecut, fiul/fiica dvs. a participat la cursurile noastre, la grupa",
    required: true,
  },
  priorExperience: {
    label: "Pentru o încadrare cât mai corectă în grupe",
    help: "Dacă participați pentru prima oară la cursurile noastre, vă rugăm să ne spuneți dacă a mai patinat, cu ce instructor (dacă e cazul) și ce elemente știe să facă.",
    placeholder: "Detalii despre experiența anterioară pe gheață...",
    required: true,
  },
  expectations: {
    label: "Care sunt așteptările dvs. de la cursurile de patinaj?",
    placeholder: "Ce doriți să învețe copilul la curs...",
    required: true,
  },
  howHeard: {
    label: "De unde ați aflat de cursurile oferite de Școala de Patinaj",
    placeholder: "ex: Facebook, prieteni, Google...",
    required: true,
  },
  clubInterest: {
    label: "Doriți ca fiul/fiica dvs. să devină membru A.C.S. EduSport?",
    help: "Membrii A.C.S. EduSport beneficiază de tarifele pentru membri și posibilitatea participării la competiții.",
    required: true,
  },
};

const StepExperience: React.FC<StepExperienceProps> = ({
  form,
  onChange,
  onValueChange,
  onNext,
  onBack,
  config = null,
  extra,
  onCustomChange,
}) => {
  const shown = (key: keyof typeof FALLBACK) => !isHidden(config, key);
  const req = (key: keyof typeof FALLBACK) =>
    isRequired(config, key, FALLBACK[key].required);
  const asterisk = (key: keyof typeof FALLBACK) => (req(key) ? " *" : "");

  const customs = getCustomQuestionsForStep(
    config,
    EXPERIENCE_ANCHORS,
    INSCRIERE_BUILTIN_KEYS,
  );
  const [customErrors, setCustomErrors] = React.useState<
    Record<string, string | undefined>
  >({});

  const handleCustomBlur = (key: string) => {
    const q = customs.find((c) => c.key === key);
    if (!q) return;
    setCustomErrors((prev) => ({
      ...prev,
      [key]: customFormatError(q, extra[key]),
    }));
  };

  // Validate custom formats on advance; block if any is malformed.
  const handleNext = () => {
    const next: Record<string, string | undefined> = {};
    let ok = true;
    customs.forEach((q) => {
      const err = customFormatError(q, extra[q.key]);
      if (err) {
        next[q.key] = err;
        ok = false;
      }
    });
    setCustomErrors(next);
    if (ok) onNext();
  };

  const levelHelp = fieldHelp(config, "level");
  const priorHelp = fieldHelp(config, "priorExperience", FALLBACK.priorExperience.help);
  const expectationsHelp = fieldHelp(config, "expectations");
  const howHeardHelp = fieldHelp(config, "howHeard");
  const clubHelp = fieldHelp(config, "clubInterest", FALLBACK.clubInterest.help);

  const canProceed =
    (!shown("level") || !req("level") || form.level !== "") &&
    (!shown("priorExperience") || !req("priorExperience") || form.priorExperience.trim() !== "") &&
    (!shown("expectations") || !req("expectations") || form.expectations.trim() !== "") &&
    (!shown("howHeard") || !req("howHeard") || form.howHeard.trim() !== "") &&
    (!shown("clubInterest") || !req("clubInterest") || form.clubInterest !== "") &&
    customs.every((q) => !q.required || isCustomFilled(q, extra[q.key]));

  return (
    <div>
      <StepIndicator current={1} />

      <div className="flex flex-col gap-3 mb-6">
        <p className="text-eyebrow font-bold uppercase text-rust">
          Experiență & așteptări
        </p>
      </div>

      <motion.div
        className="flex flex-col gap-5"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } } }}
      >
        {shown("level") && (
          <motion.div variants={fieldItem}>
            <FieldLabel htmlFor="level">
              {fieldLabel(config, "level", FALLBACK.level.label)}
              {asterisk("level")}
            </FieldLabel>
            {levelHelp && (
              <p className="text-xs text-navy/55 mb-2 -mt-1">{levelHelp}</p>
            )}
            <Select
              id="level"
              name="level"
              value={form.level}
              onValueChange={onValueChange("level")}
              options={selectOptions(config, "level", LEVEL_OPTIONS)}
              placeholder="Selectează nivelul..."
              required={req("level")}
            />
          </motion.div>
        )}

        {shown("priorExperience") && (
          <motion.div variants={fieldItem}>
            <FieldLabel htmlFor="priorExperience">
              {fieldLabel(config, "priorExperience", FALLBACK.priorExperience.label)}
              {asterisk("priorExperience")}
            </FieldLabel>
            {priorHelp && (
              <p className="text-xs text-navy/55 mb-2 -mt-1">{priorHelp}</p>
            )}
            <textarea
              id="priorExperience"
              name="priorExperience"
              required={req("priorExperience")}
              rows={3}
              placeholder={FALLBACK.priorExperience.placeholder}
              value={form.priorExperience}
              onChange={onChange}
              className={cn(inputBase, "resize-none")}
            />
          </motion.div>
        )}

        {shown("expectations") && (
          <motion.div variants={fieldItem}>
            <FieldLabel htmlFor="expectations">
              {fieldLabel(config, "expectations", FALLBACK.expectations.label)}
              {asterisk("expectations")}
            </FieldLabel>
            {expectationsHelp && (
              <p className="text-xs text-navy/55 mb-2 -mt-1">{expectationsHelp}</p>
            )}
            <textarea
              id="expectations"
              name="expectations"
              required={req("expectations")}
              rows={2}
              placeholder={FALLBACK.expectations.placeholder}
              value={form.expectations}
              onChange={onChange}
              className={cn(inputBase, "resize-none")}
            />
          </motion.div>
        )}
      </motion.div>

      {/* Additional */}
      <div className="flex flex-col gap-3 mt-10 mb-6">
        <p className="text-eyebrow font-bold uppercase text-rust">
          Informații suplimentare
        </p>
      </div>

      <motion.div
        className="flex flex-col gap-5"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.12, delayChildren: 0.46 } } }}
      >
        {shown("howHeard") && (
          <motion.div variants={fieldItem}>
            <FieldLabel htmlFor="howHeard">
              {fieldLabel(config, "howHeard", FALLBACK.howHeard.label)}
              {asterisk("howHeard")}
            </FieldLabel>
            {howHeardHelp && (
              <p className="text-xs text-navy/55 mb-2 -mt-1">{howHeardHelp}</p>
            )}
            <textarea
              id="howHeard"
              name="howHeard"
              required={req("howHeard")}
              rows={2}
              placeholder={FALLBACK.howHeard.placeholder}
              value={form.howHeard}
              onChange={onChange}
              className={cn(inputBase, "resize-none")}
            />
          </motion.div>
        )}

        {shown("clubInterest") && (
          <motion.div variants={fieldItem}>
            <FieldLabel htmlFor="clubInterest">
              {fieldLabel(config, "clubInterest", FALLBACK.clubInterest.label)}
              {asterisk("clubInterest")}
            </FieldLabel>
            <Select
              id="clubInterest"
              name="clubInterest"
              value={form.clubInterest}
              onValueChange={onValueChange("clubInterest")}
              options={selectOptions(config, "clubInterest", CLUB_OPTIONS)}
              placeholder="Selectează răspunsul..."
              required={req("clubInterest")}
            />
            {clubHelp && (
              <p className="mt-1.5 text-xs text-navy/45">{clubHelp}</p>
            )}
          </motion.div>
        )}
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

      <StepNavigation onBack={onBack} onNext={handleNext} canProceed={canProceed} />
    </div>
  );
};

export default StepExperience;
