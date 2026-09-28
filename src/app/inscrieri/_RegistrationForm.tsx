"use client";

import { CheckCircle } from "lucide-react";
import { motion } from "motion/react";
import React, { useEffect, useRef, useState } from "react";
import ConfigStep, { stepComplete } from "./_ConfigStep";
import { FALLBACK_CONFIG, submitRegistration, type SubmitStatus } from "./_types";
import { track } from "@/lib/analytics";
import { DURATION, EASE } from "@/lib/motion";
import Button from "@/components/ui/button";
import { type CustomAnswer, type FormConfig } from "@/lib/strapi-forms";
import LeaveNotice from "./_LeaveNotice";
import { clearDraft, loadDraft, saveDraft } from "./_draft";

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
  // Set when answers came back from a previous visit, so the notice above the
  // form is shown only to someone who actually left and returned.
  const [restored, setRestored] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  // Nothing is written until the draft has been read, otherwise the empty
  // initial state would overwrite the saved answers on first render.
  const readyRef = useRef(false);

  // Fire once, when the user first interacts — lets us measure start→submit
  // drop-off (form abandonment) against `inscriere.submit_success`.
  const markStarted = () => {
    if (startedRef.current) return;
    startedRef.current = true;
    track("inscriere.start");
  };

  useEffect(() => {
    const draft = loadDraft();
    if (draft) {
      setAnswers(draft.answers);
      setStep(draft.step);
      setRestored(true);
      // They have already started; do not count the return as a new start.
      startedRef.current = true;
    }
    readyRef.current = true;
  }, []);

  useEffect(() => {
    if (!readyRef.current) return;
    saveDraft(step, answers);
  }, [step, answers]);

  useEffect(() => {
    // Skip the scroll on the very first render, which would otherwise yank a
    // returning user down the page before they have read anything.
    if (!readyRef.current) return;
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
      // The answers are with us now; leaving them on the device would show a
      // stranger's registration to the next person on a shared phone.
      clearDraft();
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
      <div className="flex flex-col items-center justify-center py-24 px-8 text-center gap-4">
        <div className="w-16 h-16 bg-surface-dark flex items-center justify-center">
          <CheckCircle className="w-7 h-7 text-mustard" />
        </div>
        <h3 className="text-title text-primary">Înscriere trimisă!</h3>
        <p className="text-body-sm text-secondary max-w-sm">
          Mulțumim pentru înscriere. Te vom contacta în cel mai scurt timp
          pentru confirmare și detalii suplimentare.
        </p>
        <button
          onClick={() => {
            clearDraft();
            setRestored(false);
            setAnswers({});
            setWebsite("");
            setStatus("idle");
            setStep(0);
          }}
          className="text-body-sm mt-2 link text-accent"
        >
          Trimite o altă înscriere
        </button>
      </div>
    );
  }

  if (!steps.length) {
    return (
      <div className="py-16 px-8 text-center">
        <p className="text-body-sm text-secondary">
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
      {/* Scoped to the form: a link in the header or footer is someone
          navigating on purpose, and is left alone. */}
      <LeaveNotice scope={formRef} />

      {restored && (
        <div className="mb-6 border-retro border-line bg-surface-raised px-4 py-3">
          <p className="text-body-sm text-primary">Formular salvat.</p>
          <button
            type="button"
            onClick={() => setConfirmReset(true)}
            className="text-caption link mt-1 text-accent"
          >
            Începe de la capăt
          </button>
        </div>
      )}

      {confirmReset && (
        <div
          className="fixed inset-0 z-dialog flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="reset-title"
        >
          <div
            className="absolute inset-0 bg-overlay"
            onClick={() => setConfirmReset(false)}
            aria-hidden
          />
          <div className="relative w-full max-w-sm border-retro border-line bg-surface p-6 shadow-retro">
            <h2 id="reset-title" className="text-title text-primary">
              Ștergi răspunsurile salvate?
            </h2>
            <p className="text-body-sm mt-2 text-secondary">
              Toate datele introduse vor fi pierdute.
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="text-body-sm border-retro border-line px-4 py-2 text-primary transition-colors hover-layer"
              >
                Renunță
              </button>
              <button
                type="button"
                onClick={() => {
                  clearDraft();
                  setAnswers({});
                  setStep(0);
                  setRestored(false);
                  setConfirmReset(false);
                }}
                className="text-body-sm border-retro border-rust bg-rust px-4 py-2 text-primary-on-dark transition-colors hover:brightness-110"
              >
                Șterge
              </button>
            </div>
          </div>
        </div>
      )}

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
          footer={
            isLast ? (
              <div className="mt-8 pt-6 border-t-retro border-line-subtle">
                {status === "error" && (
                  <p className="text-caption text-accent mb-4">
                    Înscrierea nu a putut fi trimisă. Te rugăm să încerci din nou.
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="text-body-sm text-secondary hover:text-accent transition-colors"
                  >
                    Înapoi
                  </button>
                  <Button
                    face="black"
                    type="button"
                    onClick={handleSubmit}
                    disabled={status === "sending" || !stepComplete(current, answers)}
                  >
                    {status === "sending" ? "Se trimite..." : "Trimite înscrierea"}
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

export default RegistrationForm;
