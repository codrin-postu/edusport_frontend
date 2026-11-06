import Card from "@/components/ui/card";

/** Centred phone card with the EDUSPORT wordmark, shared by the login, reset and invite screens. */
export function AuthFrame({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <main className="min-h-svh w-full flex items-center justify-center gutter py-8">
      <div className="w-full max-w-sm">
        <p className="text-header-logo text-branding-font text-primary text-center mb-6">EDUSPORT</p>
        <Card padding="md" shadow="md" surface="raised">
          <h1 className="text-title text-primary mb-6">{title}</h1>
          {children}
        </Card>
      </div>
    </main>
  );
}
