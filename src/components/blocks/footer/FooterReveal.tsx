"use client";

import React, { useEffect, useRef, useState } from "react";
import Footer from "./Footer";

const DESKTOP_BREAKPOINT = 1024; // lg

const FooterReveal: React.FC = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkBreakpoint = () => {
      setIsDesktop(window.innerWidth >= DESKTOP_BREAKPOINT);
    };

    checkBreakpoint();
    window.addEventListener("resize", checkBreakpoint);
    return () => window.removeEventListener("resize", checkBreakpoint);
  }, []);

  useEffect(() => {
    if (!isDesktop) {
      document.documentElement.style.setProperty("--footer-height", "0px");
      return;
    }

    const updateFooterHeight = () => {
      if (wrapperRef.current) {
        const height = wrapperRef.current.offsetHeight;
        document.documentElement.style.setProperty(
          "--footer-height",
          `${height}px`,
        );
      }
    };

    updateFooterHeight();

    const observer = new ResizeObserver(updateFooterHeight);
    if (wrapperRef.current) {
      observer.observe(wrapperRef.current);
    }

    return () => observer.disconnect();
  }, [isDesktop]);

  return (
    <div
      ref={wrapperRef}
      className={isDesktop ? "fixed bottom-0 left-0 right-0 z-0" : "relative"}
    >
      <Footer />
    </div>
  );
};

export default FooterReveal;
