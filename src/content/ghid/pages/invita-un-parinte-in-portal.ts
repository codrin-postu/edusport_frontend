import type { GhidPage } from "@/lib/ghid/types";

export const invitaParinteInPortalPage: GhidPage = {
  slug: "invita-un-parinte-in-portal",
  title: "Invită un părinte în portal",
  lead: "Accesul în portal se acordă din panou, pentru fiecare sportiv. Confirmarea unei înscrieri nu trimite nicio invitație.",
  blocks: [
    { t: "p", text: "Sportivul trebuie să fie confirmat și să aibă un e-mail în **Date**. Invitația se trimite la acel e-mail." },
    { t: "h2", text: "Un sportiv" },
    {
      t: "steps",
      steps: [
        { text: "Deschide fișa sportivului, tabul **Date**. Jos este cardul **Acces portal**, cu adresa și starea: **FĂRĂ ACCES**, **INVITAT** sau **ACTIV**." },
        { text: "Apasă **Invită în portal**.", shot: "portal-card", marks: ["butoane"] },
        { text: "Apare **Invitație trimisă.** Starea devine **INVITAT**." },
      ],
    },
    { t: "h2", text: "Mai mulți sportivi" },
    {
      t: "steps",
      steps: [
        { text: "În **Sportivi** bifează rândurile sportivilor. Apare butonul **Invită în portal**." },
        { text: "Apasă **Invită în portal**. Fereastra arată câte invitații se trimit și la câte adrese.", shot: "portal-invitatii", marks: ["previzualizare"] },
        { text: "Sub număr apar sportivii omiși, cu motivul: anonimizat, nou, fără e-mail sau cu acces existent. Apasă **Trimite**." },
      ],
    },
    { t: "p", text: "Frații cu același e-mail primesc un singur mesaj, cu toți copiii." },
    { t: "h2", text: "Situații posibile" },
    {
      t: "list",
      items: [
        "Adresa nu are cont: se creează unul și se trimite mesajul **Acces la portalul EduSport**, cu un link.",
        "Adresa are deja cont activ, de exemplu al unui părinte cu alt copil: copilul se adaugă în cont și se trimite mesajul **Acces nou în portalul EduSport**. Nu se cere parolă nouă.",
        "Contul este încă **INVITAT**: linkurile vechi devin invalide și se trimite o invitație nouă.",
        "Contul este dezactivat: invitația se refuză cu **Contul acestei adrese este dezactivat.**",
      ],
    },
    { t: "h2", text: "Ce face părintele" },
    {
      t: "p",
      text: "Părintele deschide linkul, completează pe pagina **Bine ai venit** câmpul **Parolă nouă** (cel puțin 10 caractere) și apasă **Salvează parola** sau alege **Continuă cu Google**, cu aceeași adresă ca în invitație. Cu un singur copil intră direct în contul acestuia; cu mai mulți, alege din lista **Sportivi**.",
    },
    { t: "warn", text: "Linkul este valabil 7 zile. Dacă a expirat, apasă **Retrimite invitația**, la cardul **Acces portal**." },
    {
      t: "links",
      items: [{ slug: "cum-functioneaza-contul-de-parinte" }, { slug: "parintele-nu-poate-intra" }, { slug: "confirma-o-inscriere" }],
    },
  ],
};
