// Motion tokens for the motion library (seconds), mirroring globals.css.
export const DURATION = { fast: 0.15, base: 0.25, slow: 0.4, long: 0.75 } as const;
export const EASE = {
  standard: [0.4, 0, 0.2, 1],
  out: [0.22, 1, 0.36, 1],
} as const;
