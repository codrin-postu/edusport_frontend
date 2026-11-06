import { ArticleDetailSkeleton } from "@/components/skeletons/PageSkeleton";

// Preview renders a single article via the same _View as /noutati/[slug].
// Without this file, the parent /noutati loading screen (Noutăți listing
// hero) would show while the previewed article loads.
export default function Loading() {
  return (
    <div className="min-h-screen bg-surface-raised flex flex-col">
      <ArticleDetailSkeleton />
    </div>
  );
}
