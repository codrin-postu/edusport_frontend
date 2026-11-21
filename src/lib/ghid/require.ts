import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { GHID_COOKIE, GHID_LOGIN_PATH, isGhidCookieValid } from "./gate";

/** Server only. Redirects to the password screen unless the ghid cookie is valid. Call at the top of every wiki page and route. */
export async function requireGhid(): Promise<void> {
  const cookie = (await cookies()).get(GHID_COOKIE)?.value;
  if (!isGhidCookieValid(cookie, process.env.GHID_PASSWORD)) redirect(GHID_LOGIN_PATH);
}
