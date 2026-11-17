"use client";

import { useEffect } from "react";
import { NOTICES } from "@/lib/portal/copy-sportiv";
import { LoadError } from "@/app/_portal/ui/LoadError";
import { SidePanel } from "@/app/_portal/ui/SidePanel";
import { Spinner } from "@/app/_portal/ui/Spinner";
import { useToast } from "@/app/_portal/ui/Toast";
import { useNotices } from "../_lib/notices-context";
import { NoticeCard } from "./NoticeCard";

/** The cards, with the loading, error and empty states. Shared by the desktop panel and the phone sheet. */
export function NoticeList() {
  const { state, notices, dismiss, reload, markSeen } = useNotices();
  const toast = useToast();
  // The list is only mounted while the panel or sheet is open: each open records the view.
  useEffect(() => { markSeen(); }, [markSeen]);
  if (state === "loading") return <Spinner />;
  if (state === "error") return <LoadError onRetry={reload} />;
  const onDismiss = (id: string) => {
    void dismiss(id).then((ok) => {
      if (ok) return;
      toast.show(NOTICES.dismissFailed);
    });
  };
  return (
    <div className="flex flex-col gap-4">
      {notices.length === 0 ? <p className="text-(length:--portal-text-14) text-muted">{NOTICES.empty}</p> : notices.map((n) => <NoticeCard key={n.id} notice={n} onDismiss={() => onDismiss(n.id)} />)}
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
