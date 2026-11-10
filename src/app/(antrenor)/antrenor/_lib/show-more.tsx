"use client";

import { useEffect, useRef, useState } from "react";
import Button from "@/components/ui/button";
import { LIST } from "@/lib/portal/copy";

/** How many rows of a long list are shown: a page at first, a page more per press; `key` (month, filter) starts over. */
export function useShowMore(key: string, total: number) {
  const [shown, setShown] = useState<{ key: string; n: number }>({ key, n: LIST.page });
  const n = shown.key === key ? shown.n : LIST.page;
  const box = useRef<HTMLDivElement>(null);
  const focusAt = useRef<number | null>(null);
  useEffect(() => {
    if (focusAt.current === null) return;
    const row = box.current?.querySelectorAll<HTMLElement>("[data-more-row]")[focusAt.current];
    focusAt.current = null;
    row?.focus();
  }, [n]);
  const more = () => {
    focusAt.current = n;
    setShown({ key, n: n + LIST.page });
  };
  return { n, box, more, hasMore: total > n };
}

export function ShowMoreButton({ onClick }: { onClick: () => void }) {
  return (
    <div className="flex justify-center">
      <Button variant="secondary" onClick={onClick} className="w-full portal:w-auto">{LIST.showMore}</Button>
    </div>
  );
}
