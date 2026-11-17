"use client";

import React, { useId } from "react";
import { cn } from "@/utils/cn";
import Icon from "@/components/ui/icon";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  label: React.ReactNode;
  /** The checkbox sits on a dark (navy) panel. */
  onDark?: boolean;
  className?: string;
  ref?: React.Ref<HTMLInputElement>;
}

/**
 * A square 20px box, never a native checkbox (no browser control has a square
 * check mark). The real input stays in the document (sr-only, `peer`) for
 * keyboard, form submission and screen readers; the box and check icon are
 * plain siblings styled from the input's state via peer-* variants. Clicking
 * anywhere on the label (box or text) toggles it.
 */
export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  onDark = false,
  id,
  className,
  disabled,
  ref,
  ...props
}) => {
  const autoId = useId();
  const controlId = id ?? autoId;

  return (
    <label
      htmlFor={controlId}
      className={cn(
        "inline-flex items-center gap-2 text-body-sm",
        disabled ? "cursor-not-allowed" : "cursor-pointer",
        onDark ? "text-primary-on-dark" : "text-primary",
        disabled && "text-disabled",
        className,
      )}
    >
      <span className="relative inline-flex size-(--checkbox-size) shrink-0 items-center justify-center">
        <input
          ref={ref}
          id={controlId}
          type="checkbox"
          disabled={disabled}
          className="peer sr-only"
          {...props}
        />
        <span
          aria-hidden
          className={cn(
            "absolute inset-0 border-(length:--checkbox-border-width) transition-colors pointer-events-none",
            "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-(--focus-offset)",
            onDark ? "border-line-on-dark" : "border-checkbox-line",
            onDark
              ? "peer-focus-visible:outline-primary-on-dark"
              : "peer-focus-visible:outline-focus",
            onDark
              ? "peer-checked:bg-accent-on-dark peer-checked:border-accent-on-dark"
              : "peer-checked:bg-checkbox-on peer-checked:border-checkbox-on",
            disabled && (onDark ? "border-line-subtle-on-dark" : "border-line-subtle"),
            disabled && "peer-checked:bg-checkbox-on-disabled peer-checked:border-checkbox-line-disabled",
          )}
        />
        <Icon
          name="check"
          size="sm"
          className={cn(
            "relative hidden size-(--checkbox-mark-size) pointer-events-none peer-checked:block peer-checked:animate-(--checkbox-mark-anim)",
            onDark ? "text-primary" : "text-checkbox-mark",
            disabled && "text-checkbox-mark-disabled",
          )}
        />
      </span>
      {label}
    </label>
  );
};

export default Checkbox;
