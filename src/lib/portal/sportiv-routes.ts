// The sportiv routes the BFF may forward: exactly those of the backend's 04-sportiv.ts. Pure.
const ID = "[A-Za-z0-9]{1,64}";
const RESULT = "[A-Za-z0-9_-]{1,64}";
const A = `/athletes/${ID}`;

const ROUTES: [string, string][] = [
  ["GET", "/me"], ["PUT", "/me"], ["PUT", "/me/notifications"], ["POST", "/me/password"], ["GET", "/me/devices"], ["DELETE", `/me/devices/${ID}`],
  ["GET", "/athletes"],
  ["GET", `${A}/home`], ["POST", `${A}/promotion/seen`], ["GET", `${A}/profile`], ["GET", `${A}/history`],
  ["GET", `${A}/calendar.ics`], ["GET", `${A}/calendar`],
  ["GET", `${A}/competitions`], ["GET", `${A}/competitions/${RESULT}`],
  ["GET", `${A}/path`], ["GET", `${A}/money`], ["GET", `${A}/payments`], ["GET", `${A}/subscriptions`],
  ["GET", `${A}/documents/acord`],
];

const COMPILED = ROUTES.map(([method, pattern]) => ({ method, re: new RegExp(`^${pattern}$`) }));

/** `path` is what follows `/api/portal/sportiv`, without the query string. */
export function allowedSportivRoute(method: string, path: string): boolean {
  return COMPILED.some((r) => r.method === method && r.re.test(path));
}

/** The two routes that answer a file (the calendar and the signed agreement), not JSON. */
export function isSportivFile(path: string): boolean {
  return new RegExp(`^${A}/(calendar\\.ics|documents/acord)$`).test(path);
}

// The query names the backend's sportiv controller reads (history, calendar, competitions, payments). Nothing else is forwarded.
const QUERY: [RegExp, string[]][] = [
  [new RegExp(`^${A}/(history|payments)$`), ["page"]],
  [new RegExp(`^${A}/calendar$`), ["month"]],
  [new RegExp(`^${A}/competitions$`), ["q", "season", "sort", "page"]],
];

/** The query string to forward for `path` ("" or "?a=b"): only allowed names, first value of each. */
export function sportivQuery(path: string, incoming: URLSearchParams | string): string {
  const q = typeof incoming === "string" ? new URLSearchParams(incoming) : incoming;
  const names = QUERY.find(([re]) => re.test(path))?.[1] ?? [];
  const out = new URLSearchParams();
  for (const name of names) {
    const value = q.get(name);
    if (value !== null) out.set(name, value);
  }
  const text = out.toString();
  return text ? `?${text}` : "";
}
