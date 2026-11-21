import type { GhidPage } from "@/lib/ghid/types";

export const anunturiPage: GhidPage = {
  slug: "anunturi",
  title: "Anunțuri",
  lead: "Din Anunțuri scrii un mesaj pentru site, pentru portalul sportivilor sau pentru amândouă.",
  blocks: [
    {
      t: "steps",
      steps: [
        { text: "Deschide **Anunțuri**, în meniu, sus. Lista arată anunțurile, iar **Filtre** le filtrează. Apasă pe un anunț ca să îl editezi.", shot: "anunturi-lista", marks: ["anunt-nou"] },
        { text: "Apasă **+ Anunț nou**. La **Unde apare** bifează **Portal sportiv**. Trebuie să rămână bifat cel puțin un loc.", shot: "anunturi-noul", marks: ["portal-sportiv", "grupe-alese"] },
        { text: "La **Pentru cine** alege **Toate grupele** sau **Grupe alese**, apoi bifează grupele." },
        { text: "Scrie **Titlu** și **Mesaj**, ambele obligatorii. Mesajul e text simplu." },
        { text: "La **Programare** pune **Începe** și **Se încheie**, orele și **Stare**: **Activ** sau **Inactiv**." },
        { text: "Apasă **Salvează**, în bara de jos. **Renunță** șterge modificările." },
      ],
    },
    {
      t: "p",
      text: "**Afișare** (**Format**, **Text buton**, **Link buton**) și **Etichetă mică** apar doar când anunțul e pe site.",
    },
    { t: "h2", text: "Oprește sau șterge" },
    {
      t: "p",
      text: "Un anunț activ pe portal are **Oprește**, sus în dreapta. Confirmarea spune: Nu mai apare pe portal. Rândurile marcate **Automat**, cum sunt ședințele anulate sau mutate, apar singure și nu se pot opri.",
    },
    {
      t: "warn",
      text: "**Șterge** scoate anunțul cu totul și nu se poate anula.",
    },
    { t: "links", items: [{ slug: "programul-unei-grupe" }] },
  ],
};
