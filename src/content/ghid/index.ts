import type { GhidGroup, ShotData } from "@/lib/ghid/types";
import shotsJson from "./shots.json";
import { desprePage } from "./pages/despre-sistem";
import { sigurantaPage } from "./pages/siguranta";
import { primiiPasiPage } from "./pages/primii-pasi";
import { contabilitatePage } from "./pages/contabilitate";
import { inregistreazaPlataPage } from "./pages/inregistreaza-o-plata";
import { anuleazaPlataPage } from "./pages/anuleaza-o-plata";
import { preturiPage } from "./pages/preturi";

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
    topics: [{ title: "Plăți", pages: [contabilitatePage, inregistreazaPlataPage, anuleazaPlataPage, preturiPage] }],
  },
];

/** Screenshot metadata by id; the image is content/ghid/img/<id>.jpg. */
export const GHID_SHOTS: Record<string, ShotData> = shotsJson as unknown as Record<string, ShotData>;
