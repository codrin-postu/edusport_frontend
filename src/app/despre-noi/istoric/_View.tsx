import React from "react";
import PageHeroSection from "@/components/blocks/page-hero-section";
import { Trophy, Medal, Users, Calendar } from "lucide-react";

const MILESTONES = [
  {
    year: "2012",
    title: "Înființarea Clubului",
    description:
      "Asociația Clubul Sportiv EduSport a fost înființată în luna aprilie 2012, ca persoană juridică română de drept privat, fără scop patrimonial, polisportivă, apolitică și non-profit.",
  },
  {
    year: "2013",
    title: "Cupa EduSport — ediția I",
    description:
      "Prima ediție a Cupei EduSport – Patinaj Artistic pe Role Inline, 28–29 iunie 2013, marcând debutul clubului ca organizator de competiții.",
  },
  {
    year: "2014",
    title: "Cupa EduSport — ediția a II-a",
    description:
      "A doua ediție a Cupei EduSport – Patinaj Artistic pe Role Inline, 6–8 august 2014. Sportivii EduSport participă tot mai activ la competiții naționale, obținând primele medalii.",
  },
  {
    year: "2017",
    title: "EduSport Trophy — prima competiție internațională",
    description:
      "EduSport Trophy – International Figure Skating Competition in Single Skating (Seniors, Juniors, Advanced Novices, Basic Novices, Chicks & Cubs), 4–7 ianuarie 2017, Otopeni. În aceeași perioadă a fost organizată și EduSport Recreational Cup.",
  },
  {
    year: "2019",
    title: "Rezultate la nivel internațional",
    description:
      "Sportivii EduSport reprezintă România la competiții internaționale de patinaj artistic, aducând primele medalii la nivel internațional.",
  },
  {
    year: "2024",
    title: "Cea mai mare Școală de Patinaj din București",
    description:
      "Cu aproximativ 150 de copii pe sezon (din care 100 participanți constanți), EduSport operează cea mai mare Școală de Patinaj din București, cu cursuri organizate pe mai multe niveluri, de la primii pași la avansați.",
  },
];

const EVENTS_ORGANIZED = [
  "Cupa EduSport – Patinaj Artistic pe Role Inline, ediția I, 28–29.06.2013",
  "Cupa EduSport – Patinaj Artistic pe Role Inline, ediția a II-a, 6–8.08.2014",
  "EduSport Trophy – International Figure Skating Competition (Single Skating: Seniors, Juniors, Advanced Novices, Basic Novices, Chicks & Cubs), 4–7 ianuarie 2017, Otopeni",
  "EduSport Recreational Cup, 7 ianuarie 2017",
  "Serbări tematice de Halloween, Crăciun, Paște și 1 Iunie pentru cursanții Școlii de Patinaj EduSport",
];

const EVENTS_PARTICIPATED = [
  "Spectacole organizate cu ocazia zilei de 1 Decembrie, în mall-ul AFI Palace Cotroceni",
  "\u201EMuzică, dans și speranță\u201D \u2014 strângere de fonduri organizată de Asociația MAME, 2 iunie 2011",
  "Concert simfonic la patinoar \u2014 spectacol organizat de Primăria Sectorului 6, prin Centrul Cultural European Sector 6, 9 mai 2014",
  "Inaugurări de patinoar: City Park Constanța, patinoarul artificial din parcul Lumea Copiilor, AFI Palace Ploiești",
  "Spectacol organizat de TELUS International cu ocazia Zilei Canadei",
  "Musicalul \u00ABAlice în Țara Zăpezilor\u00BB, 16–17 decembrie 2016, Cluj-Napoca",
  "Demonstrații de patinaj artistic pe role inline \u2014 Decathlon Pallady, august 2017",
];

const STATS = [
  {
    icon: <Trophy className="w-5 h-5" />,
    value: "10+",
    label: "Competiții pe an",
  },
  {
    icon: <Medal className="w-5 h-5" />,
    value: "150",
    label: "Copii pe sezon",
  },
  {
    icon: <Users className="w-5 h-5" />,
    value: "500+",
    label: "Sportivi formați",
  },
  {
    icon: <Calendar className="w-5 h-5" />,
    value: "13+",
    label: "Ani de activitate",
  },
];

const HistoryPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <PageHeroSection
        variant="light"
        backgroundImage="/images/hero-background.png"
        title={["DESPRE", "NOI"]}
      >
        <h1 className="text-4xl md:text-6xl font-semibold text-gray-900 leading-[1.1] tracking-tight">
          Despre Noi
        </h1>
        <p className="text-gray-900/60 text-base font-light">
          Educație prin sport, pentru o viață sănătoasă și activă. Educație
          pentru sport, în vederea obținerii înaltei performanțe.
        </p>
      </PageHeroSection>

      <section className="relative z-10 bg-white py-16 md:py-24">
        <div className="w-full max-w-content mx-auto px-4 md:px-8 lg:px-12">
          {/* Section header */}
          <div className="flex flex-col gap-3 mb-16">
            <p className="text-xs font-semibold tracking-widest uppercase text-edusport-blue/60">
              Despre Club
            </p>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 max-w-lg">
                Peste un deceniu de pasiune și performanță
              </h2>
              <p className="text-sm text-gray-400 font-light md:text-right md:max-w-xs">
                De la primii pași pe gheață la podiumuri internaționale.
              </p>
            </div>
          </div>

          {/* Intro text */}
          <div className="max-w-3xl mb-20">
            <p className="text-base text-gray-600 font-light leading-relaxed mb-4">
              Asociația Clubul Sportiv EduSport și-a propus ca misiune și
              totodată profesiune de credință contribuirea la dezvoltarea
              armonioasă a tineretului: educație prin sport, pentru o viață
              sănătoasă și activă, și educație pentru sport, respectiv
              sprijinirea sportivilor talentați, în vederea obținerii înaltei
              performanțe.
            </p>
            <p className="text-base text-gray-600 font-light leading-relaxed mb-4">
              În prezent, în cadrul clubului nostru funcționează secția de
              Patinaj, prin cele două componente ale sale: patinajul artistic pe
              gheață și patinajul artistic pe role inline.
            </p>
            <p className="text-base text-gray-600 font-light leading-relaxed mb-4">
              Ne dorim foarte mult să încurajăm popularizarea patinajului
              artistic și ca dovadă am înființat cea mai mare Școală de Patinaj
              din București, unde numărul de copii care învață din tainele
              patinajului este din ce în ce mai mare. Din 2012 până în prezent am
              reușit să fidelizăm foarte mulți copii, dar și să recrutăm
              sportivi atât pentru cursuri, cât și pentru performanță. Numărul
              estimat al școlii noastre este de aproximativ 150 de copii pe
              sezon, din care 100 participanți constanți.
            </p>
            <p className="text-base text-gray-600 font-light leading-relaxed mb-4">
              Cursurile Școlii de Patinaj sunt organizate pe mai multe niveluri
              și grupe, de la primii pași la avansați. Cei mai talentați cursanți
              pot fi selecționați de către antrenorii clubului pentru a participa
              la spectacole și demonstrații de patinaj artistic, și pentru a-și
              continua pregătirea în vederea practicării patinajului artistic de
              performanță, pe gheață sau pe role inline.
            </p>
            <p className="text-base text-gray-600 font-light leading-relaxed">
              În fiecare an, clubul, cu suportul familiilor sportivilor de
              performanță, asigură participarea sportivilor EduSport la
              aproximativ 10 competiții interne și internaționale, atât pe
              gheață, cât și pe role inline.
            </p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center gap-2 rounded-2xl border border-gray-100 py-8 px-4"
              >
                <div className="w-10 h-10 rounded-xl bg-edusport-blue/5 text-edusport-blue flex items-center justify-center">
                  {stat.icon}
                </div>
                <span className="text-3xl font-semibold text-gray-900">
                  {stat.value}
                </span>
                <span className="text-xs text-gray-400 font-light text-center">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

          {/* Timeline */}
          <div className="flex flex-col gap-3 mb-12">
            <p className="text-xs font-semibold tracking-widest uppercase text-edusport-blue/60">
              Parcurs
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900">
              Momentele cheie
            </h2>
          </div>

          <div className="flex flex-col border-l-2 border-l-edusport-blue/10 ml-4">
            {MILESTONES.map((milestone) => (
              <div
                key={milestone.year}
                className="flex gap-5 items-start py-6 pl-6 group"
              >
                <span
                  className="text-3xl font-bold text-gray-100 group-hover:text-edusport-blue/20 transition-colors tabular-nums w-16 shrink-0 leading-none select-none"
                  aria-hidden
                >
                  {milestone.year}
                </span>
                <div className="flex flex-col gap-1">
                  <h3 className="text-sm font-semibold text-gray-900">
                    {milestone.title}
                  </h3>
                  <p className="text-sm text-gray-500 font-light leading-relaxed">
                    {milestone.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Events organized */}
          <div className="mt-20">
            <div className="flex flex-col gap-3 mb-8">
              <p className="text-xs font-semibold tracking-widest uppercase text-edusport-blue/60">
                Evenimente
              </p>
              <h2 className="text-3xl md:text-4xl font-semibold text-gray-900">
                Organizate de ACS EduSport
              </h2>
            </div>
            <ul className="flex flex-col gap-3 max-w-3xl">
              {EVENTS_ORGANIZED.map((event) => (
                <li
                  key={event}
                  className="text-sm text-gray-600 font-light leading-relaxed pl-4 border-l-2 border-edusport-blue/15"
                >
                  {event}
                </li>
              ))}
            </ul>
          </div>

          {/* Events participated */}
          <div className="mt-16">
            <div className="flex flex-col gap-3 mb-8">
              <h2 className="text-3xl md:text-4xl font-semibold text-gray-900">
                Participări ale sportivilor EduSport
              </h2>
            </div>
            <ul className="flex flex-col gap-3 max-w-3xl">
              {EVENTS_PARTICIPATED.map((event) => (
                <li
                  key={event}
                  className="text-sm text-gray-600 font-light leading-relaxed pl-4 border-l-2 border-edusport-blue/15"
                >
                  {event}
                </li>
              ))}
            </ul>
          </div>

          {/* Objectives card */}
          <div className="mt-20">
            <div
              className="relative overflow-hidden rounded-3xl px-8 py-10 md:px-14 md:py-12"
              style={{
                background:
                  "linear-gradient(145deg, oklch(0.25 0.12 264) 0%, oklch(0.421 0.2593 264.52) 60%, oklch(0.55 0.18 230) 100%)",
              }}
            >
              {/* Decorative circles */}
              <div className="pointer-events-none absolute -top-8 -right-8 w-48 h-48 rounded-full opacity-10 bg-white" />
              <div className="pointer-events-none absolute -bottom-6 -left-6 w-32 h-32 rounded-full opacity-5 bg-white" />

              <div className="relative flex flex-col gap-6">
                <p className="text-xs font-semibold tracking-widest uppercase text-white/50">
                  Obiective
                </p>
                <h3 className="text-2xl md:text-3xl font-semibold text-white">
                  Ce ne propunem
                </h3>
                <ul className="flex flex-col gap-4 max-w-2xl">
                  <li className="text-white/80 text-sm font-light leading-relaxed pl-4 border-l-2 border-white/20">
                    Depistarea, selecționarea și pregătirea permanentă a
                    sportivilor cu aptitudini pentru obținerea de performanțe
                    sportive.
                  </li>
                  <li className="text-white/80 text-sm font-light leading-relaxed pl-4 border-l-2 border-white/20">
                    Acordarea de burse și susținerea costurilor de
                    antrenament, deplasări și taxe competiții pentru lotul de
                    performanță.
                  </li>
                  <li className="text-white/80 text-sm font-light leading-relaxed pl-4 border-l-2 border-white/20">
                    Organizarea de competiții sportive, tabere, cantonamente
                    și activități recreative pentru membrii clubului.
                  </li>
                  <li className="text-white/80 text-sm font-light leading-relaxed pl-4 border-l-2 border-white/20">
                    Inițierea și desfășurarea de programe educative pe teme
                    legate de sport, sănătate și voluntariat.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HistoryPage;
