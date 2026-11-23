import type { GhidPage } from "@/lib/ghid/types";

export const portalulSportivuluiPage: GhidPage = {
  slug: "portalul-sportivului",
  title: "Portalul sportivului",
  lead: "Aplicația părinților și a sportivilor majori, la adresa **sportiv.** a domeniului.",
  blocks: [
    {
      t: "p",
      text: "Părintele vede programul, prezența, abonamentul și plățile copilului, plus ședințele anulate și anunțurile pentru grupele lui. Datele copilului sunt doar de citit.",
    },
    { t: "h2", text: "Ce conține" },
    {
      t: "list",
      items: [
        "**Acasă**: următoarea ședință, starea și abonamentul.",
        "**Istoric**: prezența copilului.",
        "**Calendar**: ședințele copilului, cu un link pentru aplicația de calendar.",
        "**Concursuri**: concursurile și rezultatele.",
        "**Parcurs**: insignele și parcursul.",
        "**Plăți**: abonamentele, plățile și fișierul PDF al formularului de înscriere.",
        "**Mesaje**: ședințe anulate sau mutate și anunțurile pentru grupele copilului.",
        "**Setări**: datele sportivului, numele și telefonul părintelui, parola și dispozitivele.",
      ],
    },
    { t: "p", text: "Un părinte cu mai mulți copii alege copilul din lista **Sportivi**." },
    { t: "h2", text: "Cine îl folosește" },
    {
      t: "p",
      text: "Părintele sau sportivul major. Un sportiv are un singur e-mail în portal, iar părintele și sportivul folosesc același cont. Frații cu același e-mail pe fișă ajung în același cont.",
    },
    {
      t: "p",
      text: "Portalurile sunt opționale. După instalarea de bază sunt oprite și se pornesc separat; site-ul și panoul funcționează și fără ele.",
    },
    {
      t: "links",
      items: [
        { slug: "cum-functioneaza-contul-de-parinte" },
        { slug: "invita-un-parinte-in-portal" },
        { slug: "ce-vede-si-ce-poate-face-parintele" },
        { slug: "parintele-nu-poate-intra" },
        { slug: "e-mailuri-automate" },
      ],
    },
  ],
};
