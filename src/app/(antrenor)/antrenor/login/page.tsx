import { redirect } from "next/navigation";
import { googleEnabled } from "@/lib/portal/google-config";
import { serverContext } from "@/lib/portal/server-ctx";
import { LoginForm } from "@/app/_portal/auth/LoginForm";
import { COACH_AUTH } from "@/lib/portal/copy";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const { ctx, get } = await serverContext("antrenor");
  if (get(ctx.names.refresh)) redirect("/");
  return <LoginForm copy={COACH_AUTH} homePath="/" google={await googleEnabled("antrenor")} />;
}
