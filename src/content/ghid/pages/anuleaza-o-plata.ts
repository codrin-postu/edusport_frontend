import type { GhidPage } from "@/lib/ghid/types";

export const anuleazaPlataPage: GhidPage = {
  slug: "anuleaza-o-plata",
  title: "Anulează o plată",
  lead: "O plată greșită se anulează. Nu se șterge și nu dispare din listă.",
  blocks: [
    {
      t: "steps",
      steps: [
        { text: "În **Contabilitate**, tabul **Plăți**, apasă **...** la rândul plății. Alege **Anulează plata**.", shot: "plati-meniu" },
        {
          text: "Se deschide **Anulează plata**, cu suma și data. Apasă **Anulează plata** ca să confirmi sau **Renunță** ca să lași plata.",
          shot: "plati-confirma",
        },
        { text: "Plata rămâne în listă, tăiată, cu **anulată** lângă **Pentru**. Nu se mai poate edita sau anula." },
        { text: "Dacă ai anulat din greșeală, apasă **Anulează** în mesajul **Plată anulată** de jos. Ai 8 secunde." },
      ],
    },
    { t: "p", text: "Pentru o greșeală de sumă, dată sau metodă folosește **Editează** din același meniu **...**." },
    { t: "h2", text: "Siguranța plăților" },
    {
      t: "list",
      items: [
        "Plata nu se șterge. Anularea o marchează, iar rândul rămâne în listă.",
        "Fiecare plată arată cine a înregistrat-o, în coloana **Înregistrat de**.",
        "Fiecare plată nouă primește un **Nr. chitanță**, an și număr, de exemplu 2026-0001.",
        "Istoricul sportivului păstrează **Plată înregistrată** și **Plată anulată**, cu cine și când.",
        "Aceeași plată trimisă de două ori în 10 secunde de același cont se înregistrează o singură dată.",
        "**Contabilitate** apare în meniu la rolul Administrator club. Editor site nu o vede.",
      ],
    },
    { t: "links", items: [{ slug: "inregistreaza-o-plata" }, { slug: "contabilitate" }] },
  ],
};
