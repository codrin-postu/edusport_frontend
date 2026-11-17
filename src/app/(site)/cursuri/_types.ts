export interface CoursePageContent {
  banner: {
    title: string;
    scheduleDays: string;
    scheduleTimes: string;
  };
  aboutSection: {
    eyebrow: string;
    heading: string;
    content: string;
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
