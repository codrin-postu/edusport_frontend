import type { Metadata } from "next";
import Button from "@/components/ui/button";

// Where the backend (plan 2D) redirects a PDF link whose 24-hour token is
// expired or invalid. Always on: it is not switched with the Înscrieri page,
// because the link comes from an e-mail.
export const metadata: Metadata = {
  title: "Linkul a expirat",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <div className="min-h-screen bg-surface text-primary flex items-center justify-center gutter py-24">
      <div className="max-w-xl w-full text-center flex flex-col items-center gap-6">
        <h1 className="text-heading text-primary">Linkul a expirat</h1>
        <p className="text-body text-secondary">Documentele sunt atașate în e-mailul de înscriere.</p>
        <Button face="black" href="/">
          Înapoi la site
        </Button>
      </div>
    </div>
  );
}
