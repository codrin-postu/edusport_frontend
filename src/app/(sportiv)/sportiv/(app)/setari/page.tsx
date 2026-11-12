"use client";

import Button from "@/components/ui/button";
import { SETARI } from "@/lib/portal/copy-sportiv";
import { sinceText } from "@/lib/portal/sportiv-format";
import type { SportivMe } from "@/lib/portal/sportiv-types";
import { logout } from "@/app/_portal/lib/logout";
import { ListRow } from "@/app/_portal/ui/ListRow";
import { LoadError } from "@/app/_portal/ui/LoadError";
import { Column, Columns, PageBody } from "@/app/_portal/ui/PageBody";
import { PageHeader } from "@/app/_portal/ui/PageHeader";
import { ListCard } from "@/app/_portal/ui/PortalCard";
import { Section } from "@/app/_portal/ui/SectionHeading";
import { Spinner } from "@/app/_portal/ui/Spinner";
import { useEffect, useState } from "react";
import { portalApi } from "@/app/_portal/lib/api";
import { useAthletes } from "../_lib/athletes-context";
import { AccountRows } from "./_parts/AccountRows";
import { NotificationRows } from "./_parts/NotificationRows";

/** Setări: the account (name, phone), its athletes, security, notifications and Ieșire. */
export default function SetariPage() {
  const { picker } = useAthletes();
  const [tick, setTick] = useState(0);
  const [me, setMe] = useState<SportivMe | null | undefined>(undefined);
  useEffect(() => {
    let cancelled = false;
    void portalApi<SportivMe>("GET", "sportiv/me").then((r) => {
      if (!cancelled) setMe(r.ok ? r.data : null);
    });
    return () => {
      cancelled = true;
    };
  }, [tick]);

  const back = { href: "/", label: SETARI.back };
  if (me === undefined) return <><PageHeader back={back} title={SETARI.title} /><PageBody><div className="flex justify-center py-6"><Spinner /></div></PageBody></>;
  if (me === null) return <><PageHeader back={back} title={SETARI.title} /><PageBody><LoadError onRetry={() => { setMe(undefined); setTick((n) => n + 1); }} /></PageBody></>;

  const sec = SETARI.security;
  return (
    <>
      <PageHeader back={back} title={SETARI.title} sub={SETARI.account(me.email)} />
      <PageBody>
        <Columns half>
          <Column grow={1}>
            <Section title={SETARI.me.title}>
              <AccountRows me={me} onSaved={(next) => setMe({ ...me, ...next })} />
            </Section>
            <Section title={SETARI.athletes.title}>
              <ListCard>
                {picker.map((a) => (
                  <ListRow
                    key={a.id}
                    href={`/setari/sportiv/${a.id}`}
                    title={a.name}
                    sub={SETARI.athletes.ageLine(a.groupName ?? "", a.age ?? 0)}
                    extra={a.section === null ? undefined : <span className="text-(length:--portal-row-sub) text-muted">{a.section === "school" ? SETARI.athletes.school : SETARI.athletes.club}</span>}
                  />
                ))}
              </ListCard>
            </Section>
          </Column>
          <Column grow={1}>
            <Section title={sec.title}>
              <ListCard>
                {me.hasPassword ? (
                  <ListRow href="/setari/parola" title={sec.password.label} sub={me.passwordChangedAt ? sec.password.changed(sinceText(me.passwordChangedAt, new Date())) : undefined} />
                ) : (
                  <ListRow href="/forgot-password" title={sec.password.label} sub={sec.password.unset} />
                )}
                <ListRow href="/setari/dispozitive" title={sec.devices.label} sub={sec.devices.count(me.devices)} />
              </ListCard>
            </Section>
            <Section title={SETARI.notifications.title}>
              <NotificationRows schedule={me.notifySchedule} />
            </Section>
            <Button variant="secondary" onClick={() => void logout()} className="w-full">{SETARI.logout}</Button>
          </Column>
        </Columns>
      </PageBody>
    </>
  );
}
