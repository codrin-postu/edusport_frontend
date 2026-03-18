"use client";

import { cn } from "@/utils/cn";
import { FieldLabel, SelectField } from "@/components/ui/form-field";
import { motion } from "motion/react";
import React from "react";
import { inputBase, StepIndicator, StepNavigation } from "./_shared";
import type { FormState } from "./_types";
import { LEVEL_OPTIONS, CLUB_OPTIONS } from "./_types";

interface StepExperienceProps {
  form: FormState;
  onChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;
  onNext: () => void;
  onBack: () => void;
}

const fieldItem = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } },
};

const StepExperience: React.FC<StepExperienceProps> = ({ form, onChange, onNext, onBack }) => {
  const canProceed =
    form.level !== "" &&
    form.priorExperience.trim() !== "" &&
    form.expectations.trim() !== "" &&
    form.howHeard.trim() !== "" &&
    form.clubInterest !== "";

  return (
    <div>
      <StepIndicator current={1} />

      <div className="flex flex-col gap-3 mb-6">
        <p className="text-xs font-semibold text-edusport-blue uppercase tracking-widest">
          Experiență & așteptări
        </p>
      </div>

      <motion.div
        className="flex flex-col gap-5"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } } }}
      >
        <motion.div variants={fieldItem}>
          <FieldLabel htmlFor="level">Nivel participare anterioară *</FieldLabel>
          <SelectField
            id="level"
            name="level"
            value={form.level}
            onChange={onChange}
            options={LEVEL_OPTIONS}
            required
          />
        </motion.div>

        <motion.div variants={fieldItem}>
          <FieldLabel htmlFor="priorExperience">Detalii experiență anterioară *</FieldLabel>
          <textarea
            id="priorExperience"
            name="priorExperience"
            required
            rows={3}
            placeholder="Descrieți pe scurt experiența anterioară a copilului pe gheață..."
            value={form.priorExperience}
            onChange={onChange}
            className={cn(inputBase, "resize-none")}
          />
        </motion.div>

        <motion.div variants={fieldItem}>
          <FieldLabel htmlFor="expectations">Ce așteptări aveți de la curs? *</FieldLabel>
          <textarea
            id="expectations"
            name="expectations"
            required
            rows={3}
            placeholder="Ce doriți să învețe copilul la curs..."
            value={form.expectations}
            onChange={onChange}
            className={cn(inputBase, "resize-none")}
          />
        </motion.div>
      </motion.div>

      {/* Additional */}
      <div className="flex flex-col gap-3 mt-10 mb-6">
        <p className="text-xs font-semibold text-edusport-blue uppercase tracking-widest">
          Informații suplimentare
        </p>
      </div>

      <motion.div
        className="flex flex-col gap-5"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.12, delayChildren: 0.46 } } }}
      >
        <motion.div variants={fieldItem}>
          <FieldLabel htmlFor="howHeard">Cum ați aflat de cursuri? *</FieldLabel>
          <input
            id="howHeard"
            name="howHeard"
            type="text"
            required
            placeholder="ex: Facebook, prieteni, Google..."
            value={form.howHeard}
            onChange={onChange}
            className={inputBase}
          />
        </motion.div>

        <motion.div variants={fieldItem}>
          <FieldLabel htmlFor="clubInterest">Interes înscriere club sportiv *</FieldLabel>
          <SelectField
            id="clubInterest"
            name="clubInterest"
            value={form.clubInterest}
            onChange={onChange}
            options={CLUB_OPTIONS}
            required
          />
          <p className="mt-1.5 text-xs text-gray-400 font-light">
            Clubul Sportiv EduSport oferă posibilitatea participării la
            competiții de patinaj artistic.
          </p>
        </motion.div>
      </motion.div>

      <StepNavigation onBack={onBack} onNext={onNext} canProceed={canProceed} />
    </div>
  );
};

export default StepExperience;
