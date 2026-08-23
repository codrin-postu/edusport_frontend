// Static content for /parteneri. Placeholder sponsors + collaboration events
// until an editor wires real logos/content (would come from Strapi like other
// media). Sponsor `logo` is optional — the tile falls back to the name.

export interface Sponsor {
  name: string;
  /** Public path or Strapi URL of the logo image. Falls back to `name`. */
  logo?: string;
  /** Optional external link. */
  href?: string;
}

export interface CollabEvent {
  title: string;
  partner: string;
  date: string;
  description: string;
  /** Optional image (public path or Strapi URL). */
  image?: string;
}

/** Sponsor logos shown in the auto-scrolling strip. Placeholder names. */
export const SPONSORS: Sponsor[] = [
  { name: "EDEA" },
  { name: "Risport" },
  { name: "Jackson" },
  { name: "AFI Cotroceni" },
  { name: "Federația Română de Patinaj" },
  { name: "John Wilson" },
  { name: "Edea Skates" },
  { name: "Ice Space" },
];

/** Past events / collaborations done together with partners. Placeholder. */
export const COLLAB_EVENTS: CollabEvent[] = [
  {
    title: "Cupa de Iarnă",
    partner: "AFI Cotroceni",
    date: "Decembrie 2024",
    description:
      "Competiție demonstrativă organizată împreună, cu peste 80 de participanți.",
    image: "/images/hero-background-2.png",
  },
  {
    title: "Ziua Porților Deschise",
    partner: "Partener local",
    date: "Mai 2024",
    description:
      "Sesiuni gratuite de patinaj pentru familii, susținute de partenerul nostru.",
    image: "/images/courses_generated.png",
  },
];
