import { portalApi } from "@/app/_portal/lib/api";

/** Ends the session through the BFF, then goes to the login screen. Shared by the profile page and the sidebar account menu. */
export async function logout(): Promise<void> {
  await portalApi("POST", "auth/logout");
  window.location.assign("/login");
}
