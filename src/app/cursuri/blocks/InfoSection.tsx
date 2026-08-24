import Section from "@/components/ui/section";
import React from "react";

interface InfoSectionProps {
  sectionLabel: string;
  tips: string[];
  closingLine: string;
}

const InfoSection: React.FC<InfoSectionProps> = ({ sectionLabel, tips, closingLine }) => {
  return (
    <Section className="py-12 bg-retro-cream">
      <div className="max-w-2xl mx-auto flex flex-col gap-4">
        <p className="text-eyebrow font-bold uppercase text-rust">{sectionLabel}</p>
        <ul className="flex flex-col gap-2.5">
          {tips.map((tip, index) => (
            <li key={index} className="flex items-start gap-2.5 text-sm text-navy leading-relaxed">
              <span className="shrink-0 font-extrabold text-rust">›</span>
              {tip}
            </li>
          ))}
        </ul>
        <p className="text-xs text-navy/50 italic pt-1">{closingLine}</p>
      </div>
    </Section>
  );
};

export default InfoSection;
