import Link from "@/components/ui/link";
import Section from "@/components/ui/section";
import { MapPin, Users, Award } from "lucide-react";
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
  const bullets = [
    { Icon: MapPin, text: locationBullet },
    { Icon: Users, text: levelsBullet },
    { Icon: Award, text: coachesBullet },
  ];

  return (
    <Section className="py-24 bg-surface">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <span className="text-label uppercase text-accent">
              {eyebrow}
            </span>
            <h2 className="text-heading text-primary">
              {heading}
            </h2>
          </div>

          <div className="text-body flex flex-col gap-4 text-secondary">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            {bullets.map(({ Icon, text }, i) => (
              <div key={i} className="text-body-sm flex items-center gap-3 text-primary">
                <Icon className="w-5 h-5 shrink-0 text-accent" strokeWidth={1.8} />
                {text}
              </div>
            ))}
          </div>

          <Link
            href="/cursuri/program"
            className="text-label w-fit link-underline-rust uppercase text-primary"
          >
            Vezi programul complet
          </Link>
        </div>

        <div className="border-retro border-line shadow-retro overflow-hidden">
          <YoutubeEmbed
            url={videoUrl}
            title={videoLabel}
            label={videoLabel}
            className="shadow-none"
          />
        </div>
      </div>
    </Section>
  );
};

export default AboutSection;
