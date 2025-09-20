"use client";

import Link from "@/components/link/Link";
import { LinkVariants } from "@/utils/constants";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";
import { HeaderDropdown, type DropdownItem } from "./";


interface NavigationItem {
  label: string;
  href?: string;
  dropdown?: DropdownItem[];
}

const navigationItems: NavigationItem[] = [
  { label: "Acasa", href: "/" },
  {
    label: "Despre Noi",
    dropdown: [
      { label: "Echipa", href: "/despre-noi/echipa" },
      { label: "Istoric", href: "/despre-noi/istoric" },
      { label: "Misiune", href: "/despre-noi/misiune" },
    ],
  },
  { label: "Cursuri", href: "/cursuri" },
  {
    label: "Program",
    dropdown: [
      { label: "Program Saptamanal", href: "/program/saptamanal" },
      { label: "Orar Cursuri", href: "/program/orar" },
      { label: "Evenimente Speciale", href: "/program/evenimente" },
    ],
  },
  { label: "Noutati", href: "/noutati" },
  { label: "Contact", href: "/contact" },
];

const HeaderBottom: React.FC = () => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const handleMouseEnter = (label: string) => {
    setOpenDropdown(label);
  };

  const handleMouseLeave = () => {
    setOpenDropdown(null);
  };

  return (
    <div className="flex justify-center w-full bg-edusport-blue h-13 px-8">
      <nav className="h-full">
        <ul className="flex items-center h-full gap-x-12">
          {navigationItems.map((item) => (
            <li
              key={item.label}
              className="relative"
              onMouseEnter={() => item.dropdown && handleMouseEnter(item.label)}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                href={item.href || "#"}
                variant={LinkVariants.HEADER}
                className="text-white hover:text-gray-200 flex items-center h-12"
              >
                {item.label}
                {item.dropdown && <ChevronDownIcon className="ml-1 h-5 w-5" />}
              </Link>
              {item.dropdown && openDropdown === item.label && (
                <HeaderDropdown items={item.dropdown} />
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default HeaderBottom;
