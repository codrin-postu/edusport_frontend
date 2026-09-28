"use client";

import { Link } from "@/components";
import * as CC from "vanilla-cookieconsent";

/**
 * Permanent way back into the consent panel.
 *
 * Required, not decorative: withdrawing consent has to be at least as easy as
 * giving it, so there must be an always-available entry point once the banner
 * is gone.
 *
 * Rendered through the shared `Link` so it inherits the footer link colours and
 * hover behaviour rather than reimplementing them. The href is a no-op; the
 * click opens the panel.
 */
export default function CookiePreferencesLink({ className }: { className?: string }) {
  return (
    <Link
      href="#"
      tone="footer"
      onClick={(e) => {
        e.preventDefault();
        CC.showPreferences();
      }}
      className={className ?? "font-base"}
    >
      Preferințe cookies
    </Link>
  );
}
