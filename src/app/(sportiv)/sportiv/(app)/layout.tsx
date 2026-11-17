import { redirect } from "next/navigation";
import { serverContext } from "@/lib/portal/server-ctx";
import { COVER_SCRIPT } from "@/app/_portal/lib/entry-transition";
import { AthletesProvider } from "./_lib/athletes-context";
import { NoticesProvider } from "./_lib/notices-context";
import { SportivShell } from "./_ui/SportivShell";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { ctx, get } = await serverContext("sportiv");
  if (!get(ctx.names.refresh)) redirect("/login");
  return (
    <AthletesProvider>
      <NoticesProvider>
        <script dangerouslySetInnerHTML={{ __html: COVER_SCRIPT }} />
        <SportivShell>{children}</SportivShell>
      </NoticesProvider>
    </AthletesProvider>
  );
}
