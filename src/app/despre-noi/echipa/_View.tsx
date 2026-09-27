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
    <div className={cn("min-h-screen", "bg-surface")}>
      <PageHeroSection
        backgroundImage="/images/hero-background.png"
        title={["ECHIPA"]}
        variant="blue"
        breadcrumb={[
          { label: "Despre noi", href: "/despre-noi" },
          { label: "Echipă" },
        ]}
      >
        <h1 className="text-display text-primary-on-dark">
          {bannerTitle}
        </h1>
        <p className="text-body text-secondary-on-dark">
          {bannerSubtitle}
        </p>
      </PageHeroSection>

      <section className="relative z-raised bg-surface section">
        <div className="w-full max-w-content mx-auto gutter">
          {/* Introduction */}
          <div className="max-w-prose mb-16">
            <p className="text-label uppercase text-accent mb-4">
              Antrenori & Instructori
            </p>
            <p className="text-body text-secondary">
              {introText}
            </p>
          </div>

          {members.length === 0 ? (
            <div className="py-24 text-center">
              <p className="text-heading text-secondary">Echipa nu este disponibilă momentan</p>
              <p className="text-body-sm text-secondary mt-2">Reveniți în curând.</p>
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
                    className="flex flex-col bg-surface border-retro border-line shadow-retro"
                  >
                    {/* Header band — avatar + name centered/stacked */}
                    <div
                      className={cn(
                        "relative flex flex-col items-center text-center px-4 pt-4 pb-3",
                        featured
                          ? "bg-surface-dark"
                          : "bg-surface border-b-retro border-line-subtle",
                      )}
                    >
                      {featured && (
                        <span className="absolute inset-x-0 bottom-0 h-1 bg-rust" aria-hidden />
                      )}
                      {trainer.image ? (
                        <div
                          className={cn(
                            "relative w-14 h-14 overflow-hidden shrink-0 border-2 mb-2",
                            featured ? "border-mustard" : "border-line",
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
                            "w-14 h-14 flex items-center justify-center shrink-0 border-2 mb-2",
                            featured
                              ? "border-mustard bg-overlay text-mustard"
                              : "border-line bg-surface-dark text-primary-on-dark",
                          )}
                        >
                          <span className="text-title select-none">
                            {initials}
                          </span>
                        </div>
                      )}
                      <h2
                        className={cn(
                          "text-title",
                          featured ? "text-primary-on-dark" : "text-primary",
                        )}
                      >
                        {trainer.name}
                      </h2>
                      <p
                        className={cn(
                          "text-label uppercase mt-0.5",
                          featured ? "text-mustard" : "text-accent",
                        )}
                      >
                        {trainer.role}
                      </p>
                    </div>

                    {/* Body */}
                    <div className="px-4 pt-3 pb-4 flex flex-col gap-3">
                      <p className="text-caption text-secondary">
                        {trainer.bio}
                      </p>
                      {trainer.teaches.length > 0 && (
                        <div>
                          <p className="text-label uppercase text-secondary mb-1">
                            Predă la
                          </p>
                          <ul className="flex flex-col gap-0.5">
                            {trainer.teaches.map((group) => (
                              <li
                                key={group}
                                className="text-caption relative pl-4 text-secondary before:absolute before:left-0.5 before:content-['›'] before:font-extrabold before:text-accent"
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
