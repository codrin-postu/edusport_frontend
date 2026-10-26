"use client";

import { motion } from "motion/react";
import React, { useEffect, useRef, useState } from "react";
import { track } from "@/lib/analytics";
import { DURATION, EASE } from "@/lib/motion";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import { Dialog, DialogActions } from "@/components/ui/dialog";
import type { CustomAnswer, FormConfig } from "@/lib/strapi-forms";
import {
  audienceFor,
  priceBox,
  subscriptionOptions,
  upsell,
  type PublicClubInfo,
  type PublicSchool,
} from "@/lib/club-public";
import LeaveNotice from "./_LeaveNotice";
import InscriereStep, { inscriereStepComplete } from "./_Step";
import ConsentCheckbox from "./_Consent";
import BirthDateFields from "./_BirthDateFields";
import SuccessScreen from "./_Success";
import { PinnedSchool, SchoolPicker } from "./_SchoolPicker";
import { PriceBoxView, ScheduleBox, UpsellBox } from "./_Abonament";
import { clearDraft, clearLegacyDraft, loadDraft, saveDraft } from "./_draft";
import { PUBLIC_STRAPI_URL, submitRegistration } from "./_submit";
import { resolveSchool, showsPinnedSchool, wantedSlug } from "./_school";
import type { ScheduleWeekend } from "./_schedule";
import {
  CONSENT_KEYS,
  FALLBACK_CONFIG,
  PLACEHOLDERS,
  SUBSCRIPTION_PLACEHOLDER,
  type SubmitStatus,
} from "./_types";
import {
  MEMBERSHIP_YES,
  applyAnswer,
  childBirthDateError,
  childHeightError,
  expectedDocuments,
  isSubmissionKey,
  newSubmissionKey,
  prepareStep,
  type SubmitSuccess,
} from "./_rules";

/**
 * The registration form: the club's script form in the 3 approved steps
 * (DECISIONS 2026-10-05, form-3steps-v1 option B). Labels, help, required
 * flags and options come from the CMS config (GET /api/forms/inscriere/config);
 * season, fee and prices from GET /api/club/public; the schedule from the site
 * calendar. Answers live in one flat map keyed by question key.
 */

interface RegistrationFormProps {
  config?: FormConfig | null;
  club: PublicClubInfo;
  weekends: ScheduleWeekend[];
  whatsappUrl?: string;
}

const HONEYPOT_STYLE: React.CSSProperties = {
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
  whiteSpace: "nowrap",
  border: 0,
};

/** `?scoala=` from the address; undefined until read after mount (the page itself is static). */
function useSchoolParam(): string | null | undefined {
  const [slug, setSlug] = useState<string | null | undefined>(undefined);
  useEffect(() => {
    setSlug(new URLSearchParams(window.location.search).get("scoala"));
  }, []);
  return slug;
}

/** Blocks of the Abonament step around the membership question. */
function abonamentSlots(
  school: PublicSchool,
  club: PublicClubInfo,
  weekends: ScheduleWeekend[],
  membershipAnswer: CustomAnswer | undefined,
  onBecomeMember: () => void,
) {
  const audience = audienceFor(typeof membershipAnswer === "string" ? membershipAnswer : "");
  const offer = audience === "nonMember" ? upsell(school, club.membershipFee) : null;
  return {
    before: { membershipAnswer: <ScheduleBox weekends={weekends} /> },
    after: {
      membershipAnswer: audience && (
        <>
          <PriceBoxView box={priceBox(school, audience, club.membershipFee)} />
          {offer && <UpsellBox upsell={offer} onBecomeMember={onBecomeMember} />}
        </>
      ),
    },
  };
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ config = null, club, weekends, whatsappUrl }) => {
  // The CMS is the source of truth. The bundled fallback exists only so a
  // transient CMS outage does not take registrations offline entirely.
  const activeConfig = config?.steps?.length ? config : FALLBACK_CONFIG;

  const slugParam = useSchoolParam();
  const [chosenSlug, setChosenSlug] = useState<string | null>(null);
  const [picking, setPicking] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, CustomAnswer>>({});
  const [website, setWebsite] = useState(""); // honeypot, must stay empty
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [result, setResult] = useState<(SubmitSuccess & { expectedCount: number }) | null>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);
  // Set when answers came back from a previous visit, so the notice above the
  // form is shown only to someone who actually left and returned.
  const [restored, setRestored] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  // Bumped on every restart() so BirthDateFields remounts and drops any
  // in-progress partial pick: its own resync guard only catches an external
  // answer change, and a partial pick already composes to the same "" that
  // a reset lands on, so the guard alone cannot tell the two apart.
  const [resetToken, setResetToken] = useState(0);
  // Nothing is written until the draft has been read, otherwise the empty
  // initial state would overwrite the saved answers on first render.
  const readyRef = useRef(false);
  // Set by the parent's own moves between steps. Only those scroll the form
  // into view: the first render and a draft restored on load would otherwise
  // yank a returning user down the page before they have read anything.
  const navigatedRef = useRef(false);
  const stepHeadingRef = useRef<HTMLDivElement>(null);
  // A reload or a retry of the same answers sends the same key; any changed
  // answer gets a new one, since the backend matches a repeat by the key alone.
  const submissionKeyRef = useRef("");

  const resolution = resolveSchool(club.schools, wantedSlug(chosenSlug, slugParam, picking));
  const school = resolution.state === "chosen" ? resolution.school : null;
  const offeredFor = (membership: string) =>
    school ? subscriptionOptions(school, audienceFor(membership)).map((o) => o.value) : [];
  const membership = typeof answers.membershipAnswer === "string" ? answers.membershipAnswer : "";
  const audience = audienceFor(membership);
  const steps = (activeConfig.steps ?? []).map((s) =>
    prepareStep(s, answers, school ? subscriptionOptions(school, audience) : []),
  );

  // Fire once, when the user first interacts: start -> submit drop-off.
  const markStarted = () => {
    if (startedRef.current) return;
    startedRef.current = true;
    track("inscriere.start");
  };

  useEffect(() => {
    clearLegacyDraft();
    const draft = loadDraft();
    const savedKey = draft?.submissionKey;
    submissionKeyRef.current = isSubmissionKey(savedKey) ? savedKey : newSubmissionKey();
    if (draft) {
      setAnswers(draft.answers);
      setStep(draft.step);
      setRestored(true);
      // They have already started; do not count the return as a new start.
      startedRef.current = true;
    }
    readyRef.current = true;
  }, []);

  // chosenSlug is a dependency only to flush the submissionKey that `choose`
  // below regenerates on a school change, the same way any answer change does.
  useEffect(() => {
    if (!readyRef.current) return;
    saveDraft(step, answers, submissionKeyRef.current);
  }, [step, answers, chosenSlug]);

  useEffect(() => {
    if (!navigatedRef.current) return;
    navigatedRef.current = false;
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    stepHeadingRef.current?.focus({ preventScroll: true });
  }, [step]);

  const goToStep = (next: number) => {
    navigatedRef.current = true;
    setStep(next);
  };

  const handleAnswerChange = (key: string, value: CustomAnswer) => {
    markStarted();
    submissionKeyRef.current = newSubmissionKey();
    setAnswers((prev) => applyAnswer(prev, key, value, offeredFor));
  };

  const restart = () => {
    clearDraft();
    submissionKeyRef.current = newSubmissionKey();
    setRestored(false);
    setAnswers({});
    setResetToken((t) => t + 1);
    setWebsite("");
    setSubmitError(null);
    setResult(null);
    setStatus("idle");
    goToStep(0);
  };

  const handleSubmit = async() => {
    if (!school) return;
    setStatus("sending");
    setSubmitError(null);
    const res = await submitRegistration(answers, website, school.slug, submissionKeyRef.current);
    if (!res.ok) {
      setSubmitError(res.error);
      setStatus("error");
      return;
    }
    track("inscriere.submit_success");
    // The answers are with us now; leaving them on the device would show a
    // stranger's registration to the next person on a shared phone.
    clearDraft();
    submissionKeyRef.current = newSubmissionKey();
    setResult({ ...res, expectedCount: expectedDocuments(answers.membershipAnswer).length });
    setStatus("sent");
  };

  if (status === "sent" && result) {
    return (
      <SuccessScreen
        registrationNumber={result.registrationNumber}
        downloadToken={result.downloadToken}
        documents={result.documents}
        expectedCount={result.expectedCount}
        apiBase={PUBLIC_STRAPI_URL}
        whatsappUrl={whatsappUrl}
        onRestart={restart}
      />
    );
  }

  // Wait for `?scoala=` before choosing for the parent; with one school there is nothing to wait for.
  if (slugParam === undefined && club.schools.length > 1) return null;
  if (resolution.state === "choose") {
    const choose = (slug: string) => {
      submissionKeyRef.current = newSubmissionKey();
      setChosenSlug(slug);
      setPicking(false);
    };
    return <SchoolPicker schools={resolution.schools} unknownSlug={resolution.unknownSlug} onChoose={choose} />;
  }
  if (!school || !steps.length) {
    return (
      <div className="py-16 px-8 text-center">
        <p className="text-body-sm text-secondary">
          Formularul de înscriere nu este disponibil momentan. Te rugăm să încerci din nou
          mai târziu sau să ne contactezi direct.
        </p>
      </div>
    );
  }

  const index = Math.min(step, steps.length - 1);
  const current = steps[index]!;
  const isLast = index === steps.length - 1;
  const slots = abonamentSlots(school, club, weekends, answers.membershipAnswer, () =>
    handleAnswerChange("membershipAnswer", MEMBERSHIP_YES),
  );
  const consentSlots = Object.fromEntries(
    current.questions
      .filter((q) => (CONSENT_KEYS as readonly string[]).includes(q.key))
      .map((q) => [
        q.key,
        () => (
          <ConsentCheckbox
            key={q.key}
            question={q}
            checked={answers[q.key] === true}
            onChange={(v) => handleAnswerChange(q.key, v)}
          />
        ),
      ]),
  );
  const extraError = (key: string, value: CustomAnswer | undefined) => {
    if (key === "childHeight") return childHeightError(value);
    if (key === "childBirthDate") return childBirthDateError(value);
    return undefined;
  };
  // A restored draft can land on the last step; every step must still be complete.
  const allStepsComplete = steps.every((s) => inscriereStepComplete(s, answers, extraError));
  const birthDateQuestion = current.questions.find((q) => q.key === "childBirthDate");
  const replaceSlots = {
    ...consentSlots,
    ...(birthDateQuestion && {
      childBirthDate: (error: string | undefined, onBlur: () => void) => (
        <BirthDateFields
          key={resetToken}
          value={answers.childBirthDate}
          onChange={(v) => handleAnswerChange("childBirthDate", v)}
          onBlur={onBlur}
          label={`${birthDateQuestion.label ?? "Data nașterii copilului"}${birthDateQuestion.required ? " *" : ""}`}
          required={birthDateQuestion.required === true}
          error={error}
        />
      ),
    }),
  };

  return (
    <div ref={formRef}>
      {/* Scoped to the form: a link in the header or footer is someone
          navigating on purpose, and is left alone. */}
      <LeaveNotice scope={formRef} />

      {showsPinnedSchool(club.schools.length) && (
        <PinnedSchool name={school.name} onChange={() => setPicking(true)} />
      )}

      {restored && (
        <Card as="div" surface="raised" shadow="none" padding="none" className="mb-6 px-4 py-3">
          <p className="text-body-sm text-primary">Formular salvat.</p>
          <button type="button" onClick={() => setConfirmReset(true)} className="text-caption link mt-1 text-accent">
            Începe de la capăt
          </button>
        </Card>
      )}

      <Dialog
        open={confirmReset}
        onOpenChange={setConfirmReset}
        title="Ștergi răspunsurile salvate?"
        description="Toate datele introduse vor fi pierdute."
        width="sm"
      >
        <DialogActions>
          <Button variant="secondary" onClick={() => setConfirmReset(false)}>
            Renunță
          </Button>
          <Button
            variant="primary"
            face="black"
            onClick={() => {
              restart();
              setConfirmReset(false);
            }}
          >
            Șterge
          </Button>
        </DialogActions>
      </Dialog>

      <motion.div
        key={index}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.slow, ease: EASE.out }}
      >
        <InscriereStep
          step={current}
          headingRef={stepHeadingRef}
          stepLabels={steps.map((s) => s.title || "")}
          index={index}
          answers={answers}
          onAnswerChange={handleAnswerChange}
          onNext={() => {
            track("inscriere.step_next", { step: index + 1 });
            goToStep(Math.min(index + 1, steps.length - 1));
          }}
          onBack={() => goToStep(Math.max(index - 1, 0))}
          placeholders={{
            ...PLACEHOLDERS,
            subscriptionChoice: audience ? SUBSCRIPTION_PLACEHOLDER.ready : SUBSCRIPTION_PLACEHOLDER.waiting,
          }}
          before={slots.before}
          after={slots.after}
          replace={replaceSlots}
          extraError={extraError}
          footer={
            isLast ? (
              <div className="mt-8 pt-6 border-t-retro border-line-subtle">
                {status === "error" && (
                  <p role="alert" className="text-caption text-accent mb-4">
                    {submitError ?? "Înscrierea nu a putut fi trimisă. Te rugăm să încerci din nou."}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => goToStep(Math.max(index - 1, 0))}
                    className="text-body-sm text-secondary hover:text-accent transition-colors"
                  >
                    Înapoi
                  </button>
                  <Button
                    face="black"
                    type="button"
                    onClick={handleSubmit}
                    disabled={status === "sending" || !allStepsComplete}
                  >
                    {status === "sending" ? "Se trimite..." : "Trimite înscrierea"}
                  </Button>
                </div>
              </div>
            ) : undefined
          }
        >
          {index === 0 && (
            // Honeypot: hidden from users, catches bots. Must stay empty.
            <div aria-hidden="true" style={HONEYPOT_STYLE}>
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
        </InscriereStep>
      </motion.div>
    </div>
  );
};

export default RegistrationForm;
