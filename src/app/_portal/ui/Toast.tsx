"use client";

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
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback((next: string) => {
    if (timer.current) clearTimeout(timer.current);
    setText(next);
    timer.current = setTimeout(() => setText(""), VISIBLE_MS);
  }, []);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const api = useMemo(() => ({ show }), [show]);
  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="fixed inset-x-0 bottom-20 lg:bottom-6 z-popup flex justify-center gutter pointer-events-none">
        <div role="status" className={text ? "bg-surface-dark text-primary-on-dark border-retro border-line shadow-retro-sm text-body-sm px-4 py-3 max-w-md" : "hidden"}>
          {text}
        </div>
      </div>
    </ToastContext.Provider>
  );
}
