import { redirect } from "next/navigation";
import { googleEnabled } from "@/lib/portal/google-config";
import { serverContext } from "@/lib/portal/server-ctx";
import { LoginForm } from "./LoginForm";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const { ctx, get } = await serverContext();
  if (get(ctx.names.refresh)) redirect("/");
  return <LoginForm google={await googleEnabled()} />;
}
