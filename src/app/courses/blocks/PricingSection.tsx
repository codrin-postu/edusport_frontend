import { Button } from "@/components/ui/button";
import Link from "@/components/ui/link";
import { cn } from "@/utils/cn";
import { PricingCard } from "@/components/blocks";
import React from "react";

interface PriceItem {
  label: string;
  price: string;
}

interface PricingData {
  title: string;
  priceItems: PriceItem[];
  bottomItem?: PriceItem;
}

interface PricingSectionProps {
  pricingData: PricingData[];
}

const PricingSection: React.FC<PricingSectionProps> = ({ pricingData }) => {
  return (
    <section className={cn("py-16", "bg-gray-50")}>
      <div
        className={cn(
          "w-full",
          "max-w-content",
          "mx-auto",
          "px-4",
          "md:px-8",
          "lg:px-12",
        )}
      >
        <div className={cn("max-w-6xl", "mx-auto", "text-center")}>
          <h2
            className={cn(
              "text-3xl",
              "font-bold",
              "text-gray-800",
              "mb-8",
              "font-['League_Spartan']",
            )}
          >
            Prețuri și Abonamente
          </h2>
          <div
            className={cn(
              "grid",
              "md:grid-cols-2",
              "gap-8",
              "max-w-4xl",
              "mx-auto",
              "mb-8",
            )}
          >
            {pricingData.map((card, index) => (
              <PricingCard
                key={index}
                title={card.title}
                priceItems={card.priceItems}
                bottomItem={card.bottomItem}
              />
            ))}
          </div>
          <div className={cn("mt-8", "text-center", "space-y-4")}>
            <Button
              asChild
              className={cn(
                "bg-edusport-blue",
                "text-white",
                "px-8",
                "py-3",
                "rounded-md",
                "hover:bg-edusport-blue/90",
                "text-lg",
                "font-semibold",
              )}
            >
              <Link href="/contact">Aplică pentru Înscriere</Link>
            </Button>
            <p className={cn("text-sm", "text-gray-500")}>
              Înscrierea finală se face la patinoar
            </p>
          </div>
          <p className={cn("text-sm", "text-gray-500", "mt-6", "text-center")}>
            * Prețurile pot fi modificate cu un preaviz de 30 de zile
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
