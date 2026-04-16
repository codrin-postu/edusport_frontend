// ---------------------------------------------------------------------------
// Cursuri page data — fallback used when Strapi is unreachable
// ---------------------------------------------------------------------------

import type { CoursePageContent } from "./_types";
export type { PriceItem, PricingTier } from "./_types_pricing";

export const CURRENT_SEASON = "Octombrie 2025 - Mai 2026";

export const IS_REGISTRATION_OPEN = true;

export const CURSURI_PAGE_DATA: CoursePageContent = {
  banner: {
    title: "Școala de Patinaj",
    scheduleDays: "Sâmbătă & Duminică",
    scheduleTimes: "10:00–10:50 & 11:00–11:50",
    locationName: "AFI Palace Cotroceni",
    locationUrl: "https://maps.app.goo.gl/gmrERwQePvxYY6zx6",
  },
  aboutSection: {
    eyebrow: "Scoala de Patinaj",
    heading: "Patinaj pentru toți, ghidați de campioni",
    content:
      "Organizată anual în perioada octombrie – mai de foști sportivi de performanță, Școala de Patinaj EduSport oferă cursuri structurate pe mai multe niveluri — de la primii pași până la avansați.\n\nCei mai talentați cursanți pot fi selectați pentru spectacole și demonstrații de patinaj artistic sau pentru a continua pregătirea în cadrul Clubului Sportiv EduSport.",
    locationBullet: "Patinoarul Cotroceni On Ice, AFI Palace Cotroceni",
    levelsBullet:
      "Grupe pentru toate nivelurile: primii pași, începători, intermediari, avansați",
    coachesBullet:
      "Antrenori - foști sportivi de performanță si şi atleţi pasionaţi de patinaj",
    videoUrl: "https://www.youtube.com/watch?v=G-0eleYxj2w",
    videoLabel: "Cum arată cursurile noastre",
  },
  promoCard: {
    eyebrow: "De ce să devii",
    title: "Membru Club Sportiv EduSport",
    description:
      "Ca membru al Clubului Sportiv EduSport beneficiezi de tarife preferențiale la toate cursurile de patinaj pe durata întregului sezon.",
    subscriptionInfoTitle: "Informații abonamente",
    subscriptionBullets: [
      "50 de minute / ședință",
      "Abonamentele sunt valabile 4 săptămâni de la prima ședință. Dacă perioada se suprapune cu un weekend fără cursuri, valabilitatea se prelungește cu o săptămână.",
      "Ședințele neefectuate nu se pot reporta sau recupera.",
    ],
  },
  infoSection: {
    sectionLabel: "Ce trebuie să știi",
    tips: [
      "Înscrierea la cursuri se face completând formularul pe site, în limita locurilor disponibile pentru fiecare modul/grupă.",
      "În timpul cursurilor, copilul trebuie să fie echipat în ținută sport/echipament de patinaj artistic și să aibă obligatoriu mănuși.",
      "Intrarea pe patinoar se face doar pe baza abonamentului.",
      "Abonamentul este valabil 4 săptămâni de la efectuarea primei ședințe. Dacă perioada se suprapune cu un weekend fără cursuri, valabilitatea se prelungește cu încă o săptămână.",
      "În cazul în care copilul nu se prezintă la cursuri, ședințele achitate și neefectuate NU se pot recupera.",
    ],
    closingLine: "Ne vedem pe gheață! — Echipa Școlii de Patinaj EduSport",
  },
};
