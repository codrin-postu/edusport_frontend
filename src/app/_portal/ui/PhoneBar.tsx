"use client";

import { useEffect, useState } from "react";
import { BrandBlock } from "@/app/_portal/ui/BrandBlock";
import Link from "@/components/ui/link";
import { cn } from "@/utils/cn";

/**
 * Phone only: a compact bar stuck to the top once the big page title has scrolled out of view.
 * Back link (or the brand on the brand pages) on the left, the title in the middle. It is a zero height sticky box,
 * so it takes no room while hidden; from the desktop breakpoint the page header is already sticky and this bar is gone.
 */
export function PhoneBar({ title, back, brand }: { title: string; back?: { href: string; label: string }; brand?: boolean }) {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const h1 = document.querySelector("[data-page-header] h1");
    if (!h1) return;
    const io = new IntersectionObserver(([e]) => setShown(!e.isIntersecting && e.boundingClientRect.top < 0));
    io.observe(h1);
    return () => io.disconnect();
  }, [title]);
  return (
    <div data-phone-bar-box className="sticky top-0 z-sticky h-0 portal:hidden">
      <div
        data-phone-bar
        aria-hidden={!shown}
        {...(shown ? {} : { inert: true })}
        className={cn(
          "absolute inset-x-0 top-0 flex h-(--portal-tap) items-center gap-3 border-b border-line-subtle bg-ice-light px-(--portal-page-x) transition-opacity duration-fast",
          shown ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <span className="flex max-w-[40%] shrink-0 justify-start">
          {back ? (
            <Link href={back.href} tone="plain" className="inline-flex min-h-(--portal-tap) items-center text-(length:--portal-text-15) font-bold text-primary no-underline">
              ‹ {back.label}
            </Link>
          ) : brand ? (
            <BrandBlock href="/" />
          ) : null}
        </span>
        <span data-phone-bar-title className="min-w-0 flex-1 truncate text-(length:--portal-text-16) font-bold">{title}</span>
      </div>
    </div>
  );
}
