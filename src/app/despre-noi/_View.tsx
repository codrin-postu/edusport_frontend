import React from "react";
import PageHeroSection from "@/components/blocks/page-hero-section";
import { Trophy, Medal, Users, Calendar } from "lucide-react";

// ---------------------------------------------------------------------------
// Fallback data (used when CMS fields are empty)
// ---------------------------------------------------------------------------

const DEFAULT_STATS = [
  { value: "10+", label: "Competiții pe an" },
  { value: "150", label: "Copii pe sezon" },
  { value: "500+", label: "Sportivi formați" },
  { value: "13+", label: "Ani de activitate" },
];

const STAT_ICONS = [
  <Trophy key="trophy" className="w-5 h-5" />,
  <Medal key="medal" className="w-5 h-5" />,
  <Users key="users" className="w-5 h-5" />,
  <Calendar key="calendar" className="w-5 h-5" />,
];

const DEFAULT_MILESTONES = [
  { year: "2012", title: "Înființarea Clubului", description: "Asociația Clubul Sportiv EduSport a fost înființată în luna aprilie 2012, ca persoană juridică română de drept privat, fără scop patrimonial, polisportivă, apolitică și non-profit." },
  { year: "2013", title: "Cupa EduSport - ediția I", description: "Prima ediție a Cupei EduSport – Patinaj Artistic pe Role Inline, 28–29 iunie 2013, marcând debutul clubului ca organizator de competiții." },
  { year: "2014", title: "Cupa EduSport - ediția a II-a", description: "A doua ediție a Cupei EduSport – Patinaj Artistic pe Role Inline, 6–8 august 2014. Sportivii EduSport participă tot mai activ la competiții naționale, obținând primele medalii." },
  { year: "2017", title: "EduSport Trophy - prima competiție internațională", description: "EduSport Trophy – International Figure Skating Competition in Single Skating (Seniors, Juniors, Advanced Novices, Basic Novices, Chicks & Cubs), 4–7 ianuarie 2017, Otopeni. În aceeași perioadă a fost organizată și EduSport Recreational Cup." },
  { year: "2019", title: "Rezultate la nivel internațional", description: "Sportivii EduSport reprezintă România la competiții internaționale de patinaj artistic, aducând primele medalii la nivel internațional." },
  { year: "2024", title: "Cea mai mare Școală de Patinaj din București", description: "Cu aproximativ 150 de copii pe sezon (din care 100 participanți constanți), EduSport operează cea mai mare Școală de Patinaj din București, cu cursuri organizate pe mai multe niveluri, de la primii pași la avansați." },
];

const DEFAULT_EVENTS_ORGANIZED = [
  "Cupa EduSport – Patinaj Artistic pe Role Inline, ediția I, 28–29.06.2013",
  "Cupa EduSport – Patinaj Artistic pe Role Inline, ediția a II-a, 6–8.08.2014",
  "EduSport Trophy – International Figure Skating Competition (Single Skating: Seniors, Juniors, Advanced Novices, Basic Novices, Chicks & Cubs), 4–7 ianuarie 2017, Otopeni",
  "EduSport Recreational Cup, 7 ianuarie 2017",
  "Serbări tematice de Halloween, Crăciun, Paște și 1 Iunie pentru cursanții Școlii de Patinaj EduSport",
];

const DEFAULT_EVENTS_PARTICIPATED = [
  "Spectacole organizate cu ocazia zilei de 1 Decembrie, în mall-ul AFI Palace Cotroceni",
  "\u201EMuzică, dans și speranță\u201D \u2014 strângere de fonduri organizată de Asociația MAME, 2 iunie 2011",
  "Concert simfonic la patinoar \u2014 spectacol organizat de Primăria Sectorului 6, prin Centrul Cultural European Sector 6, 9 mai 2014",
  "Inaugurări de patinoar: City Park Constanța, patinoarul artificial din parcul Lumea Copiilor, AFI Palace Ploiești",
  "Spectacol organizat de TELUS International cu ocazia Zilei Canadei",
  "Musicalul \u00ABAlice în Țara Zăpezilor\u00BB, 16–17 decembrie 2016, Cluj-Napoca",
  "Demonstrații de patinaj artistic pe role inline \u2014 Decathlon Pallady, august 2017",
];

const DEFAULT_INTRO = [
  "Asociația Clubul Sportiv EduSport și-a propus ca misiune și totodată profesiune de credință contribuirea la dezvoltarea armonioasă a tineretului: educație prin sport, pentru o viață sănătoasă și activă, și educație pentru sport, respectiv sprijinirea sportivilor talentați, în vederea obținerii înaltei performanțe.",
  "În prezent, în cadrul clubului nostru funcționează secția de Patinaj, prin cele două componente ale sale: patinajul artistic pe gheață și patinajul artistic pe role inline.",
  "Ne dorim foarte mult să încurajăm popularizarea patinajului artistic și ca dovadă am înființat cea mai mare Școală de Patinaj din București, unde numărul de copii care învață din tainele patinajului este din ce în ce mai mare. Din 2012 până în prezent am reușit să fidelizăm foarte mulți copii, dar și să recrutăm sportivi atât pentru cursuri, cât și pentru performanță. Numărul estimat al școlii noastre este de aproximativ 150 de copii pe sezon, din care 100 participanți constanți.",
  "Cursurile Școlii de Patinaj sunt organizate pe mai multe niveluri și grupe, de la primii pași la avansați. Cei mai talentați cursanți pot fi selecționați de către antrenorii clubului pentru a participa la spectacole și demonstrații de patinaj artistic, și pentru a-și continua pregătirea în vederea practicării patinajului artistic de performanță, pe gheață sau pe role inline.",
  "În fiecare an, clubul, cu suportul familiilor sportivilor de performanță, asigură participarea sportivilor EduSport la aproximativ 10 competiții interne și internaționale, atât pe gheață, cât și pe role inline.",
];

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Milestone {
  year: string;
  title: string;
  description: string;
}

// Stats from CMS stored as "value|label" e.g. "10+|Competiții pe an"
function parseStats(raw: string[]): { value: string; label: string }[] {
  return raw.map((s) => {
    const [value, ...rest] = s.split("|");
    return { value: value.trim(), label: rest.join("|").trim() };
  });
}

interface Props {
  bannerTitle?: string;
  bannerSubtitle?: string;
  sectionHeading?: string;
  sectionSubheading?: string;
  introText?: string;
  stats?: string[];
  milestones?: Milestone[];
  eventsOrganized?: string[];
  eventsParticipated?: string[];
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const HistoryPage: React.FC<Props> = ({
  bannerTitle,
  bannerSubtitle,
  sectionHeading,
  sectionSubheading,
  introText,
  stats,
  milestones,
  eventsOrganized,
  eventsParticipated,
}) => {
  const resolvedStats = stats && stats.length > 0 ? parseStats(stats) : DEFAULT_STATS;
  const resolvedMilestones = milestones && milestones.length > 0 ? milestones : DEFAULT_MILESTONES;
  const resolvedEventsOrganized = eventsOrganized && eventsOrganized.length > 0 ? eventsOrganized : DEFAULT_EVENTS_ORGANIZED;
  const resolvedEventsParticipated = eventsParticipated && eventsParticipated.length > 0 ? eventsParticipated : DEFAULT_EVENTS_PARTICIPATED;
  const introParagraphs = introText && introText.trim()
    ? introText.split("\n\n").filter(Boolean).map((p) => p.trim())
    : DEFAULT_INTRO;

  return (
    <div className="min-h-screen bg-white">
      <PageHeroSection
        backgroundImage="/images/hero-background.png"
        title={["DESPRE", "NOI"]}
        variant="purple"
        breadcrumb={[
          { label: "Despre noi" },
        ]}
      >
        <h1 className="text-4xl md:text-6xl font-semibold text-white leading-[1.1] tracking-tight">
          {bannerTitle ?? "Despre Noi"}
        </h1>
        <p className="text-white/70 text-base font-light border-t border-white/10 pt-4">
          {bannerSubtitle ?? "Educație prin sport, pentru o viață sănătoasă și activă. Educație pentru sport, în vederea obținerii înaltei performanțe."}
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
                {sectionHeading ?? "Peste un deceniu de pasiune și performanță"}
              </h2>
              <p className="text-sm text-gray-400 font-light md:text-right md:max-w-xs">
                {sectionSubheading ?? "De la primii pași pe gheață la podiumuri internaționale."}
              </p>
            </div>
          </div>

          {/* Intro text */}
          <div className="max-w-3xl mb-20 flex flex-col gap-4">
            {introParagraphs.map((para, i) => (
              <p key={i} className="text-base text-gray-600 font-light leading-relaxed">
                {para}
              </p>
            ))}
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
            {resolvedStats.map((stat, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-2 rounded-2xl border border-gray-100 py-8 px-4"
              >
                <div className="w-10 h-10 rounded-xl bg-edusport-blue/5 text-edusport-blue flex items-center justify-center">
                  {STAT_ICONS[i % STAT_ICONS.length]}
                </div>
                <span className="text-3xl font-semibold text-gray-900">{stat.value}</span>
                <span className="text-xs text-gray-400 font-light text-center">{stat.label}</span>
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
            {resolvedMilestones.map((milestone, i) => (
              <div key={i} className="flex gap-5 items-start py-6 pl-6 group">
                <span
                  className="text-3xl font-bold text-gray-100 group-hover:text-edusport-blue/20 transition-colors tabular-nums w-16 shrink-0 leading-none select-none"
                  aria-hidden
                >
                  {milestone.year}
                </span>
                <div className="flex flex-col gap-1">
                  <h3 className="text-sm font-semibold text-gray-900">{milestone.title}</h3>
                  <p className="text-sm text-gray-500 font-light leading-relaxed">{milestone.description}</p>
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
              {resolvedEventsOrganized.map((event, i) => (
                <li key={i} className="text-sm text-gray-600 font-light leading-relaxed pl-4 border-l-2 border-edusport-blue/15">
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
              {resolvedEventsParticipated.map((event, i) => (
                <li key={i} className="text-sm text-gray-600 font-light leading-relaxed pl-4 border-l-2 border-edusport-blue/15">
                  {event}
                </li>
              ))}
            </ul>
          </div>

        </div>
      </section>
    </div>
  );
};

export default HistoryPage;
