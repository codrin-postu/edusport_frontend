import Link from "@/components/ui/link";
import SpotlightButton from "@/components/ui/spotlight-button";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin } from "lucide-react";
import React from "react";
import PageHeroSection from "@/components/blocks/page-hero-section";

interface CoursesBannerSectionProps {
  currentSeason: string;
  isRegistrationOpen: boolean;
  title: string;
  scheduleDays: string;
  scheduleTimes: string;
  locationName: string;
  locationUrl: string;
}

const CoursesBannerSection: React.FC<CoursesBannerSectionProps> = ({
  currentSeason,
  isRegistrationOpen,
  title,
  scheduleDays,
  scheduleTimes,
  locationName,
  locationUrl,
}) => {
  return (
    <PageHeroSection title={["SCOALA", "DE", "PATINAJ"]} variant={isRegistrationOpen ? "blue" : "dark"}>
      {/* Season + pill */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-xs font-semibold tracking-widest uppercase text-white/50">
          Sezonul {currentSeason}
        </span>
        {isRegistrationOpen ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/20 border border-green-400/30 text-green-300 text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Înscrieri deschise
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 border border-red-400/30 text-red-300 text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
            Înscrieri închise
          </span>
        )}
      </div>

      {/* Heading */}
      <h1 className="text-4xl md:text-6xl font-semibold text-white leading-[1.1] tracking-tight">
        {title}
      </h1>

      {/* Quick info row */}
      <div className="flex flex-wrap gap-x-5 gap-y-2 text-white/70 text-sm font-light border-t border-white/10 pt-5">
        <span className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 shrink-0" />
          {scheduleDays}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 shrink-0" />
          {scheduleTimes}
        </span>
        <a
          href={locationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 hover:text-white transition-colors"
        >
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          {locationName}
        </a>
      </div>

      {/* CTAs */}
      {isRegistrationOpen && (
        <div className="flex flex-col sm:flex-row gap-3 sm:items-start pt-1">
          <Link href="/inscrieri" className="w-full sm:w-auto">
            <SpotlightButton
              variant="white"
              hoverColor="oklch(0.25 0.12 264)"
              hoverTextColor="white"
              className="w-full sm:w-auto px-9 py-3.5 text-sm font-semibold rounded-full"
            >
              Înscrie-te acum
            </SpotlightButton>
          </Link>
          <Button
            variant="outline"
            className="w-full sm:w-auto px-7 py-3.5 h-auto text-sm font-medium rounded-full !bg-transparent text-white border-white/40 hover:border-white hover:!bg-white/10 hover:!text-white"
            asChild
          >
            <Link href="/cursuri/program">Vezi programul</Link>
          </Button>
        </div>
      )}
    </PageHeroSection>
  );
};

export default CoursesBannerSection;
