import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin-auth";
import {
  coreSkills,
  experience,
  portfolioCategories,
  profile,
  software,
  stats,
} from "@/lib/profile-data";
import LoginForm from "./login-form";
import AdminDashboard from "./admin-dashboard";

export const metadata: Metadata = {
  title: "Admin — Amore Portfolio",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const authed = await requireAdmin();

  if (!authed) {
    return <LoginForm />;
  }

  return (
    <AdminDashboard
      profile={profile}
      stats={stats}
      experience={experience}
      coreSkills={coreSkills}
      software={software}
      portfolioCategories={portfolioCategories}
    />
  );
}
