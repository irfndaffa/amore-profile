"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Aperture } from "lucide-react";

export default function Preloader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1900);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loading) {
      document.body.style.overflow = "";
    }
  }, [loading]);

  const name = "AMORE";

  return (
    <AnimatePresence>
      {loading && (
        <div className="fixed inset-0 z-[100]" aria-hidden="true">
          <motion.div
            className="absolute inset-x-0 top-0 h-1/2 bg-bg"
            initial={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{
              duration: 0.9,
              ease: [0.65, 0, 0.35, 1],
              delay: 0.15,
            }}
          />
          <motion.div
            className="absolute inset-x-0 bottom-0 h-1/2 bg-bg"
            initial={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{
              duration: 0.9,
              ease: [0.65, 0, 0.35, 1],
              delay: 0.15,
            }}
          />
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center gap-6"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
            >
              <Aperture className="h-10 w-10 text-accent" strokeWidth={1.25} />
            </motion.div>
            <div className="flex overflow-hidden">
              {name.split("").map((letter, i) => (
                <motion.span
                  key={i}
                  className="font-display text-4xl tracking-wide text-paper sm:text-6xl"
                  initial={{ y: "110%" }}
                  animate={{ y: "0%" }}
                  transition={{
                    duration: 0.6,
                    delay: 0.15 + i * 0.06,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </div>
            <div className="h-px w-40 overflow-hidden bg-hairline/60">
              <motion.div
                className="h-full bg-accent"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                style={{ transformOrigin: "left", width: "100%" }}
                transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
