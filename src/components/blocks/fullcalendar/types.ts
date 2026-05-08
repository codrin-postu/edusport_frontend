export interface TooltipPos {
  /** Absolute Y to use when the tooltip points downward (above the anchor).
   * Combined with CSS `transform: translateY(-100%)` to render upward. */
  topAbove: number;
  /** Absolute Y to use when the tooltip flips below the anchor (no transform). */
  topBelow: number;
  /** Anchor's left edge in viewport coords. */
  left: number;
}

export interface CursEventInfo {
  title: string;
  description?: string | null;
  type?: string;
  color?: string;
}
