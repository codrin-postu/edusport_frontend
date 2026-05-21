"use client";

import { FieldLabel } from "@/components/ui/form-field";
import { motion } from "motion/react";
import React from "react";
import { inputBase, StepIndicator, StepNavigation } from "./_shared";
import type { FormState } from "./_types";

interface StepPersonalProps {
  form: FormState;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onNext: () => void;
}

const fieldItem = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } },
};

const StepPersonal: React.FC<StepPersonalProps> = ({ form, onChange, onNext }) => {
  const canProceed =
    form.childName.trim() !== "" &&
    form.childBirthDate.trim() !== "" &&
    form.shirtSize.trim() !== "" &&
    form.parentName.trim() !== "" &&
    form.phone.trim() !== "";

  return (
    <div>
      <StepIndicator current={0} />

      {/* Child */}
      <div className="flex flex-col gap-3 mb-6">
        <p className="text-xs font-semibold text-edusport-blue uppercase tracking-widest">
          Date copil
        </p>
      </div>

      <motion.div
        className="flex flex-col gap-5"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } } }}
      >
        <motion.div variants={fieldItem}>
          <FieldLabel htmlFor="childName">Nume complet copil *</FieldLabel>
          <input
            id="childName"
            name="childName"
            type="text"
            required
            placeholder="Numele complet al copilului"
            value={form.childName}
            onChange={onChange}
            className={inputBase}
          />
        </motion.div>

        <motion.div variants={fieldItem}>
          <FieldLabel htmlFor="childBirthDate">
            Data nașterii copilului *
          </FieldLabel>
          <input
            id="childBirthDate"
            name="childBirthDate"
            type="text"
            required
            placeholder="ex: 25 decembrie 2018"
            value={form.childBirthDate}
            onChange={onChange}
            className={inputBase}
          />
        </motion.div>

        <motion.div variants={fieldItem}>
          <FieldLabel htmlFor="shirtSize">Mărime tricou & înălțime *</FieldLabel>
          <input
            id="shirtSize"
            name="shirtSize"
            type="text"
            required
            placeholder="ex: 128 cm / mărime 8 ani"
            value={form.shirtSize}
            onChange={onChange}
            className={inputBase}
          />
        </motion.div>
      </motion.div>

      {/* Parent */}
      <div className="flex flex-col gap-3 mt-10 mb-6">
        <p className="text-xs font-semibold text-edusport-blue uppercase tracking-widest">
          Date părinte / tutore
        </p>
      </div>

      <motion.div
        className="flex flex-col gap-5"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.12, delayChildren: 0.34 } } }}
      >
        <motion.div variants={fieldItem}>
          <FieldLabel htmlFor="parentName">Nume complet părinte *</FieldLabel>
          <input
            id="parentName"
            name="parentName"
            type="text"
            required
            placeholder="Numele complet al părintelui"
            value={form.parentName}
            onChange={onChange}
            className={inputBase}
          />
        </motion.div>

        <motion.div variants={fieldItem}>
          <FieldLabel htmlFor="phone">Telefon *</FieldLabel>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            placeholder="+40 7xx xxx xxx"
            value={form.phone}
            onChange={onChange}
            className={inputBase}
          />
        </motion.div>
      </motion.div>

      <StepNavigation
        onBack={() => {}}
        onNext={onNext}
        canProceed={canProceed}
        backLabel=""
      />
    </div>
  );
};

export default StepPersonal;
