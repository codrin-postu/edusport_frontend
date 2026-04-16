import Link from "@/components/ui/link";
import Section from "@/components/ui/section";
import SectionHeader from "@/components/ui/section-header";
import { ArrowUpRight, MapPin, Users, Award } from "lucide-react";
import YoutubeEmbed from "@/components/blocks/youtube-embed/YoutubeEmbed";
import React from "react";

interface AboutSectionProps {
  eyebrow: string;
  heading: string;
  content?: string;
  locationBullet: string;
  levelsBullet: string;
  coachesBullet: string;
  videoUrl: string;
  videoLabel: string;
}

const AboutSection: React.FC<AboutSectionProps> = ({
  eyebrow,
  heading,
  content,
  locationBullet,
  levelsBullet,
  coachesBullet,
  videoUrl,
  videoLabel,
}) => {
  const paragraphs = (content ?? "").split("\n\n").filter(Boolean);

  return (
    <Section className="py-20 bg-white">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text content */}
          <div className="flex flex-col gap-8">
            <SectionHeader eyebrow={eyebrow} title={heading} />

            <div className="flex flex-col gap-4 text-gray-500 text-base leading-relaxed font-light">
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            {/* Key info */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="w-8 h-8 rounded-full bg-edusport-blue/8 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-edusport-blue" />
                </div>
                {locationBullet}
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="w-8 h-8 rounded-full bg-edusport-blue/8 flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4 text-edusport-blue" />
                </div>
                {levelsBullet}
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="w-8 h-8 rounded-full bg-edusport-blue/8 flex items-center justify-center shrink-0">
                  <Award className="w-4 h-4 text-edusport-blue" />
                </div>
                {coachesBullet}
              </div>
            </div>

            <Link
              href="/cursuri/program"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-edusport-blue hover:text-edusport-blue/70 transition-colors w-fit"
            >
              Vezi programul complet
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Video */}
          <YoutubeEmbed url={videoUrl} title={videoLabel} label={videoLabel} />
        </div>
    </Section>
  );
};

export default AboutSection;
