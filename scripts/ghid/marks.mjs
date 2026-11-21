// Pure: turns an element box (px, viewport-relative) into a mark box (percent of the viewport).
const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));
const round1 = (n) => Math.round(n * 10) / 10;

/** Returns [left, top, width, height] in percent, rounded to 0.1, clamped to 0..100. `pad` grows the box on every side, in px. */
export function markBox(box, viewport, pad = 4) {
  const left = clamp(box.x - pad, 0, viewport.width);
  const top = clamp(box.y - pad, 0, viewport.height);
  const right = clamp(box.x + box.width + pad, 0, viewport.width);
  const bottom = clamp(box.y + box.height + pad, 0, viewport.height);
  return [
    round1((left / viewport.width) * 100),
    round1((top / viewport.height) * 100),
    round1(((right - left) / viewport.width) * 100),
    round1(((bottom - top) / viewport.height) * 100),
  ];
}
