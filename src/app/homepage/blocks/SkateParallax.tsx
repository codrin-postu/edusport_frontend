"use client";

import Image from "next/image";
import skate from "/public/images/edea_skate_transparent.png";
import { motion, useScroll, useTransform } from "motion/react";
import { cn } from "@/utils/cn";

// Isolated client component so Framer Motion only loads for this element.
// The skate image renders immediately via SSR; parallax activates once JS hydrates.
const SkateParallax: React.FC = () => {
  const { scrollY } = useScroll();
  const skateY = useTransform(scrollY, [0, 1000], [0, -400]);
  const skateX = useTransform(scrollY, [0, 1000], [0, -100]);
  const skateRotate = useTransform(scrollY, [0, 1000], [-12, -22]);

  return (
    <motion.div
      style={{ y: skateY, x: skateX, rotate: skateRotate }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn(
        "absolute",
        "-bottom-52",
        "sm:-bottom-48",
        "md:-bottom-40",
        "left-1/2",
        "-translate-x-1/2",
        "z-20",
        "w-[520px]",
        "sm:w-[600px]",
        "md:w-[580px]",
        "lg:w-[640px]",
        "xl:w-[720px]",
        "pointer-events-none",
        "select-none",
      )}
    >
      <Image
        src={skate}
        alt="Edea ice skate"
        width={420}
        height={420}
        className="w-full h-auto drop-shadow-2xl"
        priority
      />
    </motion.div>
  );
};

export default SkateParallax;
