import { ImageResponse } from "next/og";

/**
 * App-root OG image (auto-applied to every route's og:image + twitter:image
 * via the Next file convention). Retro-branded card, generated at request time,
 * so there is no binary in the repo and the previous /og-image.jpg 404 is gone.
 *
 * Uses the bundled default sans (bolded) rather than League Spartan to avoid a
 * font fetch at render time; swap in the real display font later by loading the
 * font file into `fonts` if an exact match is needed.
 */

export const alt = "EduSport - Școala de Patinaj";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#0e1a3c",
          color: "#fbf8f1",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            width: 120,
            height: 10,
            background: "#be3330",
            marginBottom: 44,
          }}
        />
        <div style={{ fontSize: 128, fontWeight: 800, letterSpacing: "-5px", lineHeight: 1 }}>
          EDUSPORT
        </div>
        <div style={{ fontSize: 46, fontWeight: 700, color: "#fbbf24", marginTop: 18 }}>
          Școala de Patinaj
        </div>
        <div style={{ fontSize: 30, color: "rgba(251,248,241,0.72)", marginTop: 26 }}>
          Patinaj artistic pentru copii și adulți · București
        </div>
      </div>
    ),
    { ...size },
  );
}
