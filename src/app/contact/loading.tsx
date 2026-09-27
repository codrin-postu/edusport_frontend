import {
  FormSkeleton,
  HeroSkeleton,
} from "@/components/skeletons/PageSkeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <HeroSkeleton
        title={["CONTACT"]}
        blurb="Suntem aici să răspundem la întrebările tale."
      />
      <div className="relative z-raised bg-surface flex-1">
        <FormSkeleton fields={5} />
      </div>
    </div>
  );
}
