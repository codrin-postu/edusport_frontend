import Link from "@/components/ui/link";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
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
      className="relative h-full flex flex-col justify-start md:justify-center pt-20 pb-8"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.18 0.04 264) 0%, oklch(0.28 0.06 264) 60%, oklch(0.32 0.05 240) 100%)",
      }}
    >
          {/* Ghost branding text - right side */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 pr-2 hidden md:flex">
            <BoldTextStripClient />
          </div>

          <div className="w-full max-w-content mx-auto px-4 md:px-8 lg:px-12">
            <div className="relative flex flex-col gap-8 max-w-2xl">
              {/* Label + status pill */}
              <div className="flex items-center gap-3">
                <p className="text-xs font-semibold tracking-widest uppercase text-white/40">
                  {seasonLabel}
                </p>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/50 text-xs font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                  Înscrieri închise
                </span>
              </div>

              {/* Heading + summary */}
              <div className="flex flex-col gap-4">
                <h2 className="text-4xl md:text-5xl font-semibold text-white leading-tight">
                  {heading}
                </h2>
                <p className="text-white/70 text-lg font-light leading-relaxed">
                  {body}
                </p>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 sm:items-start">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto px-8 py-4 h-auto text-base font-medium rounded-full !bg-transparent text-white/80 border-white/30 hover:!bg-white/10 hover:text-white hover:border-white/50"
                  asChild
                >
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="w-4 h-4 fill-current"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    {whatsappLabel}
                  </a>
                </Button>
                <Button
                  variant="outline"
                  className="w-full sm:w-auto px-8 py-4 h-auto text-base font-medium rounded-full !bg-transparent text-white/80 border-white/30 hover:!bg-white/10 hover:text-white hover:border-white/50"
                  asChild
                >
                  <Link href={contactUrl}>{contactLabel}</Link>
                </Button>
              </div>

              {/* Contact link */}
              <Link
                href={contactUrl}
                className="group relative inline-flex items-center gap-1 text-sm text-white/40 hover:text-white/70 transition-colors after:absolute after:left-0 after:bottom-0 after:h-px after:w-full after:bg-current after:scale-x-0 after:origin-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-left w-fit"
              >
                Mai multe informații
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
    </div>
  );
};

export default RegistrationClosedSection;
