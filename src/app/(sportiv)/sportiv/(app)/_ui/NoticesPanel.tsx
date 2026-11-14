"use client";

import { NOTICES } from "@/lib/portal/copy-sportiv";
import { LoadError } from "@/app/_portal/ui/LoadError";
import { SidePanel } from "@/app/_portal/ui/SidePanel";
import { Spinner } from "@/app/_portal/ui/Spinner";
import { useToast } from "@/app/_portal/ui/Toast";
import { useNotices } from "../_lib/notices-context";
import { NoticeCard } from "./NoticeCard";

/** The cards, with the loading, error and empty states. Shared by the desktop panel and the phone sheet. */
export function NoticeList() {
  const { state, notices, dismiss, reload } = useNotices();
  const toast = useToast();
  if (state === "loading") return <Spinner />;
  if (state === "error") return <LoadError onRetry={reload} />;
  if (notices.length === 0) return <p className="text-(length:--portal-text-14) text-muted">{NOTICES.empty}</p>;
  return (
    <div className="flex flex-col gap-4">
      {notices.map((n) => (
        <NoticeCard key={n.id} notice={n} onDismiss={() => void dismiss(n.id).then((ok) => { if (!ok) toast.show(NOTICES.dismissFailed); })} />
      ))}
    </div>
  );
}

/** Desktop: Mesaje as a panel on the right. */
export function NoticesPanel({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  return (
    <SidePanel open={open} onOpenChange={onOpenChange} title={NOTICES.title} closeLabel={NOTICES.closePanel}>
      <NoticeList />
    </SidePanel>
  );
}
