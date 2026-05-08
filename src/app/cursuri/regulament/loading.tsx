import {
  HeroSkeleton,
  LongformSkeleton,
} from "@/components/skeletons/PageSkeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <HeroSkeleton
        title={["REGULAMENT"]}
        breadcrumb={[
          { label: "Cursuri", href: "/cursuri" },
          { label: "Regulament" },
        ]}
      />
      <div className="relative z-10 bg-white flex-1">
        <LongformSkeleton />
      </div>
    </div>
  );
}
