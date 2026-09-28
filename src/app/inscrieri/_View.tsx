"use client";

import PageHeroSection from "@/components/blocks/page-hero-section";
import React from "react";
import Card from "@/components/ui/card";
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

      <section className="relative z-raised bg-surface">
        <div className="max-w-content mx-auto gutter section">
          <div className="max-w-narrow mx-auto">
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

            <Card as="div" padding="md" className="mt-12 min-h-[480px] md:p-8">
              <RegistrationForm config={formConfig} />
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default InscrieriView;
