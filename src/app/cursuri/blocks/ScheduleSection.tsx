import Section from "@/components/ui/section";
import { cn } from "@/utils/cn";
import { Info } from "lucide-react";
import Image from "next/image";
import React from "react";

interface ScheduleGroup {
  timeSlot: string;
  schedule?: string;
  duration?: string;
  courses: string[];
}

interface ScheduleSectionProps {
  scheduleGroups: ScheduleGroup[];
  scheduleSubtitle?: string | null;
  disclaimers?: string[] | null;
}

const ScheduleSection: React.FC<ScheduleSectionProps> = ({
  scheduleGroups,
  scheduleSubtitle,
  disclaimers,
}) => {
  return (
    <Section className={cn("py-12 md:py-16", "overflow-hidden")}>
        {/* Notebook page */}
        <div className="max-w-4xl mx-auto relative">
          {/* Yoga sticker — right side of notebook, below the pencil */}
          <div
            className="hidden md:block absolute pointer-events-none"
            style={{
              top: "110px",
              right: "-1rem",
              transform: "translate(-30%, 0%) rotate(-15deg)",
              width: "110px",
              zIndex: 20,
            }}
          >
            <Image
              src="/images/stickers/yoga.png"
              alt=""
              width={240}
              height={240}
              loading="lazy"
              style={{
                width: "100%",
                height: "auto",
                filter: "drop-shadow(2px 4px 6px rgba(0,0,0,0.25))",
              }}
            />
          </div>
          {/* Card with overflow-hidden so holes/margin line are clipped */}
          <div
            className="relative rounded-none shadow-[4px_6px_20px_rgba(0,0,0,0.18)] overflow-hidden"
            style={{
              transform: "rotate(-2deg)",
              transformOrigin: "top center",
              background: "#faf8f3",
              backgroundImage: `
                repeating-linear-gradient(
                  transparent,
                  transparent 31px,
                  #c8d8e8 31px,
                  #c8d8e8 32px
                )
              `,
              backgroundSize: "100% 32px",
              backgroundPositionY: "48px",
            }}
          >
            {/* Red margin line */}
            <div
              className="absolute top-0 bottom-0 left-[72px] w-px"
              style={{ background: "#e87c7c", opacity: 0.6 }}
            />

            {/* Spiral holes column */}
            <div className="absolute top-0 bottom-0 left-0 w-[72px] flex flex-col items-center pt-[22px] gap-[32px] pointer-events-none">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="w-5 h-5 rounded-full border-2 border-gray-300 bg-white shadow-inner shrink-0"
                  style={{ boxShadow: "inset 0 1px 3px rgba(0,0,0,0.15)" }}
                />
              ))}
            </div>

            {/* Page content — left-padded past margin */}
            <div className="pl-[88px] pr-6 pb-8" style={{ paddingTop: "16px" }}>
              {/* Section label */}
              <p
                className="text-xs font-semibold tracking-widest uppercase text-edusport-blue/60"
                style={{ lineHeight: "32px", margin: 0 }}
              >
                Orarul Cursurilor
              </p>

              {/* Subtitle */}
              <p
                className="text-gray-800 font-semibold text-xl"
                style={{ lineHeight: "32px", margin: 0 }}
              >
                {scheduleSubtitle || "Sâmbătă & Duminică · 50 min / ședință"}
              </p>

              {/* Two-column layout on wide screens */}
              <div className="grid grid-cols-1 sm:grid-cols-2 sm:divide-x sm:divide-dashed sm:divide-[#c8d8e8]">
                {scheduleGroups.map((group, groupIndex) => (
                  <div key={groupIndex} className={groupIndex === 1 ? "sm:pl-6" : "sm:pr-6"}>
                    {/* Time slot line */}
                    <p
                      className="text-gray-800 font-bold text-lg"
                      style={{ lineHeight: "32px", margin: 0 }}
                    >
                      {group.timeSlot}
                    </p>

                    {/* Course names — each on its own ruled line */}
                    {group.courses.map((course, courseIndex) => (
                      <p
                        key={courseIndex}
                        className="text-gray-600 text-sm"
                        style={{ lineHeight: "32px", margin: 0, paddingLeft: "1.25rem" }}
                      >
                        — {course}
                      </p>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            {/* Pencil doodle — scattered hand-drawn stars */}
            <div className="absolute bottom-0 right-0 left-[88px] pointer-events-none" style={{ height: "90px" }}>
              <svg
                width="100%"
                height="90"
                viewBox="0 0 500 90"
                preserveAspectRatio="xMaxYMax meet"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ opacity: 0.15 }}
              >
                {/* Large star — bottom right area */}
                <g transform="translate(420,30) rotate(15)">
                  <path d="M0,-18 L4,-7 L16,-7 L7,0 L10,12 L0,5 L-10,12 L-7,0 L-16,-7 L-4,-7 Z" stroke="#2a1a0a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </g>
                {/* Medium star — mid right, higher */}
                <g transform="translate(360,55) rotate(-20)">
                  <path d="M0,-13 L3,-5 L11,-5 L5,0 L7,9 L0,4 L-7,9 L-5,0 L-11,-5 L-3,-5 Z" stroke="#2a1a0a" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </g>
                {/* Small star — lower mid */}
                <g transform="translate(290,68) rotate(8)">
                  <path d="M0,-9 L2,-3 L8,-3 L3,1 L5,7 L0,3 L-5,7 L-3,1 L-8,-3 L-2,-3 Z" stroke="#2a1a0a" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </g>
                {/* Tiny star — scattered upper-ish */}
                <g transform="translate(460,62) rotate(-10)">
                  <path d="M0,-7 L1.5,-2.5 L6,-2.5 L2.5,0.5 L4,5 L0,2.5 L-4,5 L-2.5,0.5 L-6,-2.5 L-1.5,-2.5 Z" stroke="#2a1a0a" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
                </g>
                {/* Tiny star — far left scatter */}
                <g transform="translate(160,72) rotate(25)">
                  <path d="M0,-7 L1.5,-2.5 L6,-2.5 L2.5,0.5 L4,5 L0,2.5 L-4,5 L-2.5,0.5 L-6,-2.5 L-1.5,-2.5 Z" stroke="#2a1a0a" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
                </g>
                {/* Medium star — left area */}
                <g transform="translate(220,45) rotate(-35)">
                  <path d="M0,-10 L2,-4 L9,-4 L4,0 L6,7 L0,3 L-6,7 L-4,0 L-9,-4 L-2,-4 Z" stroke="#2a1a0a" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </g>
              </svg>
            </div>
          </div>

          {/* Pencil overlaid at a shallow angle across the top */}
          <div
            className="hidden md:block absolute top-0 right-0 pointer-events-none"
            style={{
              transform: "translate(10%, -38%) rotate(12deg)",
              width: "500px",
              zIndex: 10,
            }}
          >
            <Image
              src="/images/pencil.png"
              alt=""
              width={800}
              height={200}
              loading="lazy"
              style={{
                width: "100%",
                height: "auto",
                filter: "drop-shadow(1px 3px 3px rgba(0,0,0,0.35))",
              }}
            />
          </div>

          {/* Disclaimers */}
          <div className="mt-8 rounded-2xl border border-amber-200/60 bg-amber-50/50 px-6 py-5">
            <div className="flex items-start gap-3 mb-4">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs font-semibold uppercase tracking-widest text-amber-700">
                Informații importante
              </p>
            </div>
            <ul className="space-y-3">
              {(disclaimers ?? []).map((text, i) => (
                <li
                  key={i}
                  className="flex gap-3 text-sm text-gray-600 leading-relaxed"
                >
                  <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400" />
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </div>
    </Section>
  );
};

export default ScheduleSection;
