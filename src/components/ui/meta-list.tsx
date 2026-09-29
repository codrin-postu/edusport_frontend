import type { ReactNode } from "react";
import Icon from "./icon";
import type { IconName } from "./icon-names";
import Link from "./link";
import { cn } from "@/utils/cn";

export interface MetaListItem {
  icon: IconName;
  text: ReactNode;
  /** Renders the row as a quiet link (e.g. a Cursuri location). */
  href?: string;
  /** Opens the link in a new tab (only applies with href). */
  external?: boolean;
}

interface MetaListProps {
  items: MetaListItem[];
  /** stack: flex-col, one item per line. inline: wraps, items side by side. */
  layout?: "stack" | "inline";
  /** The list sits on a dark (navy) surface. */
  onDark?: boolean;
  className?: string;
}

const LAYOUT_CLASSES: Record<"stack" | "inline", string> = {
  stack: "flex-col gap-3 items-start",
  inline: "flex-wrap gap-x-6 gap-y-2 items-center",
};

const ROW_CLASSES: Record<"stack" | "inline", string> = {
  stack: "flex items-start gap-3",
  inline: "flex items-center gap-2",
};

/**
 * An icon + text row list (event details, location meta, sidebar facts).
 * The icon always matches the text colour, never a standalone accent.
 */
export default function MetaList({ items, layout = "stack", onDark = false, className }: MetaListProps) {
  const textColor = onDark ? "text-secondary-on-dark" : "text-secondary";

  return (
    <div className={cn("text-body-sm flex", LAYOUT_CLASSES[layout], textColor, className)}>
      {items.map((item, index) => {
        const row = (
          <>
            <Icon name={item.icon} className={cn(textColor, layout === "stack" && "mt-0.5")} />
            {item.text}
          </>
        );

        if (item.href) {
          return (
            <Link
              key={index}
              href={item.href}
              tone="quiet"
              onDark={onDark}
              external={item.external}
              className={ROW_CLASSES[layout]}
            >
              {row}
            </Link>
          );
        }

        return (
          <span key={index} className={ROW_CLASSES[layout]}>
            {row}
          </span>
        );
      })}
    </div>
  );
}

export { MetaList };
