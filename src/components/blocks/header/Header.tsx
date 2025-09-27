import React from "react";
import HeaderTop from "./components/HeaderTop";
import HeaderBottom from "./components/HeaderBottom";

const Header: React.FC = () => {
  return (
    <header className="fixed flex flex-col w-full items-center h-36 top-0 left-0 right-0 z-[1000]">
      <HeaderTop />
      <HeaderBottom />
    </header>
  );
};

export default Header;
