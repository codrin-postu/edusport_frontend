import { redirect } from "next/navigation";
import { serverContext } from "@/lib/portal/server-ctx";
import { MeProvider } from "../_lib/me-context";
import { PortalShell } from "../_ui/PortalShell";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { ctx, get } = await serverContext();
  if (!get(ctx.names.refresh)) redirect("/intrare");
  return (
    <MeProvider>
      <PortalShell>{children}</PortalShell>
    </MeProvider>
  );
}
