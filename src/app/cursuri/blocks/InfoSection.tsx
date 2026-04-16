import Section from "@/components/ui/section";
import { cn } from "@/utils/cn";
import { Info } from "lucide-react";
import React from "react";

interface InfoSectionProps {
  sectionLabel: string;
  tips: string[];
  closingLine: string;
}

const InfoSection: React.FC<InfoSectionProps> = ({ sectionLabel, tips, closingLine }) => {
  return (
    <Section className={cn("py-12", "bg-white")}>
        <div className="max-w-2xl mx-auto flex flex-col gap-4">
          <p className="text-xs font-semibold tracking-widest uppercase text-edusport-blue/60">
            {sectionLabel}
          </p>
          <ul className="flex flex-col gap-2">
            {tips.map((tip, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-500 font-light">
                <Info className="w-3.5 h-3.5 text-edusport-blue/50 shrink-0 mt-0.5" />
                {tip}
              </li>
            ))}
          </ul>
          <p className="text-xs text-gray-400 italic pt-1">{closingLine}</p>
        </div>
    </Section>
  );
};

export default InfoSection;
