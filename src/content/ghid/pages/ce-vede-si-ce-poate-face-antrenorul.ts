import type { GhidPage } from "@/lib/ghid/types";

export const ceVedeAntrenorulPage: GhidPage = {
  slug: "ce-vede-si-ce-poate-face-antrenorul",
  title: "Ce vede și ce poate face antrenorul",
  lead: "Antrenorul lucrează în portalul lui cu grupele și lecțiile lui. Plățile și datele altor copii nu le vede.",
  blocks: [
    { t: "h2", text: "Ce poate face" },
    {
      t: "list",
      items: [
        "**Azi**: grupele și lecțiile individuale de azi.",
        "**Grupe**: grupele lui, plus **Alte grupe**, doar de citit.",
        "Programul grupelor lui: adaugă, schimbă, anulează sau șterge o ședință. Programul unei grupe **Școala** îl poate edita doar dacă e-mailul lui din portal aparține unui administrator activ cu acces la club.",
        "Prezența grupelor lui. La grupa altui antrenor poate completa prezența ca înlocuitor, cu **Înlocuiesc azi**; prezența se înregistrează pe numele lui.",
        "Lecții individuale: le creează, le programează, completează prezența, le anulează sau le șterge.",
        "Adaugă în grupă un sportiv existent sau unul nou, cu **Sportiv nou**. Sportivul nou are statusul **Nou** și îl confirmă administratorul. Mută un sportiv sau îl scoate din grupă, de la o anumită dată.",
        "Acordă sau scoate insigne la **Parcurs**.",
        "**Istoric**, calendarul, competițiile și profilul lui: nume, telefon, parolă, dispozitive.",
      ],
    },
    { t: "p", text: "Antrenorul poate corecta o prezență salvată timp de 7 zile după ședință; după aceea, doar administratorul." },
    { t: "h2", text: "Ce nu poate face" },
    {
      t: "list",
      items: [
        "Nu vede plăți sau sume, doar mențiuni ca **3 ședințe rămase** sau **Fără abonament**.",
        "Nu vede contactele părinților copiilor din afara grupelor lui. La înlocuire vede sportivii, fără datele de contact.",
        "Caută sportivi doar după nume, nu după telefon, e-mail sau data nașterii.",
        "Nu modifică datele sportivilor și nu confirmă, nu unește, nu șterge și nu anonimizează sportivi.",
        "Nu înregistrează plăți și nu trimite invitații.",
        "Nu vede sportivii anonimizați.",
        "Nu își schimbă singur e-mailul: îl schimbă administratorul.",
      ],
    },
    { t: "p", text: "Un antrenor scos dintr-o grupă pierde drepturile asupra ei din ziua următoare. Orice schimbare de program ajunge direct în calendarul de pe site." },
    { t: "h2", text: "Oprește accesul unui antrenor" },
    {
      t: "steps",
      steps: [
        { text: "Deschide **Membri echipă** și apasă pe antrenor. La **Cont portal** apasă **Dezactivează contul**." },
        { text: "Confirmă. Toate dispozitivele antrenorului se deconectează." },
        { text: "Dacă același cont are și acces de părinte, apare **Dezactivează tot**. **Dezactivează contul** oprește atunci doar accesul de antrenor, iar accesul de părinte rămâne activ. **Dezactivează tot** le oprește pe amândouă." },
        { text: "**Activează contul** îl reactivează. Contul unui antrenor șters rămâne dezactivat, iar o invitație nouă la aceeași adresă îl refolosește." },
      ],
    },
    {
      t: "links",
      items: [{ slug: "acces-antrenor-in-portal" }, { slug: "ce-poate-face-fiecare-rol" }, { slug: "completeaza-prezenta" }, { slug: "corecteaza-o-prezenta" }],
    },
  ],
};
