import Link from "@/components/ui/link";
import Section from "@/components/ui/section";
import MetaList, { type MetaListItem } from "@/components/ui/meta-list";
import YoutubeEmbed from "@/components/blocks/youtube-embed/YoutubeEmbed";
import Card from "@/components/ui/card";
import SectionHeader from "@/components/ui/section-header";
import React from "react";

interface AboutSectionProps {
  eyebrow: string;
  heading: string;
  content?: string;
  /** Rink address (site-settings contact data). Renders as a quiet link, like the banner. */
  locationDisplay: string;
  /** Opens in a new tab; falls back to a Google Maps search built from the address. */
  locationHref?: string;
  levelsBullet: string;
  coachesBullet: string;
  videoUrl: string;
  videoLabel: string;
}

const AboutSection: React.FC<AboutSectionProps> = ({
  eyebrow,
  heading,
  content,
  locationDisplay,
  locationHref,
  levelsBullet,
  coachesBullet,
  videoUrl,
  videoLabel,
}) => {
  const paragraphs = (content ?? "").split("\n\n").filter(Boolean);
  const bullets: MetaListItem[] = [
    { icon: "map-pin", text: locationDisplay, href: locationHref, external: true },
    { icon: "users", text: levelsBullet },
    { icon: "award", text: coachesBullet },
  ];

  return (
    <Section className="py-24 bg-surface">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div className="flex flex-col gap-8">
          <SectionHeader eyebrow={eyebrow} title={heading} />

          <div className="text-body flex flex-col gap-4 text-secondary">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <MetaList layout="stack" items={bullets} />

          <Link
            href="/cursuri/program"
            className="text-label w-fit uppercase"
          >
            Vezi programul complet
          </Link>
        </div>

        <Card padding="none" className="overflow-hidden">
          <YoutubeEmbed
            url={videoUrl}
            title={videoLabel}
            label={videoLabel}
            className="shadow-none"
          />
        </Card>
      </div>
    </Section>
  );
};

export default AboutSection;
