"use client";

import { useRef, useState, type ReactNode } from "react";
import IconButton from "@/components/ui/icon-button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { PATH } from "@/lib/portal/copy-sportiv";
import { dayMonthYear } from "@/lib/portal/format";
import { friendPinId, type Parcurs, type ParcursStaff, type PinView, type ReceivedPin } from "@/lib/portal/parcurs";
import { PinCell } from "./PinCell";
import { PinZoom, type ZoomItem } from "./PinZoom";

const P = PATH.parcurs;
const ROW = "grid grid-cols-[repeat(auto-fill,minmax(var(--portal-pin-col-min),1fr))] gap-x-3 gap-y-4";
const JUMPS = "grid grid-cols-3 gap-x-3 gap-y-4 portal:grid-cols-6";

type RemoveKind = "award" | "pin";
type Staff = ParcursStaff;
const isStaff = (d: Parcurs | ParcursStaff): d is Staff => "awards" in d;

function zoomOf(p: PinView): ZoomItem {
  return { image: p.pin, title: p.label, count: p.earnedOn !== null && p.count > 1 ? p.count : null, line: p.earnedOn ? dayMonthYear(p.earnedOn) : null };
}

function friendZoom(r: ReceivedPin): ZoomItem {
  return { image: friendPinId(r.design), title: r.message, note: r.message, count: null, line: P.from(r.from, dayMonthYear(r.givenOn)) };
}

function Group({ title, actions, children }: { title: string; actions?: ReactNode; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex min-h-(--portal-tap) items-center justify-between gap-3">
        <h2 className="font-display font-extrabold text-(length:--portal-h2-size)">{title}</h2>
        {actions}
      </div>
      {children}
    </section>
  );
}

function Pins({ pins, onOpen, className = ROW }: { pins: PinView[]; onOpen: (z: ZoomItem) => void; className?: string }) {
  return <div className={className}>{pins.map((p) => <PinCell key={p.pin} pin={p} onOpen={() => onOpen(zoomOf(p))} />)}</div>;
}

function FriendCell({ r, onOpen }: { r: ReceivedPin; onOpen: () => void }) {
  return (
    <button type="button" onClick={onOpen} aria-label={`${r.message}, ${r.from}`} className="flex min-h-(--portal-tap) min-w-0 cursor-pointer flex-col items-center gap-1.5 bg-transparent p-0 text-center text-primary outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus">
      {/* eslint-disable-next-line @next/next/no-img-element -- a small static PNG; the button carries the label */}
      <img src={`/parcurs/${friendPinId(r.design)}.png`} alt="" className="h-(--portal-pin-h) w-full max-w-(--portal-pin-w) object-contain drop-shadow-sm" />
      <span className="text-(length:--portal-text-12) text-muted">{r.from}</span>
      <span className="text-(length:--portal-text-12) text-muted">{dayMonthYear(r.givenOn)}</span>
    </button>
  );
}

function RemoveButton({ onClick }: { onClick: () => void }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <IconButton icon="trash" size="sm" label={P.remove} onClick={onClick} />
      </TooltipTrigger>
      <TooltipContent>{P.remove}</TooltipContent>
    </Tooltip>
  );
}

function StaffRow({ children, onRemove }: { children: ReactNode; onRemove?: () => void }) {
  return (
    <li className="flex min-h-(--portal-tap) items-center justify-between gap-3 py-1">
      <span className="flex min-w-0 flex-col text-(length:--portal-text-14)">{children}</span>
      {onRemove && <RemoveButton onClick={onRemove} />}
    </li>
  );
}

function StaffLists({ data, onRemove, removable }: { data: Staff; onRemove: (kind: RemoveKind, id: string) => void; removable: readonly RemoveKind[] }) {
  const removeOf = (kind: RemoveKind, id: string) => (removable.includes(kind) ? () => onRemove(kind, id) : undefined);
  const labels = new Map([...data.antrenamente, ...data.concursuri, ...data.membru, ...data.insigne, ...data.sarituri.flat()].map((p) => [p.pin, p.label]));
  return (
    <>
      {data.awards.length > 0 && (
        <Group title={P.awards}>
          <ul className="flex flex-col divide-y divide-line-subtle border-y border-card-line">
            {data.awards.map((a) => (
              <StaffRow key={a.id} onRemove={removeOf("award", a.id)}>
                <b>{labels.get(a.pin) ?? a.pin}</b>
                <span className="text-muted">{P.from(a.givenBy, dayMonthYear(a.givenOn))}</span>
              </StaffRow>
            ))}
          </ul>
        </Group>
      )}
      {data.given.length > 0 && (
        <Group title={P.given}>
          <ul className="flex flex-col divide-y divide-line-subtle border-y border-card-line">
            {data.given.map((g) => (
              <StaffRow key={g.id} onRemove={removeOf("pin", g.id)}>
                <b>{g.message}</b>
                <span className="text-muted">{P.to(g.to, dayMonthYear(g.givenOn))}</span>
              </StaffRow>
            ))}
          </ul>
        </Group>
      )}
    </>
  );
}

/** The felt pins of Parcurs, shared by the athlete, coach and admin. Staff extras (who gave each award, the pins the athlete gave, remove buttons) show only when `onRemove` is passed; `removable` limits which kinds get a remove button (the coach removes awards only). `actions` sits on the right of the Prietenie heading. */
export function ParcursView({ data, actions, onRemove, removable = ["award", "pin"] }: { data: Parcurs | ParcursStaff; actions?: ReactNode; onRemove?: (kind: RemoveKind, id: string) => void; removable?: readonly RemoveKind[] }) {
  const [zoom, setZoom] = useState<ZoomItem | null>(null);
  const opener = useRef<HTMLElement | null>(null);
  const open = (z: ZoomItem) => { opener.current = document.activeElement as HTMLElement | null; setZoom(z); };
  return (
    <div className="flex flex-col gap-(--portal-section-gap)">
      <Group title={P.antrenamente}><Pins pins={data.antrenamente} onOpen={open} /></Group>
      <Group title={P.concursuri}><Pins pins={data.concursuri} onOpen={open} /></Group>
      <Group title={P.membru}><Pins pins={data.membru} onOpen={open} /></Group>
      <Group title={P.insigne}><Pins pins={data.insigne} onOpen={open} /></Group>
      <Group title={P.sarituri}><Pins pins={data.sarituri.flat()} onOpen={open} className={JUMPS} /></Group>
      <Group title={P.prietenie} actions={actions}>
        <div className={ROW}>{data.received.map((r) => <FriendCell key={r.id} r={r} onOpen={() => open(friendZoom(r))} />)}</div>
      </Group>
      {onRemove && isStaff(data) && <StaffLists data={data} onRemove={onRemove} removable={removable} />}
      <PinZoom item={zoom} onClose={() => setZoom(null)} returnTo={opener} />
    </div>
  );
}
