import type { GhidPage } from "@/lib/ghid/types";

export const invitaParinteInPortalPage: GhidPage = {
  slug: "invita-un-parinte-in-portal",
  title: "Invită un părinte în portal",
  lead: "Accesul în portal se dă din panou, pe sportiv. Confirmarea unei înscrieri nu trimite nicio invitație.",
  blocks: [
    { t: "p", text: "Sportivul trebuie confirmat și să aibă un e-mail în **Date**. Invitația pleacă la acel e-mail." },
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
        { text: "Apasă **Invită în portal**. Fereastra arată câte invitații pleacă și către câte adrese.", shot: "portal-invitatii", marks: ["previzualizare"] },
        { text: "Sub număr sunt sportivii săriți, cu motivul: anonimizat, nou, fără e-mail sau are deja acces. Apasă **Trimite**." },
      ],
    },
    { t: "p", text: "Frații cu același e-mail primesc un singur mesaj, cu toți copiii." },
    { t: "h2", text: "Ce se întâmplă la adresa respectivă" },
    {
      t: "list",
      items: [
        "Adresa nu are cont: se creează unul și pleacă mesajul **Acces la portalul EduSport**, cu un link.",
        "Adresa are deja cont activ, de exemplu al unui părinte cu alt copil: copilul se adaugă în cont și pleacă mesajul **Acces nou în portalul EduSport**. Nu se cere parolă nouă.",
        "Contul este încă **INVITAT**: linkurile vechi nu mai merg și pleacă o invitație nouă.",
        "Contul este dezactivat: invitația se refuză cu **Contul acestei adrese este dezactivat.**",
      ],
    },
    { t: "h2", text: "Ce face părintele" },
    {
      t: "p",
      text: "Deschide linkul, pe pagina **Bine ai venit**, scrie **Parolă nouă** (cel puțin 10 caractere) și apasă **Salvează parola**, sau alege **Continuă cu Google**, cu aceeași adresă ca în invitație. Cu un singur copil intră direct la el, cu mai mulți alege din lista **Sportivi**.",
    },
    { t: "warn", text: "Linkul este valabil 7 zile. Dacă a expirat, apasă **Retrimite invitația**, la cardul **Acces portal**." },
    {
      t: "links",
      items: [{ slug: "cum-functioneaza-contul-de-parinte" }, { slug: "parintele-nu-poate-intra" }, { slug: "confirma-o-inscriere" }],
    },
  ],
};
