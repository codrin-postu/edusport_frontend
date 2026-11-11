import { serverContext } from "@/lib/portal/server-ctx";
import { ResetForm } from "@/app/_portal/auth/ResetForm";
import { COACH_AUTH } from "@/lib/portal/copy";

export const dynamic = "force-dynamic";

export default async function ResetPage() {
  const { ctx, get } = await serverContext();
  return <ResetForm copy={COACH_AUTH} homePath="/" signedIn={Boolean(get(ctx.names.refresh))} />;
}
