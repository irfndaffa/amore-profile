import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin-auth";
import { getSiteContent } from "@/lib/site-content";
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

  const content = await getSiteContent();

  return (
    <AdminDashboard
      profile={content.profile}
      stats={content.stats}
      experience={content.experience}
      coreSkills={content.coreSkills}
      software={content.software}
      portfolioCategories={content.portfolioCategories}
    />
  );
}
