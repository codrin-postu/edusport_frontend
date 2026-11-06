import { redirect } from "next/navigation";
import { serverContext } from "@/lib/portal/server-ctx";
import { ResetForm } from "./ResetForm";

export const dynamic = "force-dynamic";

export default async function ResetPage() {
  const { ctx, get } = await serverContext();
  if (get(ctx.names.refresh)) redirect("/");
  return <ResetForm />;
}
