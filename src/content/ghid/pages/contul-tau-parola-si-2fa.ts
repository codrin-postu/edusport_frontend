import type { GhidPage } from "@/lib/ghid/types";

export const contulTauPage: GhidPage = {
  slug: "contul-tau-parola-si-2fa",
  title: "Contul tău: parolă și 2FA",
  lead: "Cum îți protejezi contul: 2FA, chei de acces și parolă.",
  blocks: [
    { t: "p", text: "În meniu, la **Sistem**, deschide **Securitate**. Pagina este a contului cu care ești intrat." },
    { t: "h2", text: "Pornește 2FA" },
    {
      t: "steps",
      steps: [
        {
          text: "La **2FA** alege **Aplicație de autentificare** sau **Cod pe e-mail** și apasă **Activează**.",
          shot: "securitate",
          marks: ["activeaza"],
        },
        {
          text: "Cu aplicația: scanează codul cu aplicația de autentificare (sau scrie cheia de sub el), scrie **Cod din aplicație** și apasă **Activează**. Cu e-mail: scrie **Cod din e-mail**, trimis pe adresa contului.",
          shot: "securitate-2fa",
          marks: ["cod", "confirma"],
        },
        { text: "La prima metodă pornită apar **Coduri de rezervă**. Apasă **Descarcă** sau **Copiază**, apoi **Gata**." },
      ],
    },
    { t: "warn", text: "Codurile de rezervă nu se mai arată după **Gata**. Fiecare merge o singură dată." },
    { t: "p", text: "Ca să faci coduri noi, apasă **Generează coduri noi**. Cele vechi nu mai merg. **Oprește** scoate o metodă, iar la ultima ți se spune că și codurile de rezervă se șterg." },
    { t: "h2", text: "Cheie de acces" },
    {
      t: "steps",
      steps: [
        { text: "La **Chei de acces** apasă **Creează o cheie de acces**.", shot: "securitate", marks: ["cheie"] },
        { text: "Dacă apare **Confirmă din nou ca să continui.**, scrie parola sau codul cerut și apasă **Confirmă**." },
        { text: "Urmează pașii telefonului sau ai calculatorului (amprentă, față sau cod). Cheia apare în listă; **Redenumește** și **Șterge** o schimbă. Maximum 10 chei." },
      ],
    },
    { t: "p", text: "Cheia de acces este o altă cale de a intra, fără parolă: pe pagina de intrare apasă **Folosește cheia de acces**. Nu este o metodă 2FA." },
    { t: "h2", text: "Schimbă parola" },
    {
      t: "steps",
      steps: [
        { text: "La **Parolă** scrie **Parola actuală** și **Parola nouă**.", shot: "securitate", marks: ["schimba-parola"] },
        { text: "Apasă **Schimbă parola**. Apare **Parolă schimbată.**" },
      ],
    },
    { t: "p", text: "Mai jos, **Google** arată dacă contul este legat de Google, iar **Dispozitive** listează intrările, fiecare cu **Deconectează**." },
    { t: "p", text: "Dacă ai pierdut accesul la 2FA, un Super Admin îți poate reseta 2FA la **Administratori**, în aceeași pagină. Nu îți poți reseta singur 2FA." },
    { t: "links", items: [{ slug: "intra-in-panou" }, { slug: "siguranta" }] },
  ],
};
