// Reads a request body as a stream and stops at the limit, so a chunked body (no content-length)
// is never buffered whole. Pure: no imports, loaded by Node tests.
export const MAX_BODY = 64 * 1024;

export type BodyRead = { ok: true; text: string } | { ok: false; reason: "too-large" };

export async function readLimitedText(req: { headers: { get(name: string): string | null }; body: ReadableStream<Uint8Array> | null }, max: number = MAX_BODY): Promise<BodyRead> {
  const declared = Number(req.headers.get("content-length") ?? "0");
  if (declared > max) return { ok: false, reason: "too-large" };
  if (!req.body) return { ok: true, text: "" };
  const reader = req.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > max) {
      await reader.cancel().catch(() => undefined);
      return { ok: false, reason: "too-large" };
    }
    chunks.push(value);
  }
  const all = new Uint8Array(size);
  let at = 0;
  for (const c of chunks) {
    all.set(c, at);
    at += c.byteLength;
  }
  return { ok: true, text: new TextDecoder().decode(all) };
}
