"use client";

import { useState } from "react";
import Icon, { type IconName } from "@/components/ui/icon";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

/** A rule or note as a small icon (lock or info) with the words in its tooltip; the words are also its accessible name. A tap opens it too (a tooltip alone does not open on touch). */
export function HintIcon({ icon, text }: { icon: Extract<IconName, "lock" | "info">; text: string }) {
  const [open, setOpen] = useState(false);
  return (
    <Tooltip open={open} onOpenChange={setOpen}>
      <TooltipTrigger asChild>
        <button type="button" aria-label={text} onClick={() => setOpen(true)} className="inline-flex shrink-0 items-center justify-center bg-transparent p-0 text-muted outline-none focus-visible:outline-2 focus-visible:outline-offset-(--focus-offset) focus-visible:outline-focus">
          <Icon name={icon} size="sm" />
        </button>
      </TooltipTrigger>
      <TooltipContent>{text}</TooltipContent>
    </Tooltip>
  );
}
