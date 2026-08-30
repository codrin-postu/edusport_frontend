import React from "react";
import { Mail, MapPin, Phone, ExternalLink } from "lucide-react";
import PageHeroSection from "@/components/blocks/page-hero-section";

// ---------------------------------------------------------------------------
// Section data
// ---------------------------------------------------------------------------

const SECTIONS = [
  {
    number: "1",
    title: "Politica de confidențialitate privind prelucrarea datelor cu caracter personal - 2026",
    content: (
      <p>
        ACS EduSport colectează și prelucrează mai multe categorii de date cu
        caracter personal aparținând persoanelor incluse în programele sale și
        în toate activitățile sportive, în mod expres patinajul artistic, la
        nivel național și internațional. Conform Regulamentului UE 2016/679
        (27 aprilie 2016), organizația se califică drept operator de date cu
        caracter personal.
      </p>
    ),
  },
  {
    number: "2",
    title: "Categorii de date cu caracter personal colectate",
    content: (
      <ul>
        <li>
          <strong>2.1.</strong> Date de identificare: nume, prenume, pseudonim,
          semnătură, adresă, vârstă, data/locul nașterii, sex, telefon, e-mail,
          număr CI, serie CI, pașaport, cetățenie, conturi social media, date
          reprezentant legal, numere de cont bancar, fotografii.
        </li>
        <li>
          <strong>2.2.</strong> Caracteristici fizice: înălțime, greutate.
        </li>
        <li>
          <strong>2.3.</strong> Date privind starea de sănătate.
        </li>
        <li>
          <strong>2.4.</strong> Informații despre educație: școli absolvite,
          cursuri, diplome.
        </li>
        <li>
          <strong>2.5.</strong> Rezultate la competiții.
        </li>
        <li>
          <strong>2.6.</strong> Date de afiliere la club / federație / școală.
        </li>
        <li>
          <strong>2.7.</strong> Imagini de grup sau individuale, statice sau în
          mișcare, surprinse în cadrul evenimentelor organizației.
        </li>
      </ul>
    ),
  },
  {
    number: "3",
    title: "Date cu caracter special",
    content: (
      <p>
        ACS EduSport nu prelucrează date care dezvăluie originea rasială sau
        etnică, opiniile politice, convingerile filosofice, apartenența
        sindicală, date genetice sau biometrice în scopul identificării. Organizația
        prelucrează date privind sănătatea doar cu consimțământul explicit al
        persoanei vizate sau al reprezentantului legal al acesteia.
      </p>
    ),
  },
  {
    number: "4",
    title: "Temeiul legal al prelucrării",
    content: (
      <ul>
        <li>
          <strong>4.1.</strong> Executarea contractului (Art. 6 alin. (1) lit. b
          GDPR).
        </li>
        <li>
          <strong>4.2.</strong> Îndeplinirea obligațiilor legale (Art. 6 alin.
          (1) lit. c GDPR).
        </li>
        <li>
          <strong>4.3.</strong> Consimțământul (Art. 9 alin. (2) lit. a și Art.
          6 alin. (1) lit. a GDPR).
        </li>
      </ul>
    ),
  },
  {
    number: "5",
    title: "Scopul prelucrării datelor cu caracter personal",
    content: (
      <ul>
        <li>
          <strong>5.1.</strong> Executarea contractului pentru facturare,
          cheltuieli, cazare, mese, indemnizații, transport, burse, finanțarea
          sportului de performanță.
        </li>
        <li>
          <strong>5.2.</strong> Transmiterea informațiilor despre cursuri,
          modificări de program, detalii de participare.
        </li>
        <li>
          <strong>5.3.</strong> Distribuirea premiilor la competiții.
        </li>
        <li>
          <strong>5.4.</strong> Examinări medicale și avize pentru sportul de
          performanță.
        </li>
        <li>
          <strong>5.5.</strong> Măsuri de distribuire a echipamentelor.
        </li>
        <li>
          <strong>5.6.</strong> Autorizarea participării la evenimente.
        </li>
        <li>
          <strong>5.7.</strong> Soluționarea solicitărilor instituțiilor publice.
        </li>
        <li>
          <strong>5.8.</strong> Emiterea diplomelor și certificatelor,
          justificarea absențelor.
        </li>
        <li>
          <strong>5.9.</strong> Procurarea documentelor de călătorie.
        </li>
        <li>
          <strong>5.10.</strong> Scopuri statistice.
        </li>
        <li>
          <strong>5.11.</strong> Acces la baze sportive / patinoar.
        </li>
        <li>
          <strong>5.12.</strong> Abonamente cursuri și plăți fiscale.
        </li>
        <li>
          <strong>5.13.</strong> Selecția sportivilor pentru grupe de antrenament
          și statistici de performanță.
        </li>
        <li>
          <strong>5.14.</strong> Date ale reprezentanților legali pentru sportivii
          minori.
        </li>
        <li>
          <strong>5.15.</strong> Utilizarea imaginilor în scopuri promoționale,
          înregistrare la competiții, publicitate prin sponsorizare, pe durată
          nelimitată.
        </li>
      </ul>
    ),
  },
  {
    number: "6",
    title: "Utilizarea înregistrărilor foto și video",
    content: (
      <ul>
        <li>
          <strong>6.1.</strong> Publicare pe site-ul web și paginile de social
          media administrate (Facebook, Google+, YouTube, Instagram, Twitter).
        </li>
        <li>
          <strong>6.2.</strong> Transfer către terți (presă / companii de
          publicitate) în scopuri publicitare.
        </li>
        <li>
          <strong>6.3.</strong> Publicare în spațiile sportive pentru
          promovarea activității.
        </li>
        <li>
          <strong>6.4.</strong> Publicare pe terminal video / online în cadrul
          competițiilor.
        </li>
        <li>
          <strong>6.5.</strong> Publicare în materiale tipărite (cataloage,
          flyere).
        </li>
        <li>
          <strong>6.6.</strong> Înregistrări de securitate și supraveghere.
        </li>
        <li>
          <strong>6.7.</strong> Înregistrări video pentru securitatea
          informațiilor.
        </li>
        <li>
          <strong>6.8.</strong> Înregistrări de transmisii televizate.
        </li>
        <li>
          <strong>6.9.</strong> Înregistrări audio de transmisii radio.
        </li>
      </ul>
    ),
  },
  {
    number: "7",
    title: "Destinatarii datelor",
    content: (
      <ul>
        <li>
          <strong>7.1.</strong> Personalul ACS EduSport, organele superioare,
          titularii contractelor de sponsorizare.
        </li>
        <li>
          <strong>7.2.</strong> Instituții publice implicate direct sau indirect.
        </li>
        <li>
          <strong>7.3.</strong> Federații de specialitate.
        </li>
        <li>
          <strong>7.4.</strong> Furnizori de servicii medicale.
        </li>
        <li>
          <strong>7.5.</strong> Furnizori de bunuri / servicii.
        </li>
        <li>
          <strong>7.6.</strong> Furnizori de activități de formare.
        </li>
        <li>
          <strong>7.7.</strong> Alți furnizori de bunuri / servicii în cadrul
          contractelor comerciale.
        </li>
        <li>
          <strong>7.8.</strong> Autorități de stat în cazul incidentelor de
          securitate.
        </li>
      </ul>
    ),
  },
  {
    number: "8",
    title: "Transferul datelor cu caracter personal",
    content: (
      <ul>
        <li>
          <strong>8.1.</strong> Companii din grup și terți (Federații, ONG-uri)
          care organizează evenimente sportive, tabere, antrenamente.
        </li>
        <li>
          <strong>8.2.</strong> Autorități de stat (instanțe, autorități
          fiscale), instituții cu interese legitime.
        </li>
        <li>
          <strong>8.3.</strong> Servicii externe de contabilitate.
        </li>
        <li>
          <strong>8.4.</strong> Unități de cazare.
        </li>
        <li>
          <strong>8.5.</strong> Companii de publicitate.
        </li>
        <li>
          <strong>8.6.</strong> Publicare online.
        </li>
      </ul>
    ),
  },
  {
    number: "9",
    title: "Durata de stocare a datelor cu caracter personal",
    content: (
      <>
        <ul>
          <li>
            <strong>9.1.</strong> Pe durata valabilității contractului și a
            soluționării litigiilor, conform legislației aplicabile.
          </li>
          <li>
            <strong>9.2.</strong> Pe durata necesară conformării cu autorizările
            medicale.
          </li>
          <li>
            <strong>9.3.</strong> Date de plată / facturare conform Legii 82/1991
            (Legea contabilității).
          </li>
          <li>
            <strong>9.4.</strong> Imagini de grup sau individuale, statice sau
            dinamice - stocare nelimitată.
          </li>
          <li>
            <strong>9.5.</strong> Pe durata obligației legale sau a altui temei
            legal justificativ, conform cerințelor Art. 5 GDPR.
          </li>
        </ul>
        <p className="mt-4">
          Stocarea extinsă se realizează în scopuri de arhivare în interes
          public, libertatea de exprimare / informare, obligații legale și
          exercitarea / apărarea pretențiilor în instanță. Se aplică măsuri
          de securitate adecvate (pseudonimizare, izolarea bazelor de date,
          criptare, controlul accesului).
        </p>
      </>
    ),
  },
  {
    number: "10",
    title: "Obligațiile și drepturile operatorului",
    content: (
      <ul>
        <li>
          <strong>10.1.</strong> Responsabilitate deplină pentru conformitatea cu
          GDPR din 25 mai 2018; se aplică cerințele Ordinului 52/2002 acolo
          unde este cazul.
        </li>
        <li>
          <strong>10.2.</strong> Măsuri implementate pentru prevenirea utilizării,
          reproducerii, dezvăluirii, transferului sau publicării neautorizate a
          datelor.
        </li>
        <li>
          <strong>10.3.</strong> Personalul informat cu privire la drepturi și
          obligații conform GDPR, cu notificarea corespunzătoare privind
          gestionarea datelor clienților.
        </li>
      </ul>
    ),
  },
  {
    number: "11",
    title: "Drepturile persoanei vizate",
    content: (
      <ul>
        <li>
          <strong>11.1.</strong> Dreptul de acces la date.
        </li>
        <li>
          <strong>11.2.</strong> Dreptul la rectificare.
        </li>
        <li>
          <strong>11.3.</strong> Dreptul la ștergere (&bdquo;dreptul de a fi uitat&rdquo;).
        </li>
        <li>
          <strong>11.4.</strong> Dreptul de retragere a consimțământului.
        </li>
        <li>
          <strong>11.5.</strong> Dreptul la restricționarea prelucrării.
        </li>
        <li>
          <strong>11.6.</strong> Dreptul la portabilitatea datelor.
        </li>
        <li>
          <strong>11.7.</strong> Dreptul la opoziție.
        </li>
        <li>
          <strong>11.8.</strong> Dreptul de a nu face obiectul unei decizii
          bazate exclusiv pe prelucrare automatizată, inclusiv profilare cu
          efecte juridice.
        </li>
        <li>
          <strong>11.9.</strong> Dreptul de a depune plângeri la ACS EduSport /
          autoritatea competentă.
        </li>
        <li>
          <strong>11.10.</strong> Dreptul la recurs judiciar.
        </li>
        <li>
          <strong>11.11.</strong> Dreptul de a solicita încetarea prelucrării
          datelor în scopuri de marketing direct.
        </li>
      </ul>
    ),
  },
  {
    number: "12",
    title: "Dispoziții finale",
    content: (
      <p>
        ACS EduSport garantează prelucrarea legitimă a datelor cu măsuri
        tehnice și organizatorice adecvate, asigurând integritatea și
        confidențialitatea conform Art. 25 și 32 GDPR. Utilizarea informațiilor
        personale este limitată la scopurile declarate. Prelucrarea se
        realizează prin mijloace automatizate și manuale.
      </p>
    ),
  },
] as const;

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

const ProtectiaDatelor: React.FC = () => {
  return (
    <div className="min-h-screen bg-retro-cream">
      <PageHeroSection
        title={["GDPR"]}
        breadcrumb={[{ label: "Protecția datelor" }]}
      >
        <h1 className="font-display text-display-md font-extrabold text-retro-cream leading-[1.05] tracking-[-0.5px]">
          Protecția Datelor
        </h1>
        <p className="text-retro-cream/70 text-base max-w-lg">
          Politica de confidențialitate privind prelucrarea datelor cu caracter
          personal a Asociației Club Sportiv EduSport.
        </p>
      </PageHeroSection>

      <section className="relative z-10 bg-retro-cream py-16 md:py-24">
        <div className="w-full max-w-content mx-auto px-4 md:px-8 lg:px-12">
          {/* Section header */}
          <div className="flex flex-col gap-3 mb-16">
            <p className="text-eyebrow font-bold uppercase text-rust">
              GDPR
            </p>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <h2 className="font-display text-display-sm font-extrabold text-navy leading-[1.05] tracking-[-0.4px] max-w-xl">
                Politica de Confidențialitate
              </h2>
              <p className="text-sm text-navy/50 md:text-right md:max-w-xs">
                Conform Regulamentului UE 2016/679 (GDPR)
              </p>
            </div>
          </div>

          {/* Sections */}
          <div className="flex flex-col gap-12 max-w-3xl">
            {SECTIONS.map((section) => (
              <div key={section.number}>
                <h3 className="text-lg font-bold text-navy mb-4">
                  <span className="font-display text-rust mr-2">
                    {section.number}.
                  </span>
                  {section.title}
                </h3>
                <div className="text-sm text-navy/70 leading-relaxed [&_p]:leading-relaxed [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-2 [&_li]:relative [&_li]:pl-5 [&_li]:before:absolute [&_li]:before:left-0.5 [&_li]:before:content-['›'] [&_li]:before:font-extrabold [&_li]:before:text-rust [&_strong]:font-bold [&_strong]:text-navy">
                  {section.content}
                </div>
              </div>
            ))}
          </div>

          {/* Contact card */}
          <div className="mt-16 pt-12 border-t-[1.5px] border-navy/12">
            <div className="relative overflow-hidden bg-navy border-[1.5px] border-navy shadow-[8px_8px_0_rgb(14_26_60_/_0.16)] px-8 py-10 md:px-14 md:py-12">
              <span className="absolute inset-x-0 top-0 h-1.5 bg-rust" aria-hidden />
              {/* Decorative circles */}
              <div className="pointer-events-none absolute -top-8 -right-8 w-48 h-48 rounded-full opacity-[0.06] bg-mustard" />
              <div className="pointer-events-none absolute -bottom-6 -left-6 w-32 h-32 rounded-full opacity-[0.05] bg-retro-cream" />

              <div className="relative flex flex-col gap-6">
                <div>
                  <p className="text-eyebrow font-bold uppercase text-mustard mb-3">
                    Responsabil protecția datelor
                  </p>
                  <p className="text-retro-cream text-base leading-relaxed max-w-xl">
                    Pentru orice întrebări legate de prelucrarea datelor cu
                    caracter personal, ne puteți contacta la:
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="mailto:edusporttrophy@gmail.com"
                    className="inline-flex items-center gap-2 text-sm text-retro-cream/80 hover:text-mustard transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    edusporttrophy@gmail.com
                  </a>
                  <span className="hidden sm:block text-retro-cream/20">|</span>
                  <span className="inline-flex items-center gap-2 text-sm text-retro-cream/80">
                    <MapPin className="w-4 h-4 shrink-0" />
                    str. Slt. Stănescu Gheorghe, nr. 1, bl. 213, sc. A, et. 10,
                    ap. 42, sect. 2, București
                  </span>
                </div>

                <div className="border-t-[1.5px] border-retro-cream/15 pt-5">
                  <p className="text-eyebrow font-bold uppercase text-mustard mb-3">
                    Autoritatea de supraveghere
                  </p>
                  <p className="text-sm text-retro-cream/80 leading-relaxed">
                    Autoritatea Națională de Supraveghere a Prelucrării Datelor
                    cu Caracter Personal
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 mt-2">
                    <span className="inline-flex items-center gap-2 text-sm text-retro-cream/60">
                      <MapPin className="w-4 h-4 shrink-0" />
                      B-dul G-ral. Gheorghe Magheru 28-30, Sector 1, București
                    </span>
                    <span className="hidden sm:block text-retro-cream/20">|</span>
                    <span className="inline-flex items-center gap-2 text-sm text-retro-cream/60">
                      <Phone className="w-4 h-4 shrink-0" />
                      +40.318.059.211
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 mt-2">
                    <a
                      href="mailto:anspdcp@dataprotection.ro"
                      className="inline-flex items-center gap-2 text-sm text-retro-cream/60 hover:text-mustard transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                      anspdcp@dataprotection.ro
                    </a>
                    <span className="hidden sm:block text-retro-cream/20">|</span>
                    <a
                      href="https://www.dataprotection.ro"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-retro-cream/60 hover:text-mustard transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      www.dataprotection.ro
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProtectiaDatelor;
