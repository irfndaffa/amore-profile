export type Profile = {
  fullName: string;
  nickname: string;
  roles: string[];
  location: string;
  email: string;
  phone: string;
};

export type Stat = {
  value: number;
  suffix: string;
  label: string;
};

export type ExperienceItem = {
  company: string;
  role: string;
  period: string;
  points: string[];
};

export type SoftwareItem = {
  name: string;
  short: string;
  colorFrom: string;
  colorTo: string;
};

export type PortfolioPhoto = {
  slot: number;
  pathname: string;
};

export type PortfolioVideo = {
  slot: number;
  pathname: string;
};

export type PortfolioCategory = {
  id: string;
  label: string;
  description: string;
  accent: string;
  photos: PortfolioPhoto[];
  videos?: PortfolioVideo[];
};

// Portfolio photos and videos live in a private Vercel Blob store, so they
// must be streamed through our own proxy route instead of linked to directly.
export function getPortfolioMediaSrc(pathname: string): string {
  return `/api/portfolio-media?pathname=${encodeURIComponent(pathname)}`;
}

export const MAX_VIDEOS_PER_CATEGORY = 2;
export const MAX_TOTAL_VIDEOS = 50;
export const MAX_VIDEO_SIZE_BYTES = 3 * 1024 * 1024;
