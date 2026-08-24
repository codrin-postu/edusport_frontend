import { SITE_URL, SITE_NAME } from "@/lib/site";

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

interface OrganizationJsonLdProps {
  telephone?: string;
  email?: string;
  sameAs?: string[];
  image?: string;
}

export function OrganizationJsonLd({ telephone, email, sameAs, image }: OrganizationJsonLdProps = {}) {
  // Logo defaults to the app-root OG image so search/AI engines always have a
  // brand image, even before a dedicated logo asset exists.
  const logo = image ?? `${SITE_URL}/opengraph-image`;
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "SportsClub",
        name: SITE_NAME,
        description:
          "Școală de patinaj artistic din București pentru copii și adulți.",
        url: SITE_URL,
        sport: "Patinaj artistic",
        priceRange: "$$",
        logo,
        address: {
          "@type": "PostalAddress",
          // TODO: add streetAddress + postalCode + geo + openingHours when
          // the club provides them (bigger local-SEO win).
          addressLocality: "București",
          addressCountry: "RO",
        },
        ...(telephone && { telephone }),
        ...(email && { email }),
        ...(image && { image }),
        ...(sameAs?.length && { sameAs }),
      }}
    />
  );
}

export function ArticleJsonLd({
  title,
  description,
  date,
  image,
  url,
}: {
  title: string;
  description: string;
  date: string;
  image?: string;
  url: string;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Article",
        headline: title,
        description,
        datePublished: date,
        ...(image && { image }),
        url,
        publisher: {
          "@type": "Organization",
          name: "EduSport",
        },
      }}
    />
  );
}

export function EventJsonLd({
  name,
  description,
  startDate,
  location,
  image,
  url,
}: {
  name: string;
  description: string;
  startDate: string;
  location?: string;
  image?: string;
  url: string;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "SportsEvent",
        name,
        description,
        startDate,
        ...(location && {
          location: {
            "@type": "Place",
            name: location,
          },
        }),
        ...(image && { image }),
        url,
        organizer: {
          "@type": "Organization",
          name: "EduSport",
        },
      }}
    />
  );
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: item.name,
          item: item.url,
        })),
      }}
    />
  );
}
