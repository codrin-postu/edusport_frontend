// Env value helpers. Pure: loaded by Node tests, so no imports and no path aliases.
// An empty or blank value counts as missing: `??` alone lets `NAME=` (an unset compose build arg) through as "".

/** The trimmed value, or undefined when it is missing, empty or blank. */
export function envText(value: string | undefined): string | undefined {
  const text = (value ?? "").trim();
  return text === "" ? undefined : text;
}

/** The trimmed value, or the fallback when it is missing, empty or blank. */
export function envOr(value: string | undefined, fallback: string): string {
  return envText(value) ?? fallback;
}

/**
 * The canonical site origin. Required in production builds: there is no fallback to a hard-coded domain, so a new
 * deploy can never publish another site's canonical URL, sitemap or JSON-LD. Outside production a local default is used.
 */
export function siteUrlFrom(value: string | undefined, nodeEnv: string | undefined): string {
  const url = envText(value);
  if (url) return url;
  if (nodeEnv === "production") {
    throw new Error("NEXT_PUBLIC_SITE_URL is required for a production build (the public site origin, for example https://www.example.com). Set it in .env.production or as a build arg.");
  }
  return "http://localhost:3000";
}

/** next/image `remotePatterns` entry for the Strapi uploads host, derived from the public Strapi URL. Null when it is missing or not a URL. */
export function strapiImagePattern(strapiUrl: string | undefined): { protocol: "http" | "https"; hostname: string; port: string; pathname: string } | null {
  const raw = envText(strapiUrl);
  if (!raw) return null;
  try {
    const url = new URL(raw);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return { protocol: url.protocol === "http:" ? "http" : "https", hostname: url.hostname, port: url.port, pathname: "/uploads/**" };
  } catch {
    return null;
  }
}
