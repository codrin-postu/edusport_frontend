// Plain (non-"use client") module so server components can import the array
// at runtime as well as the type. Exporting it from a `"use client"` file
// causes `HERO_VARIANTS` to come through as `undefined` on the server.

// B = cream, E = cream/navy split, G = solid dark blue (the navy from E).
export const HERO_VARIANTS = ["B", "E", "G"] as const;
export type HeroVariant = (typeof HERO_VARIANTS)[number];
