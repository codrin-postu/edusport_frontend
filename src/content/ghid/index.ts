import type { GhidGroup, ShotData } from "@/lib/ghid/types";
import shotsJson from "./shots.json";
import { ceEsteEdusportPage } from "./pages/ce-este-edusport";
import { ceSeSchimbaFataDeAcumPage } from "./pages/ce-se-schimba-fata-de-acum";
import { cumLucreazaImpreunaPage } from "./pages/cum-lucreaza-impreuna";
import { siteulPublicPage } from "./pages/site-ul-public";
import { panoulDeAdministrarePage } from "./pages/panoul-de-administrare";
import { portalulAntrenoruluiPage } from "./pages/portalul-antrenorului";
import { portalulSportivuluiPage } from "./pages/portalul-sportivului";
import { serviciiDinSpatePage } from "./pages/servicii-din-spate";
import { sigurantaPage } from "./pages/siguranta";
import { intraInPanouPage } from "./pages/intra-in-panou";
import { meniulSiPaginaAcasaPage } from "./pages/meniul-si-pagina-acasa";
import { contulTauPage } from "./pages/contul-tau-parola-si-2fa";
import { inceputDeSezonPage } from "./pages/inceput-de-sezon";
import { contabilitatePage } from "./pages/contabilitate-pe-scurt";
import { inregistreazaPlataPage } from "./pages/inregistreaza-o-plata";
import { anuleazaPlataPage } from "./pages/corecteaza-sau-anuleaza-o-plata";
import { abonamentPage } from "./pages/adauga-sau-prelungeste-un-abonament";
import { preturiPage } from "./pages/preturi";
import { citesteInscrierilePage } from "./pages/citeste-inscrierile";
import { contacteazaParintePage } from "./pages/contacteaza-parintele";
import { confirmaInscrierePage } from "./pages/confirma-o-inscriere";
import { mutaSezonScoalaPage } from "./pages/muta-in-alt-sezon-sau-la-alta-scoala";
import { arhiveazaStergeInscrieriPage } from "./pages/arhiveaza-sau-sterge-inscrieri";
import { descarcaListaFormularePage } from "./pages/descarca-lista-si-formularele-goale";
import { alteFormularePage } from "./pages/alte-formulare-contact-voluntari-parteneri";
import { gasesteUnSportivPage } from "./pages/gaseste-un-sportiv";
import { adaugaUnSportivPage } from "./pages/adauga-un-sportiv";
import { fisaSportivuluiPage } from "./pages/fisa-sportivului";
import { schimbaDateleUnuiSportivPage } from "./pages/schimba-datele-unui-sportiv";
import { documenteleSportivuluiPage } from "./pages/documentele-sportivului";
import { parcursInsignePage } from "./pages/parcurs-si-insigne";
import { profilPublicSiRezultatePage } from "./pages/profil-public-si-rezultate";
import { unesteMarcheazaStergePage } from "./pages/uneste-marcheaza-inactiv-sau-sterge-un-sportiv";
import { creeazaGrupaPage } from "./pages/creeaza-o-grupa";
import { sportiviiUneiGrupePage } from "./pages/sportivii-unei-grupe";
import { programulUneiGrupePage } from "./pages/programul-unei-grupe";
import { anuleazaSauMutaSedintaPage } from "./pages/anuleaza-sau-muta-o-sedinta";
import { calendarSiEvenimentePage } from "./pages/calendar-si-evenimente";
import { pauzeSiVacantePage } from "./pages/pauze-si-vacante";
import { anunturiPage } from "./pages/anunturi";
import { completeazaPrezentaPage } from "./pages/completeaza-prezenta";
import { adaugaSedintaInAfaraProgramuluiPage } from "./pages/adauga-o-sedinta-in-afara-programului";
import { corecteazaPrezentaPage } from "./pages/corecteaza-o-prezenta";
import { prezentaPeOLunaPage } from "./pages/prezenta-pe-o-luna";
import { lectiiIndividualePage } from "./pages/lectii-individuale";
import { deschideFiltreazaTabelPage } from "./pages/deschide-si-filtreaza-un-tabel";
import { salveazaTabelPage } from "./pages/salveaza-un-tabel";
import { descarcaTabelPage } from "./pages/descarca-un-tabel";
import { adaugaAdministratorPage } from "./pages/adauga-un-administrator";
import { roluriPage } from "./pages/roluri";
import { accesAntrenorPortalPage } from "./pages/acces-antrenor-in-portal";
import { paginiSitePage } from "./pages/paginile-site-ului";
import { articolePage } from "./pages/articole";
import { imaginiInMediaPage } from "./pages/imagini-in-media";
import { competitiiPage } from "./pages/competitii-si-rezultate";
import { echipaSponsoriPage } from "./pages/echipa-sponsori-si-alte-liste";
import { setariSitePage } from "./pages/setari-site";
import { schimbaRolulPage } from "./pages/schimba-rolul-sau-opreste-accesul";
import { exportaDateleSportivuluiPage } from "./pages/exporta-datele-unui-sportiv";
import { anonimizeazaSportivPage } from "./pages/anonimizeaza-un-sportiv";
import { ceRamaneDupaAnonimizarePage } from "./pages/ce-ramane-dupa-anonimizare";
import { sportiviInactiviPage } from "./pages/sportivi-inactivi";
import { cumFunctioneazaContulPage } from "./pages/cum-functioneaza-contul-de-parinte";
import { invitaParinteInPortalPage } from "./pages/invita-un-parinte-in-portal";
import { ceVedeParinteleaPage } from "./pages/ce-vede-si-ce-poate-face-parintele";
import { parinteleNuPoateIntraPage } from "./pages/parintele-nu-poate-intra";
import { schimbaEmailulSportivPage } from "./pages/schimba-e-mailul-unui-sportiv";
import { scoateAccesulParintePage } from "./pages/scoate-accesul-unui-parinte";
import { emailuriAutomatePage } from "./pages/e-mailuri-automate";
import { cePoateFaceFiecareRolPage } from "./pages/ce-poate-face-fiecare-rol";
import { ceVedeAntrenorulPage } from "./pages/ce-vede-si-ce-poate-face-antrenorul";
import { aiUitatParolaPage } from "./pages/ai-uitat-parola";
import { parinteCereDatelePage } from "./pages/un-parinte-cere-datele-sau-stergerea";
import { hostingPage } from "./pages/hosting";
import { ceItiTrebuiePage } from "./pages/ce-iti-trebuie";
import { pregatesteServerulPage } from "./pages/pregateste-serverul";
import { nginxSiHttpsPage } from "./pages/nginx-si-https";
import { instaleazaPanoulPage } from "./pages/instaleaza-panoul-de-administrare";
import { instaleazaSiteulPage } from "./pages/instaleaza-site-ul";
import { portalurileOptionalPage } from "./pages/portalurile-optional";
import { serviciiOptionalePage } from "./pages/servicii-optionale";
import { mutaDateleDePeServerulVechiPage } from "./pages/muta-datele-de-pe-serverul-vechi";
import { copiiSiVerificareaFinalaPage } from "./pages/copii-de-siguranta-si-verificarea-finala";

/** The wiki tree: group, page. Add a page module under ./pages and list it here, in reading order. */
export const GHID_GROUPS: GhidGroup[] = [
  {
    title: "Ce este EduSport",
    pages: [
      ceEsteEdusportPage,
      ceSeSchimbaFataDeAcumPage,
      cumLucreazaImpreunaPage,
      siteulPublicPage,
      panoulDeAdministrarePage,
      portalulAntrenoruluiPage,
      portalulSportivuluiPage,
      serviciiDinSpatePage,
      sigurantaPage,
      hostingPage,
    ],
  },
  { title: "Primii pași", pages: [intraInPanouPage, meniulSiPaginaAcasaPage, contulTauPage, inceputDeSezonPage] },
  {
    title: "Înscrieri",
    pages: [
      citesteInscrierilePage,
      contacteazaParintePage,
      confirmaInscrierePage,
      mutaSezonScoalaPage,
      arhiveazaStergeInscrieriPage,
      descarcaListaFormularePage,
      alteFormularePage,
    ],
  },
  {
    title: "Sportivi",
    pages: [
      gasesteUnSportivPage,
      adaugaUnSportivPage,
      fisaSportivuluiPage,
      schimbaDateleUnuiSportivPage,
      documenteleSportivuluiPage,
      parcursInsignePage,
      profilPublicSiRezultatePage,
      unesteMarcheazaStergePage,
    ],
  },
  {
    title: "Grupe și program",
    pages: [creeazaGrupaPage, sportiviiUneiGrupePage, programulUneiGrupePage, anuleazaSauMutaSedintaPage, calendarSiEvenimentePage, pauzeSiVacantePage],
  },
  {
    title: "Prezență",
    pages: [completeazaPrezentaPage, adaugaSedintaInAfaraProgramuluiPage, corecteazaPrezentaPage, prezentaPeOLunaPage, lectiiIndividualePage],
  },
  {
    title: "Contabilitate",
    pages: [contabilitatePage, inregistreazaPlataPage, anuleazaPlataPage, abonamentPage, preturiPage, deschideFiltreazaTabelPage, salveazaTabelPage, descarcaTabelPage],
  },
  {
    title: "Site și anunțuri",
    pages: [anunturiPage, paginiSitePage, articolePage, imaginiInMediaPage, competitiiPage, echipaSponsoriPage, setariSitePage],
  },
  {
    title: "Echipă și acces",
    pages: [
      roluriPage,
      cePoateFaceFiecareRolPage,
      adaugaAdministratorPage,
      schimbaRolulPage,
      accesAntrenorPortalPage,
      ceVedeAntrenorulPage,
      aiUitatParolaPage,
      parinteCereDatelePage,
      exportaDateleSportivuluiPage,
      anonimizeazaSportivPage,
      ceRamaneDupaAnonimizarePage,
      sportiviInactiviPage,
    ],
  },
  {
    title: "Portalul părinților",
    pages: [
      cumFunctioneazaContulPage,
      invitaParinteInPortalPage,
      ceVedeParinteleaPage,
      parinteleNuPoateIntraPage,
      schimbaEmailulSportivPage,
      scoateAccesulParintePage,
      emailuriAutomatePage,
    ],
  },
  {
    title: "Instalare pe un server nou",
    pages: [
      ceItiTrebuiePage,
      pregatesteServerulPage,
      nginxSiHttpsPage,
      instaleazaPanoulPage,
      instaleazaSiteulPage,
      portalurileOptionalPage,
      serviciiOptionalePage,
      mutaDateleDePeServerulVechiPage,
      copiiSiVerificareaFinalaPage,
    ],
  },
];

/** Screenshot metadata by id; the image is content/ghid/img/<id>.jpg. */
export const GHID_SHOTS: Record<string, ShotData> = shotsJson as unknown as Record<string, ShotData>;
