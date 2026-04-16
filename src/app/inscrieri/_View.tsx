"use client";

import PageHeroSection from "@/components/blocks/page-hero-section";
import SectionHeader from "@/components/ui/section-header";
import React from "react";
import RegistrationForm from "./_RegistrationForm";

const InscrieriView: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeroSection title={["ÎNSCRIERI"]} backgroundImage="/images/courses.png">
        <h1 className="text-4xl md:text-6xl font-semibold text-white leading-[1.1] tracking-tight">
          Înscrieri
        </h1>
        <p className="text-white/70 text-base font-light border-t border-white/10 pt-4 max-w-md">
          Completează formularul de mai jos pentru a înscrie copilul tău la
          cursurile de patinaj artistic EduSport.
        </p>
      </PageHeroSection>

      <section className="relative z-10 bg-gray-50">
        <div className="max-w-content mx-auto px-4 md:px-8 lg:px-12 py-16 md:py-20">
          <div className="max-w-xl mx-auto">
            <SectionHeader
              eyebrow="Formular de înscriere"
              title="Înscrie-ți copilul"
              description="Completează pașii de mai jos. Vom confirma înscrierea în cel mai scurt timp."
            />

            <div className="mt-10 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 min-h-[480px]">
              <RegistrationForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default InscrieriView;
