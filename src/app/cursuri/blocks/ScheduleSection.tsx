import Section from "@/components/ui/section";
import { WeekendNote } from "@/components/ui/weekend-note";
import { cn } from "@/utils/cn";
import Icon from "@/components/ui/icon";
import BulletList from "@/components/ui/bullet-list";
import Image from "next/image";
import React from "react";

interface ScheduleGroup {
  timeSlot: string;
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
    <>
    <Section className={cn("pt-12 md:pt-16 pb-24 md:pb-24 bg-surface", "overflow-hidden")}>
        <div className="max-w-content mx-auto mb-12 md:mb-12">
          <span className="text-label uppercase text-accent">
            Sâmbătă &amp; Duminică
          </span>
          <h2 className="text-heading text-primary mt-2">
            Program Școala de Patinaj
          </h2>
        </div>
        {/* Notebook page */}
        <div className="max-w-content mx-auto relative">
          {/* Card with overflow-hidden so holes/margin line are clipped */}
          <div
            className="relative overflow-hidden shadow-paper"
            style={{
              transform: "rotate(-2deg)",
              transformOrigin: "top center",
              background: "var(--color-surface-paper)",
              backgroundImage: `
                repeating-linear-gradient(
                  transparent,
                  transparent 31px,
                  rgba(14,26,60,0.10) 31px,
                  rgba(14,26,60,0.10) 32px
                )
              `,
              backgroundSize: "100% 32px",
              backgroundPositionY: "48px",
            }}
          >
            {/* Margin line (rust) */}
            <div
              className="absolute top-0 bottom-0 left-[72px] w-px"
              style={{ background: "var(--color-rust)", opacity: 0.5 }}
            />

            {/* Spiral holes column */}
            <div className="absolute top-0 bottom-0 left-0 w-[72px] flex flex-col items-center pt-6 gap-8 pointer-events-none">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="w-5 h-5 border-2 border-line-subtle bg-surface shrink-0"
                  style={{ boxShadow: "inset 0 1px 3px rgba(14,26,60,0.15)" }}
                />
              ))}
            </div>

            {/* Page content - left-padded past margin */}
            <div className="pl-24 pr-6 pb-8" style={{ paddingTop: "16px" }}>
              {/* Subtitle, then one empty ruled line */}
              <p
                className="text-body font-semibold text-primary"
                style={{ lineHeight: "32px", margin: 0 }}
              >
                {scheduleSubtitle || "Sâmbătă & Duminică · 50 min / ședință"}
              </p>
              <div aria-hidden style={{ height: "32px" }} />

              {/* Two-column layout on wide screens */}
              <div className="grid grid-cols-1 sm:grid-cols-2 sm:divide-x sm:divide-line-subtle">
                {scheduleGroups.map((group, groupIndex) => (
                  <div key={groupIndex} className={groupIndex === 1 ? "sm:pl-6" : "sm:pr-6"}>
                    {/* Time slot line */}
                    <p
                      className="text-body font-semibold text-primary"
                      style={{ lineHeight: "32px", margin: 0 }}
                    >
                      {group.timeSlot}
                    </p>

                    {/* Course names - each on its own ruled line */}
                    {group.courses.map((course, courseIndex) => (
                      <p
                        key={courseIndex}
                        className="text-body-sm text-secondary"
                        style={{ lineHeight: "32px", margin: 0, paddingLeft: "1.25rem" }}
                      >
                        - {course}
                      </p>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            {/* Handwritten note */}
            <WeekendNote
              className="absolute pointer-events-none select-none w-auto"
              style={{ right: 26, bottom: 12, height: 30, transform: "rotate(-7deg)", color: "#dc7f7d" }}
            />

            {/* Pencil doodle - scattered hand-drawn stars */}
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
                {/* Large star - bottom right area */}
                <g transform="translate(420,30) rotate(15)">
                  <path d="M0,-18 L4,-7 L16,-7 L7,0 L10,12 L0,5 L-10,12 L-7,0 L-16,-7 L-4,-7 Z" stroke="var(--color-navy)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </g>
                {/* Medium star - mid right, higher */}
                <g transform="translate(360,55) rotate(-20)">
                  <path d="M0,-13 L3,-5 L11,-5 L5,0 L7,9 L0,4 L-7,9 L-5,0 L-11,-5 L-3,-5 Z" stroke="var(--color-navy)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </g>
                {/* Small star - lower mid */}
                <g transform="translate(290,68) rotate(8)">
                  <path d="M0,-9 L2,-3 L8,-3 L3,1 L5,7 L0,3 L-5,7 L-3,1 L-8,-3 L-2,-3 Z" stroke="var(--color-navy)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </g>
                {/* Tiny star - scattered upper-ish */}
                <g transform="translate(460,62) rotate(-10)">
                  <path d="M0,-7 L1.5,-2.5 L6,-2.5 L2.5,0.5 L4,5 L0,2.5 L-4,5 L-2.5,0.5 L-6,-2.5 L-1.5,-2.5 Z" stroke="var(--color-navy)" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
                </g>
                {/* Tiny star - far left scatter */}
                <g transform="translate(160,72) rotate(25)">
                  <path d="M0,-7 L1.5,-2.5 L6,-2.5 L2.5,0.5 L4,5 L0,2.5 L-4,5 L-2.5,0.5 L-6,-2.5 L-1.5,-2.5 Z" stroke="var(--color-navy)" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
                </g>
                {/* Medium star - left area */}
                <g transform="translate(220,45) rotate(-35)">
                  <path d="M0,-10 L2,-4 L9,-4 L4,0 L6,7 L0,3 L-6,7 L-4,0 L-9,-4 L-2,-4 Z" stroke="var(--color-navy)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
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

        </div>
    </Section>

      {/* Disclaimers — full-width navy band */}
      <section className="bg-surface-dark">
        <div className="w-full max-w-content mx-auto gutter section-compact">
          <div className="max-w-prose mx-auto">
            <div className="flex items-start gap-3 mb-4">
              <Icon name="info" className="text-mustard mt-0.5" />
              <p className="text-label uppercase text-primary-on-dark">
                Informații importante
              </p>
            </div>
            <BulletList items={disclaimers ?? []} onDark />
          </div>
        </div>
      </section>
    </>
  );
};

export default ScheduleSection;
