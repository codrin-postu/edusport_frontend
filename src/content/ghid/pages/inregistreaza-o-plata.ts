import type { GhidPage } from "@/lib/ghid/types";

export const inregistreazaPlataPage: GhidPage = {
  slug: "inregistreaza-o-plata",
  title: "Înregistrează o plată",
  lead: "Plata unui părinte se înregistrează în Contabilitate și apare imediat în totalul lunii.",
  blocks: [
    {
      t: "steps",
      steps: [
        { text: "Deschide **Contabilitate**, tabul **Plăți**. Apasă **+ Plată**.", shot: "contabilitate-plati", marks: ["plata"] },
        { text: "La **Sportiv** (1) caută și alege sportivul. La **Pentru** (2) alege ce se plătește.", shot: "plati-form", marks: ["cauta", "pentru"], numbered: true },
        { text: "**Suma** se completează automat când este cunoscută. Verifică-o, verifică **Data** și alege **Metodă**: Numerar, Card (POS) sau Transfer bancar." },
        { text: "Dacă sportivul are e-mail, poți bifa **Trimite e-mail \"Plată înregistrată\"**. În **Notă** poți adăuga detalii." },
        { text: "Apasă **Înregistrează**. Jos apare mesajul **Plată înregistrată**, cu **Anulează** timp de 8 secunde." },
      ],
    },
    {
      t: "p",
      text: "**+ Plată** există și pe rândul sportivului din **Restanțe**, în fișa sportivului, la tabul **Plăți**, și în **...** de pe rândul sportivului din **Prezență**. De acolo, sportivul este deja ales.",
    },
    {
      t: "p",
      text: "La **Pentru** găsești abonamentele sportivului, **Cotizație membru** pe sezon, **Club** pe lună, **Lecție individuală** și **Altceva**. Opțiunile sunt grupate în **De plată**, **Achitate** și **Altele**.",
    },
    { t: "p", text: "Data nu poate fi în viitor, iar suma nu poate depăși restul de plată." },
    { t: "warn", text: "O plată greșită nu se șterge. Se corectează sau se anulează, iar o plată anulată rămâne în listă, tăiată." },
    { t: "links", items: [{ slug: "corecteaza-sau-anuleaza-o-plata" }, { slug: "contabilitate-pe-scurt" }] },
  ],
};
