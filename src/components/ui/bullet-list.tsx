import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

interface BulletListProps {
  items: ReactNode[];
  /** The list sits on a dark (navy) surface. */
  onDark?: boolean;
  className?: string;
}

/**
 * A "›" bullet list (tips, disclaimers, "Predă la" groups). Text is always
 * text-body-sm; only the surrounding className controls item spacing.
 */
export default function BulletList({ items, onDark = false, className }: BulletListProps) {
  return (
    <ul className={cn("flex flex-col gap-3", className)}>
      {items.map((item, index) => (
        <li
          key={index}
          className={cn(
            "text-body-sm flex gap-3",
            onDark ? "text-primary-on-dark" : "text-secondary",
          )}
        >
          <span aria-hidden className={cn("shrink-0 font-extrabold", onDark ? "text-accent-on-dark" : "text-accent")}>
            ›
          </span>
          {item}
        </li>
      ))}
    </ul>
  );
}

export { BulletList };

/**
 * Class recipe for the same "›" bullet look on CMS rich-text markup, where a
 * <ul>/<li> comes straight from Strapi and cannot use the BulletList component.
 * Apply to an ancestor of the rendered markup (targets any descendant
 * ul/li), or directly on a <ul> (only the [&_li] part then applies to it).
 */
export const bulletListProse =
  "[&_ul]:flex [&_ul]:flex-col [&_ul]:gap-2 [&_li]:relative [&_li]:pl-6 [&_li]:before:absolute [&_li]:before:left-0.5 [&_li]:before:content-['›'] [&_li]:before:font-extrabold [&_li]:before:text-accent";
