import { cn } from "@/utils/cn";
import React from "react";

interface SectionHeaderProps {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** heading (default): text-heading. display: text-display, for hero-scale sections. */
  size?: "heading" | "display";
  /** Heading element. Defaults to h2. */
  as?: "h1" | "h2" | "h3";
  /** The header sits on a dark (navy) surface. */
  onDark?: boolean;
  /** left (default) or centered text. */
  align?: "left" | "center";
  /** Rendered to the right of the title on sm+, below it on mobile. */
  action?: React.ReactNode;
  className?: string;
  titleId?: string;
}

/**
 * Reusable eyebrow + heading block used across most page sections.
 *
 * Usage:
 *   <SectionHeader eyebrow="Tarife" title="Prețuri cursuri grup" />
 */
const SectionHeader: React.FC<SectionHeaderProps> = ({
  eyebrow,
  title,
  description,
  size = "heading",
  as: Tag = "h2",
  onDark = false,
  align = "left",
  action,
  className,
  titleId,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        align === "center" && "items-center text-center sm:items-center sm:text-center",
        className,
      )}
    >
      <div className={cn("flex flex-col", align === "center" && "items-center")}>
        <div className={cn("flex flex-col gap-2", align === "center" && "items-center")}>
          {eyebrow && (
            <p className={cn("text-label", onDark ? "text-accent-on-dark" : "text-accent")}>
              {eyebrow}
            </p>
          )}
          <Tag
            id={titleId}
            className={cn(
              size === "display" ? "text-display" : "text-heading",
              onDark ? "text-primary-on-dark" : "text-primary",
            )}
          >
            {title}
          </Tag>
        </div>
        {description && (
          <p
            className={cn(
              "mt-3 text-body-sm",
              onDark ? "text-secondary-on-dark" : "text-secondary",
            )}
          >
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};

export default SectionHeader;
export { SectionHeader };
