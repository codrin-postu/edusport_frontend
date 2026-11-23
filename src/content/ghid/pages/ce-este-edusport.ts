import type { GhidPage } from "@/lib/ghid/types";

export const ceEsteEdusportPage: GhidPage = {
  slug: "ce-este-edusport",
  title: "Ce este EduSport",
  lead: "Părțile EduSport și legătura dintre ele.",
  blocks: [
    { t: "p", text: "EduSport reunește site-ul clubului, evidența sportivilor și activitatea antrenorilor." },
    { t: "h2", text: "Cele patru părți" },
    {
      t: "list",
      items: [
        "**Site-ul public**: programul, prețurile, articolele și formularele de înscriere ale clubului.",
        "**Panoul de administrare**: locul de lucru al administratorilor, cu sportivii, grupele, prezența, contabilitatea și paginile site-ului.",
        "**Portalul antrenorului**: antrenorul vede ședințele zilei, completează prezența, adaugă ședințe și lecții individuale și își vede grupele, competițiile și istoricul.",
        "**Portalul sportivului**: părintele (sau sportivul major) vede calendarul, prezențele, parcursul și plățile. Competițiile apar la sportivii de performanță.",
      ],
    },
    { t: "h2", text: "Legătura dintre părți" },
    {
      t: "p",
      text: "O înscriere trimisă de pe site ajunge în panou, la **Înscrieri**. Prezența completată de antrenor se vede în portalul sportivului.",
    },
    { t: "links", items: [{ slug: "intra-in-panou" }, { slug: "siguranta" }] },
  ],
};
