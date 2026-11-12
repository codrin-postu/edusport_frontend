import { badgeAria } from "@/lib/portal/sportiv-badges";
import type { Badge as BadgeData } from "@/lib/portal/sportiv-types";
import { cn } from "@/utils/cn";
import { BadgeZoom } from "./BadgeZoom";

const WHITE = "var(--color-button-face-text)";
const ACCENT = "var(--color-ice)";

/** The glyph in the middle of the hexagon. The zoom copy leaves the number out: the dialog lists it as text already. */
function Glyph({ badge, locked, zoom }: { badge: BadgeData; locked: boolean; zoom?: boolean }) {
  const ink = locked ? "var(--portal-tier-locked-ink)" : WHITE;
  const accent = locked ? ink : ACCENT;
  if (badge.key === "concursuri") {
    return (
      <g>
        <path d="M38 28h16v10a8 8 0 0 1-16 0z" style={{ fill: ink }} />
        <path d="M38 31h-5a5 5 0 0 0 5 7M54 31h5a5 5 0 0 1-5 7" fill="none" strokeWidth="3" style={{ stroke: ink }} />
        <path d="M46 46v6M40 58h12" fill="none" strokeWidth="3" strokeLinecap="round" style={{ stroke: accent }} />
      </g>
    );
  }
  if (locked) {
    return (
      <g>
        <path d="M37 44h18v16H37z" style={{ fill: ink }} />
        <path d="M40 44v-6a6 6 0 0 1 12 0v6" fill="none" strokeWidth="3" style={{ stroke: ink }} />
      </g>
    );
  }
  if (badge.key === "antrenamente") {
    const top = badge.tiers.find((t) => t.tier === badge.tier)?.threshold;
    return (
      <g>
        {!zoom && <text x="46" y="51" textAnchor="middle" fontFamily="var(--font-display)" fontWeight="800" fontSize="20" style={{ fill: WHITE }}>{top}</text>}
        <path d="M34 58h24" fill="none" strokeWidth="3" strokeLinecap="round" style={{ stroke: ACCENT }} />
      </g>
    );
  }
  if (badge.key === "sezon") {
    return (
      <g fill="none" strokeWidth="3" strokeLinecap="round">
        <path d="M46 26v32M32 34l28 16M60 34L32 50" style={{ stroke: WHITE }} />
        <path d="M42 28l4 4 4-4M42 56l4-4 4 4" style={{ stroke: ACCENT }} />
      </g>
    );
  }
  return (
    <g>
      <path d="M38 28h16v30H38z" style={{ fill: WHITE }} />
      <path d="M43 36l4-3v18" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-(--portal-tier-bronze-inner)" />
      <path d="M34 60h24" fill="none" strokeWidth="3" strokeLinecap="round" style={{ stroke: ACCENT }} />
    </g>
  );
}

/** The hexagon of a badge in its tier colours (the locked grey when `tier` is null). `zoom` is the large copy in the dialog, hidden from screen readers (the dialog title names it). */
export function BadgeMark({ badge, zoom }: { badge: BadgeData; zoom?: boolean }) {
  const tone = badge.tier ?? "locked";
  const locked = badge.tier === null;
  return (
    <svg
      viewBox="0 0 92 100"
      {...(zoom ? { "aria-hidden": true } : { role: "img", "aria-label": badgeAria(badge) })}
      className={zoom ? "h-(--portal-badge-zoom-h) w-(--portal-badge-zoom-w)" : "h-(--portal-badge-h) w-(--portal-badge-w)"}
    >
      <path d="M46 4l38 20v44L46 96 8 68V24z" style={{ fill: `var(--portal-tier-${tone}-frame)` }} />
      <path d="M46 4l38 20-38 18L8 24z" style={{ fill: `var(--portal-tier-${tone}-shine)` }} />
      <path d="M46 14l29 15v34L46 86 17 63V29z" style={{ fill: `var(--portal-tier-${tone}-inner)` }} />
      <Glyph badge={badge} locked={locked} zoom={zoom} />
    </svg>
  );
}

/** One badge of Realizări: the hexagon and its label; activating it opens the zoom. */
export function Badge({ badge }: { badge: BadgeData }) {
  return (
    <BadgeZoom badge={badge} mark={<BadgeMark badge={badge} zoom />}>
      <button type="button" className="flex min-h-(--portal-tap) cursor-pointer flex-col items-center gap-2 bg-transparent p-0 text-center">
        <BadgeMark badge={badge} />
        <span className={cn("text-(length:--portal-text-12) font-bold", badge.tier === null && "text-muted")}>{badge.label}</span>
      </button>
    </BadgeZoom>
  );
}
