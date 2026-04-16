"use client";

import React, { useState, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import type { TooltipPos } from "./types";

// ── Desktop hover tooltip ──────────────────────────────────────────────────────

const DesktopTooltip: React.FC<{
  title: string;
  description?: string;
  showRegulamentLink?: boolean;
  pos: TooltipPos;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}> = ({ title, description, showRegulamentLink = true, pos, onMouseEnter, onMouseLeave }) =>
  createPortal(
    <span
      className="fc-curs-tooltip"
      style={{ top: pos.top, left: pos.left }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <span className="fc-curs-tooltip-title">{title}</span>
      {description && (
        <span className="fc-curs-tooltip-hours">
          {description.split("·").map((slot, i) => (
            <span key={i}>{slot.trim()}</span>
          ))}
        </span>
      )}
      {showRegulamentLink && (
        <a
          href="/cursuri/regulament"
          className="fc-curs-tooltip-link"
          onClick={(e) => e.stopPropagation()}
        >
          Vezi regulamentul →
        </a>
      )}
    </span>,
    document.body,
  );

// ── Shared tooltip hook ────────────────────────────────────────────────────────

function useTooltip() {
  const [pos, setPos] = useState<TooltipPos | null>(null);
  const anchorRef = useRef<HTMLSpanElement>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback(() => {
    if (window.matchMedia("(max-width: 767px)").matches) return;
    if (hideTimer.current) clearTimeout(hideTimer.current);
    if (anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      setPos({ top: rect.top - 8, left: rect.left });
    }
  }, []);

  const hide = useCallback(() => {
    hideTimer.current = setTimeout(() => setPos(null), 80);
  }, []);

  const keepOpen = useCallback(() => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
  }, []);

  return { pos, anchorRef, show, hide, keepOpen };
}

// ── CursEvent — dot + text + hover tooltip (curs/next weekends) ───────────────

const CursEvent: React.FC<{ title: string; description?: string }> = ({ title, description }) => {
  const { pos, anchorRef, show, hide, keepOpen } = useTooltip();

  return (
    <span
      ref={anchorRef}
      className="fc-curs-event"
      onMouseEnter={show}
      onMouseLeave={hide}
    >
      <span className="fc-curs-dot" />
      <span className="fc-curs-desktop-title">{title}</span>

      {pos !== null && typeof document !== "undefined" && (
        <DesktopTooltip
          title={title}
          description={description}
          showRegulamentLink={true}
          pos={pos}
          onMouseEnter={keepOpen}
          onMouseLeave={hide}
        />
      )}
    </span>
  );
};

// ── SpecialEventWithTooltip — block event label + hover tooltip (no regulament) ─

export const SpecialEventWithTooltip: React.FC<{ title: string; description: string }> = ({ title, description }) => {
  const { pos, anchorRef, show, hide, keepOpen } = useTooltip();

  return (
    <span
      ref={anchorRef}
      className="fc-event-title"
      style={{ display: "block", width: "100%", cursor: "default" }}
      onMouseEnter={show}
      onMouseLeave={hide}
    >
      {title}
      {pos !== null && typeof document !== "undefined" && (
        <DesktopTooltip
          title={title}
          description={description}
          showRegulamentLink={false}
          pos={pos}
          onMouseEnter={keepOpen}
          onMouseLeave={hide}
        />
      )}
    </span>
  );
};

export default CursEvent;
