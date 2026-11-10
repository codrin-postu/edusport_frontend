"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageBody } from "@/app/_portal/ui/PageBody";
import { Spinner } from "@/app/_portal/ui/Spinner";

/** The old new-lesson address: the one training form with the Individual tab. */
export default function NewLessonRedirect() {
  const router = useRouter();
  useEffect(() => { router.replace("/antrenament/nou?tip=individual"); }, [router]);
  return <PageBody><div className="flex justify-center py-6"><Spinner /></div></PageBody>;
}
