import { googleEnabled } from "@/lib/portal/google-config";
import { COACH_AUTH, STATES } from "@/lib/portal/copy";
import { readInviteState } from "@/lib/portal/invite";
import { AuthFrame } from "@/app/_portal/ui/AuthFrame";
import { BackLink } from "@/app/_portal/ui/AuthBits";
import { InviteForm } from "@/app/_portal/auth/InviteForm";

export const dynamic = "force-dynamic";

export default async function InvitePage() {
  const invite = await readInviteState();
  if (invite.state !== "valid") {
    return (
      <AuthFrame title={COACH_AUTH.invite.title}>
        <p className="text-body text-primary mb-6">{invite.state === "failed" ? STATES.loadFailed : COACH_AUTH.invite.expired}</p>
        <BackLink href="/login">{COACH_AUTH.reset.back}</BackLink>
      </AuthFrame>
    );
  }
  return <InviteForm copy={COACH_AUTH} homePath="/" email={invite.email} google={await googleEnabled()} />;
}
