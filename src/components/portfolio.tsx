"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  FolderOpen,
  ImageOff,
  Play,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
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
  onExpand,
}: {
  src: string;
  index: number;
  accent: string;
  onExpand: () => void;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <TiltCard max={8} className="aspect-square">
      <button
        type="button"
        onClick={onExpand}
        aria-label="Lihat foto ukuran penuh"
        data-cursor="VIEW"
        className="group relative h-full w-full overflow-hidden rounded-2xl bg-bg-elevated text-left"
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
      </button>
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

function Lightbox({
  images,
  activeIndex,
  onClose,
  onNavigate,
}: {
  images: string[];
  activeIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") {
        onNavigate((activeIndex + 1) % images.length);
      }
      if (e.key === "ArrowLeft") {
        onNavigate((activeIndex - 1 + images.length) % images.length);
      }
    };
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [activeIndex, images.length, onClose, onNavigate]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      onClick={onClose}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 px-4 py-10 sm:px-10"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Tutup"
        data-cursor="CLOSE"
        className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-hairline/60 text-paper transition-colors duration-200 hover:border-accent hover:text-accent sm:right-8 sm:top-8"
      >
        <X className="h-5 w-5" />
      </button>

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate((activeIndex - 1 + images.length) % images.length);
            }}
            aria-label="Foto sebelumnya"
            className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-hairline/60 text-paper transition-colors duration-200 hover:border-accent hover:text-accent sm:left-8"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate((activeIndex + 1) % images.length);
            }}
            aria-label="Foto berikutnya"
            className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-hairline/60 text-paper transition-colors duration-200 hover:border-accent hover:text-accent sm:right-8"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      <motion.div
        key={activeIndex}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative h-full w-full max-w-4xl"
      >
        <Image
          src={images[activeIndex]}
          alt=""
          fill
          unoptimized
          className="object-contain"
        />
      </motion.div>
    </motion.div>
  );
}

export default function Portfolio() {
  const [activeTab, setActiveTab] = useState(portfolioCategories[0].id);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const category = portfolioCategories.find((c) => c.id === activeTab)!;
  const images = Array.from(
    { length: category.count },
    (_, i) => `/portfolio/${category.id}/${i + 1}.jpg`,
  );

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
              onClick={() => {
                setActiveTab(cat.id);
                setLightboxIndex(null);
              }}
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
              {images.map((src, i) => (
                <PortfolioTile
                  key={`${category.id}-${i}`}
                  src={src}
                  index={i}
                  accent={category.accent}
                  onExpand={() => setLightboxIndex(i)}
                />
              ))}
              <ArchiveCard />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            images={images}
            activeIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
            onNavigate={setLightboxIndex}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
