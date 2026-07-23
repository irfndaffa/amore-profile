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

export type PortfolioVideo = {
  slot: number;
  pathname: string;
};

// Portfolio videos live in a private Vercel Blob store, so they must be
// streamed through our own proxy route instead of linked to directly.
export function getPortfolioVideoSrc(pathname: string): string {
  return `/api/portfolio-video?pathname=${encodeURIComponent(pathname)}`;
}

export type PortfolioCategory = {
  id: string;
  label: string;
  description: string;
  accent: string;
  count: number;
  videos?: PortfolioVideo[];
};

export const portfolioCategories: PortfolioCategory[] =
  siteContent.portfolioCategories;

export const MAX_VIDEOS_PER_CATEGORY = 2;
export const MAX_TOTAL_VIDEOS = 50;
export const MAX_VIDEO_SIZE_BYTES = 3 * 1024 * 1024;
