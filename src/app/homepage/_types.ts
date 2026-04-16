export interface HomepageHero {
  motto?: string | null;
  ctaLabel?: string | null;
  ctaUrl?: string | null;
}

export interface HomepageRegistration {
  seasonLabel?: string | null;
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
  seasonLabel?: string | null;
  heading?: string | null;
  body?: string | null;
  whatsappLabel?: string | null;
  whatsappUrl?: string | null;
  contactLabel?: string | null;
  contactUrl?: string | null;
}

export interface HomepageAbout {
  eyebrow?: string | null;
  heading?: string | null;
  body?: string | null;
  ctaLabel?: string | null;
  ctaUrl?: string | null;
}

export interface HomepageCms {
  hero?: HomepageHero | null;
  registration?: HomepageRegistration | null;
  registrationClosed?: HomepageRegistrationClosed | null;
  about?: HomepageAbout | null;
}
