import React from "react";

// Tiny safe markdown renderer for the season-calendar weekend popover.
// Supported subset: **bold**, *italic*, [text](url), paragraph breaks (blank line),
// and soft line breaks. Anything outside this set renders as literal text.
//
// Source is admin-authored, but we still only allow http(s)/relative/mailto URLs
// in links to avoid javascript: payloads.

const SAFE_URL = /^(https?:\/\/|\/|mailto:)/i;

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337";

// Strapi stores uploaded files as `/uploads/...`. Prepend the backend host so
// the browser actually loads them (the frontend lives on a different origin
// in dev and prod). External (https://) URLs are returned unchanged.
export function resolveAssetUrl(url: string): string {
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith("/uploads/")) return `${STRAPI_URL}${url}`;
  return url;
}

const STANDALONE_IMAGE_RE = /!\[([^\]]*)\]\(([^)]+)\)/;

export interface ExtractedImage {
  url: string;
  alt: string;
}

/**
 * Lifts the first markdown image out of a description so consumers can render
 * it in a separate layout slot (side-by-side on desktop, stacked on mobile).
 * Returns the picked image plus the source with that image's markdown removed.
 * If the source contains no image, returns `{ image: null, body: source }`.
 *
 * Only the first image is extracted by design - descriptions on the calendar
 * popover are capped at one image in the admin editor.
 */
export function extractFirstImage(
  source: string | null | undefined,
): { image: ExtractedImage | null; body: string } {
  if (!source) return { image: null, body: "" };
  const match = source.match(STANDALONE_IMAGE_RE);
  if (!match || match.index === undefined) return { image: null, body: source };
  if (!SAFE_URL.test(match[2])) return { image: null, body: source };
  const image: ExtractedImage = { alt: match[1], url: match[2] };
  const body = (source.slice(0, match.index) + source.slice(match.index + match[0].length))
    // Collapse the blank line the image likely sat on so paragraph splitting stays clean.
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return { image, body };
}

interface Token {
  type: "text" | "bold" | "italic" | "link" | "image";
  content: string;
  href?: string;
  /** Re-tokenized children for wrappers like bold/italic so nested
   * markdown (e.g. a link inside italic) still parses correctly. */
  children?: Token[];
}

const BOLD = /^\*\*([^*]+)\*\*/;
const ITALIC = /^\*([^*]+)\*/;
const IMAGE = /^!\[([^\]]*)\]\(([^)]+)\)/;
const LINK = /^\[([^\]]+)\]\(([^)]+)\)/;

function matchInline(s: string): { token: Token; consumed: number } | null {
  // Image first so `![alt](url)` doesn't get parsed as a link.
  const image = s.match(IMAGE);
  if (image && SAFE_URL.test(image[2])) {
    return { token: { type: "image", content: image[1], href: image[2] }, consumed: image[0].length };
  }

  const bold = s.match(BOLD);
  if (bold) {
    return {
      token: { type: "bold", content: bold[1], children: tokenizeInline(bold[1]) },
      consumed: bold[0].length,
    };
  }

  const italic = s.match(ITALIC);
  if (italic) {
    return {
      token: { type: "italic", content: italic[1], children: tokenizeInline(italic[1]) },
      consumed: italic[0].length,
    };
  }

  const link = s.match(LINK);
  if (link && SAFE_URL.test(link[2])) {
    return { token: { type: "link", content: link[1], href: link[2] }, consumed: link[0].length };
  }

  return null;
}

function tokenizeInline(line: string): Token[] {
  const out: Token[] = [];
  let buf = "";
  let i = 0;
  while (i < line.length) {
    const m = matchInline(line.slice(i));
    if (m) {
      if (buf) {
        out.push({ type: "text", content: buf });
        buf = "";
      }
      out.push(m.token);
      i += m.consumed;
    } else {
      buf += line[i];
      i++;
    }
  }
  if (buf) out.push({ type: "text", content: buf });
  return out;
}

function renderTokens(tokens: Token[]): React.ReactNode[] {
  return tokens.map((t, i) => {
    if (t.type === "bold") {
      return <strong key={i}>{t.children ? renderTokens(t.children) : t.content}</strong>;
    }
    if (t.type === "italic") {
      return <em key={i}>{t.children ? renderTokens(t.children) : t.content}</em>;
    }
    if (t.type === "image" && t.href) {

      return (
        <img
          key={i}
          src={resolveAssetUrl(t.href)}
          alt={t.content}
          className="my-1 max-w-full h-auto rounded"
          loading="lazy"
        />
      );
    }
    if (t.type === "link" && t.href) {
      return (
        <a
          key={i}
          href={t.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-edusport-blue underline underline-offset-2 hover:text-edusport-blue/80"
        >
          {t.content}
        </a>
      );
    }
    return <React.Fragment key={i}>{t.content}</React.Fragment>;
  });
}

// Render markdown to React nodes. Splits on blank lines for paragraphs.
// Supports `## Heading`, `- list item`, plus the inline subset above.
export function renderMarkdown(source: string | null | undefined): React.ReactNode {
  if (!source) return null;
  const blocks = source
    .replace(/\r\n/g, "\n")
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter((b) => b.length > 0);

  return blocks.map((block, bIdx) => {
    const lines = block.split("\n");

    // Heading: a single line starting with `# `, `## `, or `### `
    if (lines.length === 1) {
      const headingMatch = lines[0].match(/^(#{1,3})\s+(.*)$/);
      if (headingMatch) {
        const level = headingMatch[1].length;
        const text = renderTokens(tokenizeInline(headingMatch[2]));
        if (level === 1) {
          return (
            <h2 key={bIdx} className="font-bold text-gray-900 text-lg">
              {text}
            </h2>
          );
        }
        if (level === 2) {
          return (
            <h3 key={bIdx} className="font-semibold text-gray-900 text-base">
              {text}
            </h3>
          );
        }
        return (
          <h4 key={bIdx} className="font-semibold text-gray-800 text-sm">
            {text}
          </h4>
        );
      }
    }

    // List: every line starts with `- ` (or `* `)
    const isList = lines.every((l) => /^[-*] /.test(l));
    if (isList) {
      return (
        <ul key={bIdx} className="list-disc pl-5 space-y-1">
          {lines.map((line, lIdx) => (
            <li key={lIdx}>{renderTokens(tokenizeInline(line.slice(2)))}</li>
          ))}
        </ul>
      );
    }

    // Default: paragraph with soft <br /> between lines
    return (
      <p key={bIdx} className="leading-relaxed">
        {lines.map((line, lIdx) => (
          <React.Fragment key={lIdx}>
            {renderTokens(tokenizeInline(line))}
            {lIdx < lines.length - 1 && <br />}
          </React.Fragment>
        ))}
      </p>
    );
  });
}
