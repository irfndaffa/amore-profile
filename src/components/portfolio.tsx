"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FolderOpen, ImageOff, Play } from "lucide-react";
import Reveal from "./reveal";
import TiltCard from "./tilt-card";
import Magnetic from "./magnetic";
import { portfolioCategories } from "@/lib/profile-data";

const DRIVE_HREF =
  "https://drive.google.com/drive/folders/1y09HGmijgp3PMFhzaqR17uZVyJUZqlTL";

function PortfolioTile({
  src,
  index,
  accent,
}: {
  src: string;
  index: number;
  accent: string;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <TiltCard max={8} className="aspect-square">
      <div
        data-cursor="VIEW"
        className="group relative h-full w-full overflow-hidden rounded-2xl bg-bg-elevated"
      >
        {!failed ? (
          <Image
            src={src}
            alt=""
            fill
            unoptimized
            onError={() => setFailed(true)}
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
          />
        ) : (
          <div
            className="flex h-full w-full flex-col items-center justify-center gap-2 opacity-70"
            style={{
              backgroundImage: `linear-gradient(155deg, ${accent}33, transparent 70%)`,
            }}
          >
            <ImageOff className="h-6 w-6 text-muted" strokeWidth={1.25} />
            <span className="text-[11px] uppercase tracking-widest text-muted">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <Play className="m-4 h-5 w-5 text-white" fill="white" />
        </div>
      </div>
    </TiltCard>
  );
}

function ArchiveCard() {
  return (
    <Magnetic strength={0.15} className="sm:col-span-2 lg:col-span-1">
      <a
        href={DRIVE_HREF}
        target="_blank"
        rel="noopener noreferrer"
        data-cursor="OPEN"
        className="group relative flex aspect-square w-full flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl border border-hairline/70 bg-bg-elevated text-center transition-colors duration-300 hover:border-accent"
      >
        <motion.div
          initial={{ rotate: 0 }}
          whileHover={{ rotate: -8, y: -4 }}
          transition={{ type: "spring", stiffness: 260, damping: 14 }}
        >
          <FolderOpen
            className="h-10 w-10 text-accent transition-transform duration-300"
            strokeWidth={1.25}
          />
        </motion.div>
        <span className="font-display text-lg text-paper">Full Archive</span>
        <span className="max-w-[16ch] text-xs uppercase tracking-widest text-muted">
          Every project, uncropped
        </span>
      </a>
    </Magnetic>
  );
}

export default function Portfolio() {
  const [activeTab, setActiveTab] = useState(portfolioCategories[0].id);
  const category = portfolioCategories.find((c) => c.id === activeTab)!;

  return (
    <section
      id="work"
      className="relative px-6 py-16 sm:px-10 sm:py-28 lg:py-36"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <span className="text-sm uppercase tracking-[0.3em] text-accent">
            Selected work
          </span>
          <h2 className="font-display mt-4 text-4xl text-paper sm:text-6xl">
            Portfolio
          </h2>
          <p className="mt-4 max-w-xl text-muted">
            A mix of brand content, product storytelling, and social-first edits
            made for guitar, automotive, and packaging brands.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-12 flex flex-wrap gap-3">
          {portfolioCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              data-cursor="TAB"
              className={`rounded-full border px-5 py-2.5 text-sm uppercase tracking-wide transition-colors duration-200 ${
                activeTab === cat.id
                  ? "border-accent bg-accent text-accent-ink"
                  : "border-hairline/60 text-muted hover:border-accent hover:text-accent"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </Reveal>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10"
          >
            <p className="mb-6 text-sm text-muted">{category.description}</p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6">
              {Array.from({ length: category.count }).map((_, i) => (
                <PortfolioTile
                  key={`${category.id}-${i}`}
                  src={`/portfolio/${category.id}/${i + 1}.jpg`}
                  index={i}
                  accent={category.accent}
                />
              ))}
              <ArchiveCard />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
