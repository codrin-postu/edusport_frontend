"use client";

import PageHeroSection from "@/components/blocks/page-hero-section";
import React from "react";
import VolunteerForm from "./_VolunteerForm";
import type { FormConfig } from "@/lib/strapi-forms";

/**
 * /voluntariat/inscriere — the volunteer application form page. Mirrors the
 * /inscrieri layout: hero band, centered intro, cream form card.
 */
const VolunteerInscriereView: React.FC<{ formConfig?: FormConfig | null }> = ({
  formConfig = null,
}) => {
  return (
    <div className="min-h-screen bg-retro-cream">
      <PageHeroSection
        title={["VOLUNTAR"]}
        breadcrumb={[
          { label: "Voluntariat", href: "/voluntariat" },
          { label: "Înscriere" },
        ]}
      >
        <h1 className="font-display text-display-md font-extrabold text-retro-cream leading-[1.05] tracking-[-0.5px]">
          Înscriere voluntariat
        </h1>
        <p className="text-retro-cream/70 text-base max-w-md">
          Completează formularul de mai jos pentru a te alătura echipei de
          voluntari EduSport.
        </p>
      </PageHeroSection>

      <section className="relative z-10 bg-retro-cream">
        <div className="max-w-content mx-auto px-4 md:px-8 lg:px-12 py-16 md:py-20">
          <div className="max-w-xl mx-auto">
            <div className="flex flex-col gap-3">
              <p className="text-eyebrow font-bold uppercase text-rust">
                Formular de voluntariat
              </p>
              <h2 className="font-display text-display-sm font-extrabold text-navy leading-[1.05] tracking-[-0.4px]">
                Devino voluntar
              </h2>
              <p className="text-sm text-navy/60 leading-relaxed">
                Completează pașii de mai jos. Răspundem de obicei în 24 până la
                48 de ore.
              </p>
            </div>

            <div className="mt-10 bg-retro-cream border-[1.5px] border-navy shadow-[8px_8px_0_rgb(14_26_60_/_0.16)] p-6 md:p-8 min-h-[480px]">
              <VolunteerForm config={formConfig} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default VolunteerInscriereView;
