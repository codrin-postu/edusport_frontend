import { googleEnabled } from "@/lib/portal/google-config";
import { STATES } from "@/lib/portal/copy";
import { SPORTIV_AUTH } from "@/lib/portal/copy-sportiv";
import { readInviteState } from "@/lib/portal/invite";
import { AuthFrame } from "@/app/_portal/ui/AuthFrame";
import { BackLink } from "@/app/_portal/ui/AuthBits";
import { InviteForm } from "@/app/_portal/auth/InviteForm";

export const dynamic = "force-dynamic";

export default async function InvitePage() {
  const invite = await readInviteState("sportiv");
  if (invite.state !== "valid") {
    return (
      <AuthFrame portal="sportiv" title={SPORTIV_AUTH.invite.title}>
        <p className="text-body text-primary mb-6">{invite.state === "failed" ? STATES.loadFailed : SPORTIV_AUTH.invite.expired}</p>
        <BackLink href="/login">{SPORTIV_AUTH.reset.back}</BackLink>
      </AuthFrame>
    );
  }
  return <InviteForm copy={SPORTIV_AUTH} portal="sportiv" homePath="/" email={invite.email} google={await googleEnabled("sportiv")} />;
}
