import { AthleteCard } from "./AthleteCard";

export default async function AthletePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AthleteCard id={id} />;
}
