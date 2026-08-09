"use client";

import React, { useEffect } from "react";
import Footer from "./Footer";
import type { SiteContactInfo } from "./Footer";

/**
 * The site now uses the retro footer everywhere, rendered in normal document
 * flow (the old desktop fixed scroll-reveal effect is retired). Kept as a thin
 * wrapper so the layout import is unchanged.
 */
interface FooterRevealProps {
  contactInfo?: SiteContactInfo;
  registrationOpen?: boolean;
}

const FooterReveal: React.FC<FooterRevealProps> = ({ contactInfo, registrationOpen }) => {
  useEffect(() => {
    // No fixed footer any more → no reserved space under <main>.
    document.documentElement.style.setProperty("--footer-height", "0px");
  }, []);

  return (
    <div className="relative">
      <Footer contactInfo={contactInfo} retro registrationOpen={registrationOpen} />
    </div>
  );
};

export default FooterReveal;
