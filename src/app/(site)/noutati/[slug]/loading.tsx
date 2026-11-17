import { ArticleDetailSkeleton } from "@/components/skeletons/PageSkeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-surface-raised flex flex-col">
      <ArticleDetailSkeleton />
    </div>
  );
}
