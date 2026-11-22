import type { GhidPage } from "@/lib/ghid/types";

export const schimbaRolulPage: GhidPage = {
  slug: "schimba-rolul-sau-opreste-accesul",
  title: "Schimbă rolul sau oprește accesul",
  lead: "Rolul unui administrator se schimbă din **Utilizatori**. Accesul se oprește cu **Activ** pe **FALS**.",
  blocks: [
    {
      t: "steps",
      steps: [
        {
          text: "Deschide **Utilizatori** ca la adăugarea unui administrator și apasă creionul de pe rândul persoanei (**Editează**).",
          shot: "echipa-utilizatori",
          marks: ["editeaza"],
        },
        {
          text: "La **Rolurile utilizatorului** schimbă rolul.",
          shot: "echipa-rol",
          marks: ["rol"],
        },
        {
          text: "Pentru a opri accesul, pune **Activ** pe **FALS**.",
          shot: "echipa-rol",
          marks: ["activ"],
        },
        {
          text: "Apasă **Salvează**, în bara **Modificări nesalvate** de jos.",
          shot: "echipa-rol",
          marks: ["salveaza"],
        },
      ],
    },
    { t: "p", text: "Rolurile și ce vede fiecare sunt la Roluri." },
    { t: "links", items: [{ slug: "roluri" }, { slug: "adauga-un-administrator" }, { slug: "siguranta" }] },
  ],
};
