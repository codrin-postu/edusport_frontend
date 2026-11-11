"use client";

import { useState } from "react";

/** One ice flash per toggle: `flashOf(id)` is the data-flash value of that row. The two names alternate so a second toggle restarts the animation. */
export function useFlash(): { flashOf: (id: string) => "a" | "b" | undefined; flash: (id: string) => void } {
  const [state, setState] = useState<{ id: string; n: number } | null>(null);
  return {
    flashOf: (id) => (state?.id === id ? (state.n % 2 === 0 ? "a" : "b") : undefined),
    flash: (id) => setState((prev) => ({ id, n: (prev?.n ?? 0) + 1 })),
  };
}
