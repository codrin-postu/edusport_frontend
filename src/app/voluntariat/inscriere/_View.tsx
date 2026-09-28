"use client";

import PageHeroSection from "@/components/blocks/page-hero-section";
import React from "react";
import Card from "@/components/ui/card";
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

      <section className="relative z-raised bg-surface">
        <div className="max-w-content mx-auto gutter section">
          <div className="max-w-narrow mx-auto">
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

            <Card as="div" padding="md" className="mt-12 min-h-[480px] md:p-8">
              <VolunteerForm config={formConfig} />
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default VolunteerInscriereView;
