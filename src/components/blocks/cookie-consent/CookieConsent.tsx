"use client";

import { useEffect } from "react";
import * as CC from "vanilla-cookieconsent";
import "vanilla-cookieconsent/dist/cookieconsent.css";
import "./cookie-consent.css";
import config from "./config";

/**
 * Mounts the consent panel once, on the client.
 *
 * Nothing that needs consent runs before this: the Umami script and the
 * YouTube players both read the stored decision themselves, so an unanswered
 * banner means neither has loaded.
 */
export default function CookieConsent() {
  useEffect(() => {
    void CC.run(config);
  }, []);

  return null;
}

/** Reopen the preferences panel. Used by the permanent footer link. */
export function openCookiePreferences() {
  CC.showPreferences();
}

/** Whether the visitor has accepted a given category. */
export function hasConsent(category: string): boolean {
  return CC.acceptedCategory(category);
}
