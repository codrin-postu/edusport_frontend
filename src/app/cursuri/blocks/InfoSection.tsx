import Section from "@/components/ui/section";
import BulletList from "@/components/ui/bullet-list";
import React from "react";

interface InfoSectionProps {
  sectionLabel: string;
  tips: string[];
  closingLine: string;
}

const InfoSection: React.FC<InfoSectionProps> = ({ sectionLabel, tips, closingLine }) => {
  return (
    <Section className="section-compact bg-surface">
      <div className="max-w-prose flex flex-col gap-4">
        <p className="text-label uppercase text-accent">{sectionLabel}</p>
        <BulletList items={tips} />
        <p className="text-caption text-secondary italic pt-1">{closingLine}</p>
      </div>
    </Section>
  );
};

export default InfoSection;
