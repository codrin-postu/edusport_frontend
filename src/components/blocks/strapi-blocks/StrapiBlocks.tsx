import React from "react";
import { strapiMediaUrl } from "@/lib/strapi-article";
import { ArticleImage } from "@/components/blocks/article-card/ArticleImage";
import type {
  BlockNode,
  TextNode,
  ParagraphNode,
  HeadingNode,
  ListNode,
  ListItemNode,
  QuoteNode,
  CodeNode,
  ImageNode,
  LinkNode,
} from "@/lib/strapi-article";

// ── Inline text (bold, italic, underline, code…) ──────────────────────────────

function RenderText({ node }: { node: TextNode }) {
  let el: React.ReactNode = node.text;
  if (node.code) el = <code className="text-sm bg-navy/[0.08] px-1.5 py-0.5 font-mono text-rust">{el}</code>;
  if (node.bold) el = <strong className="font-bold text-navy">{el}</strong>;
  if (node.italic) el = <em>{el}</em>;
  if (node.underline) el = <u>{el}</u>;
  if (node.strikethrough) el = <s>{el}</s>;
  return <>{el}</>;
}

function RenderChildren({ nodes }: { nodes: BlockNode[] }) {
  return (
    <>
      {nodes.map((node, i) => (
        <RenderBlock key={i} node={node} />
      ))}
    </>
  );
}

function RenderBlock({ node }: { node: BlockNode }) {
  switch (node.type) {
    case "text":
      return <RenderText node={node as TextNode} />;

    case "link": {
      const l = node as LinkNode;
      const isExternal = l.url.startsWith("http");
      return (
        <a
          href={l.url}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className="link-underline-rust text-rust font-semibold"
        >
          {l.children.map((t, i) => <RenderText key={i} node={t} />)}
        </a>
      );
    }

    case "paragraph": {
      const p = node as ParagraphNode;
      return (
        <p className="text-navy/[0.72] mb-[18px] leading-[1.7]">
          <RenderChildren nodes={p.children} />
        </p>
      );
    }

    case "heading": {
      const h = node as HeadingNode;
      const inner = <RenderChildren nodes={h.children} />;
      switch (h.level) {
        case 1: return <h2 className="font-bold text-navy text-3xl mt-10 mb-4 tracking-tight">{inner}</h2>;
        case 2: return <h2 className="font-bold text-navy text-2xl mt-8 mb-3 tracking-tight">{inner}</h2>;
        case 3: return <h3 className="font-bold text-navy text-lg mt-6 mb-2">{inner}</h3>;
        case 4: return <h4 className="font-bold text-navy text-base mt-6 mb-2">{inner}</h4>;
        case 5: return <h5 className="font-bold text-navy text-sm mt-4 mb-2 uppercase tracking-widest">{inner}</h5>;
        case 6: return <h6 className="font-bold text-navy text-xs mt-4 mb-1 uppercase tracking-widest">{inner}</h6>;
        default: return <h2 className="font-bold text-navy text-2xl mt-8 mb-3 tracking-tight">{inner}</h2>;
      }
    }

    case "list": {
      const l = node as ListNode;
      const items = l.children.map((item, i) => (
        <li key={i} className="text-navy/[0.72] leading-relaxed">
          <RenderChildren nodes={(item as ListItemNode).children} />
        </li>
      ));
      return l.format === "ordered" ? (
        <ol className="list-decimal list-outside marker:text-rust marker:font-bold ml-5 mb-[18px] space-y-2">{items}</ol>
      ) : (
        <ul className="mb-[18px] space-y-2 [&>li]:relative [&>li]:pl-5 [&>li]:before:absolute [&>li]:before:left-0.5 [&>li]:before:content-['›'] [&>li]:before:font-extrabold [&>li]:before:text-rust">{items}</ul>
      );
    }

    case "list-item": {
      const li = node as ListItemNode;
      return (
        <li className="text-navy/[0.72]">
          <RenderChildren nodes={li.children} />
        </li>
      );
    }

    case "quote": {
      const q = node as QuoteNode;
      return (
        <blockquote className="border-l-4 border-rust bg-navy/[0.04] py-4 px-6 mb-[18px] text-navy not-italic">
          <RenderChildren nodes={q.children} />
        </blockquote>
      );
    }

    case "code": {
      const c = node as CodeNode;
      return (
        <pre className="bg-navy text-retro-cream p-4 mb-[18px] overflow-x-auto text-sm font-mono">
          <code>{c.children.map((t) => t.text).join("")}</code>
        </pre>
      );
    }

    case "image": {
      const img = node as ImageNode;
      const src = strapiMediaUrl(img.image.url);
      const caption = img.image.caption || img.image.alternativeText;
      return (
        <figure className="my-8">
          <div className="relative w-full aspect-video overflow-hidden border-[1.5px] border-navy bg-navy/[0.03]">
            <ArticleImage
              src={src}
              alt={img.image.alternativeText ?? ""}
              sizes="(min-width: 1024px) 768px, 100vw"
            />
          </div>
          {caption && (
            <figcaption className="mt-2 text-center text-xs text-navy/45">
              {caption}
            </figcaption>
          )}
        </figure>
      );
    }

    default:
      return null;
  }
}

interface Props {
  blocks: BlockNode[];
  className?: string;
}

export default function StrapiBlocks({ blocks, className }: Props) {
  if (!blocks?.length) return null;
  return (
    <div className={className}>
      {blocks.map((block, i) => (
        <RenderBlock key={i} node={block} />
      ))}
    </div>
  );
}
