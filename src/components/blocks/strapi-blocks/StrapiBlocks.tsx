import React from "react";
import Image from "next/image";
import { strapiMediaUrl } from "@/lib/strapi-article";
import { ArticleImage } from "@/components/blocks/article-card/ArticleImage";
import { bulletListProse } from "@/components/ui/bullet-list";
import { cn } from "@/utils/cn";
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
  // Strapi stores a soft line break (Shift+Enter in the editor, or a <br> from
  // an import) as a "\n" inside the text node. HTML collapses it to a space, so
  // split it into <br /> the way Strapi's own blocks renderer does.
  let el: React.ReactNode = node.text.includes("\n")
    ? node.text.split("\n").map((line, i) => (
        <React.Fragment key={i}>
          {i > 0 && <br />}
          {line}
        </React.Fragment>
      ))
    : node.text;
  if (node.code) el = <code className="text-body-sm bg-surface-subtle px-2 py-0.5 font-mono text-accent">{el}</code>;
  if (node.bold) el = <strong className="font-bold text-primary">{el}</strong>;
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
          className="link text-accent font-semibold"
        >
          {l.children.map((t, i) => <RenderText key={i} node={t} />)}
        </a>
      );
    }

    case "paragraph": {
      const p = node as ParagraphNode;
      return (
        <p className="text-body text-secondary mb-4">
          <RenderChildren nodes={p.children} />
        </p>
      );
    }

    case "heading": {
      const h = node as HeadingNode;
      const inner = <RenderChildren nodes={h.children} />;
      switch (h.level) {
        case 1: return <h2 className="text-heading text-primary mt-12 mb-4">{inner}</h2>;
        case 2: return <h2 className="text-heading text-primary mt-8 mb-3">{inner}</h2>;
        case 3: return <h3 className="text-title text-primary mt-6 mb-2">{inner}</h3>;
        case 4: return <h4 className="text-label text-primary mt-6 mb-2 uppercase">{inner}</h4>;
        case 5: return <h5 className="text-label text-primary mt-4 mb-2 uppercase">{inner}</h5>;
        case 6: return <h6 className="text-label text-primary mt-4 mb-1 uppercase">{inner}</h6>;
        default: return <h2 className="text-heading text-primary mt-8 mb-3">{inner}</h2>;
      }
    }

    case "list": {
      const l = node as ListNode;
      const items = l.children.map((item, i) => (
        <li key={i} className="text-secondary leading-relaxed">
          <RenderChildren nodes={(item as ListItemNode).children} />
        </li>
      ));
      return l.format === "ordered" ? (
        <ol className="list-decimal list-outside marker:text-accent marker:font-bold ml-6 mb-4 space-y-2">{items}</ol>
      ) : (
        <ul className={cn("mb-4 space-y-2", bulletListProse)}>{items}</ul>
      );
    }

    case "list-item": {
      const li = node as ListItemNode;
      return (
        <li className="text-secondary">
          <RenderChildren nodes={li.children} />
        </li>
      );
    }

    case "quote": {
      const q = node as QuoteNode;
      return (
        <blockquote className="border-l-4 border-rust bg-surface-subtle py-4 px-6 mb-4 text-primary not-italic">
          <RenderChildren nodes={q.children} />
        </blockquote>
      );
    }

    case "code": {
      const c = node as CodeNode;
      return (
        <pre className="text-body-sm bg-surface-dark text-primary-on-dark p-4 mb-4 overflow-x-auto font-mono">
          <code>{c.children.map((t) => t.text).join("")}</code>
        </pre>
      );
    }

    case "image": {
      const img = node as ImageNode;
      const src = strapiMediaUrl(img.image.url);
      const caption = img.image.caption || img.image.alternativeText;
      const { width, height } = img.image;

      // Body images render at their own proportions.
      //
      // They used to be forced into an aspect-video box with object-cover,
      // which is right for article cards (uniform thumbnails) and wrong here:
      // it cropped tall images to a 16:9 slice and blew small ones up to the
      // full column width. A portrait poster lost its top and bottom, and a
      // square QR code became a giant blurry crop.
      //
      // The natural width is also an upper bound, so a small image sits at its
      // real size instead of being upscaled. Only when Strapi gives us no
      // dimensions do we fall back to the fixed box.
      if (width && height) {
        return (
          <figure className="my-8">
            <div
              className="relative mx-auto overflow-hidden border-retro border-line bg-surface-subtle"
              style={{ maxWidth: width }}
            >
              <Image
                src={src}
                alt={img.image.alternativeText ?? ""}
                width={width}
                height={height}
                className="h-auto w-full"
                sizes="(min-width: 1024px) 768px, 100vw"
              />
            </div>
            {caption && (
              <figcaption className="text-caption mt-2 text-center text-secondary">
                {caption}
              </figcaption>
            )}
          </figure>
        );
      }

      return (
        <figure className="my-8">
          <div className="relative w-full aspect-video overflow-hidden border-retro border-line bg-surface-subtle">
            <ArticleImage
              src={src}
              alt={img.image.alternativeText ?? ""}
              sizes="(min-width: 1024px) 768px, 100vw"
            />
          </div>
          {caption && (
            <figcaption className="text-caption mt-2 text-center text-secondary">
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
