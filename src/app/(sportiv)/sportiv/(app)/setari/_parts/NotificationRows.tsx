"use client";

import { useState } from "react";
import Checkbox from "@/components/ui/checkbox";
import { SETARI } from "@/lib/portal/copy-sportiv";
import { portalApi } from "@/app/_portal/lib/api";
import { ListRow } from "@/app/_portal/ui/ListRow";
import { ListCard } from "@/app/_portal/ui/PortalCard";
import { useToast } from "@/app/_portal/ui/Toast";

const N = SETARI.notifications;

/** Notificări: the schedule e-mail has a switch; the new-device e-mail is always on, so no switch. */
export function NotificationRows({ schedule }: { schedule: boolean }) {
  const toast = useToast();
  const [on, setOn] = useState(schedule);
  const [busy, setBusy] = useState(false);

  async function toggle(next: boolean) {
    setBusy(true);
    const r = await portalApi<{ toast: string }>("PUT", "sportiv/me/notifications", { schedule: next });
    setBusy(false);
    if (!r.ok) {
      toast.show(r.message);
      return;
    }
    setOn(next);
  }

  return (
    <ListCard>
      <ListRow
        title={N.schedule.label}
        sub={on ? N.schedule.on : N.schedule.off}
        end={
          <span className="flex shrink-0 items-center px-(--portal-row-pad-x)">
            <Checkbox label={<span className="sr-only">{N.schedule.label}</span>} checked={on} disabled={busy} onChange={(e) => void toggle(e.target.checked)} />
          </span>
        }
      />
      <ListRow title={N.device.label} sub={N.device.always} end={null} />
    </ListCard>
  );
}
