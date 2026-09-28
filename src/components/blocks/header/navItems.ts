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
  { key: "acasa", label: "Acasă", href: "/" },
  {
    key: "despre-noi",
    label: "Despre noi",
    image: "/images/menu/about_image.png",
    promo: {
      title: "Despre noi",
      description: "Află povestea clubului, cunoaște echipa și descoperă realizările noastre.",
      gradient: "from-navy to-pastel",
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
        description: "Cunoaște instructorii noștri",
      },
      {
        label: "Sportivi",
        href: "/despre-noi/sportivi",
        description: "Profilurile sportivilor clubului",
      },
      {
        label: "Realizări",
        href: "/despre-noi/realizari",
        description: "Performanțele și premiile noastre",
      },
      {
        label: "Voluntariat",
        href: "/voluntariat",
        description: "Implică-te în comunitatea clubului",
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
      gradient: "from-navy to-pastel",
    },
    dropdown: [
      {
        label: "Școala de Patinaj - AFI Cotroceni",
        href: "/cursuri",
        description: "Informații generale despre Școala de Patinaj",
      },
      {
        label: "Program Cursuri",
        href: "/cursuri/program",
        description: "Orarul și programul săptămânal",
      },
      {
        label: "Evenimente și competiții",
        href: "/cursuri/evenimente",
        description:
          "Informații despre spectacole, competiții sau alte evenimente",
      },
      {
        label: "Regulament Cursuri",
        href: "/cursuri/regulament",
        description: "Regulamentul pentru cursurile școlii de patinaj",
      },
    ],
  },
  { key: "noutati", label: "Noutăți", href: "/noutati" },
  { key: "parteneri", label: "Parteneri", href: "/parteneri" },
  { key: "contact", label: "Contact", href: "/contact" },
];

// Desktop nav excludes "Acasă" (no need for a home link in the top bar)
export const desktopNavItems = navItems.filter(
  (item) => item.label !== "Acasă",
);
