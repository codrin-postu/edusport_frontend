"use client";

import { cn } from "@/utils/cn";
import { BookOpen, CalendarDays, ExternalLink, Send, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";
import React, { useState } from "react";
import { StepIndicator } from "./_shared";
import type { SubmitStatus } from "./_types";

interface StepConfirmProps {
  onBack: () => void;
  onSubmit: (e: React.FormEvent) => void;
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
        <h3 className="text-xl font-semibold text-gray-900">Confirmare & acorduri</h3>
        <p className="text-sm text-gray-500 font-light leading-relaxed">
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
          "border rounded-2xl p-5 md:p-6 transition-colors",
          regulamentAccepted
            ? "border-edusport-blue/30 bg-edusport-blue/[0.03]"
            : "border-gray-200 bg-white",
        )}
      >
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors",
              regulamentAccepted
                ? "bg-edusport-blue text-white"
                : "bg-gray-100 text-gray-400",
            )}
          >
            <BookOpen className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-gray-900 mb-1">
              Regulamentul Cursurilor
            </h4>
            <p className="text-xs text-gray-500 font-light leading-relaxed mb-4">
              Condițiile de participare, regulile de conduită pe gheață și
              informațiile esențiale pentru o experiență sigură.
            </p>
            <a
              href="/cursuri/regulament"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-edusport-blue hover:underline underline-offset-2"
            >
              Citește regulamentul
              <ExternalLink className="w-3 h-3" />
            </a>
            <label className="flex items-center gap-2 cursor-pointer mt-3">
              <input
                type="checkbox"
                checked={regulamentAccepted}
                onChange={(e) => setRegulamentAccepted(e.target.checked)}
                className="w-4 h-4 accent-edusport-blue cursor-pointer"
              />
              <span className="text-xs font-medium text-gray-700">
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
          "border rounded-2xl p-5 md:p-6 transition-colors",
          gdprAccepted
            ? "border-edusport-blue/30 bg-edusport-blue/[0.03]"
            : "border-gray-200 bg-white",
        )}
      >
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors",
              gdprAccepted
                ? "bg-edusport-blue text-white"
                : "bg-gray-100 text-gray-400",
            )}
          >
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-gray-900 mb-1">
              Protecția Datelor Personale
            </h4>
            <p className="text-xs text-gray-500 font-light leading-relaxed mb-4">
              Politica de confidențialitate privind prelucrarea datelor cu
              caracter personal conform GDPR.
            </p>
            <a
              href="/protectia-datelor"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-edusport-blue hover:underline underline-offset-2"
            >
              Citește politica de confidențialitate
              <ExternalLink className="w-3 h-3" />
            </a>
            <label className="flex items-center gap-2 cursor-pointer mt-3">
              <input
                type="checkbox"
                checked={gdprAccepted}
                onChange={(e) => setGdprAccepted(e.target.checked)}
                className="w-4 h-4 accent-edusport-blue cursor-pointer"
              />
              <span className="text-xs font-medium text-gray-700">
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
        className="flex items-center gap-3 border border-gray-200 bg-white rounded-2xl p-5 md:p-6 hover:border-edusport-blue/30 transition-colors group"
      >
        <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-400 flex items-center justify-center shrink-0 group-hover:bg-edusport-blue/10 group-hover:text-edusport-blue transition-colors">
          <CalendarDays className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-gray-900 mb-0.5">
            Programul Cursurilor
          </h4>
          <p className="text-xs text-gray-500 font-light">
            Consultă orarul și perioadele de desfășurare
          </p>
        </div>
        <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-edusport-blue shrink-0 transition-colors" />
      </motion.a>

      </motion.div>

      {/* Error */}
      {status === "error" && (
        <p className="text-sm text-red-500 mt-4">
          A apărut o eroare. Vă rugăm încercați din nou.
        </p>
      )}

      {/* Navigation + Submit */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
        <button
          type="button"
          onClick={onBack}
          className="text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors"
        >
          Înapoi
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={!canSubmit || status === "sending"}
          className={cn(
            "flex items-center justify-center gap-2 px-8 py-3.5",
            "text-sm font-semibold transition-colors",
            canSubmit
              ? "bg-edusport-blue text-white hover:bg-edusport-blue/90"
              : "bg-gray-100 text-gray-300 cursor-not-allowed",
            status === "sending" && "opacity-60 cursor-not-allowed",
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
              Trimite înscrierea
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default StepConfirm;
