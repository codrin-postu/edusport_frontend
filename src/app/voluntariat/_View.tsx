import React from "react";
import Link from "next/link";
import PageHeroSection from "@/components/blocks/page-hero-section";
import { GalleryCarousel } from "@/components/blocks/gallery-carousel";
import VolunteerForm from "./_VolunteerForm";
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
 * the ways to help, an application form (reuses /api/contact), and the slim
 * "Mai departe" outro.
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
    <div className="min-h-screen bg-retro-cream">
      <PageHeroSection
        title={["VOLUNTAR"]}
        breadcrumb={[
          { label: "Despre noi", href: "/despre-noi" },
          { label: "Voluntariat" },
        ]}
      >
        <h1 className="font-display text-display-md font-extrabold leading-[1.05] tracking-[-0.5px] text-retro-cream">
          {heroTitle}
        </h1>
        <p className="max-w-md text-base text-retro-cream/70">{heroSubtitle}</p>
      </PageHeroSection>

      {/* ─── DE CE ─── */}
      <section className="relative z-10 bg-retro-cream py-16 md:py-24">
        <div className="mx-auto w-full max-w-content px-4 md:px-8 lg:px-12">
          <div className="flex flex-col gap-3">
            <p className="text-eyebrow font-bold uppercase text-rust">
              {introEyebrow}
            </p>
            <h2 className="max-w-lg font-display text-display-sm font-extrabold leading-[1.05] tracking-[-0.4px] text-navy">
              {introHeading}
            </h2>
            <p className="max-w-xl text-base leading-relaxed text-navy/65">
              {introBody}
            </p>
          </div>
        </div>
      </section>

      {/* ─── FOTO ─── */}
      <section className="relative z-10 bg-retro-cream pb-4">
        <div className="mx-auto w-full max-w-content px-4 md:px-8 lg:px-12">
          <GalleryCarousel
            images={photos}
            eyebrow="Din culise"
            title="Voluntarii în acțiune"
          />
        </div>
      </section>

      {/* ─── CUM POȚI AJUTA (split panel) ─── */}
      <section className="relative z-10 bg-retro-cream py-16 md:py-24">
        <div className="mx-auto w-full max-w-content px-4 md:px-8 lg:px-12">
          <div className="grid border-[1.5px] border-navy shadow-[8px_8px_0_rgb(14_26_60_/_0.16)] md:grid-cols-[1fr_1.3fr]">
            {/* Left — navy intro */}
            <div className="bg-navy p-8 text-retro-cream md:p-10">
              <p className="text-eyebrow font-bold uppercase text-mustard">
                Implică-te
              </p>
              <h2 className="mt-2 font-display text-display-sm font-extrabold leading-[1.05] tracking-[-0.4px] text-retro-cream">
                Cum poți ajuta
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-retro-cream/60">
                Fiecare rol contează, la orice nivel de implicare.
              </p>
            </div>
            {/* Right — ways list */}
            <div className="bg-retro-cream px-6 md:px-10">
              {helpWays.map((way, i) => (
                <div
                  key={way.title}
                  className={
                    i < helpWays.length - 1
                      ? "border-b border-navy/12 py-5"
                      : "py-5"
                  }
                >
                  <h3 className="text-base font-extrabold text-navy">
                    {way.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-navy/60">
                    {way.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── CUM APLICI (form) ─── */}
      <section className="relative z-10 bg-retro-cream py-16 md:py-24">
        <div className="mx-auto w-full max-w-content px-4 md:px-8 lg:px-12">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
            {/* Left — intro */}
            <div className="flex flex-col gap-3">
              <p className="text-eyebrow font-bold uppercase text-rust">
                Cum aplici
              </p>
              <h2 className="font-display text-display-sm font-extrabold leading-[1.05] tracking-[-0.4px] text-navy">
                Completează formularul
              </h2>
              <p className="max-w-sm text-sm leading-relaxed text-navy/60">
                Lasă-ne datele tale și un scurt mesaj. Discutăm împreună și
                găsim rolul care ți se potrivește cel mai bine.
              </p>
            </div>
            {/* Right — navy form panel */}
            <div className="relative bg-navy p-6 shadow-[8px_8px_0_rgb(14_26_60_/_0.16)] md:p-8">
              <span className="absolute inset-x-0 top-0 h-1.5 bg-rust" aria-hidden />
              <h3 className="mb-1 font-display text-2xl font-extrabold text-retro-cream">
                Devino voluntar
              </h3>
              <p className="mb-7 text-sm text-retro-cream/50">
                Răspundem de obicei în 24 până la 48 de ore.
              </p>
              <VolunteerForm />
            </div>
          </div>
        </div>
      </section>

      {/* ─── OUTRO ─── */}
      <section className="relative z-10 border-t-[1.5px] border-navy/12 bg-retro-cream py-12 md:py-14">
        <div className="mx-auto flex w-full max-w-content flex-col items-start gap-4 px-4 sm:flex-row sm:items-center sm:justify-between md:px-8 lg:px-12">
          <div>
            <div className="mb-1.5 text-eyebrow font-bold uppercase text-rust">
              Mai departe
            </div>
            <p className="text-base font-semibold text-navy md:text-lg">
              Descoperă echipa și sportivii clubului EduSport.
            </p>
          </div>
          <Link
            href="/despre-noi"
            className="link-underline-rust text-sm font-semibold text-rust"
          >
            Despre noi
          </Link>
        </div>
      </section>
    </div>
  );
};

export default VolunteerView;
