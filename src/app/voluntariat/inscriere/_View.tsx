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
    <div className="min-h-screen bg-surface">
      <PageHeroSection
        title={["VOLUNTAR"]}
        breadcrumb={[
          { label: "Voluntariat", href: "/voluntariat" },
          { label: "Înscriere" },
        ]}
      >
        <h1 className="text-display text-primary-on-dark">
          Înscriere voluntariat
        </h1>
        <p className="text-body text-secondary-on-dark max-w-md">
          Completează formularul de mai jos pentru a te alătura echipei de
          voluntari EduSport.
        </p>
      </PageHeroSection>

      <section className="relative z-10 bg-surface">
        <div className="max-w-content mx-auto px-4 md:px-8 lg:px-12 py-16 md:py-20">
          <div className="max-w-xl mx-auto">
            <div className="flex flex-col gap-3">
              <p className="text-label uppercase text-accent">
                Formular de voluntariat
              </p>
              <h2 className="text-heading text-primary">
                Devino voluntar
              </h2>
              <p className="text-body-sm text-secondary">
                Completează pașii de mai jos. Răspundem de obicei în 24 până la
                48 de ore.
              </p>
            </div>

            <div className="mt-10 bg-surface border-retro border-line shadow-retro p-6 md:p-8 min-h-[480px]">
              <VolunteerForm config={formConfig} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default VolunteerInscriereView;
