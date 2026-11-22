import type { GhidPage } from "@/lib/ghid/types";

export const accesAntrenorPortalPage: GhidPage = {
  slug: "acces-antrenor-in-portal",
  title: "Acces antrenor în portal",
  lead: "Antrenorul intră în portal cu un cont pornit din fișa lui de membru al echipei.",
  blocks: [
    {
      t: "steps",
      steps: [
        { text: "Deschide **Membri echipă**, din grupa **Sportivi și echipă**, și apasă pe antrenor. Se deschide **Editează membrul**." },
        {
          text: "La **Cont portal** scrie adresa la **E-mail pentru cont** și apasă **Trimite invitația**. Apare **Invitație trimisă.**",
          shot: "echipa-cont-portal", marks: ["email", "trimite-invitatia"],
        },
        { text: "Sub adresă scrie starea: **Invitație trimisă pe** data, iar după ce antrenorul și-a făcut contul, **Cont activ din** data." },
        { text: "Cât timp contul nu e activ, **Retrimite invitația** trimite alta." },
        { text: "Antrenorul deschide invitația primită și alege parola sau continuă cu Google. Invitația este valabilă 7 zile." },
      ],
    },
    {
      t: "p",
      text: "Același bloc se deschide și din pagina **Grupe**, de pe numele antrenorului, la **Antrenori**. Blocul **Cont portal** apare doar la Administrator club și Super Admin.",
    },
    {
      t: "p",
      text: "Cu contul activ, antrenorul completează prezența grupelor lui și din portal, la **Azi**, în **Prezență de completat**. O prezență salvată se corectează cel mult 7 zile după ședință.",
    },
    { t: "h2", text: "Pe un cont existent" },
    {
      t: "list",
      items: [
        "**Dezactivează contul**: antrenorul nu mai poate intra. Cere confirmarea și deconectează toate dispozitivele lui.",
        "**Activează contul**: îl repornește.",
        "**Schimbă e-mailul**: scrii **E-mail nou** și apeși **Salvează e-mailul**.",
        "**Dezactivează tot** apare când același cont are și acces de părinte. Oprește ambele accese.",
      ],
    },
    {
      t: "warn",
      text: "**Dezactivează contul** deconectează acum toate dispozitivele antrenorului.",
    },
    { t: "links", items: [{ slug: "completeaza-prezenta" }, { slug: "roluri" }, { slug: "intra-in-panou" }] },
  ],
};
