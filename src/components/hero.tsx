"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown, Camera } from "lucide-react";
import Magnetic from "./magnetic";
import Marquee from "./marquee";
import StatCounter from "./stat-counter";
import { profile, stats } from "@/lib/profile-data";

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setRoleIndex((i) => (i + 1) % profile.roles.length);
    }, 2200);
    return () => clearInterval(id);
  }, []);

  const handleMove = (e: MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--x", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--y", `${e.clientY - rect.top}px`);
  };

  return (
    <section
      id="top"
      onMouseMove={handleMove}
      className="relative flex min-h-[92svh] flex-col justify-between overflow-hidden pt-28 sm:min-h-[100svh]"
      style={{
        backgroundImage:
          "radial-gradient(500px circle at var(--x, 50%) var(--y, 20%), color-mix(in oklch, var(--accent) 16%, transparent), transparent 65%)",
      }}
    >
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-40">
        <Marquee
          slow
          className="absolute top-1/2 w-full -translate-y-1/2 -rotate-2 opacity-[0.05]"
        >
          {Array.from({ length: 4 }).map((_, i) => (
            <span
              key={i}
              className="font-display px-6 text-[18vw] leading-none text-paper sm:text-[12vw]"
            >
              AMORE · PHOTO · VIDEO · DESIGN ·
            </span>
          ))}
        </Marquee>
      </div>

      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-6 sm:px-10">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.0, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-2 text-sm uppercase tracking-[0.3em] text-muted"
        >
          <Camera className="h-4 w-4 text-accent" strokeWidth={1.5} />
          Based in Solo, Indonesia
        </motion.p>

        <h1 className="mt-6 overflow-hidden">
          <motion.span
            initial={{ y: "110%" }}
            animate={{ y: "0%" }}
            transition={{ delay: 2.05, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-display block text-[13vw] leading-[0.92] text-paper sm:text-[8vw] lg:text-[6.4vw]"
          >
            Amorutomo Ganes
          </motion.span>
        </h1>
        <h1 className="overflow-hidden">
          <motion.span
            initial={{ y: "110%" }}
            animate={{ y: "0%" }}
            transition={{ delay: 2.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-display block text-[13vw] leading-[0.92] text-paper sm:text-[8vw] lg:text-[6.4vw]"
          >
            Mahardian
            <span className="text-accent">.</span>
          </motion.span>
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.35, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 flex flex-wrap items-center gap-3 text-lg text-muted sm:text-2xl"
        >
          <span>Known as</span>
          <span className="font-display text-2xl text-paper sm:text-3xl">
            &ldquo;{profile.nickname}&rdquo;
          </span>
          <span>—</span>
          <span className="relative inline-flex h-[1.4em] w-[13ch] overflow-hidden align-bottom sm:w-[14ch]">
            <AnimatePresence mode="wait">
              <motion.span
                key={roleIndex}
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                exit={{ y: "-100%", opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 whitespace-nowrap font-medium text-accent"
              >
                {profile.roles[roleIndex]}
              </motion.span>
            </AnimatePresence>
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 flex flex-wrap items-center gap-5"
        >
          <Magnetic>
            <a
              href="#work"
              data-cursor="VIEW"
              className="rounded-full bg-accent px-7 py-3.5 text-sm font-medium uppercase tracking-wide text-accent-ink transition-transform duration-200 hover:scale-105"
            >
              See the work
            </a>
          </Magnetic>
          <Magnetic>
            <a
              href="#contact"
              className="rounded-full border border-hairline px-7 py-3.5 text-sm font-medium uppercase tracking-wide text-paper transition-colors duration-200 hover:border-accent hover:text-accent"
            >
              Let&apos;s talk
            </a>
          </Magnetic>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.7, duration: 0.6 }}
          className="mt-16 grid grid-cols-3 gap-6 border-t border-hairline/60 pt-8 sm:max-w-xl"
        >
          {stats.map((s) => (
            <StatCounter key={s.label} {...s} />
          ))}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.9, duration: 0.6 }}
        className="mx-auto mb-6 flex items-center gap-2 text-xs uppercase tracking-widest text-muted sm:mb-8"
      >
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown className="h-4 w-4" />
        </motion.span>
        Scroll
      </motion.div>
    </section>
  );
}
