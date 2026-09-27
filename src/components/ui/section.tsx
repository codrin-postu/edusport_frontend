import { cn } from "@/utils/cn";
import React from "react";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  id?: string;
}

/**
 * Standard page section wrapper.
 * Provides the full-width <section> + centered max-width container.
 *
 * Usage:
 *   <Section className="py-20 bg-surface-subtle">
 *     …content…
 *   </Section>
 *
 * Use `innerClassName` to customise the inner div (e.g. add a max-width cap).
 */
const Section: React.FC<SectionProps> = ({
  children,
  className,
  innerClassName,
  id,
}) => {
  return (
    <section id={id} className={className}>
      <div
        className={cn(
          "w-full max-w-content mx-auto gutter",
          innerClassName,
        )}
      >
        {children}
      </div>
    </section>
  );
};

export default Section;
