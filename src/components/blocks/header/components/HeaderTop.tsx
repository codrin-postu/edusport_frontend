"use client";

import { MapPin, Phone } from "lucide-react";
import React from "react";
import type { SiteContactInfo } from "@/components/blocks/footer/Footer";

interface HeaderTopProps {
  contactInfo?: SiteContactInfo;
}

const HeaderTop: React.FC<HeaderTopProps> = ({ contactInfo }) => {
  const address = contactInfo?.addressDisplay;
  const phone = contactInfo?.phone;

  return (
    <div className="w-full bg-black h-8 flex items-center">
      <div className="w-full max-w-content mx-auto px-4 flex justify-between items-center">
        {address && (
          <div className="flex items-center gap-2 text-white text-sm">
            <MapPin className="w-4 h-4" />
            <span>{address}</span>
          </div>
        )}

        {phone && (
          <div className="flex items-center gap-2 text-white text-sm ml-auto">
            <Phone className="w-4 h-4" />
            <a href={`tel:${phone.replace(/\s/g, "")}`} className="hover:text-gray-300 transition-colors">
              {phone}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeaderTop;
