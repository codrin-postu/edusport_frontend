import Link from "@/components/ui/link";
import Button from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import React from "react";
import { RegistrationScrollFrameV2 } from "./RegistrationScrollFrameV2";
import type { HomepageRegistration } from "../_types";
import { ENROL_CTA } from "@/lib/cta";

/**
 * Registration panel (season-open): season label, heading, body, schedule, the
 * layers primary CTA + ghost secondary, and the prices link. Wrapped by
 * `RegistrationScrollFrameV2` for the pastel frame + pinwheel.
 */

interface RegistrationSectionV2Props {
  cms?: HomepageRegistration | null;
  /** Canonical season from site-settings.registration.currentSeason. */
  season?: string;
}

const RegistrationSectionV2: React.FC<RegistrationSectionV2Props> = ({ cms, season }) => {
  // Same source as the closed variant, so the two branches cannot disagree.
  const seasonLabel = season ? `Sezonul ${season}` : "Sezonul curent";
  const heading = cms?.heading ?? "Sezonul a început!";
  const body = cms?.body ?? "Visezi să aluneci grațios pe gheață? La Școala de Patinaj EduSport te așteptăm într-un mediu prietenos și plin de energie, indiferent dacă ești la primii pași sau vrei să îți perfecționezi tehnica.";
  const bodySecondary = cms?.bodySecondary ?? "Cursurile sunt deschise pentru toate nivelurile - începători, intermediari și avansați - cu antrenori foști sportivi de performanță. Ne vedem sâmbăta și duminica, 4 octombrie 2025, la patinoarul Cotroceni On Ice din AFI Cotroceni.";
  const scheduleDays = cms?.scheduleDays ?? "Sâmbătă & Duminică";
  const scheduleTimes = cms?.scheduleTimes ?? "10:00–10:50 & 11:00–11:50";
  const locationName = cms?.locationName ?? "AFI Cotroceni";
  const locationHref = cms?.locationHref ?? undefined;
  const ctaPrimaryLabel = cms?.ctaPrimaryLabel ?? ENROL_CTA;
  const ctaPrimaryUrl = cms?.ctaPrimaryUrl ?? "/inscrieri";
  const ctaSecondaryLabel = cms?.ctaSecondaryLabel ?? "Află mai mult";
  const ctaSecondaryUrl = cms?.ctaSecondaryUrl ?? "/cursuri";
  const pricesLinkLabel = cms?.pricesLinkLabel ?? "Vezi prețurile";
  const pricesLinkUrl = cms?.pricesLinkUrl ?? "/cursuri#preturi";

  return (
    <RegistrationScrollFrameV2>
      <div className="w-full max-w-content mx-auto gutter">
        <div className="relative z-raised flex flex-col gap-8 max-w-2xl md:max-w-[52%]">
          <p className="text-label uppercase text-primary">
            {seasonLabel}
          </p>

          <div className="flex flex-col gap-4">
            <h2 className="text-display text-primary">
              {heading}
            </h2>
            <p className="text-body text-primary">
              {body}
            </p>
            {bodySecondary && (
              <p className="text-body text-primary">
                {bodySecondary}
              </p>
            )}
          </div>

          <div className="text-body-sm flex flex-wrap items-center text-primary">
            <span className="flex items-center gap-2 pr-4 mr-4 border-r-retro border-primary">
              <Icon name="calendar" />
              {scheduleDays}
            </span>
            <span className="flex items-center gap-2 pr-4 mr-4 border-r-retro border-primary">
              <Icon name="clock" />
              {scheduleTimes}
            </span>
            <span className="flex items-center gap-2">
              <Icon name="map-pin" />
              {locationHref ? (
                <Link href={locationHref} tone="quiet" external>
                  {locationName}
                </Link>
              ) : (
                locationName
              )}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
            <Button
              face="black"
              href={ctaPrimaryUrl}
              umamiEvent="enroll.cta_primary"
            >
              {ctaPrimaryLabel}
            </Button>
            <Button variant="secondary" href={ctaSecondaryUrl} umamiEvent="enroll.cta_secondary">
              {ctaSecondaryLabel}
            </Button>
          </div>

          <Link
            href={pricesLinkUrl}
            data-umami-event="enroll.prices"
            className="text-body-sm w-fit"
          >
            {pricesLinkLabel}
          </Link>
        </div>
      </div>
    </RegistrationScrollFrameV2>
  );
};

export default RegistrationSectionV2;
