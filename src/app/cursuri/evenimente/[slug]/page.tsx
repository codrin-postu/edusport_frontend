import EventDetailPage from "./_View";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  return <EventDetailPage slug={slug} />;
}
