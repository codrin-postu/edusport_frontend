"use client";

import React, { useId } from "react";
import { cn } from "@/utils/cn";

// ---------------------------------------------------------------------------
// Shared form field: a Field wrapper (label + hint + error) around a single
// control, plus Input/Textarea sharing one focus ring and one invalid/disabled
// treatment with every other control on the site (Button, IconButton,
// Checkbox). Same 2px/3px outline on every input, textarea, select trigger,
// date picker segment group and checkbox: navy on light, cream on navy.
// ---------------------------------------------------------------------------

/** Keyboard AND mouse focus for text controls (a click into a field should
 * show the ring too, unlike Button/IconButton which are focus-visible only). */
const FOCUS_LIGHT = "outline-none focus:outline-2 focus:outline-offset-3 focus:outline-primary";
const FOCUS_DARK = "outline-none focus:outline-2 focus:outline-offset-3 focus:outline-primary-on-dark";

export type Surface = "page" | "card";

const CONTROL_BASE =
  "w-full text-body-sm border-retro transition-[color,box-shadow,border-color] disabled:cursor-not-allowed";

const CONTROL_LIGHT: Record<Surface, string> = {
  page: "bg-surface border-line text-primary placeholder:text-muted",
  card: "bg-surface-raised border-line text-primary placeholder:text-muted",
};

const CONTROL_DARK =
  "bg-surface-subtle-on-dark border-line-on-dark text-primary-on-dark placeholder:text-muted-on-dark";

const DISABLED_LIGHT = "disabled:text-disabled disabled:border-line-subtle";
const DISABLED_DARK = "disabled:text-disabled disabled:border-line-subtle-on-dark";

const INVALID_LIGHT = "aria-invalid:border-accent";
const INVALID_DARK = "aria-invalid:border-accent-on-dark";

interface ControlProps {
  /** The control sits on a dark (navy) panel. */
  onDark?: boolean;
  /** Light only: page (cream) or card (white) background. */
  surface?: Surface;
  /** Forces the invalid look outside of aria-invalid (e.g. no Field wrapper). */
  invalid?: boolean;
}

export type InputProps = ControlProps &
  Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> & {
    ref?: React.Ref<HTMLInputElement>;
  };

/** Single-line text input. h-12, px-4, text-body-sm, border-retro. */
export const Input: React.FC<InputProps> = ({
  onDark = false,
  surface = "page",
  invalid,
  className,
  ref,
  ...props
}) => (
  <input
    ref={ref}
    className={cn(
      CONTROL_BASE,
      "h-12 px-4",
      onDark ? CONTROL_DARK : CONTROL_LIGHT[surface],
      onDark ? FOCUS_DARK : FOCUS_LIGHT,
      onDark ? DISABLED_DARK : DISABLED_LIGHT,
      onDark ? INVALID_DARK : INVALID_LIGHT,
      invalid && (onDark ? "border-accent-on-dark" : "border-accent"),
      className,
    )}
    {...props}
  />
);

export type TextareaProps = ControlProps &
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    ref?: React.Ref<HTMLTextAreaElement>;
  };

/** Multi-line text input. py-3, min-h, 5 rows by default. */
export const Textarea: React.FC<TextareaProps> = ({
  onDark = false,
  surface = "page",
  invalid,
  className,
  rows = 5,
  ref,
  ...props
}) => (
  <textarea
    ref={ref}
    rows={rows}
    className={cn(
      CONTROL_BASE,
      "min-h-32 py-3 px-4 resize-y",
      onDark ? CONTROL_DARK : CONTROL_LIGHT[surface],
      onDark ? FOCUS_DARK : FOCUS_LIGHT,
      onDark ? DISABLED_DARK : DISABLED_LIGHT,
      onDark ? INVALID_DARK : INVALID_LIGHT,
      invalid && (onDark ? "border-accent-on-dark" : "border-accent"),
      className,
    )}
    {...props}
  />
);

export interface FieldProps {
  label: string;
  /** Appends " *" to the label. There is no "(optional)" marking. */
  required?: boolean;
  hint?: React.ReactNode;
  /** Error text shown under the field; also flips the control to invalid. */
  error?: string;
  /** The field sits on a dark (navy) panel. */
  onDark?: boolean;
  id?: string;
  className?: string;
  /** A single control (Input, Textarea, Select trigger, ...). Gets id,
   * aria-invalid, aria-describedby, aria-required and required injected. */
  children: React.ReactElement<Record<string, unknown>>;
}

/**
 * Label + control + hint + error, wired together with a generated id
 * (useId when none is given) and aria attributes cloned onto the single
 * child control. Required fields show " *" after the label; there is no
 * "(optional)" marking. Errors render under the field in the accent colour
 * (accent-on-dark on navy) and flip the control's border to match, no icon.
 */
export const Field: React.FC<FieldProps> = ({
  label,
  required,
  hint,
  error,
  onDark = false,
  id,
  className,
  children,
}) => {
  const autoId = useId();
  const childId = children.props.id as string | undefined;
  const controlId = id ?? childId ?? autoId;
  const hintId = hint ? `${controlId}-hint` : undefined;
  const errorId = error ? `${controlId}-error` : undefined;
  const childDescribedBy = children.props["aria-describedby"] as string | undefined;
  const describedBy =
    [childDescribedBy, hintId, errorId].filter(Boolean).join(" ") || undefined;

  const child = React.cloneElement(children, {
    id: controlId,
    "aria-invalid": error ? true : children.props["aria-invalid"],
    "aria-describedby": describedBy,
    "aria-required": required || undefined,
    required: required || children.props.required,
  });

  return (
    <div className={className}>
      <label
        htmlFor={controlId}
        className={cn("text-label block mb-2", onDark ? "text-secondary-on-dark" : "text-secondary")}
      >
        {label}
        {required ? " *" : ""}
      </label>
      {child}
      {hint && (
        <p
          id={hintId}
          className={cn("text-caption mt-2", onDark ? "text-secondary-on-dark" : "text-secondary")}
        >
          {hint}
        </p>
      )}
      {error && (
        <p
          id={errorId}
          aria-live="polite"
          className={cn("text-caption mt-2", onDark ? "text-accent-on-dark" : "text-accent")}
        >
          {error}
        </p>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Deprecated exports. Kept as thin aliases of the classes above so the page
// forms that still import them keep working until they move onto Field/Input.
// ---------------------------------------------------------------------------

/** @deprecated use Field */
export const FieldLabel: React.FC<{
  htmlFor: string;
  children: React.ReactNode;
  /** "dark" for use inside a navy panel (cream label) */
  tone?: "light" | "dark";
}> = ({ htmlFor, children, tone = "light" }) => (
  <label
    htmlFor={htmlFor}
    className={cn("text-label block mb-2", tone === "dark" ? "text-secondary-on-dark" : "text-secondary")}
  >
    {children}
  </label>
);

