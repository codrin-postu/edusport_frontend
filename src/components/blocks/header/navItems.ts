export interface DropdownItem {
  label: string;
  href: string;
  description?: string;
}

export interface PromoCard {
  title: string;
  description: string;
  gradient: string;
}

export interface NavItem {
  /**
   * Stable identifier, slug of the label. The menu STRUCTURE lives here in
   * code; the CMS can only override the promo card's description and image,
   * and it matches its entries to these keys. Renaming a key detaches its
   * override, which then falls back to the values below.
   */
  key: string;
  label: string;
  href?: string;
  image?: string;
  promo?: PromoCard;
  dropdown?: DropdownItem[];
}

export const navItems: NavItem[] = [
  { key: "acasa", label: "Acasa", href: "/" },
  {
    key: "despre-noi",
    label: "Despre Noi",
    image: "/images/menu/about_image.png",
    promo: {
      title: "Despre Noi",
      description: "Află povestea clubului, cunoaște echipa și descoperă realizările noastre.",
      gradient: "from-edusport-blue to-blue-500",
    },
    dropdown: [
      {
        label: "Istoric",
        href: "/despre-noi",
        description: "Povestea clubului nostru",
      },
      {
        label: "Echipa",
        href: "/despre-noi/echipa",
        description: "Cunoaste instructorii nostri",
      },
      {
        label: "Sportivi",
        href: "/despre-noi/sportivi",
        description: "Profilurile sportivilor clubului",
      },
      {
        label: "Realizari",
        href: "/despre-noi/realizari",
        description: "Performantele si premiile noastre",
      },
      {
        label: "Voluntariat",
        href: "/voluntariat",
        description: "Implica-te in comunitatea clubului",
      },
    ],
  },
  {
    key: "cursuri",
    label: "Cursuri",
    image: "/images/courses_generated.png",
    promo: {
      title: "Cursuri Patinaj",
      description: "Tot ce trebuie să știi despre cursurile Școlii de Patinaj EduSport.",
      gradient: "from-edusport-blue to-blue-500",
    },
    dropdown: [
      {
        label: "Scoala de Patinaj - AFI Cotroceni",
        href: "/cursuri",
        description: "Informatii generale despre Scoala de Patinaj",
      },
      {
        label: "Program Cursuri",
        href: "/cursuri/program",
        description: "Orarul si programul saptamanal",
      },
      {
        label: "Evenimente si Competitii",
        href: "/cursuri/evenimente",
        description:
          "Informatii despre spectacole, competitii sau alte evenimente",
      },
      {
        label: "Regulament Cursuri",
        href: "/cursuri/regulament",
        description: "Regulamentul pentru cursurile scolii de patinaj",
      },
    ],
  },
  { key: "noutati", label: "Noutati", href: "/noutati" },
  { key: "parteneri", label: "Parteneri", href: "/parteneri" },
  { key: "contact", label: "Contact", href: "/contact" },
];

// Desktop nav excludes "Acasa" (no need for a home link in the top bar)
export const desktopNavItems = navItems.filter(
  (item) => item.label !== "Acasa",
);
