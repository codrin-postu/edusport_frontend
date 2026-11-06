import { NewAthlete } from "./NewAthlete";

export default async function NewAthletePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <NewAthlete id={id} />;
}
