import { cn } from "@/utils/cn";
import React from "react";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
  /** Eyebrow text colour override (Tailwind class). Defaults to text-edusport-blue/60 */
  eyebrowClassName?: string;
  /** Title text colour override (Tailwind class). Defaults to text-gray-900 */
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
            eyebrowClassName ?? "text-edusport-blue/60",
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          "text-3xl md:text-4xl font-semibold",
          titleClassName ?? "text-gray-900",
        )}
      >
        {title}
      </h2>
      {description && (
        <p className="text-sm text-gray-500 font-light leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;
