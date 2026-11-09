import { PORTAL_LABEL } from "@/lib/portal/copy";
import { AuthRibbon } from "./AuthRibbon";

/**
 * The branded frame shared by the login, reset and invite screens: navy panel with the four-colour
 * ribbon and the brand block, form card beside it (below it on phones). The student portal passes
 * `portal="sportiv"` for its own label.
 */
export function AuthFrame({ title, portal = "antrenor", children }: { title: string; portal?: keyof typeof PORTAL_LABEL; children: React.ReactNode }) {
  return (
    <main data-auth-frame className="auth-frame relative flex min-h-svh w-full flex-col overflow-x-clip bg-surface-raised portal:flex-row portal:items-center portal:justify-end portal:py-8 portal:pr-[7%]">
      {/* Desktop navy panel; phones carry the brand on the stripes instead. */}
      <div aria-hidden="true" className="absolute inset-0 hidden bg-surface-dark [clip-path:inset(0_47.5%_9.2%_0_round_0_0_122px_0)] portal:block" />
      <AuthRibbon />
      {/* Phone: the brand on the white page above the form. Desktop: on the navy panel. */}
      <div className="absolute left-6 top-[clamp(20px,5svh,40px)] z-raised flex flex-col items-start portal:left-14 portal:top-14">
        <p className="mb-3 text-(length:--portal-brand-kicker) font-bold uppercase tracking-(--portal-brand-kicker-tracking) text-secondary portal:text-ice">Clubul Sportiv</p>
        <p className="auth-wordmark text-[clamp(24px,8vw,31px)] text-primary portal:text-(length:--portal-login-brand) portal:text-surface-raised">EDUSPORT</p>
        <p className="mt-4 text-(length:--portal-kicker-size) font-semibold text-secondary portal:text-nav-on-dark">{PORTAL_LABEL[portal]}</p>
      </div>
      <div aria-hidden="true" className="h-[clamp(96px,15svh,160px)] shrink-0 portal:hidden" />
      <div className="relative z-raised mx-auto flex w-[calc(100%-40px)] max-w-[400px] flex-1 items-center pb-[calc(var(--auth-band)*0.6)] portal:m-0 portal:w-[400px] portal:flex-none portal:pb-0">
        <div className="w-full border-card border-card-line bg-surface-raised p-(--portal-login-pad) shadow-retro">
          <h1 className="font-display font-extrabold leading-tight text-(length:--portal-login-title) text-primary mb-6">{title}</h1>
          {children}
        </div>
      </div>
    </main>
  );
}
