"use client";

import PageHeroSection from "@/components/blocks/page-hero-section";
import React from "react";
import RegistrationForm from "./_RegistrationForm";
import type { FormConfig } from "@/lib/strapi-forms";

const InscrieriView: React.FC<{ formConfig?: FormConfig | null }> = ({
  formConfig = null,
}) => {
  return (
    <div className="min-h-screen bg-retro-cream">
      <PageHeroSection title={["ÎNSCRIERI"]} backgroundImage="/images/courses.png">
        <h1 className="font-display text-display-md font-extrabold text-retro-cream leading-[1.05] tracking-[-0.5px]">
          Înscrieri
        </h1>
        <p className="text-retro-cream/70 text-base max-w-md">
          Completează formularul de mai jos pentru a înscrie copilul tău la
          cursurile de patinaj artistic EduSport.
        </p>
      </PageHeroSection>

      <section className="relative z-10 bg-retro-cream">
        <div className="max-w-content mx-auto px-4 md:px-8 lg:px-12 py-16 md:py-20">
          <div className="max-w-xl mx-auto">
            <div className="flex flex-col gap-3">
              <p className="text-eyebrow font-bold uppercase text-rust">
                Formular de înscriere
              </p>
              <h2 className="font-display text-display-sm font-extrabold text-navy leading-[1.05] tracking-[-0.4px]">
                Înscrie-ți copilul
              </h2>
              <p className="text-sm text-navy/60 leading-relaxed">
                Completează pașii de mai jos. Vom confirma înscrierea în cel mai
                scurt timp.
              </p>
            </div>

            <div className="mt-10 bg-retro-cream border-[1.5px] border-navy shadow-[8px_8px_0_rgb(14_26_60_/_0.16)] p-6 md:p-8 min-h-[480px]">
              <RegistrationForm config={formConfig} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default InscrieriView;
