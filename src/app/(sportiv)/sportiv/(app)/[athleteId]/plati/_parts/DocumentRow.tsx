"use client";

import { useRouter } from "next/navigation";
import { LOST_ATHLETE, MONEY } from "@/lib/portal/copy-sportiv";
import { STATES } from "@/lib/portal/copy-shared";
import { PortalCard } from "@/app/_portal/ui/PortalCard";
import { useToast } from "@/app/_portal/ui/Toast";
import { useAthletes } from "../../../_lib/athletes-context";

const FALLBACK_NAME = "fisa-inscriere.pdf";

/** The file name of a Content-Disposition header (`filename="..."` or `filename=...`), else the fixed fallback. */
function fileNameOf(disposition: string | null): string {
  const found = /filename\*?=(?:UTF-8'')?"?([^";]+)"?/i.exec(disposition ?? "");
  if (!found) return FALLBACK_NAME;
  try {
    return decodeURIComponent(found[1]).replace(/[\\/]/g, "_") || FALLBACK_NAME;
  } catch {
    return FALLBACK_NAME;
  }
}

/** The 403 that ends access to this athlete is told apart by its message, as `useSportiv` does; any other 403 is a plain failure. */
async function lostAccess(res: Response): Promise<boolean> {
  if (res.status !== 403) return false;
  try {
    const body = (await res.json()) as { error?: { message?: unknown }; message?: unknown };
    return body.error?.message === LOST_ATHLETE || body.message === LOST_ATHLETE;
  } catch {
    return false;
  }
}

/**
 * The registration form PDF of the athlete in the URL (the BFF refuses any other id). The link fetches the file so a 403 (access
 * removed) takes the access removed flow; without scripting the plain link still downloads.
 */
export function DocumentRow({ athleteId, seasonLabel }: { athleteId: string; seasonLabel: string }) {
  const router = useRouter();
  const toast = useToast();
  const { reload } = useAthletes();
  const href = `/api/portal/sportiv/athletes/${athleteId}/documents/acord`;

  const download = async(e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    let res: Response;
    try {
      res = await fetch(href, { credentials: "same-origin" });
    } catch {
      toast.show(STATES.loadFailed);
      return;
    }
    if (res.status === 401) {
      window.location.assign("/login");
      return;
    }
    if (await lostAccess(res)) {
      reload();
      toast.show(LOST_ATHLETE);
      router.replace("/");
      return;
    }
    if (!res.ok) {
      toast.show(STATES.loadFailed);
      return;
    }
    const url = URL.createObjectURL(await res.blob());
    const a = document.createElement("a");
    a.href = url;
    a.download = fileNameOf(res.headers.get("content-disposition"));
    a.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <PortalCard as="section" pad="card" className="flex-row items-center justify-between gap-3">
      <div className="flex flex-col gap-0.5">
        <span className="text-(length:--portal-row-title) font-bold">{MONEY.document.title(seasonLabel)}</span>
        <span className="text-(length:--portal-row-sub) text-muted">{MONEY.document.pdf}</span>
      </div>
      <a
        href={href}
        download
        onClick={(e) => void download(e)}
        className="inline-flex min-h-(--portal-tap) items-center text-(length:--portal-text-14) font-bold text-primary no-underline"
      >
        {MONEY.document.download}
      </a>
    </PortalCard>
  );
}
