"use client";

import PageHeroSection from "@/components/blocks/page-hero-section";
import React from "react";
import Card from "@/components/ui/card";
import RegistrationForm from "./_RegistrationForm";
import type { FormConfig } from "@/lib/strapi-forms";
import { registrationsOpen, type PublicClubInfo } from "@/lib/club-public";
import type { ScheduleWeekend } from "./_schedule";

interface InscrieriViewProps {
  formConfig?: FormConfig | null;
  /** GET /api/club/public; null when the backend could not be read. */
  club: PublicClubInfo | null;
  /** "Înscrieri deschise" (Setări site). */
  registrationOpen: boolean;
  weekends: ScheduleWeekend[];
  /** Setări site, contact: the WhatsApp channel shown after submit. */
  whatsappUrl?: string;
}

const Message: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="py-16 px-8 text-center">
    <p className="text-body-sm text-secondary">{children}</p>
  </div>
);

const InscrieriView: React.FC<InscrieriViewProps> = ({
  formConfig = null,
  club,
  registrationOpen,
  weekends,
  whatsappUrl,
}) => {
  const body = !club ? (
    <Message>
      Formularul de înscriere nu este disponibil momentan. Te rugăm să încerci din nou mai
      târziu sau să ne contactezi direct.
    </Message>
  ) : !registrationsOpen(registrationOpen, club) ? (
    <Message>Înscrierile sunt închise.</Message>
  ) : (
    <RegistrationForm config={formConfig} club={club} weekends={weekends} whatsappUrl={whatsappUrl} />
  );

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
              {club?.season && (
                <p className="text-label uppercase text-primary">
                  {club.season.label}
                </p>
              )}
              <h2 className="text-heading text-primary">
                Înscrie-ți copilul
              </h2>
              <p className="text-body-sm text-secondary">
                Completează pașii de mai jos. Vom confirma înscrierea în cel mai
                scurt timp.
              </p>
            </div>

            <Card as="div" padding="md" className="mt-12 min-h-[480px] md:p-8">
              {body}
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default InscrieriView;
