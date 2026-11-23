import type { GhidPage } from "@/lib/ghid/types";

export const emailuriAutomatePage: GhidPage = {
  slug: "e-mailuri-automate",
  title: "E-mailuri automate",
  lead: "Ce primesc părinții și antrenorii fără să trimită nimeni nimic de mână.",
  blocks: [
    { t: "h2", text: "Părinții" },
    {
      t: "list",
      items: [
        "**Înscrierea primită**, cu PDF-ul, la e-mailul din formular.",
        "**Acces la portalul EduSport**, invitația, cu link valabil 7 zile.",
        "**Acces nou în portalul EduSport**, când se adaugă un copil în contul lor.",
        "**Codul pentru parola nouă**, valabil 10 minute.",
        "**Încercări de intrare în cont**, după 5 parole greșite.",
        "**Intrare de pe un dispozitiv nou**, cel mult unul pe oră.",
        "Un mesaj către adresa veche și către cea nouă, când se schimbă e-mailul contului.",
        "**Plată înregistrată**: se trimite la 15 secunde după înregistrare, ca o anulare imediată să-l oprească, la e-mailul de contact al sportivului. Acesta poate fi altul decât cel al contului din portal.",
      ],
    },
    { t: "h2", text: "Schimbările de program" },
    {
      t: "p",
      text: "Un mesaj pleacă doar dacă cel care face schimbarea bifează **Anunță părinții pe e-mail**, iar contul părintelui nu a oprit **E-mail la schimbări de program**.",
    },
    { t: "h2", text: "Antrenorii" },
    {
      t: "list",
      items: [
        "Invitația în portal și codul pentru parola nouă.",
        "**Încercări de intrare în cont** și **Intrare de pe un dispozitiv nou**.",
        "Un mesaj către adresa veche și cea nouă, când adresa contului se schimbă.",
        "La un cont care este și de părinte: **Poți intra și pe** adresa celuilalt portal **cu același cont.**",
      ],
    },
    { t: "h2", text: "Ce nu se trimite" },
    {
      t: "p",
      text: "Nu există mesaje automate pentru reamintirea abonamentului, suma lunară de plătit sau reamintirea prezenței.",
    },
    {
      t: "links",
      items: [{ slug: "invita-un-parinte-in-portal" }, { slug: "parintele-nu-poate-intra" }, { slug: "anuleaza-sau-muta-o-sedinta" }],
    },
  ],
};
