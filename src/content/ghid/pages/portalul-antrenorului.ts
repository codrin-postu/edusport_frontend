import type { GhidPage } from "@/lib/ghid/types";

export const portalulAntrenoruluiPage: GhidPage = {
  slug: "portalul-antrenorului",
  title: "Portalul antrenorului",
  lead: "Aplicația antrenorilor, la adresa **antrenor.** a domeniului.",
  blocks: [
    {
      t: "p",
      text: "Antrenorul completează prezența din telefon și lucrează doar cu grupele și lecțiile lui. Prezența ajunge direct în panou și în abonamentul sportivului, fără sume vizibile pentru antrenor.",
    },
    { t: "h2", text: "Ce conține" },
    {
      t: "list",
      items: [
        "**Azi**: grupele și lecțiile individuale de azi, cu prezența de completat.",
        "**Grupe**: grupele lui, cu sportivii și programul, plus **Alte grupe**, doar de citit.",
        "Prezența grupelor și a lecțiilor lui, și ca înlocuitor, cu **Înlocuiesc azi**.",
        "Programul grupelor lui: adaugă, schimbă, anulează sau șterge o ședință.",
        "Sportivii: adaugă în grupă un sportiv existent sau unul nou, mută sau scoate un sportiv.",
        "**Parcurs**: acordă sau scoate insigne.",
        "**Concursuri**, **Istoric**, calendarul și **Profil**.",
      ],
    },
    { t: "p", text: "Nu vede plăți sau sume, doar mențiuni ca **3 ședințe rămase** sau **Fără abonament**." },
    { t: "h2", text: "Cine îl folosește" },
    {
      t: "p",
      text: "Antrenorii, cu invitația primită pe e-mail din **Membri echipă**, la **Cont portal**. O persoană care este și părinte, și antrenor are un singur cont, cu care intră pe adresa fiecărui portal.",
    },
    {
      t: "p",
      text: "Portalurile sunt opționale. După instalarea de bază sunt oprite și se pornesc separat; site-ul și panoul funcționează și fără ele.",
    },
    {
      t: "links",
      items: [
        { slug: "acces-antrenor-in-portal" },
        { slug: "ce-vede-si-ce-poate-face-antrenorul" },
        { slug: "completeaza-prezenta" },
        { slug: "lectii-individuale" },
        { slug: "portalurile-optional" },
      ],
    },
  ],
};
