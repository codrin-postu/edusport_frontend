import {
  HeroSkeleton,
  LongformSkeleton,
} from "@/components/skeletons/PageSkeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <HeroSkeleton
        title={["DESPRE", "NOI"]}
        blurb="Povestea Școlii de Patinaj EduSport."
      />
      <div className="relative z-raised bg-surface flex-1">
        <LongformSkeleton />
      </div>
    </div>
  );
}
