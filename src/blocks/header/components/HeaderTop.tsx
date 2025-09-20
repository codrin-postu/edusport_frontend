import React from "react";

const HeaderTop: React.FC = () => {
  return (
    <div className="bg-white h-full w-full px-8 flex justify-center items-center">
      <h1 className="text-2xl font-bold">Scoala de Patinaj Edusport</h1>
      <div className="flex items-center space-x-6">
        {/* Additional content like contact info, social links, etc. can go here */}
      </div>
    </div>
  );
};

export default HeaderTop;
