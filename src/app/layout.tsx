import type { Metadata } from "next";
import "./globals.css";
import { Footer, Header } from "../components/blocks";

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
      <body>
        <Header />
        <main className="pt-36">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
