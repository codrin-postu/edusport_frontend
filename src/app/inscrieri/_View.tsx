"use client";

import PageHeroSection from "@/components/blocks/page-hero-section";
import React from "react";
import RegistrationForm from "./_RegistrationForm";
import type { FormConfig } from "@/lib/strapi-forms";

const InscrieriView: React.FC<{ formConfig?: FormConfig | null }> = ({
  formConfig = null,
}) => {
  return (
    <div className="min-h-screen bg-surface">
      <PageHeroSection title={["ÎNSCRIERI"]} backgroundImage="/images/courses.png">
        <h1 className="text-display text-primary-on-dark">
          Înscrieri
        </h1>
        <p className="text-body text-secondary-on-dark max-w-md">
          Completează formularul de mai jos pentru a înscrie copilul tău la
          cursurile de patinaj artistic EduSport.
        </p>
      </PageHeroSection>

      <section className="relative z-10 bg-surface">
        <div className="max-w-content mx-auto px-4 md:px-8 lg:px-12 py-16 md:py-20">
          <div className="max-w-xl mx-auto">
            <div className="flex flex-col gap-3">
              <p className="text-label uppercase text-accent">
                Formular de înscriere
              </p>
              <h2 className="text-heading text-primary">
                Înscrie-ți copilul
              </h2>
              <p className="text-body-sm text-secondary">
                Completează pașii de mai jos. Vom confirma înscrierea în cel mai
                scurt timp.
              </p>
            </div>

            <div className="mt-10 bg-surface border-retro border-line shadow-retro p-6 md:p-8 min-h-[480px]">
              <RegistrationForm config={formConfig} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default InscrieriView;
