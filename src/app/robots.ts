import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// AI / agentic crawler policy.
// ALLOW: engines that cite sources live in answers (people asking an AI about
// skating schools may be shown our content). BLOCK: bulk training scrapers.
// Move a user-agent between the two lists to change its access. ClaudeBot is
// placed in ALLOW (Claude cites live) though it is debatable.
const AI_ANSWER_BOTS = [
  "PerplexityBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "Google-Extended",
  "ClaudeBot",
  "Applebot-Extended",
];
const AI_TRAINING_BOTS = [
  "GPTBot",
  "CCBot",
  "Bytespider",
  "Amazonbot",
  "anthropic-ai",
  "Diffbot",
  "Omgilibot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: AI_ANSWER_BOTS, allow: "/" },
      { userAgent: AI_TRAINING_BOTS, disallow: "/" },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
