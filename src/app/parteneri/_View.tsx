import React from "react";
import Link from "next/link";
import Image from "next/image";
import PageHeroSection from "@/components/blocks/page-hero-section";
import Card, { CardTitle } from "@/components/ui/card";
import Chip from "@/components/ui/chip";
import SponsorMarquee from "./_SponsorMarquee";
import PartnerForm from "./_PartnerForm";
import type { Sponsor, CollabEvent } from "@/lib/strapi-partners";
import type { FormConfig } from "@/lib/strapi-forms";

/**
 * /parteneri — sponsors, past collaborations, and a "let's work together" form
 * framed around sponsoring the club or running a special event.
 *
 * Retro layout on the shared system: PageHeroSection navy band (no image),
 * a "De ce" intro, an auto-scrolling sponsor logo strip, a grid of past
 * events done with partners, the sponsor/event form (config-driven, submits
 * to /api/forms/parteneri), and the slim "Mai departe" outro. All content sections are `relative z-raised`
 * so the sticky hero doesn't bleed through on scroll.
 */
interface PartnersCopy {
  heroTitle: string;
  heroSubtitle: string;
  introEyebrow: string;
  introHeading: string;
  introBody: string;
  ctaEyebrow: string;
  ctaHeading: string;
  ctaBody: string;
}

const PartnerView: React.FC<{
  sponsors: Sponsor[];
  events: CollabEvent[];
  copy: PartnersCopy;
  formConfig: FormConfig | null;
}> = ({ sponsors, events, copy, formConfig }) => {
  return (
    <div className="min-h-screen bg-surface">
      <PageHeroSection title={["PARTENER"]}>
        <h1 className="text-display text-primary-on-dark">
          {copy.heroTitle}
        </h1>
        <p className="text-body max-w-md text-secondary-on-dark">{copy.heroSubtitle}</p>
      </PageHeroSection>

      {/* ─── DE CE PARTENERIAT ─── */}
      <section className="relative z-raised bg-surface section">
        <div className="mx-auto w-full max-w-content gutter">
          <div className="flex flex-col gap-3">
            <p className="text-label uppercase text-accent">
              {copy.introEyebrow}
            </p>
            <h2 className="text-heading max-w-lg text-primary">
              {copy.introHeading}
            </h2>
            <p className="text-body max-w-prose text-secondary">
              {copy.introBody}
            </p>
          </div>
        </div>
      </section>

      {/* ─── SPONSORII NOȘTRI (marquee) ───
          Hidden entirely when there are no sponsors: a heading saying "cei care
          susțin clubul" above an empty strip reads worse than no section. */}
      {sponsors.length > 0 && (
      <section className="relative z-raised bg-surface pb-16 md:pb-24">
        <div className="mx-auto w-full max-w-content gutter">
          <div className="mb-8 flex flex-col gap-2">
            <p className="text-label uppercase text-accent">
              Alături de noi
            </p>
            <h2 className="text-heading text-primary">
              Sponsorii noștri
            </h2>
            <p className="text-body-sm text-secondary">
              Le mulțumim celor care susțin clubul.
            </p>
          </div>
        </div>
        {/* Full-bleed strip (edge fades handle the sides) */}
        <div className="mx-auto w-full max-w-content gutter">
          <SponsorMarquee sponsors={sponsors} />
        </div>
      </section>
      )}

      {/* ─── EVENIMENTE & COLABORĂRI ─── */}
      {events.length > 0 && (
        <section className="relative z-raised border-t border-line-subtle bg-surface section">
          <div className="mx-auto w-full max-w-content gutter">
            <div className="mb-8 flex flex-col gap-2">
              <p className="text-label uppercase text-accent">
                Împreună
              </p>
              <h2 className="text-heading text-primary">
                Evenimente & colaborări
              </h2>
              <p className="text-body-sm max-w-prose text-secondary">
                Momente construite alături de partenerii noștri.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              {events.map((ev) => (
                <Card
                  as="article"
                  key={ev.title}
                  shadow="md"
                  padding="none"
                  className="overflow-hidden"
                >
                  {ev.image && (
                    <div className="relative h-44 w-full border-b-retro border-line bg-surface-subtle">
                      <Image
                        src={ev.image}
                        alt={ev.title}
                        fill
                        sizes="(min-width: 640px) 50vw, 100vw"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <Chip tone="outline" size="sm">
                      cu {ev.partner}
                    </Chip>
                    <CardTitle className="mt-3">
                      {ev.title}
                    </CardTitle>
                    <p className="text-label mt-0.5 uppercase text-secondary">
                      {ev.date}
                    </p>
                    <p className="text-body-sm mt-2 text-secondary">
                      {ev.description}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── COLABOREAZĂ (sponsor / event form) ─── */}
      <section className="relative z-raised border-t border-line-subtle bg-surface section">
        <div className="mx-auto w-full max-w-content gutter">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-24">
            <div className="flex flex-col gap-3">
              <p className="text-label uppercase text-accent">
                {copy.ctaEyebrow}
              </p>
              <h2 className="text-heading text-primary">
                {copy.ctaHeading}
              </h2>
              <p className="text-body-sm max-w-sm text-secondary">
                {copy.ctaBody}
              </p>
            </div>
            <Card as="div" surface="dark" padding="md" className="relative md:p-8">
              <span className="absolute inset-x-0 top-0 h-1.5 bg-rust" aria-hidden />
              <h3 className="text-title mb-1 text-primary-on-dark">
                Scrie-ne
              </h3>
              <p className="text-body-sm mb-8 text-secondary-on-dark">
                Răspundem de obicei în 24 până la 48 de ore.
              </p>
              <PartnerForm config={formConfig} />
            </Card>
          </div>
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
              Descoperă clubul și sportivii noștri.
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

export default PartnerView;
