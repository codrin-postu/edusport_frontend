import type { GhidPage } from "@/lib/ghid/types";

export const inregistreazaPlataPage: GhidPage = {
  slug: "inregistreaza-o-plata",
  title: "Înregistrează o plată",
  lead: "Când un părinte plătește, plata se trece în Contabilitate. Apare imediat în totalul lunii.",
  blocks: [
    {
      t: "steps",
      steps: [
        { text: "Deschide **Contabilitate**, tabul **Plăți**. Apasă **+ Plată**.", shot: "contabilitate-plati", marks: ["plata"] },
        { text: "La **Sportiv** caută și alege sportivul. La **Pentru** alege ce se plătește.", shot: "plati-form", marks: ["cauta", "pentru"] },
        { text: "**Suma** se completează singură când se știe. Verifică-o, verifică **Data** și alege **Metodă**: Numerar, Card (POS) sau Transfer bancar." },
        { text: "Dacă sportivul are e-mail, poți bifa **Trimite e-mail \"Plată înregistrată\"**. În **Notă** scrii ce e nevoie." },
        { text: "Apasă **Înregistrează**. Jos apare mesajul **Plată înregistrată**, cu **Anulează** timp de 8 secunde." },
      ],
    },
    {
      t: "p",
      text: "**+ Plată** mai e la rândul sportivului din **Restanțe**, în fișa sportivului, la tabul **Plăți**, și în **...** de pe rândul sportivului din **Prezență**. Acolo sportivul e deja ales.",
    },
    {
      t: "p",
      text: "La **Pentru** găsești abonamentele sportivului, **Cotizație membru** pe sezon, **Club** pe lună, **Lecție individuală** și **Altceva**. Ele sunt grupate în **De plată**, **Achitate** și **Altele**.",
    },
    { t: "p", text: "Data nu poate fi în viitor, iar suma nu poate depăși restul de plată." },
    { t: "warn", text: "O plată greșită nu se șterge. Se corectează sau se anulează, iar anulată rămâne în listă, tăiată." },
    { t: "links", items: [{ slug: "corecteaza-sau-anuleaza-o-plata" }, { slug: "contabilitate-pe-scurt" }] },
  ],
};
