"use client";

import React from "react";
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
  return (
    <div>
      <OrganizationJsonLd />
      <HeroSection
        motto={cms.hero?.motto}
        ctaLabel={cms.hero?.ctaLabel}
        ctaUrl={cms.hero?.ctaUrl}
      />
      <SquareTransition
        background={
          registrationOpen
            ? <RegistrationSection cms={cms.registration} />
            : <RegistrationClosedSection cms={cms.registrationClosed} />
        }
      />
      <AboutUsSection cms={cms.about} />
      <LazySection minHeight="600px">
        <LatestArticleSection articles={latestArticles} />
      </LazySection>
      <div className="bg-white h-24 -mb-24 md:h-32 md:-mb-32" aria-hidden="true" />
    </div>
  );
};

export default HomePage;
