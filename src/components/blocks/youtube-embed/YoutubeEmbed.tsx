"use client";

import { cn } from "@/utils/cn";
import ConsentGate from "@/components/blocks/cookie-consent/ConsentGate";
import { COOKIE_CATEGORIES } from "@/components/blocks/cookie-consent/config";
import Icon from "@/components/ui/icon";
import IconButton from "@/components/ui/icon-button";
import { motion, AnimatePresence } from "motion/react";
import { DURATION } from "@/lib/motion";
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
        "relative overflow-hidden shadow-lg",
        cover ? "absolute inset-0" : "w-full aspect-video",
        className,
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button
        type="button"
        onClick={togglePlay}
        aria-label={`Redă videoclipul: ${title}`}
        className="absolute inset-0 w-full h-full cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-primary-on-dark"
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
                transition: { duration: DURATION.base, delay: 0.3 },
              }}
              transition={{ duration: DURATION.base }}
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
              transition={{ duration: DURATION.fast }}
            >
              <div className="flex items-center justify-center w-16 h-16">
                {playing ? (
                  <Icon name="pause" size="md" className="text-primary-on-dark fill-white" />
                ) : (
                  <Icon name="play" size="md" className="text-primary-on-dark fill-white translate-x-0.5" />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      {/* Bottom bar */}
      <div
        className="absolute bottom-0 left-0 right-0 px-6 py-4 flex items-center justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        {label ? (
          <span className="text-body-sm text-primary-on-dark drop-shadow pointer-events-none">
            {label}
          </span>
        ) : (
          <span />
        )}
        <div className="flex items-center gap-3">
          <IconButton
            icon={muted ? "volume-x" : "volume-2"}
            onClick={toggleMute}
            onDark
            label={muted ? "Activează sunetul" : "Dezactivează sunetul"}
          />
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-caption inline-flex items-center gap-1 text-secondary-on-dark hover:text-accent-on-dark transition-colors"
          >
            YouTube
            <Icon name="arrow-up-right" />
          </a>
        </div>
      </div>
    </div>
  );
});

YoutubeEmbed.displayName = "YoutubeEmbed";

export default memo(YoutubeEmbed);
