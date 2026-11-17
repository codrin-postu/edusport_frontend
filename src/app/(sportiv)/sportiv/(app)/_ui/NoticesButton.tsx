"use client";

import Icon from "@/components/ui/icon";
import { NOTICES } from "@/lib/portal/copy-sportiv";
import { useNotices } from "../_lib/notices-context";

/** The square counter; nothing at 0. */
export function NoticeCount({ className }: { className?: string }) {
  const { count } = useNotices();
  if (count === 0) return null;
  return (
    <span data-notice-count className={`flex min-w-5 items-center justify-center bg-ice px-1 text-(length:--portal-text-13) font-bold text-primary ${className ?? ""}`}>
      {count}
    </span>
  );
}

/** Desktop sidebar item above the account row: bell, "Mesaje" and the counter. It opens the panel. */
export function NoticesButton({ onOpen }: { onOpen: () => void }) {
  return (
    <button
      type="button"
      aria-haspopup="dialog"
      onClick={onOpen}
      className="flex min-h-(--portal-sidebar-link-h) w-full cursor-pointer items-center gap-3 px-(--portal-sidebar-pad-x) text-left text-(length:--portal-sidebar-link-size) font-semibold text-nav-on-dark outline-none hover:bg-surface-subtle-on-dark focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ice"
    >
      <Icon name="bell" size="20" />
      {NOTICES.title}
      <NoticeCount className="ml-auto" />
    </button>
  );
}
