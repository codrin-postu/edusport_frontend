import Link from "@/components/ui/link";
import { GHID_GROUPS } from "@/content/ghid";
import { renderInline } from "@/lib/ghid/inline";
import { findPage } from "@/lib/ghid/registry";
import type { Block } from "@/lib/ghid/types";
import { Steps } from "./Steps";
import { Video } from "./Video";
import { Warn } from "./Warn";

function One({ block }: { block: Block }) {
  switch (block.t) {
    case "p":
      return <p className="m-0 max-w-[62ch] text-(length:--portal-text-15)">{renderInline(block.text)}</p>;
    case "h2":
      return <h2 className="m-0 font-display text-(length:--portal-h2-size) font-extrabold">{block.text}</h2>;
    case "list":
      return (
        <ul className="m-0 flex max-w-[62ch] list-disc flex-col gap-2 pl-6 text-(length:--portal-text-15)">
          {block.items.map((it, i) => <li key={i}>{renderInline(it)}</li>)}
        </ul>
      );
    case "steps":
      return <Steps steps={block.steps} />;
    case "warn":
      return <Warn text={block.text} />;
    case "video":
      return <Video src={block.src} length={block.length} />;
    case "links":
      return (
        <ul className="m-0 flex list-none flex-col gap-2 p-0 text-(length:--portal-text-15)">
          {block.items.flatMap((it) => {
            const p = findPage(GHID_GROUPS, it.slug);
            return p ? [<li key={it.slug}><Link href={`/ghid/${it.slug}`}>{it.label ?? p.title}</Link></li>] : [];
          })}
        </ul>
      );
  }
}

export function Blocks({ blocks }: { blocks: Block[] }) {
  return <>{blocks.map((b, i) => <One key={i} block={b} />)}</>;
}
