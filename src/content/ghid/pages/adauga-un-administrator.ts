import type { GhidPage } from "@/lib/ghid/types";

export const adaugaAdministratorPage: GhidPage = {
  slug: "adauga-un-administrator",
  title: "Adaugă un administrator",
  lead: "Un administrator nou se invită cu e-mailul și rolul lui, din contul de Super Admin.",
  blocks: [
    {
      t: "steps",
      steps: [
        {
          text: "În meniul din stânga apasă **Comută la meniul Strapi**, apoi **Setări**. La **Panou de administrare** alege **Utilizatori**.",
          shot: "echipa-utilizatori", marks: ["invita"],
        },
        {
          text: "Apasă **Invită utilizator nou**. Completează **Prenume** și **Email**, iar la nevoie **Nume**. Prenumele și e-mailul sunt obligatorii.",
          shot: "echipa-invita", marks: ["email", "rol", "invita"],
        },
        { text: "La **Rolurile utilizatorului** alege rolul: **Administrator club**, **Editor site** sau **Super Admin**." },
        { text: "Apasă **Invită utilizator**. Persoana nouă apare în listă." },
      ],
    },
    {
      t: "p",
      text: "Persoana deschide linkul invitației și alege **Parolă nouă**, apoi **Salvează parola**, sau apasă **Continuă cu Google**. Cu Google, contul Google trebuie să aibă același e-mail ca invitația.",
    },
    { t: "p", text: "Invitația este valabilă 7 zile. Dacă a expirat, șterge utilizatorul din **Utilizatori** și invită-l din nou." },
    { t: "p", text: "**Administrator club** și **Editor site** nu au pagina **Utilizatori**: administratorii se adaugă din Super Admin." },
    { t: "links", items: [{ slug: "roluri" }, { slug: "siguranta" }] },
  ],
};
