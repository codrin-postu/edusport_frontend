"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import HeroSection from "./blocks/HeroSection";
import LazySection from "./LazySection";
import type { HomepageCms } from "./_types";

const SquareTransition = dynamic(
  () => import("./blocks/SquareTransition"),
  { ssr: true },
);
const AboutUsSection = dynamic(() => import("./blocks/AboutUsSection"), {
  ssr: true,
});

interface HomePageProps {
  registrationOpen?: boolean;
  cms?: HomepageCms;
  registrationSlot?: React.ReactNode;
  registrationClosedSlot?: React.ReactNode;
  latestArticlesSlot?: React.ReactNode;
}

const HomePage: React.FC<HomePageProps> = ({
  registrationOpen = true,
  cms = {},
  registrationSlot,
  registrationClosedSlot,
  latestArticlesSlot,
}) => {
  // Driven by SquareTransition's post-wipe scroll phase (0→1 over 2 viewports).
  // Passed into AboutUsSection to switch panels 0→1→2 without a separate scroll section.
  const [aboutScrollProgress, setAboutScrollProgress] = useState(0);

  return (
    <div>
      <HeroSection
        motto={cms.hero?.motto}
        ctaLabel={cms.hero?.ctaLabel}
        ctaUrl={cms.hero?.ctaUrl}
      />
      {/*
        childScrollBudget={2} adds 2 viewport-heights of scroll after the wipe
        so the user can advance through About Us panels 0→1→2 while still inside
        SquareTransition's sticky viewport. No separate sticky section needed.
      */}
      <SquareTransition
        background={registrationOpen ? registrationSlot : registrationClosedSlot}
        childScrollBudget={2}
        onChildScrollProgress={setAboutScrollProgress}
      >
        <AboutUsSection
          scrollProgress={aboutScrollProgress}
          panels={cms.about?.panels ?? null}
          notebook={cms.about?.notebook ?? null}
        />
      </SquareTransition>
      <LazySection minHeight="600px">
        {latestArticlesSlot}
      </LazySection>
      <div className="bg-white h-24 -mb-24 md:h-32 md:-mb-32" aria-hidden="true" />
    </div>
  );
};

export default HomePage;
