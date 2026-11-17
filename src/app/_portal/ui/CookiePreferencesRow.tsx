"use client";

import * as CC from "vanilla-cookieconsent";
import { COOKIE_PREFERENCES_LABEL } from "@/components/blocks/cookie-consent/config";
import { ListRow } from "./ListRow";
import { ListCard } from "./PortalCard";

/** Permanent way back into the cookie preferences, on each portal's settings page. */
export function CookiePreferencesRow() {
  return (
    <ListCard>
      <ListRow onClick={() => CC.showPreferences()} title={COOKIE_PREFERENCES_LABEL} />
    </ListCard>
  );
}
