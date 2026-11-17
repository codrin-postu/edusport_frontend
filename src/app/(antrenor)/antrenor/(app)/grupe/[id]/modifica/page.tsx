import { EditGroup } from "./EditGroup";

export default async function EditGroupPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EditGroup id={id} />;
}
