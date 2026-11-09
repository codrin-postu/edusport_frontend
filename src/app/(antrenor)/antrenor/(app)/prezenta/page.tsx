import { Suspense } from "react";
import { Spinner } from "@/app/_portal/ui/Spinner";
import { PresenceView } from "./PresenceView";

export default function PresencePage() {
  return (
    <Suspense fallback={<div className="py-6 flex justify-center"><Spinner /></div>}>
      <PresenceView />
    </Suspense>
  );
}
