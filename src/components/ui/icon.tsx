import React from "react";
import { cn } from "@/utils/cn";
import { ICON_VERSION, type IconName } from "./icon-names";

export type { IconName };

interface IconProps {
  /** A file in public/icons. The list is generated, so a typo fails to compile. */
  name: IconName;
  /** sm = 16px (next to text), md = 24px (standalone), lg = 48px (media
   *  controls over a video or image); 18, 20 and 26 are the portal kit pixel
   *  sizes (--icon-18, --icon-20, --icon-26). */
  size?: "sm" | "md" | "lg" | "18" | "20" | "26";
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
const SIZE = {
  sm: "size-4",
  md: "size-6",
  lg: "size-12",
  "18": "size-(--icon-18)",
  "20": "size-(--icon-20)",
  "26": "size-(--icon-26)",
} as const;

export default function Icon({ name, size = "sm", label, className }: IconProps) {
  return (
    <svg
      className={cn(SIZE[size], "shrink-0", className)}
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
