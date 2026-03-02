"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { cn } from "@/utils/cn";
import PageHeroSection from "@/components/blocks/page-hero-section";
import { Trophy, Medal, Award, ChevronDown, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Placement = "gold" | "silver" | "bronze" | "4th" | "5th" | "6th" | "top10";

interface Result {
  athlete: string;
  category: string;
  placement: Placement;
  score: number; // total score (e.g. 85.42)
}

interface Competition {
  name: string;
  date: string;
  location: string;
  level: "national" | "international";
  results: Result[];
}

interface Season {
  id: string;
  label: string;
  competitions: Competition[];
}

// ---------------------------------------------------------------------------
// Placeholder data — replace with real results
// ---------------------------------------------------------------------------

const SEASONS: Season[] = [
  {
    id: "2024-2025",
    label: "Sezon 2024–2025",
    competitions: [
      {
        name: "Campionatul Național de Patinaj Artistic",
        date: "Martie 2025",
        location: "București",
        level: "national",
        results: [
          { athlete: "Maria Popescu", category: "Avansați – Juniors", placement: "gold", score: 92.15 },
          { athlete: "Andrei Ionescu", category: "Intermediari", placement: "silver", score: 78.30 },
          { athlete: "Elena Dumitrescu", category: "Avansați – Seniors", placement: "bronze", score: 88.47 },
          { athlete: "Luca Stan", category: "Intermediari", placement: "4th", score: 74.12 },
          { athlete: "Ana Vasile", category: "Avansați – Juniors", placement: "6th", score: 81.60 },
        ],
      },
      {
        name: "Cupa României",
        date: "Ianuarie 2025",
        location: "Cluj-Napoca",
        level: "national",
        results: [
          { athlete: "Sofia Marin", category: "Începători", placement: "gold", score: 65.80 },
          { athlete: "Maria Popescu", category: "Avansați – Juniors", placement: "gold", score: 89.92 },
          { athlete: "Luca Stan", category: "Intermediari", placement: "silver", score: 72.55 },
          { athlete: "Andrei Ionescu", category: "Intermediari", placement: "5th", score: 68.40 },
        ],
      },
      {
        name: "International Ice Cup",
        date: "Noiembrie 2024",
        location: "Budapesta, Ungaria",
        level: "international",
        results: [
          { athlete: "Maria Popescu", category: "Avansați – Juniors", placement: "silver", score: 86.73 },
          { athlete: "Elena Dumitrescu", category: "Avansați – Seniors", placement: "bronze", score: 84.20 },
          { athlete: "Sofia Marin", category: "Începători", placement: "top10", score: 58.15 },
        ],
      },
    ],
  },
  {
    id: "2023-2024",
    label: "Sezon 2023–2024",
    competitions: [
      {
        name: "Campionatul Național de Patinaj Artistic",
        date: "Martie 2024",
        location: "București",
        level: "national",
        results: [
          { athlete: "Maria Popescu", category: "Avansați – Juniors", placement: "gold", score: 87.60 },
          { athlete: "Ana Vasile", category: "Intermediari", placement: "gold", score: 76.45 },
          { athlete: "Luca Stan", category: "Începători", placement: "bronze", score: 62.30 },
          { athlete: "Andrei Ionescu", category: "Începători", placement: "4th", score: 59.85 },
        ],
      },
      {
        name: "Cupa României",
        date: "Decembrie 2023",
        location: "Brașov",
        level: "national",
        results: [
          { athlete: "Elena Dumitrescu", category: "Avansați – Seniors", placement: "silver", score: 82.10 },
          { athlete: "Sofia Marin", category: "Începători", placement: "gold", score: 61.25 },
          { athlete: "Luca Stan", category: "Începători", placement: "5th", score: 55.70 },
        ],
      },
      {
        name: "Skate Vienna Trophy",
        date: "Octombrie 2023",
        location: "Viena, Austria",
        level: "international",
        results: [
          { athlete: "Maria Popescu", category: "Avansați – Juniors", placement: "gold", score: 85.30 },
          { athlete: "Elena Dumitrescu", category: "Avansați – Seniors", placement: "6th", score: 79.15 },
        ],
      },
    ],
  },
  {
    id: "2022-2023",
    label: "Sezon 2022–2023",
    competitions: [
      {
        name: "Campionatul Național de Patinaj Artistic",
        date: "Martie 2023",
        location: "București",
        level: "national",
        results: [
          { athlete: "Ana Vasile", category: "Începători", placement: "gold", score: 64.90 },
          { athlete: "Maria Popescu", category: "Intermediari", placement: "silver", score: 73.25 },
          { athlete: "Andrei Ionescu", category: "Începători", placement: "top10", score: 52.80 },
        ],
      },
      {
        name: "Cupa Carpaților",
        date: "Ianuarie 2023",
        location: "Brașov",
        level: "national",
        results: [
          { athlete: "Elena Dumitrescu", category: "Avansați – Seniors", placement: "gold", score: 80.55 },
          { athlete: "Sofia Marin", category: "Începători", placement: "silver", score: 57.40 },
          { athlete: "Andrei Ionescu", category: "Începători", placement: "bronze", score: 54.15 },
          { athlete: "Luca Stan", category: "Începători", placement: "4th", score: 51.90 },
        ],
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Gallery images — replace src with real competition photos
// ---------------------------------------------------------------------------

const GALLERY_IMAGES = [
  { src: "/images/competitions/1.jpg", alt: "Campionatul Național 2025 — ceremonia de premiere" },
  { src: "/images/competitions/2.jpg", alt: "Cupa României 2025 — program liber" },
  { src: "/images/competitions/3.jpg", alt: "International Ice Cup 2024 — podium" },
  { src: "/images/competitions/4.jpg", alt: "Campionatul Național 2024 — program scurt" },
  { src: "/images/competitions/5.jpg", alt: "Skate Vienna Trophy 2023 — warm-up" },
  { src: "/images/competitions/6.jpg", alt: "Cupa Carpaților 2023 — program artistic" },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const PLACEMENT_CONFIG: Record<Placement, { label: string; bg: string; border: string; text: string; dot: string }> = {
  gold: { label: "Aur", bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", dot: "bg-amber-400" },
  silver: { label: "Argint", bg: "bg-gray-50", border: "border-gray-200", text: "text-gray-600", dot: "bg-gray-400" },
  bronze: { label: "Bronz", bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-700", dot: "bg-orange-400" },
  "4th": { label: "Locul 4", bg: "bg-white", border: "border-gray-100", text: "text-gray-500", dot: "bg-gray-300" },
  "5th": { label: "Locul 5", bg: "bg-white", border: "border-gray-100", text: "text-gray-500", dot: "bg-gray-300" },
  "6th": { label: "Locul 6", bg: "bg-white", border: "border-gray-100", text: "text-gray-500", dot: "bg-gray-300" },
  top10: { label: "Top 10", bg: "bg-white", border: "border-gray-100", text: "text-gray-400", dot: "bg-gray-200" },
};

function countResults(seasons: Season[]) {
  let gold = 0, silver = 0, bronze = 0, total = 0;
  for (const s of seasons)
    for (const c of s.competitions)
      for (const r of c.results) {
        total++;
        if (r.placement === "gold") gold++;
        else if (r.placement === "silver") silver++;
        else if (r.placement === "bronze") bronze++;
      }
  return { gold, silver, bronze, total };
}

function countSeasonResults(season: Season) {
  let count = 0;
  for (const c of season.competitions) count += c.results.length;
  return count;
}

// ---------------------------------------------------------------------------
// Gallery Carousel
// ---------------------------------------------------------------------------

const SWIPE_THRESHOLD = 50;

const DESKTOP_PER_PAGE = 3;

function GalleryCarousel() {
  // Mobile: single image index
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const total = GALLERY_IMAGES.length;
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const go = useCallback(
    (next: number) => {
      setDirection(next > current ? 1 : -1);
      setCurrent(next);
    },
    [current],
  );

  const next = useCallback(() => go((current + 1) % total), [go, current, total]);
  const prev = useCallback(() => go((current - 1 + total) % total), [go, current, total]);

  // Desktop: sliding window of 3, shifts by 1
  const maxStart = Math.max(0, total - DESKTOP_PER_PAGE);
  const [desktopStart, setDesktopStart] = useState(0);

  const nextDesktop = useCallback(
    () => setDesktopStart((s) => Math.min(s + 1, maxStart)),
    [maxStart],
  );
  const prevDesktop = useCallback(
    () => setDesktopStart((s) => Math.max(s - 1, 0)),
    [],
  );

  // Auto-advance only on mobile
  useEffect(() => {
    timeoutRef.current = setTimeout(next, 5000);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [current, next]);

  const mobileVariants = {
    enter: (d: number) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? "-100%" : "100%", opacity: 0 }),
  };


  return (
    <div className="mb-20">
      <div className="flex flex-col gap-3 mb-8">
        <p className="text-xs font-semibold tracking-widest uppercase text-edusport-blue/60">
          Galerie
        </p>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900">
            Imagini de la competiții
          </h2>
          {/* Navigation arrows — desktop */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={prevDesktop}
              className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:border-gray-300 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextDesktop}
              className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:border-gray-300 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Desktop: sliding window of 3 */}
      <div className="hidden md:block relative overflow-hidden">
        <motion.div
          className="flex gap-3"
          animate={{ x: `calc(-${desktopStart} * (33.333% + 0.25rem))` }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        >
          {GALLERY_IMAGES.map((img, i) => (
            <div
              key={i}
              className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 shrink-0"
              style={{ width: "calc((100% - 1.5rem) / 3)" }}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="400px"
                className="object-cover"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/50 to-transparent px-4 pb-3 pt-8">
                <p className="text-xs text-white/90 font-light">{img.alt}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Desktop position indicator */}
        <div className="flex items-center justify-center gap-1.5 mt-4">
          {Array.from({ length: maxStart + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setDesktopStart(i)}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                i === desktopStart
                  ? "bg-edusport-blue w-6"
                  : "bg-gray-200 hover:bg-gray-300",
              )}
            />
          ))}
        </div>
      </div>

      {/* Mobile: single image carousel */}
      <div className="md:hidden">
        <div
          className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 select-none"
        >
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={current}
              custom={direction}
              variants={mobileVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.12}
              onDragEnd={(_e, { offset }) => {
                if (offset.x < -SWIPE_THRESHOLD) next();
                else if (offset.x > SWIPE_THRESHOLD) prev();
              }}
              className="absolute inset-0"
            >
              <Image
                src={GALLERY_IMAGES[current].src}
                alt={GALLERY_IMAGES[current].alt}
                fill
                sizes="100vw"
                className="object-cover pointer-events-none"
                priority={current === 0}
              />
            </motion.div>
          </AnimatePresence>

          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/50 to-transparent px-5 pb-4 pt-10 pointer-events-none">
            <p className="text-sm text-white/90 font-light">
              {GALLERY_IMAGES[current].alt}
            </p>
          </div>
        </div>

        {/* Mobile dots + arrows */}
        <div className="flex items-center justify-center gap-3 mt-4">
          <button
            onClick={prev}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1.5">
            {GALLERY_IMAGES.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  i === current
                    ? "bg-edusport-blue w-6"
                    : "bg-gray-200 hover:bg-gray-300",
                )}
              />
            ))}
          </div>
          <button
            onClick={next}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

const AccomplishmentsPage: React.FC = () => {
  const [openSeasons, setOpenSeasons] = useState<Set<string>>(
    () => new Set([SEASONS[0]?.id]),
  );

  const toggle = (id: string) =>
    setOpenSeasons((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const stats = countResults(SEASONS);

  return (
    <div className="min-h-screen bg-white">
      <PageHeroSection
        title={["REALIZĂRI"]}
        breadcrumb={[
          { label: "Despre noi", href: "/despre-noi/istoric" },
          { label: "Realizări" },
        ]}
      >
        <h1 className="text-4xl md:text-6xl font-semibold text-white leading-[1.1] tracking-tight">
          Realizări
        </h1>
        <p className="text-white/70 text-base font-light border-t border-white/10 pt-4">
          Rezultatele sportivilor EduSport la competiții naționale și
          internaționale de patinaj artistic.
        </p>
      </PageHeroSection>

      <section className="relative z-10 bg-white py-16 md:py-24">
        <div className="w-full max-w-content mx-auto px-4 md:px-8 lg:px-12">
          {/* Section header */}
          <div className="flex flex-col gap-3 mb-16">
            <p className="text-xs font-semibold tracking-widest uppercase text-edusport-blue/60">
              Palmares
            </p>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 max-w-lg">
                Medalii și rezultate
              </h2>
              <p className="text-sm text-gray-400 font-light md:text-right md:max-w-xs">
                Rezultatele sportivilor noștri la competiții oficiale.
              </p>
            </div>
          </div>

          {/* Mobile: simple grid */}
          <div className="grid grid-cols-2 gap-4 mb-20 sm:hidden">
            <div className="flex flex-col items-center gap-2 rounded-2xl border border-gray-100 py-8 px-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
                <Trophy className="w-5 h-5" />
              </div>
              <span className="text-3xl font-semibold text-gray-900">{stats.gold}</span>
              <span className="text-xs text-gray-400 font-light text-center">Medalii de aur</span>
            </div>
            <div className="flex flex-col items-center gap-2 rounded-2xl border border-gray-100 py-8 px-4">
              <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-400 flex items-center justify-center">
                <Medal className="w-5 h-5" />
              </div>
              <span className="text-3xl font-semibold text-gray-900">{stats.silver}</span>
              <span className="text-xs text-gray-400 font-light text-center">Medalii de argint</span>
            </div>
            <div className="flex flex-col items-center gap-2 rounded-2xl border border-gray-100 py-8 px-4">
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-400 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <span className="text-3xl font-semibold text-gray-900">{stats.bronze}</span>
              <span className="text-xs text-gray-400 font-light text-center">Medalii de bronz</span>
            </div>
            <div className="flex flex-col items-center gap-2 rounded-2xl border border-gray-100 py-8 px-4">
              <div className="w-10 h-10 rounded-xl bg-edusport-blue/5 text-edusport-blue flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <span className="text-3xl font-semibold text-gray-900">{stats.total}</span>
              <span className="text-xs text-gray-400 font-light text-center">Total clasări</span>
            </div>
          </div>

          {/* Desktop: podium */}
          <div className="hidden sm:flex items-end justify-center gap-3 mb-20">
            {/* Silver — left */}
            <div className="flex flex-col items-center w-40">
              <div className="flex flex-col items-center gap-1 mb-3">
                <span className="text-3xl font-semibold text-gray-900">{stats.silver}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-t-2xl flex flex-col items-center justify-end py-5 px-3 h-24 border border-gray-200 border-b-0">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Medalii</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Argint</span>
              </div>
            </div>

            {/* Gold — center */}
            <div className="flex flex-col items-center w-40">
              <div className="flex flex-col items-center gap-1 mb-3">
                <span className="text-3xl font-semibold text-gray-900">{stats.gold}</span>
              </div>
              <div className="w-full bg-amber-50 rounded-t-2xl flex flex-col items-center justify-end py-5 px-3 h-32 border border-amber-200 border-b-0">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-400">Medalii</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-600">Aur</span>
              </div>
            </div>

            {/* Bronze — right */}
            <div className="flex flex-col items-center w-40">
              <div className="flex flex-col items-center gap-1 mb-3">
                <span className="text-3xl font-semibold text-gray-900">{stats.bronze}</span>
              </div>
              <div className="w-full bg-orange-50 rounded-t-2xl flex flex-col items-center justify-end py-5 px-3 h-20 border border-orange-200 border-b-0">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-orange-300">Medalii</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-orange-600">Bronz</span>
              </div>
            </div>

            {/* Total */}
            <div className="flex flex-col items-center w-40 ml-4">
              <div className="flex flex-col items-center gap-1 mb-3">
                <span className="text-3xl font-semibold text-gray-900">{stats.total}</span>
              </div>
              <div className="w-full rounded-2xl border border-gray-100 flex flex-col items-center justify-center py-5 px-3 h-16">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Total clasări</span>
              </div>
            </div>
          </div>

          {/* Image carousel */}
          <GalleryCarousel />

          {/* Results by season */}
          <div className="flex flex-col gap-3 mb-12">
            <p className="text-xs font-semibold tracking-widest uppercase text-edusport-blue/60">
              Rezultate
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900">
              Competiții pe sezoane
            </h2>
          </div>

          <div className="flex flex-col gap-4">
            {SEASONS.map((season) => {
              const isOpen = openSeasons.has(season.id);
              const resultCount = countSeasonResults(season);
              return (
                <div key={season.id}>
                  <button
                    onClick={() => toggle(season.id)}
                    className="w-full flex items-center gap-3 py-4 text-left hover:opacity-70 transition-opacity"
                  >
                    <div className="w-8 h-8 rounded-xl bg-edusport-blue/5 text-edusport-blue flex items-center justify-center shrink-0">
                      <Trophy className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-700">
                      {season.label}
                    </h3>
                    <span className="ml-auto text-xs text-gray-400 font-light tabular-nums mr-3">
                      {resultCount} {resultCount === 1 ? "rezultat" : "rezultate"}
                    </span>
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200",
                        isOpen && "rotate-180",
                      )}
                    />
                  </button>

                  {isOpen && (
                    <div className="flex flex-col gap-6 border-l-2 border-l-edusport-blue/10 ml-4 mb-6 pl-6 pt-2">
                      {season.competitions.map((comp) => (
                        <div key={`${comp.name}-${comp.date}`} className="flex flex-col gap-3">
                          {/* Competition header */}
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-semibold text-gray-900">
                                {comp.name}
                              </h4>
                              {comp.level === "international" && (
                                <span className="text-[10px] font-semibold uppercase tracking-wider text-edusport-blue bg-edusport-blue/5 px-2 py-0.5 rounded-full">
                                  Internațional
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-400 font-light">
                              {comp.date} · {comp.location}
                            </p>
                          </div>

                          {/* Results */}
                          <div className="flex flex-col gap-1.5">
                            {comp.results.map((result, idx) => {
                              const config = PLACEMENT_CONFIG[result.placement];
                              return (
                                <div
                                  key={idx}
                                  className={cn(
                                    "flex items-center gap-3 px-4 py-2.5 rounded-xl border",
                                    config.bg,
                                    config.border,
                                  )}
                                >
                                  <div className={cn("w-2 h-2 rounded-full shrink-0", config.dot)} />
                                  <span className="text-sm font-medium text-gray-900 min-w-0">
                                    {result.athlete}
                                  </span>
                                  <span className="text-xs text-gray-400 font-light hidden sm:inline">
                                    {result.category}
                                  </span>
                                  <span className="ml-auto text-xs text-gray-400 font-light tabular-nums shrink-0 w-16 text-right">
                                    {result.score.toFixed(2)} pts
                                  </span>
                                  <span
                                    className={cn(
                                      "text-xs font-semibold uppercase tracking-wider shrink-0 w-14 text-right",
                                      config.text,
                                    )}
                                  >
                                    {config.label}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AccomplishmentsPage;
