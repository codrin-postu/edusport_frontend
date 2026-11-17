"use client";

import { useEffect, useRef } from "react";

/** Publishes the sticky page header's height as --portal-header-h, so sticky side columns sit just under it. */
export function HeaderHeight() {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const header = ref.current?.closest("[data-page-header]");
    if (!(header instanceof HTMLElement)) return;
    const root = document.documentElement;
    const set = () => root.style.setProperty("--portal-header-h", `${header.offsetHeight}px`);
    set();
    const observer = new ResizeObserver(set);
    observer.observe(header);
    return () => {
      observer.disconnect();
      root.style.removeProperty("--portal-header-h");
    };
  }, []);
  return <span ref={ref} hidden />;
}
