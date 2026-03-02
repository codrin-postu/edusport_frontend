import { cn } from "@/utils/cn";
import React from "react";

interface PriceItem {
  label: string;
  price: string;
}

interface PricingCardProps {
  title: string;
  priceItems: PriceItem[];
  bottomItem?: {
    label: string;
    price: string;
  };
}

const PricingCard: React.FC<PricingCardProps> = ({
  title,
  priceItems,
  bottomItem,
}) => {
  return (
    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col gap-6">
      <h3 className="text-sm font-medium tracking-widest uppercase text-edusport-blue">
        {title}
      </h3>
      <div className="flex flex-col gap-4">
        {priceItems.map((item, index) => (
          <div key={index} className="flex justify-between items-baseline gap-4">
            <span className="text-gray-500 font-light text-sm">{item.label}</span>
            <span className="text-edusport-navy font-semibold text-lg whitespace-nowrap">
              {item.price}
            </span>
          </div>
        ))}
      </div>
      {bottomItem && (
        <div className="flex justify-between items-baseline gap-4 pt-4 border-t border-gray-100">
          <span className="text-gray-400 font-light text-xs">{bottomItem.label}</span>
          <span className="text-gray-500 font-medium text-sm whitespace-nowrap">
            {bottomItem.price}
          </span>
        </div>
      )}
    </div>
  );
};

export default PricingCard;
