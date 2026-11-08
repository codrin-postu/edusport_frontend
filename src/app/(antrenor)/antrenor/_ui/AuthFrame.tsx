import { PORTAL_LABEL } from "@/lib/portal/copy";
import { AuthRibbon } from "./AuthRibbon";

/**
 * The branded frame shared by the login, reset and invite screens: navy panel with the four-colour
 * ribbon and the brand block, form card beside it (below it on phones). The student portal passes
 * `portal="sportiv"` for its own label.
 */
export function AuthFrame({ title, portal = "antrenor", children }: { title: string; portal?: keyof typeof PORTAL_LABEL; children: React.ReactNode }) {
  return (
    <main data-auth-frame className="auth-frame relative flex min-h-svh w-full flex-col overflow-x-clip bg-white min-[900px]:flex-row min-[900px]:items-center min-[900px]:justify-end min-[900px]:py-8 min-[900px]:pr-[7%]">
      {/* Desktop navy panel; phones carry the brand on the stripes instead. */}
      <div aria-hidden="true" className="absolute inset-0 hidden bg-[#0e1a3c] [clip-path:inset(0_47.5%_9.2%_0_round_0_0_122px_0)] min-[900px]:block" />
      <AuthRibbon />
      {/* Phone: the brand on the white page above the form. Desktop: on the navy panel. */}
      <div className="absolute left-6 top-[clamp(20px,5svh,40px)] z-[2] flex flex-col items-start min-[900px]:left-14 min-[900px]:top-14">
        <p className="mb-3 text-[12px] font-bold uppercase tracking-[.28em] text-[#495269] min-[900px]:text-[#8fb8f5]">Clubul Sportiv</p>
        <p className="auth-wordmark text-[clamp(24px,8vw,31px)] text-[#0e1a3c] min-[900px]:text-[62px] min-[900px]:text-white">EDUSPORT</p>
        <p className="mt-4 text-[14px] font-semibold text-[#495269] min-[900px]:text-[#c9d6ee]">{PORTAL_LABEL[portal]}</p>
      </div>
      <div aria-hidden="true" className="h-[clamp(120px,19svh,160px)] shrink-0 min-[900px]:hidden" />
      <div className="relative z-[3] mx-auto flex w-[calc(100%-40px)] max-w-[400px] flex-1 items-center pb-[calc(var(--auth-band)*0.6)] min-[900px]:m-0 min-[900px]:w-[400px] min-[900px]:flex-none min-[900px]:pb-0">
        <div className="w-full border border-[#dde6f3] bg-white p-5 shadow-[8px_8px_0_rgba(14,26,60,0.16)] min-[900px]:p-6">
          <h1 className="text-title text-primary mb-6">{title}</h1>
          {children}
        </div>
      </div>
    </main>
  );
}
