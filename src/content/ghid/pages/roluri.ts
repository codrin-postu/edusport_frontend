import type { GhidPage } from "@/lib/ghid/types";

export const roluriPage: GhidPage = {
  slug: "roluri",
  title: "Roluri",
  lead: "Rolul hotărăște ce meniuri și pagini vede fiecare administrator.",
  blocks: [
    { t: "warn", text: "Rolul ascunde meniuri și pagini. Nu este încă o barieră la date: dă cont în panou doar oamenilor de încredere." },
    { t: "h2", text: "Cele trei roluri" },
    {
      t: "list",
      items: [
        "**Super Admin**: toate paginile. Numai el vede **Administratori**, în **Securitate**.",
        "**Administrator club**: toate paginile, fără cele rezervate lui Super Admin.",
        "**Editor site**: **Panou EduSport**, **Securitate** și paginile site-ului, de exemplu **Pagina principală**, **Meniu site**, **Anunțuri**, **Competiții**, **Sponsori**, **Membri echipă**, **Pagina Voluntariat** și **Prețuri**.",
      ],
    },
    { t: "h2", text: "Pagini doar pentru Administrator club și Super Admin" },
    {
      t: "list",
      items: [
        "**Înscrieri**, **Formulare**, **Mesaje contact**, **Voluntari** și **Parteneri**.",
        "**Grupe**, **Sportivi**, **Prezență**, **Contabilitate** și **Calendar și serii**.",
        "**Tabele**.",
        "**Setări site** și **Sezoane**.",
        "Blocul **Cont portal**, din fișa unui membru al echipei.",
      ],
    },
    {
      t: "p",
      text: "Un administrator cu mai multe roluri are tot ce dă fiecare rol. Rolurile **Author** și **Editor**, din aceeași listă, sunt ale Strapi: ele nu deschid nicio pagină EduSport în afară de **Panou EduSport** și **Securitate**.",
    },
    { t: "h2", text: "Schimbă rolul sau oprește accesul" },
    {
      t: "steps",
      steps: [
        {
          text: "Deschide **Utilizatori** ca la adăugarea unui administrator și apasă creionul de pe rândul persoanei (**Editează**).",
        },
        {
          text: "La **Rolurile utilizatorului** schimbă rolul. Pentru a opri accesul, pune **Activ** pe **FALS**. Apoi apasă **Salvează**, în bara **Modificări nesalvate** de jos.",
          shot: "echipa-rol", marks: ["rol", "fals", "salveaza"],
        },
      ],
    },
    { t: "links", items: [{ slug: "adauga-un-administrator" }, { slug: "siguranta" }] },
  ],
};
