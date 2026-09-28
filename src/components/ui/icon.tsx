import React from "react";
import { cn } from "@/utils/cn";
import { ICON_VERSION, type IconName } from "./icon-names";

export type { IconName };

interface IconProps {
  /** A file in public/icons. The list is generated, so a typo fails to compile. */
  name: IconName;
  /** sm = 16px (next to text), md = 24px (standalone). */
  size?: "sm" | "md";
  /** Announces the icon to screen readers. Without it the icon is decorative. */
  label?: string;
  className?: string;
}

/**
 * Every icon on the site. Each icon is its own SVG file, referenced with
 * <use>, so a page downloads only the icons it shows and each file is cached
 * on its own (see the /icons headers in next.config.ts). Single-colour icons
 * follow the text colour.
 */
export default function Icon({ name, size = "sm", label, className }: IconProps) {
  return (
    <svg
      className={cn(size === "sm" ? "size-4" : "size-6", "shrink-0", className)}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? "img" : undefined}
      focusable="false"
    >
      <use href={`/icons/${name}.svg?v=${ICON_VERSION[name]}#icon`} />
    </svg>
  );
}

export { Icon };
