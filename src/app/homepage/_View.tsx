import React from "react";
import dynamic from "next/dynamic";
import HeroSection from "./blocks/HeroSection";
import LazySection from "./LazySection";
// import StickyVideoSection from "./blocks/StickyVideoSection";
// Eagerly import motion/react so its chunk is bundled with the hero rather than
// deferred alongside the lazy below-fold sections (AboutUsSection also uses it).
import "motion/react";

const RegistrationSection = dynamic(
  () => import("./blocks/RegistrationSection"),
  { ssr: true },
);
const AboutUsSection = dynamic(() => import("./blocks/AboutUsSection"), {
  ssr: true,
});
const LatestArticleSection = dynamic(
  () => import("./blocks/LatestArticleSection"),
  { ssr: true },
);

const HomePage: React.FC = () => {
  return (
    <div>
      <HeroSection />
      <RegistrationSection />
      {/* <RegistrationClosedSection /> */}
      <LazySection rootMargin="400px">
        <AboutUsSection />
      </LazySection>
      {/* Video fades in as its own sticky section, AboutUs naturally sits above */}
      {/* <StickyVideoSection /> */}
      <LatestArticleSection />
    </div>
  );
};

export default HomePage;
