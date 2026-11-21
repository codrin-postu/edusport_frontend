import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { GHID_COOKIE, GHID_LOGIN_PATH, isGhidCookieValid } from "@/lib/ghid/gate";

export const dynamic = "force-dynamic";

/** Second line of defence behind the middleware: every wiki page checks the cookie itself. */
export default async function GhidWikiLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const cookie = (await cookies()).get(GHID_COOKIE)?.value;
  if (!isGhidCookieValid(cookie, process.env.GHID_PASSWORD)) redirect(GHID_LOGIN_PATH);
  return children;
}
