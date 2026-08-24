import {
  FormSkeleton,
  HeroSkeleton,
} from "@/components/skeletons/PageSkeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-retro-cream flex flex-col">
      <HeroSkeleton
        title={["CONTACT"]}
        blurb="Suntem aici să răspundem la întrebările tale."
      />
      <div className="relative z-10 bg-retro-cream flex-1">
        <FormSkeleton fields={5} />
      </div>
    </div>
  );
}
