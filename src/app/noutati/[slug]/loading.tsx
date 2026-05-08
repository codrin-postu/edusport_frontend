import { ArticleDetailSkeleton } from "@/components/skeletons/PageSkeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <ArticleDetailSkeleton />
    </div>
  );
}
