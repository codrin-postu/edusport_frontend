"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import type { CursEventInfo } from "./types";

// An event has a detail view if it has a description OR is a curs/next type
function hasDetail(event: CursEventInfo): boolean {
  return !!(event.description) || event.type === "curs" || event.type === "next";
}

// ── Mobile detail sheet — shown when user taps an event in the list ────────────

export const MobileDetailSheet: React.FC<{
  event: CursEventInfo;
  onBack: () => void;
  onClose: () => void;
}> = ({ event, onBack, onClose }) =>
  createPortal(
    <div className="fc-mobile-modal-backdrop" onPointerDown={onClose}>
      <div
        className="fc-mobile-modal"
        onPointerDown={(e) => e.stopPropagation()}
      >
        <div className="fc-mobile-modal-header">
          <button className="fc-mobile-modal-back" onClick={onBack}>
            ← Înapoi
          </button>
          <button className="fc-mobile-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <span className="fc-curs-tooltip-title">{event.title}</span>
        {event.description && (
          <span className="fc-curs-tooltip-hours">
            {event.description.split("·").map((slot, i) => (
              <span key={i}>{slot.trim()}</span>
            ))}
          </span>
        )}
        {(event.type === "curs" || event.type === "next") && (
          <a
            href="/cursuri/regulament"
            className="fc-curs-tooltip-link"
            onClick={(e) => e.stopPropagation()}
          >
            Vezi regulamentul →
          </a>
        )}
      </div>
    </div>,
    document.body,
  );

// ── Mobile list sheet — shown when user taps a day ────────────────────────────

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
    <div className="fc-mobile-modal-backdrop" onPointerDown={onClose}>
      <div
        className="fc-mobile-modal"
        onPointerDown={(e) => e.stopPropagation()}
      >
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
