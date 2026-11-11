"use client";

import { cn } from "@/utils/cn";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

type ToastApi = { show: (text: string) => void };

const ToastContext = createContext<ToastApi>({ show: () => {} });

export function useToast(): ToastApi {
  return useContext(ToastContext);
}

const VISIBLE_MS = 4000;

/** One toast at a time; a new one replaces the shown one. */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback((next: string) => {
    if (timer.current) clearTimeout(timer.current);
    setText(next);
    setOpen(true);
    timer.current = setTimeout(() => setOpen(false), VISIBLE_MS);
  }, []);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const api = useMemo(() => ({ show }), [show]);
  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="fixed inset-x-0 bottom-20 lg:bottom-6 z-popup flex justify-center gutter pointer-events-none">
        <div
          role="status"
          data-state={open ? "open" : "closed"}
          className={cn(
            "bg-surface-dark text-primary-on-dark border-card border-card-line shadow-retro-sm text-body-sm px-4 py-3 max-w-md",
            "transition-[transform,opacity,visibility] duration-(--motion-base) ease-(--motion-ease)",
            open ? "translate-y-0 opacity-100 visible" : "translate-y-(--motion-rise) opacity-0 invisible",
          )}
        >
          {text}
        </div>
      </div>
    </ToastContext.Provider>
  );
}
