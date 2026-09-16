"use client";

import { Send } from "lucide-react";
import { motion } from "motion/react";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ConfigStep, { stepComplete } from "@/components/forms/config-step";
import {
  ageFromBirthDate,
  FALLBACK_CONFIG,
  MIN_VOLUNTEER_AGE,
  MINOR_ONLY_KEYS,
  submitVolunteer,
  type SubmitStatus,
} from "./_form-config";
import { track } from "@/lib/analytics";
import SpotlightButton from "@/components/ui/spotlight-button";
import {
  type CustomAnswer,
  type FormConfig,
  type FormQuestion,
  type FormStepConfig,
} from "@/lib/strapi-forms";

/**
 * Volunteer application form, driven entirely by the CMS config.
 *
 * The steps, their titles, which questions each contains, their order and their
 * types all come from `/api/forms/voluntariat/config`, mirroring the Înscriere
 * form. Answers are held in one flat map keyed by question key; the split
 * between built-in columns and the `extra` object happens only at submit time
 * (see `submitVolunteer`). Lives on /voluntariat/inscriere, a cream form page
 * mirroring /inscrieri, so everything uses the "card" variant of the shared
 * step components.
 *
 * Minor-volunteer rules (frontend mirror of the backend registry):
 * - adults (18+) never see the parent fields;
 * - 15-17 must fill parent name/phone and tick the parental consent;
 * - under 15 cannot continue past the birth-date step.
 */

/**
 * Input hints. The CMS has no placeholder concept, so these stay in the
 * frontend as presentation. Keyed by built-in question key; a question without
 * an entry (any admin-added one) simply renders without a placeholder.
 */
const PLACEHOLDERS: Record<string, string> = {
  fullName: "Numele tău complet",
  email: "adresa@exemplu.ro",
  phone: "+40 7xx xxx xxx",
  city: "ex: București",
  parentName: "Numele complet al părintelui sau tutorelui",
  parentPhone: "+40 7xx xxx xxx",
  childrenExperience: "Ai mai lucrat cu copii? Povestește-ne pe scurt...",
  motivation: "Spune-ne de ce vrei să te implici și ce te motivează...",
};

const VolunteerForm: React.FC<{ config?: FormConfig | null }> = ({
  config = null,
}) => {
  // The CMS is the source of truth. The bundled fallback exists only so a
  // transient CMS outage does not take volunteer applications offline entirely.
  const activeConfig = config?.steps?.length ? config : FALLBACK_CONFIG;

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, CustomAnswer>>({});
  const [website, setWebsite] = useState(""); // honeypot, must stay empty
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const formRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);

  // Age drives the minor logic. `null` means unknown (empty/invalid date).
  const birthDate = typeof answers.birthDate === "string" ? answers.birthDate : "";
  const age = ageFromBirthDate(birthDate);
  const isMinor = age !== null && age >= MIN_VOLUNTEER_AGE && age < 18;
  const underage = age !== null && age < MIN_VOLUNTEER_AGE;

  // Parent fields only exist for volunteers under 18; adults (and unknown age)
  // never see them.
  const filterQuestion = useCallback(
    (q: FormQuestion) => !MINOR_ONLY_KEYS.has(q.key) || (age !== null && age < 18),
    [age],
  );

  // For 15-17 the parent fields are not just visible but mandatory: mark them
  // required so `stepComplete` enforces them like any other required question.
  const steps = useMemo<FormStepConfig[]>(() => {
    const base = activeConfig.steps ?? [];
    return base.map((s) => ({
      ...s,
      questions: (s.questions ?? []).map((q) =>
        isMinor && MINOR_ONLY_KEYS.has(q.key) ? { ...q, required: true } : q,
      ),
    }));
  }, [activeConfig, isMinor]);

  // Fire once, when the user first interacts — lets us measure start→submit
  // drop-off (form abandonment) against `voluntariat.submit`.
  const markStarted = () => {
    if (startedRef.current) return;
    startedRef.current = true;
    track("voluntariat.start");
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
      await submitVolunteer(activeConfig, answers, website);
      track("voluntariat.submit");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  const nextStep = () => {
    track("voluntariat.step_next", { step: step + 1 });
    setStep((s) => Math.min(s + 1, steps.length - 1));
  };
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  if (status === "sent") {
    return (
      <div className="flex flex-col items-center justify-center gap-4 px-8 py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-navy">
          <Send className="h-6 w-6 text-mustard" />
        </div>
        <h3 className="font-display text-2xl font-extrabold text-navy">
          Cerere trimisă!
        </h3>
        <p className="max-w-sm text-sm leading-relaxed text-navy/60">
          Îți mulțumim! Te vom contacta în cel mai scurt timp pentru pașii următori.
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
          Trimite o altă cerere
        </button>
      </div>
    );
  }

  if (!steps.length) {
    return (
      <div className="py-16 px-8 text-center">
        <p className="text-sm text-navy/60">
          Formularul de voluntariat nu este disponibil momentan. Te rugăm să încerci
          din nou mai târziu sau să ne contactezi direct.
        </p>
      </div>
    );
  }

  const current = steps[Math.min(step, steps.length - 1)]!;
  const isLast = step === steps.length - 1;
  const labels = steps.map((s) => s.title || "");

  // Under 15: block progression on the step holding the birth date — the Next
  // button is replaced by the age notice.
  const blocksUnderage =
    underage && (current.questions ?? []).some((q) => q.key === "birthDate");

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
          variant="card"
          filterQuestion={filterQuestion}
          placeholders={PLACEHOLDERS}
          footer={
            isLast ? (
              <div className="mt-8 pt-6 border-t-[1.5px] border-navy/12">
                {status === "error" && (
                  <p className="text-xs text-rust font-semibold mb-4">
                    Cererea nu a putut fi trimisă. Te rugăm să încerci din nou.
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
                    disabled={
                      status === "sending" ||
                      underage ||
                      !stepComplete(current, answers, filterQuestion)
                    }
                  >
                    {status === "sending" ? "Se trimite..." : "Trimite cererea"}
                  </SpotlightButton>
                </div>
              </div>
            ) : blocksUnderage ? (
              <div className="mt-8 pt-6 border-t-[1.5px] border-navy/12">
                <p className="text-sm font-semibold text-rust">
                  Vârsta minimă pentru voluntariat este {MIN_VOLUNTEER_AGE} ani.
                </p>
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

export default VolunteerForm;
