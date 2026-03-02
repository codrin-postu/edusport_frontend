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
    <section className={cn("py-16", "bg-edusport-blue")}>
      <div
        className={cn(
          "w-full",
          "max-w-content",
          "mx-auto",
          "px-4",
          "md:px-8",
          "lg:px-12",
        )}
      >
        <div
          className={cn("max-w-4xl", "mx-auto", "text-center", "text-white")}
        >
          <h1
            className={cn(
              "text-4xl",
              "md:text-5xl",
              "font-bold",
              "mb-4",
              "font-['League_Spartan']",
            )}
          >
            Cursurile Noastre
          </h1>
          <p className={cn("text-xl", "mb-6", "text-white/90")}>
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
              "text-white",
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
