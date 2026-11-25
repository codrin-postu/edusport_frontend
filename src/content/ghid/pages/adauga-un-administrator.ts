import type { GhidPage } from "@/lib/ghid/types";

export const adaugaAdministratorPage: GhidPage = {
  slug: "adauga-un-administrator",
  title: "Adaugă un administrator",
  lead: "Un Super Admin invită un administrator nou, cu e-mailul și rolul acestuia.",
  blocks: [
    {
      t: "steps",
      steps: [
        { text: "În meniul din stânga apasă **Comută la meniul Strapi**, apoi **Setări** din meniul Strapi. La **Panou de administrare** alege **Utilizatori**." },
        {
          text: "Apasă **Invită utilizator nou**.",
          shot: "echipa-utilizatori",
          marks: ["invita"],
        },
        {
          text: "Completează **Prenume** și **Email**, iar la nevoie **Nume**. Prenumele și e-mailul sunt obligatorii.",
          shot: "echipa-invita",
          marks: ["prenume", "email"],
        },
        {
          text: "La **Rolurile utilizatorului** alege rolul: **Administrator club**, **Editor site** sau **Super Admin**.",
          shot: "echipa-invita",
          marks: ["rol"],
        },
        {
          text: "Apasă **Invită utilizator**. Persoana invitată apare în listă.",
          shot: "echipa-invita",
          marks: ["invita"],
        },
      ],
    },
    {
      t: "p",
      text: "Persoana invitată deschide linkul, completează **Parolă nouă** și apasă **Salvează parola** sau apasă **Continuă cu Google**. Pentru Google, contul trebuie să aibă același e-mail ca invitația.",
    },
    { t: "p", text: "Invitația este valabilă 7 zile. Dacă a expirat, șterge utilizatorul din **Utilizatori** și invită-l din nou." },
    { t: "p", text: "**Administrator club** și **Editor site** nu au pagina **Utilizatori**: administratorii se adaugă doar dintr-un cont Super Admin." },
    { t: "links", items: [{ slug: "roluri" }, { slug: "schimba-rolul-sau-opreste-accesul" }, { slug: "meniul-si-pagina-acasa" }, { slug: "siguranta" }] },
  ],
};
