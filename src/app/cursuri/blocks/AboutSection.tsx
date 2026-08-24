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
    <Section className="py-20 bg-retro-cream">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <span className="text-eyebrow font-bold uppercase text-rust">
              {eyebrow}
            </span>
            <h2 className="font-display text-display-sm font-extrabold text-navy leading-[1.05] tracking-[-0.4px]">
              {heading}
            </h2>
          </div>

          <div className="flex flex-col gap-4 text-navy/65 text-base leading-relaxed">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            {bullets.map(({ Icon, text }, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-navy">
                <Icon className="w-5 h-5 shrink-0 text-rust" strokeWidth={1.8} />
                {text}
              </div>
            ))}
          </div>

          <Link
            href="/cursuri/program"
            className="w-fit link-underline-rust text-sm font-bold uppercase tracking-[0.03em] text-navy"
          >
            Vezi programul complet
          </Link>
        </div>

        <div className="border-[1.5px] border-navy shadow-[8px_8px_0_rgba(14,26,60,0.16)] overflow-hidden">
          <YoutubeEmbed
            url={videoUrl}
            title={videoLabel}
            label={videoLabel}
            className="rounded-none shadow-none"
          />
        </div>
      </div>
    </Section>
  );
};

export default AboutSection;
