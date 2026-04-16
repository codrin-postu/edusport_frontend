export interface PriceItem {
  label: string;
  price: string;
  tooltip?: string;
  note?: string;
}

export interface PricingTier {
  title: string;
  priceItems: PriceItem[];
  bottomItem?: PriceItem;
}
