import type { Metadata } from "next";
import "./globals.css";
import { Footer, Header } from "../blocks";

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
        {children}
        <Footer />
      </body>
    </html>
  );
}
