import React from "react";
import Link from "next/link";
import Image from "next/image";
import PageHeroSection from "@/components/blocks/page-hero-section";
import SponsorMarquee from "./_SponsorMarquee";
import PartnerForm from "./_PartnerForm";
import type { Sponsor, CollabEvent } from "@/lib/strapi-partners";

/**
 * /parteneri — sponsors, past collaborations, and a "let's work together" form
 * framed around sponsoring the club or running a special event.
 *
 * Retro layout on the shared system: PageHeroSection navy band (no image),
 * a "De ce" intro, an auto-scrolling sponsor logo strip, a grid of past
 * events done with partners, the sponsor/event form (reuses /api/contact),
 * and the slim "Mai departe" outro. All content sections are `relative z-10`
 * so the sticky hero doesn't bleed through on scroll.
 */
const PartnerView: React.FC<{ sponsors: Sponsor[]; events: CollabEvent[] }> = ({
  sponsors,
  events,
}) => {
  return (
    <div className="min-h-screen bg-retro-cream">
      <PageHeroSection title={["PARTENER"]}>
        <h1 className="font-display text-display-md font-extrabold leading-[1.05] tracking-[-0.5px] text-retro-cream">
          Parteneri
        </h1>
        <p className="max-w-md text-base text-retro-cream/70">
          Împreună cu partenerii și sponsorii noștri creștem patinajul din
          România — de la primii pași pe gheață până la podium.
        </p>
      </PageHeroSection>

      {/* ─── DE CE PARTENERIAT ─── */}
      <section className="relative z-10 bg-retro-cream py-16 md:py-24">
        <div className="mx-auto w-full max-w-content px-4 md:px-8 lg:px-12">
          <div className="flex flex-col gap-3">
            <p className="text-eyebrow font-bold uppercase text-rust">
              De ce parteneriat
            </p>
            <h2 className="max-w-lg font-display text-display-sm font-extrabold leading-[1.05] tracking-[-0.4px] text-navy">
              Susține o comunitate în creștere
            </h2>
            <p className="max-w-xl text-base leading-relaxed text-navy/65">
              Un parteneriat cu clubul înseamnă vizibilitate la evenimente și
              competiții, asociere cu performanța și sprijin real pentru
              sportivii tineri.
            </p>
          </div>
        </div>
      </section>

      {/* ─── SPONSORII NOȘTRI (marquee) ─── */}
      <section className="relative z-10 bg-retro-cream pb-16 md:pb-24">
        <div className="mx-auto w-full max-w-content px-4 md:px-8 lg:px-12">
          <div className="mb-8 flex flex-col gap-2">
            <p className="text-eyebrow font-bold uppercase text-rust">
              Alături de noi
            </p>
            <h2 className="font-display text-display-sm font-extrabold leading-[1.05] tracking-[-0.4px] text-navy">
              Sponsorii noștri
            </h2>
            <p className="text-sm text-navy/55">
              Le mulțumim celor care susțin clubul.
            </p>
          </div>
        </div>
        {/* Full-bleed strip (edge fades handle the sides) */}
        <div className="mx-auto w-full max-w-content px-4 md:px-8 lg:px-12">
          <SponsorMarquee sponsors={sponsors} />
        </div>
      </section>

      {/* ─── EVENIMENTE & COLABORĂRI ─── */}
      {events.length > 0 && (
        <section className="relative z-10 border-t border-navy/10 bg-retro-cream py-16 md:py-24">
          <div className="mx-auto w-full max-w-content px-4 md:px-8 lg:px-12">
            <div className="mb-8 flex flex-col gap-2">
              <p className="text-eyebrow font-bold uppercase text-rust">
                Împreună
              </p>
              <h2 className="font-display text-display-sm font-extrabold leading-[1.05] tracking-[-0.4px] text-navy">
                Evenimente & colaborări
              </h2>
              <p className="max-w-xl text-sm text-navy/55">
                Momente construite alături de partenerii noștri.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              {events.map((ev) => (
                <article
                  key={ev.title}
                  className="overflow-hidden border-[1.5px] border-navy bg-retro-cream shadow-[6px_6px_0_rgb(14_26_60_/_0.16)]"
                >
                  {ev.image && (
                    <div className="relative h-44 w-full border-b-[1.5px] border-navy bg-navy/[0.04]">
                      <Image
                        src={ev.image}
                        alt={ev.title}
                        fill
                        sizes="(min-width: 640px) 50vw, 100vw"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <span className="inline-block border-[1.5px] border-rust px-2 py-0.5 text-3xs font-extrabold uppercase tracking-[0.06em] text-rust">
                      cu {ev.partner}
                    </span>
                    <h3 className="mt-3 text-lg font-extrabold text-navy">
                      {ev.title}
                    </h3>
                    <p className="mt-0.5 text-2xs font-semibold uppercase tracking-[0.08em] text-navy/45">
                      {ev.date}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-navy/65">
                      {ev.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── COLABOREAZĂ (sponsor / event form) ─── */}
      <section className="relative z-10 border-t border-navy/10 bg-retro-cream py-16 md:py-24">
        <div className="mx-auto w-full max-w-content px-4 md:px-8 lg:px-12">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
            <div className="flex flex-col gap-3">
              <p className="text-eyebrow font-bold uppercase text-rust">
                Hai să colaborăm
              </p>
              <h2 className="font-display text-display-sm font-extrabold leading-[1.05] tracking-[-0.4px] text-navy">
                Sponsorizează sau organizează un eveniment
              </h2>
              <p className="max-w-sm text-sm leading-relaxed text-navy/60">
                Vrei să sponsorizezi clubul sau să organizăm împreună un
                eveniment special? Scrie-ne și construim colaborarea potrivită.
              </p>
            </div>
            <div className="relative bg-navy p-6 shadow-[8px_8px_0_rgb(14_26_60_/_0.16)] md:p-8">
              <span className="absolute inset-x-0 top-0 h-1.5 bg-rust" aria-hidden />
              <h3 className="mb-1 font-display text-2xl font-extrabold text-retro-cream">
                Scrie-ne
              </h3>
              <p className="mb-7 text-sm text-retro-cream/50">
                Răspundem de obicei în 24–48 de ore.
              </p>
              <PartnerForm />
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
              Descoperă clubul și sportivii noștri.
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

export default PartnerView;
