import PageHeroSection from "@/components/blocks/page-hero-section";
import Section from "@/components/ui/section";
import { CardGridSkeleton } from "@/components/skeletons/PageSkeleton";

// Roster placeholder with the real Sportivi hero, so the parent /despre-noi
// loading screen does not show while the roster loads. Cards are the default
// roster view, so the placeholder is a 4-column card grid.
export default function Loading() {
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <PageHeroSection
        title={["SPORTIVI"]}
        breadcrumb={[
          { label: "Despre noi", href: "/despre-noi" },
          { label: "Sportivi" },
        ]}
      >
        <h1 className="text-display text-primary-on-dark">Sportivii noștri</h1>
      </PageHeroSection>
      <div className="relative z-raised bg-surface flex-1">
        <Section className="section">
          <CardGridSkeleton count={8} cols={4} />
        </Section>
      </div>
    </div>
  );
}
