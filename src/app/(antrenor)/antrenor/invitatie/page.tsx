import { googleEnabled } from "@/lib/portal/google-config";
import { INVITE, RESET } from "@/lib/portal/copy";
import { readInviteState } from "@/lib/portal/invite";
import { AuthFrame } from "../_ui/AuthFrame";
import { BackLink } from "../_ui/AuthBits";
import { InviteForm } from "./InviteForm";

export const dynamic = "force-dynamic";

export default async function InvitePage() {
  const invite = await readInviteState();
  if (invite.state !== "valid") {
    return (
      <AuthFrame title={INVITE.title}>
        <p className="text-body text-primary mb-6">{INVITE.expired}</p>
        <BackLink href="/intrare">{RESET.back}</BackLink>
      </AuthFrame>
    );
  }
  return <InviteForm email={invite.email} google={await googleEnabled()} />;
}
