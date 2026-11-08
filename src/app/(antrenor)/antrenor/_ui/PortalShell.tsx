"use client";

import { BottomNav } from "./BottomNav";
import { EntryReveal } from "./EntryReveal";
import { PortalHeader } from "./PortalHeader";
import { ToastProvider } from "./Toast";

export function PortalShell({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <EntryReveal />
      <PortalHeader />
      <main className="w-full max-w-content mx-auto gutter py-6 pb-24 lg:pb-8">{children}</main>
      <BottomNav />
    </ToastProvider>
  );
}
