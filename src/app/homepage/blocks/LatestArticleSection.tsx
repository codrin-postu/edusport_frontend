import Link from "@/components/ui/link";
import { Button } from "@/components/ui/button";
import React from "react";

const LatestArticleSection: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-800 mb-12 text-center font-['League_Spartan']">
            Ultimul Articol
          </h2>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/3">
                <div className="bg-gray-200 h-64 md:h-full flex items-center justify-center">
                  <p className="text-gray-500">Imagine Articol</p>
                </div>
              </div>
              <div className="md:w-2/3 p-8">
                <div className="text-sm text-edusport-blue mb-2">
                  15 Martie 2024
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  Campionatul Național de Patinaj Artistic 2024
                </h3>
                <p className="text-gray-600 mb-6">
                  Sportivii noștri au obținut rezultate excepționale la
                  Campionatul Național de Patinaj Artistic. Echipa EduSport a
                  demonstrat încă o dată calitatea antrenamentelor și
                  dedicarea...
                </p>
                <Button
                  asChild
                  className="bg-edusport-blue text-white px-6 py-2 rounded-md hover:bg-edusport-blue/90"
                >
                  <Link href="/news">
                    Citește Articolul
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LatestArticleSection;