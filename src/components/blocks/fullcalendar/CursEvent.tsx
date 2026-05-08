"use client";

import React, { useState, useRef, useCallback, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import type { TooltipPos } from "./types";
import { renderMarkdown, extractFirstImage, resolveAssetUrl } from "@/utils/markdown";

const VIEWPORT_MARGIN = 8;

// ── Desktop hover tooltip ──────────────────────────────────────────────────────

const DesktopTooltip: React.FC<{
  title: string;
  description?: string;
  showRegulamentLink?: boolean;
  pos: TooltipPos;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}> = ({ title, description, showRegulamentLink = true, pos, onMouseEnter, onMouseLeave }) => {
  const { image, body } = extractFirstImage(description);
  const hasContent = !!body && body.trim().length > 0;
  const ref = useRef<HTMLSpanElement | null>(null);
  // Initial placement = anchor-aligned `topAbove` / `left`. After mount we measure
  // the rendered tooltip and clamp into the viewport.
  const [placement, setPlacement] = useState<{ top: number; left: number; below: boolean }>(
    { top: pos.topAbove, left: pos.left, below: false },
  );

  useLayoutEffect(() => {
    setPlacement({ top: pos.topAbove, left: pos.left, below: false });
  }, [pos.topAbove, pos.left]);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    let nextTop = placement.top;
    let nextLeft = placement.left;
    let nextBelow = placement.below;

    // Flip vertical if the tooltip overflows the top of the viewport.
    if (!nextBelow && rect.top < VIEWPORT_MARGIN) {
      nextTop = pos.topBelow;
      nextBelow = true;
    }

    // Clamp horizontal - width does not change between above/below placements.
    if (rect.right > window.innerWidth - VIEWPORT_MARGIN) {
      nextLeft -= rect.right - (window.innerWidth - VIEWPORT_MARGIN);
    }
    if (rect.left < VIEWPORT_MARGIN) {
      nextLeft += VIEWPORT_MARGIN - rect.left;
    }

    if (nextTop !== placement.top || nextLeft !== placement.left || nextBelow !== placement.below) {
      setPlacement({ top: nextTop, left: nextLeft, below: nextBelow });
    }
    // Only re-run when the source position shifts; placement's own update above
    // settles within at most one extra render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placement.top, placement.left, placement.below, pos.topBelow]);

  return createPortal(
    <span
      ref={ref}
      className={`fc-curs-tooltip${image ? " fc-curs-tooltip--with-image" : ""}${placement.below ? " fc-curs-tooltip--below" : ""}`}
      style={{ top: placement.top, left: placement.left }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className="fc-curs-tooltip-image"
          src={resolveAssetUrl(image.url)}
          alt={image.alt}
          loading="lazy"
        />
      )}
      <span className="fc-curs-tooltip-body">
        <span className="fc-curs-tooltip-title">{title}</span>
        {hasContent && (
          <span className="fc-curs-tooltip-hours">{renderMarkdown(body)}</span>
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
      </span>
    </span>,
    document.body,
  );
};

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
      setPos({
        topAbove: rect.top - 8,
        topBelow: rect.bottom + 8,
        left: rect.left,
      });
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

// ── CursEvent - dot + text + hover tooltip (curs/next weekends) ───────────────

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

// ── SpecialEventWithTooltip - block event label + hover tooltip (no regulament) ─

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
