"use client";

import { cn } from "@/utils/cn";
import { FieldLabel } from "@/components/ui/form-field";
import { Select } from "@/components/ui/select";
import { motion } from "motion/react";
import React from "react";
import { inputBase, StepIndicator, StepNavigation } from "./_shared";
import type { FormState } from "./_types";
import { LEVEL_OPTIONS, CLUB_OPTIONS } from "./_types";

interface StepExperienceProps {
  form: FormState;
  onChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;
  onValueChange: (name: keyof FormState) => (value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const fieldItem = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } },
};

const StepExperience: React.FC<StepExperienceProps> = ({
  form,
  onChange,
  onValueChange,
  onNext,
  onBack,
}) => {
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
          <FieldLabel htmlFor="level">
            Sezonul trecut, fiul/fiica dvs. a participat la cursurile noastre, la grupa *
          </FieldLabel>
          <Select
            id="level"
            name="level"
            value={form.level}
            onValueChange={onValueChange("level")}
            options={LEVEL_OPTIONS}
            placeholder="Selectează nivelul..."
            required
          />
        </motion.div>

        <motion.div variants={fieldItem}>
          <FieldLabel htmlFor="priorExperience">
            Pentru o încadrare cât mai corectă în grupe *
          </FieldLabel>
          <p className="text-xs text-gray-500 font-light mb-2 -mt-1">
            Dacă participați pentru prima oară la cursurile noastre, vă rugăm să
            ne spuneți dacă a mai patinat, cu ce instructor (dacă e cazul) și ce
            elemente știe să facă.
          </p>
          <textarea
            id="priorExperience"
            name="priorExperience"
            required
            rows={3}
            placeholder="Detalii despre experiența anterioară pe gheață..."
            value={form.priorExperience}
            onChange={onChange}
            className={cn(inputBase, "resize-none")}
          />
        </motion.div>

        <motion.div variants={fieldItem}>
          <FieldLabel htmlFor="expectations">
            Care sunt așteptările dvs. de la cursurile de patinaj? *
          </FieldLabel>
          <textarea
            id="expectations"
            name="expectations"
            required
            rows={2}
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
          <FieldLabel htmlFor="howHeard">
            De unde ați aflat de cursurile oferite de Școala de Patinaj *
          </FieldLabel>
          <textarea
            id="howHeard"
            name="howHeard"
            required
            rows={2}
            placeholder="ex: Facebook, prieteni, Google..."
            value={form.howHeard}
            onChange={onChange}
            className={cn(inputBase, "resize-none")}
          />
        </motion.div>

        <motion.div variants={fieldItem}>
          <FieldLabel htmlFor="clubInterest">
            Doriți ca fiul/fiica dvs. să devină membru A.C.S. EduSport? *
          </FieldLabel>
          <Select
            id="clubInterest"
            name="clubInterest"
            value={form.clubInterest}
            onValueChange={onValueChange("clubInterest")}
            options={CLUB_OPTIONS}
            placeholder="Selectează răspunsul..."
            required
          />
          <p className="mt-1.5 text-xs text-gray-400 font-light">
            Membrii A.C.S. EduSport beneficiază de tarifele pentru membri și
            posibilitatea participării la competiții.
          </p>
        </motion.div>
      </motion.div>

      <StepNavigation onBack={onBack} onNext={onNext} canProceed={canProceed} />
    </div>
  );
};

export default StepExperience;
