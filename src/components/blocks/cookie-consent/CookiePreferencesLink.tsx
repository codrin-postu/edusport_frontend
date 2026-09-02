"use client";

import { Link } from "@/components";
import { LinkVariants } from "@/utils/constants";
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
      variant={LinkVariants.DEFAULT}
      linkType="internal"
      onClick={(e) => {
        e.preventDefault();
        CC.showPreferences();
      }}
      className={
        className ??
        "font-base relative w-fit pb-[2px] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-mustard after:transition-[width] after:duration-200 hover:after:w-full"
      }
    >
      Preferințe cookies
    </Link>
  );
}
