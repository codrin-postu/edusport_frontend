export type {
  HomepageHero,
  HomepageRegistration,
  HomepageRegistrationClosed,
  HomepageAboutPanel,
  HomepageAbout,
  HomepageSections,
  HomepageStatItem,
  HomepageCms,
} from "../homepage/_types";

/** The homepage event card. Events are articles in the evenimente or competitii category. */
export interface Event {
  slug: string;
  title: string;
  date: string; // ISO string
  location?: string;
  coverImage?: string;
  excerpt: string;
  body: string;
  tags?: string[];
  admissionInfo?: string;
}
