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
  athletes?: {
    heading?: string | null;
    intro?: string | null;
    countLabel?: string | null;
    ctaLabel?: string | null;
    ctaUrl?: string | null;
  } | null;
  stats?: HomepageStatItem[] | null;
}

export interface HomepageCms {
  hero?: HomepageHero | null;
  registration?: HomepageRegistration | null;
  registrationClosed?: HomepageRegistrationClosed | null;
  about?: HomepageAbout | null;
  sections?: HomepageSections | null;
}
