import { cn } from "@/utils/cn";
import React from "react";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
  /** Eyebrow text colour override (Tailwind class). Defaults to text-accent */
  eyebrowClassName?: string;
  /** Title text colour override (Tailwind class). Defaults to text-primary */
  titleClassName?: string;
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
  className,
  eyebrowClassName,
  titleClassName,
}) => {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {eyebrow && (
        <p
          className={cn(
            "text-xs font-semibold tracking-widest uppercase",
            eyebrowClassName ?? "text-accent",
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          "text-3xl md:text-4xl font-semibold",
          titleClassName ?? "text-primary",
        )}
      >
        {title}
      </h2>
      {description && (
        <p className="text-body-sm text-secondary">
          {description}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;
