import NextLink from "next/link";
import React from "react";
import { cn } from "@/utils/cn";

export type LinkTone = "default" | "quiet" | "footer" | "plain";

interface LinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  href: string;
  /**
   * default: permanent underline, slide on hover (text and standalone links).
   * quiet: no underline, regular weight, only the colour changes on hover
   *   (meta links: locations, breadcrumbs, contact details).
   * footer: the footer's grow-in underline.
   * plain: no text styling, for links that wrap a whole card.
   */
  tone?: LinkTone;
  /** The link sits on a dark (navy) surface. */
  onDark?: boolean;
  /** Opens in a new tab. */
  external?: boolean;
  /** Internal links only: false keeps the scroll position on navigation. */
  scroll?: boolean;
  ref?: React.Ref<HTMLAnchorElement>;
}

const TONE: Record<LinkTone, { light: string; dark: string }> = {
  default: { light: "link", dark: "link link-on-dark" },
  quiet: { light: "transition-colors hover:text-accent", dark: "transition-colors hover:text-accent-on-dark" },
  footer: { light: "link-footer", dark: "link-footer" },
  plain: { light: "", dark: "" },
};

/**
 * The site's link. Internal paths use the Next.js Link (no full page reload);
 * other hrefs (http, mailto, tel) render a plain anchor.
 */
export default function Link({
  href,
  tone = "default",
  onDark = false,
  external = false,
  scroll,
  className,
  children,
  ref,
  ...rest
}: LinkProps) {
  const classes = cn(onDark ? TONE[tone].dark : TONE[tone].light, className);
  const newTab = external ? { target: "_blank", rel: "noopener noreferrer" } : {};

  if (href.startsWith("/") && !external) {
    return (
      <NextLink ref={ref} href={href} scroll={scroll} className={classes} {...rest}>
        {children}
      </NextLink>
    );
  }
  return (
    <a ref={ref} href={href} className={classes} {...newTab} {...rest}>
      {children}
    </a>
  );
}

export { Link };
