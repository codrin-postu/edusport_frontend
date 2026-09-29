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
    <Section className="pb-12 md:pb-16 bg-surface">
      <div className="flex flex-col gap-4">
        <p className="text-label uppercase text-accent">{sectionLabel}</p>
        <BulletList items={tips} />
        <p className="text-caption text-secondary italic pt-1">{closingLine}</p>
      </div>
    </Section>
  );
};

export default InfoSection;
