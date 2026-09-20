export interface HomepageHero {
  ctaLabel?: string | null;
  ctaUrl?: string | null;
}

export interface HomepageRegistration {
  heading?: string | null;
  body?: string | null;
  bodySecondary?: string | null;
  scheduleDays?: string | null;
  scheduleTimes?: string | null;
  locationName?: string | null;
  ctaPrimaryLabel?: string | null;
  ctaPrimaryUrl?: string | null;
  ctaSecondaryLabel?: string | null;
  ctaSecondaryUrl?: string | null;
  pricesLinkLabel?: string | null;
  pricesLinkUrl?: string | null;
}

export interface HomepageRegistrationClosed {
  heading?: string | null;
  body?: string | null;
  whatsappLabel?: string | null;
  whatsappUrl?: string | null;
  contactLabel?: string | null;
  contactUrl?: string | null;
}

export interface HomepageAboutPanel {
  eyebrow?: string | null;
  heading?: string | null;
  body?: string | null;
  ctaLabel?: string | null;
  ctaUrl?: string | null;
}

export interface HomepageAbout {
  panels?: HomepageAboutPanel[] | null;
}

export interface HomepageStatItem {
  value?: string | null;
  label?: string | null;
}

/** Copy that used to be hardcoded in the landing components. */
export interface HomepageSections {
  /** Copy for the competition strip. */
  gallery?: {
    heading?: string | null;
  } | null;
  athletes?: {
    heading?: string | null;
    intro?: string | null;
    countLabel?: string | null;
    ctaLabel?: string | null;
    ctaUrl?: string | null;
  } | null;
  /**
   * Inline list kept only as a fallback. The values now live in the shared
   * "Cifre club" single type; `statIds` points at them.
   */
  stats?: HomepageStatItem[] | null;
  /** Ids into Cifre club, in display order. */
  statIds?: string[] | null;
}

/** One row of the shared "Cifre club" single type (api::club-figures). */
export interface ClubFigure {
  id?: string | null;
  value?: string | null;
  label?: string | null;
}

export interface ClubFiguresCms {
  figures?: ClubFigure[] | null;
}

/**
 * Resolves the ids a page selected against the shared list. Returns null when
 * nothing resolves, so the caller can fall back to its own older field instead
 * of rendering an empty strip.
 */
export function resolveClubFigures(
  ids: string[] | null | undefined,
  figures: ClubFigure[] | null | undefined,
): HomepageStatItem[] | null {
  if (!Array.isArray(ids) || ids.length === 0) return null;
  if (!Array.isArray(figures) || figures.length === 0) return null;
  const byId = new Map(figures.filter((f) => f?.id).map((f) => [String(f.id), f]));
  const rows = ids
    .map((id) => byId.get(String(id)))
    .filter((f): f is ClubFigure => Boolean(f))
    .map((f) => ({ value: f.value ?? "", label: f.label ?? "" }));
  return rows.length > 0 ? rows : null;
}

export interface HomepageCms {
  /**
   * The three images of the competition strip, chosen in the admin. The strip
   * renders these and nothing else: when it is empty the section is not shown
   * at all, rather than falling back to athlete portraits as it once did.
   */
  competitionGallery?: { url: string; alternativeText?: string | null }[] | null;
  hero?: HomepageHero | null;
  registration?: HomepageRegistration | null;
  registrationClosed?: HomepageRegistrationClosed | null;
  about?: HomepageAbout | null;
  sections?: HomepageSections | null;
}
