import {
  CardGridSkeleton,
  HeroSkeleton,
} from "@/components/skeletons/PageSkeleton";
import Section from "@/components/ui/section";

export default function Loading() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <HeroSkeleton
        title={["ECHIPA"]}
        breadcrumb={[
          { label: "Despre noi", href: "/despre-noi" },
          { label: "Echipa" },
        ]}
      />
      <div className="relative z-10 bg-white flex-1">
        <Section className="py-16 md:py-20">
          <CardGridSkeleton count={6} cols={3} />
        </Section>
      </div>
    </div>
  );
}
