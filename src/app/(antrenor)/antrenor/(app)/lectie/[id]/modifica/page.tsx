import { redirect } from "next/navigation";

/** The old address: "Modifică lecția" is a popup over the lesson page now. */
export default async function EditLessonRedirect({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  redirect(`/lectie/${encodeURIComponent(id)}?modifica=1`);
}
