"use client";

import React from "react";
import NextLink from "next/link";
import { cn } from "@/utils/cn";

/** Face colour of the primary (layers) button. */
export type ButtonFace = "black" | "white" | "cream";

interface ButtonProps {
  children: React.ReactNode;
  /**
   * primary: the retro layers CTA (square face with a mustard and a rust
   * layer behind it). secondary: outline with the hover wash.
   */
  variant?: "primary" | "secondary";
  /** Primary only. black sits on light surfaces; cream and white on navy. */
  face?: ButtonFace;
  /** Secondary only: the button sits on a dark (navy) surface. */
  onDark?: boolean;
  className?: string;
  onClick?: () => void;
  /** Renders a link. Internal paths use the Next.js Link (no full reload). */
  href?: string;
  /** Opens in a new tab. */
  external?: boolean;
  /** Button type (ignored when `href` is set), so a Button can submit a form. */
  type?: "button" | "submit";
  /** Disabled state (button element only). */
  disabled?: boolean;
  /** Umami event name, set as `data-umami-event` so clicks are tracked. */
  umamiEvent?: string;
}

const FACE: Record<ButtonFace, string> = {
  black: "bg-black text-primary-on-dark",
  white: "bg-surface-raised text-primary",
  cream: "bg-surface text-primary",
};

/** Disabled face: solid colours, never opacity. black sits on light panels,
 * white and cream on navy panels, so they use the on-dark tokens. */
const FACE_DISABLED: Record<ButtonFace, string> = {
  black: "group-disabled:bg-surface-subtle group-disabled:text-disabled",
  white: "group-disabled:bg-surface-subtle-on-dark group-disabled:text-muted-on-dark",
  cream: "group-disabled:bg-surface-subtle-on-dark group-disabled:text-muted-on-dark",
};

// Keyboard focus ring (shown for keyboard navigation only): navy on light
// surfaces, cream on dark ones.
const FOCUS_LIGHT = "outline-none focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-primary";
const FOCUS_DARK = "outline-none focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-primary-on-dark";

const SECONDARY_LIGHT = "border-line text-primary hover-layer disabled:text-disabled disabled:border-line-subtle";
const SECONDARY_DARK = "border-line-on-dark text-primary-on-dark hover-layer-on-dark disabled:text-muted-on-dark disabled:border-line-subtle-on-dark";

/**
 * The site's button. Primary is the retro layers CTA: on hover the two layers
 * fan out to the bottom right (spring), on press the face snaps onto them
 * (motion lives in the `.lcta` rules in globals.css). Secondary is the outline
 * button with the hover wash. Both are 48px with the text-button role.
 */
const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  face = "black",
  onDark = false,
  className,
  onClick,
  href,
  external,
  type = "button",
  disabled,
  umamiEvent,
}) => {
  let classes: string;
  let content: React.ReactNode;

  if (variant === "secondary") {
    classes = cn(
      "text-button inline-flex items-center justify-center gap-2 h-12 px-6 border-retro bg-transparent transition-colors select-none",
      "disabled:pointer-events-none disabled:cursor-not-allowed",
      onDark ? SECONDARY_DARK : SECONDARY_LIGHT,
      onDark ? FOCUS_DARK : FOCUS_LIGHT,
      className,
      // Every button uses the same type role; a caller cannot resize it.
      "text-button",
    );
    content = children;
  } else {
    classes = cn(
      "lcta group select-none",
      face === "black" ? FOCUS_LIGHT : FOCUS_DARK,
      disabled && "pointer-events-none cursor-not-allowed",
      className,
    );
    content = (
      <>
        <span aria-hidden className="lcta-layer lcta-l1 group-disabled:hidden" />
        <span aria-hidden className="lcta-layer lcta-l2 group-disabled:hidden" />
        <span
          className={cn(
            "lcta-face h-12 px-6 inline-flex items-center justify-center gap-2 text-button",
            FACE[face],
            FACE_DISABLED[face],
          )}
        >
          {children}
        </span>
      </>
    );
  }

  if (href) {
    const internal = href.startsWith("/") && !external;
    if (internal) {
      return (
        <NextLink href={href} onClick={onClick} className={classes} data-button="" data-umami-event={umamiEvent}>
          {content}
        </NextLink>
      );
    }
    return (
      <a
        href={href}
        onClick={onClick}
        className={classes}
        data-button=""
        data-umami-event={umamiEvent}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {content}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes} data-button="" data-umami-event={umamiEvent}>
      {content}
    </button>
  );
};

export default Button;
export { Button };
