"use client";

import React from "react";
import Icon from "@/components/ui/icon";
import type { SiteContactInfo } from "@/components/blocks/footer/Footer";
import { mapsHref } from "@/lib/mapsLink";

interface HeaderTopProps {
  contactInfo?: SiteContactInfo;
}

const HeaderTop: React.FC<HeaderTopProps> = ({ contactInfo }) => {
  const address = contactInfo?.addressDisplay;
  const phone = contactInfo?.phone;
  // The phone beside it has always been a tel: link; the address being plain
  // text was the odd one out, and people had to retype it into a map.
  const maps = mapsHref(address, contactInfo?.addressMapsUrl);

  return (
    <div className="w-full bg-black h-8 flex items-center">
      <div className="w-full max-w-content mx-auto px-3 sm:px-4 flex justify-between items-center gap-2">
        {address && (
          <div className="text-body-sm flex items-center gap-1 sm:gap-2 text-primary-on-dark min-w-0 flex-1">
            <Icon name="map-pin" />
            {maps ? (
              <a
                href={maps}
                target="_blank"
                rel="noopener noreferrer"
                className="truncate hover:text-secondary-on-dark transition-colors"
                data-umami-event="address-maps"
                data-umami-event-source="header"
              >
                {address}
              </a>
            ) : (
              <span className="truncate">{address}</span>
            )}
          </div>
        )}

        {phone && (
          <div className="text-body-sm flex items-center gap-1 sm:gap-2 text-primary-on-dark shrink-0">
            <Icon name="phone" />
            <a
              href={`tel:${phone.replace(/\s/g, "")}`}
              className="hover:text-secondary-on-dark transition-colors whitespace-nowrap"
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
