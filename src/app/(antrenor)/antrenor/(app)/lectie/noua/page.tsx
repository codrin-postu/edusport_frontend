import { redirect } from "next/navigation";

/** The old new-lesson address: the training popup over Azi with the Individual tab. */
export default function NewLessonRedirect() {
  redirect("/?nou=individual");
}
