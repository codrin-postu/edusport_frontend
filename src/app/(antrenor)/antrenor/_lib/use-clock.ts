"use client";

import { useEffect, useState } from "react";

export type ClubClock = { date: string; time: string };

const read = (): ClubClock => {
  const now = new Date();
  return {
    date: new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Bucharest" }).format(now),
    time: new Intl.DateTimeFormat("ro-RO", { timeZone: "Europe/Bucharest", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(now),
  };
};

/** Bucharest date and HH:mm, ticking on every minute (the next tick is set for the next :00 seconds). Paused while the tab is hidden, resynced when it shows again. */
export function useClubClock(): ClubClock {
  const [clock, setClock] = useState<ClubClock>(read);
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    const stop = () => {
      if (timer !== null) clearTimeout(timer);
      timer = null;
    };
    const tick = () => {
      const next = read();
      setClock((c) => (c.date === next.date && c.time === next.time ? c : next));
      timer = setTimeout(tick, 60_000 - (Date.now() % 60_000));
    };
    const start = () => {
      stop();
      tick();
    };
    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };
    if (document.hidden) setClock(read());
    else timer = setTimeout(tick, 60_000 - (Date.now() % 60_000));
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      stop();
    };
  }, []);
  return clock;
}
