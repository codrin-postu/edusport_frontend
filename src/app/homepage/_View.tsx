import Link from "@/components/Link/Link";
import { LinkVariants } from "@/utils/constants";
import React from "react";

const HomePage: React.FC = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-edusport-blue to-blue-800">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 font-['League_Spartan']">
            EduSport
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            Școala de patinaj artistic care transformă pasiunea în performanță.
            Alătură-te comunității noastre și descoperă magia patinajului!
          </p>
          <Link
            href="/cursuri"
            variant={LinkVariants.BUTTON}
            className="bg-white text-edusport-blue px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Descoperă Cursurile
          </Link>
        </div>
      </section>

      {/* Înscrieri Deschise Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-6 font-['League_Spartan']">
              Înscrieri Deschise
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Începe călătoria ta în lumea patinajului artistic! Înscrierile pentru noul sezon sunt deschise.
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
                <Link
                  href="/contact"
                  variant={LinkVariants.BUTTON}
                  className="bg-edusport-blue text-white px-6 py-2 rounded-md hover:bg-edusport-blue/90"
                >
                  Înscrie-te
                </Link>
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
                <Link
                  href="/contact"
                  variant={LinkVariants.BUTTON}
                  className="bg-edusport-blue text-white px-6 py-2 rounded-md hover:bg-edusport-blue/90"
                >
                  Înscrie-te
                </Link>
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
                <Link
                  href="/contact"
                  variant={LinkVariants.BUTTON}
                  className="bg-edusport-blue text-white px-6 py-2 rounded-md hover:bg-edusport-blue/90"
                >
                  Înscrie-te
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Despre Noi Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-gray-800 mb-6 font-['League_Spartan']">
                  Despre Noi
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  Cu peste 15 ani de experiență în patinajul artistic, EduSport este locul unde
                  pasiunea întâlnește profesionalismul. Antrenorii noștri certificați îi ghidează
                  pe sportivi de la primii pași pe gheață până la competițiile naționale și internaționale.
                </p>
                <p className="text-lg text-gray-600 mb-8">
                  Facilitățile noastre moderne și programele personalizate oferă fiecărui sportiv
                  șansa de a-și atinge potențialul maxim într-un mediu sigur și prietenos.
                </p>
                <Link
                  href="/despre-noi"
                  variant={LinkVariants.BUTTON}
                  className="bg-edusport-blue text-white px-6 py-3 rounded-md hover:bg-edusport-blue/90"
                >
                  Aflați Mai Multe
                </Link>
              </div>
              <div className="bg-gray-200 h-96 rounded-lg flex items-center justify-center">
                <p className="text-gray-500 text-lg">Imagine Despre Noi</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ultimul Articol Section */}
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
                    Sportivii noștri au obținut rezultate excepționale la Campionatul Național de Patinaj Artistic.
                    Echipa EduSport a demonstrat încă o dată calitatea antrenamentelor și dedicarea...
                  </p>
                  <Link
                    href="/noutati"
                    variant={LinkVariants.BUTTON}
                    className="bg-edusport-blue text-white px-6 py-2 rounded-md hover:bg-edusport-blue/90"
                  >
                    Citește Articolul
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;