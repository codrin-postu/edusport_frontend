import type { GhidPage } from "@/lib/ghid/types";

export const creeazaGrupaPage: GhidPage = {
  slug: "creeaza-o-grupa",
  title: "Creează o grupă",
  lead: "O grupă nouă se creează într-o secțiune a sezonului; programul se adaugă după aceea.",
  blocks: [
    {
      t: "steps",
      steps: [
        { text: "Deschide **Grupe**, în meniu, la **Club și școală**. Alege sezonul la **Sezon** și secțiunea din taburile de sub el.", shot: "grupe-lista", marks: ["sezon", "sectiuni"] },
        { text: "Apasă **Grupă nouă**, sus în dreapta.", shot: "grupe-lista", marks: ["grupa-noua"] },
        { text: "Scrie **Nume**. Alege **Listă de prețuri** și **Antrenori**, dacă sunt stabilite.", shot: "grupe-noua", marks: ["nume", "lista-preturi", "antrenori"] },
        { text: "**Program public** este pornit implicit: programul grupei apare în orarul de pe site. Orarul public arată doar grupele școlii.", shot: "grupe-noua", marks: ["program-public"] },
        { text: "Apasă **Creează grupa**. Se deschide tabul **Program**, unde adaugi orele.", shot: "grupe-noua", marks: ["creeaza-grupa"] },
      ],
    },
    {
      t: "p",
      text: "Un sezon încheiat este doar de citit: butoanele de adăugare și modificare lipsesc.",
    },
    { t: "h2", text: "Editează sau șterge o grupă" },
    {
      t: "p",
      text: "Pe pagina grupei, **...** din colțul de sus are **Editează grupa**, cu aceleași câmpuri ca la creare, și **Șterge grupa**. **Șterge grupa** apare doar la o grupă care nu a fost folosită.",
    },
    {
      t: "warn",
      text: "**Șterge grupa** nu se poate anula.",
    },
    { t: "links", items: [{ slug: "sportivii-unei-grupe" }, { slug: "programul-unei-grupe" }] },
  ],
};
