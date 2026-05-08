import {
  FormSkeleton,
  HeroSkeleton,
} from "@/components/skeletons/PageSkeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <HeroSkeleton title={["INSCRIERI"]} blurb="Înscrie-te la cursurile EduSport." />
      <div className="relative z-10 bg-white flex-1">
        <FormSkeleton fields={6} />
      </div>
    </div>
  );
}
