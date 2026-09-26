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
          className="w-3.5 h-3.5 text-secondary hover:text-primary cursor-pointer shrink-0 transition-colors"
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
  "relative flex flex-col overflow-hidden min-h-[520px] bg-surface border-retro border-line shadow-retro";

const PriceCard: React.FC<{ tier: PricingTier; headerClass: string }> = ({
  tier,
  headerClass,
}) => (
  <div className={CARD}>
    <div
      className={cn(
        "text-label flex items-center px-6 shrink-0 h-12 uppercase",
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
            i < tier.priceItems.length - 1 && "border-b border-line-subtle",
          )}
        >
          <div className="flex flex-col gap-0.5">
            <span className="text-body-sm text-secondary">
              {item.label}
              {item.tooltip && (
                <span className="inline-flex items-center ml-1 translate-y-[2px]">
                  <ItemTooltip text={item.tooltip} />
                </span>
              )}
            </span>
            {item.note && (
              <span className="text-caption text-secondary">{item.note}</span>
            )}
          </div>
          <span className="text-title text-primary whitespace-nowrap shrink-0">
            {item.price}
          </span>
        </div>
      ))}
    </div>
    {tier.bottomItem && (
      <div className="mt-auto px-8 py-4 flex items-baseline justify-between gap-4 border-t-retro border-line-subtle">
        <span className="text-caption text-secondary">{tier.bottomItem.label}</span>
        <span className="text-body-sm text-secondary whitespace-nowrap">
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
    <Section id="preturi" className="py-24 bg-surface">
      <div className="flex flex-col gap-12">
        <div className="flex flex-col gap-2">
          <span className="text-label uppercase text-accent">
            Tarife
          </span>
          <h2 className="text-heading text-primary">
            Prețuri cursuri grup
          </h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 items-stretch">
          {/* Promo card — plain navy */}
          <div className="relative overflow-hidden p-8 md:p-12 flex flex-col gap-6 min-h-[520px] bg-surface-dark text-primary-on-dark shadow-retro">
            <span className="text-label uppercase text-secondary-on-dark">
              {eyebrow}
            </span>
            <h3 className="text-title text-primary-on-dark">
              {title}
            </h3>
            <p className="text-body-sm text-secondary-on-dark">
              {description}
            </p>

            <div className="text-body-sm flex flex-col gap-2 text-secondary-on-dark border-t border-line-subtle-on-dark pt-4 flex-1">
              <p className="text-caption text-primary-on-dark">
                {subscriptionInfoTitle}
              </p>
              <ul className="flex flex-col gap-2">
                {subscriptionBullets.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
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
              className="text-caption self-start"
            >
              Înscrie-te la cursuri
            </SpotlightButton>
          </div>

          {/* Price cards — 2-col at md, dissolve into parent 3-col at lg */}
          <div className="grid md:grid-cols-2 lg:contents gap-6 items-stretch">
            {pricingData === null || !members || !nonMembers ? (
              <div className="md:col-span-2 lg:col-span-2 bg-surface border-retro border-line shadow-retro flex items-center justify-center min-h-[520px] px-8">
                <p className="text-body-sm text-secondary text-center">
                  Prețurile nu sunt disponibile momentan. Reveniți în curând sau
                  contactați-ne direct.
                </p>
              </div>
            ) : (
              <>
                <PriceCard tier={members} headerClass="bg-burgundy text-primary-on-dark" />
                <PriceCard
                  tier={nonMembers}
                  headerClass="bg-surface-dark text-primary-on-dark"
                />
              </>
            )}
          </div>
        </div>

        {footerNotes && footerNotes.length > 0 && (
          <div className="text-caption flex flex-col gap-2 text-secondary max-w-2xl">
            <p className="text-label uppercase text-secondary mb-1">
              Taxe &amp; Prețuri
            </p>
            <ul className="flex flex-col gap-2">
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
