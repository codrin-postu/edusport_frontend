"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { cn } from "@/utils/cn";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

/**
 * Reusable image gallery with desktop sliding window (3-up), mobile single-
 * image carousel with swipe + auto-advance, and a full-screen lightbox.
 *
 * Used by:
 *  - /despre-noi/realizari — competition photos.
 *  - /noutati/[slug] — per-article photo galleries.
 *
 * For large galleries (10+ images), the pagination row switches from dots to
 * a numeric "current / total" counter so the controls stay legible.
 */

export interface GalleryImage {
  src: string;
  alt: string;
}

interface GalleryCarouselProps {
  images: GalleryImage[];
  /** Small uppercase eyebrow above the title — omit to hide. */
  eyebrow?: string;
  /** Large heading — omit to render only the carousel without a header. */
  title?: string;
  /** Bottom margin override; default `mb-20` matches the realizari layout. */
  className?: string;
  /** Auto-advance the mobile carousel. Default true. */
  autoplay?: boolean;
}

const SWIPE_THRESHOLD = 50;
const DESKTOP_PER_PAGE = 3;
const DOT_LIMIT = 10; // switch to numeric counter beyond this many positions

export function GalleryCarousel({
  images,
  eyebrow,
  title,
  className,
  autoplay = true,
}: GalleryCarouselProps) {
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

  // Auto-advance the mobile carousel. Disable when autoplay is off OR a
  // lightbox is open (otherwise images shift around behind the overlay).
  useEffect(() => {
    if (!autoplay) return;
    if (lightboxIndex !== null) return;
    timeoutRef.current = setTimeout(next, 5000);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [current, next, autoplay, lightboxIndex]);

  const mobileVariants = {
    enter: (d: number) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? "-100%" : "100%", opacity: 0 }),
  };

  if (images.length === 0) return null;

  const hasHeader = Boolean(eyebrow || title);
  const showDesktopDots = maxStart + 1 <= DOT_LIMIT;
  const showMobileDots = total <= DOT_LIMIT;

  return (
    <div className={cn("mb-20", className)}>
      {hasHeader && (
        <div className="flex flex-col gap-3 mb-8">
          {eyebrow && (
            <p className="text-eyebrow font-bold uppercase text-rust">
              {eyebrow}
            </p>
          )}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            {title && (
              <h2 className="font-display text-display-sm font-extrabold text-navy leading-[1.05] tracking-[-0.4px]">
                {title}
              </h2>
            )}
            {total > DESKTOP_PER_PAGE && (
              <div className="hidden md:flex items-center gap-2">
                <button
                  onClick={prevDesktop}
                  disabled={desktopStart === 0}
                  aria-label="Imaginile anterioare"
                  className="w-10 h-10 border-[1.5px] border-navy flex items-center justify-center text-navy hover:bg-navy hover:text-retro-cream transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-navy"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextDesktop}
                  disabled={desktopStart === maxStart}
                  aria-label="Imaginile următoare"
                  className="w-10 h-10 border-[1.5px] border-navy flex items-center justify-center text-navy hover:bg-navy hover:text-retro-cream transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-navy"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Header-less view still needs nav controls — show them above the
          carousel when the page didn't render its own header. */}
      {!hasHeader && total > DESKTOP_PER_PAGE && (
        <div className="hidden md:flex items-center justify-end gap-2 mb-3">
          <button
            onClick={prevDesktop}
            disabled={desktopStart === 0}
            aria-label="Imaginile anterioare"
            className="w-10 h-10 border-[1.5px] border-navy flex items-center justify-center text-navy hover:bg-navy hover:text-retro-cream transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-navy"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextDesktop}
            disabled={desktopStart === maxStart}
            aria-label="Imaginile următoare"
            className="w-10 h-10 border-[1.5px] border-navy flex items-center justify-center text-navy hover:bg-navy hover:text-retro-cream transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-navy"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

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
              className="group relative aspect-[4/3] overflow-hidden border-[1.5px] border-navy bg-navy/[0.04] shrink-0 cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-rust"
              style={{ width: "calc((100% - 1.5rem) / 3)" }}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="400px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {img.alt && (
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/50 to-transparent px-4 pb-3 pt-8">
                  <p className="text-xs text-white/90 font-light text-left">{img.alt}</p>
                </div>
              )}
            </button>
          ))}
        </motion.div>

        {maxStart > 0 && (
          <div className="flex items-center justify-center gap-1.5 mt-4">
            {showDesktopDots ? (
              Array.from({ length: maxStart + 1 }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setDesktopStart(i)}
                  aria-label={`Mergi la grupul ${i + 1}`}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all duration-300",
                    i === desktopStart ? "bg-navy w-6" : "bg-navy/20 hover:bg-navy/40",
                  )}
                />
              ))
            ) : (
              <span className="text-xs text-navy/45 tabular-nums">
                {desktopStart + 1} – {Math.min(desktopStart + DESKTOP_PER_PAGE, total)} din {total}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Mobile: single image carousel */}
      <div className="md:hidden">
        <div
          className="relative w-full aspect-[4/3] overflow-hidden border-[1.5px] border-navy bg-navy/[0.04] select-none cursor-zoom-in"
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

          {images[current].alt && (
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/50 to-transparent px-5 pb-4 pt-10 pointer-events-none">
              <p className="text-sm text-white/90 font-light">{images[current].alt}</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-center gap-3 mt-4">
          <button
            onClick={prev}
            aria-label="Imaginea anterioară"
            className="w-8 h-8 flex items-center justify-center text-navy hover:text-rust transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {showMobileDots ? (
            <div className="flex items-center gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => go(i)}
                  aria-label={`Mergi la imaginea ${i + 1}`}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all duration-300",
                    i === current ? "bg-navy w-6" : "bg-navy/20 hover:bg-navy/40",
                  )}
                />
              ))}
            </div>
          ) : (
            <span className="text-xs text-navy/50 tabular-nums">
              {current + 1} / {total}
            </span>
          )}
          <button
            onClick={next}
            aria-label="Imaginea următoare"
            className="w-8 h-8 flex items-center justify-center text-navy hover:text-rust transition-colors"
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
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            // No fixed aspect — let the image's natural dimensions drive the
            // wrapper size, capped at 95vw / 90vh. This way portraits get the
            // full vertical viewport instead of being letterboxed inside a
            // 4:3 box. Switched away from next/image's `fill` mode because
            // `fill` requires a sized parent; sizing the parent to image-
            // natural would need width/height plumbed through every caller.
            // The lightbox is one image at a time, opened on user intent —
            // skipping next/image's optimization here is a fair trade for
            // the simpler "show this image as big as possible" behavior.
            className="relative max-w-[95vw] max-h-[90vh] touch-pan-y flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.18}
            onDragEnd={(_e, { offset }) => {
              if (images.length < 2) return;
              if (offset.x < -SWIPE_THRESHOLD) {
                onChange((index + 1) % images.length);
              } else if (offset.x > SWIPE_THRESHOLD) {
                onChange((index - 1 + images.length) % images.length);
              }
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[index].src}
              alt={images[index].alt}
              className="max-w-full max-h-[90vh] w-auto h-auto object-contain pointer-events-none select-none"
              draggable={false}
            />
            {images[index].alt && (
              <p className="text-center text-white/85 text-sm mt-3 max-w-full pointer-events-none">
                {images[index].alt}
              </p>
            )}
          </motion.div>

          {/* Mobile: swipe-only — show just a centered counter beneath the
              image. The swipe gesture on the image itself handles nav. */}
          <div
            className="flex sm:hidden items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-white/70 text-xs tabular-nums">
              {index + 1} / {images.length}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

export default GalleryCarousel;
