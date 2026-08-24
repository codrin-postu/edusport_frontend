"use client";

import React, { useRef, useState } from "react";
import { Send } from "lucide-react";
import { cn } from "@/utils/cn";
import { FieldLabel, inputOnNavy } from "@/components/ui/form-field";
import SpotlightButton from "@/components/ui/spotlight-button";
import { track } from "@/lib/analytics";

/**
 * Volunteer application form. Reuses the shared `/api/contact` endpoint with a
 * fixed `reason: "voluntariat"` so submissions land in the same inbox, tagged.
 * Mirrors the contact form (honeypot, status states, navy-panel styling) but
 * drops the reason select — the reason is implicit on this page.
 */

type FormState = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

type SubmitStatus = "idle" | "sending" | "sent" | "error";

const VolunteerForm: React.FC = () => {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [botField, setBotField] = useState("");
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const startedRef = useRef(false);
  const markStarted = () => {
    if (startedRef.current) return;
    startedRef.current = true;
    track("voluntariat.start");
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    markStarted();
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
        body: JSON.stringify({ ...form, reason: "voluntariat", _botField: botField }),
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
      track("voluntariat.submit");
      setStatus("sent");
    } catch {
      setErrorMessage("Conexiune eșuată. Verifică internetul și încearcă din nou.");
      setStatus("error");
    }
  };

  const resetForm = () => {
    setForm({ name: "", email: "", phone: "", message: "" });
    setBotField("");
    setErrorMessage("");
    setStatus("idle");
  };

  if (status === "sent") {
    return (
      <div className="flex flex-col items-center justify-center gap-4 px-8 py-16 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-mustard">
          <Send className="h-6 w-6 text-navy" />
        </div>
        <h3 className="font-display text-2xl font-extrabold text-retro-cream">
          Cerere trimisă!
        </h3>
        <p className="max-w-xs text-sm text-retro-cream/60">
          Îți mulțumim! Te vom contacta în cel mai scurt timp pentru pașii următori.
        </p>
        <button
          onClick={resetForm}
          className="mt-2 text-sm font-semibold text-mustard underline underline-offset-4 transition-opacity hover:opacity-70"
        >
          Trimite o altă cerere
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
        <FieldLabel htmlFor="name" tone="dark">Nume complet *</FieldLabel>
        <input
          id="name"
          name="name"
          type="text"
          required
          placeholder="Numele tău"
          value={form.name}
          onChange={handleChange}
          className={inputOnNavy}
        />
      </div>

      {/* Email + Phone row */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor="email" tone="dark">E-mail *</FieldLabel>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="email@exemplu.com"
            value={form.email}
            onChange={handleChange}
            className={inputOnNavy}
          />
        </div>
        <div>
          <FieldLabel htmlFor="phone" tone="dark">Telefon</FieldLabel>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+40 7xx xxx xxx"
            value={form.phone}
            onChange={handleChange}
            className={inputOnNavy}
          />
        </div>
      </div>

      {/* Message */}
      <div>
        <FieldLabel htmlFor="message" tone="dark">Mesaj *</FieldLabel>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="Spune-ne de ce vrei să fii voluntar și cu ce ai vrea să ajuți..."
          value={form.message}
          onChange={handleChange}
          className={cn(inputOnNavy, "resize-none")}
        />
      </div>

      {/* Error */}
      {status === "error" && errorMessage && (
        <div
          role="alert"
          className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
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
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-navy/30 border-t-navy" />
            Se trimite...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            Trimite cererea
          </span>
        )}
      </SpotlightButton>
    </form>
  );
};

export default VolunteerForm;
