"use client";

import { useEffect, useState } from "react";
import Icon from "@/components/ui/icon";
import { cn } from "@/utils/cn";

/** One collapsible group. Open while it holds the current page, also after a client navigation into it; closed groups show their page count. */
export function RailGroup({ title, count, hasCurrent, children }: { title: string; count: number; hasCurrent: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(hasCurrent);
  useEffect(() => {
    if (hasCurrent) setOpen(true);
  }, [hasCurrent]);
  return (
    <details open={open} onToggle={(e) => setOpen(e.currentTarget.open)} className="flex flex-col">
      <summary className="flex cursor-pointer list-none items-center gap-2 px-3 py-2 text-(length:--portal-text-14) font-bold text-primary [&::-webkit-details-marker]:hidden">
        <Icon name="chevron-right" className={cn("text-muted", open && "rotate-90")} />
        <span className="min-w-0 flex-1">{title}</span>
        {!open && <span className="text-(length:--portal-text-12) font-normal text-muted">{count}<span className="sr-only"> pagini</span></span>}
      </summary>
      <div className="flex flex-col gap-1">{children}</div>
    </details>
  );
}
