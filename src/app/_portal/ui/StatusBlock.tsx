"use client";

import { useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";
import { KIT } from "@/lib/portal/copy-shared";
import { cn } from "@/utils/cn";
import { consumeSavedFlag } from "../lib/saved-flag";

/** Type and state of a session: blue with a check when completed, navy with a clipboard when not. `popId` is the session id: when that session was just saved the check pops once. */
export function StatusBlock({ kind, done, popId }: { kind: "Grup" | "Individual"; done: boolean; popId?: string | null }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (done && popId && consumeSavedFlag(popId)) ref.current?.setAttribute("data-pop", "");
  }, [done, popId]);
  return (
    <span
      ref={ref}
      role="img"
      aria-label={`${kind}, ${done ? KIT.completat : KIT.necompletat}`}
      data-status-block
      className={cn("flex w-(--portal-typeblock-w) shrink-0 items-center justify-center text-white", done ? "bg-ice-blue" : "bg-surface-dark")}
    >
      <Icon name={done ? "portal-status-done" : "portal-status-todo"} size="26" />
    </span>
  );
}
