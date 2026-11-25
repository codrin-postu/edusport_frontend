import type { GhidPage } from "@/lib/ghid/types";

export const echipaSponsoriPage: GhidPage = {
  slug: "echipa-sponsori-si-alte-liste",
  title: "Echipă, sponsori și alte liste",
  lead: "Listele de pe site nu au ciornă: **Salvează** publică modificarea pe site.",
  blocks: [
    {
      t: "p",
      text: "**Membri echipă** este în grupa **Club și școală**, iar **Discipline** în **Setări**. **Sponsori** și **Evenimente colaborare** sunt taburi în pagina **Parteneri**, iar **Momente istoric** este tab în pagina **Istoric**, ambele în grupa **Pagini site**.",
    },
    { t: "h2", text: "Membri echipă" },
    {
      t: "steps",
      steps: [
        { text: "Deschide **Membri echipă** și apasă **+ Adaugă membru**. Pentru un membru existent apasă pe cardul lui." },
        {
          text: "Scrie **Nume** (obligatoriu), **Rol** și **Descriere**. Fotografia se alege cu **Alege**.",
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
      text: "Ordinea de pe site se schimbă prin tragerea cardurilor, doar când căutarea și filtrul de categorie sunt goale.",
    },
    {
      t: "warn",
      text: "**Șterge**, din fereastra unui membru, cere confirmarea **Ștergi membrul?** și nu se poate anula.",
    },
    { t: "h2", text: "Sponsori" },
    {
      t: "steps",
      steps: [
        { text: "Deschide **Pagini site**, **Parteneri**, tabul **Sponsori**, și apasă **+ Adaugă sponsor**. Pentru unul existent apasă pe rândul lui." },
        {
          text: "Scrie **Nume**, alege **Logo** cu **Alege** și, opțional, completează **Link**.",
          shot: "site-sponsor-nou",
          marks: ["nume", "logo", "link"],
        },
        {
          text: "**Ordine** stabilește poziția pe site. În listă, **Sus** și **Jos** mută sponsorul cu o poziție.",
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
        { text: "Deschide **Pagini site**, **Parteneri**, tabul **Evenimente colaborare**, și apasă **+ Adaugă eveniment**. Pentru unul existent apasă pe rând." },
        { text: "Scrie **Titlu** (obligatoriu), **Partener**, **Dată** și **Descriere**. **Dată** este text liber, de exemplu Decembrie 2024." },
        { text: "La **Imagine** alege poza. **Ordine afișare** stabilește poziția în listă." },
        { text: "Apasă **Salvează**, în bara de jos." },
      ],
    },
    {
      t: "p",
      text: "Coloana **Stare** din listă arată **Fără imagine**, **Fără descriere** sau **Complet**. **Șterge** elimină evenimentul și de pe pagina Parteneri a site-ului.",
    },
    { t: "h2", text: "Momente istoric" },
    {
      t: "steps",
      steps: [
        { text: "Deschide **Pagini site**, **Istoric**, tabul **Momente istoric**, și apasă **+ Adaugă moment**." },
        { text: "Scrie **An** și **Titlu**, ambele obligatorii, apoi **Descriere**. Apasă **Salvează**." },
        { text: "În listă, **Sus** și **Jos** mută momentul cu o poziție." },
      ],
    },
    { t: "links", items: [{ slug: "acces-antrenor-in-portal" }, { slug: "paginile-site-ului" }, { slug: "imagini-in-media" }] },
  ],
};
