import type { GhidPage } from "@/lib/ghid/types";

export const corecteazaPrezentaPage: GhidPage = {
  slug: "corecteaza-o-prezenta",
  title: "Corectează prezența",
  lead: "O ședință salvată se redeschide și se corectează. Istoricul păstrează fiecare modificare.",
  blocks: [
    {
      t: "steps",
      steps: [
        {
          text: "Găsește ședința în **Toate ședințele** sau în pagina grupei, la tabul **Prezență**. Tabul listează, pe lună, **Data**, **Ora**, **Prezenți**, **Antrenor** și **Stare**.",
          shot: "grupe-prezenta", marks: ["tab-prezenta"],
        },
        {
          text: "Apasă pe ședință. Jos, **Salvată de** spune cine a salvat și când. Sub **Istoric** sunt modificările ședinței.",
          shot: "prezenta-salvata", marks: ["salvata", "istoric"],
        },
        { text: "Schimbă bifele sau antrenorii, sau adaugă un sportiv cu **+ Adaugă doar la ședința asta**." },
        { text: "Apasă **Salvează**. Istoricul primește o linie **Prezență corectată**, cu sportivii adăugați, scoși sau cu **Uscat** bifat." },
      ],
    },
    {
      t: "p",
      text: "Dacă apare **Prezența s-a schimbat între timp. Reîncarcă.**, ședința s-a schimbat după ce ai deschis-o. Reîncarcă pagina înainte să corectezi din nou.",
    },
    { t: "links", items: [{ slug: "completeaza-prezenta" }, { slug: "prezenta-pe-o-luna" }] },
  ],
};
