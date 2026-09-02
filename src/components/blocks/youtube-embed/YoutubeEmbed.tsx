"use client";

import { cn } from "@/utils/cn";
import ConsentGate from "@/components/blocks/cookie-consent/ConsentGate";
import { COOKIE_CATEGORIES } from "@/components/blocks/cookie-consent/config";
import { ArrowUpRight, Play, Pause, Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useRef, useCallback, useImperativeHandle, forwardRef, memo } from "react";

function extractVideoId(url: string): string {
  const match = url.match(/(?:v=|youtu\.be\/)([^&?/]+)/);
  return match?.[1] ?? "";
}

export interface YoutubeEmbedHandle {
  pause: () => void;
  mute: () => void;
}

interface YoutubeEmbedProps {
  url: string;
  title?: string;
  label?: string;
  className?: string;
  /** Fill parent absolutely with cover-fit iframe (no aspect ratio). Use when parent defines the size. */
  cover?: boolean;
}

const YoutubeEmbed = forwardRef<YoutubeEmbedHandle, YoutubeEmbedProps>(({
  url,
  title = "YouTube video",
  label,
  className,
  cover = false,
}, ref) => {
  const videoId = extractVideoId(url);
  const thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&rel=0&playsinline=1&enablejsapi=1`;

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [hovered, setHovered] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);

  const postToPlayer = useCallback((action: object) => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "command", ...action }),
      "https://www.youtube-nocookie.com",
    );
  }, []);

  useImperativeHandle(ref, () => ({
    pause: () => {
      postToPlayer({ func: "pauseVideo", args: [] });
      setPlaying(false);
    },
    mute: () => {
      postToPlayer({ func: "mute", args: [] });
      setMuted(true);
    },
  }), [postToPlayer]);

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      try {
        const data = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
        if (data.event === "onStateChange") {
          if (data.info === 1) setPlaying(true);
          if (data.info === 2) setPlaying(false);
        }
      } catch {
        // ignore non-JSON messages
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  const togglePlay = () => {
    if (playing) {
      postToPlayer({ func: "pauseVideo", args: [] });
    } else {
      postToPlayer({ func: "playVideo", args: [] });
    }
    setPlaying((p) => !p);
  };

  const toggleMute = () => {
    if (muted) {
      postToPlayer({ func: "unMute", args: [] });
    } else {
      postToPlayer({ func: "mute", args: [] });
    }
    setMuted((m) => !m);
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden shadow-lg cursor-pointer",
        cover ? "absolute inset-0 rounded-none" : "w-full rounded-2xl aspect-video",
        className,
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={togglePlay}
    >
      {/* Nothing reaches Google until the functional category is accepted. */}
      <ConsentGate category={COOKIE_CATEGORIES.functionality} label="YouTube">
      <iframe
        ref={iframeRef}
        src={embedUrl}
        title={title}
        allow="autoplay; encrypted-media"
        className="absolute pointer-events-none"
        style={cover ? {
          border: 0,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "max(177.78vh, 100%)",
          height: "max(56.25vw, 100%)",
          minWidth: "100%",
          minHeight: "100%",
        } : {
          border: 0,
          top: "-60px",
          left: "-40px",
          width: "calc(100% + 80px)",
          height: "calc(100% + 120px)",
        }}
      />
      </ConsentGate>

      {/* Pause cover - thumbnail + blur blocks YouTube's related videos UI */}
      <AnimatePresence>
        {!playing && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{
              opacity: 0,
              transition: { duration: 0.25, delay: 0.3 },
            }}
            transition={{ duration: 0.25 }}
            style={{
              backgroundImage: `url(${thumbnail})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "blur(4px) brightness(0.5)",
              transform: "scale(1.05)",
            }}
          />
        )}
      </AnimatePresence>

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent pointer-events-none" />

      {/* Play/Pause button - visible only on hover */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white/15 border border-white/30 backdrop-blur-sm">
              {playing ? (
                <Pause className="w-6 h-6 text-white fill-white" />
              ) : (
                <Play className="w-6 h-6 text-white fill-white translate-x-0.5" />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom bar */}
      <div
        className="absolute bottom-0 left-0 right-0 px-5 py-4 flex items-center justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        {label ? (
          <span className="text-white text-sm font-medium drop-shadow pointer-events-none">
            {label}
          </span>
        ) : (
          <span />
        )}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleMute}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-white/15 border border-white/25 backdrop-blur-sm text-white hover:bg-white/25 transition-colors"
            aria-label={muted ? "Activează sunetul" : "Dezactivează sunetul"}
          >
            {muted ? (
              <VolumeX className="w-3.5 h-3.5" />
            ) : (
              <Volume2 className="w-3.5 h-3.5" />
            )}
          </button>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-white/70 text-xs hover:text-white transition-colors"
          >
            YouTube
            <ArrowUpRight className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
});

YoutubeEmbed.displayName = "YoutubeEmbed";

export default memo(YoutubeEmbed);
