"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent, MotionValue } from "motion/react";
import YoutubeEmbed, { YoutubeEmbedHandle } from "@/components/blocks/youtube-embed/YoutubeEmbed";

// Header height: HeaderTop (h-8 = 32px) + main nav (h-20 = 80px) = 112px
const HEADER_H = 112;
const VIEWPORT_H = `calc(100svh - ${HEADER_H}px)`;

// ViewBox: 1440 × 900 - curves stay in the top half (y < 500)
// Left pair: drop from top, curve off the left edge
// Right pair: drop from top, curve off the right edge, more spread vertically
const PATHS = [
  // ── LEFT PAIR - gentle arc from top, curves to left edge ──
  {
    d: "M 380,30 C 370,180 300,320 120,390 C 20,425 -60,430 -90,431",
    width: 38,
    inputRange: [0, 0.14] as [number, number],
  },
  {
    d: "M 500,30 C 495,200 470,380 350,490 C 250,570 80,600 -10,603",
    width: 16,
    inputRange: [0.03, 0.17] as [number, number],
  },

  // ── RIGHT PAIR - vertical drop, sharp late turn to right edge ──
  {
    d: "M 1060,30 C 1060,200 1080,380 1200,480 C 1310,560 1480,570 1540,571",
    width: 38,
    inputRange: [0, 0.14] as [number, number],
  },
  {
    d: "M 940,30 C 940,160 950,300 1040,390 C 1120,460 1310,480 1420,482",
    width: 16,
    inputRange: [0.03, 0.17] as [number, number],
  },

  // ── FROM BOTTOM - travel up and exit off the top edge ──
  // Thick, bottom-left, sweeps up and exits top
  {
    d: "M -60,920 C 60,760 180,580 280,380 C 360,220 400,80 410,-20",
    width: 30,
    inputRange: [0.01, 0.15] as [number, number],
  },
  // Thinner, center-bottom, curves up and exits top slightly right
  {
    d: "M 260,940 C 300,760 340,560 380,360 C 410,200 430,60 435,-20",
    width: 14,
    inputRange: [0.04, 0.16] as [number, number],
  },
  // Medium, bottom-right, arcs up and exits top-right area
  {
    d: "M 1480,920 C 1400,760 1300,560 1180,380 C 1080,220 1020,60 1010,-20",
    width: 22,
    inputRange: [0.02, 0.15] as [number, number],
  },
  // Thin, further right bottom, exits top further right
  {
    d: "M 1560,860 C 1500,700 1420,500 1340,320 C 1280,180 1240,40 1235,-20",
    width: 12,
    inputRange: [0.05, 0.17] as [number, number],
  },

  // ── FROM RIGHT EDGE - travel all the way to left edge and off ──
  // Thick horizontal, crosses full width
  {
    d: "M 1560,420 C 1400,418 1100,416 800,415 C 500,414 200,414 -60,414",
    width: 28,
    inputRange: [0.02, 0.14] as [number, number],
  },
  // Thinner, slightly lower
  {
    d: "M 1560,510 C 1380,510 1080,510 780,510 C 480,510 180,510 -60,510",
    width: 14,
    inputRange: [0.05, 0.15] as [number, number],
  },
  // Thin, higher up, slight upward curve as it travels left
  {
    d: "M 1560,310 C 1380,306 1080,300 780,296 C 480,292 180,290 -60,289",
    width: 10,
    inputRange: [0.03, 0.13] as [number, number],
  },
  // Medium, curves gently downward as it crosses left
  {
    d: "M 1560,620 C 1380,626 1080,634 780,642 C 480,650 180,656 -60,660",
    width: 18,
    inputRange: [0.06, 0.16] as [number, number],
  },
];

const AnimatedPath: React.FC<{
  d: string;
  width: number;
  scrollYProgress: MotionValue<number>;
  inputRange: [number, number];
}> = ({ d, width, scrollYProgress, inputRange }) => {
  const pathLength = useTransform(scrollYProgress, inputRange, [0, 1]);
  // Stay fully invisible until drawing starts, then snap visible
  const opacity = useTransform(
    scrollYProgress,
    [inputRange[0], inputRange[0] + 0.001, inputRange[1]],
    [0, 1, 1],
  );

  return (
    <motion.path
      d={d}
      stroke="var(--color-edusport-blue)"
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      style={{ pathLength, opacity }}
    />
  );
};

const StickyVideoSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const embedRef = useRef<YoutubeEmbedHandle>(null);

  // "start end" = section bottom enters viewport = progress 0 (just scrolled in)
  // "end start" = section top leaves viewport   = progress 1 (fully scrolled past)
  // This gives us progress 0 exactly as the user begins to see the section.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // progress 0→0.12 : curves draw in (section just entering)
  // progress 0.12→0.22: curves hold
  // progress 0.20→0.30: curves fade out, video fades in
  // progress 0.30→0.65: video holds
  // progress 0.65→0.80: video fades out
  const curvesOpacity = useTransform(
    scrollYProgress,
    [0.15, 0.28],
    [1,      0],
  );

  const videoOpacity = useTransform(
    scrollYProgress,
    [0.22, 0.32, 0.65, 0.78],
    [0,      1,    1,    0],
  );

  useMotionValueEvent(videoOpacity, "change", (v) => {
    if (v === 0) {
      embedRef.current?.pause();
      embedRef.current?.mute();
    }
  });

  return (
    <div ref={containerRef} className="relative h-[300vh] mt-24">
      <div
        className="sticky bg-white left-0"
        style={{
          top: HEADER_H,
          height: VIEWPORT_H,
          width: "100vw",
          marginLeft: "calc((100% - 100vw) / 2)",
        }}
      >
        {/* Curves - scroll-drawn, fade out as video comes in */}
        <motion.div className="absolute inset-0" style={{ opacity: curvesOpacity }}>
          <svg
            aria-hidden
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 1440 900"
            preserveAspectRatio="xMidYMid slice"
            fill="none"
            style={{ overflow: "visible" }}
          >
            {PATHS.map((p, i) => (
              <AnimatedPath
                key={i}
                d={p.d}
                width={p.width}
                scrollYProgress={scrollYProgress}
                inputRange={p.inputRange}
              />
            ))}
          </svg>
        </motion.div>

        {/* Video - fades in over the curves */}
        <motion.div className="absolute inset-0" style={{ opacity: videoOpacity }}>
          <YoutubeEmbed ref={embedRef} url="https://www.youtube.com/watch?v=G-0eleYxj2w" cover />
        </motion.div>
      </div>
    </div>
  );
};

export default StickyVideoSection;
