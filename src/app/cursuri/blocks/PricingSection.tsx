"use client";

import Section from "@/components/ui/section";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import BulletList from "@/components/ui/bullet-list";
import SectionHeader from "@/components/ui/section-header";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/utils/cn";
import IconButton from "@/components/ui/icon-button";
import React, { useState } from "react";
import type { PricingTier } from "../_types_pricing";
import { ENROL_CTA, ENROL_HREF } from "@/lib/cta";

const ItemTooltip: React.FC<{ text: string }> = ({ text }) => {
  const [open, setOpen] = useState(false);
  return (
    <Tooltip open={open} onOpenChange={setOpen}>
      <TooltipTrigger asChild>
        <IconButton
          icon="info"
          label="Detalii"
          size="sm"
          onClick={() => setOpen((v) => !v)}
          className="-my-3 -mx-3 text-secondary"
        />
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-60">
        {text}
      </TooltipContent>
    </Tooltip>
  );
};

const CARD = "relative flex flex-col overflow-hidden min-h-[520px]";

const PriceCard: React.FC<{ tier: PricingTier; headerClass: string }> = ({
  tier,
  headerClass,
}) => (
  <Card padding="none" className={CARD}>
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
          <span className="text-body-lg font-extrabold text-primary tabular-nums whitespace-nowrap shrink-0">
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
  </Card>
);

interface PricingSectionProps {
  pricingData: PricingTier[] | null;
  footerNotes?: string[] | null;
  /** Canonical season label (site-settings, falls back to CURRENT_SEASON). */
  currentSeason: string;
  eyebrow: string;
  title: string;
  description: string;
  subscriptionInfoTitle: string;
  subscriptionBullets: string[];
}

const PricingSection: React.FC<PricingSectionProps> = ({
  pricingData,
  footerNotes,
  currentSeason,
  eyebrow,
  title,
  description,
  subscriptionInfoTitle,
  subscriptionBullets,
}) => {
  const [members, nonMembers] = pricingData ?? [null, null];

  return (
    <Section id="preturi" className="section bg-surface">
      <div className="flex flex-col gap-12">
        <SectionHeader eyebrow={currentSeason} title="Prețuri cursuri grup" />

        <div className="grid lg:grid-cols-3 gap-6 items-stretch">
          {/* Promo card — plain navy. Card always draws a border-retro edge;
              this card had none, so it is cancelled with border-none. */}
          <Card
            surface="dark"
            padding="none"
            className="relative overflow-hidden p-8 md:p-12 flex flex-col gap-6 min-h-[520px] border-none"
          >
            <span className="text-label uppercase text-accent-on-dark">
              {eyebrow}
            </span>
            <h3 className="text-subtitle text-primary-on-dark">
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

            <Button
              face="cream"
              href={ENROL_HREF}
              className="self-start"
            >
              {ENROL_CTA}
            </Button>
          </Card>

          {/* Price cards — 2-col at md, dissolve into parent 3-col at lg */}
          <div className="grid md:grid-cols-2 lg:contents gap-6 items-stretch">
            {pricingData === null || !members || !nonMembers ? (
              <Card
                padding="none"
                className="md:col-span-2 lg:col-span-2 flex items-center justify-center min-h-[520px] px-8"
              >
                <p className="text-body-sm text-secondary text-center">
                  Prețurile nu sunt disponibile momentan. Reveniți în curând sau
                  contactați-ne direct.
                </p>
              </Card>
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
          <div className="flex flex-col gap-2">
            <p className="text-label uppercase text-secondary mb-1">
              Taxe &amp; Prețuri
            </p>
            <BulletList items={footerNotes} />
          </div>
        )}
      </div>
    </Section>
  );
};

export default PricingSection;
