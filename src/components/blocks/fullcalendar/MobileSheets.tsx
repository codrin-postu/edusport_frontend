"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import type { CursEventInfo } from "./types";
import { renderMarkdown, extractFirstImage, resolveAssetUrl } from "@/utils/markdown";

// An event has a detail view if it has a description OR is a curs/next type
function hasDetail(event: CursEventInfo): boolean {
  return !!(event.description) || event.type === "curs" || event.type === "next";
}

// ── Detail sheet (C2) — navy band pinned, image + body scroll ──────────────────

export const MobileDetailSheet: React.FC<{
  event: CursEventInfo;
  onBack: () => void;
  onClose: () => void;
}> = ({ event, onBack, onClose }) => {
  const { image, body } = extractFirstImage(event.description);
  const hasContent = !!body && body.trim().length > 0;
  const showRegulament = event.type === "curs" || event.type === "next";
  return createPortal(
    <div className="fc-mobile-modal-backdrop" onClick={onClose}>
      <div
        className="fc-mobile-modal fc-mobile-modal--detail"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="fc-mobile-band">
          <div className="fc-mobile-band-top">
            <button className="fc-mobile-band-back" onClick={onBack}>
              Înapoi
            </button>
            <button className="fc-mobile-band-close" onClick={onClose}>
              ✕
            </button>
          </div>
          <span className="fc-mobile-band-title">{event.title}</span>
          {event.dateLabel && (
            <span className="fc-mobile-band-meta">{event.dateLabel}</span>
          )}
        </div>
        <div className="fc-mobile-scroll">
          {image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              className="fc-mobile-modal-image"
              src={resolveAssetUrl(image.url)}
              alt={image.alt}
              loading="lazy"
            />
          )}
          <div className="fc-mobile-detail-body">
            {hasContent && (
              <span className="fc-curs-tooltip-hours">{renderMarkdown(body)}</span>
            )}
            {showRegulament && (
              <a
                href="/cursuri/regulament"
                className="fc-curs-tooltip-link"
                onClick={(e) => e.stopPropagation()}
              >
                Vezi regulamentul
              </a>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};

// ── List sheet — shown when a day is tapped ────────────────────────────────────

export const MobileListSheet: React.FC<{
  events: CursEventInfo[];
  dateLabel: string;
  onClose: () => void;
}> = ({ events, dateLabel, onClose }) => {
  const [detail, setDetail] = useState<CursEventInfo | null>(null);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  if (detail) {
    return (
      <MobileDetailSheet
        event={detail}
        onBack={() => setDetail(null)}
        onClose={onClose}
      />
    );
  }

  return createPortal(
    <div className="fc-mobile-modal-backdrop" onClick={onClose}>
      <div
        className="fc-mobile-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="fc-mobile-grip" />
        <div className="fc-mobile-modal-header">
          <span className="fc-mobile-modal-date">{dateLabel}</span>
          <button className="fc-mobile-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="fc-mobile-modal-list">
          {events.map((event, i) => (
            <button
              key={i}
              className={`fc-mobile-modal-item fc-mobile-modal-item--${event.type ?? "curs"}`}
              onClick={() => hasDetail(event) && setDetail(event)}
              style={hasDetail(event) ? undefined : { cursor: "default" }}
            >
              <span
                className={`fc-mobile-modal-dot fc-mobile-modal-dot--${event.type ?? "curs"}`}
              />
              <span>{event.title}</span>
              {hasDetail(event) && (
                <span className="fc-mobile-modal-chevron">›</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>,
    document.body,
  );
};
