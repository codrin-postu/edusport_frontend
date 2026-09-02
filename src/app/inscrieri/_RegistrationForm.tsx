"use client";

import { CheckCircle } from "lucide-react";
import { motion } from "motion/react";
import React, { useEffect, useRef, useState } from "react";
import ConfigStep, { stepComplete } from "./_ConfigStep";
import { FALLBACK_CONFIG, submitRegistration, type SubmitStatus } from "./_types";
import { track } from "@/lib/analytics";
import SpotlightButton from "@/components/ui/spotlight-button";
import { type CustomAnswer, type FormConfig } from "@/lib/strapi-forms";

/**
 * Registration form, driven entirely by the CMS config.
 *
 * The steps, their titles, which questions each contains, their order and their
 * types all come from `/api/forms/inscriere/config`. Previously this rendered
 * three hardcoded step components whose field lists were written out by hand,
 * so custom steps, reordering and admin-added questions had no effect on the
 * site. Answers are held in one flat map keyed by question key; the split
 * between built-in columns and the `extra` object happens only at submit time.
 */

const RegistrationForm: React.FC<{ config?: FormConfig | null }> = ({
  config = null,
}) => {
  // The CMS is the source of truth. The bundled fallback exists only so a
  // transient CMS outage does not take registrations offline entirely.
  const activeConfig = config?.steps?.length ? config : FALLBACK_CONFIG;
  const steps = activeConfig.steps ?? [];

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, CustomAnswer>>({});
  const [website, setWebsite] = useState(""); // honeypot, must stay empty
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

  const handleAnswerChange = (key: string, value: CustomAnswer) => {
    markStarted();
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async() => {
    setStatus("sending");
    try {
      await submitRegistration(activeConfig, answers, website);
      track("inscriere.submit_success");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  const nextStep = () => {
    track("inscriere.step_next", { step: step + 1 });
    setStep((s) => Math.min(s + 1, steps.length - 1));
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
            setAnswers({});
            setWebsite("");
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

  if (!steps.length) {
    return (
      <div className="py-16 px-8 text-center">
        <p className="text-sm text-navy/60">
          Formularul de înscriere nu este disponibil momentan. Te rugăm să încerci din nou
          mai târziu sau să ne contactezi direct.
        </p>
      </div>
    );
  }

  const current = steps[Math.min(step, steps.length - 1)]!;
  const isLast = step === steps.length - 1;
  const labels = steps.map((s) => s.title || "");

  return (
    <div ref={formRef}>
      <motion.div
        key={step}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <ConfigStep
          step={current}
          stepLabels={labels}
          index={step}
          answers={answers}
          onAnswerChange={handleAnswerChange}
          onNext={nextStep}
          onBack={prevStep}
          footer={
            isLast ? (
              <div className="mt-8 pt-6 border-t-[1.5px] border-navy/12">
                {status === "error" && (
                  <p className="text-xs text-rust font-semibold mb-4">
                    Înscrierea nu a putut fi trimisă. Te rugăm să încerci din nou.
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="text-sm font-semibold text-navy/50 hover:text-rust transition-colors"
                  >
                    Înapoi
                  </button>
                  <SpotlightButton
                    layers
                    layersFace="black"
                    type="button"
                    onClick={handleSubmit}
                    disabled={status === "sending" || !stepComplete(current, answers)}
                  >
                    {status === "sending" ? "Se trimite..." : "Trimite înscrierea"}
                  </SpotlightButton>
                </div>
              </div>
            ) : undefined
          }
        >
          {step === 0 && (
            // Honeypot — hidden from users, catches bots. Must stay empty.
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
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>
          )}
        </ConfigStep>
      </motion.div>
    </div>
  );
};

export default RegistrationForm;
