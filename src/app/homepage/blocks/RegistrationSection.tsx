import Link from "@/components/ui/link";
import { Button } from "@/components/ui/button";
import React from "react";

const RegistrationSection: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-6 font-['League_Spartan']">
            Înscrieri Deschise
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Începe călătoria ta în lumea patinajului artistic! Înscrierile
            pentru noul sezon sunt deschise.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-edusport-blue">
                Începători
              </h3>
              <p className="text-gray-600 mb-4">
                Perfect pentru cei care fac primii pași pe gheață
              </p>
              <p className="text-2xl font-bold text-edusport-blue mb-4">
                150 RON/lună
              </p>
              <Button
                asChild
                className="bg-edusport-blue text-white px-6 py-2 rounded-md hover:bg-edusport-blue/90"
              >
                <Link href="/contact">
                  Înscrie-te
                </Link>
              </Button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-edusport-blue">
                Intermediari
              </h3>
              <p className="text-gray-600 mb-4">
                Pentru sportivii cu experiență de bază
              </p>
              <p className="text-2xl font-bold text-edusport-blue mb-4">
                200 RON/lună
              </p>
              <Button
                asChild
                className="bg-edusport-blue text-white px-6 py-2 rounded-md hover:bg-edusport-blue/90"
              >
                <Link href="/contact">
                  Înscrie-te
                </Link>
              </Button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-edusport-blue">
                Avansați
              </h3>
              <p className="text-gray-600 mb-4">
                Antrenament de performanță pentru competitori
              </p>
              <p className="text-2xl font-bold text-edusport-blue mb-4">
                300 RON/lună
              </p>
              <Button
                asChild
                className="bg-edusport-blue text-white px-6 py-2 rounded-md hover:bg-edusport-blue/90"
              >
                <Link href="/contact">
                  Înscrie-te
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegistrationSection;