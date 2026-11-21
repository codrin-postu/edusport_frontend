import type { GhidPage } from "@/lib/ghid/types";

export const inregistreazaPlataPage: GhidPage = {
  slug: "inregistreaza-o-plata",
  title: "Înregistrează o plată",
  lead: "Când un părinte plătește, plata se trece în Contabilitate. Apare imediat în totalul lunii.",
  blocks: [
    {
      t: "steps",
      steps: [
        { text: "Deschide **Contabilitate**, tabul **Plăți**. Apasă **+ Plată**.", shot: "contabilitate-plati" },
        { text: "Caută sportivul. La **Pentru** alege ce se plătește, de exemplu abonamentul.", shot: "plati-form" },
        { text: "**Suma** se completează singură când se știe. Verifică-o, verifică **Data** și alege **Metodă**: Numerar, Card (POS) sau Transfer bancar." },
        { text: "Dacă sportivul are e-mail, poți bifa **Trimite e-mail \"Plată înregistrată\"**. În **Notă** scrii ce e nevoie." },
        { text: "Apasă **Înregistrează**. Jos apare mesajul **Plată înregistrată**, cu **Anulează** timp de 8 secunde." },
      ],
    },
    { t: "p", text: "Data nu poate fi în viitor, iar suma nu poate depăși restul de plată." },
    { t: "warn", text: "O plată greșită nu se șterge. Se anulează și rămâne în listă, tăiată." },
    { t: "links", items: [{ slug: "anuleaza-o-plata" }, { slug: "contabilitate" }] },
  ],
};
