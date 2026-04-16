"use client";

import dynamic from "next/dynamic";

const PageTransitionOverlay = dynamic(
  () => import("./PageTransition").then((m) => ({ default: m.PageTransitionOverlay })),
  { ssr: false },
);

export function LazyPageTransition() {
  return <PageTransitionOverlay />;
}
