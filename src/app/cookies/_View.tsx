import React from "react";
import { Mail, ExternalLink } from "lucide-react";
import PageHeroSection from "@/components/blocks/page-hero-section";

// ---------------------------------------------------------------------------
// Section data
//
// This policy describes what the site actually does, verified against the
// running application rather than copied from a template. As of septembrie
// 2026 the site sets no cookies for visitors: analytics is cookieless and the
// only embedded third party is served from youtube-nocookie.com. If a service
// that does set cookies is ever added (Google Analytics, Meta Pixel, a plain
// youtube.com embed), this page and the consent handling must change with it.
// ---------------------------------------------------------------------------

const SECTIONS = [
  {
    number: "1",
    title: "Ce sunt cookie-urile",
    content: (
      <p>
        Cookie-urile sunt fișiere text de mici dimensiuni pe care un site le
        poate salva în browserul tău atunci când îl vizitezi. Ele sunt folosite
        în general pentru a reține preferințe, pentru a menține o sesiune activă
        sau pentru a urmări comportamentul vizitatorilor între site-uri
        diferite.
      </p>
    ),
  },
  {
    number: "2",
    title: "Acest site nu folosește cookie-uri de urmărire",
    content: (
      <>
        <p>
          Nu instalăm cookie-uri de publicitate, de profilare sau de urmărire.
          Nu folosim Google Analytics, nu avem pixeli de rețele sociale și nu
          vindem sau transmitem date despre navigarea ta către terți în scopuri
          de marketing.
        </p>
        <p>
          În mod normal, o vizită obișnuită pe acest site nu salvează niciun
          cookie în browserul tău.
        </p>
      </>
    ),
  },
  {
    number: "3",
    title: "Statistici de trafic fără cookie-uri",
    content: (
      <>
        <p>
          Pentru a înțelege câți vizitatori are site-ul și ce pagini sunt
          citite, folosim Umami, o soluție de statistici găzduită pe serverul
          nostru. Umami nu folosește cookie-uri și nu creează un profil al
          vizitatorului.
        </p>
        <ul>
          <li>
            Datele rămân pe infrastructura noastră și nu sunt partajate cu
            platforme de publicitate.
          </li>
          <li>
            Se rețin informații agregate: pagina vizitată, tipul de dispozitiv,
            țara și sursa vizitei.
          </li>
          <li>
            Nu se rețin adresa IP completă și nu se poate identifica o persoană
            anume pe baza acestor statistici.
          </li>
        </ul>
      </>
    ),
  },
  {
    number: "4",
    title: "Conținut video încorporat",
    content: (
      <>
        <p>
          Unele pagini afișează materiale video găzduite pe YouTube. Folosim
          varianta fără cookie-uri oferită de YouTube
          (youtube-nocookie.com), astfel încât redarea unui material nu
          instalează cookie-uri de urmărire în browserul tău.
        </p>
        <p>
          Trebuie totuși să știi că, în momentul în care o pagină cu material
          video se încarcă, adresa ta IP este transmisă către serverele Google,
          pentru că fișierul video vine de la ele. Este o consecință tehnică a
          afișării unui video găzduit extern, nu o alegere de urmărire din
          partea noastră.
        </p>
      </>
    ),
  },
  {
    number: "5",
    title: "Cookie strict necesar pentru administrare",
    content: (
      <p>
        Un singur cookie tehnic poate fi generat, exclusiv pentru persoanele
        care administrează conținutul site-ului. Când un editor deschide
        previzualizarea unui articol nepublicat, aplicația salvează temporar un
        cookie de sesiune care îi permite să vadă varianta needitată. Acest
        cookie nu apare niciodată pentru vizitatorii obișnuiți, nu conține date
        personale și nu este folosit pentru statistici sau publicitate.
      </p>
    ),
  },
  {
    number: "6",
    title: "Cum controlezi cookie-urile",
    content: (
      <>
        <p>
          Pentru că site-ul nu instalează cookie-uri de urmărire, nu îți cerem
          un consimțământ pentru ele și nu vei vedea o fereastră de acceptare.
          Poți oricând să ștergi sau să blochezi cookie-urile din setările
          browserului tău.
        </p>
        <ul>
          <li>
            <strong>Chrome:</strong> Setări, Confidențialitate și securitate,
            Cookie-uri și alte date ale site-urilor.
          </li>
          <li>
            <strong>Firefox:</strong> Setări, Confidențialitate și securitate,
            Cookie-uri și date ale site-urilor.
          </li>
          <li>
            <strong>Safari:</strong> Preferințe, Confidențialitate, Gestionare
            date site-uri web.
          </li>
          <li>
            <strong>Edge:</strong> Setări, Cookie-uri și permisiuni pentru
            site-uri.
          </li>
        </ul>
        <p>
          Blocarea completă a cookie-urilor nu afectează în niciun fel
          funcționarea acestui site pentru vizitatori.
        </p>
      </>
    ),
  },
  {
    number: "7",
    title: "Modificări ale acestei politici",
    content: (
      <p>
        Dacă vom adăuga în viitor servicii care folosesc cookie-uri, vom
        actualiza această pagină și vom cere consimțământul tău înainte ca acele
        cookie-uri să fie instalate. Această versiune a politicii este valabilă
        din septembrie 2026.
      </p>
    ),
  },
] as const;

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

const PoliticaCookies: React.FC = () => {
  return (
    <div className="min-h-screen bg-retro-cream">
      <PageHeroSection
        title={["COOKIES"]}
        breadcrumb={[{ label: "Politica de cookies" }]}
      >
        <h1 className="font-display text-display-md font-extrabold text-retro-cream leading-[1.05] tracking-[-0.5px]">
          Politica de Cookies
        </h1>
        <p className="text-retro-cream/70 text-base max-w-lg">
          Ce se salvează în browserul tău atunci când vizitezi site-ul
          Asociației Club Sportiv EduSport. Pe scurt: nimic.
        </p>
      </PageHeroSection>

      <section className="relative z-10 bg-retro-cream py-16 md:py-24">
        <div className="w-full max-w-content mx-auto px-4 md:px-8 lg:px-12">
          {/* Section header */}
          <div className="flex flex-col gap-3 mb-16">
            <p className="text-eyebrow font-bold uppercase text-rust">
              Cookies
            </p>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <h2 className="font-display text-display-sm font-extrabold text-navy leading-[1.05] tracking-[-0.4px] max-w-xl">
                Site fără cookie-uri de urmărire
              </h2>
              <p className="text-sm text-navy/50 md:text-right md:max-w-xs">
                Actualizată în septembrie 2026
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
                <div className="text-sm text-navy/70 leading-relaxed [&_p]:leading-relaxed [&_p+p]:mt-3 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-2 [&_ul]:mt-3 [&_li]:relative [&_li]:pl-5 [&_li]:before:absolute [&_li]:before:left-0.5 [&_li]:before:content-['›'] [&_li]:before:font-extrabold [&_li]:before:text-rust [&_strong]:font-bold [&_strong]:text-navy">
                  {section.content}
                </div>
              </div>
            ))}
          </div>

          {/* Contact card */}
          <div className="mt-16 pt-12 border-t-[1.5px] border-navy/12">
            <div className="relative overflow-hidden bg-navy border-[1.5px] border-navy shadow-[8px_8px_0_rgb(14_26_60_/_0.16)] px-8 py-10 md:px-14 md:py-12">
              <span className="absolute inset-x-0 top-0 h-1.5 bg-rust" aria-hidden />
              <div className="pointer-events-none absolute -top-8 -right-8 w-48 h-48 rounded-full opacity-[0.06] bg-mustard" />
              <div className="pointer-events-none absolute -bottom-6 -left-6 w-32 h-32 rounded-full opacity-[0.05] bg-retro-cream" />

              <div className="relative flex flex-col gap-6">
                <div>
                  <p className="text-eyebrow font-bold uppercase text-mustard mb-3">
                    Întrebări despre datele tale
                  </p>
                  <p className="text-retro-cream text-base leading-relaxed max-w-xl">
                    Pentru orice nelămurire legată de cookie-uri sau de
                    prelucrarea datelor cu caracter personal, ne poți scrie:
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
                  <a
                    href="/protectia-datelor"
                    className="inline-flex items-center gap-2 text-sm text-retro-cream/80 hover:text-mustard transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Politica de confidențialitate
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PoliticaCookies;
