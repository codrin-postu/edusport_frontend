// ---------------------------------------------------------------------------
// Events data — replace with Strapi API calls when ready
// ---------------------------------------------------------------------------

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

// Set to null to show the "no current event" state
export const CURRENT_EVENT: Event | null = {
  slug: "spectacol-de-craciun-2025",
  title: "Spectacol de Crăciun 2025",
  date: "2025-12-21T11:00:00",
  location: "Patinoarul Cotroceni On Ice, AFI Palace Cotroceni",
  coverImage: "/images/courses.png",
  excerpt:
    "Vă invităm la spectacolul anual de Crăciun al Școlii de Patinaj EduSport! Cursanții din toate grupele vor urca pe gheață pentru o demonstrație specială de patinaj artistic, plină de magie și bucurie.",
  body: `Vă invităm cu drag la cel mai așteptat eveniment al sezonului — Spectacolul de Crăciun 2025 al Școlii de Patinaj EduSport!

Cursanții din toate grupele — de la Primii Pași până la Avansați — vor urca pe gheață pentru a demonstra tot ce au învățat în acest sezon, într-o atmosferă plină de magie și spiritul sărbătorilor de iarnă.

Intrarea este gratuită pentru toți membrii familiei cursanților. Locurile în tribune sunt limitate, vă rugăm să confirmați prezența prin mesaj pe canalul de WhatsApp.

Ne vedem pe gheață!`,
  tags: ["Spectacol", "Crăciun", "Patinaj Artistic"],
};

export const PAST_EVENTS: Event[] = [
  {
    slug: "cupa-edusport-primavara-2025",
    title: "Cupa EduSport – Primăvară 2025",
    date: "2025-05-10T10:00:00",
    location: "Patinoarul Cotroceni On Ice",
    coverImage: "/images/courses.png",
    excerpt:
      "Prima competiție internă a sezonului, în care cursanții din grupele Intermediari și Avansați s-au întrecut pe elemente tehnice impuse și un scurt program liber.",
    body: "",
    tags: ["Competiție", "Intermediari", "Avansați"],
  },
  {
    slug: "spectacol-de-craciun-2024",
    title: "Spectacol de Crăciun 2024",
    date: "2024-12-22T11:00:00",
    location: "Patinoarul Cotroceni On Ice",
    coverImage: "/images/courses.png",
    excerpt:
      "Ediția 2024 a spectacolului anual de Crăciun — o seară plină de emoție și momente frumoase pe gheață, cu toți cursanții școlii.",
    body: "",
    tags: ["Spectacol", "Crăciun"],
  },
  {
    slug: "cupa-edusport-toamna-2024",
    title: "Cupa EduSport – Toamnă 2024",
    date: "2024-11-16T10:00:00",
    location: "Patinoarul Cotroceni On Ice",
    excerpt:
      "A doua ediție a cupei interne, cu participare record — peste 40 de cursanți din toate grupele s-au înscris în competiție.",
    body: "",
    tags: ["Competiție"],
  },
  {
    slug: "tabara-de-patinaj-vara-2024",
    title: "Tabără de Patinaj – Vara 2024",
    date: "2024-07-08T09:00:00",
    location: "Patinoarul Cotroceni On Ice",
    coverImage: "/images/courses.png",
    excerpt:
      "O săptămână intensivă de cursuri de vară pentru cursanții care au dorit să-și perfecționeze tehnica în afara sezonului obișnuit.",
    body: "",
    tags: ["Tabără", "Vară"],
  },
  {
    slug: "spectacol-de-craciun-2023",
    title: "Spectacol de Crăciun 2023",
    date: "2023-12-17T11:00:00",
    location: "Patinoarul Cotroceni On Ice",
    excerpt:
      "Prima ediție a spectacolului de Crăciun al Școlii de Patinaj EduSport, un debut de succes pentru tradiția care continuă an de an.",
    body: "",
    tags: ["Spectacol", "Crăciun"],
  },
];
