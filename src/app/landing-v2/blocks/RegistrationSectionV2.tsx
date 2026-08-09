import Link from "@/components/ui/link";
import SpotlightButton from "@/components/ui/spotlight-button";
import { Calendar, Clock, MapPin } from "lucide-react";
import React from "react";
import { RegistrationScrollFrameV2 } from "./RegistrationScrollFrameV2";
import type { HomepageRegistration } from "../_types";

/**
 * V2 of RegistrationSection for /landing-v2.
 *
 * Identical to the live `RegistrationSection` except it wraps with the V2 frame
 * (which renders the enlarged scroll-driven loop figure beside the panel).
 */

interface RegistrationSectionV2Props {
  cms?: HomepageRegistration | null;
}

const RegistrationSectionV2: React.FC<RegistrationSectionV2Props> = ({ cms }) => {
  const seasonLabel = cms?.seasonLabel ?? "Sezonul 2025–2026";
  const heading = cms?.heading ?? "Sezonul a început!";
  const body = cms?.body ?? "Visezi să aluneci grațios pe gheață? La Școala de Patinaj EduSport te așteptăm într-un mediu prietenos și plin de energie, indiferent dacă ești la primii pași sau vrei să îți perfecționezi tehnica.";
  const bodySecondary = cms?.bodySecondary ?? "Cursurile sunt deschise pentru toate nivelurile - începători, intermediari și avansați - cu antrenori foști sportivi de performanță. Ne vedem sâmbăta și duminica, 4 octombrie 2025, la patinoarul Cotroceni On Ice din AFI Cotroceni.";
  const scheduleDays = cms?.scheduleDays ?? "Sâmbătă & Duminică";
  const scheduleTimes = cms?.scheduleTimes ?? "10:00–10:50 & 11:00–11:50";
  const locationName = cms?.locationName ?? "AFI Cotroceni";
  const ctaPrimaryLabel = cms?.ctaPrimaryLabel ?? "Înscrie-te";
  const ctaPrimaryUrl = cms?.ctaPrimaryUrl ?? "/inscrieri";
  const ctaSecondaryLabel = cms?.ctaSecondaryLabel ?? "Află mai mult";
  const ctaSecondaryUrl = cms?.ctaSecondaryUrl ?? "/cursuri";
  const pricesLinkLabel = cms?.pricesLinkLabel ?? "Vezi prețurile";
  const pricesLinkUrl = cms?.pricesLinkUrl ?? "/cursuri#preturi";

  return (
    <RegistrationScrollFrameV2>
      <div className="w-full max-w-content mx-auto px-4 md:px-8 lg:px-12">
        <div className="relative z-10 flex flex-col gap-7 max-w-2xl md:max-w-[52%]">
          <p className="text-2xs font-bold tracking-[0.16em] uppercase text-navy">
            {seasonLabel}
          </p>

          <div className="flex flex-col gap-4">
            <h2 className="font-['League_Spartan'] text-4xl md:text-5xl font-extrabold text-navy leading-[1.05]">
              {heading}
            </h2>
            <p className="text-navy/85 text-sm md:text-base font-normal leading-relaxed">
              {body}
            </p>
            {bodySecondary && (
              <p className="text-navy/85 text-sm md:text-base font-normal leading-relaxed">
                {bodySecondary}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center text-navy text-sm font-medium">
            <span className="flex items-center gap-1.5 pr-4 mr-4 border-r-[1.5px] border-navy/25">
              <Calendar className="w-4 h-4 shrink-0" />
              {scheduleDays}
            </span>
            <span className="flex items-center gap-1.5 pr-4 mr-4 border-r-[1.5px] border-navy/25">
              <Clock className="w-4 h-4 shrink-0" />
              {scheduleTimes}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 shrink-0" />
              {locationName}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
            <SpotlightButton
              layers
              layersFace="black"
              href={ctaPrimaryUrl}
              className="text-sm"
            >
              {ctaPrimaryLabel}
            </SpotlightButton>
            <Link
              href={ctaSecondaryUrl}
              className="inline-flex items-center justify-center border-[1.5px] border-navy bg-transparent text-navy px-8 py-3.5 text-sm font-bold uppercase tracking-[0.03em] transition-colors hover:bg-black hover:text-white"
            >
              {ctaSecondaryLabel}
            </Link>
          </div>

          <Link
            href={pricesLinkUrl}
            className="relative w-fit text-sm font-semibold text-navy pb-[3px] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-rust after:transition-[width] after:duration-200 hover:after:w-full"
          >
            {pricesLinkLabel}
          </Link>
        </div>
      </div>
    </RegistrationScrollFrameV2>
  );
};

export default RegistrationSectionV2;
