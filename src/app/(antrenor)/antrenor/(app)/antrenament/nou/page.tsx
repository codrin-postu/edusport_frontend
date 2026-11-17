import { redirect } from "next/navigation";

/** The old address: "Antrenament nou" is a popup now. `?grupa=<id>` opens it over that group's Program tab, `?tip=individual` over Azi with the Individual tab. */
export default async function NewTrainingRedirect({ searchParams }: { searchParams: Promise<{ grupa?: string; tip?: string }> }) {
  const { grupa, tip } = await searchParams;
  if (grupa) redirect(`/grupe/${encodeURIComponent(grupa)}?tab=program&nou=1`);
  redirect(tip === "individual" ? "/?nou=individual" : "/?nou=1");
}
