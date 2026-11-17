// Static content for /voluntariat. Placeholder copy + photos until an editor
// wires real content (photos would later come from Strapi like other media).

export interface HelpWay {
  title: string;
  desc: string;
}

/** The ways a volunteer can help — rendered in the "Cum poți ajuta" split panel. */
export const HELP_WAYS: HelpWay[] = [
  {
    title: "La competiții",
    desc: "Culise și sprijin pentru sportivi în ziua concursului.",
  },
  {
    title: "Organizare & logistică",
    desc: "Pregătire materiale, transport și coordonare pe teren.",
  },
  {
    title: "Cu cei mici",
    desc: "Mentorat pentru începători la primii pași pe gheață.",
  },
  {
    title: "Foto & promovare",
    desc: "Fotografie, social media și povești din culise.",
  },
];

/** Hero + intro copy fallback (used when the CMS volunteer-page is empty). */
export const VOLUNTEER_COPY = {
  heroTitle: "Voluntariat",
  heroSubtitle:
    "Clubul crește cu oameni care dăruiesc timp. Dă o mână de ajutor și fii parte din comunitatea EduSport.",
  introEyebrow: "De ce voluntariat",
  introHeading: "Timpul tău face diferența",
  introBody:
    "Experiență reală lângă antrenori și sportivi, prieteni noi și un sport pe care îl duci mai departe în comunitate. Fără experiență prealabilă, te învățăm tot ce trebuie.",
};

/** Placeholder gallery — swap for real volunteer photos (or a Strapi feed). */
export const VOLUNTEER_PHOTOS: { src: string; alt: string }[] = [
  { src: "/images/edea_skate_stylized.png", alt: "Voluntari EduSport pe gheață" },
  { src: "/images/courses_generated.png", alt: "Sprijin la cursuri" },
  { src: "/images/hero-background-2.png", alt: "Eveniment EduSport" },
  { src: "/images/star_character.png", alt: "Comunitatea EduSport" },
];
