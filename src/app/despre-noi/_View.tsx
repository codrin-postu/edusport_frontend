import React from "react";
import PageHeroSection from "@/components/blocks/page-hero-section";
import Card from "@/components/ui/card";
import { Stat } from "@/components/ui/stat";

// ---------------------------------------------------------------------------
// Fallback data (used when CMS fields are empty)
// ---------------------------------------------------------------------------

const DEFAULT_STATS = [
  { value: "10+", label: "Competiții pe an" },
  { value: "150", label: "Copii pe sezon" },
  { value: "500+", label: "Sportivi formați" },
  { value: "13+", label: "Ani de activitate" },
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
    <div className="min-h-screen bg-surface">
      <PageHeroSection
        backgroundImage="/images/hero-background.png"
        title={["DESPRE", "NOI"]}
        variant="blue"
        breadcrumb={[
          { label: "Despre noi" },
        ]}
      >
        <h1 className="text-display text-primary-on-dark">
          {bannerTitle ?? "Despre noi"}
        </h1>
        <p className="text-body text-secondary-on-dark">
          {bannerSubtitle ?? "Educație prin sport, pentru o viață sănătoasă și activă. Educație pentru sport, în vederea obținerii înaltei performanțe."}
        </p>
      </PageHeroSection>

      <section className="relative z-raised bg-surface section">
        <div className="w-full max-w-content mx-auto gutter">
          {/* Section header */}
          <div className="flex flex-col gap-3 mb-16">
            <p className="text-label uppercase text-accent">
              Despre Club
            </p>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <h2 className="text-heading text-primary max-w-lg">
                {sectionHeading ?? "Peste un deceniu de pasiune și performanță"}
              </h2>
              <p className="text-body-sm text-secondary md:text-right md:max-w-aside">
                {sectionSubheading ?? "De la primii pași pe gheață la podiumuri internaționale."}
              </p>
            </div>
          </div>

          {/* Intro text */}
          <div className="max-w-prose mb-24 flex flex-col gap-4">
            {introParagraphs.map((para, i) => (
              <p key={i} className="text-body text-secondary">
                {para}
              </p>
            ))}
          </div>

          {/* Stats grid — mustard left-stripe cards, number + label side by side */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-24">
            {resolvedStats.map((stat, i) => (
              <Card key={i} padding="sm" className="relative">
                <span className="absolute left-0 top-0 bottom-0 w-1.5 bg-mustard" aria-hidden />
                <Stat value={stat.value} label={stat.label} layout="inline" />
              </Card>
            ))}
          </div>

          {/* Timeline — node dots + year in the left gutter on a navy rail */}
          <div className="flex flex-col gap-3 mb-12">
            <p className="text-label uppercase text-accent">
              Parcurs
            </p>
            <h2 className="text-heading text-primary">
              Momentele cheie
            </h2>
          </div>

          <div className="flex flex-col border-l-retro border-line ml-24">
            {resolvedMilestones.map((milestone, i) => (
              <div key={i} className="relative pb-8 pl-8">
                <span
                  className="absolute -left-[7px] top-1.5 w-3 h-3 bg-rust border-2 border-line-on-dark"
                  aria-hidden
                />
                <span
                  className="text-title absolute -left-[76px] top-0.5 w-[60px] text-right text-primary tabular-nums select-none"
                  aria-hidden
                >
                  {milestone.year}
                </span>
                <h3 className="text-title text-primary mb-0.5">{milestone.title}</h3>
                <p className="text-body-sm text-secondary">{milestone.description}</p>
              </div>
            ))}
          </div>

          {/* Events organized */}
          <div className="mt-24">
            <div className="flex flex-col gap-3 mb-8">
              <p className="text-label uppercase text-accent">
                Evenimente
              </p>
              <h2 className="text-heading text-primary">
                Organizate de ACS EduSport
              </h2>
            </div>
            <ul className="flex flex-col gap-3 max-w-prose">
              {resolvedEventsOrganized.map((event, i) => (
                <li
                  key={i}
                  className="text-body-sm relative pl-6 text-secondary before:absolute before:left-0.5 before:content-['›'] before:font-extrabold before:text-accent"
                >
                  {event}
                </li>
              ))}
            </ul>
          </div>

          {/* Events participated */}
          <div className="mt-16">
            <div className="flex flex-col gap-3 mb-8">
              <h2 className="text-heading text-primary">
                Participări ale sportivilor EduSport
              </h2>
            </div>
            <ul className="flex flex-col gap-3 max-w-prose">
              {resolvedEventsParticipated.map((event, i) => (
                <li
                  key={i}
                  className="text-body-sm relative pl-6 text-secondary before:absolute before:left-0.5 before:content-['›'] before:font-extrabold before:text-accent"
                >
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
