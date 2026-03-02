"use client";

import Link from "@/components/ui/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useInView } from "motion/react";
import Image from "next/image";
import React, { useRef } from "react";

const articles = [
  {
    id: 1,
    title: "Campionatul Național de Patinaj Artistic 2024",
    excerpt:
      "Sportivii noștri au obținut rezultate excepționale la Campionatul Național. Echipa EduSport a demonstrat încă o dată calitatea antrenamentelor și dedicarea.",
    date: "15 Martie 2024",
    image: "/images/courses_generated.png",
  },
  {
    id: 2,
    title: "Noi cursuri pentru începători în aprilie",
    date: "8 Martie 2024",
    image: "/images/generated_image.png",
  },
  {
    id: 3,
    title: "Echipamentul de patinaj — ghid pentru părinți",
    excerpt:
      "Tot ce trebuie să știi despre alegerea patinelor, protecțiilor și îmbrăcămintei potrivite pentru primele lecții.",
    date: "2 Martie 2024",
    image: "/images/courses_generated.png",
  },
  {
    id: 4,
    title: "Cum să îți pregătești copilul pentru primul curs",
    date: "20 Februarie 2024",
    image: "/images/generated_image.png",
  },
];

/* ── Hero card ── */
const HeroCard: React.FC<(typeof articles)[0] & { index: number; numberSide: "left" | "right" }> = ({
  title,
  excerpt,
  date,
  image,
  index,
  numberSide,
}) => (
  <div className="relative w-full md:max-w-2xl">
    {/* Number — desktop only, left or right side */}
    <div
      className={`hidden lg:flex absolute top-4 flex-col items-center leading-none select-none ${
        numberSide === "left"
          ? "left-0 -translate-x-full pr-5"
          : "right-0 translate-x-full pl-5"
      }`}
    >
      <span
        className="text-branding-font text-edusport-blue leading-none"
        style={{ fontSize: "clamp(2rem, 5vw, 4rem)", transform: "rotate(-12deg)", display: "inline-block" }}
      >
        {String(index).padStart(2, "0")}
      </span>
    </div>
    {/* Loop flourish — desktop only, mirrors based on side */}
    <svg
      aria-hidden
      className="hidden lg:block absolute pointer-events-none"
      style={{
        ...(numberSide === "left"
          ? { left: "-0.75rem", transform: "translateX(-100%)" }
          : { right: "-0.75rem", transform: "translateX(100%)" }),
        top: "7rem",
        width: 96,
        height: 67,
        overflow: "visible",
      }}
      viewBox="0 0 96 67"
      fill="none"
    >
      {numberSide === "left" ? (
        <path
          d="M4.21999 0.169617C-6.77992 30.6696 8.21994 44.1696 28.22 44.1696M28.22 44.1696C50.2199 46.1696 48.72 30.3884 43.72 26.1696C38.72 21.9509 24.7199 21.1696 28.22 44.1696ZM28.22 44.1696C29.7199 67.1696 70.2199 73.6696 94.7199 54.6696"
          stroke="var(--color-edusport-blue)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.6"
        />
      ) : (
        <path
          d="M91.78 0.169617C102.78 30.6696 87.78 44.1696 67.78 44.1696M67.78 44.1696C45.78 46.1696 47.28 30.3884 52.28 26.1696C57.28 21.9509 71.28 21.1696 67.78 44.1696ZM67.78 44.1696C66.28 67.1696 25.78 73.6696 1.28 54.6696"
          stroke="var(--color-edusport-blue)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.6"
        />
      )}
    </svg>

    {/* Blue offset shadow + hover/tap reveal */}
    <div className="group relative">
      <div
        aria-hidden
        className="absolute inset-0 bg-edusport-blue pointer-events-none transition-transform duration-300 ease-out group-hover:translate-x-4 group-hover:translate-y-4"
      />
      <a href="/news" className="relative block z-10">
        {/* Image — full width */}
        <div className="relative w-full aspect-[16/6] overflow-hidden bg-gray-100">
          {image && (
            <Image
              src={image}
              alt={title}
              fill
              loading="lazy"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          )}
          {/* Mobile: full-image gradient for date legibility */}
          <div className="md:hidden absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent pointer-events-none" />
          <div className="md:hidden absolute top-3 right-3 flex flex-col items-center leading-none select-none">
            <span className="text-branding-font text-white leading-none text-2xl">
              {date.split(" ")[0]}
            </span>
            <span className="text-[9px] font-bold tracking-widest uppercase text-white/70 mt-0.5">
              {date.split(" ")[1]?.slice(0, 3)}
            </span>
            <span className="text-[9px] font-bold tracking-widest text-white/50">
              {date.split(" ")[2]}
            </span>
          </div>
        </div>

        {/* Below image: title+excerpt left | divider | date right — desktop only */}
        <div className="flex items-stretch py-5 pb-7 bg-white">
          {/* Left — title & excerpt */}
          <div className="flex-1 pr-6 flex flex-col gap-2">
            <h3 className="text-base md:text-2xl font-bold text-gray-900 leading-tight">
              {title}
            </h3>
            {excerpt && (
              <p className="text-sm text-gray-500 line-clamp-2 hidden md:block">{excerpt}</p>
            )}
          </div>

          {/* Divider — desktop only */}
          <div className="hidden md:block w-px bg-gray-200 self-stretch" />

          {/* Right — date, desktop only */}
          <div className="hidden md:flex flex-col items-center justify-center px-8 min-w-[130px]">
            <div className="flex flex-col items-center leading-none select-none">
              <span
                className="text-branding-font text-edusport-blue leading-none"
                style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
              >
                {date.split(" ")[0]}
              </span>
              <span className="text-[10px] font-bold tracking-widest uppercase text-edusport-blue/70 mt-1">
                {date.split(" ")[1]?.slice(0, 3)}
              </span>
              <span className="text-[10px] font-bold tracking-widest text-edusport-blue/40">
                {date.split(" ")[2]}
              </span>
            </div>
          </div>
        </div>
      </a>
    </div>
  </div>
);

/* ── Path draw transition ── */
const PATH_LEN = 1700;

const CurveTransition: React.FC<{ inView: boolean }> = ({ inView }) => (
  <div
    aria-hidden
    className="absolute top-0 left-0 w-full pointer-events-none"
    style={{ height: 160 }}
  >
    <svg
      width="100%"
      height="160"
      viewBox="0 0 1440 160"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      style={{ overflow: "visible" }}
    >
      <motion.path
        d="M-80,40 Q720,-50 1520,40"
        stroke="var(--color-edusport-blue)"
        strokeWidth="50"
        strokeLinecap="butt"
        opacity="1"
        initial={{ strokeDasharray: PATH_LEN, strokeDashoffset: PATH_LEN }}
        animate={inView ? { strokeDashoffset: 0 } : {}}
        transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
      />
      <motion.path
        d="M-80,110 Q720,20 1520,110"
        stroke="var(--color-edusport-blue)"
        strokeWidth="28"
        strokeLinecap="butt"
        opacity="0.25"
        initial={{ strokeDasharray: PATH_LEN, strokeDashoffset: PATH_LEN }}
        animate={inView ? { strokeDashoffset: 0 } : {}}
        transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1], delay: 0.15 }}
      />
    </svg>
  </div>
);

/* ── Section ── */
const LatestArticleSection: React.FC = () => {
  const [hero, ...grid] = articles;
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} className="relative mt-16 py-20 bg-white">
      <CurveTransition inView={inView} />
      {/* Ghost background text */}
      <div
        aria-hidden
        className="absolute left-0 right-0 overflow-hidden pointer-events-none select-none flex items-center justify-center"
        style={{ top: "calc(160px + 100px)", transform: "translateY(-50%)" }}
      >
        <span
          className="text-branding-font text-gray-900 opacity-[0.05] leading-none whitespace-nowrap"
          style={{ fontSize: "clamp(3rem, 17vw, 16rem)" }}
        >
          NOUTĂȚI
        </span>
      </div>

      <div className="relative w-full max-w-content mx-auto px-4 md:px-8 lg:px-12">

        {/* Extra horizontal padding so numbers have space outside cards on desktop */}
        <div className="max-w-5xl mx-auto flex flex-col gap-6 px-3 sm:px-6 lg:px-24">
          {/* Header */}
          {/* <div className="flex flex-col gap-2 mb-2">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-edusport-blue">
              Noutăți
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight font-['League_Spartan']">
              Ultimele articole
            </h2>
          </div> */}

          {/* Articles — 2 rows, hero style, alternating number sides */}
          <div className="flex flex-col gap-10">
            <div className="flex justify-end" style={{ marginTop: "calc(9rem + 100px)" }}>
              <HeroCard {...hero} index={1} numberSide="left" />
            </div>
            <div className="flex justify-start">
              <HeroCard {...grid[0]} index={2} numberSide="right" />
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="flex justify-center pt-8">
            <Link
              href="/news"
              className="inline-flex items-center gap-1 text-sm font-semibold text-edusport-blue hover:underline underline-offset-4"
            >
              Vezi toate articolele
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LatestArticleSection;
