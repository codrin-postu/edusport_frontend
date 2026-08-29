"use client";

import { CheckCircle } from "lucide-react";
import { motion } from "motion/react";
import React, { useEffect, useRef, useState } from "react";
import StepConfirm from "./_StepConfirm";
import StepExperience from "./_StepExperience";
import StepPersonal from "./_StepPersonal";
import {
  INITIAL_FORM,
  submitRegistration,
  type FormState,
  type SubmitStatus,
} from "./_types";
import { track } from "@/lib/analytics";
import type { FormConfig } from "@/lib/strapi-forms";

const RegistrationForm: React.FC<{ config?: FormConfig | null }> = ({
  config = null,
}) => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const formRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);

  // Fire once, when the user first interacts — lets us measure start→submit
  // drop-off (form abandonment) against `inscriere.submit_success`.
  const markStarted = () => {
    if (startedRef.current) return;
    startedRef.current = true;
    track("inscriere.start");
  };

  useEffect(() => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    markStarted();
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleValueChange = (name: keyof FormState) => (value: string) => {
    markStarted();
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async(
    e: React.FormEvent | undefined,
    agreements: { gdpr: boolean; regulament: boolean },
  ) => {
    e?.preventDefault();
    setStatus("sending");
    try {
      await submitRegistration(form, agreements);
      track("inscriere.submit_success");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  const nextStep = () => {
    track("inscriere.step_next", { step: step + 1 });
    setStep((s) => Math.min(s + 1, 2));
  };
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  if (status === "sent") {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-8 text-center gap-4">
        <div className="w-16 h-16 rounded-full bg-navy flex items-center justify-center">
          <CheckCircle className="w-7 h-7 text-mustard" />
        </div>
        <h3 className="font-display text-2xl font-extrabold text-navy">Înscriere trimisă!</h3>
        <p className="text-sm text-navy/60 max-w-sm leading-relaxed">
          Mulțumim pentru înscriere. Te vom contacta în cel mai scurt timp
          pentru confirmare și detalii suplimentare.
        </p>
        <button
          onClick={() => {
            setForm(INITIAL_FORM);
            setStatus("idle");
            setStep(0);
          }}
          className="mt-2 link-underline-rust text-sm font-semibold text-rust"
        >
          Trimite o altă înscriere
        </button>
      </div>
    );
  }

  const stepContent =
    step === 0 ? (
      <StepPersonal
        form={form}
        onChange={handleChange}
        onNext={nextStep}
        config={config}
      />
    ) : step === 1 ? (
      <StepExperience
        form={form}
        onChange={handleChange}
        onValueChange={handleValueChange}
        onNext={nextStep}
        onBack={prevStep}
        config={config}
      />
    ) : (
      <StepConfirm
        onBack={prevStep}
        onSubmit={handleSubmit}
        status={status}
        config={config}
      />
    );

  return (
    <div ref={formRef}>
      <motion.div
        key={step}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {stepContent}
      </motion.div>
    </div>
  );
};

export default RegistrationForm;
