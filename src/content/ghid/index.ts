import type { GhidGroup, ShotData } from "@/lib/ghid/types";
import shotsJson from "./shots.json";
import { ceEsteEdusportPage } from "./pages/ce-este-edusport";
import { sigurantaPage } from "./pages/siguranta";
import { intraInPanouPage } from "./pages/intra-in-panou";
import { meniulSiPaginaAcasaPage } from "./pages/meniul-si-pagina-acasa";
import { contulTauPage } from "./pages/contul-tau-parola-si-2fa";
import { inceputDeSezonPage } from "./pages/inceput-de-sezon";
import { contabilitatePage } from "./pages/contabilitate";
import { inregistreazaPlataPage } from "./pages/inregistreaza-o-plata";
import { anuleazaPlataPage } from "./pages/anuleaza-o-plata";
import { preturiPage } from "./pages/preturi";
import { citesteInscrierilePage } from "./pages/citeste-inscrierile";
import { contacteazaParintePage } from "./pages/contacteaza-parintele";
import { confirmaInscrierePage } from "./pages/confirma-o-inscriere";
import { mutaSezonScoalaPage } from "./pages/muta-in-alt-sezon-sau-la-alta-scoala";
import { arhiveazaStergeInscrieriPage } from "./pages/arhiveaza-sau-sterge-inscrieri";
import { descarcaListaFormularePage } from "./pages/descarca-lista-si-formularele-goale";
import { alteFormularePage } from "./pages/alte-formulare-contact-voluntari-parteneri";
import { fisaSportivuluiPage } from "./pages/fisa-sportivului";
import { actualizeazaDateleSportivuluiPage } from "./pages/actualizeaza-datele-sportivului";
import { documenteleSportivuluiPage } from "./pages/documentele-sportivului";
import { parcursInsignePage } from "./pages/parcurs-si-insigne";
import { grupelePage } from "./pages/grupele";
import { programulUneiGrupePage } from "./pages/programul-unei-grupe";
import { calendarSiSeriiPage } from "./pages/calendar-si-serii";
import { pauzePage } from "./pages/pauze";
import { anunturiPage } from "./pages/anunturi";
import { completeazaPrezentaPage } from "./pages/completeaza-prezenta";
import { corecteazaPrezentaPage } from "./pages/corecteaza-o-prezenta";
import { deschideFiltreazaTabelPage } from "./pages/deschide-si-filtreaza-un-tabel";
import { salveazaTabelPage } from "./pages/salveaza-un-tabel";
import { descarcaTabelPage } from "./pages/descarca-un-tabel";
import { adaugaAdministratorPage } from "./pages/adauga-un-administrator";
import { roluriPage } from "./pages/roluri";
import { accesAntrenorPortalPage } from "./pages/acces-antrenor-in-portal";
import { paginiSitePage } from "./pages/pagini-site";
import { articolePage } from "./pages/articole";
import { imaginiInMediaPage } from "./pages/imagini-in-media";
import { competitiiPage } from "./pages/competitii";
import { exportaDateleSportivuluiPage } from "./pages/exporta-datele-unui-sportiv";
import { anonimizeazaSportivPage } from "./pages/anonimizeaza-un-sportiv";
import { ceRamaneDupaAnonimizarePage } from "./pages/ce-ramane-dupa-anonimizare";
import { sportiviInactiviPage } from "./pages/sportivi-inactivi";
import { gazduirePage } from "./pages/gazduire";

/** The wiki tree: group, page. Add a page module under ./pages and list it here, in reading order. */
export const GHID_GROUPS: GhidGroup[] = [
  { title: "Început", pages: [ceEsteEdusportPage, intraInPanouPage, meniulSiPaginaAcasaPage, contulTauPage, inceputDeSezonPage] },
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
  { title: "Sportivi", pages: [fisaSportivuluiPage, actualizeazaDateleSportivuluiPage, documenteleSportivuluiPage, parcursInsignePage] },
  { title: "Grupe și program", pages: [grupelePage, programulUneiGrupePage, calendarSiSeriiPage, pauzePage, anunturiPage] },
  { title: "Prezență", pages: [completeazaPrezentaPage, corecteazaPrezentaPage] },
  {
    title: "Bani",
    pages: [contabilitatePage, inregistreazaPlataPage, anuleazaPlataPage, preturiPage, deschideFiltreazaTabelPage, salveazaTabelPage, descarcaTabelPage],
  },
  { title: "Site și anunțuri", pages: [paginiSitePage, articolePage, imaginiInMediaPage, competitiiPage] },
  {
    title: "Echipa și acces",
    pages: [
      adaugaAdministratorPage,
      roluriPage,
      accesAntrenorPortalPage,
      exportaDateleSportivuluiPage,
      anonimizeazaSportivPage,
      ceRamaneDupaAnonimizarePage,
      sportiviInactiviPage,
    ],
  },
  { title: "Despre EduSport", pages: [sigurantaPage, gazduirePage] },
];

/** Screenshot metadata by id; the image is content/ghid/img/<id>.jpg. */
export const GHID_SHOTS: Record<string, ShotData> = shotsJson as unknown as Record<string, ShotData>;
