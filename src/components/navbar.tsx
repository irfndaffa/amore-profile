"use client";

import { useState } from "react";
import { motion, useScroll, AnimatePresence } from "framer-motion";
import Magnetic from "./magnetic";

const links = [
  { href: "#work", label: "Work" },
  { href: "#experience", label: "Experience" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();

  return (
    <>
      <motion.div
        className="fixed inset-x-0 top-0 z-50 h-[2px] origin-left bg-accent"
        style={{ scaleX: scrollYProgress }}
      />
      <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-6 py-5 sm:px-10">
        <a
          href="#top"
          data-cursor="TOP"
          className="font-display text-xl tracking-wide text-paper"
        >
          AMORE<span className="text-accent">.</span>
        </a>

        <nav className="hidden items-center gap-8 rounded-full border border-hairline/60 bg-bg-elevated/60 px-6 py-2.5 backdrop-blur-md md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm uppercase tracking-wide text-muted transition-colors duration-200 hover:text-accent"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <Magnetic className="hidden md:block">
          <a
            href="#contact"
            data-cursor="HIRE"
            className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium uppercase tracking-wide text-accent-ink transition-transform duration-200 hover:scale-105"
          >
            Say Hi
          </a>
        </Magnetic>

        <button
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-full border border-hairline/60 bg-bg-elevated/60 md:hidden"
        >
          <span className="h-px w-5 bg-paper" />
          <span className="h-px w-5 bg-paper" />
        </button>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: "circle(0% at 90% 5%)" }}
            animate={{ clipPath: "circle(150% at 90% 5%)" }}
            exit={{ clipPath: "circle(0% at 90% 5%)" }}
            transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 bg-bg"
          >
            <button
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="absolute right-6 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-hairline/60 text-2xl leading-none text-paper"
            >
              ×
            </button>
            {links.map((link, i) => (
              <motion.a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                className="font-display text-4xl uppercase tracking-wide text-paper transition-colors hover:text-accent"
              >
                {link.label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
