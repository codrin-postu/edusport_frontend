import type { Metadata } from "next";
import "./globals.css";
import { FooterReveal, Header } from "../components/blocks";
import { PageTransitionOverlay } from "../components/PageTransition";

export const metadata: Metadata = {
  title: "Scoala de patinaj EduSport",
  description: "Scoala de patinaj EduSport",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Climate+Crisis&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-edusport-blue">
        <Header />
        <main
          className="relative z-10 pt-20 bg-white lg:overflow-clip"
          style={{ marginBottom: "var(--footer-height, 0px)" }}
        >
          {children}
        </main>
        <FooterReveal />
        <PageTransitionOverlay />
      </body>
    </html>
  );
}
