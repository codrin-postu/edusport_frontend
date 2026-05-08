"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Info, AlertTriangle, CheckCircle2, XCircle, X } from "lucide-react";
import { cn } from "@/utils/cn";
import { renderMarkdown } from "@/utils/markdown";

type AnnouncementType = "info" | "warning" | "success" | "error";

interface Announcement {
  message: string;
  type: AnnouncementType;
  ctaLabel?: string;
  ctaUrl?: string;
}

interface AnnouncementPopupProps {
  announcement: Announcement;
}

const TYPE_CONFIG: Record<
  AnnouncementType,
  {
    borderColor: string;
    iconColor: string;
    ctaBg: string;
    ctaHover: string;
    Icon: React.ComponentType<{ className?: string }>;
  }
> = {
  info: {
    borderColor: "border-l-edusport-blue",
    iconColor: "text-edusport-blue",
    ctaBg: "bg-edusport-blue",
    ctaHover: "hover:bg-edusport-blue/90",
    Icon: Info,
  },
  warning: {
    borderColor: "border-l-amber-500",
    iconColor: "text-amber-500",
    ctaBg: "bg-amber-500",
    ctaHover: "hover:bg-amber-500/90",
    Icon: AlertTriangle,
  },
  success: {
    borderColor: "border-l-green-500",
    iconColor: "text-green-500",
    ctaBg: "bg-green-500",
    ctaHover: "hover:bg-green-500/90",
    Icon: CheckCircle2,
  },
  error: {
    borderColor: "border-l-red-500",
    iconColor: "text-red-500",
    ctaBg: "bg-red-500",
    ctaHover: "hover:bg-red-500/90",
    Icon: XCircle,
  },
};

const STORAGE_KEY = "announcement-dismissed";

export function AnnouncementPopup({ announcement }: AnnouncementPopupProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem(STORAGE_KEY);
    if (dismissed !== announcement.message) {
      setVisible(true);
    }
  }, [announcement.message]);

  const handleDismiss = () => {
    sessionStorage.setItem(STORAGE_KEY, announcement.message);
    setVisible(false);
  };

  const config = TYPE_CONFIG[announcement.type];
  const { Icon } = config;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="alert"
          aria-live="polite"
          className={cn(
            "fixed bottom-6 left-1/2 -translate-x-1/2 z-[900]",
            "max-w-lg w-[calc(100%-2rem)]",
            "bg-white rounded-xl shadow-2xl border border-gray-100 border-l-4",
            config.borderColor,
          )}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex flex-col px-4 pt-3.5 pb-3">
            {/* Row 1: icon + message + close */}
            <div className="flex items-start gap-3">
              <Icon className={cn("w-4 h-4 shrink-0 mt-0.5", config.iconColor)} />
              <div className="flex-1 text-sm text-gray-800 leading-snug space-y-2 [&_p]:leading-snug">
                {renderMarkdown(announcement.message)}
              </div>
              <button
                onClick={handleDismiss}
                aria-label="Închide anunțul"
                className="shrink-0 flex items-center justify-center w-6 h-6 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Row 2: CTA button - full width on mobile, auto on desktop */}
            {announcement.ctaLabel && announcement.ctaUrl && (
              <a
                href={announcement.ctaUrl}
                className={cn(
                  "mt-3 w-full sm:w-auto sm:ml-7 inline-flex items-center justify-center px-4 py-2 rounded-lg",
                  "text-white text-xs font-semibold tracking-wide transition-colors",
                  config.ctaBg,
                  config.ctaHover,
                )}
              >
                {announcement.ctaLabel}
              </a>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
