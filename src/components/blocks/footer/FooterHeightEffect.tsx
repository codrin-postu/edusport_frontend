"use client";

import { useEffect } from "react";

/**
 * The site uses the retro footer everywhere, rendered in normal document
 * flow (the old desktop fixed scroll-reveal effect is retired), so nothing
 * reserves space under <main> any more. This is the only client-side bit
 * Footer needs, kept as its own tiny component so Footer itself stays a
 * server component.
 */
const FooterHeightEffect: React.FC = () => {
  useEffect(() => {
    document.documentElement.style.setProperty("--footer-height", "0px");
  }, []);

  return null;
};

export default FooterHeightEffect;
