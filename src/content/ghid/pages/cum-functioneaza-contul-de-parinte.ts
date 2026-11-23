import type { GhidPage } from "@/lib/ghid/types";

export const cumFunctioneazaContulPage: GhidPage = {
  slug: "cum-functioneaza-contul-de-parinte",
  title: "Cum funcționează contul de părinte",
  lead: "Un sportiv are un singur e-mail în portal, iar părintele și sportivul folosesc același cont.",
  blocks: [
    { t: "h2", text: "Un e-mail, un cont" },
    {
      t: "list",
      items: [
        "Un sportiv are cel mult un acces în portal, la un singur e-mail. Dacă inviți alt e-mail pentru același sportiv, accesul vechi se oprește.",
        "Un e-mail are un singur cont. Sportivul nu are cont separat: părintele și sportivul intră cu același cont.",
        "Frații cu același e-mail pe fișă ajung în același cont. Părintele îi vede în lista **Sportivi** și alege copilul.",
        "Frații cu e-mailuri diferite au conturi diferite.",
      ],
    },
    {
      t: "p",
      text: "Regula de lucru: o persoană are acces la un singur cont, deci un singur e-mail. Scrie pe fiecare fișă, în **Date**, e-mailul persoanei care intră în portal.",
    },
    { t: "h2", text: "Al cui este contul" },
    {
      t: "p",
      text: "Contul aparține celui care are e-mailul, nu unui copil. Părintele nu are e-mail sau parolă separate pentru fiecare copil.",
    },
    { t: "h2", text: "Sportivul împlinește 18 ani" },
    {
      t: "list",
      items: [
        "Nu se întâmplă nimic singur: același cont, același e-mail, nicio invitație nouă.",
        "Dacă sportivul major este singurul din cont, portalul se schimbă: nu mai apare lista de sportivi, iar profilul scrie **Sportiv**.",
        "Dacă e-mailul părintelui rămâne pe fișă, părintele vede în continuare sportivul.",
        "Pentru ca sportivul să aibă propriul cont, scrie e-mailul lui în **Date**. Se trimite o invitație nouă, iar accesul vechi se oprește.",
      ],
    },
    { t: "h2", text: "Părinte și antrenor" },
    {
      t: "p",
      text: "O persoană care este și părinte, și antrenor are un singur cont. Intră separat pe adresa fiecărui portal.",
    },
    { t: "h2", text: "O adresă greșită" },
    {
      t: "p",
      text: "Dacă invitația pleacă la o adresă scrisă greșit, rămâne un cont invitat pe care nu-l folosește nimeni. Corectează adresa în **Date**.",
    },
    {
      t: "links",
      items: [{ slug: "invita-un-parinte-in-portal" }, { slug: "schimba-e-mailul-unui-sportiv" }, { slug: "ce-vede-si-ce-poate-face-parintele" }],
    },
  ],
};
