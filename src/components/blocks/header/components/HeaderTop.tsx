"use client";

import { MapPin, Phone } from "lucide-react";
import React from "react";

const HeaderTop: React.FC = () => {
  return (
    <div className="w-full bg-black h-8 flex items-center">
      <div className="w-full max-w-content mx-auto px-4 flex justify-between items-center">
        {/* Left side - Location */}
        <div className="flex items-center gap-2 text-white text-sm">
          <MapPin className="w-4 h-4" />
          <span>București, România</span>
        </div>

        {/* Right side - Phone */}
        <div className="flex items-center gap-2 text-white text-sm">
          <Phone className="w-4 h-4" />
          <a href="tel:+40123456789" className="hover:text-gray-300 transition-colors">
            +40 123 456 789
          </a>
        </div>
      </div>
    </div>
  );
};

export default HeaderTop;
