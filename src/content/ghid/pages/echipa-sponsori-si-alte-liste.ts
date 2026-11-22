import type { GhidPage } from "@/lib/ghid/types";

export const echipaSponsoriPage: GhidPage = {
  slug: "echipa-sponsori-si-alte-liste",
  title: "Echipa, sponsori și alte liste",
  lead: "Listele de pe site au fiecare ecranul lor în meniu. **Salvează** pune modificarea pe site: listele nu au ciornă.",
  blocks: [
    {
      t: "p",
      text: "**Membri echipă** și **Discipline** sunt în grupa **Sportivi și echipă**. **Sponsori**, **Evenimente colaborare** și **Momente istoric** sunt în grupa **Articole și media**.",
    },
    { t: "h2", text: "Membri echipă" },
    {
      t: "steps",
      steps: [
        { text: "Deschide **Membri echipă** și apasă **+ Adaugă membru**. Pentru un membru existent apasă pe cardul lui." },
        {
          text: "Scrie **Nume** (obligatoriu), **Rol** și **Descriere**. Poza se alege cu **Alege**.",
          shot: "site-membru-nou",
          marks: ["nume", "rol", "descriere"],
        },
        {
          text: "La **Predă la** alege categoriile din sugestii sau scrie una nouă la **Altceva** și apasă Enter.",
          shot: "site-membru-nou",
          marks: ["preda-la"],
        },
        { text: "Apasă **Salvează**.", shot: "site-membru-nou", marks: ["salveaza"] },
      ],
    },
    {
      t: "p",
      text: "Ordinea de pe site se schimbă trăgând cardurile. Merge doar când căutarea și filtrul de categorie sunt goale.",
    },
    {
      t: "warn",
      text: "**Șterge**, din fereastra unui membru, cere confirmarea **Ștergi membrul?** și nu se poate anula.",
    },
    { t: "h2", text: "Sponsori" },
    {
      t: "steps",
      steps: [
        { text: "Deschide **Sponsori** și apasă **+ Adaugă sponsor**. Pentru unul existent apasă pe rândul lui." },
        {
          text: "Scrie **Nume**, alege **Logo** cu **Alege** și, dacă vrei, scrie **Link**.",
          shot: "site-sponsor-nou",
          marks: ["nume", "logo", "link"],
        },
        {
          text: "**Ordine** hotărăște locul pe site. În listă, **Sus** și **Jos** mută sponsorul cu un loc.",
          shot: "site-sponsor-nou",
          marks: ["ordine"],
        },
        { text: "Apasă **Salvează**.", shot: "site-sponsor-nou", marks: ["salveaza"] },
      ],
    },
    { t: "p", text: "**Șterge**, de pe rând, cere confirmarea **Ștergi sponsorul?**." },
    { t: "h2", text: "Discipline" },
    {
      t: "steps",
      steps: [
        { text: "Deschide **Discipline** și apasă **+ Adaugă disciplină**." },
        { text: "Scrie **Nume**, obligatoriu, și apasă **Salvează**. **Șterge**, de pe rând, cere confirmarea **Ștergi disciplina?**." },
      ],
    },
    { t: "h2", text: "Evenimente colaborare" },
    {
      t: "steps",
      steps: [
        { text: "Deschide **Evenimente colaborare** și apasă **+ Adaugă eveniment**. Pentru unul existent apasă pe rând." },
        { text: "Scrie **Titlu** (obligatoriu), **Partener**, **Dată** și **Descriere**. **Dată** e text liber, de exemplu Decembrie 2024." },
        { text: "La **Imagine** alege poza. **Ordine afișare** hotărăște locul în listă." },
        { text: "Apasă **Salvează**, în bara de jos." },
      ],
    },
    {
      t: "p",
      text: "Coloana **Stare** din listă arată **Fără imagine**, **Fără descriere** sau **Complet**. **Șterge** scoate evenimentul și de pe pagina Parteneri a site-ului.",
    },
    { t: "h2", text: "Momente istoric" },
    {
      t: "steps",
      steps: [
        { text: "Deschide **Momente istoric** și apasă **+ Adaugă moment**." },
        { text: "Scrie **An** și **Titlu**, ambele obligatorii, apoi **Descriere**. Apasă **Salvează**." },
        { text: "În listă, **Sus** și **Jos** mută momentul cu un loc." },
      ],
    },
    { t: "links", items: [{ slug: "acces-antrenor-in-portal" }, { slug: "paginile-site-ului" }, { slug: "imagini-in-media" }] },
  ],
};
