import { Suspense } from "react";
import { Spinner } from "../../_ui/Spinner";
import { HistoryView } from "./HistoryView";

export default function HistoryPage() {
  return (
    <Suspense fallback={<div className="py-6 flex justify-center"><Spinner /></div>}>
      <HistoryView />
    </Suspense>
  );
}
