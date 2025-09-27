import Link from "@/components/ui/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import Image from "next/image";
import heroBackground from "/public/images/hero-section-background.png";
import React from "react";

const HeroSection: React.FC = () => {
  return (
    <section
      className={cn(
        "relative",
        "max-h-[500px]",
        "md:max-h-[600px]",
        "lg:max-h-[760px]",
        "flex",
        "items-start",
        "justify-start",
      )}
    >
      <Image
        src={heroBackground}
        alt="Hero section background"
        fill
        className={cn("object-cover", "object-top")}
        priority
      />
      {/* Mobile/Tablet Overlay */}
      <div
        className={cn("absolute", "inset-0", "bg-white/30", "md:hidden")}
      ></div>

      {/* Desktop Gradient Overlay */}
      <div
        className={cn(
          "absolute",
          "inset-0",
          "bg-gradient-to-r",
          "from-white",
          "via-white/30",
          "via-20%",
          "to-transparent",
          "hidden",
          "md:block",
        )}
      ></div>

      {/* Content Container */}
      <div
        className={cn(
          "relative",
          "w-full",
          "max-w-content",
          "mx-auto",
          "px-4",
          "md:px-8",
          "lg:px-12",
        )}
      >
        {/* Content */}
        <div
          className={cn(
            "text-center",
            "md:text-left",
            "text-edusport-navy",
            "max-w-4xl",
            "md:max-w-[50%]",
            "pt-16",
            "pb-16",
            "md:pt-24",
            "md:pb-24",
            "lg:pt-48",
            "lg:pb-48",
          )}
        >
          <h1
            className={cn(
              "mb-4",
              "md:mb-6",
              "italic",
              "leading-none",
              "text-3xl",
              "md:text-5xl",
              "lg:text-6xl",
              "xl:text-7xl",
              "font-semibold",
              "text-edusport-navy",
            )}
          >
            Clubul Sportiv de Patinaj EduSport
          </h1>
          <p
            className={cn(
              "text-base",
              "md:text-lg",
              "lg:text-xl",
              "xl:text-2xl",
              "mb-6",
              "md:mb-8",
              "max-w-xl",
              "md:max-w-2xl",
              "text-edusport-navy",
              "mx-auto",
              "md:mx-0",
            )}
          >
            Școala de patinaj artistic care transformă pasiunea în performanță.
            Alătură-te comunității noastre și descoperă magia patinajului!
          </p>
          <Button
            asChild
            className={cn(
              "bg-edusport-blue",
              "text-white",
              "px-6",
              "md:px-8",
              "py-3",
              "md:py-4",
              "rounded-lg",
              "text-base",
              "md:text-lg",
              "font-semibold",
              "hover:bg-edusport-blue/90",
              "transition-colors",
            )}
          >
            <Link href="/courses">Descoperă Cursurile</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
