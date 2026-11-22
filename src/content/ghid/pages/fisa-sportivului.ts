import type { GhidPage } from "@/lib/ghid/types";

export const fisaSportivuluiPage: GhidPage = {
  slug: "fisa-sportivului",
  title: "Fișa sportivului",
  lead: "Fișa strânge într-un loc tot ce știe sistemul despre un sportiv, în opt taburi.",
  blocks: [
    {
      t: "steps",
      steps: [
        {
          text: "În **Sportivi** apasă pe numele sportivului. Fișa se deschide cu taburile sus.",
          shot: "sportivi-fisa",
          marks: ["taburi"],
        },
      ],
    },
    { t: "h2", text: "Sus, lângă nume" },
    {
      t: "p",
      text: "Sub nume sunt data nașterii și grupa principală. **Date incomplete** apare când lipsesc date, iar **Inactiv** când sportivul e marcat inactiv. Butonul **...** deschide acțiunile fișei.",
    },
    {
      t: "p",
      text: "Când sistemul găsește un posibil duplicat, sub nume apare **Posibil același copil cu** numele celuilalt, cu **Unește** și **Nu e același copil**.",
    },
    { t: "h2", text: "Taburile" },
    {
      t: "list",
      items: [
        "**Date**: datele de contact, **Membru A.C.S.** pe sezon (doar de citit), linkurile către **Înscrieri** și cardul **Acces portal**.",
        "**Grupe și abonament**: grupele sportivului, abonamentul curent și prezențele sezonului.",
        "**Plăți**: plățile sportivului, cu **+ Plată**.",
        "**Profil public**: pagina sportivului de pe site și legătura cu rezultatele.",
        "**Documente**: PDF-urile înscrierilor.",
        "**Istoric**: cine a schimbat ce și când. Numărul din tab arată câte intrări are.",
        "**Competiții**: patru casete (**Competiții**, **Podiumuri**, **Cel mai bun loc**, **Cel mai bun scor**) și lista rezultatelor, cu filtru **Toate sezoanele**.",
        "**Parcurs**: insignele sportivului.",
      ],
    },
    {
      t: "p",
      text: "Fără profil public, tabul **Competiții** arată **Nicio competiție.** Sursa rezultatelor e explicată la Competiții.",
    },
    {
      t: "p",
      text: "Un sportiv anonimizat are doar **Date**, **Plăți** și **Istoric**, fără **Editează** și fără meniul **...**. Pe telefon fișa se deschide pe tot ecranul.",
    },
    {
      t: "links",
      items: [
        { slug: "schimba-datele-unui-sportiv" },
        { slug: "documentele-sportivului" },
        { slug: "parcurs-si-insigne" },
        { slug: "profil-public-si-rezultate" },
        { slug: "competitii-si-rezultate" },
      ],
    },
  ],
};
