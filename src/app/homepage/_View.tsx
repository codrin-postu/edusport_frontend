"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { OrganizationJsonLd } from "@/components/JsonLd";
import HeroSection from "./blocks/HeroSection";
import LazySection from "./LazySection";
import type { HomepageCms } from "./_types";
import type { LatestArticleData } from "./blocks/LatestArticleSection";

const RegistrationSection = dynamic(
  () => import("./blocks/RegistrationSection"),
  { ssr: true },
);
const RegistrationClosedSection = dynamic(
  () => import("./blocks/RegistrationClosedSection"),
  { ssr: true },
);
const SquareTransition = dynamic(
  () => import("./blocks/SquareTransition"),
  { ssr: true },
);
const AboutUsSection = dynamic(() => import("./blocks/AboutUsSection"), {
  ssr: true,
});
const LatestArticleSection = dynamic(
  () => import("./blocks/LatestArticleSection"),
  { ssr: true },
);

interface HomePageProps {
  registrationOpen?: boolean;
  cms?: HomepageCms;
  latestArticles?: LatestArticleData[];
}

const HomePage: React.FC<HomePageProps> = ({ registrationOpen = true, cms = {}, latestArticles }) => {
  // Driven by SquareTransition's post-wipe scroll phase (0→1 over 2 viewports).
  // Passed into AboutUsSection to switch panels 0→1→2 without a separate scroll section.
  const [aboutScrollProgress, setAboutScrollProgress] = useState(0);

  return (
    <div>
      <OrganizationJsonLd />
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
        background={
          registrationOpen
            ? <RegistrationSection cms={cms.registration} />
            : <RegistrationClosedSection cms={cms.registrationClosed} />
        }
        childScrollBudget={2}
        onChildScrollProgress={setAboutScrollProgress}
      >
        <AboutUsSection scrollProgress={aboutScrollProgress} />
      </SquareTransition>
      <LazySection minHeight="600px">
        <LatestArticleSection articles={latestArticles} />
      </LazySection>
      <div className="bg-white h-24 -mb-24 md:h-32 md:-mb-32" aria-hidden="true" />
    </div>
  );
};

export default HomePage;
