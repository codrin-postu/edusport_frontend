import React from "react";
import HeroSection from "./blocks/HeroSection";
import RegistrationSection from "./blocks/RegistrationSection";
import AboutUsSection from "./blocks/AboutUsSection";
import LatestArticleSection from "./blocks/LatestArticleSection";

const HomePage: React.FC = () => {
  return (
    <div>
      <HeroSection />
      <RegistrationSection />
      <AboutUsSection />
      <LatestArticleSection />
    </div>
  );
};

export default HomePage;
