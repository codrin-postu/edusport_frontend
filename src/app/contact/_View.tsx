"use client";

import React, { useRef, useState } from "react";
import { type LucideIcon, Mail, Phone, Send, ExternalLink } from "lucide-react";
import { cn } from "@/utils/cn";
import { FieldLabel, inputOnNavy } from "@/components/ui/form-field";
import { Select } from "@/components/ui/select";
import SpotlightButton from "@/components/ui/spotlight-button";
import PageHeroSection from "@/components/blocks/page-hero-section";
import type { SiteContactInfo } from "@/components/blocks/footer/Footer";
import { track } from "@/lib/analytics";
import {
  fieldHelp,
  fieldLabel,
  fieldType,
  isHidden,
  isRequired,
  selectOptions,
  validateValueByType,
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
  icon: LucideIcon;
  label: string;
  value: string;
  href: string;
}> = ({ icon: Icon, label, value, href }) => {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      className="group flex items-center gap-4 p-4 bg-retro-cream border-[1.5px] border-navy shadow-[4px_4px_0_rgb(14_26_60_/_0.14)] hover:shadow-[6px_6px_0_rgb(14_26_60_/_0.2)] transition-all duration-200"
    >
      <div className="flex-shrink-0 w-9 h-9 border-[1.5px] border-navy bg-navy text-retro-cream flex items-center justify-center">
        <Icon className="w-4 h-4" />
      </div>
      <div className="min-w-0">
        <p className="text-3xs font-bold text-navy/45 uppercase tracking-[0.1em] mb-0.5">
          {label}
        </p>
        <p className="text-sm font-semibold text-navy group-hover:text-rust transition-colors break-all">
          {value}
        </p>
      </div>
    </a>
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
    if (emailErr || phoneErr) return;

    setStatus("sending");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, _botField: botField }),
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
    setStatus("idle");
  };

  const shown = (key: keyof typeof FIELD_FALLBACK) => !isHidden(config, key);
  const req = (key: keyof typeof FIELD_FALLBACK) =>
    isRequired(config, key, FIELD_FALLBACK[key].required);
  const label = (key: keyof typeof FIELD_FALLBACK) =>
    `${fieldLabel(config, key, FIELD_FALLBACK[key].label)}${req(key) ? " *" : ""}`;
  const placeholder = (key: keyof typeof FIELD_FALLBACK) =>
    fieldHelp(config, key, FIELD_FALLBACK[key].placeholder);

  if (status === "sent") {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-8 text-center gap-4">
        <div className="w-14 h-14 rounded-full bg-mustard flex items-center justify-center">
          <Send className="w-6 h-6 text-navy" />
        </div>
        <h3 className="font-display text-2xl font-extrabold text-retro-cream">
          Mesaj trimis!
        </h3>
        <p className="text-sm text-retro-cream/60 max-w-xs">
          Îți mulțumim pentru mesaj. Te vom contacta în cel mai scurt timp.
        </p>
        <button
          onClick={resetForm}
          className="mt-2 text-sm font-semibold text-mustard underline underline-offset-4 hover:opacity-70 transition-opacity"
        >
          Trimite un alt mesaj
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
        <div>
          <FieldLabel htmlFor="name" tone="dark">{label("name")}</FieldLabel>
          <input
            id="name"
            name="name"
            type="text"
            required={req("name")}
            placeholder={placeholder("name")}
            value={form.name}
            onChange={handleChange}
            className={inputOnNavy}
          />
        </div>
      )}

      {/* Email + Phone row */}
      <div className="grid sm:grid-cols-2 gap-5">
        {shown("email") && (
          <div>
            <FieldLabel htmlFor="email" tone="dark">{label("email")}</FieldLabel>
            <input
              id="email"
              name="email"
              type="email"
              inputMode="email"
              required={req("email")}
              placeholder={placeholder("email")}
              value={form.email}
              onChange={handleChange}
              onBlur={handleFieldBlur("email")}
              aria-invalid={fieldErrors.email ? true : undefined}
              className={inputOnNavy}
            />
            {fieldErrors.email && (
              <p className="text-xs font-semibold text-danger mt-1.5">
                {fieldErrors.email}
              </p>
            )}
          </div>
        )}
        {shown("phone") && (
          <div>
            <FieldLabel htmlFor="phone" tone="dark">{label("phone")}</FieldLabel>
            <input
              id="phone"
              name="phone"
              type="tel"
              inputMode="tel"
              required={req("phone")}
              placeholder={placeholder("phone")}
              value={form.phone}
              onChange={handleChange}
              onBlur={handleFieldBlur("phone")}
              aria-invalid={fieldErrors.phone ? true : undefined}
              className={inputOnNavy}
            />
            {fieldErrors.phone && (
              <p className="text-xs font-semibold text-danger mt-1.5">
                {fieldErrors.phone}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Reason */}
      {shown("reason") && (
        <div>
          <FieldLabel htmlFor="reason" tone="dark">{label("reason")}</FieldLabel>
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
            className="bg-white/[0.06] border-retro-cream/35 text-retro-cream focus:border-mustard focus:ring-mustard/25 data-[state=open]:border-mustard data-[state=open]:ring-mustard/25"
          />
        </div>
      )}

      {/* Message */}
      {shown("message") && (
        <div>
          <FieldLabel htmlFor="message" tone="dark">{label("message")}</FieldLabel>
          <textarea
            id="message"
            name="message"
            required={req("message")}
            rows={5}
            placeholder={placeholder("message")}
            value={form.message}
            onChange={handleChange}
            className={cn(inputOnNavy, "resize-none")}
          />
        </div>
      )}

      {/* Error */}
      {status === "error" && errorMessage && (
        <div
          role="alert"
          className="px-4 py-3 border border-danger/30 bg-danger/10 text-sm text-danger"
        >
          {errorMessage}
        </div>
      )}

      {/* Submit — retro layers CTA (cream face on the navy panel) */}
      <SpotlightButton
        layers
        layersFace="cream"
        type="submit"
        disabled={status === "sending"}
        className="w-full sm:w-fit"
      >
        {status === "sending" ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-navy/30 border-t-navy rounded-full animate-spin" />
            Se trimite...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Send className="w-4 h-4" />
            Trimite mesajul
          </span>
        )}
      </SpotlightButton>
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
      icon: Phone,
      label: "Telefon",
      value: contactInfo.phone,
      href: `tel:${contactInfo.phone.replace(/\s/g, "")}`,
    },
    contactInfo.email && {
      icon: Mail,
      label: "E-mail",
      value: contactInfo.email,
      href: `mailto:${contactInfo.email}`,
    },
    contactInfo.facebookUrl1 && {
      icon: ExternalLink,
      label: "Facebook",
      value: "Scoala de Patinaj EduSport",
      href: contactInfo.facebookUrl1,
    },
  ].filter(Boolean) as { icon: LucideIcon; label: string; value: string; href: string }[];

  return (
    <div className="min-h-screen bg-retro-cream">
      <PageHeroSection title={["CONTACT"]} backgroundImage="/images/courses.png">
        <h1 className="font-display text-display-md font-extrabold text-retro-cream leading-[1.05] tracking-[-0.5px]">
          Contact
        </h1>
        <p className="text-retro-cream/70 text-base max-w-md">
          Suntem aici să răspundem întrebărilor tale. Contactează-ne prin
          formularul de mai jos sau direct.
        </p>
      </PageHeroSection>

      <section className="relative z-10 bg-retro-cream">
        <div className="max-w-content mx-auto px-4 md:px-8 lg:px-12 py-16 md:py-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Left - contact info */}
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-3">
                <p className="text-eyebrow font-bold uppercase text-rust">
                  Datele noastre
                </p>
                <h2 className="font-display text-display-sm font-extrabold text-navy leading-[1.05] tracking-[-0.4px]">
                  Ia legătura cu noi
                </h2>
                <p className="text-sm text-navy/60 leading-relaxed max-w-sm">
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
            <div className="relative bg-navy p-6 md:p-8 shadow-[8px_8px_0_rgb(14_26_60_/_0.16)]">
              <span className="absolute inset-x-0 top-0 h-1.5 bg-rust" aria-hidden />
              <h2 className="font-display text-2xl font-extrabold text-retro-cream mb-1">
                Trimite-ne un mesaj
              </h2>
              <p className="text-sm text-retro-cream/50 mb-7">
                Răspundem de obicei în 24 până la 48 de ore.
              </p>
              <ContactForm config={formConfig} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
