import { cn } from "@/utils/cn";
import { CoursesBannerSection } from "./blocks";
import dynamic from "next/dynamic";
import React from "react";

const AboutSection = dynamic(() => import("./blocks/AboutSection"), { ssr: true });
const PricingSection = dynamic(() => import("./blocks/PricingSection"), { ssr: true });
const InfoSection = dynamic(() => import("./blocks/InfoSection"), { ssr: true });

const CoursesPage: React.FC = () => {
  const currentSeason = "Octombrie 2025 - Mai 2026";
  const isRegistrationOpen = true;

  const pricingData = [
    {
      title: "Pentru Membri",
      priceItems: [
        { label: "Abonament 6 ședințe grup", price: "520 RON" },
        { label: "Abonament 8 ședințe grup", price: "590 RON" },
      ],
      bottomItem: {
        label: "Taxa de membru (o dată/sezon)",
        price: "250 RON",
      },
    },
    {
      title: "Pentru Non-membri",
      priceItems: [
        { label: "1 ședință grup", price: "150 RON" },
        { label: "Abonament 6 ședințe grup", price: "720 RON" },
        { label: "Abonament 8 ședințe grup", price: "790 RON" },
      ],
    },
  ];

  return (
    <div className={cn("min-h-screen", "bg-white")}>
      <CoursesBannerSection
        currentSeason={currentSeason}
        isRegistrationOpen={isRegistrationOpen}
      />

      <div className="relative z-10 bg-white">
        <AboutSection />

        {/* Wave: white → gray-50 */}
        <div className="relative -mt-px overflow-hidden leading-none bg-gray-50">
          <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="block w-full h-16 md:h-20" style={{ fill: "white" }}>
            <path d="M0,40 C480,0 960,80 1440,40 L1440,0 L0,0 Z" />
          </svg>
        </div>

        <PricingSection pricingData={pricingData} />
        <InfoSection />
      </div>
    </div>
  );
};

export default CoursesPage;
