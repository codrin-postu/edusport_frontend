import type { GhidPage } from "@/lib/ghid/types";

export const ceEsteEdusportPage: GhidPage = {
  slug: "ce-este-edusport",
  title: "Ce este EduSport",
  lead: "Ce este EduSport și cum se leagă părțile lui.",
  blocks: [
    { t: "p", text: "EduSport ține la un loc site-ul clubului, evidența sportivilor și lucrul antrenorilor." },
    { t: "h2", text: "Cele patru părți" },
    {
      t: "list",
      items: [
        "**Site-ul public**: programul, prețurile, articolele și formularele de înscriere ale clubului.",
        "**Panoul de administrare**: aici lucrează administratorii. Are sportivii, grupele, prezența, contabilitatea și paginile site-ului.",
        "**Portalul antrenorului**: antrenorul vede antrenamentele de azi, completează prezența, adaugă antrenamente și lecții individuale și își vede grupele, concursurile și istoricul.",
        "**Portalul sportivului**: părintele (sau sportivul de peste 18 ani) vede calendarul, prezențele, parcursul și plățile. Concursurile apar pentru sportivii de performanță.",
      ],
    },
    { t: "h2", text: "Cum se leagă" },
    {
      t: "p",
      text: "O înscriere trimisă de pe site ajunge în panou, la **Înscrieri**. Prezența completată de antrenor se vede în portalul sportivului.",
    },
    { t: "links", items: [{ slug: "intra-in-panou" }, { slug: "siguranta" }] },
  ],
};
