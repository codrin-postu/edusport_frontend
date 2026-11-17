import { Suspense } from "react";
import { PageBody } from "@/app/_portal/ui/PageBody";
import { Spinner } from "@/app/_portal/ui/Spinner";
import { PresenceView } from "./PresenceView";

export default function PresencePage() {
  return (
    <Suspense fallback={<PageBody><div className="flex justify-center py-6"><Spinner /></div></PageBody>}>
      <PresenceView />
    </Suspense>
  );
}
