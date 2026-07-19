"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createAdminSession,
  destroyAdminSession,
  requireAdmin,
  verifyAdminPassword,
} from "@/lib/admin-auth";
import { commitFile, commitJson, deleteFile } from "@/lib/github-content";
import siteContent from "@/data/site-content.json";
import type {
  ExperienceItem,
  PortfolioCategory,
  SoftwareItem,
} from "@/lib/profile-data";

const CONTENT_PATH = "src/data/site-content.json";

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
    const updated = {
      ...siteContent,
      profile: {
        ...siteContent.profile,
        fullName: data.fullName,
        nickname: data.nickname,
        roles: data.roles,
        location: data.location,
      },
      stats: data.stats,
    };
    await commitJson(
      CONTENT_PATH,
      updated,
      "chore(admin): update about content",
    );
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
    const updated = {
      ...siteContent,
      profile: {
        ...siteContent.profile,
        email: data.email,
        phone: data.phone,
        location: data.location,
      },
    };
    await commitJson(
      CONTENT_PATH,
      updated,
      "chore(admin): update contact info",
    );
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
    const updated = { ...siteContent, experience: items };
    await commitJson(CONTENT_PATH, updated, "chore(admin): update experience");
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
    const updated = { ...siteContent, coreSkills, software };
    await commitJson(CONTENT_PATH, updated, "chore(admin): update skills");
    revalidatePath("/");
    revalidatePath("/admin");
  });
}

// ---------------- Portfolio photos ----------------

function photoPath(categoryId: string, slot: number) {
  return `public/portfolio/${categoryId}/${slot}.jpg`;
}

export async function uploadPortfolioPhotoAction(
  categoryId: string,
  slot: number,
  base64Content: string,
): Promise<ActionResult> {
  return toActionResult(async () => {
    await assertAdmin();
    await commitFile({
      filePath: photoPath(categoryId, slot),
      content: base64Content,
      isBase64: true,
      message: `chore(admin): replace portfolio photo ${categoryId}/${slot}`,
    });
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
    const categories: PortfolioCategory[] = siteContent.portfolioCategories;
    const category = categories.find((c) => c.id === categoryId);
    if (!category) throw new Error("Category not found.");

    const newSlot = category.count + 1;
    await commitFile({
      filePath: photoPath(categoryId, newSlot),
      content: base64Content,
      isBase64: true,
      message: `chore(admin): add portfolio photo ${categoryId}/${newSlot}`,
    });

    const updated = {
      ...siteContent,
      portfolioCategories: categories.map((c) =>
        c.id === categoryId ? { ...c, count: newSlot } : c,
      ),
    };
    await commitJson(
      CONTENT_PATH,
      updated,
      "chore(admin): add portfolio photo slot",
    );
    revalidatePath("/");
    revalidatePath("/admin");
  });
}

export async function removePortfolioPhotoAction(
  categoryId: string,
): Promise<ActionResult> {
  return toActionResult(async () => {
    await assertAdmin();
    const categories: PortfolioCategory[] = siteContent.portfolioCategories;
    const category = categories.find((c) => c.id === categoryId);
    if (!category || category.count <= 0) throw new Error("Nothing to remove.");

    const lastSlot = category.count;
    await deleteFile({
      filePath: photoPath(categoryId, lastSlot),
      message: `chore(admin): remove portfolio photo ${categoryId}/${lastSlot}`,
    });

    const updated = {
      ...siteContent,
      portfolioCategories: categories.map((c) =>
        c.id === categoryId ? { ...c, count: lastSlot - 1 } : c,
      ),
    };
    await commitJson(
      CONTENT_PATH,
      updated,
      "chore(admin): remove portfolio photo slot",
    );
    revalidatePath("/");
    revalidatePath("/admin");
  });
}
