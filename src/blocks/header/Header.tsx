import Link from "@/components/Link/Link";
import { LinkVariants } from "@/utils/constants";
import React from "react";

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-[1000] h-[67px] px-8 py-[10px] bg-white flex items-center space-x-8">
      <h1 className="text-xl font-bold">LOGO TBD</h1>
      <nav>
        <ul className="flex space-x-6">
          <li>
            <Link variant={LinkVariants.HEADER}>Acasa</Link>
          </li>
          <li>
            <Link variant={LinkVariants.HEADER}>Despre Noi</Link>
          </li>
          <li>
            <Link variant={LinkVariants.HEADER}>Cursuri</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
