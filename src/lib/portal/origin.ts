// Cross-site guard for the BFF: a write must come from the coach host itself.
export function originAllowed(method: string, origin: string | null, host: string | null, secure: boolean): boolean {
  if (method === "GET" || method === "HEAD") return true;
  if (!origin || !host) return false;
  return origin.toLowerCase() === `${secure ? "https://" : "http://"}${host.toLowerCase()}`;
}
