"use client";

import { cn } from "@/utils/cn";
import { BookOpen, CalendarDays, ExternalLink, Send, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";
import React, { useState } from "react";
import SpotlightButton from "@/components/ui/spotlight-button";
import { StepIndicator } from "./_shared";
import type { SubmitStatus } from "./_types";

interface StepConfirmProps {
  onBack: () => void;
  onSubmit: (
    e: React.FormEvent | undefined,
    agreements: { gdpr: boolean; regulament: boolean },
  ) => void;
  status: SubmitStatus;
}

const cardItem = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } },
};

const StepConfirm: React.FC<StepConfirmProps> = ({ onBack, onSubmit, status }) => {
  const [regulamentAccepted, setRegulamentAccepted] = useState(false);
  const [gdprAccepted, setGdprAccepted] = useState(false);

  const canSubmit = regulamentAccepted && gdprAccepted;

  return (
    <div>
      <StepIndicator current={2} />

      <div className="flex flex-col gap-3 mb-8">
        <h3 className="font-display text-2xl font-extrabold text-navy">Confirmare & acorduri</h3>
        <p className="text-sm text-navy/60 leading-relaxed">
          Înainte de trimitere, vă rugăm să citiți și să acceptați
          regulamentul și politica de confidențialitate.
        </p>
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } } }}
        className="flex flex-col gap-4"
      >

      {/* Regulament card */}
      <motion.div variants={cardItem}
        className={cn(
          "border-[1.5px] p-5 md:p-6 transition-colors",
          regulamentAccepted
            ? "border-rust bg-rust/[0.04]"
            : "border-navy bg-retro-cream",
        )}
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 border-[1.5px] border-navy bg-navy text-retro-cream flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-navy mb-1">
              Regulamentul Cursurilor
            </h4>
            <p className="text-xs text-navy/60 leading-relaxed mb-4">
              Condițiile de participare, regulile de conduită pe gheață și
              informațiile esențiale pentru o experiență sigură.
            </p>
            <a
              href="/cursuri/regulament"
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline-rust inline-flex items-center gap-1.5 text-xs font-semibold text-rust"
            >
              Citește regulamentul
              <ExternalLink className="w-3 h-3" />
            </a>
            <label className="flex items-center gap-2 cursor-pointer mt-3">
              <input
                type="checkbox"
                checked={regulamentAccepted}
                onChange={(e) => setRegulamentAccepted(e.target.checked)}
                className="w-4 h-4 accent-rust cursor-pointer"
              />
              <span className="text-xs font-semibold text-navy">
                Am citit și sunt de acord cu regulamentul
              </span>
            </label>
          </div>
        </div>
      </motion.div>

      {/* GDPR card */}
      <motion.div
        variants={cardItem}
        className={cn(
          "border-[1.5px] p-5 md:p-6 transition-colors",
          gdprAccepted
            ? "border-rust bg-rust/[0.04]"
            : "border-navy bg-retro-cream",
        )}
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 border-[1.5px] border-navy bg-navy text-retro-cream flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-navy mb-1">
              Protecția Datelor Personale
            </h4>
            <p className="text-xs text-navy/60 leading-relaxed mb-4">
              Politica de confidențialitate privind prelucrarea datelor cu
              caracter personal conform GDPR.
            </p>
            <a
              href="/protectia-datelor"
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline-rust inline-flex items-center gap-1.5 text-xs font-semibold text-rust"
            >
              Citește politica de confidențialitate
              <ExternalLink className="w-3 h-3" />
            </a>
            <label className="flex items-center gap-2 cursor-pointer mt-3">
              <input
                type="checkbox"
                checked={gdprAccepted}
                onChange={(e) => setGdprAccepted(e.target.checked)}
                className="w-4 h-4 accent-rust cursor-pointer"
              />
              <span className="text-xs font-semibold text-navy">
                Am citit și sunt de acord
              </span>
            </label>
          </div>
        </div>
      </motion.div>

      {/* Program link */}
      <motion.a
        variants={cardItem}
        href="/cursuri/program"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 border-[1.5px] border-navy bg-retro-cream p-5 md:p-6 hover:shadow-[4px_4px_0_rgb(14_26_60_/_0.16)] transition-shadow group"
      >
        <div className="w-10 h-10 border-[1.5px] border-navy bg-navy text-retro-cream flex items-center justify-center shrink-0">
          <CalendarDays className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold text-navy mb-0.5">
            Programul Cursurilor
          </h4>
          <p className="text-xs text-navy/60">
            Consultă orarul și perioadele de desfășurare
          </p>
        </div>
        <ExternalLink className="w-4 h-4 text-navy/40 group-hover:text-rust shrink-0 transition-colors" />
      </motion.a>

      </motion.div>

      {/* Error */}
      {status === "error" && (
        <p className="text-sm text-rust font-semibold mt-4">
          A apărut o eroare. Vă rugăm încercați din nou.
        </p>
      )}

      {/* Navigation + Submit */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t-[1.5px] border-navy/12">
        <button
          type="button"
          onClick={onBack}
          className="text-sm font-semibold text-navy/50 hover:text-rust transition-colors"
        >
          Înapoi
        </button>
        <SpotlightButton
          layers
          layersFace="black"
          type="button"
          onClick={() =>
            onSubmit(undefined, {
              gdpr: gdprAccepted,
              regulament: regulamentAccepted,
            })
          }
          disabled={!canSubmit || status === "sending"}
        >
          {status === "sending" ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Se trimite...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Send className="w-4 h-4" />
              Trimite înscrierea
            </span>
          )}
        </SpotlightButton>
      </div>
    </div>
  );
};

export default StepConfirm;
