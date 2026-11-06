"use client";

import Link from "next/link";
import { A11Y } from "@/lib/portal/copy";
import { useMe } from "../_lib/me-context";
import { ProfileMenu, TopNav } from "./TopNav";

export function PortalHeader() {
  const me = useMe();
  return (
    <header className="w-full bg-surface-dark text-primary-on-dark h-16">
      <div className="h-full w-full max-w-content mx-auto gutter flex items-center justify-between gap-6">
        <Link href="/" className="text-header-logo text-branding-font text-primary-on-dark">EDUSPORT</Link>
        <div className="hidden lg:flex flex-1 justify-start">
          <TopNav />
        </div>
        <Link
          href="/profil"
          aria-label={A11Y.profile}
          className="lg:hidden size-10 flex items-center justify-center border-retro border-line-on-dark text-label text-primary-on-dark outline-none focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-primary-on-dark"
        >
          {me?.initials}
        </Link>
        <div className="hidden lg:block">
          <ProfileMenu />
        </div>
      </div>
    </header>
  );
}
