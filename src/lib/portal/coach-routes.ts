// The coach routes the BFF may forward: exactly those of the backend's 02-coach.ts. Pure.
const ID = "[A-Za-z0-9]{1,64}";
const DATE = "\\d{4}-\\d{2}-\\d{2}";

const ROUTES: [string, string][] = [
  ["GET", "/me"], ["PUT", "/me"], ["POST", "/me/password"], ["GET", "/me/devices"], ["DELETE", `/me/devices/${ID}`],
  ["GET", "/today"], ["GET", "/groups"], ["GET", `/groups/${ID}`], ["GET", `/groups/${ID}/program`], ["GET", `/groups/${ID}/saved-days`],
  ["POST", `/groups/${ID}/program`], ["PUT", `/groups/${ID}/program-public`], ["POST", `/groups/${ID}/members`],
  ["GET", "/session"], ["POST", "/session/check"], ["PUT", "/session"],
  ["POST", "/lessons"], ["GET", `/lessons/${ID}`], ["PUT", `/lessons/${ID}`], ["DELETE", `/lessons/${ID}`],
  ["GET", "/athletes/search"], ["POST", "/athletes"], ["GET", `/athletes/${ID}`], ["GET", "/history"],
  ["PUT", `/program/${ID}`], ["POST", `/program/${ID}/end`], ["DELETE", `/program/${ID}`], ["PUT", `/program/${ID}/dates/${DATE}`],
];

const COMPILED = ROUTES.map(([method, pattern]) => ({ method, re: new RegExp(`^${pattern}$`) }));

/** `path` is what follows `/api/portal/coach`, without the query string. */
export function allowedCoachRoute(method: string, path: string): boolean {
  return COMPILED.some((r) => r.method === method && r.re.test(path));
}
