import React from "react";
import Image from "next/image";
import { strapiMediaUrl } from "@/lib/strapi-article";
import { SHIMMER_DATA_URL } from "@/lib/blurDataUrl";
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

// ---------------------------------------------------------------------------
// Inline text renderer (handles bold, italic, underline, code, etc.)
// ---------------------------------------------------------------------------

function RenderText({ node }: { node: TextNode }) {
  let el: React.ReactNode = node.text;
  if (node.code) el = <code className="text-sm bg-gray-100 px-1.5 py-0.5 rounded font-mono text-edusport-blue">{el}</code>;
  if (node.bold) el = <strong className="font-semibold text-gray-800">{el}</strong>;
  if (node.italic) el = <em>{el}</em>;
  if (node.underline) el = <u>{el}</u>;
  if (node.strikethrough) el = <s>{el}</s>;
  return <>{el}</>;
}

// ---------------------------------------------------------------------------
// Block renderers
// ---------------------------------------------------------------------------

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
          className="text-edusport-blue underline underline-offset-2 hover:opacity-70 transition-opacity"
        >
          {l.children.map((t, i) => <RenderText key={i} node={t} />)}
        </a>
      );
    }

    case "paragraph": {
      const p = node as ParagraphNode;
      return (
        <p className="text-gray-600 mb-5 font-light leading-relaxed">
          <RenderChildren nodes={p.children} />
        </p>
      );
    }

    case "heading": {
      const h = node as HeadingNode;
      const inner = <RenderChildren nodes={h.children} />;
      const cls = "font-semibold text-gray-900 tracking-tight";
      switch (h.level) {
        case 1: return <h1 className={`text-3xl mt-10 mb-4 ${cls}`}>{inner}</h1>;
        case 2: return <h2 className={`text-2xl mt-10 mb-4 ${cls}`}>{inner}</h2>;
        case 3: return <h3 className={`text-lg mt-8 mb-3 ${cls}`}>{inner}</h3>;
        case 4: return <h4 className={`text-base mt-6 mb-2 ${cls}`}>{inner}</h4>;
        case 5: return <h5 className={`text-sm mt-4 mb-2 ${cls} uppercase tracking-widest`}>{inner}</h5>;
        case 6: return <h6 className={`text-xs mt-4 mb-1 ${cls} uppercase tracking-widest`}>{inner}</h6>;
        default: return <h2 className={`text-2xl mt-10 mb-4 ${cls}`}>{inner}</h2>;
      }
    }

    case "list": {
      const l = node as ListNode;
      const items = l.children.map((item, i) => (
        <li key={i} className="text-gray-600 pl-1">
          <RenderChildren nodes={(item as ListItemNode).children} />
        </li>
      ));
      return l.format === "ordered" ? (
        <ol className="list-decimal list-outside ml-5 mb-5 space-y-1.5 font-light">{items}</ol>
      ) : (
        <ul className="list-disc list-outside ml-5 mb-5 space-y-1.5 font-light">{items}</ul>
      );
    }

    case "list-item": {
      const li = node as ListItemNode;
      return (
        <li className="text-gray-600 pl-1">
          <RenderChildren nodes={li.children} />
        </li>
      );
    }

    case "quote": {
      const q = node as QuoteNode;
      return (
        <blockquote className="border-l-4 border-edusport-blue bg-gray-50 py-4 px-6 rounded-r-lg mb-5 not-italic">
          <RenderChildren nodes={q.children} />
        </blockquote>
      );
    }

    case "code": {
      const c = node as CodeNode;
      return (
        <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 mb-5 overflow-x-auto text-sm font-mono">
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
          <div className="relative w-full aspect-video bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={src}
              alt={img.image.alternativeText ?? ""}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 768px, 100vw"
              placeholder="blur"
              blurDataURL={SHIMMER_DATA_URL}
            />
          </div>
          {caption && (
            <figcaption className="mt-2 text-center text-xs text-gray-400 font-light">
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

// ---------------------------------------------------------------------------
// Public component
// ---------------------------------------------------------------------------

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
