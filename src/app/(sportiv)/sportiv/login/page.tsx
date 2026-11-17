import { redirect } from "next/navigation";
import { googleEnabled } from "@/lib/portal/google-config";
import { serverContext } from "@/lib/portal/server-ctx";
import { LoginForm } from "@/app/_portal/auth/LoginForm";
import { SPORTIV_AUTH } from "@/lib/portal/copy-sportiv";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const { ctx, get } = await serverContext("sportiv");
  if (get(ctx.names.refresh)) redirect("/");
  return <LoginForm copy={SPORTIV_AUTH} portal="sportiv" homePath="/" google={await googleEnabled("sportiv")} />;
}
