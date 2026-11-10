import { EditLesson } from "./EditLesson";

export default async function EditLessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EditLesson id={id} />;
}
