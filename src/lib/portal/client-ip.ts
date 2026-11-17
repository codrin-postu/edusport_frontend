// Server only (node:net): the client address as sent by nginx, only when it is a real IP.
import { isIP } from "node:net";

export function cleanIp(raw: string | null): string | null {
  const ip = raw?.trim() ?? "";
  return isIP(ip) !== 0 ? ip : null;
}
