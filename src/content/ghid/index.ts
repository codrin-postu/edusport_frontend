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
      { title: "Plăți", pages: [contabilitatePage, inregistreazaPlataPage, anuleazaPlataPage, preturiPage] },
    ],
  },
];

/** Screenshot metadata by id; the image is content/ghid/img/<id>.jpg. */
export const GHID_SHOTS: Record<string, ShotData> = shotsJson as unknown as Record<string, ShotData>;
