import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import Portfolio from "@/components/portfolio";
import Experience from "@/components/experience";
import Skills from "@/components/skills";
import Contact from "@/components/contact";
import Footer from "@/components/footer";
import { getSiteContent } from "@/lib/site-content";

// Site content lives in a private Vercel Blob store and can change at any
// time via the admin panel, so this page must be rendered fresh per request.
export const dynamic = "force-dynamic";

export default async function Home() {
  const content = await getSiteContent();

  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <main className="flex flex-1 flex-col">
        <Hero profile={content.profile} stats={content.stats} />
        <Portfolio categories={content.portfolioCategories} />
        <Experience experience={content.experience} />
        <Skills coreSkills={content.coreSkills} software={content.software} />
        <Contact profile={content.profile} />
      </main>
      <Footer profile={content.profile} />
    </div>
  );
}
