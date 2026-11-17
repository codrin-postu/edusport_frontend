import { GroupView } from "./GroupView";

export default async function GroupPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <GroupView id={id} />;
}
