import { Suspense } from "react";
import { PageBody } from "@/app/_portal/ui/PageBody";
import { Spinner } from "@/app/_portal/ui/Spinner";
import { NewTraining } from "./NewTraining";

export default function NewTrainingPage() {
  return (
    <Suspense fallback={<PageBody><div className="flex justify-center py-6"><Spinner /></div></PageBody>}>
      <NewTraining />
    </Suspense>
  );
}
