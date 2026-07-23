"use client";

import { motion } from "framer-motion";
import TiltCard from "./tilt-card";
import Reveal from "./reveal";
import type { SoftwareItem } from "@/lib/profile-data";

export default function SoftwareDock({
  software,
}: {
  software: SoftwareItem[];
}) {
  return (
    <div className="mt-10 grid grid-cols-3 gap-6 sm:grid-cols-6 sm:gap-8">
      {software.map((item, i) => (
        <Reveal
          key={item.name}
          delay={i * 0.05}
          className="flex flex-col items-center gap-3"
        >
          <TiltCard max={16}>
            <motion.div
              data-cursor={item.name}
              whileHover={{ y: -10, scale: 1.06 }}
              transition={{ type: "spring", stiffness: 300, damping: 16 }}
              className="relative flex aspect-square w-full items-center justify-center rounded-[22%] shadow-lg shadow-black/40"
              style={{
                backgroundImage: `linear-gradient(145deg, ${item.colorFrom}, ${item.colorTo})`,
              }}
            >
              <span className="font-display text-2xl text-white/95 sm:text-3xl">
                {item.short}
              </span>
              <span className="pointer-events-none absolute inset-0 rounded-[22%] bg-gradient-to-br from-white/25 via-transparent to-transparent" />
            </motion.div>
          </TiltCard>
          <span className="text-center text-xs uppercase tracking-wide text-muted sm:text-sm">
            {item.name}
          </span>
        </Reveal>
      ))}
    </div>
  );
}
