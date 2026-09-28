"use client";

import React, { createContext, useContext, useId, useState } from "react";
import { cn } from "@/utils/cn";
import Icon from "./icon";

type GroupContext = { openId: string | null; setOpenId: (id: string | null) => void } | null;
const Group = createContext<GroupContext>(null);

/**
 * Optional wrapper. By default items open independently (several can be open
 * at once). `single` makes the group keep at most one item open.
 */
export function AccordionGroup({
  single = false,
  className,
  children,
}: {
  single?: boolean;
  className?: string;
  children?: React.ReactNode;
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  const content = <div className={className}>{children}</div>;
  return single ? <Group.Provider value={{ openId, setOpenId }}>{content}</Group.Provider> : content;
}

type AccordionItemProps = {
  /** The trigger content (title, meta, anything). */
  title: React.ReactNode;
  /** band: grey bar with a bottom rule (Realizări cards). row: plain row with a hairline (lists). */
  look?: "band" | "row";
  defaultOpen?: boolean;
  /** Controlled use: pass both. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Heading level wrapping the trigger button. */
  headingAs?: "h2" | "h3" | "h4" | "div";
  className?: string;
  triggerClassName?: string;
  panelClassName?: string;
  children?: React.ReactNode;
};

/**
 * One collapsible section: a full-width button (aria-expanded,
 * aria-controls) with a chevron on the right that turns when open.
 */
export default function AccordionItem({
  title,
  look = "band",
  defaultOpen = false,
  open: openProp,
  onOpenChange,
  headingAs: Heading = "div",
  className,
  triggerClassName,
  panelClassName,
  children,
}: AccordionItemProps) {
  const id = useId();
  const group = useContext(Group);
  const [openLocal, setOpenLocal] = useState(defaultOpen);

  const open = openProp ?? (group ? group.openId === id : openLocal);
  const setOpen = (next: boolean) => {
    if (onOpenChange) onOpenChange(next);
    if (openProp !== undefined) return;
    if (group) group.setOpenId(next ? id : null);
    else setOpenLocal(next);
  };

  return (
    <div className={className}>
      <Heading>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          onClick={() => setOpen(!open)}
          className={cn(
            "w-full flex items-center justify-between gap-3 text-left transition-colors",
            "outline-none focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-primary",
            look === "band"
              ? "px-4 py-3 bg-surface-subtle hover-layer border-b-retro border-line"
              : "py-4 border-b border-line-subtle hover:text-accent",
            triggerClassName,
          )}
        >
          <span className="min-w-0 flex-1">{title}</span>
          <Icon
            name="chevron-down"
            className={cn("shrink-0 text-secondary transition-transform duration-fast", open && "rotate-180")}
          />
        </button>
      </Heading>
      <div id={`${id}-panel`} hidden={!open} className={panelClassName}>
        {children}
      </div>
    </div>
  );
}

export { AccordionItem };
