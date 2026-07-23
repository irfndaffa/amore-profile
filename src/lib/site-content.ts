import { get, put } from "@vercel/blob";
import type {
  ExperienceItem,
  PortfolioCategory,
  Profile,
  SoftwareItem,
  Stat,
} from "./profile-data";

// The entire site's editable content lives as a single JSON blob in our
// private Vercel Blob store. This replaces the previous approach of
// committing src/data/site-content.json to GitHub on every admin edit.
const CONTENT_PATHNAME = "data/site-content.json";

export type SiteContent = {
  profile: Profile;
  stats: Stat[];
  experience: ExperienceItem[];
  coreSkills: string[];
  software: SoftwareItem[];
  portfolioCategories: PortfolioCategory[];
};

export async function getSiteContent(): Promise<SiteContent> {
  const result = await get(CONTENT_PATHNAME, {
    access: "private",
    // Admin edits must be visible immediately (both on the live site and
    // back in the admin panel), so always bypass the CDN cache here.
    useCache: false,
  });

  if (!result) {
    throw new Error(
      "Site content not found in Blob store. Run the migration script first.",
    );
  }

  const text = await new Response(result.stream).text();
  return JSON.parse(text) as SiteContent;
}

export async function saveSiteContent(data: SiteContent): Promise<void> {
  const json = JSON.stringify(data, null, 2);
  await put(CONTENT_PATHNAME, json, {
    access: "private",
    contentType: "application/json",
    allowOverwrite: true,
  });
}
