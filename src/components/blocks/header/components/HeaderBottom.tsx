"use client";

import Link from "@/components/link/Link";
import { LinkVariants } from "@/utils/constants";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import React from "react";

interface DropdownItem {
  label: string;
  href: string;
}

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
      { label: "Program Cursuri", href: "/program" },
      { label: "Evenimente Speciale", href: "/evenimente" },
    ],
  },
  { label: "Noutati", href: "/noutati" },
  { label: "Contact", href: "/contact" },
];

const HeaderBottom: React.FC = () => {
  return (
    <div className="flex justify-center w-full bg-edusport-blue h-12">
      <NavigationMenu viewport={false} className="h-full">
        <NavigationMenuList className="lg:gap-x-12 md:gap-x-8 gap-x-4 h-12">
          {navigationItems.map((item) => (
            <NavigationMenuItem key={item.label}>
              {item.dropdown ? (
                <>
                  <NavigationMenuTrigger className="text-white hover:text-gray-200">
                    {item.label}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="absolute top-full left-1/2 transform -translate-x-1/2 mt-10">
                    <div className="grid w-40">
                      {item.dropdown.map((dropdownItem) => (
                        <NavigationMenuLink key={dropdownItem.href} asChild>
                          <Link
                            href={dropdownItem.href}
                            variant={LinkVariants.HEADER}
                            className="block hover:bg-gray-100 hover:text-primary rounded-md"
                          >
                            {dropdownItem.label}
                          </Link>
                        </NavigationMenuLink>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </>
              ) : (
                <NavigationMenuLink asChild className="hover:bg-edusport-blue">
                  <Link
                    href={item.href || "#"}
                    variant={LinkVariants.HEADER}
                    className="text-white hover:text-gray-200 flex items-center"
                  >
                    {item.label}
                  </Link>
                </NavigationMenuLink>
              )}
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};

export default HeaderBottom;
