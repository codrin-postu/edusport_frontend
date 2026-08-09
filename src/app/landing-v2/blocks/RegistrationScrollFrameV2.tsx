"use client";

import React, { useRef } from "react";
import RegistrationWaveDivider from "./RegistrationWaveDivider";
import RegistrationPinwheelGrid from "./RegistrationPinwheelGrid";

/**
 * Registration frame: pastel background with the wave-divider seam into the
 * hero and the 70s pinwheel grid that zooms in on scroll.
 */

interface RegistrationScrollFrameV2Props {
  children: React.ReactNode;
}

export const RegistrationScrollFrameV2: React.FC<RegistrationScrollFrameV2Props> = ({
  children,
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={sectionRef}
      className="relative min-h-screen md:[min-height:min(90vh,860px)] flex flex-col justify-start md:justify-center pt-20 pb-16 md:pb-24 bg-pastel overflow-x-clip"
    >
      {/* Wave divider — crisp-left → defocused-right seam bleeding up into the hero. */}
      <RegistrationWaveDivider />

      {/* 70s scallop / pinwheel grid — transparent, zooms in on scroll. */}
      <RegistrationPinwheelGrid />

      {children}
    </div>
  );
};

export default RegistrationScrollFrameV2;
