import {
  HeroSkeleton,
  LongformSkeleton,
} from "@/components/skeletons/PageSkeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-retro-cream flex flex-col">
      <HeroSkeleton title={["POLITICA", "COOKIES"]} />
      <div className="relative z-10 bg-retro-cream flex-1">
        <LongformSkeleton />
      </div>
    </div>
  );
}
