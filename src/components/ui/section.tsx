import { cn } from "@/utils/cn";
import React from "react";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  as?: React.ElementType;
  id?: string;
}

/**
 * Standard page section wrapper.
 * Provides the full-width <section> + centered max-width container.
 *
 * Usage:
 *   <Section className="py-20 bg-gray-50">
 *     …content…
 *   </Section>
 *
 * Use `innerClassName` to customise the inner div (e.g. add a max-width cap).
 */
const Section: React.FC<SectionProps> = ({
  children,
  className,
  innerClassName,
  as: Tag = "section",
  id,
}) => {
  return (
    <Tag id={id} className={className}>
      <div
        className={cn(
          "w-full max-w-content mx-auto px-4 md:px-8 lg:px-12",
          innerClassName,
        )}
      >
        {children}
      </div>
    </Tag>
  );
};

export default Section;
