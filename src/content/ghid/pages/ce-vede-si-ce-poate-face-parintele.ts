import type { GhidPage } from "@/lib/ghid/types";

export const ceVedeParinteleaPage: GhidPage = {
  slug: "ce-vede-si-ce-poate-face-parintele",
  title: "Ce vede și ce poate face părintele",
  lead: "Părintele vede situația copilului, doar de citit. Își schimbă doar numele, telefonul și parola.",
  blocks: [
    { t: "h2", text: "Ce vede, pentru fiecare copil" },
    {
      t: "list",
      items: [
        "**Acasă**: următoarea ședință, starea și abonamentul.",
        "**Istoric**: prezența copilului.",
        "**Calendar**: ședințele copilului, cu o legătură pentru aplicația de calendar.",
        "**Concursuri**: concursurile și rezultatele.",
        "**Parcurs**: insignele și parcursul.",
        "**Plăți**: abonamentele, plățile și fișierul PDF al formularului de înscriere.",
        "**Mesaje**: ședințe anulate sau mutate și anunțurile pentru grupele copilului. Părintele le poate închide.",
        "**Setări**, la **Date sportiv**: numele, data nașterii, vârsta, persoana de contact, telefonul și e-mailul, cu mențiunea că le schimbă clubul.",
      ],
    },
    { t: "p", text: "Un părinte cu mai mulți copii alege copilul din lista **Sportivi**. Apar toți, în afară de un sportiv **inactiv** care nu are nimic de plătit și nicio prezență în ultimele 12 luni. Accesul unui sportiv inactiv rămâne." },
    { t: "h2", text: "Ce poate schimba" },
    {
      t: "list",
      items: [
        "Numele și telefonul lui, cel mult 80 de caractere.",
        "Comutatorul **E-mail la schimbări de program**, pornit sau oprit.",
        "Parola, la **Setări**, **Parolă**.",
        "Dispozitivele: le vede și le poate deconecta, la **Setări**, **Dispozitive**.",
      ],
    },
    { t: "h2", text: "Ce nu poate face" },
    {
      t: "list",
      items: [
        "Nu schimbă datele copilului și nici e-mailul. Le schimbă clubul.",
        "Nu adaugă copii și nu vede alți copii.",
        "Nu modifică prezența.",
        "Nu încarcă documente. Poate doar să descarce formularul de înscriere.",
        "Nu plătește online.",
      ],
    },
    { t: "p", text: "Intrarea se face cu e-mail și parolă sau cu Google. Portalul nu are 2FA. Sesiunea se închide după 7 zile fără folosire și, oricum, după 30 de zile de la intrare." },
    {
      t: "links",
      items: [{ slug: "cum-functioneaza-contul-de-parinte" }, { slug: "e-mailuri-automate" }, { slug: "scoate-accesul-unui-parinte" }],
    },
  ],
};
