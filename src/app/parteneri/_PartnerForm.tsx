"use client";

import { motion } from "motion/react";
import React, { useEffect, useRef, useState } from "react";
import ConfigStep, { stepComplete } from "@/components/forms/config-step";
import { FALLBACK_CONFIG, submitPartner, type SubmitStatus } from "./_form-config";
import { track } from "@/lib/analytics";
import { DURATION, EASE } from "@/lib/motion";
import Button from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import {
  type CustomAnswer,
  type FormConfig,
  type FormStepConfig,
} from "@/lib/strapi-forms";

/**
 * Partner inquiry form, driven entirely by the CMS config.
 *
 * The steps, their titles, which questions each contains, their order and their
 * types all come from `/api/forms/parteneri/config`, mirroring the volunteer
 * form. Answers are held in one flat map keyed by question key; the split
 * between built-in columns and the `extra` object happens only at submit time
 * (see `submitPartner`). Renders on the navy panel, so everything uses the
 * "navy" variant of the shared step components.
 */

/**
 * Input hints. The CMS has no placeholder concept, so these stay in the
 * frontend as presentation. Keyed by built-in question key; a question without
 * an entry (any admin-added one) simply renders without a placeholder.
 */
const PLACEHOLDERS: Record<string, string> = {
  companyName: "Numele companiei sau organizației",
  contactName: "Numele tău complet",
  email: "email@exemplu.com",
  phone: "+40 7xx xxx xxx",
  message:
    "Spune-ne ce ai în minte, sponsorizare, un eveniment sau altă idee de colaborare...",
};

const PartnerForm: React.FC<{ config?: FormConfig | null }> = ({
  config = null,
}) => {
  // The CMS is the source of truth. The bundled fallback exists only so a
  // transient CMS outage does not take partner inquiries offline entirely.
  const activeConfig = config?.steps?.length ? config : FALLBACK_CONFIG;

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, CustomAnswer>>({});
  const [website, setWebsite] = useState(""); // honeypot, must stay empty
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const formRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);

  const steps: FormStepConfig[] = activeConfig.steps ?? [];

  // Fire once, when the user first interacts — lets us measure start→submit
  // drop-off (form abandonment) against `parteneri.submit`.
  const markStarted = () => {
    if (startedRef.current) return;
    startedRef.current = true;
    track("parteneri.start");
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
      await submitPartner(activeConfig, answers, website);
      track("parteneri.submit", {
        interest:
          typeof answers.collaborationType === "string"
            ? answers.collaborationType
            : "",
      });
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  const nextStep = () => {
    track("parteneri.step_next", { step: step + 1 });
    setStep((s) => Math.min(s + 1, steps.length - 1));
  };
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  if (status === "sent") {
    return (
      <div className="flex flex-col items-center justify-center gap-4 px-8 py-16 text-center">
        <div className="flex h-14 w-14 items-center justify-center bg-mustard">
          <Icon name="send" size="md" className="text-primary" />
        </div>
        <h3 className="text-title text-primary-on-dark">
          Mesaj trimis!
        </h3>
        <p className="text-body-sm max-w-xs text-secondary-on-dark">
          Îți mulțumim! Revenim în cel mai scurt timp să discutăm colaborarea.
        </p>
        <button
          onClick={() => {
            setAnswers({});
            setWebsite("");
            setStatus("idle");
            setStep(0);
          }}
          className="link link-on-dark text-body-sm mt-2"
        >
          Trimite un alt mesaj
        </button>
      </div>
    );
  }

  if (!steps.length) {
    return (
      <div className="py-16 px-8 text-center">
        <p className="text-body-sm text-secondary-on-dark">
          Formularul de colaborare nu este disponibil momentan. Te rugăm să
          încerci din nou mai târziu sau să ne contactezi direct.
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
        transition={{ duration: DURATION.slow, ease: EASE.out }}
      >
        <ConfigStep
          step={current}
          stepLabels={labels}
          index={step}
          answers={answers}
          onAnswerChange={handleAnswerChange}
          onNext={nextStep}
          onBack={prevStep}
          variant="navy"
          placeholders={PLACEHOLDERS}
          footer={
            isLast ? (
              <div className="mt-8 pt-6 border-t-retro border-line-subtle-on-dark">
                {status === "error" && (
                  <p className="text-caption text-danger mb-4">
                    Mesajul nu a putut fi trimis. Te rugăm să încerci din nou.
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="text-body-sm text-secondary-on-dark hover:text-mustard transition-colors"
                  >
                    Înapoi
                  </button>
                  <Button
                    face="cream"
                    type="button"
                    onClick={handleSubmit}
                    disabled={
                      status === "sending" || !stepComplete(current, answers)
                    }
                  >
                    {status === "sending" ? "Se trimite..." : "Trimite mesajul"}
                  </Button>
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

export default PartnerForm;
