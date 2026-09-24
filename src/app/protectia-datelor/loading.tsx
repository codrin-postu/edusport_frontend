import {
  HeroSkeleton,
  LongformSkeleton,
} from "@/components/skeletons/PageSkeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <HeroSkeleton title={["PROTECTIA", "DATELOR"]} />
      <div className="relative z-10 bg-surface flex-1">
        <LongformSkeleton />
      </div>
    </div>
  );
}
