import React from "react";
import Link from "next/link";
import PageHeroSection from "@/components/blocks/page-hero-section";
import { GalleryCarousel } from "@/components/blocks/gallery-carousel";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import type { VolunteerHelpWay } from "@/lib/strapi-volunteer";

interface VolunteerViewProps {
  heroTitle: string;
  heroSubtitle: string;
  introEyebrow: string;
  introHeading: string;
  introBody: string;
  helpWays: VolunteerHelpWay[];
  photos: { src: string; alt: string }[];
}

/**
 * /voluntariat — recruit volunteers for the club.
 *
 * Retro layout on the shared system: PageHeroSection navy band (no image),
 * a "De ce" intro, a volunteer photo gallery, a split navy/list panel for
 * the ways to help, a CTA panel leading to the application form page at
 * /voluntariat/inscriere, and the slim "Mai departe" outro.
 */
const VolunteerView: React.FC<VolunteerViewProps> = ({
  heroTitle,
  heroSubtitle,
  introEyebrow,
  introHeading,
  introBody,
  helpWays,
  photos,
}) => {
  return (
    <div className="min-h-screen bg-surface">
      <PageHeroSection
        title={["VOLUNTAR"]}
        breadcrumb={[
          { label: "Despre noi", href: "/despre-noi" },
          { label: "Voluntariat" },
        ]}
      >
        <h1 className="text-display text-primary-on-dark">
          {heroTitle}
        </h1>
        <p className="text-body max-w-md text-secondary-on-dark">{heroSubtitle}</p>
      </PageHeroSection>

      {/* ─── DE CE ─── */}
      <section className="relative z-raised bg-surface section">
        <div className="mx-auto w-full max-w-content gutter">
          <div className="flex flex-col gap-3">
            <p className="text-label uppercase text-accent">
              {introEyebrow}
            </p>
            <h2 className="text-heading max-w-lg text-primary">
              {introHeading}
            </h2>
            <p className="text-body max-w-prose text-secondary">
              {introBody}
            </p>
          </div>
        </div>
      </section>

      {/* ─── FOTO ─── */}
      <section className="relative z-raised bg-surface pb-4">
        <div className="mx-auto w-full max-w-content gutter">
          <GalleryCarousel
            images={photos}
            eyebrow="Din culise"
            title="Voluntarii în acțiune"
          />
        </div>
      </section>

      {/* ─── CUM POȚI AJUTA (split panel) ─── */}
      <section className="relative z-raised bg-surface section">
        <div className="mx-auto w-full max-w-content gutter">
          <Card as="div" padding="none" className="grid md:grid-cols-[1fr_1.3fr] bg-transparent">
            {/* Left — navy intro */}
            <div className="bg-surface-dark p-8 text-primary-on-dark md:p-12">
              <p className="text-label uppercase text-mustard">
                Implică-te
              </p>
              <h2 className="text-heading mt-2 text-primary-on-dark">
                Cum poți ajuta
              </h2>
              <p className="text-body-sm mt-3 text-secondary-on-dark">
                Fiecare rol contează, la orice nivel de implicare.
              </p>
            </div>
            {/* Right — ways list */}
            <div className="bg-surface px-6 md:px-12">
              {helpWays.map((way, i) => (
                <div
                  key={way.title}
                  className={
                    i < helpWays.length - 1
                      ? "border-b border-line-subtle py-6"
                      : "py-6"
                  }
                >
                  <h3 className="text-title text-primary">
                    {way.title}
                  </h3>
                  <p className="text-body-sm mt-1 text-secondary">
                    {way.desc}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* ─── CUM APLICI (CTA) ─── */}
      <section className="relative z-raised bg-surface section">
        <div className="mx-auto w-full max-w-content gutter">
          <Card as="div" surface="dark" padding="lg" className="relative md:p-12">
            <span className="absolute inset-x-0 top-0 h-1.5 bg-rust" aria-hidden />
            <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between md:gap-12">
              <div className="flex flex-col gap-3">
                <p className="text-label uppercase text-mustard">
                  Cum aplici
                </p>
                <h2 className="text-heading text-primary-on-dark">
                  Gata să te implici?
                </h2>
                <p className="text-body-sm max-w-md text-secondary-on-dark">
                  Completează formularul de înscriere în câțiva pași simpli.
                  Răspundem de obicei în 24 până la 48 de ore.
                </p>
              </div>
              <Button
                face="cream"
                href="/voluntariat/inscriere"
                umamiEvent="voluntariat.cta_inscriere"
                className="shrink-0"
              >
                Înscrie-te ca voluntar
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* ─── OUTRO ─── */}
      <section className="relative z-raised border-t-retro border-line-subtle bg-surface section-compact">
        <div className="mx-auto flex w-full max-w-content flex-col items-start gap-4 gutter sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-label mb-2 uppercase text-accent">
              Mai departe
            </div>
            <p className="text-body text-primary">
              Descoperă echipa și sportivii clubului EduSport.
            </p>
          </div>
          <Link
            href="/despre-noi"
            className="text-body-sm link text-accent"
          >
            Despre noi
          </Link>
        </div>
      </section>
    </div>
  );
};

export default VolunteerView;
