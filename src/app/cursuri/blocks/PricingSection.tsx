"use client";

import Link from "@/components/ui/link";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/utils/cn";
import { ArrowRight, Clock, Info } from "lucide-react";
import React, { useState } from "react";

const SixSessionTooltip: React.FC = () => {
  const [open, setOpen] = useState(false);
  return (
    <Tooltip open={open} onOpenChange={setOpen}>
      <TooltipTrigger asChild>
        <Info
          className="w-3.5 h-3.5 text-gray-700 hover:text-gray-900 cursor-pointer shrink-0 transition-colors"
          onClick={() => setOpen((v) => !v)}
        />
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-60">
        Disponibil pentru cei care știu că vor lipsi un weekend din cele 4
        aferente abonamentului.
      </TooltipContent>
    </Tooltip>
  );
};

interface PriceItem {
  label: string;
  price: string;
}

interface PricingData {
  title: string;
  priceItems: PriceItem[];
  bottomItem?: PriceItem;
}

interface PricingSectionProps {
  pricingData: PricingData[];
}

const PricingSection: React.FC<PricingSectionProps> = ({ pricingData }) => {
  const [members, nonMembers] = pricingData;

  return (
    <section className={cn("py-20", "bg-gray-50")}>
      <div className="w-full max-w-content mx-auto px-4 md:px-8 lg:px-12">
        <div className="flex flex-col gap-12">
          {/* Header */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold tracking-widest uppercase text-edusport-blue/60">
              Tarife
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900">
              Prețuri cursuri grup
            </h2>
          </div>

          {/* 3-column grid */}
          <div className="grid lg:grid-cols-3 gap-5 items-stretch">
            {/* Promo card — blue branding */}
            <div
              className="relative overflow-hidden rounded-3xl p-10 py-12 flex flex-col gap-6 min-h-[520px]"
              style={{
                background:
                  "linear-gradient(145deg, oklch(0.25 0.12 264) 0%, oklch(0.421 0.2593 264.52) 60%, oklch(0.55 0.18 230) 100%)",
              }}
            >
              <div className="pointer-events-none absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-10 bg-white" />
              <div className="pointer-events-none absolute -bottom-6 -left-6 w-24 h-24 rounded-full opacity-5 bg-white" />

              <div className="flex flex-col gap-3">
                <p className="text-xs font-semibold tracking-widest uppercase text-white/50">
                  De ce să devii
                </p>
                <h3 className="text-2xl font-semibold text-white leading-snug">
                  Membru Club Sportiv EduSport
                </h3>
              </div>

              <p className="text-white/70 text-sm font-light leading-relaxed">
                Ca membru al Clubului Sportiv EduSport beneficiezi de tarife
                preferențiale la toate cursurile de patinaj pe durata întregului
                sezon.
              </p>

              <div className="flex flex-col gap-2 text-[11px] text-white/70 border-t border-white/10 pt-4 flex-1">
                <p className="text-white font-medium text-xs">
                  Informații abonamente
                </p>
                <ul className="flex flex-col gap-1.5">
                  <li className="flex items-center gap-2 text-white/60">
                    <Clock className="w-3 h-3 shrink-0" /> 50 de minute /
                    ședință
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 shrink-0">·</span>
                    <span>
                      Abonamentele sunt valabile 4 săptămâni de la prima
                      ședință. Dacă perioada se suprapune cu un weekend fără
                      cursuri, valabilitatea se prelungește cu o săptămână.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 shrink-0">·</span>
                    <span>
                      Ședințele neefectuate nu se pot reporta sau recupera.
                    </span>
                  </li>
                </ul>
              </div>

              <div className="mt-auto">
                <Link
                  href="/inscrieri"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-white hover:text-white/80 transition-colors"
                >
                  Înscrie-te la cursuri
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Pricing cards — 2-col at md, dissolve into parent 3-col at lg */}
            <div className="grid md:grid-cols-2 lg:contents gap-5 items-stretch">
              {/* Members card — outlined */}
              <div className="relative rounded-3xl bg-white border-2 border-edusport-blue flex flex-col overflow-hidden min-h-[520px]">
                <div className="bg-edusport-blue px-6 flex items-center justify-between shrink-0" style={{ height: 50 }}>
                  <span className="text-xs font-semibold tracking-widest uppercase text-white">
                    {members.title}
                  </span>
                </div>

                <div className="px-8 pt-8 pb-0 flex flex-col">
                  {members.priceItems.map((item, i) => (
                    <div
                      key={i}
                      className={cn(
                        "flex items-baseline justify-between gap-4 py-5",
                        i < members.priceItems.length - 1 &&
                          "border-b border-gray-100",
                      )}
                    >
                      <span className="text-sm font-normal text-gray-700 flex items-center gap-1.5">
                        {item.label}
                        {item.label.includes("6 ședințe") && (
                          <SixSessionTooltip />
                        )}
                      </span>
                      <span className="text-base font-semibold text-gray-950 whitespace-nowrap">
                        {item.price}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Pinned bottom: membership fee */}
                {members.bottomItem && (
                  <div className="px-8 pb-8 flex items-baseline justify-between gap-4 pt-5 mt-auto border-t border-dashed border-gray-200">
                    <span className="text-xs font-normal text-gray-500">
                      {members.bottomItem.label}
                    </span>
                    <span className="text-sm font-semibold text-gray-600 whitespace-nowrap">
                      {members.bottomItem.price}
                    </span>
                  </div>
                )}
              </div>

              {/* Non-members card — plain */}
              <div className="rounded-3xl bg-white border border-gray-100 flex flex-col overflow-hidden min-h-[520px]">
                <div className="bg-gray-50 border-b border-gray-100 px-6 flex items-center shrink-0" style={{ height: 50 }}>
                  <span className="text-xs font-semibold tracking-widest uppercase text-gray-500">
                    {nonMembers.title}
                  </span>
                </div>

                <div className="px-8 pt-8 pb-0 flex flex-col">
                  {nonMembers.priceItems.map((item, i) => (
                    <div
                      key={i}
                      className={cn(
                        "flex items-baseline justify-between gap-4 py-5",
                        i < nonMembers.priceItems.length - 1 &&
                          "border-b border-gray-100",
                      )}
                    >
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-normal text-gray-700 flex items-center gap-1.5">
                          {item.label}
                          {item.label.includes("6 ședințe") && (
                            <SixSessionTooltip />
                          )}
                        </span>
                        {i === 0 && (
                          <span className="text-[11px] text-gray-400 font-light">
                            Disponibil doar pentru prima ședință
                          </span>
                        )}
                      </div>
                      <span className="text-base font-semibold text-gray-950 whitespace-nowrap">
                        {item.price}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pb-8" />
              </div>
            </div>
            {/* end pricing cards wrapper */}
          </div>

          {/* Footer notes */}
          <div className="flex flex-col gap-6 text-xs text-gray-500 max-w-2xl">
            {/* Group 2 — Taxe & Prețuri */}
            <div className="flex flex-col gap-1.5">
              <p className="text-[10px] font-semibold tracking-widest uppercase text-gray-500 mb-1">
                Taxe &amp; Prețuri
              </p>
              <ul className="flex flex-col gap-1.5">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 shrink-0">·</span>
                  <span>
                    Taxa de membru se achită o singură dată pe sezon, la
                    înscrierea la cursurile noastre, indiferent de momentul
                    înscrierii, și este valabilă în perioada octombrie 2025 –
                    mai 2026. Taxa nu este fracționară.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 shrink-0">·</span>
                  <span>
                    Ne rezervăm dreptul de a modifica tarifele pe durata
                    sezonului de cursuri (octombrie–mai). Modificările
                    prețurilor vor fi anunțate cu 30 de zile calendaristice
                    înainte de intrarea în vigoare a noilor prețuri.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
