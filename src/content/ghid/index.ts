import type { GhidGroup, ShotData } from "@/lib/ghid/types";
import shotsJson from "./shots.json";
import { desprePage } from "./pages/despre-sistem";
import { sigurantaPage } from "./pages/siguranta";
import { primiiPasiPage } from "./pages/primii-pasi";

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
];

/** Screenshot metadata by id; the image is content/ghid/img/<id>.jpg. */
export const GHID_SHOTS: Record<string, ShotData> = shotsJson as unknown as Record<string, ShotData>;
