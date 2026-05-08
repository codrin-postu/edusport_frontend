import Link from "@/components/ui/link";
import SpotlightButton from "@/components/ui/spotlight-button";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Calendar, Clock, MapPin } from "lucide-react";
import React from "react";
import { RegistrationScrollFrame } from "./_animations";
import type { HomepageRegistration } from "../_types";

/* ------------------------------------------------------------------ */
/* Main section                                                        */
/* ------------------------------------------------------------------ */

interface RegistrationSectionProps {
  cms?: HomepageRegistration | null;
}

const RegistrationSection: React.FC<RegistrationSectionProps> = ({ cms }) => {
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
    <RegistrationScrollFrame>
      <div className="w-full max-w-content mx-auto px-4 md:px-8 lg:px-12">
        <div className="relative flex flex-col gap-8 max-w-2xl">
          {/* Label */}
          <div className="flex items-center gap-3">
            <p className="text-xs font-semibold tracking-widest uppercase text-white/60">
              {seasonLabel}
            </p>
          </div>

          {/* Heading + summary */}
          <div className="flex flex-col gap-4">
            <h2 className="text-4xl md:text-5xl font-semibold text-white leading-tight">
              {heading}
            </h2>
            <p className="text-white text-lg font-light leading-relaxed">
              {body}
            </p>
            {bodySecondary && (
              <p className="text-white text-lg font-light leading-relaxed">
                {bodySecondary}
              </p>
            )}
          </div>

          {/* Schedule strip */}
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-white/80 text-sm font-light">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 shrink-0" />
              {scheduleDays}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 shrink-0" />
              {scheduleTimes}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 shrink-0" />
              {locationName}
            </span>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 sm:items-start">
            <Link href={ctaPrimaryUrl} className="w-full sm:w-auto">
              <SpotlightButton
                variant="white"
                hoverColor="oklch(0.25 0.12 264)"
                hoverTextColor="white"
                className="w-full sm:w-auto px-10 py-4 text-base font-semibold rounded-full"
              >
                {ctaPrimaryLabel}
              </SpotlightButton>
            </Link>
            <Button
              variant="outline"
              className="w-full sm:w-auto px-8 py-4 h-auto text-base font-medium rounded-full !bg-transparent text-white border-white hover:!bg-white hover:text-black"
              asChild
            >
              <Link href={ctaSecondaryUrl}>{ctaSecondaryLabel}</Link>
            </Button>
          </div>

          {/* Prices link */}
          <Link
            href={pricesLinkUrl}
            className="group relative inline-flex items-center gap-1 text-sm text-white/60 hover:text-white transition-colors after:absolute after:left-0 after:bottom-0 after:h-px after:w-full after:bg-current after:scale-x-0 after:origin-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-left w-fit"
          >
            {pricesLinkLabel}
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </RegistrationScrollFrame>
  );
};

export default RegistrationSection;
