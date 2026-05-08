"use client";

import React, { useState } from "react";
import { Mail, Phone, Send, ExternalLink } from "lucide-react";
import { cn } from "@/utils/cn";
import { FieldLabel, inputBase, SelectField } from "@/components/ui/form-field";
import SectionHeader from "@/components/ui/section-header";
import PageHeroSection from "@/components/blocks/page-hero-section";
import type { SiteContactInfo } from "@/components/blocks/footer/Footer";

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

// ---------------------------------------------------------------------------
// Contact info card
// ---------------------------------------------------------------------------

const ContactInfoCard: React.FC<{
  icon: React.ElementType;
  label: string;
  value: string;
  href: string;
}> = ({ icon: Icon, label, value, href }) => {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      className="group flex items-start gap-4 p-5 bg-white border border-gray-100 hover:border-edusport-blue/30 hover:shadow-sm transition-all duration-200"
    >
      <div className="mt-0.5 flex-shrink-0 w-9 h-9 rounded-full bg-edusport-blue/8 flex items-center justify-center group-hover:bg-edusport-blue/15 transition-colors">
        <Icon className="w-4 h-4 text-edusport-blue" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5">
          {label}
        </p>
        <p className="text-sm font-medium text-gray-800 group-hover:text-edusport-blue transition-colors break-all">
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

const ContactForm: React.FC = () => {
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

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
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
    setStatus("idle");
  };

  if (status === "sent") {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-8 text-center gap-4">
        <div className="w-14 h-14 rounded-full bg-edusport-blue flex items-center justify-center">
          <Send className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900">
          Mesaj trimis!
        </h3>
        <p className="text-sm text-gray-500 max-w-xs">
          Îți mulțumim pentru mesaj. Te vom contacta în cel mai scurt timp.
        </p>
        <button
          onClick={resetForm}
          className="mt-2 text-sm text-edusport-blue underline underline-offset-4 hover:opacity-70 transition-opacity"
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
      <div>
        <FieldLabel htmlFor="name">Nume complet *</FieldLabel>
        <input
          id="name"
          name="name"
          type="text"
          required
          placeholder="Numele tău"
          value={form.name}
          onChange={handleChange}
          className={inputBase}
        />
      </div>

      {/* Email + Phone row */}
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <FieldLabel htmlFor="email">E-mail *</FieldLabel>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="email@exemplu.com"
            value={form.email}
            onChange={handleChange}
            className={inputBase}
          />
        </div>
        <div>
          <FieldLabel htmlFor="phone">Telefon</FieldLabel>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+40 7xx xxx xxx"
            value={form.phone}
            onChange={handleChange}
            className={inputBase}
          />
        </div>
      </div>

      {/* Reason */}
      <SelectField
        id="reason"
        name="reason"
        label="Motivul contactării *"
        required
        value={form.reason}
        onChange={handleChange}
        options={CONTACT_REASONS}
      />

      {/* Message */}
      <div>
        <FieldLabel htmlFor="message">Mesaj *</FieldLabel>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="Scrie mesajul tău aici..."
          value={form.message}
          onChange={handleChange}
          className={cn(inputBase, "resize-none")}
        />
      </div>

      {/* Error */}
      {status === "error" && errorMessage && (
        <div
          role="alert"
          className="px-4 py-3 border border-red-200 bg-red-50 text-sm text-red-700"
        >
          {errorMessage}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={status === "sending"}
        className={cn(
          "flex items-center justify-center gap-2 px-8 py-3.5",
          "bg-edusport-blue text-white text-sm font-semibold",
          "hover:bg-edusport-blue/90 transition-colors",
          "disabled:opacity-60 disabled:cursor-not-allowed",
        )}
      >
        {status === "sending" ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Se trimite...
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            Trimite mesajul
          </>
        )}
      </button>
    </form>
  );
};

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

const ContactPage: React.FC<{ contactInfo?: SiteContactInfo }> = ({
  contactInfo = {},
}) => {
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
    contactInfo.facebookUrl2 && {
      icon: ExternalLink,
      label: "Facebook",
      value: "Clubul Sportiv EduSport",
      href: contactInfo.facebookUrl2,
    },
  ].filter(Boolean) as { icon: React.ElementType; label: string; value: string; href: string }[];

  return (
    <div className="min-h-screen bg-white">
      <PageHeroSection title={["CONTACT"]} backgroundImage="/images/courses.png">
        <h1 className="text-4xl md:text-6xl font-semibold text-white leading-[1.1] tracking-tight">
          Contact
        </h1>
        <p className="text-white/70 text-base font-light border-t border-white/10 pt-4 max-w-md">
          Suntem aici să răspundem întrebărilor tale. Contactează-ne prin
          formularul de mai jos sau direct.
        </p>
      </PageHeroSection>

      <section className="relative z-10 bg-white">
        <div className="max-w-content mx-auto px-4 md:px-8 lg:px-12 py-16 md:py-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Left - contact info */}
            <div className="flex flex-col gap-8">
              <SectionHeader
                eyebrow="Datele noastre"
                title="Ia legătura cu noi"
                description="Fie că vrei să te înscrii la cursuri, ai o întrebare sau dorești o colaborare, suntem bucuroși să te ajutăm."
              />

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

            {/* Right - form */}
            <div className="bg-gray-50 p-6 md:p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-1">
                Trimite-ne un mesaj
              </h2>
              <p className="text-sm text-gray-400 mb-7">
                Răspundem de obicei în 24–48 de ore.
              </p>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
