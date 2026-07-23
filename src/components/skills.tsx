"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Reveal from "./reveal";
import SoftwareDock from "./software-dock";
import type { SoftwareItem } from "@/lib/profile-data";

export default function Skills({
  coreSkills,
  software,
}: {
  coreSkills: string[];
  software: SoftwareItem[];
}) {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section id="skills" className="relative px-6 py-28 sm:px-10 lg:py-36">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <span className="text-sm uppercase tracking-[0.3em] text-accent">
            Capabilities
          </span>
          <h2 className="font-display mt-4 text-4xl text-paper sm:text-6xl">
            Skills
          </h2>
        </Reveal>

        <div className="mt-14 border-t border-hairline/60">
          {coreSkills.map((skill, i) => (
            <Reveal key={skill} delay={i * 0.04}>
              <div
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                data-cursor="SKILL"
                className="group relative flex items-center justify-between overflow-hidden border-b border-hairline/60 py-6 sm:py-8"
              >
                <motion.div
                  className="absolute inset-0 -z-10 bg-accent"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: active === i ? 1 : 0 }}
                  style={{ transformOrigin: "left" }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                />
                <span
                  className={`font-display text-3xl transition-colors duration-300 sm:text-5xl ${
                    active === i ? "text-accent-ink" : "text-paper"
                  }`}
                >
                  {skill}
                </span>
                <span
                  className={`text-sm uppercase tracking-widest transition-colors duration-300 ${
                    active === i ? "text-accent-ink" : "text-muted"
                  }`}
                >
                  0{i + 1}
                </span>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-24">
          <Reveal>
            <span className="text-sm uppercase tracking-[0.3em] text-accent">
              Toolkit
            </span>
            <h3 className="font-display mt-4 text-3xl text-paper sm:text-4xl">
              Daily drivers
            </h3>
          </Reveal>
          <SoftwareDock software={software} />
        </div>
      </div>
    </section>
  );
}
