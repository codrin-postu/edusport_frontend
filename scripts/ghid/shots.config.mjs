// Screenshot and recording entries for the wiki. One entry per image.
//
//   id        file name: content/ghid/img/<id>.jpg, and the id a Step's `shot` field uses
//   path      admin or portal path, opened on --base
//   alt       image description (Romanian, terse)
//   viewport  default 1280x760; phone shots use { width: 390, height: 844 }
//   act       optional async (page) => {}: runs after the page loads, before the shot (and is the recording with --video)
//   marks     [{ n, selector }]: numbered boxes drawn over the first element matching the selector
//
// Test data only (invented names). Never point --base at production.
export const SHOTS = [
  {
    id: "contabilitate-plati",
    path: "/admin/plugins/edusport-contabilitate?tab=plati",
    alt: "Lista plăților din Contabilitate, cu butonul + Plată sus",
    marks: [{ n: 1, selector: "button:has-text('+ Plată')" }],
  },
  {
    id: "primii-login",
    path: "/login",
    alt: "Pagina de intrare în panou, cu E-mail, Parolă și butonul Intră",
    act: async(page) => {
      await page.context().clearCookies();
      await page.goto(new URL("/login", page.url()).toString(), { waitUntil: "networkidle" });
      // Headless Chromium tries the passkey autofill and shows a refusal; a person's browser shows none.
      await page.waitForTimeout(1500);
      await page.evaluate(() => {
        for (const el of document.querySelectorAll("*")) {
          if (el.children.length === 0 && el.textContent?.trim() === "Nu am putut folosi cheia de acces.") el.closest(".ui-notice")?.remove();
        }
      });
    },
    marks: [
      { n: 1, selector: "input[type=email]" },
      { n: 2, selector: "input[type=password]" },
      { n: 3, selector: "button:text-is('Intră')" },
    ],
  },
  {
    id: "primii-meniu",
    path: "/admin",
    alt: "Panoul de administrare cu meniul din stânga, grupa Club și școală deschisă",
    act: async(page) => {
      await page.locator("button.esd-grp-btn:visible", { hasText: "Club și școală" }).click();
      await page.waitForTimeout(600);
    },
    marks: [
      { n: 1, selector: "button.esd-grp-btn:visible:has-text('Club și școală')" },
      { n: 2, selector: "text=Contul meu" },
    ],
  },
  {
    id: "primii-telefon",
    path: "/admin",
    viewport: { width: 390, height: 844 },
    alt: "Panoul pe telefon, cu butonul de meniu în dreapta sus",
    marks: [{ n: 1, selector: "[aria-label='Deschide meniul']" }],
  },
  {
    id: "primii-telefon-meniu",
    path: "/admin",
    viewport: { width: 390, height: 844 },
    alt: "Meniul Navigare pe telefon, cu grupele de pagini",
    act: async(page) => {
      await page.locator("[aria-label='Deschide meniul']").click();
      await page.waitForTimeout(800);
      await page.evaluate(() => (document.activeElement instanceof HTMLElement ? document.activeElement.blur() : null));
      await page.mouse.move(20, 300);
      await page.waitForTimeout(500);
    },
    marks: [{ n: 1, selector: "a:text-is('Sportivi'), button:text-is('Sportivi')" }],
  },
  {
    id: "plati-form",
    path: "/admin/plugins/edusport-contabilitate?tab=plati",
    alt: "Fereastra Plată nouă, cu Sportiv, Pentru, Sumă, Data și Metodă",
    act: async(page) => {
      await page.getByRole("button", { name: "+ Plată" }).first().click();
      await page.waitForTimeout(1200);
    },
    marks: [
      { n: 2, selector: "input[placeholder='Caută sportiv']" },
      { n: 3, selector: "xpath=(//*[starts-with(normalize-space(text()),'Pentru')])[last()]/following::button[1]" },
    ],
  },
  {
    id: "plati-meniu",
    path: "/admin/plugins/edusport-contabilitate?tab=plati",
    alt: "Meniul ... al unei plăți, cu Editează și Anulează plata",
    act: async(page) => {
      await page.locator("button:has-text('...')").first().click();
      await page.waitForTimeout(600);
    },
    marks: [
      { n: 1, selector: "button:has-text('...')" },
      { n: 2, selector: "[role=menuitem]:has-text('Anulează plata')" },
    ],
  },
  {
    id: "plati-confirma",
    path: "/admin/plugins/edusport-contabilitate?tab=plati",
    alt: "Fereastra Anulează plata, cu textul de confirmare",
    act: async(page) => {
      await page.locator("button:has-text('...')").first().click();
      await page.getByRole("menuitem", { name: "Anulează plata" }).click();
      await page.waitForTimeout(800);
    },
    marks: [{ n: 3, selector: "[role=dialog] button:text-is('Anulează plata'), [role=alertdialog] button:text-is('Anulează plata')" }],
  },
  {
    id: "preturi-liste",
    path: "/admin/plugins/edusport-preturi",
    alt: "Prețuri, cu secțiunile sus și listele de prețuri ale unei secțiuni",
    marks: [
      { n: 1, selector: "[role=tab]:has-text('Club'), button:text-is('Club')" },
    ],
  },
  {
    id: "preturi-editare",
    path: "/admin/plugins/edusport-preturi",
    alt: "Panoul unui preț, cu Preț membri, Preț neafiliați și Salvează",
    act: async(page) => {
      await page.getByText("Abonament 6 ședințe grup").first().click();
      await page.waitForTimeout(1000);
    },
    marks: [
      { n: 2, selector: "xpath=//*[starts-with(normalize-space(text()),'Preț membri')]/following::input[1]" },
      { n: 3, selector: "button:text-is('Salvează')" },
    ],
  },
  {
    id: "inscrieri-lista",
    path: "/admin/plugins/edusport-inscrieri",
    alt: "Lista Înscrieri cu marcajul noi lângă titlu, un rând selectat și panoul înscrierii în dreapta",
    marks: [
      { n: 1, selector: ".sbt-newtag" },
      { n: 2, selector: "tbody tr:first-child td.ins-name" },
      { n: 3, selector: "[role=tab]:has-text('Documente')" },
    ],
  },
  {
    id: "inscrieri-contact",
    path: "/admin/plugins/edusport-inscrieri",
    alt: "Fereastra cu numărul de telefon, mesajul de editat, Status și butoanele Închide, SMS și WhatsApp",
    act: async(page) => {
      await page.locator("button:has-text('Contactează')").first().click();
      await page.waitForTimeout(900);
    },
    marks: [
      { n: 1, selector: "[role=dialog] textarea" },
      { n: 2, selector: "[role=dialog] button:text-is('SMS')" },
      { n: 3, selector: "[role=dialog] button:text-is('WhatsApp')" },
    ],
  },
  {
    id: "inscrieri-confirma",
    path: "/admin/plugins/edusport-inscrieri",
    alt: "Fereastra Confirmă înscrierea, cu secțiunea Sportiv, Grupa și butonul Confirmă înscrierea",
    act: async(page) => {
      await page.locator("button:text-is('Confirmă înscrierea')").first().click();
      await page.waitForTimeout(1500);
    },
    marks: [
      { n: 1, selector: "[role=dialog] .ins-acard" },
      { n: 2, selector: "[role=dialog] .ins-fl" },
      { n: 3, selector: "[role=dialog] button:text-is('Confirmă înscrierea')" },
    ],
  },
  {
    id: "inscrieri-panou-meniu",
    path: "/admin/plugins/edusport-inscrieri",
    alt: "Meniul ... al înscrierii, cu Mută la altă școală și Șterge înscrierea",
    act: async(page) => {
      await page.locator(".ins-ph button:has-text('...')").first().click();
      await page.waitForTimeout(600);
    },
    marks: [
      { n: 1, selector: ".ins-ph button:has-text('...')" },
      { n: 2, selector: "[role=menuitem]:has-text('Mută la altă școală')" },
    ],
  },
  {
    id: "inscrieri-selectie",
    path: "/admin/plugins/edusport-inscrieri",
    alt: "Bara de selecție cu Sezon destinație, Mută în sezon, Mută la altă școală, Arhivează și Șterge",
    act: async(page) => {
      await page.locator("tbody tr").nth(1).locator("input[type=checkbox]").check();
      await page.waitForTimeout(600);
    },
    marks: [
      { n: 1, selector: ".sbt-bulk .ui-select, .sbt-bulk [aria-label='Sezon destinație']" },
      { n: 2, selector: ".sbt-bulk button:text-is('Mută în sezon')" },
    ],
  },
  {
    id: "inscrieri-arhiveaza",
    path: "/admin/plugins/edusport-inscrieri",
    alt: "Bara de selecție, cu butonul Arhivează",
    act: async(page) => {
      await page.locator("tbody tr").nth(1).locator("input[type=checkbox]").check();
      await page.waitForTimeout(600);
    },
    marks: [{ n: 1, selector: ".sbt-bulk button:text-is('Arhivează')" }],
  },
  {
    id: "inscrieri-tot-sezonul",
    path: "/admin/plugins/edusport-inscrieri",
    alt: "Fereastra Mută tot sezonul, cu Din sezonul, În sezonul și Doar înscrierile arhivate",
    act: async(page) => {
      await page.locator(".sbt-season button:text-is('...')").first().click();
      await page.getByRole("menuitem", { name: "Mută tot sezonul..." }).click();
      await page.waitForTimeout(800);
    },
    marks: [
      { n: 1, selector: "[role=dialog] button:has-text('Alege sezonul...')" },
      { n: 2, selector: "[role=dialog] label:has-text('Doar înscrierile arhivate')" },
    ],
  },
  {
    id: "inscrieri-export",
    path: "/admin/plugins/edusport-inscrieri",
    alt: "Meniul Export, cu Descarcă CSV și Formulare goale: Acord și Cerere de adeziune",
    act: async(page) => {
      await page.getByRole("button", { name: "Export" }).click();
      await page.waitForTimeout(600);
    },
    marks: [
      { n: 1, selector: "[role=menuitem]:has-text('Descarcă CSV')" },
      { n: 2, selector: "[role=menuitem]:has-text('Acord (PDF)')" },
      { n: 3, selector: "[role=menuitem]:has-text('Cerere de adeziune (PDF)')" },
    ],
  },
  {
    id: "inscrieri-tel-meniu",
    path: "/admin/plugins/edusport-inscrieri",
    viewport: { width: 390, height: 844 },
    alt: "Înscrieri pe telefon, cu meniul ... deschis: Selectează și Mută tot sezonul",
    act: async(page) => {
      await page.locator(".sbt-season button:text-is('...')").first().click();
      await page.waitForTimeout(600);
    },
    marks: [{ n: 1, selector: "[role=menuitem]:text-is('Selectează')" }],
  },
  {
    id: "inscrieri-tel-selectie",
    path: "/admin/plugins/edusport-inscrieri",
    viewport: { width: 390, height: 844 },
    alt: "Lista pe telefon în selecție: o înscriere bifată, Toate și Gata sus, Mută, Arhivează și Șterge jos",
    act: async(page) => {
      await page.locator(".sbt-season button:text-is('...')").first().click();
      await page.getByRole("menuitem", { name: "Selectează" }).click();
      await page.waitForTimeout(500);
      await page.locator("text=Luca Popa").first().click();
      await page.waitForTimeout(500);
    },
    marks: [
      { n: 1, selector: "button:text-is('Gata')" },
      { n: 2, selector: ".sbt-pselbar button:text-is('Mută...')" },
      { n: 3, selector: ".sbt-pselbar button:text-is('Arhivează')" },
    ],
  },
  {
    id: "inscrieri-tel-muta",
    path: "/admin/plugins/edusport-inscrieri",
    viewport: { width: 390, height: 844 },
    alt: "Fereastra Mută 1 înscriere, cu Sezon destinație și Alege școala",
    act: async(page) => {
      await page.locator(".sbt-season button:text-is('...')").first().click();
      await page.getByRole("menuitem", { name: "Selectează" }).click();
      await page.waitForTimeout(500);
      await page.locator("text=Luca Popa").first().click();
      await page.getByRole("button", { name: "Mută..." }).click();
      await page.waitForTimeout(800);
    },
    marks: [
      { n: 1, selector: "button:text-is('Mută în sezon')" },
      { n: 2, selector: "button:text-is('Mută la altă școală')" },
    ],
  },
  {
    id: "sportivi-lista",
    path: "/admin/plugins/edusport-sportivi",
    alt: "Lista Sportivi, cu căutarea, Sezon, Filtre și butonul Adaugă sportiv",
    marks: [
      { n: 1, selector: "input[placeholder^='Nume, telefon']" },
      { n: 2, selector: "button:has-text('Filtre')" },
      { n: 3, selector: "button:has-text('Adaugă sportiv')" },
    ],
  },
  {
    id: "sportivi-fisa",
    path: "/admin/plugins/edusport-sportivi",
    alt: "Fișa unui sportiv, cu taburile sus și cardul Date cu butonul Editează",
    act: async(page) => {
      await page.getByText("Ana Georgescu").first().click();
      await page.getByRole("button", { name: "Editează" }).waitFor();
      await page.waitForTimeout(800);
    },
    marks: [
      { n: 1, selector: "[role=tab]:has-text('Documente')" },
      { n: 2, selector: "button:text-is('Editează')" },
    ],
  },
  {
    id: "sportivi-editare",
    path: "/admin/plugins/edusport-sportivi",
    alt: "Cardul Date în editare, cu câmpurile și butoanele Renunță și Salvează",
    act: async(page) => {
      await page.getByText("Ana Georgescu").first().click();
      await page.getByRole("button", { name: "Editează" }).click();
      await page.waitForTimeout(800);
    },
    marks: [
      { n: 1, selector: "input[type=email]" },
      { n: 2, selector: "button:text-is('Salvează')" },
    ],
  },
  {
    id: "sportivi-documente",
    path: "/admin/plugins/edusport-sportivi",
    alt: "Tabul Documente, cu PDF-urile înscrierii și butoanele Vezi și Descarcă",
    act: async(page) => {
      await page.getByText("Ana Georgescu").first().click();
      await page.getByRole("tab", { name: "Documente" }).click();
      await page.waitForTimeout(1000);
    },
    marks: [
      { n: 1, selector: "button:has-text('Vezi')" },
      { n: 2, selector: "button:has-text('Descarcă')" },
    ],
  },
  {
    id: "sportivi-parcurs",
    path: "/admin/plugins/edusport-sportivi",
    alt: "Tabul Parcurs, cu selecția și butonul Acordă sus și insignele pe secțiuni",
    act: async(page) => {
      await page.getByText("Ana Georgescu").first().click();
      await page.getByRole("tab", { name: "Parcurs" }).click();
      await page.waitForTimeout(1500);
    },
    marks: [
      { n: 1, selector: "button:has-text('Selectează')" },
      { n: 2, selector: "button:text-is('Acordă')" },
    ],
  },
  {
    id: "grupe-lista",
    path: "/admin/plugins/edusport-grupe",
    alt: "Lista grupelor din Grupe, cu sezonul, secțiunile și butonul Grupă nouă",
    act: async(page) => {
      await page.waitForTimeout(1500);
    },
    marks: [
      { n: 1, selector: "button:has-text('Sezon 20')" },
      { n: 2, selector: "button:has-text('Grupă nouă')" },
      { n: 3, selector: "td:has-text('Avansați Gold')" },
    ],
  },
  {
    id: "grupe-noua",
    path: "/admin/plugins/edusport-grupe",
    alt: "Fereastra Grupă nouă, cu Nume, Listă de prețuri, Antrenori și Program public",
    act: async(page) => {
      await page.getByRole("button", { name: "Grupă nouă" }).first().click();
      await page.waitForTimeout(1200);
    },
    marks: [
      { n: 1, selector: "[role=dialog] input:not([type=checkbox])" },
      { n: 2, selector: "button:text-is('Creează grupa')" },
    ],
  },
  {
    id: "grupe-fisa",
    path: "/admin/plugins/edusport-grupe",
    alt: "Pagina unei grupe, cu antrenorii, taburile și butonul Adaugă sportivi",
    act: async(page) => {
      await page.getByText("Avansați Gold").first().click();
      await page.getByRole("button", { name: "Adaugă sportivi" }).waitFor();
      await page.waitForTimeout(800);
    },
    marks: [
      { n: 1, selector: "[role=tab]:has-text('Program')" },
      { n: 2, selector: "button:has-text('Adaugă sportivi')" },
    ],
  },
  {
    id: "grupe-program",
    path: "/admin/plugins/edusport-grupe",
    alt: "Tabul Program al unei grupe, cu programul obișnuit și calendarul lunii",
    act: async(page) => {
      await page.getByText("Avansați Gold").first().click();
      await page.getByRole("tab", { name: "Program" }).click();
      await page.waitForTimeout(1500);
    },
    marks: [
      { n: 1, selector: "button:text-is('Schimbă')" },
      { n: 2, selector: "button:has-text('Adaugă program')" },
    ],
  },
  {
    id: "grupe-program-nou",
    path: "/admin/plugins/edusport-grupe",
    alt: "Panoul Program nou, cu Se repetă, zilele, ora și Se aplică din",
    act: async(page) => {
      await page.getByText("Avansați Gold").first().click();
      await page.getByRole("tab", { name: "Program" }).click();
      await page.waitForTimeout(1200);
      await page.getByRole("button", { name: "Adaugă program" }).click();
      await page.waitForTimeout(1200);
    },
    marks: [
      { n: 1, selector: "[role=group][aria-label='Zile']" },
      { n: 2, selector: "button:text-is('Salvează')" },
    ],
  },
  {
    id: "program-data",
    path: "/admin/plugins/edusport-program",
    alt: "Panoul unei date din calendar, cu Ține, Anulează și Mută și caseta Anunță părinții pe e-mail",
    act: async(page) => {
      await page.getByText("Avansați Gold").first().click();
      await page.waitForTimeout(1000);
      await page.getByText("Anulează", { exact: true }).first().click();
      await page.waitForTimeout(800);
    },
    marks: [
      { n: 1, selector: "label:has-text('Anunță părinții pe e-mail')" },
      { n: 2, selector: "button:text-is('Salvează')" },
    ],
  },
  {
    id: "program-calendar",
    path: "/admin/plugins/edusport-program",
    alt: "Pagina Program, cu calendarul lunii, butonul Adaugă și butonul Adaugă pauză",
    marks: [
      { n: 1, selector: "button:has-text('Adaugă pauză')" },
      { n: 2, selector: "button:text-is('Adaugă'), button:has-text('Adaugă'):not(:has-text('pauză'))" },
      { n: 3, selector: "button:text-is('Listă')" },
    ],
  },
  {
    id: "program-eveniment",
    path: "/admin/plugins/edusport-program",
    alt: "Panoul Adaugă eveniment, cu Titlu, Categorie, ora și Se repetă",
    act: async(page) => {
      await page.waitForTimeout(1500);
      await page.locator("button:has-text('Adaugă'):not(:has-text('pauză'))").last().click();
      await page.waitForTimeout(1200);
    },
    marks: [
      { n: 1, selector: "text=Se repetă" },
      { n: 2, selector: "button:text-is('Salvează')" },
    ],
  },
  {
    id: "program-pauza",
    path: "/admin/plugins/edusport-program",
    alt: "Fereastra Pauză nouă, cu Nume, De la, Până la și lista ședințelor care se anulează",
    act: async(page) => {
      await page.getByRole("button", { name: "Adaugă pauză" }).click();
      await page.waitForTimeout(800);
      await page.locator("text=Nume >> xpath=following::input[1]").fill("Vacanța de iarnă");
      const dates = page.locator("input[type=date]");
      await dates.nth(0).fill("2026-12-24");
      await dates.nth(1).fill("2027-01-03");
      await page.waitForTimeout(1500);
    },
    marks: [
      { n: 1, selector: "text=Nume >> xpath=following::input[1]" },
      { n: 2, selector: ".gtt-box" },
    ],
  },
  {
    id: "anunturi-lista",
    path: "/admin/plugins/edusport-anunturi",
    alt: "Lista Anunțuri, cu butoanele Filtre și Anunț nou",
    marks: [{ n: 1, selector: "button:has-text('Anunț nou')" }],
  },
  {
    id: "anunturi-noul",
    path: "/admin/plugins/edusport-anunturi",
    alt: "Formularul Anunț nou, cu Portal sportiv bifat și alegerea grupelor",
    act: async(page) => {
      await page.getByRole("button", { name: "+ Anunț nou" }).click();
      await page.getByText("Portal sportiv", { exact: true }).first().click();
      await page.waitForTimeout(1200);
    },
    marks: [
      { n: 1, selector: "label:has-text('Portal sportiv')" },
      { n: 2, selector: "button:text-is('Grupe alese')" },
    ],
  },
  {
    id: "prezenta-lista",
    path: "/admin/plugins/edusport-prezenta",
    alt: "Prezență, tabul Toate ședințele, cu ședințele săptămânii și starea fiecăreia",
    marks: [
      { n: 1, selector: "button:has-text('Ședință nouă')" },
      { n: 2, selector: "tr:has-text('Avansați Gold')" },
    ],
  },
  {
    id: "prezenta-noua",
    path: "/admin/plugins/edusport-prezenta",
    alt: "Fereastra Ședință nouă, cu Grupă, Data, Ora, Durata și Antrenor",
    act: async(page) => {
      await page.getByRole("button", { name: "+ Ședință nouă" }).click();
      await page.waitForTimeout(1000);
    },
    marks: [
      { n: 1, selector: "button:text-is('Continuă')" },
    ],
  },
  {
    id: "prezenta-panou",
    path: "/admin/plugins/edusport-prezenta",
    alt: "Panoul unei ședințe, cu antrenorii, lista sportivilor cu caseta Grup și butonul Salvează",
    act: async(page) => {
      await page.getByText("Avansați Gold").first().click();
      await page.getByText("Ana Georgescu").first().waitFor();
      await page.waitForTimeout(1000);
    },
    marks: [
      { n: 1, selector: "input[aria-label^='Grup, Ana Georgescu']" },
      { n: 2, selector: "button:text-is('Salvează')" },
    ],
  },
  {
    id: "prezenta-salvata",
    path: "/admin/plugins/edusport-grupe",
    alt: "O ședință salvată, cu rândul Salvată de și Istoricul ședinței",
    act: async(page) => {
      await page.getByText("Avansați Gold").first().click();
      await page.getByRole("tab", { name: /Prezență/ }).click();
      await page.waitForTimeout(1200);
      await page.getByText("Mie 11 noi").first().click();
      await page.getByText("Istoric", { exact: true }).last().scrollIntoViewIfNeeded();
      await page.waitForTimeout(800);
    },
    marks: [
      { n: 1, selector: "text=/Salvată de/" },
      { n: 2, selector: "button:text-is('Salvează')" },
    ],
  },
  {
    id: "tabele-lista",
    path: "/admin/plugins/edusport-tabele",
    alt: "Pagina Tabele, cu lista Gata făcute în stânga și tabelul Plăți pe grupă luna aceasta",
    act: async(page) => {
      await page.getByRole("button", { name: "Restanțe" }).waitFor();
      await page.waitForTimeout(1000);
    },
    marks: [{ n: 1, selector: "button.tbl-rail-item:has-text('Restanțe')" }],
  },
  {
    id: "tabele-filtru",
    path: "/admin/plugins/edusport-tabele",
    alt: "Butonul Filtru deschis, cu câmpurile Grupă, Secțiune, Antrenor, Membru A.C.S. și Stare",
    act: async(page) => {
      await page.getByRole("button", { name: "Filtru" }).first().click();
      await page.waitForTimeout(800);
    },
    marks: [
      { n: 1, selector: "button:has-text('Filtru')" },
      { n: 2, selector: ".tbl-pop button.tbl-field:has-text('Stare')" },
    ],
  },
  {
    id: "tabele-coloane",
    path: "/admin/plugins/edusport-tabele",
    alt: "Lista Coloane deschisă, cu casete de bifat și săgeți sus și jos",
    act: async(page) => {
      await page.getByRole("button", { name: /Coloane/ }).click();
      await page.waitForTimeout(800);
    },
    marks: [
      { n: 1, selector: "button:has-text('Coloane')" },
      { n: 2, selector: "label:has-text('Vârstă')" },
    ],
  },
  {
    id: "tabele-salveaza",
    path: "/admin/plugins/edusport-tabele",
    alt: "Fereastra Vizualizare nouă, cu câmpul Nume și butonul Salvează",
    act: async(page) => {
      await page.getByRole("button", { name: "Salvează tabelul" }).click();
      await page.waitForTimeout(800);
    },
    marks: [
      { n: 1, selector: "[role=dialog] input" },
      { n: 2, selector: "[role=dialog] button:text-is('Salvează')" },
    ],
  },
  {
    id: "tabele-actiuni",
    path: "/admin/plugins/edusport-tabele",
    alt: "Meniul ... al unui tabel salvat, cu Redenumește, Duplică și Șterge",
    act: async(page) => {
      await page.getByRole("button", { name: "Plati Sezon 2026-2027" }).click();
      await page.waitForTimeout(1000);
      await page.locator(".tbl-rail-menu button").first().click();
      await page.waitForTimeout(800);
    },
    marks: [
      { n: 1, selector: ".tbl-rail-menu button" },
      { n: 2, selector: "[role=menuitem]:text-is('Șterge')" },
    ],
  },
  {
    id: "tabele-descarca",
    path: "/admin/plugins/edusport-tabele",
    alt: "Butonul Descarcă Excel și meniul Alte formate, cu Excel și CSV",
    act: async(page) => {
      await page.getByRole("button", { name: "Alte formate" }).click();
      await page.waitForTimeout(800);
    },
    marks: [
      { n: 1, selector: "button:has-text('Descarcă Excel')" },
      { n: 2, selector: "[role=menuitem]:text-is('CSV')" },
    ],
  },
  {
    id: "echipa-utilizatori",
    path: "/admin/settings/users",
    alt: "Pagina Utilizatori din Setări, cu butonul Invită utilizator nou și lista administratorilor",
    act: async(page) => {
      await page.evaluate(() => localStorage.setItem("strapi-admin-language", "ro"));
      await page.reload({ waitUntil: "networkidle" });
      await page.getByRole("button", { name: "Invită utilizator nou" }).waitFor();
      await page.waitForTimeout(800);
    },
    marks: [{ n: 1, selector: "button:has-text('Invită utilizator nou')" }],
  },
  {
    id: "echipa-invita",
    path: "/admin/settings/users",
    alt: "Fereastra Invită utilizator nou, cu Prenume, Nume, Email și Rolurile utilizatorului",
    act: async(page) => {
      await page.evaluate(() => localStorage.setItem("strapi-admin-language", "ro"));
      await page.reload({ waitUntil: "networkidle" });
      await page.getByRole("button", { name: "Invită utilizator nou" }).click();
      await page.getByRole("dialog").waitFor();
      await page.waitForTimeout(800);
    },
    marks: [
      { n: 1, selector: "[role=dialog] input[name=email]" },
      { n: 2, selector: "[role=dialog] [role=combobox]" },
      { n: 3, selector: "[role=dialog] button:has-text('Invită utilizator')" },
    ],
  },
  {
    id: "echipa-rol",
    path: "/admin/settings/users/1",
    alt: "Pagina de editare a unui administrator, cu Activ, Rolurile utilizatorului și bara Modificări nesalvate cu Salvează",
    act: async(page) => {
      await page.evaluate(() => localStorage.setItem("strapi-admin-language", "ro"));
      await page.reload({ waitUntil: "networkidle" });
      await page.getByText("Rolurile utilizatorului").first().waitFor();
      // Unsaved on purpose: it only makes the bottom bar with Salvează appear. The page is left without saving.
      await page.locator("input[name=isActive]").click();
      await page.waitForTimeout(800);
    },
    marks: [
      { n: 1, selector: "[role=combobox]" },
      { n: 2, selector: "text=/^fals$/i" },
      { n: 3, selector: "button:has-text('Salvează') >> nth=1" },
    ],
  },
  {
    id: "echipa-cont-portal",
    path: "/admin/plugins/edusport-membri",
    alt: "Fereastra Editează membrul, cu blocul Cont portal, E-mail pentru cont și Trimite invitația",
    act: async(page) => {
      await page.getByText("Irina Test Antrenor").click();
      await page.getByText("Cont portal").waitFor();
      await page.waitForTimeout(1000);
    },
    marks: [
      { n: 1, selector: "section[aria-label='Cont portal'] input[type=email]" },
      { n: 2, selector: "button:text-is('Trimite invitația')" },
    ],
  },
];
