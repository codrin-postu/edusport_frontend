import { notFound } from "next/navigation";
import { kitPreviewEnabled } from "@/lib/portal/kit-preview";
import { KitPreview } from "./KitPreview";

export const dynamic = "force-dynamic";

/** Every portal kit part with sample data, for the computed-style tests and a look by eye. Off unless PORTAL_KIT_PREVIEW=1. */
export default function KitPreviewPage() {
  if (!kitPreviewEnabled(process.env)) notFound();
  return <KitPreview />;
}
