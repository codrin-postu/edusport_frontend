import { STATES } from "@/lib/portal/copy";

export type ApiResult<T> = { ok: true; data: T } | { ok: false; status: number; message: string; body: unknown };

type Method = "GET" | "POST" | "PUT" | "DELETE";

function errorMessage(body: unknown): string {
  const error = (body as { error?: { message?: unknown } } | null)?.error;
  return typeof error?.message === "string" && error.message !== "" ? error.message : STATES.loadFailed;
}

/** Calls the BFF (`/api/portal/<path>`). A 401 means the session ended: the browser goes to the login screen (`stay401` for the login forms, where a 401 is a wrong password). */
export async function portalApi<T>(method: Method, path: string, body?: unknown, opts?: { stay401?: boolean }): Promise<ApiResult<T>> {
  let res: Response;
  try {
    res = await fetch(`/api/portal/${path}`, {
      method,
      credentials: "same-origin",
      ...(body === undefined ? {} : { headers: { "content-type": "application/json" }, body: JSON.stringify(body) }),
    });
  } catch {
    return { ok: false, status: 0, message: STATES.loadFailed, body: null };
  }
  let json: unknown = null;
  try {
    json = await res.json();
  } catch {
    json = null;
  }
  if (res.status === 401 && !opts?.stay401) {
    window.location.assign("/intrare");
    return { ok: false, status: 401, message: errorMessage(json), body: json };
  }
  if (!res.ok) return { ok: false, status: res.status, message: errorMessage(json), body: json };
  if (json === null) return { ok: false, status: res.status, message: STATES.loadFailed, body: null };
  const data = (json as { data?: unknown }).data;
  return { ok: true, data: (data === undefined ? json : data) as T };
}
