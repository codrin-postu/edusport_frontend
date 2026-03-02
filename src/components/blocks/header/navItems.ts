export interface DropdownItem {
  label: string;
  href: string;
  description?: string;
}

export interface NavItem {
  label: string;
  href?: string;
  image?: string;
  dropdown?: DropdownItem[];
}

export const navItems: NavItem[] = [
  { label: "Acasa", href: "/" },
  {
    label: "Despre Noi",
    image: "/images/menu/about_image.png",
    dropdown: [
      {
        label: "Echipa",
        href: "/despre-noi/echipa",
        description: "Cunoaste instructorii nostri",
      },
      {
        label: "Istoric",
        href: "/despre-noi/istoric",
        description: "Povestea clubului nostru",
      },
      {
        label: "Realizari",
        href: "/despre-noi/realizari",
        description: "Performantele si premiile noastre",
      },
    ],
  },
  {
    label: "Cursuri",
    image: "/images/courses_generated.png",
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
  { label: "Noutati", href: "/noutati" },
  { label: "Contact", href: "/contact" },
];

// Desktop nav excludes "Acasa" (no need for a home link in the top bar)
export const desktopNavItems = navItems.filter(
  (item) => item.label !== "Acasa",
);
