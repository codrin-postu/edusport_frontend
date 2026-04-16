export interface PricingTierItem {
  label: string;
  price: string;
  tooltip?: string;
  note?: string;
}

export interface PricingTiersJson {
  memberTiers: PricingTierItem[];
  nonMemberTiers: PricingTierItem[];
  memberFeeLabel?: string;
  memberFeePrice?: string;
}

export interface CoursePricingData {
  tiers: PricingTiersJson;
  footerNotes: string[];
}

export interface CoursePageContent {
  banner: {
    title: string;
    scheduleDays: string;
    scheduleTimes: string;
    locationName: string;
    locationUrl: string;
  };
  aboutSection: {
    eyebrow: string;
    heading: string;
    content: string;
    locationBullet: string;
    levelsBullet: string;
    coachesBullet: string;
    videoUrl: string;
    videoLabel: string;
  };
  promoCard: {
    eyebrow: string;
    title: string;
    description: string;
    subscriptionInfoTitle: string;
    subscriptionBullets: string[];
  };
  infoSection: {
    sectionLabel: string;
    tips: string[];
    closingLine: string;
  };
}
