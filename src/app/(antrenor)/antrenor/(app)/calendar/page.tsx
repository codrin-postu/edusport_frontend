import { Suspense } from "react";
import { PageBody } from "@/app/_portal/ui/PageBody";
import { Spinner } from "@/app/_portal/ui/Spinner";
import { CalendarView } from "./CalendarView";

export default function CalendarPage() {
  return (
    <Suspense fallback={<PageBody><div className="flex justify-center py-6"><Spinner /></div></PageBody>}>
      <CalendarView />
    </Suspense>
  );
}
