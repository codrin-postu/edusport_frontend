import type { Metadata } from "next";
import EventsPage from "./_View";
import { fetchArticles, strapiMediaUrl, fetchNextEvent } from "@/lib/strapi-article";
import type { Event } from "./_data";

export const metadata: Metadata = {
  title: "Evenimente",
  description:
    "Evenimente de patinaj artistic organizate de EduSport. Spectacole, competiții și întâlniri sportive.",
  alternates: { canonical: "/cursuri/evenimente" },
  openGraph: {
    title: "Evenimente | EduSport",
    description: "Evenimente de patinaj artistic organizate de EduSport.",
    type: "website",
    locale: "ro_RO",
    images: [{ url: "/images/courses_generated.png", width: 1200, height: 630, alt: "EduSport - Școala de Patinaj" }],
  },
};

export const revalidate = 300;

export default async function Page() {
  try {
    // Treat both "evenimente" and "competitii" articles as events on this page.
    const [evenimente, competitii] = await Promise.all([
      fetchArticles("evenimente"),
      fetchArticles("competitii"),
    ]);
    const strapiEvents = [...evenimente, ...competitii];
    const now = Date.now();

    const mapped: Event[] = strapiEvents.map((a) => ({
      slug: a.slug,
      title: a.title,
      date: a.eventDate ?? a.date,
      location: a.eventLocation,
      coverImage: a.coverImage
        ? strapiMediaUrl(a.coverImage.url)
        : "/images/courses_generated.png",
      excerpt: a.description ?? "",
      body: "",
      admissionInfo: a.eventAdmissionInfo,
    }));

    // The "next event" rule lives in fetchNextEvent so the homepage hero and
    // this page can never disagree about which event is current.
    const next = await fetchNextEvent();
    const currentEvent = next
      ? (mapped.find((e) => e.slug === next.slug) ?? null)
      : null;

    const past = mapped
      .filter((e) => new Date(e.date).getTime() < now)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
      <EventsPage
        currentEvent={currentEvent}
        pastEvents={past.slice(0, 5)}
      />
    );
  } catch {
    return <EventsPage currentEvent={null} pastEvents={[]} />;
  }
}
