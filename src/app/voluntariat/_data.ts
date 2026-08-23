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

/** Placeholder gallery — swap for real volunteer photos (or a Strapi feed). */
export const VOLUNTEER_PHOTOS: { src: string; alt: string }[] = [
  { src: "/images/edea_skate_stylized.png", alt: "Voluntari EduSport pe gheață" },
  { src: "/images/courses_generated.png", alt: "Sprijin la cursuri" },
  { src: "/images/hero-background-2.png", alt: "Eveniment EduSport" },
  { src: "/images/star_character.png", alt: "Comunitatea EduSport" },
];
