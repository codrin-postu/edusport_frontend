// The club-wide switches the portals follow. Pure. The backend sends them in both `/me` answers; a missing or non-boolean value counts as on.
export type PortalFeatures = { prezenta: boolean; abonamente: boolean; parcurs: boolean };

export const ALL_FEATURES: PortalFeatures = { prezenta: true, abonamente: true, parcurs: true };

/** The switches of a `/me` answer (anything that is not an object with boolean keys leaves that key on). */
export function portalFeatures(me: unknown): PortalFeatures {
  const raw = (me as { features?: unknown } | null | undefined)?.features;
  const f = typeof raw === "object" && raw !== null ? (raw as Record<string, unknown>) : {};
  const on = (key: keyof PortalFeatures): boolean => (typeof f[key] === "boolean" ? f[key] : true);
  return { prezenta: on("prezenta"), abonamente: on("abonamente"), parcurs: on("parcurs") };
}

// Backend routes of a switched-off feature (they answer 404); the BFF allow-lists drop the same paths.
const ID = "[A-Za-z0-9]{1,64}";
const COACH_OFF: Record<keyof PortalFeatures, RegExp[]> = {
  prezenta: [/^\/session(\/check)?$/, /^\/lessons(\/.*)?$/, /^\/history$/, new RegExp(`^/groups/${ID}/saved-days$`)],
  abonamente: [],
  parcurs: [new RegExp(`^/athletes/${ID}/(parcurs|awards)(/.*)?$`)],
};
const SPORTIV_OFF: Record<keyof PortalFeatures, RegExp[]> = {
  prezenta: [new RegExp(`^/athletes/${ID}/history$`)],
  abonamente: [new RegExp(`^/athletes/${ID}/(money|payments|subscriptions)$`)],
  parcurs: [new RegExp(`^/athletes/${ID}/(path|pin-recipients|pins)$`)],
};

function blocked(table: Record<keyof PortalFeatures, RegExp[]>, path: string, features: PortalFeatures): boolean {
  return (Object.keys(table) as (keyof PortalFeatures)[]).some((k) => !features[k] && table[k].some((re) => re.test(path)));
}

export const coachFeatureOff = (path: string, features: PortalFeatures): boolean => blocked(COACH_OFF, path, features);
export const sportivFeatureOff = (path: string, features: PortalFeatures): boolean => blocked(SPORTIV_OFF, path, features);
