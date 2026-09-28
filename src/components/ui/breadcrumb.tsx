import React from "react";
import Icon from "@/components/ui/icon";
import Link from "@/components/ui/link";
import { cn } from "@/utils/cn";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  /** The breadcrumb sits on a dark (navy) surface. */
  onDark?: boolean;
  className?: string;
}

/**
 * The site's breadcrumb. Items with an `href` are links (quiet tone); the
 * last item (no `href`) is the current page, shown as plain text.
 */
export default function Breadcrumb({ items, onDark = false, className }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className={cn("text-label flex items-center gap-2 flex-wrap", className)}>
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-2">
            {i > 0 && (
              <Icon
                name="chevron-right"
                className={onDark ? "text-secondary-on-dark" : "text-secondary"}
              />
            )}
            {item.href ? (
              <Link
                href={item.href}
                tone="quiet"
                onDark={onDark}
                className={onDark ? "text-secondary-on-dark" : "text-secondary"}
              >
                {item.label}
              </Link>
            ) : (
              <span
                aria-current="page"
                className={cn(
                  onDark ? "text-primary-on-dark" : "text-primary",
                  "truncate max-w-[200px] sm:max-w-none",
                )}
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export { Breadcrumb };
