import type { GhidPage } from "@/lib/ghid/types";

export const unesteMarcheazaStergePage: GhidPage = {
  slug: "uneste-marcheaza-inactiv-sau-sterge-un-sportiv",
  title: "Unește, marchează inactiv sau șterge un sportiv",
  lead: "Acțiunile care privesc un sportiv întreg sunt în meniul **...** din fișă.",
  blocks: [
    {
      t: "p",
      text: "Meniul are **Marchează inactiv** (sau **Marchează activ**), **Unește cu alt sportiv**, **Exportă datele**, **Anonimizează** și **Șterge sportivul**. **Anonimizează** apare doar pentru Super Admin.",
    },
    { t: "h2", text: "Unește cu alt sportiv" },
    { t: "p", text: "Se folosește când același sportiv are două fișe. Una se păstrează, cealaltă se șterge." },
    {
      t: "steps",
      steps: [
        {
          text: "Deschide fișa care se păstrează. Apasă **...** (1), apoi **Unește cu alt sportiv** (2).",
          shot: "sportivi-meniu",
          marks: ["meniu", "uneste"], numbered: true,
        },
        { text: "Scrie numele celuilalt sportiv în **Caută sportiv** și apasă pe el." },
        {
          text: "Cele două fișe apar una lângă alta. La **Rămâne** bifează fișa care se păstrează.",
          shot: "sportivi-unire",
          marks: ["ramane"],
        },
        {
          text: "Pe rândurile colorate datele diferă. Pe fiecare bifează valoarea care rămâne. **Profil public** și **Înscrieri** sunt doar de citit.",
          shot: "sportivi-unire",
          marks: ["randuri"],
        },
        {
          text: "Apasă **Unește**. La **Unești cele două fișe?** apasă încă o dată **Unește**.",
          shot: "sportivi-unire",
          marks: ["uneste"],
        },
      ],
    },
    {
      t: "p",
      text: "Dacă schimbi **Rămâne**, alegerile de pe rânduri se resetează.",
    },
    {
      t: "p",
      text: "La fișa păstrată trec înscrierile, grupele, prezențele, abonamentele, plățile, parcursul și istoricul. Dacă doar cealaltă fișă are profil public, profilul trece la fișa păstrată. Dacă au amândouă, rămâne cel al fișei păstrate.",
    },
    {
      t: "p",
      text: "Un posibil duplicat apare și sub numele sportivului, ca **Posibil același copil cu** numele celuilalt. **Unește** deschide aceeași fereastră, cu celălalt sportiv ales. **Nu e același copil** ascunde mesajul. La **Filtre**, **Posibile dubluri** le arată pe toate.",
    },
    { t: "warn", text: "**Unește** nu se poate anula. Cealaltă fișă se șterge." },
    { t: "h2", text: "Marchează inactiv" },
    {
      t: "steps",
      steps: [
        {
          text: "În fișă apasă **...** (1), apoi **Marchează inactiv** (2).",
          shot: "sportivi-meniu",
          marks: ["meniu", "inactiv"], numbered: true,
        },
        { text: "La **Marchezi sportivul ca inactiv?** apasă **Marchează inactiv**." },
      ],
    },
    {
      t: "p",
      text: "Sportivul nu mai apare în liste, istoricul rămâne, iar lângă nume apare **Inactiv**. Îl găsești la **Filtre**, **Status**. **Marchează activ**, din același meniu, îl reactivează imediat, fără confirmare.",
    },
    { t: "h2", text: "Șterge sportivul" },
    {
      t: "steps",
      steps: [
        {
          text: "În fișă apasă **...** (1), apoi **Șterge sportivul** (2).",
          shot: "sportivi-meniu",
          marks: ["meniu", "sterge"], numbered: true,
        },
        { text: "Dacă sportivul are plăți sau abonamente, apare un mesaj că nu se poate șterge, de exemplu **Sportivul are 2 plăți și 1 abonament, deci nu se poate șterge.**" },
        { text: "Plățile anulate se numără și ele. Apasă **Renunță**." },
        { text: "În caz contrar apare **Ștergi sportivul?**. Apasă **Șterge definitiv**; se revine la listă." },
      ],
    },
    {
      t: "warn",
      text: "**Șterge sportivul** șterge și profilul public, rezultatele și sezoanele. Înscrierile rămân, fără legătură cu fișa. Nu se poate anula.",
    },
    {
      t: "links",
      items: [{ slug: "exporta-datele-unui-sportiv" }, { slug: "anonimizeaza-un-sportiv" }, { slug: "sportivi-inactivi" }, { slug: "fisa-sportivului" }],
    },
  ],
};
