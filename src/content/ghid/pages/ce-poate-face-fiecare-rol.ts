import type { GhidPage } from "@/lib/ghid/types";

export const cePoateFaceFiecareRolPage: GhidPage = {
  slug: "ce-poate-face-fiecare-rol",
  title: "Ce poate face fiecare rol",
  lead: "Pentru fiecare rol, ce poate și ce nu poate face.",
  blocks: [
    {
      t: "warn",
      text: "Rolul ascunde meniuri și pagini. Nu este încă o barieră la date: dă cont în panou doar oamenilor de încredere. Doar ce ține de Super Admin se refuză mereu: **Administratori**, **Resetează 2FA** și **Anonimizează**.",
    },
    { t: "h2", text: "Super Admin" },
    { t: "p", text: "**Poate**" },
    {
      t: "list",
      items: [
        "Toate paginile panoului.",
        "Să adauge administratori și să le schimbe rolul sau accesul, din **Utilizatori**.",
        "Să vadă **Administratori**, în **Securitate**, și să apese **Resetează 2FA** la alt administrator.",
        "Să anonimizeze un sportiv.",
        "Să invite antrenori în portal.",
      ],
    },
    { t: "p", text: "**Nu poate**: să-și reseteze singur 2FA." },
    { t: "h2", text: "Administrator club" },
    { t: "p", text: "**Poate**" },
    {
      t: "list",
      items: [
        "**Înscrieri**, **Grupe**, **Sportivi**, **Prezență**, **Contabilitate**, **Calendar și serii**, **Tabele**, **Setări site** și **Sezoane**.",
        "Paginile site-ului, ca Editor site.",
        "Să invite antrenori, din blocul **Cont portal**, și să invite părinți în portal.",
        "Să exporte datele unui sportiv.",
      ],
    },
    { t: "p", text: "**Nu poate**" },
    {
      t: "list",
      items: [
        "Să anonimizeze un sportiv: meniul nu are **Anonimizează**, iar serverul refuză mereu.",
        "Să vadă **Administratori** sau să reseteze 2FA altcuiva.",
        "Să adauge administratori: **Utilizatori** este doar pentru Super Admin, iar rolul nu are acest drept.",
      ],
    },
    { t: "h2", text: "Editor site" },
    { t: "p", text: "**Poate**" },
    {
      t: "list",
      items: [
        "**Panou EduSport** și **Securitate**.",
        "Paginile site-ului: **Pagina principală**, **Meniu site**, **Anunțuri**, **Competiții**, **Sponsori**, **Membri echipă**, **Voluntariat** și **Prețuri**.",
      ],
    },
    { t: "p", text: "**Nu poate** (ascuns din meniu, nu și blocat sigur)" },
    {
      t: "list",
      items: [
        "**Înscrieri**, **Grupe**, **Sportivi**, **Prezență**, **Contabilitate**, **Tabele**, **Setări site** și **Sezoane**.",
        "Blocul **Cont portal**, deci nu invită antrenori.",
        "Conținutul din **Setări site** și mesajele din **Contact**: le editează doar Administrator club.",
              ],
    },
    { t: "h2", text: "Antrenor" },
    { t: "p", text: "Lucrează în portalul antrenorului, nu în panou." },
    { t: "p", text: "**Poate**: să ia prezența grupelor lui, să-și schimbe programul, să adauge sportivi și să acorde insigne." },
    { t: "p", text: "**Nu poate**: să vadă plăți și sume, contactele copiilor din alte grupe, să schimbe datele unui sportiv sau să trimită invitații." },
    { t: "h2", text: "Părinte" },
    { t: "p", text: "Lucrează în portalul părinților, nu în panou." },
    { t: "p", text: "**Poate**: să vadă situația copilului sau copiilor lui și să-și schimbe numele, telefonul și parola." },
    { t: "p", text: "**Nu poate**: să schimbe datele copilului, să vadă alți copii sau să modifice prezența. Accesul la un copil se verifică la fiecare cerere." },
    {
      t: "links",
      items: [
        { slug: "roluri" },
        { slug: "ce-vede-si-ce-poate-face-antrenorul" },
        { slug: "ce-vede-si-ce-poate-face-parintele" },
        { slug: "adauga-un-administrator" },
      ],
    },
  ],
};
