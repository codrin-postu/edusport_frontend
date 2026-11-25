import type { GhidPage } from "@/lib/ghid/types";

export const accesAntrenorPortalPage: GhidPage = {
  slug: "acces-antrenor-in-portal",
  title: "Accesul antrenorului în portal",
  lead: "Contul de portal al antrenorului se creează din fișa lui de membru al echipei.",
  blocks: [
    {
      t: "steps",
      steps: [
        { text: "Deschide **Membri echipă**, din grupa **Club și școală**, și apasă pe antrenor. Se deschide **Editează membrul**." },
        {
          text: "La **Cont portal** scrie adresa la **E-mail pentru cont** (1) și apasă **Trimite invitația** (2). Apare **Invitație trimisă.**",
          shot: "echipa-cont-portal", marks: ["email", "trimite-invitatia"], numbered: true,
        },
        { text: "Sub adresă apare starea: **Invitație trimisă pe** și data, iar după activarea contului, **Cont activ din** și data." },
        { text: "Cât timp contul nu este activ, **Retrimite invitația** trimite o invitație nouă." },
        { text: "Antrenorul deschide invitația primită și alege parola sau continuă cu Google. Invitația este valabilă 7 zile." },
      ],
    },
    {
      t: "p",
      text: "Același bloc se deschide și din pagina **Grupe**, de pe numele antrenorului, la **Antrenori**. Blocul **Cont portal** apare doar la Administrator club și Super Admin.",
    },
    {
      t: "p",
      text: "Cu contul activ, antrenorul completează prezența grupelor lui și din portal, la **Azi**, în **Prezență de completat**. Antrenorul poate corecta o prezență salvată timp de 7 zile după ședință.",
    },
    { t: "h2", text: "Pe un cont existent" },
    {
      t: "list",
      items: [
        "**Dezactivează contul**: antrenorul nu mai poate intra. Cere confirmarea și deconectează toate dispozitivele lui.",
        "**Activează contul**: reactivează contul.",
        "**Schimbă e-mailul**: scrii **E-mail nou** și apeși **Salvează e-mailul**.",
        "**Dezactivează tot** apare când același cont are și acces de părinte. Oprește ambele accese.",
      ],
    },
    {
      t: "warn",
      text: "**Dezactivează contul** deconectează imediat toate dispozitivele antrenorului.",
    },
    { t: "links", items: [{ slug: "completeaza-prezenta" }, { slug: "roluri" }, { slug: "intra-in-panou" }] },
  ],
};
