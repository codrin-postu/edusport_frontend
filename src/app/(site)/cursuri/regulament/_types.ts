export interface RegulationRule {
  label: string;
  text: string;
  highlight?: boolean;
}

export interface RegulationCategory {
  title: string;
  icon: string;
  rules: RegulationRule[];
}

export interface CourseRegulationsData {
  categories: RegulationCategory[];
}
