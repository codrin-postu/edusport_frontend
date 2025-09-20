import Link from "@/components/link/Link";
import { LinkVariants } from "@/utils/constants";
import React from "react";

interface DropdownItem {
  label: string;
  href: string;
}

interface HeaderDropdownProps {
  items: DropdownItem[];
}

const HeaderDropdown: React.FC<HeaderDropdownProps> = ({ items }) => (
  <ul className="absolute top-full left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-md py-2 min-w-48 z-50">
    {items.map((item) => (
      <li key={item.href}>
        <Link
          href={item.href}
          variant={LinkVariants.HEADER}
          className="block px-4 py-2 hover:bg-gray-50"
        >
          {item.label}
        </Link>
      </li>
    ))}
  </ul>
);

export default HeaderDropdown;
export type { DropdownItem };
