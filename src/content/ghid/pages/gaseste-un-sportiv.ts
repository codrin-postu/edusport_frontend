import type { GhidPage } from "@/lib/ghid/types";

export const gasesteUnSportivPage: GhidPage = {
  slug: "gaseste-un-sportiv",
  title: "Găsește un sportiv",
  lead: "Din **Sportivi** cauți un sportiv după nume, după sezon sau cu filtre, apoi îi deschizi fișa.",
  blocks: [
    {
      t: "steps",
      steps: [
        {
          text: "În meniu, la **Club și școală**, deschide **Sportivi**. Lista arată sportivii sezonului ales la **Sezon**.",
          shot: "sportivi-lista",
          marks: ["sezon"],
        },
        {
          text: "Scrie în căsuța de căutare un nume, un telefon, un e-mail sau un număr. **Filtre** restrânge lista.",
          shot: "sportivi-lista",
          marks: ["cauta", "filtre"],
        },
        { text: "Apasă pe numele sportivului ca să îi deschizi fișa. **Sportivi**, sus în stânga, revine la listă." },
      ],
    },
    {
      t: "p",
      text: "Căutarea ia în calcul și numele părintelui și numărul înscrierii și tolerează o literă greșită.",
    },
    { t: "h2", text: "Filtre și sortare" },
    {
      t: "p",
      text: "**Filtre** are **Secțiune**, **Grupa**, **Abonament**, **Membru A.C.S.**, **Profil public**, **Date**, **Status** și **Posibile dubluri**. Filtrele alese apar ca etichete sub căutare; fiecare se elimină cu x.",
    },
    {
      t: "p",
      text: "Pentru sortare apasă titlul coloanei **Sportiv**, **Vârstă** sau **Grupa**. Pe telefon folosește **Sortare**.",
    },
    {
      t: "p",
      text: "Sportivii marcați inactivi și cei anonimizați nu apar în listă. Îi afișezi din **Filtre**, la **Status**.",
    },
    { t: "h2", text: "Ce arată lista" },
    {
      t: "p",
      text: "Coloana **Membru A.C.S.** arată Da, Nu sau În așteptare, doar de citit. **Profil public** arată Public sau Ascuns.",
    },
    {
      t: "p",
      text: "Un sportiv cu date lipsă are sub nume rândul **Lipsesc:** cu ce lipsește. Sus apare mesajul, de exemplu **5 sportivi au date incomplete.**, cu **Arată-i**, care filtrează lista după ei.",
    },
    { t: "links", items: [{ slug: "adauga-un-sportiv" }, { slug: "fisa-sportivului" }] },
  ],
};
