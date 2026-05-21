"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { cn } from "@/utils/cn";
import PageHeroSection from "@/components/blocks/page-hero-section";
import { Trophy, ChevronDown, ChevronLeft, ChevronRight, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Select } from "@/components/ui/select";
import {
  getPlacementInfo,
  type Season,
  type GalleryImage,
} from "./_data";

// ---------------------------------------------------------------------------
// Gallery Carousel
// ---------------------------------------------------------------------------

const SWIPE_THRESHOLD = 50;
const DESKTOP_PER_PAGE = 3;

function GalleryCarousel({ images }: { images: GalleryImage[] }) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const total = images.length;
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

  // Auto-advance on mobile only
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

  if (images.length === 0) return null;

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
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setLightboxIndex(i)}
              aria-label={`Deschide imaginea: ${img.alt}`}
              className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 shrink-0 cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-edusport-blue"
              style={{ width: "calc((100% - 1.5rem) / 3)" }}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="400px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/50 to-transparent px-4 pb-3 pt-8">
                <p className="text-xs text-white/90 font-light text-left">{img.alt}</p>
              </div>
            </button>
          ))}
        </motion.div>

        <div className="flex items-center justify-center gap-1.5 mt-4">
          {Array.from({ length: maxStart + 1 }).map((_: unknown, i: number) => (
            <button
              key={i}
              onClick={() => setDesktopStart(i)}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                i === desktopStart ? "bg-edusport-blue w-6" : "bg-gray-200 hover:bg-gray-300",
              )}
            />
          ))}
        </div>
      </div>

      {/* Mobile: single image carousel */}
      <div className="md:hidden">
        <div
          className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 select-none cursor-zoom-in"
          onClick={() => setLightboxIndex(current)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") setLightboxIndex(current);
          }}
          aria-label={`Deschide imaginea: ${images[current].alt}`}
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
                src={images[current].src}
                alt={images[current].alt}
                fill
                sizes="100vw"
                className="object-cover pointer-events-none"
                priority={current === 0}
              />
            </motion.div>
          </AnimatePresence>

          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/50 to-transparent px-5 pb-4 pt-10 pointer-events-none">
            <p className="text-sm text-white/90 font-light">{images[current].alt}</p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 mt-4">
          <button
            onClick={prev}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  i === current ? "bg-edusport-blue w-6" : "bg-gray-200 hover:bg-gray-300",
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

      <Lightbox
        images={images}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onChange={setLightboxIndex}
      />
    </div>
  );
}

function Lightbox({
  images,
  index,
  onClose,
  onChange,
}: {
  images: GalleryImage[];
  index: number | null;
  onClose: () => void;
  onChange: (i: number) => void;
}) {
  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") onChange((index + 1) % images.length);
      else if (e.key === "ArrowLeft")
        onChange((index - 1 + images.length) % images.length);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [index, images.length, onChange, onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {index !== null && (
        <motion.div
          className="fixed inset-0 z-[200] bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center gap-4 p-4 sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Închide"
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Desktop: side nav buttons */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange((index - 1 + images.length) % images.length);
            }}
            aria-label="Imaginea anterioară"
            className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange((index + 1) % images.length);
            }}
            aria-label="Imaginea următoare"
            className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white items-center justify-center transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-5xl max-h-full aspect-[4/3]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[index].src}
              alt={images[index].alt}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
            {images[index].alt && (
              <p className="absolute bottom-0 inset-x-0 text-center text-white/85 text-sm pt-6 pb-2 bg-gradient-to-t from-black/40 to-transparent">
                {images[index].alt}
              </p>
            )}
          </motion.div>

          {/* Mobile: nav buttons below the image */}
          <div
            className="flex sm:hidden items-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() =>
                onChange((index - 1 + images.length) % images.length)
              }
              aria-label="Imaginea anterioară"
              className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-white/70 text-xs tabular-nums">
              {index + 1} / {images.length}
            </span>
            <button
              type="button"
              onClick={() => onChange((index + 1) % images.length)}
              aria-label="Imaginea următoare"
              className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

interface AccomplishmentsPageProps {
  bannerTitle?: string;
  bannerSubtitle?: string;
  notableAchievements: string[];
  galleryImages: GalleryImage[];
  seasons: Season[];
}

const AccomplishmentsPage: React.FC<AccomplishmentsPageProps> = ({
  bannerTitle,
  bannerSubtitle,
  notableAchievements,
  galleryImages,
  seasons,
}) => {
  const allCategories = Array.from(
    new Set(
      seasons.flatMap((s) => s.competitions.flatMap((c) => c.results.map((r) => r.category))),
    ),
  );

  const [openSeasons, setOpenSeasons] = useState<Set<string>>(
    () => new Set([seasons[0]?.id]),
  );
  const [openComps, setOpenComps] = useState<Set<string>>(
    () => new Set([`${seasons[0]?.id}::${seasons[0]?.competitions[0]?.name}`]),
  );
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const toggle = (id: string) =>
    setOpenSeasons((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const toggleComp = (key: string) =>
    setOpenComps((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });

  return (
    <div className="min-h-screen bg-white">
      <PageHeroSection
        title={[bannerTitle ?? "REALIZĂRI"]}
        variant="purple"
        breadcrumb={[
          { label: "Despre noi", href: "/despre-noi" },
          { label: "Realizări" },
        ]}
      >
        <h1 className="text-4xl md:text-6xl font-semibold text-white leading-[1.1] tracking-tight">
          Realizări
        </h1>
        <p className="text-white/70 text-base font-light border-t border-white/10 pt-4">
          {bannerSubtitle ?? "Rezultatele sportivilor EduSport la competiții naționale și internaționale de patinaj artistic."}
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
                Realizări notabile
              </h2>
              <p className="text-sm text-gray-400 font-light md:text-right md:max-w-xs">
                Momente de referință din activitatea competițională a clubului.
              </p>
            </div>
          </div>

          {/* Notable achievements bullet list */}
          {notableAchievements.length > 0 && (
            <ul className="flex flex-col gap-3 mb-20">
              {notableAchievements.map((achievement, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-edusport-blue shrink-0" />
                  <span className="text-sm text-gray-700 font-light leading-relaxed">{achievement}</span>
                </li>
              ))}
            </ul>
          )}

          {/* Image carousel */}
          <GalleryCarousel images={galleryImages} />

          {/* Results by season */}
          <div className="flex flex-col gap-3 mb-8">
            <p className="text-xs font-semibold tracking-widest uppercase text-edusport-blue/60">
              Rezultate
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900">
              Competiții pe sezoane
            </h2>
          </div>

          {/* Category filter */}
          {allCategories.length > 0 && (
            <div className="mb-10">
              <Select
                value={activeCategory ?? "__all"}
                onValueChange={(value) =>
                  setActiveCategory(value === "__all" ? null : value)
                }
                options={[
                  { value: "__all", label: "Toate categoriile" },
                  ...allCategories.map((cat) => ({ value: cat, label: cat })),
                ]}
                size="compact"
                className="w-full sm:w-64"
              />
            </div>
          )}

          <div className="flex flex-col gap-4">
            {seasons.map((season) => {
              const isOpen = openSeasons.has(season.id);
              const filteredComps = season.competitions
                .map((comp) => ({
                  ...comp,
                  results: [...comp.results]
                    .filter((r) => activeCategory === null || r.category === activeCategory)
                    .sort((a, b) => a.placement - b.placement),
                }))
                .filter((comp) => comp.results.length > 0);
              const resultCount = filteredComps.reduce((s, c) => s + c.results.length, 0);
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
                      {filteredComps.length === 0 ? (
                        <p className="text-xs text-gray-400 font-light pb-2">
                          Niciun rezultat pentru categoria selectată.
                        </p>
                      ) : filteredComps.map((comp) => {
                        const compKey = `${season.id}::${comp.name}`;
                        const isCompOpen = openComps.has(compKey);
                        return (
                          <div key={`${comp.name}-${comp.date}`}>
                            <button
                              onClick={() => toggleComp(compKey)}
                              className="w-full flex items-center gap-2 py-2 text-left hover:opacity-70 transition-opacity"
                            >
                              <div className="flex flex-col gap-0.5 min-w-0">
                                <div className="flex items-center gap-2">
                                  <h4 className="text-sm font-semibold text-gray-900">{comp.name}</h4>
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
                              <ChevronDown
                                className={cn(
                                  "w-3.5 h-3.5 text-gray-400 shrink-0 ml-auto transition-transform duration-200",
                                  isCompOpen && "rotate-180",
                                )}
                              />
                            </button>

                            {isCompOpen && (
                              <div className="flex flex-col gap-1.5 mt-2 mb-2">
                                {comp.results.map((result, idx) => {
                                  const info = getPlacementInfo(result.placement);
                                  return (
                                    <div
                                      key={idx}
                                      className="relative overflow-hidden flex items-center gap-3 px-4 py-2.5 rounded-xl border border-gray-100 bg-white"
                                    >
                                      {info.accent && (
                                        <svg
                                          aria-hidden
                                          className="absolute inset-y-0 -left-4 h-full w-20 pointer-events-none"
                                          viewBox="0 0 80 100"
                                          preserveAspectRatio="none"
                                          fill="none"
                                          style={{ color: info.accent }}
                                        >
                                          {/* Thick slanted line */}
                                          <path
                                            d="M 46 -10 L 22 110"
                                            stroke="currentColor"
                                            strokeWidth="11"
                                            opacity="0.22"
                                          />
                                          {/* Second thick slanted line */}
                                          <path
                                            d="M 63 -10 L 39 110"
                                            stroke="currentColor"
                                            strokeWidth="11"
                                            opacity="0.28"
                                          />
                                          {/* Thin slanted line */}
                                          <path
                                            d="M 75.5 -10 L 51.5 110"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            opacity="0.32"
                                          />
                                        </svg>
                                      )}
                                      <span className="relative text-sm font-medium text-gray-900 min-w-0">
                                        {result.athlete}
                                      </span>
                                      <span className="relative text-xs text-gray-400 font-light hidden sm:inline">
                                        {result.category}
                                      </span>
                                      <span className="relative ml-auto text-xs text-gray-400 font-light tabular-nums shrink-0 w-16 text-right">
                                        {result.score.toFixed(2)} pts
                                      </span>
                                      <span
                                        className={cn(
                                          "relative text-xs font-semibold uppercase tracking-wider shrink-0 w-16 text-right",
                                          info.textClass,
                                        )}
                                      >
                                        {info.label}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
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
