"use client";

import React from "react";
import { cn } from "@/utils/cn";
import { FieldLabel, inputBaseOnCard, inputOnNavy } from "@/components/ui/form-field";
import { Select } from "@/components/ui/select";
import {
  optionItems,
  type CustomAnswer,
  type FormQuestion,
} from "@/lib/strapi-forms";

// ---------------------------------------------------------------------------
// Generic renderer for CUSTOM (admin-added) form questions. Each question is
// drawn from its `type` using the SAME input styling as the built-in fields, so
// customs look native to the form. Two visual variants match the two form
// surfaces: "card" (light cream/white card — Înscriere) and "navy" (dark panel
// — Contact). Values and errors are owned by the parent form.
// ---------------------------------------------------------------------------

export type CustomVariant = "card" | "navy";

const VARIANT = {
  card: {
    input: inputBaseOnCard,
    labelTone: "light" as const,
    help: "text-xs text-navy/55 mb-2 -mt-1",
    error: "text-xs text-rust font-semibold mt-1.5",
    info: "text-sm text-navy/60 leading-relaxed",
    link: "link-underline-rust font-semibold text-rust",
    checkboxLabel: "text-xs font-semibold text-navy",
    checkboxAccent: "accent-rust",
    select: undefined as string | undefined,
  },
  navy: {
    input: inputOnNavy,
    labelTone: "dark" as const,
    help: "text-xs text-retro-cream/50 mb-2 -mt-1",
    error: "text-xs font-semibold text-danger mt-1.5",
    info: "text-sm text-retro-cream/60 leading-relaxed",
    link: "font-semibold text-mustard underline underline-offset-4 hover:opacity-70 transition-opacity",
    checkboxLabel: "text-xs font-semibold text-retro-cream",
    checkboxAccent: "accent-mustard",
    select:
      "bg-white/[0.06] border-retro-cream/35 text-retro-cream focus:border-mustard focus:ring-mustard/25 data-[state=open]:border-mustard data-[state=open]:ring-mustard/25",
  },
} as const;

interface CustomQuestionsProps {
  questions: FormQuestion[];
  values: Record<string, CustomAnswer>;
  errors: Record<string, string | undefined>;
  onChange: (key: string, value: CustomAnswer) => void;
  onBlur?: (key: string) => void;
  variant?: CustomVariant;
  className?: string;
}

const CustomQuestions: React.FC<CustomQuestionsProps> = ({
  questions,
  values,
  errors,
  onChange,
  onBlur,
  variant = "card",
  className,
}) => {
  if (!questions.length) return null;
  const v = VARIANT[variant];

  return (
    <div className={cn("flex flex-col gap-5", className)}>
      {questions.map((q) => {
        const key = q.key;
        const required = q.required === true;
        const text = q.label && q.label.trim() !== "" ? q.label : key;
        const labelText = `${text}${required ? " *" : ""}`;
        const help = q.help && q.help.trim() !== "" ? q.help : undefined;
        const error = errors[key];
        const raw = values[key];
        const strValue = typeof raw === "string" ? raw : "";

        // Notice / link block.
        if (q.type === "info") {
          return (
            <p key={key} className={v.info}>
              {q.label}
              {q.linkUrl && (
                <>
                  {" "}
                  <a
                    href={q.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={v.link}
                  >
                    {q.linkLabel ?? "Detalii"}
                  </a>
                </>
              )}
            </p>
          );
        }

        if (q.type === "checkbox") {
          return (
            <div key={key}>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={raw === true}
                  required={required}
                  onChange={(e) => onChange(key, e.target.checked)}
                  className={cn("w-4 h-4 cursor-pointer", v.checkboxAccent)}
                />
                <span className={v.checkboxLabel}>{labelText}</span>
              </label>
              {help && <p className={cn(v.help, "mt-1.5 mb-0")}>{help}</p>}
            </div>
          );
        }

        if (q.type === "select") {
          return (
            <div key={key}>
              <FieldLabel htmlFor={key} tone={v.labelTone}>
                {labelText}
              </FieldLabel>
              {help && <p className={v.help}>{help}</p>}
              <Select
                id={key}
                name={key}
                value={strValue}
                onValueChange={(val) => onChange(key, val)}
                options={optionItems(q)}
                placeholder="Selectează..."
                required={required}
                className={v.select}
              />
            </div>
          );
        }

        if (q.type === "longtext") {
          return (
            <div key={key}>
              <FieldLabel htmlFor={key} tone={v.labelTone}>
                {labelText}
              </FieldLabel>
              {help && <p className={v.help}>{help}</p>}
              <textarea
                id={key}
                name={key}
                required={required}
                rows={3}
                value={strValue}
                onChange={(e) => onChange(key, e.target.value)}
                className={cn(v.input, "resize-none")}
              />
              {error && <p className={v.error}>{error}</p>}
            </div>
          );
        }

        // text / email / tel / date.
        const inputType =
          q.type === "email"
            ? "email"
            : q.type === "tel"
              ? "tel"
              : q.type === "date"
                ? "date"
                : "text";
        const inputMode =
          q.type === "tel" ? "tel" : q.type === "email" ? "email" : undefined;

        return (
          <div key={key}>
            <FieldLabel htmlFor={key} tone={v.labelTone}>
              {labelText}
            </FieldLabel>
            {help && <p className={v.help}>{help}</p>}
            <input
              id={key}
              name={key}
              type={inputType}
              inputMode={inputMode}
              required={required}
              value={strValue}
              onChange={(e) => onChange(key, e.target.value)}
              onBlur={onBlur ? () => onBlur(key) : undefined}
              aria-invalid={error ? true : undefined}
              className={v.input}
            />
            {error && <p className={v.error}>{error}</p>}
          </div>
        );
      })}
    </div>
  );
};

export default CustomQuestions;
