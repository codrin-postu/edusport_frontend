"use client";

import { motion } from "motion/react";

const GEM_TOTAL   = 2.1;   // seconds — full cycle (bounce + rest)
const SHIMMER_DUR = 2.4;   // seconds — colour shimmer

function Shadow() {
  return (
    <motion.div className="w-14 flex justify-center" style={{ marginTop: 0 }}>
      <motion.svg
        width="58" height="10" viewBox="0 0 58 10"
        animate={{
          scaleX:  [1, 1, 0.4, 0.4, 1.2, 1, 1],
          opacity: [0.5, 0.5, 0.12, 0.12, 0.6, 0.5, 0.5],
        }}
        transition={{
          duration: GEM_TOTAL,
          times: [0, 0, 0.29, 0.29, 0.49, 0.57, 1],
          repeat: Infinity,
          ease: "linear",
        }}
        style={{ transformOrigin: "center" }}
      >
        <ellipse cx="29" cy="5" rx="21" ry="4" fill="rgba(0,0,0,0.55)" />
      </motion.svg>
    </motion.div>
  );
}

export function SkateLoader() {
  return (
    <div className="flex flex-col items-center gap-0">
      {/* Gem */}
      <motion.div
        animate={{
          y:      [0, 0, -42, -48, -20, 0, 0, 0],
          scaleX: [1, 1, 0.95, 0.9, 1.02, 1.08, 1, 1],
          scaleY: [1, 1, 1.05, 1.1, 0.98, 0.92, 1, 1],
          rotate: [0, 0, 0, 15, 0, 0, 0, 0],
        }}
        transition={{
          duration: GEM_TOTAL,
          times: [0, 0, 0.17, 0.29, 0.40, 0.49, 0.57, 1],
          repeat: Infinity,
          ease: [0.36, 0, 0.66, -0.56],
        }}
        style={{ transformOrigin: "bottom center" }}
      >
        <svg width="58" height="68" viewBox="0 0 58 68">
          {/* top facet */}
          <motion.polygon
            points="29,2 9,21 29,18 49,21"
            animate={{ fill: ["#e0f2fe", "#7dd3fc", "#38bdf8", "#e0f2fe"] }}
            transition={{ duration: SHIMMER_DUR, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* left facet */}
          <polygon points="9,21 29,18 29,64 9,21" fill="#bfdbfe" />
          {/* right facet */}
          <motion.polygon
            points="49,21 29,18 29,64 49,21"
            animate={{ fill: ["#7dd3fc", "#38bdf8", "#e0f2fe", "#7dd3fc"] }}
            transition={{ duration: SHIMMER_DUR, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
          />
          {/* bottom tip */}
          <polygon points="9,21 49,21 29,64" fill="#38bdf8" opacity={0.6} />
          {/* highlight streak */}
          <line
            x1="21" y1="10" x2="28" y2="38"
            stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity={0.4}
          />
        </svg>
      </motion.div>

      {/* Shadow synced to bounce */}
      <Shadow />

      {/* Dot trail */}
      <div className="flex gap-2 items-center mt-3">
        {[0, 0.25, 0.5].map((delay, i) => (
          <motion.span
            key={i}
            className="block w-1.5 h-1.5 rounded-full bg-white/50"
            animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.3, 0.8] }}
            transition={{ duration: 1, repeat: Infinity, delay, ease: "easeInOut" }}
          />
        ))}
      </div>
    </div>
  );
}
