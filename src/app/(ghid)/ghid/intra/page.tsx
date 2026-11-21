import { LockForm } from "./LockForm";

export const dynamic = "force-dynamic";

export default async function GhidLoginPage({ searchParams }: { searchParams: Promise<{ next?: string | string[] }> }) {
  const { next } = await searchParams;
  return (
    <main className="flex min-h-svh items-center justify-center bg-surface-dark px-4">
      <div className="w-full max-w-(--portal-auth-w) border-card border-card-line bg-surface-raised p-(--portal-login-pad) shadow-retro">
        <h1 className="font-display font-extrabold leading-tight text-(length:--portal-login-title) text-primary mb-6">Ghid EduSport</h1>
        <LockForm next={typeof next === "string" ? next : ""} />
      </div>
    </main>
  );
}
