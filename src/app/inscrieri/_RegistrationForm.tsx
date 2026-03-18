"use client";

import { CheckCircle } from "lucide-react";
import { motion } from "motion/react";
import React, { useState } from "react";
import StepConfirm from "./_StepConfirm";
import StepExperience from "./_StepExperience";
import StepPersonal from "./_StepPersonal";
import {
  INITIAL_FORM,
  submitToGoogleForms,
  type FormState,
  type SubmitStatus,
} from "./_types";

const RegistrationForm: React.FC = () => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [status, setStatus] = useState<SubmitStatus>("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      await submitToGoogleForms(form);
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, 2));
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  if (status === "sent") {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-8 text-center gap-4">
        <div className="w-16 h-16 rounded-full bg-edusport-blue flex items-center justify-center">
          <CheckCircle className="w-7 h-7 text-white" />
        </div>
        <h3 className="text-2xl font-semibold text-gray-900">Înscriere trimisă!</h3>
        <p className="text-sm text-gray-500 max-w-sm leading-relaxed">
          Mulțumim pentru înscriere. Te vom contacta în cel mai scurt timp
          pentru confirmare și detalii suplimentare.
        </p>
        <button
          onClick={() => {
            setForm(INITIAL_FORM);
            setStatus("idle");
            setStep(0);
          }}
          className="mt-2 text-sm text-edusport-blue underline underline-offset-4 hover:opacity-70 transition-opacity"
        >
          Trimite o altă înscriere
        </button>
      </div>
    );
  }

  const stepContent =
    step === 0 ? (
      <StepPersonal form={form} onChange={handleChange} onNext={nextStep} />
    ) : step === 1 ? (
      <StepExperience
        form={form}
        onChange={handleChange}
        onNext={nextStep}
        onBack={prevStep}
      />
    ) : (
      <StepConfirm onBack={prevStep} onSubmit={handleSubmit} status={status} />
    );

  return (
    <motion.div
      key={step}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {stepContent}
    </motion.div>
  );
};

export default RegistrationForm;
