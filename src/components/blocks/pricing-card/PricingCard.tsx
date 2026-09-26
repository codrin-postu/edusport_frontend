import { cn } from "@/utils/cn";
import React from "react";
import type { PriceItem } from "@/app/cursuri/_types_pricing";

interface PricingCardProps {
  title: string;
  priceItems: PriceItem[];
  bottomItem?: PriceItem;
}

const PricingCard: React.FC<PricingCardProps> = ({
  title,
  priceItems,
  bottomItem,
}) => {
  return (
    <div className="bg-surface-raised p-8 border border-line-subtle shadow-sm flex flex-col gap-6">
      <h3 className="text-label uppercase text-edusport-blue">
        {title}
      </h3>
      <div className="flex flex-col gap-4">
        {priceItems.map((item, index) => (
          <div key={index} className="flex justify-between items-baseline gap-4">
            <span className="text-body-sm text-secondary">{item.label}</span>
            <span className="text-body text-edusport-navy whitespace-nowrap">
              {item.price}
            </span>
          </div>
        ))}
      </div>
      {bottomItem && (
        <div className="flex justify-between items-baseline gap-4 pt-4 border-t border-line-subtle">
          <span className="text-caption text-muted">{bottomItem.label}</span>
          <span className="text-body-sm text-secondary whitespace-nowrap">
            {bottomItem.price}
          </span>
        </div>
      )}
    </div>
  );
};

export default PricingCard;
