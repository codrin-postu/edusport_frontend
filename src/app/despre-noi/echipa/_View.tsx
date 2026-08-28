import React from "react";
import { cn } from "@/utils/cn";
import Image from "next/image";
import PageHeroSection from "@/components/blocks/page-hero-section";

interface Trainer {
  name: string;
  role: string;
  image?: string;
  bio: string;
  teaches: string[];
}

interface Props {
  bannerTitle?: string;
  bannerSubtitle?: string;
  introText?: string;
  members: Trainer[];
}

const TeamPage: React.FC<Props> = ({ bannerTitle, bannerSubtitle, introText, members }) => {
  return (
    <div className={cn("min-h-screen", "bg-retro-cream")}>
      <PageHeroSection
        backgroundImage="/images/hero-background.png"
        title={["ECHIPA"]}
        variant="blue"
        breadcrumb={[
          { label: "Despre noi", href: "/despre-noi" },
          { label: "Echipă" },
        ]}
      >
        <h1 className="font-display text-display-md font-extrabold text-retro-cream leading-[1.05] tracking-[-0.5px]">
          {bannerTitle}
        </h1>
        <p className="text-retro-cream/70 text-base">
          {bannerSubtitle}
        </p>
      </PageHeroSection>

      <section className="relative z-10 bg-retro-cream py-16 md:py-20">
        <div className="w-full max-w-content mx-auto px-4 md:px-8 lg:px-12">
          {/* Introduction */}
          <div className="max-w-2xl mb-14">
            <p className="text-eyebrow font-bold uppercase text-rust mb-4">
              Antrenori & Instructori
            </p>
            <p className="text-navy/[0.72] text-base leading-relaxed">
              {introText}
            </p>
          </div>

          {members.length === 0 ? (
            <div className="py-20 text-center">
              <p className="font-display text-display-sm font-extrabold text-navy/25">Echipa nu este disponibilă momentan</p>
              <p className="text-sm text-navy/50 mt-2">Reveniți în curând.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {members.map((trainer, i) => {
                // First member (lowest `order`) is the lead trainer — the only
                // card with the navy header band; assistants get a cream header.
                const featured = i === 0;
                const initials = trainer.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("");
                return (
                  <div
                    key={trainer.name}
                    className="flex flex-col bg-retro-cream border-[1.5px] border-navy shadow-[8px_8px_0_rgb(14_26_60_/_0.16)]"
                  >
                    {/* Header band — avatar + name centered/stacked */}
                    <div
                      className={cn(
                        "relative flex flex-col items-center text-center px-4 pt-4 pb-3",
                        featured
                          ? "bg-navy"
                          : "bg-retro-cream border-b-[1.5px] border-navy/15",
                      )}
                    >
                      {featured && (
                        <span className="absolute inset-x-0 bottom-0 h-1 bg-rust" aria-hidden />
                      )}
                      {trainer.image ? (
                        <div
                          className={cn(
                            "relative w-14 h-14 rounded-full overflow-hidden shrink-0 border-2 mb-2",
                            featured ? "border-mustard" : "border-navy",
                          )}
                        >
                          <Image
                            src={trainer.image}
                            alt={trainer.name}
                            fill
                            className="object-cover object-top"
                          />
                        </div>
                      ) : (
                        <div
                          className={cn(
                            "w-14 h-14 rounded-full flex items-center justify-center shrink-0 border-2 mb-2",
                            featured
                              ? "border-mustard bg-navy/60 text-mustard"
                              : "border-navy bg-navy text-retro-cream",
                          )}
                        >
                          <span className="font-display text-base font-extrabold select-none">
                            {initials}
                          </span>
                        </div>
                      )}
                      <h2
                        className={cn(
                          "font-display text-[15px] font-extrabold leading-tight",
                          featured ? "text-retro-cream" : "text-navy",
                        )}
                      >
                        {trainer.name}
                      </h2>
                      <p
                        className={cn(
                          "text-2xs font-bold uppercase tracking-[0.06em] mt-0.5",
                          featured ? "text-mustard" : "text-rust",
                        )}
                      >
                        {trainer.role}
                      </p>
                    </div>

                    {/* Body */}
                    <div className="px-4 pt-3 pb-4 flex flex-col gap-3">
                      <p className="text-xs text-navy/60 leading-relaxed">
                        {trainer.bio}
                      </p>
                      {trainer.teaches.length > 0 && (
                        <div>
                          <p className="text-3xs font-bold uppercase tracking-[0.1em] text-navy/45 mb-1">
                            Predă la
                          </p>
                          <ul className="flex flex-col gap-0.5">
                            {trainer.teaches.map((group) => (
                              <li
                                key={group}
                                className="relative pl-4 text-xs text-navy/65 leading-relaxed before:absolute before:left-0.5 before:content-['›'] before:font-extrabold before:text-rust"
                              >
                                {group}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default TeamPage;
