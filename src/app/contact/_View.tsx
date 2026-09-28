"use client";

import React, { useRef, useState } from "react";
import { Icon, type IconName } from "@/components/ui/icon";
import Card, { CardTitle } from "@/components/ui/card";
import { Field, Input, Textarea } from "@/components/ui/form-field";
import { Select } from "@/components/ui/select";
import Button from "@/components/ui/button";
import PageHeroSection from "@/components/blocks/page-hero-section";
import type { SiteContactInfo } from "@/components/blocks/footer/Footer";
import { track } from "@/lib/analytics";
import CustomQuestions from "@/components/ui/custom-questions";
import {
  buildCustomPayload,
  customFormatError,
  fieldHelp,
  fieldLabel,
  fieldType,
  getCustomQuestions,
  isCustomFilled,
  isHidden,
  isRequired,
  selectOptions,
  validateValueByType,
  CONTACT_BUILTIN_KEYS,
  VALIDATION_MESSAGES,
  type CustomAnswer,
  type FormConfig,
  type FormQuestionType,
} from "@/lib/strapi-forms";

// ---------------------------------------------------------------------------
// Contact reasons
// ---------------------------------------------------------------------------

const CONTACT_REASONS = [
  { value: "", label: "Selectează motivul contactării..." },
  { value: "inscriere", label: "Înscriere la cursuri de patinaj" },
  { value: "informatii-cursuri", label: "Informații despre cursuri" },
  { value: "program", label: "Program și orar" },
  { value: "tarife", label: "Tarife și abonamente" },
  { value: "partenariat", label: "Parteneriat sau colaborare" },
  { value: "feedback", label: "Feedback" },
  { value: "altele", label: "Altele" },
];

// Hardcoded fallbacks (labels without asterisk — appended from effective
// `required`; phone stays optional as today).
const FIELD_FALLBACK: Record<
  string,
  { label: string; placeholder: string; required: boolean; type: FormQuestionType }
> = {
  name: { label: "Nume complet", placeholder: "Numele tău", required: true, type: "text" },
  email: { label: "E-mail", placeholder: "email@exemplu.com", required: true, type: "email" },
  phone: { label: "Telefon", placeholder: "+40 7xx xxx xxx", required: false, type: "tel" },
  reason: { label: "Motivul contactării", placeholder: "", required: true, type: "select" },
  message: { label: "Mesaj", placeholder: "Scrie mesajul tău aici...", required: true, type: "longtext" },
};

// ---------------------------------------------------------------------------
// Contact info card
// ---------------------------------------------------------------------------

const ContactInfoCard: React.FC<{
  icon: IconName;
  label: string;
  value: string;
  href: string;
}> = ({ icon, label, value, href }) => {
  return (
    <Card
      href={href}
      external={href.startsWith("http")}
      surface="raised"
      shadow="sm"
      padding="sm"
      className="flex items-center gap-4"
    >
      <div className="flex-shrink-0 w-9 h-9 border-retro border-line bg-surface-dark text-primary-on-dark flex items-center justify-center">
        <Icon name={icon} />
      </div>
      <div className="min-w-0">
        <p className="text-label text-secondary uppercase mb-0.5">
          {label}
        </p>
        <CardTitle as="p" className="text-body-sm break-all">
          {value}
        </CardTitle>
      </div>
    </Card>
  );
};

// ---------------------------------------------------------------------------
// Contact form
// ---------------------------------------------------------------------------

type FormState = {
  name: string;
  email: string;
  phone: string;
  reason: string;
  message: string;
};

type SubmitStatus = "idle" | "sending" | "sent" | "error";

const ContactForm: React.FC<{ config?: FormConfig | null }> = ({
  config = null,
}) => {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    reason: "",
    message: "",
  });
  const [botField, setBotField] = useState("");
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    phone?: string;
  }>({});

  // Custom (admin-added) questions and their collected answers / errors.
  const customs = getCustomQuestions(config, CONTACT_BUILTIN_KEYS);
  const [extra, setExtra] = useState<Record<string, CustomAnswer>>({});
  const [customErrors, setCustomErrors] = useState<
    Record<string, string | undefined>
  >({});

  const handleCustomChange = (key: string, value: CustomAnswer) => {
    markStarted();
    setExtra((prev) => ({ ...prev, [key]: value }));
  };
  const handleCustomBlur = (key: string) => {
    const q = customs.find((c) => c.key === key);
    if (!q) return;
    setCustomErrors((prev) => ({
      ...prev,
      [key]: customFormatError(q, extra[key]),
    }));
  };
  // Validate every custom (format first, then required); returns true when all
  // pass and updates the inline error map.
  const validateCustoms = (): boolean => {
    const next: Record<string, string | undefined> = {};
    let ok = true;
    for (const q of customs) {
      const val = extra[q.key];
      const fmt = customFormatError(q, val);
      if (fmt) {
        next[q.key] = fmt;
        ok = false;
      } else if (q.required && !isCustomFilled(q, val)) {
        next[q.key] = VALIDATION_MESSAGES.required;
        ok = false;
      }
    }
    setCustomErrors(next);
    return ok;
  };

  // Type-driven field validation (email/phone). Empty values pass here; the
  // native `required` attribute + effective config gate emptiness.
  const validateField = (key: "email" | "phone") =>
    validateValueByType(
      fieldType(config, key, FIELD_FALLBACK[key].type),
      form[key],
    );
  const handleFieldBlur = (key: "email" | "phone") => () =>
    setFieldErrors((prev) => ({ ...prev, [key]: validateField(key) }));

  const startedRef = useRef(false);
  const markStarted = () => {
    if (startedRef.current) return;
    startedRef.current = true;
    track("contact.start");
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    markStarted();
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();

    // Block submit on malformed email / phone, showing inline field errors.
    const emailErr = validateField("email");
    const phoneErr = validateField("phone");
    setFieldErrors({ email: emailErr, phone: phoneErr });
    const customsOk = validateCustoms();
    if (emailErr || phoneErr || !customsOk) return;

    setStatus("sending");
    setErrorMessage("");

    const extraPayload = buildCustomPayload(customs, extra);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          _botField: botField,
          ...(Object.keys(extraPayload).length ? { extra: extraPayload } : {}),
        }),
      });
      const json = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };
      if (!res.ok || !json.ok) {
        setErrorMessage(json.error ?? "Ceva nu a mers. Încearcă din nou.");
        setStatus("error");
        return;
      }
      track("contact.submit", { reason: form.reason || "altele" });
      setStatus("sent");
    } catch {
      setErrorMessage("Conexiune eșuată. Verifică internetul și încearcă din nou.");
      setStatus("error");
    }
  };

  const resetForm = () => {
    setForm({ name: "", email: "", phone: "", reason: "", message: "" });
    setBotField("");
    setErrorMessage("");
    setFieldErrors({});
    setExtra({});
    setCustomErrors({});
    setStatus("idle");
  };

  const shown = (key: keyof typeof FIELD_FALLBACK) => !isHidden(config, key);
  const req = (key: keyof typeof FIELD_FALLBACK) =>
    isRequired(config, key, FIELD_FALLBACK[key].required);
  const label = (key: keyof typeof FIELD_FALLBACK) =>
    fieldLabel(config, key, FIELD_FALLBACK[key].label);
  const placeholder = (key: keyof typeof FIELD_FALLBACK) =>
    fieldHelp(config, key, FIELD_FALLBACK[key].placeholder);

  if (status === "sent") {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-8 text-center gap-4">
        <div className="w-14 h-14 bg-mustard flex items-center justify-center">
          <Icon name="send" size="md" className="text-primary" />
        </div>
        <h3 className="text-title text-primary-on-dark">
          Mesaj trimis!
        </h3>
        <p className="text-body-sm text-secondary-on-dark max-w-xs">
          Îți mulțumim pentru mesaj. Te vom contacta în cel mai scurt timp.
        </p>
        <button
          onClick={resetForm}
          className="link link-on-dark text-body-sm mt-2"
        >
          Trimite un alt mesaj
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Honeypot — visually hidden, real users never fill this. */}
      <input
        type="text"
        name="_botField"
        tabIndex={-1}
        autoComplete="off"
        value={botField}
        onChange={(e) => setBotField(e.target.value)}
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "-9999px",
          width: 1,
          height: 1,
          opacity: 0,
          pointerEvents: "none",
        }}
      />
      {/* Name */}
      {shown("name") && (
        <Field label={label("name")} required={req("name")} onDark>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder={placeholder("name")}
            value={form.name}
            onChange={handleChange}
            onDark
          />
        </Field>
      )}

      {/* Email + Phone row */}
      <div className="grid sm:grid-cols-2 gap-6">
        {shown("email") && (
          <Field
            label={label("email")}
            required={req("email")}
            error={fieldErrors.email}
            onDark
          >
            <Input
              id="email"
              name="email"
              type="email"
              inputMode="email"
              placeholder={placeholder("email")}
              value={form.email}
              onChange={handleChange}
              onBlur={handleFieldBlur("email")}
              onDark
            />
          </Field>
        )}
        {shown("phone") && (
          <Field
            label={label("phone")}
            required={req("phone")}
            error={fieldErrors.phone}
            onDark
          >
            <Input
              id="phone"
              name="phone"
              type="tel"
              inputMode="tel"
              placeholder={placeholder("phone")}
              value={form.phone}
              onChange={handleChange}
              onBlur={handleFieldBlur("phone")}
              onDark
            />
          </Field>
        )}
      </div>

      {/* Reason */}
      {shown("reason") && (
        <Field label={label("reason")} required={req("reason")} onDark>
          <Select
            id="reason"
            name="reason"
            value={form.reason}
            onValueChange={(value) =>
              setForm((prev) => ({ ...prev, reason: value }))
            }
            options={selectOptions(config, "reason", CONTACT_REASONS)}
            placeholder="Selectează motivul contactării..."
            required={req("reason")}
            onDark
          />
        </Field>
      )}

      {/* Message */}
      {shown("message") && (
        <Field label={label("message")} required={req("message")} onDark>
          <Textarea
            id="message"
            name="message"
            rows={5}
            placeholder={placeholder("message")}
            value={form.message}
            onChange={handleChange}
            onDark
            className="resize-none"
          />
        </Field>
      )}

      {/* Custom (admin-added) questions — appended in config order */}
      <CustomQuestions
        questions={customs}
        values={extra}
        errors={customErrors}
        onChange={handleCustomChange}
        onBlur={handleCustomBlur}
        variant="navy"
      />

      {/* Error */}
      {status === "error" && errorMessage && (
        <div
          role="alert"
          className="text-body-sm px-4 py-3 bg-accent text-primary-on-dark"
        >
          {errorMessage}
        </div>
      )}

      {/* Submit — retro layers CTA (cream face on the navy panel) */}
      <Button
        face="cream"
        type="submit"
        disabled={status === "sending"}
        className="w-full sm:w-fit"
      >
        {status === "sending" ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-line-subtle border-t-line rounded-full animate-spin" />
            Se trimite...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Icon name="send" />
            Trimite mesajul
          </span>
        )}
      </Button>
    </form>
  );
};

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

const ContactPage: React.FC<{
  contactInfo?: SiteContactInfo;
  formConfig?: FormConfig | null;
}> = ({ contactInfo = {}, formConfig = null }) => {
  const contactItems = [
    contactInfo.phone && {
      icon: "phone" as const,
      label: "Telefon",
      value: contactInfo.phone,
      href: `tel:${contactInfo.phone.replace(/\s/g, "")}`,
    },
    contactInfo.email && {
      icon: "mail" as const,
      label: "E-mail",
      value: contactInfo.email,
      href: `mailto:${contactInfo.email}`,
    },
    contactInfo.facebookUrl1 && {
      icon: "external-link" as const,
      label: "Facebook",
      value: "Școala de Patinaj EduSport",
      href: contactInfo.facebookUrl1,
    },
  ].filter(Boolean) as { icon: IconName; label: string; value: string; href: string }[];

  return (
    <div className="min-h-screen bg-surface">
      <PageHeroSection title={["CONTACT"]} backgroundImage="/images/courses.png">
        <h1 className="text-display text-primary-on-dark">
          Contact
        </h1>
        <p className="text-body text-secondary-on-dark max-w-md">
          Suntem aici să răspundem întrebărilor tale. Contactează-ne prin
          formularul de mai jos sau direct.
        </p>
      </PageHeroSection>

      <section className="relative z-raised bg-surface">
        <div className="max-w-content mx-auto gutter section">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-24">
            {/* Left - contact info */}
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-3">
                <p className="text-label uppercase text-accent">
                  Datele noastre
                </p>
                <h2 className="text-heading text-primary">
                  Ia legătura cu noi
                </h2>
                <p className="text-body-sm text-secondary max-w-sm">
                  Fie că vrei să te înscrii la cursuri, ai o întrebare sau
                  dorești o colaborare, suntem bucuroși să te ajutăm.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                {contactItems.map((item) => (
                  <ContactInfoCard
                    key={`${item.label}-${item.value}`}
                    icon={item.icon}
                    label={item.label}
                    value={item.value}
                    href={item.href}
                  />
                ))}
              </div>
            </div>

            {/* Right - form (navy panel) */}
            <Card as="div" surface="dark" padding="md" className="relative md:p-8">
              <span className="absolute inset-x-0 top-0 h-1.5 bg-rust" aria-hidden />
              <h2 className="text-title text-primary-on-dark mb-1">
                Trimite-ne un mesaj
              </h2>
              <p className="text-body-sm text-secondary-on-dark mb-8">
                Răspundem de obicei în 24 până la 48 de ore.
              </p>
              <ContactForm config={formConfig} />
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
