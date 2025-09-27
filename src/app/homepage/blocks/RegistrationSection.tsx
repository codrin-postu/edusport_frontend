import Link from "@/components/ui/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import { PricingCard } from "@/components/blocks";
import React from "react";

const RegistrationSection: React.FC = () => {
  const pricingData = [
    {
      title: "Pentru Membri",
      priceItems: [
        { label: "Abonament 6 ședințe grup", price: "520 RON" },
        { label: "Abonament 8 ședințe grup", price: "590 RON" },
      ],
      bottomItem: {
        label: "Taxa de membru (o dată/sezon)",
        price: "250 RON",
      },
    },
    {
      title: "Pentru Non-membri",
      priceItems: [
        { label: "1 ședință grup", price: "150 RON" },
        { label: "Abonament 6 ședințe grup", price: "720 RON" },
        { label: "Abonament 8 ședințe grup", price: "790 RON" },
      ],
    },
  ];

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
              "text-4xl",
              "font-bold",
              "text-gray-800",
              "mb-6",
              "font-['League_Spartan']",
            )}
          >
            Înscrieri Deschise
          </h2>
          <p className={cn("text-lg", "text-gray-600", "mb-8")}>
            Alege pachetul potrivit pentru tine și începe să explorezi lumea
            patinajului artistic!
          </p>
          <div
            className={cn(
              "grid",
              "md:grid-cols-2",
              "gap-8",
              "max-w-4xl",
              "mx-auto",
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
            <div
              className={cn(
                "flex",
                "flex-col",
                "sm:flex-row",
                "gap-4",
                "justify-center",
                "items-center",
              )}
            >
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
              <Button
                asChild
                variant="outline"
                className={cn(
                  "border-edusport-blue",
                  "text-edusport-blue",
                  "px-6",
                  "py-3",
                  "rounded-md",
                  "hover:bg-edusport-blue/10",
                  "text-base",
                  "font-semibold",
                )}
              >
                <Link href="/courses">Vezi Programul</Link>
              </Button>
            </div>
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

export default RegistrationSection;
