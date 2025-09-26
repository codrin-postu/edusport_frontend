import Link from "@/components/ui/link";
import { Button } from "@/components/ui/button";
import React from "react";

const HeroSection: React.FC = () => {
  return (
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
        <Button
          asChild
          className="bg-white text-edusport-blue px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
        >
          <Link href="/courses">
            Descoperă Cursurile
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default HeroSection;