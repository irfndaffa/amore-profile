"use client";

import Marquee from "./marquee";
import Magnetic from "./magnetic";
import { ArrowUp } from "lucide-react";
import { profile } from "@/lib/profile-data";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-hairline/60 pt-14">
      <Marquee className="border-b border-hairline/60 py-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <span
            key={i}
            className="font-display flex items-center px-6 text-2xl text-paper sm:text-4xl"
          >
            Available for freelance
            <span className="mx-6 h-2.5 w-2.5 rounded-full bg-accent" />
          </span>
        ))}
      </Marquee>

      <div className="mx-auto flex max-w-6xl flex-col-reverse items-center justify-between gap-6 px-6 py-8 text-sm text-muted sm:flex-row sm:px-10">
        <span>
          © {year} {profile.nickname} — {profile.fullName}. All rights
          reserved.
        </span>
        <Magnetic>
          <a
            href="#top"
            data-cursor="TOP"
            className="flex items-center gap-2 rounded-full border border-hairline/60 px-5 py-2.5 uppercase tracking-wide transition-colors duration-200 hover:border-accent hover:text-accent"
          >
            Back to top
            <ArrowUp className="h-3.5 w-3.5" />
          </a>
        </Magnetic>
      </div>
    </footer>
  );
}
