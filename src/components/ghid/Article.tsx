import { neighbours } from "@/lib/ghid/registry";
import type { OrderedPage } from "@/lib/ghid/registry";
import { GHID_GROUPS } from "@/content/ghid";
import { renderInline } from "@/lib/ghid/inline";
import { Blocks } from "./Blocks";
import { PrevNext } from "./PrevNext";

export function Article({ entry }: { entry: OrderedPage }) {
  const { page, group } = entry;
  const { prev, next } = neighbours(GHID_GROUPS, page.slug);
  return (
    <article className="flex min-w-0 flex-col gap-6 px-4 py-6 portal:px-12">
      <span className="text-(length:--portal-text-13) text-muted">{group} / {page.title}</span>
      <h1 className="m-0 font-display text-(length:--portal-h1-size) font-extrabold leading-(--portal-leading-h1) text-balance">{page.title}</h1>
      <p className="m-0 max-w-[62ch] text-(length:--portal-text-16) text-muted">{renderInline(page.lead)}</p>
      <Blocks blocks={page.blocks} />
      <PrevNext prev={prev} next={next} />
    </article>
  );
}
