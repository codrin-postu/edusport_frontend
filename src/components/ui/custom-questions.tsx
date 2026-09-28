"use client";

import React from "react";
import Icon, { type IconName } from "@/components/ui/icon";
import { cn } from "@/utils/cn";
import { FieldLabel, inputBaseOnCard, inputOnNavy } from "@/components/ui/form-field";
import { Select } from "@/components/ui/select";
import { DatePickerField } from "@/components/ui/date-picker-field";
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

/**
 * Icon vocabulary, mirroring CARD_ICONS in the backend registry. The CMS stores
 * a name; an unknown one simply renders no icon rather than breaking the card.
 */
const ICONS: Record<string, IconName> = {
  book: "book-open",
  shield: "shield-check",
  calendar: "calendar-days",
  info: "info",
  award: "award",
  users: "users",
};

/** A question renders as a card once the CMS gives it a title or an icon. */
const isCard = (q: FormQuestion) =>
  Boolean((q.title && q.title.trim()) || (q.icon && ICONS[q.icon]));

const VARIANT = {
  card: {
    input: inputBaseOnCard,
    labelTone: "light" as const,
    help: "text-xs text-secondary mb-2 -mt-1",
    error: "text-xs text-accent font-semibold mt-2",
    info: "text-sm text-secondary leading-relaxed",
    link: "link font-semibold text-accent",
    checkboxLabel: "text-xs font-semibold text-primary",
    checkboxAccent: "accent-rust",
    select: undefined as string | undefined,
    card: "border-line bg-surface",
    cardChecked: "border-rust bg-surface-raised",
    cardHover: "hover:shadow-retro-sm transition-shadow",
    cardIcon: "border-line bg-surface-dark text-primary-on-dark",
    cardTitle: "text-primary",
    cardDesc: "text-secondary",
    cardLink: "link inline-flex items-center gap-2 text-xs font-semibold text-accent",
    cardExternal: "text-secondary group-hover:text-accent",
  },
  navy: {
    input: inputOnNavy,
    labelTone: "dark" as const,
    help: "text-xs text-secondary-on-dark mb-2 -mt-1",
    error: "text-xs font-semibold text-danger mt-2",
    info: "text-sm text-secondary-on-dark leading-relaxed",
    link: "link link-on-dark",
    checkboxLabel: "text-xs font-semibold text-primary-on-dark",
    checkboxAccent: "accent-mustard",
    select:
      "bg-surface-subtle-on-dark border-line-on-dark text-primary-on-dark focus:border-mustard focus:ring-mustard data-[state=open]:border-mustard data-[state=open]:ring-mustard",
    card: "border-line-on-dark bg-surface-subtle-on-dark",
    cardChecked: "border-mustard bg-surface-subtle-on-dark",
    cardHover: "hover:border-mustard transition-colors",
    cardIcon: "border-mustard bg-mustard text-primary",
    cardTitle: "text-primary-on-dark",
    cardDesc: "text-secondary-on-dark",
    cardLink:
      "link link-on-dark inline-flex items-center gap-2 text-xs",
    cardExternal: "text-line-subtle-on-dark group-hover:text-mustard",
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
  /**
   * Input placeholders by question key. The CMS has no placeholder concept, so
   * these are supplied by the caller as presentation only; a question without
   * an entry renders without one.
   */
  placeholders?: Record<string, string>;
}

const CustomQuestions: React.FC<CustomQuestionsProps> = ({
  questions,
  values,
  errors,
  onChange,
  onBlur,
  variant = "card",
  className,
  placeholders,
}) => {
  if (!questions.length) return null;
  const v = VARIANT[variant];

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {questions.map((q) => {
        const key = q.key;
        const required = q.required === true;
        const text = q.label && q.label.trim() !== "" ? q.label : key;
        const labelText = `${text}${required ? " *" : ""}`;
        const help = q.help && q.help.trim() !== "" ? q.help : undefined;
        const error = errors[key];
        const raw = values[key];
        const strValue = typeof raw === "string" ? raw : "";

        const iconName = q.icon ? ICONS[q.icon] : undefined;

        // Link card: an `info` question carrying a title/icon. The whole card
        // is the link, and it holds no answer.
        if (q.type === "info" && isCard(q)) {
          const body = (
            <>
              {iconName && (
                <span
                  className={cn(
                    "w-10 h-10 border-retro flex items-center justify-center shrink-0",
                    v.cardIcon,
                  )}
                >
                  <Icon name={iconName} size="md" />
                </span>
              )}
              <span className="flex-1 min-w-0">
                <span className={cn("block text-sm font-bold mb-0.5", v.cardTitle)}>
                  {q.title}
                </span>
                {q.label && (
                  <span className={cn("block text-xs leading-relaxed", v.cardDesc)}>
                    {q.label}
                  </span>
                )}
              </span>
            </>
          );
          return q.linkUrl ? (
            <a
              key={key}
              href={q.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "flex items-center gap-3 border-retro p-6 md:p-6 group",
                v.card,
                v.cardHover,
              )}
            >
              {body}
              <Icon
                name="external-link"
                className={cn("transition-colors", v.cardExternal)}
              />
            </a>
          ) : (
            <div
              key={key}
              className={cn("flex items-center gap-3 border-retro p-6 md:p-6", v.card)}
            >
              {body}
            </div>
          );
        }

        // Consent card: a checkbox with a title, description and a link out to
        // the document being agreed to. Tints once ticked.
        if (q.type === "checkbox" && isCard(q)) {
          const checked = raw === true;
          return (
            <div
              key={key}
              className={cn(
                "border-retro p-6 md:p-6 transition-colors",
                checked ? v.cardChecked : v.card,
              )}
            >
              <div className="flex items-start gap-4">
                {iconName && (
                  <div
                    className={cn(
                      "w-10 h-10 border-retro flex items-center justify-center shrink-0",
                      v.cardIcon,
                    )}
                  >
                    <Icon name={iconName} size="md" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  {q.title && (
                    <h4 className={cn("text-sm font-bold mb-1", v.cardTitle)}>
                      {q.title}
                    </h4>
                  )}
                  {help && (
                    <p className={cn("text-xs leading-relaxed mb-4", v.cardDesc)}>
                      {help}
                    </p>
                  )}
                  {q.linkUrl && (
                    <a
                      href={q.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={v.cardLink}
                    >
                      {q.linkLabel || "Detalii"}
                      <Icon name="external-link" />
                    </a>
                  )}
                  <label className="flex items-center gap-2 cursor-pointer mt-3">
                    <input
                      type="checkbox"
                      checked={checked}
                      required={required}
                      onChange={(e) => onChange(key, e.target.checked)}
                      className={cn("w-4 h-4 cursor-pointer", v.checkboxAccent)}
                    />
                    <span className={v.checkboxLabel}>{labelText}</span>
                  </label>
                </div>
              </div>
            </div>
          );
        }

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
              {help && <p className={cn(v.help, "mt-2 mb-0")}>{help}</p>}
            </div>
          );
        }

        // Multiselect: a labeled vertical group of checkboxes, one per enabled
        // option. The answer is the string[] of selected option values.
        if (q.type === "multiselect") {
          const selected = Array.isArray(raw) ? raw : [];
          const toggle = (val: string) =>
            onChange(
              key,
              selected.includes(val)
                ? selected.filter((x) => x !== val)
                : [...selected, val],
            );
          return (
            <div key={key}>
              <FieldLabel htmlFor={key} tone={v.labelTone}>
                {labelText}
              </FieldLabel>
              {help && <p className={v.help}>{help}</p>}
              <div id={key} className="flex flex-col gap-3">
                {optionItems(q).map((o) => (
                  <label
                    key={o.value}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selected.includes(o.value)}
                      onChange={() => toggle(o.value)}
                      className={cn("w-4 h-4 cursor-pointer", v.checkboxAccent)}
                    />
                    <span className={v.checkboxLabel}>{o.label}</span>
                  </label>
                ))}
              </div>
              {error && <p className={v.error}>{error}</p>}
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
                placeholder={placeholders?.[key]}
                value={strValue}
                onChange={(e) => onChange(key, e.target.value)}
                className={cn(v.input, "resize-none")}
              />
              {error && <p className={v.error}>{error}</p>}
            </div>
          );
        }

        if (q.type === "date") {
          return (
            <div key={key}>
              {/* The picker renders its own label: a segmented input has no
                  single element for htmlFor to point at. */}
              <DatePickerField
                id={key}
                name={key}
                label={labelText}
                value={strValue}
                onChange={(val) => onChange(key, val)}
                onBlur={onBlur ? () => onBlur(key) : undefined}
                required={required}
                invalid={Boolean(error)}
                variant={variant}
                help={help}
                helpClassName={v.help}
              />
              {error && <p className={v.error}>{error}</p>}
            </div>
          );
        }

        // text / email / tel.
        const inputType =
          q.type === "email" ? "email" : q.type === "tel" ? "tel" : "text";
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
              placeholder={placeholders?.[key]}
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
