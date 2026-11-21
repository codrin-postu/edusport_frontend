import type { GhidPage } from "@/lib/ghid/types";

export const fisaSportivuluiPage: GhidPage = {
  slug: "fisa-sportivului",
  title: "Lista și fișa sportivului",
  lead: "Din Sportivi găsești orice sportiv, adaugi unul nou și îi deschizi fișa.",
  blocks: [
    {
      t: "steps",
      steps: [
        { text: "Deschide **Sportivi**, în meniu, la **Club și școală**. Lista arată sportivii sezonului ales la **Sezon**.", shot: "sportivi-lista", marks: ["cauta", "filtre", "adauga-sportiv"] },
        { text: "Caută după nume, telefon, e-mail sau număr. **Filtre** deschide filtrele listei." },
        { text: "Apasă pe un sportiv. Se deschide fișa, cu taburile **Date**, **Grupe și abonament**, **Plăți**, **Profil public**, **Documente**, **Istoric**, **Competiții** și **Parcurs**.", shot: "sportivi-fisa", marks: ["documente", "editeaza"] },
        { text: "Înapoi la listă te duce **Sportivi**, sus în stânga." },
      ],
    },
    {
      t: "p",
      text: "Coloana **Membru A.C.S.** arată Da, Nu sau În așteptare. Un sportiv cu date lipsă are sub nume rândul **Lipsesc:** cu ce lipsește, iar sus apare un mesaj cu **Arată-i**.",
    },
    { t: "h2", text: "Adaugă un sportiv" },
    {
      t: "steps",
      steps: [
        { text: "Apasă **Adaugă sportiv**, sus în dreapta, și caută întâi sportivul în **Caută sportiv**, ca să nu apară de două ori." },
        { text: "Dacă nu e în listă, alege **Sportiv nou**. Completează **Nume complet** și **Data nașterii**, apoi, dacă le ai, **Persoana de contact**, **Telefon** și **E-mail**." },
        { text: "Apasă **Adaugă sportiv**." },
      ],
    },
    { t: "h2", text: "Alte acțiuni" },
    {
      t: "p",
      text: "Butonul **...** din fișă are **Marchează inactiv**, **Unește cu alt sportiv**, **Exportă datele**, **Anonimizează** și **Șterge sportivul**. Un sportiv marcat inactiv nu mai apare în liste, dar istoricul rămâne.",
    },
    {
      t: "warn",
      text: "**Șterge sportivul** șterge și profilul public, rezultatele și sezoanele. Înscrierile rămân, fără legătură cu fișa. Nu se poate anula.",
    },
    { t: "links", items: [{ slug: "actualizeaza-datele-sportivului" }, { slug: "confirma-o-inscriere" }] },
  ],
};
