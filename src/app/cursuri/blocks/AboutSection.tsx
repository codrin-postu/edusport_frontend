import { cn } from "@/utils/cn";
import Link from "@/components/ui/link";
import { ArrowUpRight, MapPin, Users, Award } from "lucide-react";
import YoutubeEmbed from "@/components/blocks/youtube-embed/YoutubeEmbed";
import React from "react";

const AboutSection: React.FC = () => {
  return (
    <section className={cn("py-20", "bg-white")}>
      <div className="w-full max-w-content mx-auto px-4 md:px-8 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text content */}
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <p className="text-xs font-semibold tracking-widest uppercase text-edusport-blue/60">
                Scoala de Patinaj
              </p>
              <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 leading-snug">
                Patinaj pentru toți, ghidați de campioni
              </h2>
            </div>

            <div className="flex flex-col gap-4 text-gray-500 text-base leading-relaxed font-light">
              <p>
                Organizată anual în perioada{" "}
                <span className="font-medium text-gray-800">
                  octombrie – mai
                </span>{" "}
                de foști sportivi de performanță, Școala de Patinaj EduSport
                oferă cursuri structurate pe mai multe niveluri — de la primii
                pași până la avansați.
              </p>
              <p>
                Cei mai talentați cursanți pot fi selectați pentru spectacole și
                demonstrații de patinaj artistic sau pentru a continua
                pregătirea în cadrul Clubului Sportiv EduSport.
              </p>
            </div>

            {/* Key info */}
            <div className="flex flex-col gap-3">
              <a
                href="https://maps.app.goo.gl/gmrERwQePvxYY6zx6"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-gray-600 hover:text-edusport-blue transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-edusport-blue/8 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-edusport-blue" />
                </div>
                Patinoarul Cotroceni On Ice, AFI Palace Cotroceni
              </a>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="w-8 h-8 rounded-full bg-edusport-blue/8 flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4 text-edusport-blue" />
                </div>
                Grupe pentru toate nivelurile: primii pași, începători,
                intermediari, avansați
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="w-8 h-8 rounded-full bg-edusport-blue/8 flex items-center justify-center shrink-0">
                  <Award className="w-4 h-4 text-edusport-blue" />
                </div>
                Antrenori - foști sportivi de performanță si şi atleţi pasionaţi
                de patinaj
              </div>
            </div>

            <Link
              href="/cursuri/program"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-edusport-blue hover:text-edusport-blue/70 transition-colors w-fit"
            >
              Vezi programul complet
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Video */}
          <YoutubeEmbed
            url="https://www.youtube.com/watch?v=G-0eleYxj2w"
            title="Cursuri de patinaj EduSport"
            label="Cum arată cursurile noastre"
          />
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
