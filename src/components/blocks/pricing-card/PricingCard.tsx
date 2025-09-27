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
    <div className={cn("bg-white", "p-6", "rounded-lg", "shadow-md")}>
      <h3
        className={cn(
          "text-xl",
          "font-semibold",
          "mb-4",
          "text-edusport-blue",
          "font-['Roboto']",
        )}
      >
        {title}
      </h3>
      <div className={cn("space-y-3", "mb-6")}>
        {priceItems.map((item, index) => (
          <div
            key={index}
            className={cn("flex", "justify-between", "items-center")}
          >
            <span className={cn("text-gray-600", "font-['Roboto']")}>
              {item.label}
            </span>
            <span
              className={cn("text-lg", "font-bold", "text-edusport-blue", "font-['Roboto']")}
            >
              {item.price}
            </span>
          </div>
        ))}
        {bottomItem && (
          <div
            className={cn(
              "flex",
              "justify-between",
              "items-center",
              "pt-2",
              "border-t",
            )}
          >
            <span className={cn("text-sm", "text-gray-500", "font-['Roboto']")}>
              {bottomItem.label}
            </span>
            <span
              className={cn(
                "text-sm",
                "font-semibold",
                "text-edusport-blue",
                "font-['Roboto']",
              )}
            >
              {bottomItem.price}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PricingCard;