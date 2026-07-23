"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createAdminSession,
  destroyAdminSession,
  requireAdmin,
  verifyAdminPassword,
} from "@/lib/admin-auth";
import { getSiteContent, saveSiteContent } from "@/lib/site-content";
import { del, put } from "@vercel/blob";
import {
  MAX_TOTAL_VIDEOS,
  MAX_VIDEOS_PER_CATEGORY,
  MAX_VIDEO_SIZE_BYTES,
  type ExperienceItem,
  type PortfolioCategory,
  type SoftwareItem,
} from "@/lib/profile-data";

const CATEGORY_ID_REGEX = /^[a-z0-9-]+$/;

type ActionResult = { ok: true } | { ok: false; error: string };

async function assertAdmin() {
  const authed = await requireAdmin();
  if (!authed) {
    throw new Error("Unauthorized");
  }
}

function toActionResult(fn: () => Promise<void>): Promise<ActionResult> {
  return fn()
    .then(() => ({ ok: true as const }))
    .catch((err: unknown) => ({
      ok: false as const,
      error: err instanceof Error ? err.message : "Something went wrong.",
    }));
}

// ---------------- Auth ----------------

export async function loginAction(
  _prev: { error?: string } | undefined,
  formData: FormData,
): Promise<{ error?: string }> {
  const password = String(formData.get("password") || "");

  if (!process.env.ADMIN_PASSWORD) {
    return { error: "ADMIN_PASSWORD belum di-set di server." };
  }

  if (!verifyAdminPassword(password)) {
    return { error: "Password salah." };
  }

  await createAdminSession();
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  await destroyAdminSession();
  redirect("/admin");
}

// ---------------- About / Profile ----------------

export type AboutFormData = {
  fullName: string;
  nickname: string;
  roles: string[];
  location: string;
  stats: { value: number; suffix: string; label: string }[];
};

export async function saveAboutAction(
  data: AboutFormData,
): Promise<ActionResult> {
  return toActionResult(async () => {
    await assertAdmin();
    const content = await getSiteContent();
    const updated = {
      ...content,
      profile: {
        ...content.profile,
        fullName: data.fullName,
        nickname: data.nickname,
        roles: data.roles,
        location: data.location,
      },
      stats: data.stats,
    };
    await saveSiteContent(updated);
    revalidatePath("/");
    revalidatePath("/admin");
  });
}

// ---------------- Contact ----------------

export type ContactFormData = {
  email: string;
  phone: string;
  location: string;
};

export async function saveContactAction(
  data: ContactFormData,
): Promise<ActionResult> {
  return toActionResult(async () => {
    await assertAdmin();
    const content = await getSiteContent();
    const updated = {
      ...content,
      profile: {
        ...content.profile,
        email: data.email,
        phone: data.phone,
        location: data.location,
      },
    };
    await saveSiteContent(updated);
    revalidatePath("/");
    revalidatePath("/admin");
  });
}

// ---------------- Experience ----------------

export async function saveExperienceAction(
  items: ExperienceItem[],
): Promise<ActionResult> {
  return toActionResult(async () => {
    await assertAdmin();
    const content = await getSiteContent();
    const updated = { ...content, experience: items };
    await saveSiteContent(updated);
    revalidatePath("/");
    revalidatePath("/admin");
  });
}

// ---------------- Skills ----------------

export async function saveSkillsAction(
  coreSkills: string[],
  software: SoftwareItem[],
): Promise<ActionResult> {
  return toActionResult(async () => {
    await assertAdmin();
    const content = await getSiteContent();
    const updated = { ...content, coreSkills, software };
    await saveSiteContent(updated);
    revalidatePath("/");
    revalidatePath("/admin");
  });
}

// ---------------- Portfolio photos ----------------
//
// Photos are uploaded as base64 through this Server Action (small JPEGs
// comfortably fit under Vercel's request body limit) but are stored in our
// private Vercel Blob store rather than committed to the repo.

async function putPhotoBlob(
  categoryId: string,
  slot: number,
  base64Content: string,
): Promise<string> {
  const buffer = Buffer.from(base64Content, "base64");
  const blob = await put(`portfolio/${categoryId}/photo-${slot}`, buffer, {
    access: "private",
    contentType: "image/jpeg",
    addRandomSuffix: true,
  });
  return blob.pathname;
}

export async function uploadPortfolioPhotoAction(
  categoryId: string,
  slot: number,
  base64Content: string,
): Promise<ActionResult> {
  return toActionResult(async () => {
    await assertAdmin();
    const content = await getSiteContent();
    const categories: PortfolioCategory[] = content.portfolioCategories;
    const category = categories.find((c) => c.id === categoryId);
    if (!category) throw new Error("Category not found.");
    const existing = category.photos.find((p) => p.slot === slot);
    if (!existing) throw new Error("Photo slot not found.");

    const pathname = await putPhotoBlob(categoryId, slot, base64Content);
    // Clean up the blob we're replacing (best-effort).
    await del(existing.pathname).catch(() => {});

    const updated = {
      ...content,
      portfolioCategories: categories.map((c) =>
        c.id === categoryId
          ? {
              ...c,
              photos: c.photos.map((p) =>
                p.slot === slot ? { ...p, pathname } : p,
              ),
            }
          : c,
      ),
    };
    await saveSiteContent(updated);
    revalidatePath("/");
    revalidatePath("/admin");
  });
}

export async function addPortfolioPhotoAction(
  categoryId: string,
  base64Content: string,
): Promise<ActionResult> {
  return toActionResult(async () => {
    await assertAdmin();
    const content = await getSiteContent();
    const categories: PortfolioCategory[] = content.portfolioCategories;
    const category = categories.find((c) => c.id === categoryId);
    if (!category) throw new Error("Category not found.");

    const newSlot =
      category.photos.reduce((max, p) => Math.max(max, p.slot), 0) + 1;
    const pathname = await putPhotoBlob(categoryId, newSlot, base64Content);

    try {
      const updated = {
        ...content,
        portfolioCategories: categories.map((c) =>
          c.id === categoryId
            ? { ...c, photos: [...c.photos, { slot: newSlot, pathname }] }
            : c,
        ),
      };
      await saveSiteContent(updated);
    } catch (error) {
      await del(pathname).catch(() => {});
      throw error;
    }
    revalidatePath("/");
    revalidatePath("/admin");
  });
}

export async function removePortfolioPhotoAction(
  categoryId: string,
): Promise<ActionResult> {
  return toActionResult(async () => {
    await assertAdmin();
    const content = await getSiteContent();
    const categories: PortfolioCategory[] = content.portfolioCategories;
    const category = categories.find((c) => c.id === categoryId);
    if (!category || category.photos.length === 0) {
      throw new Error("Nothing to remove.");
    }

    const lastPhoto = category.photos.reduce(
      (max, p) => (p.slot > max.slot ? p : max),
      category.photos[0],
    );
    await del(lastPhoto.pathname).catch(() => {});

    const updated = {
      ...content,
      portfolioCategories: categories.map((c) =>
        c.id === categoryId
          ? { ...c, photos: c.photos.filter((p) => p.slot !== lastPhoto.slot) }
          : c,
      ),
    };
    await saveSiteContent(updated);
    revalidatePath("/");
    revalidatePath("/admin");
  });
}

// ---------------- Portfolio categories (dynamic) ----------------

export type PortfolioCategoryFormData = {
  id: string;
  label: string;
  description: string;
  accent: string;
};

export async function addPortfolioCategoryAction(
  data: PortfolioCategoryFormData,
): Promise<ActionResult> {
  return toActionResult(async () => {
    await assertAdmin();
    const id = data.id.trim().toLowerCase();
    if (!CATEGORY_ID_REGEX.test(id)) {
      throw new Error(
        "ID portofolio hanya boleh huruf kecil, angka, dan tanda strip.",
      );
    }
    if (!data.label.trim()) {
      throw new Error("Nama portofolio wajib diisi.");
    }

    const content = await getSiteContent();
    const categories: PortfolioCategory[] = content.portfolioCategories;
    if (categories.some((c) => c.id === id)) {
      throw new Error("ID portofolio sudah dipakai.");
    }

    const updated = {
      ...content,
      portfolioCategories: [
        ...categories,
        {
          id,
          label: data.label.trim(),
          description: data.description.trim(),
          accent: data.accent.trim() || "#ff2f6e",
          photos: [],
          videos: [],
        },
      ],
    };
    await saveSiteContent(updated);
    revalidatePath("/");
    revalidatePath("/admin");
  });
}

export async function removePortfolioCategoryAction(
  categoryId: string,
): Promise<ActionResult> {
  return toActionResult(async () => {
    await assertAdmin();
    const content = await getSiteContent();
    const categories: PortfolioCategory[] = content.portfolioCategories;
    const category = categories.find((c) => c.id === categoryId);
    if (!category) throw new Error("Category not found.");
    if (categories.length <= 1) {
      throw new Error("Minimal harus ada satu portofolio.");
    }

    for (const photo of category.photos) {
      await del(photo.pathname).catch(() => {});
    }
    for (const video of category.videos ?? []) {
      await del(video.pathname).catch(() => {});
    }

    const updated = {
      ...content,
      portfolioCategories: categories.filter((c) => c.id !== categoryId),
    };
    await saveSiteContent(updated);
    revalidatePath("/");
    revalidatePath("/admin");
  });
}

// ---------------- Portfolio videos ----------------
//
// Videos are uploaded directly from the browser to Vercel Blob (see
// src/app/api/portfolio-video-upload/route.ts) because Vercel Functions
// reject request bodies larger than 4.5MB — sending a base64-encoded video
// through a Server Action would exceed that limit. These actions only ever
// receive the resulting blob URL, never the file bytes.

export async function addPortfolioVideoAction(
  categoryId: string,
  pathname: string,
  sizeBytes: number,
): Promise<ActionResult> {
  return toActionResult(async () => {
    await assertAdmin();
    try {
      const content = await getSiteContent();
      const categories: PortfolioCategory[] = content.portfolioCategories;
      const category = categories.find((c) => c.id === categoryId);
      if (!category) throw new Error("Category not found.");

      if (sizeBytes > MAX_VIDEO_SIZE_BYTES) {
        throw new Error("Ukuran video maksimal 3MB.");
      }

      const videos = category.videos ?? [];
      if (videos.length >= MAX_VIDEOS_PER_CATEGORY) {
        throw new Error(
          `Maksimal ${MAX_VIDEOS_PER_CATEGORY} video per portofolio.`,
        );
      }

      const totalVideos = categories.reduce(
        (sum, c) => sum + (c.videos?.length ?? 0),
        0,
      );
      if (totalVideos >= MAX_TOTAL_VIDEOS) {
        throw new Error(`Batas total ${MAX_TOTAL_VIDEOS} video sudah tercapai.`);
      }

      const newSlot = videos.reduce((max, v) => Math.max(max, v.slot), 0) + 1;
      const updated = {
        ...content,
        portfolioCategories: categories.map((c) =>
          c.id === categoryId
            ? { ...c, videos: [...videos, { slot: newSlot, pathname }] }
            : c,
        ),
      };
      await saveSiteContent(updated);
      revalidatePath("/");
      revalidatePath("/admin");
    } catch (error) {
      // Clean up the orphaned blob if we can't register it in the content JSON.
      await del(pathname).catch(() => {});
      throw error;
    }
  });
}

export async function removePortfolioVideoAction(
  categoryId: string,
  slot: number,
): Promise<ActionResult> {
  return toActionResult(async () => {
    await assertAdmin();
    const content = await getSiteContent();
    const categories: PortfolioCategory[] = content.portfolioCategories;
    const category = categories.find((c) => c.id === categoryId);
    if (!category) throw new Error("Category not found.");
    const video = (category.videos ?? []).find((v) => v.slot === slot);
    if (!video) throw new Error("Video not found.");

    await del(video.pathname).catch(() => {});

    const updated = {
      ...content,
      portfolioCategories: categories.map((c) =>
        c.id === categoryId
          ? { ...c, videos: (c.videos ?? []).filter((v) => v.slot !== slot) }
          : c,
      ),
    };
    await saveSiteContent(updated);
    revalidatePath("/");
    revalidatePath("/admin");
  });
}
