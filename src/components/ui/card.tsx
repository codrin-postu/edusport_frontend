import React from "react";
import NextLink from "next/link";
import { cn } from "@/utils/cn";

type Surface = "surface" | "raised" | "subtle" | "dark";

const SURFACE: Record<Surface, string> = {
  surface: "bg-surface text-primary border-line",
  raised: "bg-surface-raised text-primary border-line",
  subtle: "bg-surface-subtle text-primary border-line",
  dark: "bg-surface-dark text-primary-on-dark border-line",
};

const SHADOW = { none: "", sm: "shadow-retro-sm", md: "shadow-retro" } as const;
const PADDING = { none: "", sm: "p-4", md: "p-6", lg: "p-8" } as const;

type CardProps = {
  /** surface (default): cream. raised: white. subtle: grey. dark: navy. */
  surface?: Surface;
  /** md (default): 8px retro shadow. sm: 4px (rows, popovers). none. */
  shadow?: keyof typeof SHADOW;
  /** md (default) p-6, sm p-4, lg p-8, none. */
  padding?: keyof typeof PADDING;
  /** Makes the whole card a link. Only link cards react to hover. */
  href?: string;
  /** Link cards only: open in a new tab (for off-site links). */
  external?: boolean;
  /** Element for a static card. */
  as?: "div" | "article" | "section" | "li" | "aside";
  className?: string;
  children?: React.ReactNode;
} & Omit<React.HTMLAttributes<HTMLElement>, "className" | "children">;

/**
 * The retro box: 1.5px navy border, square corners, offset shadow.
 *
 * A card with `href` is a link: on hover only its CardTitle turns accent
 * (accent-on-dark on navy), and keyboard focus shows the site ring. Static
 * cards have no hover state.
 */
export default function Card({
  surface = "surface",
  shadow = "md",
  padding = "md",
  href,
  external = false,
  as = "div",
  className,
  children,
  ...rest
}: CardProps) {
  const classes = cn("block border-retro", SURFACE[surface], SHADOW[shadow], PADDING[padding], className);

  if (href) {
    // CardTitle reads --card-hover, so the title colour follows the surface
    // without a client context.
    const linkClasses = cn(
      classes,
      "group/card outline-none focus-visible:outline-2 focus-visible:outline-offset-3",
      surface === "dark"
        ? "[--card-hover:var(--color-accent-on-dark)] focus-visible:outline-primary-on-dark"
        : "[--card-hover:var(--color-accent)] focus-visible:outline-primary",
    );
    const anchorProps = rest as React.AnchorHTMLAttributes<HTMLAnchorElement>;
    if (href.startsWith("/") && !external) {
      return (
        <NextLink href={href} className={linkClasses} {...anchorProps}>
          {children}
        </NextLink>
      );
    }
    return (
      <a
        href={href}
        className={linkClasses}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...anchorProps}
      >
        {children}
      </a>
    );
  }

  const Tag = as;
  return (
    <Tag className={classes} {...rest}>
      {children}
    </Tag>
  );
}

type CardTitleProps = {
  as?: "h2" | "h3" | "h4" | "p" | "span";
  className?: string;
  children?: React.ReactNode;
};

/**
 * The card's title. Inside a link card it turns accent on hover.
 *
 * The hover colour is applied by a plain CSS rule (globals.css, keyed off
 * `data-card-title`), not a `group-hover/card:` utility class: a Tailwind
 * utility here would tie for specificity with any text colour class the
 * caller adds (e.g. `text-primary`) and the winner would depend on utility
 * generation order. The plain selector always wins.
 */
export function CardTitle({ as: Tag = "h3", className, children }: CardTitleProps) {
  return (
    <Tag data-card-title className={cn("transition-colors", className)}>{children}</Tag>
  );
}

export { Card };
