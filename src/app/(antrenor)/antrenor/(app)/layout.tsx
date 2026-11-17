import { redirect } from "next/navigation";
import { serverContext } from "@/lib/portal/server-ctx";
import { COVER_SCRIPT } from "@/app/_portal/lib/entry-transition";
import { MeProvider } from "../_lib/me-context";
import { CoachShell } from "../_ui/CoachShell";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { ctx, get } = await serverContext("antrenor");
  if (!get(ctx.names.refresh)) redirect("/login");
  return (
    <MeProvider>
      <script dangerouslySetInnerHTML={{ __html: COVER_SCRIPT }} />
      <CoachShell>{children}</CoachShell>
    </MeProvider>
  );
}
