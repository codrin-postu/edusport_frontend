import type { GhidPage } from "@/lib/ghid/types";

export const pauzePage: GhidPage = {
  slug: "pauze",
  title: "Pauze",
  lead: "O pauză, de exemplu o vacanță, anulează ședințele din intervalul ei.",
  blocks: [
    {
      t: "steps",
      steps: [
        { text: "În **Calendar și serii**, apasă **Adaugă pauză**, sus în dreapta.", shot: "program-calendar" },
        { text: "Scrie **Nume**, de exemplu Vacanța de iarnă. Apoi alege **De la** și **Până la**.", shot: "program-pauza" },
        {
          text: "Sub date apare **Se anulează** cu numărul de ședințe și de grupe, apoi lista grupelor, cu ședințele fiecăreia. Debifează o grupă ca ședințele ei să rămână.",
        },
        { text: "Apasă **Salvează**." },
      ],
    },
    { t: "h2", text: "Editează sau șterge o pauză" },
    {
      t: "p",
      text: "Cât există pauze, deasupra calendarului apare **Pauze**, cu **Nume**, **De la**, **Până la** și **Se anulează**. **...** de pe rând are **Editează** și **Șterge**. **Șterge** cere confirmarea.",
    },
    { t: "links", items: [{ slug: "calendar-si-serii" }, { slug: "programul-unei-grupe" }] },
  ],
};
