import { serverContext } from "@/lib/portal/server-ctx";
import { ResetForm } from "@/app/_portal/auth/ResetForm";
import { SPORTIV_AUTH } from "@/lib/portal/copy-sportiv";

export const dynamic = "force-dynamic";

export default async function ResetPage() {
  const { ctx, get } = await serverContext("sportiv");
  return <ResetForm copy={SPORTIV_AUTH} portal="sportiv" homePath="/" signedIn={Boolean(get(ctx.names.refresh))} />;
}
