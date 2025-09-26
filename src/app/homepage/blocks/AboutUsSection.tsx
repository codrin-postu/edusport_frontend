import Link from "@/components/ui/link";
import { Button } from "@/components/ui/button";
import React from "react";

const AboutUsSection: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-6 font-['League_Spartan']">
                Despre Noi
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Cu peste 15 ani de experiență în patinajul artistic, EduSport
                este locul unde pasiunea întâlnește profesionalismul.
                Antrenorii noștri certificați îi ghidează pe sportivi de la
                primii pași pe gheață până la competițiile naționale și
                internaționale.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Facilitățile noastre moderne și programele personalizate oferă
                fiecărui sportiv șansa de a-și atinge potențialul maxim
                într-un mediu sigur și prietenos.
              </p>
              <Button
                asChild
                className="bg-edusport-blue text-white px-6 py-3 rounded-md hover:bg-edusport-blue/90"
              >
                <Link href="/about-us">
                  Aflați Mai Multe
                </Link>
              </Button>
            </div>
            <div className="bg-gray-200 h-96 rounded-lg flex items-center justify-center">
              <p className="text-gray-500 text-lg">Imagine Despre Noi</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUsSection;