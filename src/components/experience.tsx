"use client";

import Reveal from "./reveal";
import type { ExperienceItem } from "@/lib/profile-data";

export default function Experience({
  experience,
}: {
  experience: ExperienceItem[];
}) {
  return (
    <section id="experience" className="relative px-6 py-28 sm:px-10 lg:py-36">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <span className="text-sm uppercase tracking-[0.3em] text-accent">
            Journey
          </span>
          <h2 className="font-display mt-4 text-4xl text-paper sm:text-6xl">
            Experience
          </h2>
        </Reveal>

        <div className="relative mt-16 border-l border-hairline/60 pl-8 sm:pl-14">
          {experience.map((item, i) => (
            <Reveal
              key={item.company}
              delay={i * 0.05}
              className="relative mb-16 last:mb-0"
            >
              <span className="absolute -left-[calc(2rem+5px)] top-1.5 h-2.5 w-2.5 rounded-full bg-accent sm:-left-[calc(3.5rem+5px)]" />
              <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
                <h3 className="font-display text-2xl text-paper sm:text-3xl">
                  {item.company}
                </h3>
                <span className="text-sm uppercase tracking-wide text-muted">
                  {item.period}
                </span>
              </div>
              <p className="mt-1 text-accent">{item.role}</p>
              <ul className="mt-4 flex flex-col gap-2">
                {item.points.map((point) => (
                  <li
                    key={point}
                    className="flex gap-3 text-sm leading-relaxed text-muted sm:text-base"
                  >
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-muted" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
