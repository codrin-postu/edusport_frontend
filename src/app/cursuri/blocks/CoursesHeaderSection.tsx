import { cn } from "@/utils/cn";
import React from "react";

interface CoursesHeaderSectionProps {
  currentSeason: string;
  isRegistrationOpen: boolean;
}

const CoursesHeaderSection: React.FC<CoursesHeaderSectionProps> = ({
  currentSeason,
  isRegistrationOpen,
}) => {
  return (
    <section className={cn("section", "bg-edusport-blue")}>
      <div
        className={cn(
          "w-full",
          "max-w-content",
          "mx-auto",
          "gutter",
        )}
      >
        <div
          className={cn("max-w-content", "mx-auto", "text-center", "text-primary-on-dark")}
        >
          <h1
            className={cn(
              "text-4xl",
              "md:text-5xl",
              "font-bold",
              "mb-4",
              "font-display",
            )}
          >
            Cursurile Noastre
          </h1>
          <p className={cn("text-xl", "mb-6", "text-primary-on-dark")}>
            Sezonul {currentSeason}
          </p>
          <div
            className={cn(
              "inline-flex",
              "items-center",
              "px-4",
              "py-2",
              "rounded-full",
              isRegistrationOpen ? "bg-green-500" : "bg-red-500",
              "text-primary-on-dark",
              "font-semibold",
            )}
          >
            {isRegistrationOpen
              ? "✓ Înscrieri Deschise"
              : "✗ Înscrieri Închise"}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoursesHeaderSection;
