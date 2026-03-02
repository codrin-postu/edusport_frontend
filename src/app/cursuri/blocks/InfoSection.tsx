import { cn } from "@/utils/cn";
import { Info } from "lucide-react";
import React from "react";

const INFO_ITEMS = [
  "Înscrierea la cursuri se face completând formularul pe site, în limita locurilor disponibile pentru fiecare modul/grupă.",
  "În timpul cursurilor, copilul trebuie să fie echipat în ținută sport/echipament de patinaj artistic și să aibă obligatoriu mănuși.",
  "Intrarea pe patinoar se face doar pe baza abonamentului.",
  "Abonamentul este valabil 4 săptămâni de la efectuarea primei ședințe. Dacă perioada se suprapune cu un weekend fără cursuri, valabilitatea se prelungește cu încă o săptămână.",
  "În cazul în care copilul nu se prezintă la cursuri, ședințele achitate și neefectuate NU se pot recupera.",
];

const InfoSection: React.FC = () => {
  return (
    <section className={cn("py-12", "bg-white")}>
      <div className="w-full max-w-content mx-auto px-4 md:px-8 lg:px-12">
        <div className="max-w-2xl mx-auto flex flex-col gap-4">
          <p className="text-xs font-semibold tracking-widest uppercase text-edusport-blue/60">
            Ce trebuie să știi
          </p>
          <ul className="flex flex-col gap-2">
            {INFO_ITEMS.map((item, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-500 font-light">
                <Info className="w-3.5 h-3.5 text-edusport-blue/50 shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
          <p className="text-xs text-gray-400 italic pt-1">
            Ne vedem pe gheață! — Echipa Școlii de Patinaj EduSport
          </p>
        </div>
      </div>
    </section>
  );
};

export default InfoSection;
