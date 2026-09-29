import Link from "@/components/ui/link";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import React from "react";
import { BoldTextStripClient } from "./_animations";
import type { HomepageRegistrationClosed } from "../_types";

/* ------------------------------------------------------------------ */
/* Main section                                                        */
/* ------------------------------------------------------------------ */

interface RegistrationClosedSectionProps {
  cms?: HomepageRegistrationClosed | null;
  /** Canonical season from site-settings.registration.currentSeason (e.g. "2025-2026"). */
  season?: string;
}

const RegistrationClosedSection: React.FC<RegistrationClosedSectionProps> = ({ cms, season }) => {
  const seasonLabel = season ? `Sezonul ${season}` : "Sezonul curent";
  const heading = cms?.heading ?? "Ne vedem în următorul sezon!";
  const body = cms?.body ?? "Înscrierile pentru sezonul curent sunt închise. Urmărește-ne pentru vești despre sezonul următor - anunțurile despre deschiderea înscrierilor apar primele pe canalul nostru de WhatsApp și pe rețelele sociale.";
  const whatsappLabel = cms?.whatsappLabel ?? "Alătură-te pe WhatsApp";
  const whatsappUrl = cms?.whatsappUrl ?? "https://whatsapp.com/channel/placeholder";
  const contactLabel = cms?.contactLabel ?? "Contactează-ne";
  const contactUrl = cms?.contactUrl ?? "/contact";

  return (
    <div
      className="relative h-full flex flex-col justify-start md:justify-center pt-24 pb-8"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.18 0.04 264) 0%, oklch(0.28 0.06 264) 60%, oklch(0.32 0.05 240) 100%)",
      }}
    >
          {/* Ghost branding text - right side */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 pr-2 hidden md:flex">
            <BoldTextStripClient />
          </div>

          <div className="w-full max-w-content mx-auto gutter">
            <div className="relative flex flex-col gap-8 max-w-2xl">
              {/* Label + status pill */}
              <div className="flex items-center gap-3">
                <p className="text-label uppercase text-accent-on-dark">
                  {seasonLabel}
                </p>
                <span className="text-caption inline-flex items-center gap-2 px-3 py-1 bg-surface-subtle-on-dark border border-line-subtle-on-dark text-secondary-on-dark">
                  <span className="w-1.5 h-1.5 bg-line-subtle-on-dark" />
                  Înscrieri închise
                </span>
              </div>

              {/* Heading + summary */}
              <div className="flex flex-col gap-4">
                <h2 className="text-display text-primary-on-dark">
                  {heading}
                </h2>
                <p className="text-body text-secondary-on-dark">
                  {body}
                </p>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 sm:items-start">
                <Button
                  variant="secondary"
                  onDark
                  href={whatsappUrl}
                  external
                  className="w-full sm:w-auto"
                >
                  <Icon name="whatsapp" />
                  {whatsappLabel}
                </Button>
                <Button variant="secondary" onDark href={contactUrl} className="w-full sm:w-auto">
                  {contactLabel}
                </Button>
              </div>

              {/* Contact link */}
              <Link
                href={contactUrl}
                tone="default"
                onDark
                className="text-body-sm inline-flex items-center gap-1 w-fit"
              >
                Mai multe informații
                <Icon name="arrow-up-right" />
              </Link>
            </div>
          </div>
    </div>
  );
};

export default RegistrationClosedSection;
