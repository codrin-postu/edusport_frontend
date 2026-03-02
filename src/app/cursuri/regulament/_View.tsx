"use client";

import React, { useState } from "react";
import { cn } from "@/utils/cn";
import PageHeroSection from "@/components/blocks/page-hero-section";
import {
  Users,
  CalendarCheck,
  Layers,
  ShieldAlert,
  MessageCircle,
  ExternalLink,
  ChevronDown,
} from "lucide-react";

interface Rule {
  number: number;
  text: string;
  highlight?: boolean;
  isWhatsApp?: boolean;
  isFacebook?: boolean;
}

interface RuleCategory {
  id: string;
  label: string;
  icon: React.ReactNode;
  iconBg: string;
  rules: Rule[];
}

const CATEGORIES: RuleCategory[] = [
  {
    id: "inscriere",
    label: "Eligibilitate & Înscriere",
    icon: <Users className="w-4 h-4" />,
    iconBg: "bg-blue-50 text-edusport-blue",
    rules: [
      {
        number: 1,
        text: "Copilul minor trebuie sa aiba acceptul parintelui de a intra pe gheata si de a participa la curs, iar parintele este raspunzator pentru aceasta initiativa si pentru echipamentul de protectie pe care il va/nu-l va purta copilul pe parcursul cursului (patine, casca de protectie, genunchiere, cotiere, etc).",
      },
      {
        number: 2,
        text: "Participantul la curs trebuie sa aiba varsta minima de 4 ani si capacitatea de a comunica si intelege ce ii transmite instructorul. In cazuri exceptionale, in functie de evaluarea facuta de instructori, pot fi acceptati si copii sub 4 ani.",
      },
      {
        number: 3,
        text: 'La prima sedinta de curs, parintele/tutorele legal va completa o fisa de inscriere, in care va declara pe proprie raspundere daca fiul/fiica sa este "Apt pentru efort fizic".',
      },
      {
        number: 4,
        text: "Tutorele sau participantul trebuie sa informeze instructorul despre problemele de sanatate temporare si/sau daca apar probleme medicale in timpul desfasurarii cursului.",
      },
      {
        number: 5,
        text: "Inscrierea la cursuri se poate face doar online pe site-ul www.scoaladepatinaj.com",
      },
      {
        number: 6,
        text: "Numarul locurilor este limitat pentru fiecare grupa/ora in parte. Ocuparea locurilor vacante se va face in ordinea inscrierii la cursuri.",
        highlight: true,
      },
      {
        number: 7,
        text: "Taxa de membru se achita o singura data pe sezon, la inscrierea la cursurile noastre, indiferent de momentul inscrierii la cursuri si este valabila in perioada octombrie – mai. Taxa nu este fractionara.",
      },
      {
        number: 8,
        text: "Abonamentul este valabil 4 saptamani de la efectuarea primei sedinte! In cazul in care, perioada de 4 saptamani se suprapune cu un weekend in care nu se fac cursuri, valabilitatea abonamentului se prelungeste cu inca o saptamana.",
      },
    ],
  },
  {
    id: "prezenta",
    label: "Prezență & Recuperări",
    icon: <CalendarCheck className="w-4 h-4" />,
    iconBg: "bg-amber-50 text-amber-600",
    rules: [
      {
        number: 9,
        text: "Sedintele achitate si neefectuate pe parcursul celor 4 saptamani nu se pot reporta/recupera.",
        highlight: true,
      },
      {
        number: 10,
        text: "In cazul in care se lipseste din motive medicale, se pot recupera 2 sedinte, in baza unei adeverinte medicale.",
      },
      {
        number: 11,
        text: "Rezervarea locurilor pentru urmatorul modul se face prin achizitionarea unui nou abonament in ultimele 2 sedinte ale modulului curent. In cazul in care abonamentele nu sunt achitate in perioada respectiva, locul este declarat din nou vacant, urmand sa inscriem urmatoarea persoana de pe lista. Regula se aplica atat pentru non-membri, cat si pentru membri.",
      },
      {
        number: 12,
        text: "Prezenta la curs se face cu minimum 20 minute inainte de intrarea pe gheata, pentru efectuarea incalzirii. Incalzirea se efectueaza de fiecare copil, in mod independent (sub supravegherea parintilor).",
      },
    ],
  },
  {
    id: "grupe",
    label: "Grupe & Avansare",
    icon: <Layers className="w-4 h-4" />,
    iconBg: "bg-purple-50 text-purple-600",
    rules: [
      {
        number: 13,
        text: "Grupa/ora la care va fi incadrat cursantul, va fi comunicata dupa inscriere, urmand ca programarea finala a orei sa fie stabilita dupa testarea efectiva a cursantului (in prima ora de curs).",
      },
      {
        number: 14,
        text: 'Selectia cursantilor pentru grupele de "Avansati" va fi realizata de catre antrenorul acestei grupe, in baza unor elemente tehnice pe care trebuie sa le execute sportivii.',
      },
      {
        number: 15,
        text: "Avansarea copiilor de la o grupa la alta se va face de catre instructori doar in momentul in care cursantul va realiza corect elementele tehnice necesare pentru elementele lucrate la urmatoarea grupa.",
      },
      {
        number: 16,
        text: "Fiecare instructor se va ocupa de un numar de 8–10 cursanti/sedinta la grupele primii pasi si incepatori si aprox 15 cursanti/sedinta la grupele intermediari si avansati.",
      },
      {
        number: 17,
        text: "Intrarea pe patinoar se face doar pe baza abonamentului. Pretul abonamentului include intrarea pe patinoar si antrenamentul. Inchirierea patinelor NU este inclusa in abonament.",
        highlight: true,
      },
    ],
  },
  {
    id: "gheata",
    label: "Reguli pe Gheață",
    icon: <ShieldAlert className="w-4 h-4" />,
    iconBg: "bg-sky-50 text-sky-600",
    rules: [
      {
        number: 18,
        text: "Intrarea pe patinoar se face doar pe poarta principala sau prin locul indicat de instructori. Este interzis accesul peste mantinela.",
      },
      {
        number: 19,
        text: "Toti copiii vor participa la cursuri echipati astfel: patine, manusi, tinuta sport, echipament de patinaj, fara bijuterii sau accesorii vestimentare care sa atarne. De asemenea, parul trebuie sa fie prins.",
      },
      {
        number: 20,
        text: "La grupele de intermediari si avansati sunt obligatorii patinele speciale de patinaj artistic.",
      },
      {
        number: 21,
        text: "Servirea de mancare si bauturi pe aria ghetii nu este permisa in timpul antrenamentelor. Instructorii vor oferi pauze organizate pentru hidratare.",
      },
      {
        number: 22,
        text: "Participantii la curs nu au voie sa foloseasca, pe gheata, obiecte straine patinoarului.",
      },
      {
        number: 23,
        text: "Participantii la curs trebuie sa comunice cu instructorul si sa fie foarte atenti la indicatiile acestuia.",
      },
      {
        number: 24,
        text: "Sa se respecte organizarea cursului si sa se evite interactionarea dintre parinti si copii.",
      },
      {
        number: 25,
        text: "Jocul pe gheata nu este permis cu exceptia cazurilor in care face parte din pregatirea cursului.",
      },
      {
        number: 26,
        text: "Patinele inchiriate de la patinoar trebuie pastrate cu grija, nefiind acceptata pasirea cu ele pe gresia, marmura sau in alte spatii din afara ariei patinoarului.",
      },
      {
        number: 27,
        text: "Parasirea ghetii inainte de finalizarea cursului (in cazul nevoilor urgente – de folosire a toaletelor) se face prin invoirea de la instructor si numai in prezenta tutorelui.",
      },
    ],
  },
  {
    id: "securitate",
    label: "Securitate, Răspundere & Comunicare",
    icon: <MessageCircle className="w-4 h-4" />,
    iconBg: "bg-rose-50 text-rose-500",
    rules: [
      {
        number: 28,
        text: "Este important de mentionat ca, avand in vedere natura acestui sport, fiecare cursant poate fi expus la un risc de accidentare, care poate fi minimizat prin respectarea indrumărilor oferite de instructori si prin respectarea programului impus de acestia.",
      },
      {
        number: 29,
        text: "Prin inscrierea la cursul de patinaj, parintii/tutorii declara ca sunt constienti de riscurile asociate cu practicarea acestui sport, inclusiv posibilitatea accidentarilor in urma exercitiilor desfasurate pe gheata. Instructorii si asistentii patinoarului nu isi asuma responsabilitatea pentru niciun incident sau accident care ar putea aparea din cauza abaterilor participantilor de la regulile stabilite.",
        highlight: true,
      },
      {
        number: 30,
        text: "Asociatia Clubul Sportiv EduSport isi rezerva dreptul de a fotografia si inregistra audio-video cursurile, serbarile sau orice alt eveniment organizat de ACS EduSport sau partenerii acestuia, in care apar cursantii Scolii de Patinaj EduSport sau orice sportiv legitimat la ACS EduSport, respectiv de a utiliza imaginile pentru promovarea activitatii ACS EduSport.",
      },
      {
        number: 31,
        text: "Informatiile actualizate cu privire la program vor fi postate pe canalul de whatsapp: Scoala de Patinaj EduSport. Va rugam sa urmariti acest canal pentru a primi toate informatiile in timp real. Orice persoana care urmareste canalul poate vedea informatiile postate de noi pe canalul de whatsapp, dar informatiile dumneavoastra (telefon, nume, foto) nu sunt vizibile pentru celelalte persoane care urmaresc canalul, asigurand astfel confidentialitatea datelor dvs.",
        isWhatsApp: true,
      },
      {
        number: 32,
        text: "De asemenea, in functie de situatie, vor fi transmise informatii si prin sms, e-mail, pe site-ul www.scoaladepatinaj.com si pe pagina de facebook a Scolii de Patinaj.",
        isFacebook: true,
      },
      {
        number: 33,
        text: "Prin inscrierea la cursul de patinaj, parintii/tutorii confirma ca au inteles si acceptat toate aceste conditii.",
        highlight: true,
      },
    ],
  },
];

function renderRuleText(rule: Rule): React.ReactNode {
  if (rule.isWhatsApp) {
    return (
      <span>
        Informatiile actualizate cu privire la program vor fi postate pe canalul de WhatsApp:{" "}
        <a
          href="https://whatsapp.com/channel/0029VaYiSuXAojmCFCLGUm1P"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-0.5 text-green-700 font-medium hover:underline"
        >
          Scoala de Patinaj EduSport
          <ExternalLink className="w-3 h-3 ml-0.5" />
        </a>
        . Va rugam sa urmariti acest canal pentru a primi toate informatiile in timp real. Orice persoana care urmareste canalul poate vedea informatiile postate de noi, dar informatiile dumneavoastra (telefon, nume, foto) nu sunt vizibile pentru celelalte persoane, asigurand astfel confidentialitatea datelor dvs.
      </span>
    );
  }
  if (rule.isFacebook) {
    return (
      <span>
        De asemenea, in functie de situatie, vor fi transmise informatii si prin sms, e-mail, pe site-ul{" "}
        <a
          href="https://www.scoaladepatinaj.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-0.5 text-edusport-blue font-medium hover:underline"
        >
          www.scoaladepatinaj.com
          <ExternalLink className="w-3 h-3 ml-0.5" />
        </a>{" "}
        si pe{" "}
        <a
          href="https://www.facebook.com/ScoaladePatinaj"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-0.5 text-blue-700 font-medium hover:underline"
        >
          pagina de Facebook a Scolii de Patinaj
          <ExternalLink className="w-3 h-3 ml-0.5" />
        </a>
        .
      </span>
    );
  }
  return rule.text;
}

const RegulamentPage: React.FC = () => {
  const [openSections, setOpenSections] = useState<Set<string>>(
    () => new Set(CATEGORIES.map((c) => c.id))
  );

  const toggle = (id: string) =>
    setOpenSections((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  return (
    <div className={cn("min-h-screen", "bg-white")}>
      <PageHeroSection title={["REGULAMENT"]} breadcrumb={[{ label: "Cursuri", href: "/cursuri" }, { label: "Regulament" }]}>
        <h1 className="text-4xl md:text-6xl font-semibold text-white leading-[1.1] tracking-tight">
          Regulament Cursuri
        </h1>
        <p className="text-white/70 text-base font-light border-t border-white/10 pt-4">
          Condițiile de participare, regulile de conduită pe gheață și
          informațiile esențiale pentru o experiență sigură și plăcută la
          cursurile Școlii de Patinaj EduSport.
        </p>
      </PageHeroSection>

      <section className="relative z-10 bg-white py-16 md:py-24">
        <div className="w-full max-w-content mx-auto px-4 md:px-8 lg:px-12">
          {/* Section header */}
          <div className="flex flex-col gap-3 mb-16">
            <p className="text-xs font-semibold tracking-widest uppercase text-edusport-blue/60">
              Regulament
            </p>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 max-w-lg">
                Regulament Scoala de Patinaj EduSport
              </h2>
              <p className="text-sm text-gray-400 font-light md:text-right md:max-w-xs">
                Vă rugăm să citiți cu atenție înainte de prima ședință.
              </p>
            </div>
          </div>

          {/* Category blocks */}
          <div className="flex flex-col gap-4">
            {CATEGORIES.map((category) => {
              const isOpen = openSections.has(category.id);
              return (
                <div key={category.id}>
                  {/* Category header — clickable toggle */}
                  <button
                    onClick={() => toggle(category.id)}
                    className="w-full flex items-center gap-3 py-4 text-left hover:opacity-70 transition-opacity"
                  >
                    <div
                      className={cn(
                        "w-8 h-8 rounded-xl flex items-center justify-center shrink-0",
                        category.iconBg
                      )}
                    >
                      {category.icon}
                    </div>
                    <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-700">
                      {category.label}
                    </h3>
                    <span className="ml-auto text-xs text-gray-400 font-light tabular-nums mr-3">
                      {category.rules.length}{" "}
                      {category.rules.length === 1 ? "regulă" : "reguli"}
                    </span>
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200",
                        isOpen && "rotate-180"
                      )}
                    />
                  </button>

                  {/* Rules list */}
                  {isOpen && (
                    <div className="flex flex-col divide-y divide-gray-100 border-l-2 border-l-edusport-blue/10 ml-4 mb-6">
                      {category.rules.map((rule) =>
                        rule.highlight ? (
                          <div
                            key={rule.number}
                            className="flex gap-5 items-start py-4 pl-5 pr-4 rounded-xl bg-amber-50/60 border border-amber-100 my-1 -ml-px"
                          >
                            <span
                              className="text-3xl font-bold text-amber-200 tabular-nums w-10 shrink-0 leading-none select-none"
                              aria-hidden
                            >
                              {String(rule.number).padStart(2, "0")}
                            </span>
                            <p className="text-sm text-gray-700 font-normal leading-relaxed pt-1">
                              {renderRuleText(rule)}
                            </p>
                          </div>
                        ) : (
                          <div
                            key={rule.number}
                            className="flex gap-5 items-start py-5 pl-6"
                          >
                            <span
                              className="text-3xl font-bold text-gray-100 tabular-nums w-10 shrink-0 leading-none select-none"
                              aria-hidden
                            >
                              {String(rule.number).padStart(2, "0")}
                            </span>
                            <p className="text-sm text-gray-600 font-light leading-relaxed pt-1">
                              {renderRuleText(rule)}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Acceptance gradient card */}
          <div className="mt-16 pt-12 border-t border-gray-100">
            <div
              className="relative overflow-hidden rounded-3xl px-8 py-10 md:px-14 md:py-12 flex flex-col md:flex-row md:items-center gap-8"
              style={{
                background:
                  "linear-gradient(145deg, oklch(0.25 0.12 264) 0%, oklch(0.421 0.2593 264.52) 60%, oklch(0.55 0.18 230) 100%)",
              }}
            >
              {/* Decorative circles */}
              <div className="pointer-events-none absolute -top-8 -right-8 w-48 h-48 rounded-full opacity-10 bg-white" />
              <div className="pointer-events-none absolute -bottom-6 -left-6 w-32 h-32 rounded-full opacity-5 bg-white" />

              {/* Text */}
              <div className="flex flex-col gap-3 flex-1 relative">
                <p className="text-xs font-semibold tracking-widest uppercase text-white/50">
                  Acceptare
                </p>
                <p className="text-white text-base md:text-lg font-light leading-relaxed">
                  Prin înscrierea la cursurile Școlii de Patinaj EduSport,
                  părinții/tutorii confirmă că au citit, înțeles și acceptat în
                  totalitate prezentul regulament.
                </p>
              </div>

              {/* Vertical divider on desktop */}
              <div className="hidden md:block w-px self-stretch bg-white/15" />

              {/* CTA */}
              <div className="relative shrink-0">
                <a
                  href="/inscrieri"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-white/15 hover:bg-white/25 border border-white/20 rounded-full px-6 py-3 transition-colors"
                >
                  Înscrie-te acum
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RegulamentPage;
