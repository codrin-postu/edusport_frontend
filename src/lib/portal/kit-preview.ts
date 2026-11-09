// The kit preview page exists only where this flag is set (the e2e build and a local dev server). Deploys never set it.
export function kitPreviewEnabled(env: Record<string, string | undefined>): boolean {
  return env.PORTAL_KIT_PREVIEW === "1";
}
