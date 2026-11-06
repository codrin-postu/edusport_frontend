"use client";

import { usePathname, useRouter } from "next/navigation";
import React, { useOptimistic, useTransition } from "react";
import ToggleGroup from "@/components/ui/toggle-group";

/**
 * Cards / list picker for the sportivi roster. The view lives in the URL
 * (`?view=lista`, absent means cards) so a shared link keeps it and the
 * server picks the matching page size. Switching drops `page` (back to page
 * 1) but keeps an active `search`, and uses `scroll: false` so the viewport
 * stays on the picker.
 */

export type RosterView = "carduri" | "lista";

const VIEW_OPTIONS = [
  { value: "carduri" as const, label: "Carduri" },
  { value: "lista" as const, label: "Listă" },
];

interface Props {
  view: RosterView;
  search?: string;
  className?: string;
}

export function ViewToggle({ view, search, className }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();
  // Moves the indicator at once; the server render then confirms the view.
  const [shownView, setShownView] = useOptimistic(view);

  return (
    <ToggleGroup
      aria-label="Mod de afișare"
      options={VIEW_OPTIONS}
      value={shownView}
      className={className}
      onChange={(next) => {
        if (next === shownView) return;
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (next === "lista") params.set("view", "lista");
        const qs = params.toString();
        startTransition(() => {
          setShownView(next);
          router.push(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
        });
      }}
    />
  );
}

export default ViewToggle;
