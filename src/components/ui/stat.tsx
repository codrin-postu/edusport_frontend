import React from "react";
import { cn } from "@/utils/cn";

const VALUE_SIZE = {
  sm: "text-title",
  md: "text-heading",
  lg: "text-display",
  xl: "text-athlete-stat",
  "2xl": "text-display-lg",
} as const;

type StatProps = {
  value: React.ReactNode;
  label: React.ReactNode;
  /** sm text-title, md (default) text-heading, lg text-display, xl text-athlete-stat, 2xl text-display-lg. */
  size?: keyof typeof VALUE_SIZE;
  /** stack (default): label under the number. inline: label beside it. */
  layout?: "stack" | "inline";
  /** Accent (rust / mustard on navy) number. */
  accent?: boolean;
  onDark?: boolean;
  className?: string;
  /** Extra classes on the number only (e.g. a fixed min width to align rows). */
  valueClassName?: string;
  /** Extra classes on the label only (e.g. a colour on a coloured tile). */
  labelClassName?: string;
};

/**
 * A number with its label. Static: the landing stats strip animates its own
 * count-up and passes the current number in as `value`.
 */
export default function Stat({
  value,
  label,
  size = "md",
  layout = "stack",
  accent = false,
  onDark = false,
  className,
  valueClassName,
  labelClassName,
}: StatProps) {
  const valueColor = accent
    ? onDark ? "text-accent-on-dark" : "text-accent"
    : onDark ? "text-primary-on-dark" : "text-primary";
  return (
    <div
      className={cn(
        "flex",
        layout === "stack" ? "flex-col gap-1" : "items-baseline gap-2",
        className,
      )}
    >
      <span className={cn(VALUE_SIZE[size], "tabular-nums", valueColor, valueClassName)}>{value}</span>
      <span className={cn("text-label", onDark ? "text-secondary-on-dark" : "text-secondary", labelClassName)}>{label}</span>
    </div>
  );
}

export { Stat };
