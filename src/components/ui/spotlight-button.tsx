"use client";

import React, { useState } from "react";

type ButtonVariant = "black" | "white" | "outline" | "outline-white";

/** Face colour for the retro `layers` CTA. */
type LayersFace = "black" | "white" | "cream";

interface SpotlightButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  /** Colour of the fill that sweeps in on hover. */
  hoverColor?: string;
  /** Optional label colour while hovered (for contrast over the fill). */
  hoverTextColor?: string;
  /** Deprecated/ignored — kept for backwards compatibility with callers. */
  animationDuration?: number;
  className?: string;
  onClick?: () => void;
  /**
   * Retro landing-v2 CTA mode: a square button with two offset layers
   * (mustard + rust) that fan to the bottom-right on hover with a spring
   * overshoot, and a face that snap-pops onto the stack on click.
   */
  layers?: boolean;
  /** Face colour for `layers` mode (default "black"). */
  layersFace?: LayersFace;
  /** Render as an anchor when provided. */
  href?: string;
  external?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  black: "bg-black text-white",
  white: "bg-white text-black",
  outline: "bg-transparent text-black border border-black",
  "outline-white": "bg-transparent text-white border border-white",
};

// Duration of the sweep fill, matching the reference pen.
const SWEEP_DURATION = "0.3s";

const layersFaceStyles: Record<LayersFace, string> = {
  black: "bg-black text-white",
  white: "bg-white text-navy",
  cream: "bg-retro-cream text-navy",
};

/**
 * Retro layers CTA (landing-v2). Square face with mustard (`l1`) + rust
 * (`l2`) duplicates stacked behind it. On hover the layers translate out to
 * 4px / 8px with a spring-overshoot easing; on click the face snaps 4px onto
 * the stack (steps, no interpolation) — the "snap-pop". Reduced-motion off.
 */
const LayersButton: React.FC<{
  children: React.ReactNode;
  face: LayersFace;
  className: string;
  onClick?: () => void;
  href?: string;
  external?: boolean;
}> = ({ children, face, className, onClick, href, external }) => {
  // Layer offset + easing live in `.lcta` CSS (globals.css) so the spring
  // overshoot + snap-pop compile reliably; only face colour/typography here.
  const inner = (
    <>
      <span aria-hidden className="lcta-layer lcta-l1" />
      <span aria-hidden className="lcta-layer lcta-l2" />
      <span
        className={`lcta-face px-8 py-3.5 font-bold uppercase tracking-[0.03em] ${layersFaceStyles[face]}`}
      >
        {children}
      </span>
    </>
  );

  const wrapperClass = `lcta select-none ${className}`;

  if (href) {
    return (
      <a
        href={href}
        onClick={onClick}
        className={wrapperClass}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {inner}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={wrapperClass}>
      {inner}
    </button>
  );
};

/**
 * Pill button with a "sweep" hover: a `hoverColor` fill grows from the left
 * (width 0% → 100%) over 0.3s while the label stays put. Based on
 * https://codepen.io/alticreation/pen/zBZwOP.
 *
 * (Named SpotlightButton for historical reasons / import stability.)
 *
 * When `layers` is set, renders the retro landing-v2 layers CTA instead.
 */
const SpotlightButton: React.FC<SpotlightButtonProps> = ({
  children,
  variant = "black",
  hoverColor = "var(--color-edusport-blue)",
  hoverTextColor,
  className = "",
  onClick,
  layers = false,
  layersFace = "black",
  href,
  external,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  if (layers) {
    return (
      <LayersButton
        face={layersFace}
        className={className}
        onClick={onClick}
        href={href}
        external={external}
      >
        {children}
      </LayersButton>
    );
  }

  return (
    <button
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className={`relative overflow-hidden px-6 py-3 rounded-full font-normal outline-none active:ring-2 active:ring-offset-2 active:ring-current ${variantStyles[variant]} ${className}`}
    >
      {/* Fill that grows from the left on hover. */}
      <span
        aria-hidden
        className="absolute inset-y-0 left-0 rounded-full pointer-events-none"
        style={{
          backgroundColor: hoverColor,
          width: isHovered ? "100%" : "0%",
          transition: `width ${SWEEP_DURATION} ease`,
        }}
      />
      <span
        className="relative z-10 transition-colors duration-300"
        style={
          hoverTextColor
            ? { color: isHovered ? hoverTextColor : undefined }
            : undefined
        }
      >
        {children}
      </span>
    </button>
  );
};

export default SpotlightButton;
