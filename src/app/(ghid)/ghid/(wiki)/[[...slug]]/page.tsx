import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Article } from "@/components/ghid/Article";
import { PhoneContents } from "@/components/ghid/PhoneContents";
import { Search } from "@/components/ghid/Search";
import { Rail } from "@/components/ghid/Rail";
import { TopBar } from "@/components/ghid/TopBar";
import { GHID_GROUPS } from "@/content/ghid";
import { findEntry, orderedPages, pageText } from "@/lib/ghid/registry";
import type { SearchDoc } from "@/lib/ghid/search";
import { requireGhid } from "@/lib/ghid/require";

type Params = { slug?: string[] };

export function generateStaticParams(): Params[] {
  return [{ slug: [] }, ...orderedPages(GHID_GROUPS).map((o) => ({ slug: [o.page.slug] }))];
}

function resolve(slug: string[] | undefined) {
  if (slug && slug.length > 1) return undefined;
  return findEntry(GHID_GROUPS, slug?.[0]);
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const entry = resolve((await params).slug);
  return { title: entry ? `${entry.page.title} | Ghid EduSport` : "Ghid EduSport" };
}

export default async function GhidPage({ params }: { params: Promise<Params> }) {
  // The layout checks too, but a client navigation can skip the layout: check here as well.
  await requireGhid();
  const entry = resolve((await params).slug);
  if (!entry) notFound();
  const docs: SearchDoc[] = orderedPages(GHID_GROUPS).map((o) => ({ slug: o.page.slug, title: o.page.title, group: o.group, text: pageText(o.page) }));
  return (
    <>
      <TopBar>
        <Search docs={docs} variant="bar" />
      </TopBar>
      <div className="grid portal:grid-cols-[var(--ghid-rail-w)_minmax(0,1fr)]">
        <aside className="sticky top-(--ghid-bar-h) hidden h-[calc(100svh-var(--ghid-bar-h))] overflow-y-auto border-r border-line-subtle bg-surface-raised p-3 portal:block">
          <Rail groups={GHID_GROUPS} current={entry.page.slug} />
        </aside>
        <main className="min-w-0">
          <div className="flex gap-2 border-b border-line-subtle bg-surface-raised px-4 py-3 portal:hidden">
            <PhoneContents>
              <Rail groups={GHID_GROUPS} current={entry.page.slug} />
            </PhoneContents>
            <Search docs={docs} variant="phone" />
          </div>
          <Article entry={entry} />
        </main>
      </div>
    </>
  );
}
