"use client";

import Section from "@/components/ui/section";
import SpotlightButton from "@/components/ui/spotlight-button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/utils/cn";
import { Info } from "lucide-react";
import React, { useState } from "react";
import type { PricingTier } from "../_types_pricing";

const ItemTooltip: React.FC<{ text: string }> = ({ text }) => {
  const [open, setOpen] = useState(false);
  return (
    <Tooltip open={open} onOpenChange={setOpen}>
      <TooltipTrigger asChild>
        <Info
          className="w-3.5 h-3.5 text-navy/60 hover:text-navy cursor-pointer shrink-0 transition-colors"
          onClick={() => setOpen((v) => !v)}
        />
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-60">
        {text}
      </TooltipContent>
    </Tooltip>
  );
};

const CARD =
  "relative flex flex-col overflow-hidden min-h-[520px] bg-retro-cream border-[1.5px] border-navy shadow-[8px_8px_0_rgba(14,26,60,0.16)]";

const PriceCard: React.FC<{ tier: PricingTier; headerClass: string }> = ({
  tier,
  headerClass,
}) => (
  <div className={CARD}>
    <div
      className={cn(
        "flex items-center px-6 shrink-0 h-12 text-xs font-extrabold tracking-[0.14em] uppercase",
        headerClass,
      )}
    >
      {tier.title}
    </div>
    <div className="px-8 pt-6 flex flex-col">
      {tier.priceItems.map((item, i) => (
        <div
          key={i}
          className={cn(
            "flex items-start justify-between gap-4 py-4",
            i < tier.priceItems.length - 1 && "border-b border-navy/12",
          )}
        >
          <div className="flex flex-col gap-0.5">
            <span className="text-sm text-navy/75">
              {item.label}
              {item.tooltip && (
                <span className="inline-flex items-center ml-1 translate-y-[2px]">
                  <ItemTooltip text={item.tooltip} />
                </span>
              )}
            </span>
            {item.note && (
              <span className="text-xs text-navy/45">{item.note}</span>
            )}
          </div>
          <span className="font-display font-extrabold text-lg text-navy whitespace-nowrap shrink-0">
            {item.price}
          </span>
        </div>
      ))}
    </div>
    {tier.bottomItem && (
      <div className="mt-auto px-8 py-4 flex items-baseline justify-between gap-4 border-t-[1.5px] border-dashed border-navy/25">
        <span className="text-xs text-navy/55">{tier.bottomItem.label}</span>
        <span className="text-sm font-bold text-navy/70 whitespace-nowrap">
          {tier.bottomItem.price}
        </span>
      </div>
    )}
  </div>
);

interface PricingSectionProps {
  pricingData: PricingTier[] | null;
  footerNotes?: string[] | null;
  eyebrow: string;
  title: string;
  description: string;
  subscriptionInfoTitle: string;
  subscriptionBullets: string[];
}

const PricingSection: React.FC<PricingSectionProps> = ({
  pricingData,
  footerNotes,
  eyebrow,
  title,
  description,
  subscriptionInfoTitle,
  subscriptionBullets,
}) => {
  const [members, nonMembers] = pricingData ?? [null, null];

  return (
    <Section id="preturi" className="py-20 bg-retro-cream">
      <div className="flex flex-col gap-12">
        <div className="flex flex-col gap-2">
          <span className="text-eyebrow font-bold uppercase text-rust">
            Tarife
          </span>
          <h2 className="font-display text-display-sm font-extrabold text-navy leading-[1.05] tracking-[-0.4px]">
            Prețuri cursuri grup
          </h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-5 items-stretch">
          {/* Promo card — plain navy */}
          <div className="relative overflow-hidden p-8 md:p-10 flex flex-col gap-5 min-h-[520px] bg-navy text-retro-cream shadow-[8px_8px_0_rgba(14,26,60,0.16)]">
            <span className="text-eyebrow font-bold uppercase text-retro-cream/60">
              {eyebrow}
            </span>
            <h3 className="text-2xl font-bold text-retro-cream leading-snug tracking-[-0.2px]">
              {title}
            </h3>
            <p className="text-retro-cream/75 text-sm leading-relaxed">
              {description}
            </p>

            <div className="flex flex-col gap-2 text-sm text-retro-cream/75 border-t border-retro-cream/[0.18] pt-4 flex-1">
              <p className="text-retro-cream font-bold text-xs">
                {subscriptionInfoTitle}
              </p>
              <ul className="flex flex-col gap-2">
                {subscriptionBullets.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="shrink-0 font-extrabold text-mustard">›</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <SpotlightButton
              layers
              layersFace="cream"
              href="/inscrieri"
              className="self-start text-xs"
            >
              Înscrie-te la cursuri
            </SpotlightButton>
          </div>

          {/* Price cards — 2-col at md, dissolve into parent 3-col at lg */}
          <div className="grid md:grid-cols-2 lg:contents gap-5 items-stretch">
            {pricingData === null || !members || !nonMembers ? (
              <div className="md:col-span-2 lg:col-span-2 bg-retro-cream border-[1.5px] border-navy shadow-[8px_8px_0_rgba(14,26,60,0.16)] flex items-center justify-center min-h-[520px] px-8">
                <p className="text-sm text-navy/50 text-center">
                  Prețurile nu sunt disponibile momentan. Reveniți în curând sau
                  contactați-ne direct.
                </p>
              </div>
            ) : (
              <>
                <PriceCard tier={members} headerClass="bg-burgundy text-white" />
                <PriceCard
                  tier={nonMembers}
                  headerClass="bg-navy text-retro-cream"
                />
              </>
            )}
          </div>
        </div>

        {footerNotes && footerNotes.length > 0 && (
          <div className="flex flex-col gap-1.5 text-xs text-navy/55 max-w-2xl">
            <p className="text-eyebrow font-bold uppercase text-navy/55 mb-1">
              Taxe &amp; Prețuri
            </p>
            <ul className="flex flex-col gap-1.5">
              {footerNotes.map((text, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-0.5 shrink-0">·</span>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Section>
  );
};

export default PricingSection;
