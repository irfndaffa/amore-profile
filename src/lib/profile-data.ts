import siteContent from "@/data/site-content.json";

export const profile = siteContent.profile;

export const stats = siteContent.stats;

export type ExperienceItem = {
  company: string;
  role: string;
  period: string;
  points: string[];
};

export const experience: ExperienceItem[] = siteContent.experience;

export const coreSkills: string[] = siteContent.coreSkills;

export type SoftwareItem = {
  name: string;
  short: string;
  colorFrom: string;
  colorTo: string;
};

export const software: SoftwareItem[] = siteContent.software;

export type PortfolioCategory = {
  id: string;
  label: string;
  description: string;
  accent: string;
  count: number;
};

export const portfolioCategories: PortfolioCategory[] =
  siteContent.portfolioCategories;
