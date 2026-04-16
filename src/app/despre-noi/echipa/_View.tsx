import React from "react";
import { cn } from "@/utils/cn";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
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
    <div className={cn("min-h-screen", "bg-white")}>
      <PageHeroSection
        backgroundImage="/images/hero-background.png"
        title={["ECHIPA"]}
        variant="purple"
        breadcrumb={[
          { label: "Despre noi", href: "/despre-noi" },
          { label: "Echipă" },
        ]}
      >
        <h1 className="text-4xl md:text-6xl font-semibold text-white leading-[1.1] tracking-tight">
          {bannerTitle}
        </h1>
        <p className="text-white/70 text-base font-light border-t border-white/10 pt-4">
          {bannerSubtitle}
        </p>
      </PageHeroSection>

      <section className="relative z-10 bg-white py-16 md:py-20">
        <div className="w-full max-w-content mx-auto px-4 md:px-8 lg:px-12">
          {/* Introduction */}
          <div className="max-w-2xl mb-14">
            <p className="text-xs font-semibold tracking-widest uppercase text-edusport-blue/60 mb-4">
              Antrenori & Instructori
            </p>
            <p className="text-gray-700 text-base font-light leading-relaxed">
              {introText}
            </p>
          </div>

          {members.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-lg font-semibold text-gray-300">Echipa nu este disponibilă momentan</p>
              <p className="text-sm text-gray-400 mt-2 font-light">Reveniți în curând.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {members.map((trainer) => (
                <div key={trainer.name} className="flex flex-col gap-4 bg-gray-50 rounded-2xl p-5">
                  {/* Avatar row */}
                  <div className="flex items-center gap-3">
                    {trainer.image ? (
                      <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200 shrink-0">
                        <Image
                          src={trainer.image}
                          alt={trainer.name}
                          fill
                          className="object-cover object-top"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-edusport-blue/10 flex items-center justify-center shrink-0">
                        <span className="text-sm font-semibold text-edusport-blue/40 select-none">
                          {trainer.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                    )}
                    <div>
                      <h2 className="text-sm font-semibold text-gray-900 leading-tight">
                        {trainer.name}
                      </h2>
                      <p className="text-xs text-edusport-blue font-medium mt-0.5">
                        {trainer.role}
                      </p>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-200" />

                  {/* Bio */}
                  <p className="text-xs text-gray-500 font-light leading-relaxed">
                    {trainer.bio}
                  </p>

                  {/* Groups */}
                  {trainer.teaches.length > 0 && (
                    <div className="flex flex-col gap-1">
                      <p className="text-xs text-gray-400 font-light uppercase tracking-wider">Predă la</p>
                      <ul className="flex flex-col gap-0.5">
                        {trainer.teaches.map((group) => (
                          <li key={group} className="flex items-center gap-2 text-xs text-gray-500 font-light">
                            <ChevronRight className="w-3 h-3 text-edusport-blue/40 shrink-0" />
                            {group}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default TeamPage;
