import type { MetadataRoute } from "next";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: "EduSport",
    description: SITE_DESCRIPTION,
    lang: "ro",
    start_url: "/",
    display: "standalone",
    background_color: "#fbf8f1", // retro-cream
    theme_color: "#0e1a3c", // navy
    icons: [{ src: "/favicon.ico", sizes: "any", type: "image/x-icon" }],
  };
}
