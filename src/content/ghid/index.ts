import type { GhidGroup, ShotData } from "@/lib/ghid/types";
import shotsJson from "./shots.json";
import { desprePage } from "./pages/despre-sistem";
import { sigurantaPage } from "./pages/siguranta";
import { primiiPasiPage } from "./pages/primii-pasi";
import { contabilitatePage } from "./pages/contabilitate";
import { inregistreazaPlataPage } from "./pages/inregistreaza-o-plata";
import { anuleazaPlataPage } from "./pages/anuleaza-o-plata";
import { preturiPage } from "./pages/preturi";
import { primesteInscrieriPage } from "./pages/primeste-si-citeste-inscrieri";
import { trimiteMesajPage } from "./pages/trimite-un-mesaj";
import { confirmaInscrierePage } from "./pages/confirma-o-inscriere";
import { mutaSezonScoalaPage } from "./pages/muta-la-alt-sezon-sau-scoala";
import { arhiveazaExportaPage } from "./pages/arhiveaza-si-exporta";
import { selecteazaTelefonPage } from "./pages/selecteaza-pe-telefon";
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

/** The wiki tree: group, topic, page. Add a page module under ./pages and list it here, in reading order. */
export const GHID_GROUPS: GhidGroup[] = [
  {
    title: "Început",
    topics: [
      { title: "Despre sistem", pages: [desprePage] },
      { title: "Siguranță", pages: [sigurantaPage] },
      { title: "Primii pași", pages: [primiiPasiPage] },
    ],
  },
  {
    title: "Club",
    topics: [
      {
        title: "Înscrieri",
        pages: [primesteInscrieriPage, trimiteMesajPage, confirmaInscrierePage, mutaSezonScoalaPage, arhiveazaExportaPage, selecteazaTelefonPage],
      },
      {
        title: "Sportivi",
        pages: [fisaSportivuluiPage, actualizeazaDateleSportivuluiPage, documenteleSportivuluiPage, parcursInsignePage],
      },
      {
        title: "Grupe și program",
        pages: [grupelePage, programulUneiGrupePage, calendarSiSeriiPage, pauzePage, anunturiPage],
      },
      { title: "Prezență", pages: [completeazaPrezentaPage, corecteazaPrezentaPage] },
      { title: "Plăți", pages: [contabilitatePage, inregistreazaPlataPage, anuleazaPlataPage, preturiPage] },
      { title: "Tabele", pages: [deschideFiltreazaTabelPage, salveazaTabelPage, descarcaTabelPage] },
    ],
  },
  {
    title: "Administrare",
    topics: [{ title: "Echipa", pages: [adaugaAdministratorPage, roluriPage, accesAntrenorPortalPage] }],
  },
];

/** Screenshot metadata by id; the image is content/ghid/img/<id>.jpg. */
export const GHID_SHOTS: Record<string, ShotData> = shotsJson as unknown as Record<string, ShotData>;
