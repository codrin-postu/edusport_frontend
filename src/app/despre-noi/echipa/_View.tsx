import React from "react";
import { cn } from "@/utils/cn";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

// ---------------------------------------------------------------------------
// Trainer data — update this list each season as needed
// ---------------------------------------------------------------------------

interface Trainer {
  name: string;
  role: string;
  image?: string; // path relative to /public, e.g. "/images/trainers/ana.jpg"
  bio: string;
  teaches: string[]; // group names this trainer is responsible for
}

const TRAINERS: Trainer[] = [
  {
    name: "Ana Ionescu",
    role: "Antrenor Principal",
    image: undefined,
    bio: "Fostă patinator artistic de performanță cu peste 15 ani de experiență competițională la nivel național și internațional. Conduce școala de patinaj EduSport din primul sezon și coordonează întreg programul tehnic.",
    teaches: ["Avansați Silver", "Avansați Bronze"],
  },
  {
    name: "Mihai Popescu",
    role: "Instructor",
    image: undefined,
    bio: "Instructor cu 8 ani de experiență în predarea patinajului artistic pentru copii și adulți. Specializat în grupele de nivel mediu, cu accent pe tehnica de bază și siguranța pe gheață.",
    teaches: ["Intermediari Silver", "Intermediari Bronze"],
  },
  {
    name: "Elena Constantin",
    role: "Instructor",
    image: undefined,
    bio: "Absolventă a Facultății de Educație Fizică și Sport, cu specializare în patinaj artistic. Pasionată de lucrul cu cei mici, Elena se ocupă de grupele de inițiere și începători.",
    teaches: ["Primii Pași", "Începători"],
  },
  {
    name: "Andrei Dumitrescu",
    role: "Asistent Instructor",
    image: undefined,
    bio: "Fost cursant al Școlii de Patinaj EduSport, acum parte din echipa de instructori. Andrei asistă la grupele de primii pași și susține copiii în primele lor lecții pe gheață.",
    teaches: ["Primii Pași"],
  },
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

const TeamPage: React.FC = () => {
  return (
    <div className={cn("min-h-screen", "bg-white")}>
      {/* Hero */}
      <section className="relative overflow-hidden" style={{ height: "280px" }}>
        <Image
          src="/images/hero-background.png"
          alt="Echipa EduSport"
          fill
          className="object-cover object-center"
          priority
        />

        {/* Content */}
        <div className="relative w-full max-w-content mx-auto px-4 md:px-8 lg:px-12 h-full flex items-center">
          <div className="flex flex-col gap-3 max-w-xl">
            <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 leading-tight tracking-tight">
              Echipa Noastră
            </h1>
            <p className="text-gray-900/60 text-sm font-light">
              Antrenorii și instructorii care ghidează cursanții Școlii de Patinaj EduSport.
            </p>
          </div>
        </div>


      </section>

      <section className="bg-white py-16 md:py-20">
        <div className="w-full max-w-content mx-auto px-4 md:px-8 lg:px-12">
          {/* Introduction */}
          <div className="max-w-2xl mb-14">
            <p className="text-xs font-semibold tracking-widest uppercase text-edusport-blue/60 mb-4">
              Antrenori & Instructori
            </p>
            <p className="text-gray-700 text-base font-light leading-relaxed">
              Echipa EduSport este formată din antrenori și instructori cu formare solidă în patinaj artistic, dedicați progresului fiecărui cursant — de la primii pași pe gheață până la nivelurile avansate. Fiecare membru al echipei îmbină experiența tehnică cu răbdarea și entuziasmul pentru a crea un mediu de învățare sigur și motivant.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {TRAINERS.map((trainer) => (
              <div key={trainer.name} className="flex flex-col gap-4 bg-gray-50 rounded-2xl p-5">
                {/* Avatar row */}
                <div className="flex items-center gap-3">
                  {trainer.image ? (
                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200 shrink-0">
                      <Image
                        src={trainer.image}
                        alt={trainer.name}
                        fill
                        className="object-cover object-top"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-edusport-blue/10 flex items-center justify-center shrink-0">
                      <span className="text-sm font-semibold text-edusport-blue/40 select-none">
                        {trainer.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                  )}
                  <div>
                    <h2 className="text-sm font-semibold text-gray-900 leading-tight">
                      {trainer.name}
                    </h2>
                    <p className="text-xs text-edusport-blue font-medium mt-0.5">
                      {trainer.role}
                    </p>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200" />

                {/* Bio */}
                <p className="text-xs text-gray-500 font-light leading-relaxed">
                  {trainer.bio}
                </p>

                {/* Groups */}
                {trainer.teaches.length > 0 && (
                  <div className="flex flex-col gap-1">
                    <p className="text-xs text-gray-400 font-light uppercase tracking-wider">Predă la</p>
                    <ul className="flex flex-col gap-0.5">
                      {trainer.teaches.map((group) => (
                        <li key={group} className="flex items-center gap-2 text-xs text-gray-500 font-light">
                          <ChevronRight className="w-3 h-3 text-edusport-blue/40 shrink-0" />
                          {group}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default TeamPage;
