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
      <div className="w-full max-w-content mx-auto px-3 sm:px-4 flex justify-between items-center gap-2">
        {address && (
          <div className="flex items-center gap-1 sm:gap-2 text-white text-[11px] sm:text-sm min-w-0 flex-1">
            <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="truncate">{address}</span>
          </div>
        )}

        {phone && (
          <div className="flex items-center gap-1 sm:gap-2 text-white text-[11px] sm:text-sm shrink-0">
            <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <a
              href={`tel:${phone.replace(/\s/g, "")}`}
              className="hover:text-gray-300 transition-colors whitespace-nowrap"
            >
              {phone}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeaderTop;
