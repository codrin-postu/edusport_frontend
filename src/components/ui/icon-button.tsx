"use client";

import React from "react";
import NextLink from "next/link";
import { cn } from "@/utils/cn";
import Icon, { type IconName } from "./icon";

interface IconButtonProps {
  icon: IconName;
  /** Required: the accessible name (there is no visible text). */
  label: string;
  /** plain (default): no border. outline: the 1.5px retro border. */
  variant?: "plain" | "outline";
  /** The button sits on a dark (navy) surface. */
  onDark?: boolean;
  onClick?: (event: React.MouseEvent) => void;
  /** Renders a link. Internal paths use the Next.js Link. */
  href?: string;
  disabled?: boolean;
  className?: string;
  /** Forwarded for toggles and disclosures. */
  "aria-pressed"?: boolean;
  "aria-expanded"?: boolean;
  "aria-controls"?: string;
}

/**
 * Icon-only control: always a 40 x 40 square (the minimum tap target), with
 * a 24px icon, the hover wash and the same keyboard focus ring as Button.
 */
export default function IconButton({
  icon,
  label,
  variant = "plain",
  onDark = false,
  onClick,
  href,
  disabled,
  className,
  ...aria
}: IconButtonProps) {
  const classes = cn(
    "inline-flex size-10 shrink-0 items-center justify-center transition-colors select-none",
    "outline-none focus-visible:outline-2 focus-visible:outline-offset-3",
    onDark
      ? "text-primary-on-dark hover-layer-on-dark focus-visible:outline-primary-on-dark"
      : "text-primary hover-layer focus-visible:outline-primary",
    variant === "outline" && "border-retro",
    variant === "outline" && (onDark ? "border-line-on-dark" : "border-line"),
    disabled && (onDark ? "text-muted-on-dark" : "text-disabled"),
    disabled && variant === "outline" && (onDark ? "border-line-subtle-on-dark" : "border-line-subtle"),
    disabled && "pointer-events-none cursor-not-allowed",
    className,
  );
  const inner = <Icon name={icon} size="md" />;

  if (href && !disabled) {
    if (href.startsWith("/")) {
      return (
        <NextLink href={href} aria-label={label} onClick={onClick} className={classes} {...aria}>
          {inner}
        </NextLink>
      );
    }
    return (
      <a href={href} aria-label={label} onClick={onClick} className={classes} {...aria}>
        {inner}
      </a>
    );
  }
  return (
    <button type="button" aria-label={label} onClick={onClick} disabled={disabled} className={classes} {...aria}>
      {inner}
    </button>
  );
}

export { IconButton };
