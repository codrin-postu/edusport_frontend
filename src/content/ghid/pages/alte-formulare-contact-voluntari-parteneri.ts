import type { GhidPage } from "@/lib/ghid/types";

export const alteFormularePage: GhidPage = {
  slug: "alte-formulare-contact-voluntari-parteneri",
  title: "Alte formulare: contact, voluntari, parteneri",
  lead: "Mesajele de contact, cererile de voluntariat și cele de parteneriat ajung în panou, fiecare pe pagina proprie.",
  blocks: [
    {
      t: "steps",
      steps: [
        {
          text: "În meniu, în grupa **Formulare**, deschide **Formulare**. Fiecare formular arată câte sunt **noi**.",
          shot: "formulare-hub", marks: ["noi"],
        },
        {
          text: "Apasă **Vezi mesajele** la Contact și Parteneri sau **Rezultate** la Voluntariat. Aceleași pagini se deschid din meniu: **Contact**, **Voluntari**, **Parteneri**.",
          shot: "formulare-hub", marks: ["vezi"],
        },
      ],
    },
    { t: "h2", text: "Contact" },
    {
      t: "p",
      text: "Pagina **Mesaje contact** are taburile **Toate**, **Noi**, **Citite** și **Răspunse**. Căutarea se face după nume sau e-mail, iar **Toate motivele** filtrează după motivul mesajului.",
    },
    {
      t: "steps",
      steps: [
        { text: "Apasă un mesaj. Se văd e-mailul, telefonul, data și textul." },
        { text: "La **Notă internă (privată)** scrii ce ai făcut. Nota se salvează când ieși din câmp." },
        { text: "**Marchează citit** sau **Răspuns trimis** schimbă starea. **Răspunde prin email** deschide aplicația de e-mail." },
      ],
    },
    { t: "warn", text: "**Șterge** șterge mesajul definitiv, după o confirmare." },
    { t: "h2", text: "Parteneri" },
    {
      t: "p",
      text: "Pagina **Parteneri** are taburile **Toate**, **Noi**, **În discuții**, **Confirmate** și **Respinse**. Căutarea se face după companie, contact sau e-mail.",
    },
    {
      t: "steps",
      steps: [
        { text: "Apasă un rând. Se văd **Companie**, **Persoană de contact**, **Email**, **Telefon**, **Tip colaborare** și **Mesaj**." },
        { text: "La **Stare** alegi stadiul discuției. La **Notă internă (privată)** scrii ce ai stabilit." },
      ],
    },
    { t: "h2", text: "Voluntari" },
    {
      t: "p",
      text: "Pagina **Voluntari** este un tabel. **Compact** arată coloanele principale, iar **Toate coloanele** le arată pe toate. Căutarea se face după nume, e-mail, telefon sau oraș, iar **Status**, **Disponibilitate** și **Alte filtre** restrâng lista.",
    },
    {
      t: "steps",
      steps: [
        { text: "Statusul unei cereri este **Nou**, **Contactat**, **Acceptat** sau **Respins**. Statusul se schimbă direct din tabel." },
        { text: "Apasă un rând ca să vezi toate răspunsurile. Dacă sunt date despre părinte, apar **Părinte / tutore** și acordul parental." },
        { text: "**Export**, apoi **Descarcă CSV**, salvează lista de pe ecran." },
      ],
    },
    { t: "warn", text: "**Șterge cererea** elimină cererea din tabel." },
    { t: "links", items: [{ slug: "citeste-inscrierile" }, { slug: "descarca-lista-si-formularele-goale" }] },
  ],
};
