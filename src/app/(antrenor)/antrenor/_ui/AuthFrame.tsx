import { PORTAL_LABEL } from "@/lib/portal/copy";
import { AuthRibbon } from "./AuthRibbon";

/**
 * The branded frame shared by the login, reset and invite screens: navy panel with the four-colour
 * ribbon and the brand block, form card beside it (below it on phones). The student portal passes
 * `portal="sportiv"` for its own label.
 */
export function AuthFrame({ title, portal = "antrenor", children }: { title: string; portal?: keyof typeof PORTAL_LABEL; children: React.ReactNode }) {
  return (
    <main data-auth-frame className="relative min-h-svh w-full overflow-x-clip bg-white pb-8 pt-[330px] min-[900px]:flex min-[900px]:items-center min-[900px]:justify-end min-[900px]:py-8 min-[900px]:pr-[7%]">
      <div
        aria-hidden="true"
        className="absolute left-0 top-0 h-[280px] w-[calc(100%-80px)] bg-[#0e1a3c] [clip-path:inset(0_0_0_0_round_0_0_70px_0)] min-[900px]:h-full min-[900px]:w-full min-[900px]:[clip-path:inset(0_47.5%_9.2%_0_round_0_0_122px_0)]"
      />
      <AuthRibbon />
      <div className="absolute left-6 top-11 z-[2] flex flex-col items-start min-[900px]:left-14 min-[900px]:top-14">
        <p className="mb-3 text-[12px] font-bold uppercase tracking-[.28em] text-[#8fb8f5]">Clubul Sportiv</p>
        <p className="auth-wordmark text-[31px] text-white min-[900px]:text-[62px]">EDUSPORT</p>
        <p className="mt-4 text-[14px] font-semibold text-[#c9d6ee]">{PORTAL_LABEL[portal]}</p>
      </div>
      <div className="relative z-[3] mx-auto w-[calc(100%-40px)] max-w-[400px] min-[900px]:m-0 min-[900px]:w-[400px]">
        <div className="border border-[#dde6f3] bg-white p-6 shadow-[8px_8px_0_rgba(14,26,60,0.16)]">
          <h1 className="text-title text-primary mb-6">{title}</h1>
          {children}
        </div>
      </div>
    </main>
  );
}
