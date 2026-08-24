import React from "react";

/**
 * Retro 4-colour warm stripe (rust → orange → mustard → burgundy). Shared by
 * the footer register band, the event card, and the mobile menu panel so the
 * markup lives in one place.
 */
export const WarmStripe: React.FC<{ className?: string }> = ({ className = "h-1.5" }) => (
  <div className={`flex w-full ${className}`} aria-hidden>
    <span className="flex-1 bg-rust" />
    <span className="flex-1 bg-orange" />
    <span className="flex-1 bg-mustard" />
    <span className="flex-1 bg-burgundy" />
  </div>
);

export default WarmStripe;
