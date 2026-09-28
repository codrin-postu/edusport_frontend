"use client";

import React, { useState, useRef, useCallback, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import type { TooltipPos } from "./types";
import { CALENDAR_GROUP, type CalendarGroup } from "./calendar-colors";
import { renderMarkdown, extractFirstImage, resolveAssetUrl } from "@/utils/markdown";

const VIEWPORT_MARGIN = 8;

// ── Desktop hover tooltip ──────────────────────────────────────────────────────

const DesktopTooltip: React.FC<{
  title: string;
  dateLabel?: string;
  description?: string;
  group: CalendarGroup;
  pos: TooltipPos;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}> = ({ title, dateLabel, description, group, pos, onMouseEnter, onMouseLeave }) => {
  const { image, body } = extractFirstImage(description);
  const hasContent = !!body && body.trim().length > 0;
  const ref = useRef<HTMLSpanElement | null>(null);
  const [placement, setPlacement] = useState<{ top: number; left: number; below: boolean }>(
    { top: pos.topAbove, left: pos.left, below: false },
  );
  const clampPassesRef = useRef(0);

  useLayoutEffect(() => {
    clampPassesRef.current = 0;
    setPlacement({ top: pos.topAbove, left: pos.left, below: false });
  }, [pos.topAbove, pos.left]);

  useLayoutEffect(() => {
    if (clampPassesRef.current >= 2) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    let nextTop = placement.top;
    let nextLeft = placement.left;
    let nextBelow = placement.below;

    if (!nextBelow && rect.top < VIEWPORT_MARGIN) {
      nextTop = pos.topBelow;
      nextBelow = true;
    }

    const maxRight = window.innerWidth - VIEWPORT_MARGIN;
    if (rect.right > maxRight) {
      nextLeft -= rect.right - maxRight;
    } else if (rect.left < VIEWPORT_MARGIN) {
      nextLeft += VIEWPORT_MARGIN - rect.left;
    }

    if (nextTop !== placement.top || nextLeft !== placement.left || nextBelow !== placement.below) {
      clampPassesRef.current += 1;
      setPlacement({ top: nextTop, left: nextLeft, below: nextBelow });
    }

  }, [placement.top, placement.left, placement.below, pos.topBelow]);

  return createPortal(
    <span
      ref={ref}
      className={`fc-curs-tooltip${placement.below ? " fc-curs-tooltip--below" : ""}`}
      style={{ top: placement.top, left: placement.left }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <span aria-hidden className="fc-curs-tooltip-bar" style={{ background: CALENDAR_GROUP[group].bg }} />
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
        {dateLabel && <span className="fc-curs-tooltip-meta">{dateLabel}</span>}
        {hasContent && (
          <span className="fc-curs-tooltip-hours">{renderMarkdown(body)}</span>
        )}
      </span>
    </span>,
    document.body,
  );
};

// ── Shared tooltip hook ────────────────────────────────────────────────────────

function useTooltip() {
  const [pos, setPos] = useState<TooltipPos | null>(null);
  const anchorRef = useRef<HTMLElement | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback(() => {
    if (window.matchMedia("(max-width: 767px)").matches) return;
    if (hideTimer.current) clearTimeout(hideTimer.current);
    if (anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      setPos({
        topAbove: rect.top - 4,
        topBelow: rect.bottom + 4,
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

// ── SpecialEventWithTooltip - the one tile body for every calendar event ───────

export const SpecialEventWithTooltip: React.FC<{
  title: string;
  dateLabel?: string;
  description?: string;
  group: CalendarGroup;
}> = ({ title, dateLabel, description, group }) => {
  const { pos, anchorRef, show, hide, keepOpen } = useTooltip();

  return (
    <span
      ref={anchorRef as React.RefObject<HTMLSpanElement>}
      // fc-hover-anchor fills the card, not just the text. The hover target used
      // to be the title's own box, so the empty area below it in a week-view
      // block did not open the tooltip.
      className="fc-event-title fc-hover-anchor outline-none focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-primary"
      tabIndex={0}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {title}
      {pos !== null && typeof document !== "undefined" && (
        <DesktopTooltip
          title={title}
          dateLabel={dateLabel}
          description={description}
          group={group}
          pos={pos}
          onMouseEnter={keepOpen}
          onMouseLeave={hide}
        />
      )}
    </span>
  );
};
