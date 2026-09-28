import React from "react";
import NextLink from "next/link";
import { cn } from "@/utils/cn";
import Icon, { type IconName } from "./icon";

type BaseProps = {
  icon: IconName;
  /** Required: the accessible name (there is no visible text). */
  label: string;
  /** plain (default): no border. outline: the 1.5px retro border. */
  variant?: "plain" | "outline";
  /**
   * md (default): 24px icon. sm: 16px icon, for triggers that sit inline next
   * to text (the 40px tap area stays; offset it with negative margins).
   */
  size?: "sm" | "md";
  /** The button sits on a dark (navy) surface. */
  onDark?: boolean;
  /** Renders a link. Internal paths use the Next.js Link. */
  href?: string;
  /** Internal links only: false keeps the scroll position on navigation. */
  scroll?: boolean;
  disabled?: boolean;
  className?: string;
  ref?: React.Ref<HTMLButtonElement & HTMLAnchorElement>;
};

// Every other prop (event handlers, aria-*, data-*, the props a Tooltip or
// Popover trigger injects) is passed through to the element.
type IconButtonProps = BaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps | "children" | "type">;

/**
 * Icon-only control: always a 40 x 40 tap area. On hover only the icon
 * changes colour (accent on light, accent-on-dark on navy); the square itself
 * stays invisible. Keyboard focus shows the same ring as Button.
 */
export default function IconButton({
  icon,
  label,
  variant = "plain",
  size = "md",
  onDark = false,
  href,
  scroll,
  disabled,
  className,
  ref,
  ...rest
}: IconButtonProps) {
  const classes = cn(
    "inline-flex size-10 shrink-0 items-center justify-center transition-colors select-none",
    "outline-none focus-visible:outline-2 focus-visible:outline-offset-3",
    onDark
      ? "text-primary-on-dark hover:text-accent-on-dark focus-visible:outline-primary-on-dark"
      : "text-primary hover:text-accent focus-visible:outline-primary",
    variant === "outline" && "border-retro",
    variant === "outline" && (onDark ? "border-line-on-dark" : "border-line"),
    disabled && (onDark ? "text-muted-on-dark" : "text-disabled"),
    disabled && variant === "outline" && (onDark ? "border-line-subtle-on-dark" : "border-line-subtle"),
    disabled && "pointer-events-none cursor-not-allowed",
    className,
  );
  const inner = <Icon name={icon} size={size} />;

  if (href && !disabled) {
    const anchorProps = rest as React.AnchorHTMLAttributes<HTMLAnchorElement>;
    if (href.startsWith("/")) {
      return (
        <NextLink ref={ref} href={href} scroll={scroll} aria-label={label} className={classes} {...anchorProps}>
          {inner}
        </NextLink>
      );
    }
    return (
      <a ref={ref} href={href} aria-label={label} className={classes} {...anchorProps}>
        {inner}
      </a>
    );
  }
  return (
    <button ref={ref} type="button" aria-label={label} disabled={disabled} className={classes} {...rest}>
      {inner}
    </button>
  );
}

export { IconButton };
