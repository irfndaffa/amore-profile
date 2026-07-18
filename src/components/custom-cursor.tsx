"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const hoverQuery = "(hover: hover) and (pointer: fine)";

function subscribe(callback: () => void) {
  const mq = window.matchMedia(hoverQuery);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}
function getSnapshot() {
  return window.matchMedia(hoverQuery).matches;
}
function getServerSnapshot() {
  return false;
}

export default function CustomCursor() {
  const enabled = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const [label, setLabel] = useState<string | null>(null);
  const [pointerActive, setPointerActive] = useState(false);
  const [hidden, setHidden] = useState(true);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { damping: 22, stiffness: 260, mass: 0.4 });
  const ringY = useSpring(y, { damping: 22, stiffness: 260, mass: 0.4 });

  useEffect(() => {
    if (!enabled) return;

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setHidden(false);
    };
    const leave = () => setHidden(true);
    const over = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const cursorTarget = target.closest<HTMLElement>("[data-cursor]");
      const pointerTarget = target.closest(
        "a, button, [role='button'], input, textarea",
      );
      setLabel(cursorTarget?.dataset.cursor ?? null);
      setPointerActive(Boolean(pointerTarget) || Boolean(cursorTarget));
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    document.documentElement.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      document.documentElement.removeEventListener("mouseleave", leave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        className="cursor-dot"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
        animate={{ opacity: hidden ? 0 : 1, scale: pointerActive ? 0 : 1 }}
        transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="h-1.5 w-1.5 rounded-full bg-accent" />
      </motion.div>
      <motion.div
        className="cursor-dot flex items-center justify-center rounded-full border border-accent/70 text-center"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          opacity: hidden ? 0 : 1,
          width: pointerActive ? (label ? 84 : 56) : 28,
          height: pointerActive ? (label ? 84 : 56) : 28,
        }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.span
          className="absolute inset-0 rounded-full bg-accent"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{
            opacity: pointerActive ? 1 : 0,
            scale: pointerActive ? 1 : 0.6,
          }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        />
        {label && (
          <span className="font-display relative text-[11px] uppercase tracking-wide text-accent-ink">
            {label}
          </span>
        )}
      </motion.div>
    </>
  );
}
