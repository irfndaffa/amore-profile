"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Copy, Mail, MapPin, Phone } from "lucide-react";
import Reveal from "./reveal";
import Magnetic from "./magnetic";
import type { Profile } from "@/lib/profile-data";

function ContactRow({
  icon,
  label,
  value,
  copyValue,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  copyValue?: string;
  href?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!copyValue) return;
    try {
      await navigator.clipboard.writeText(copyValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const content = (
    <div className="group flex w-full items-center justify-between gap-6 border-b border-hairline/60 py-7 transition-colors duration-300 hover:border-accent sm:py-9">
      <div className="flex items-center gap-5">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-hairline/60 text-accent transition-colors duration-300 group-hover:border-accent">
          {icon}
        </span>
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-widest text-muted">
            {label}
          </span>
          <span className="font-display text-xl text-paper sm:text-2xl">
            {value}
          </span>
        </div>
      </div>
      {copyValue && (
        <motion.span
          animate={{ scale: copied ? 1.1 : 1 }}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-bg-elevated text-muted transition-colors duration-300 group-hover:text-accent"
        >
          {copied ? (
            <Check className="h-4 w-4 text-accent" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </motion.span>
      )}
    </div>
  );

  if (href) {
    return (
      <a href={href} data-cursor="OPEN" className="block">
        {content}
      </a>
    );
  }

  return (
    <button
      onClick={handleCopy}
      data-cursor="COPY"
      className="block w-full text-left"
    >
      {content}
    </button>
  );
}

export default function Contact({ profile }: { profile: Profile }) {
  return (
    <section id="contact" className="relative px-6 py-28 sm:px-10 lg:py-36">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <span className="text-sm uppercase tracking-[0.3em] text-accent">
            Get in touch
          </span>
          <h2 className="font-display mt-4 max-w-3xl text-4xl leading-[0.95] text-paper sm:text-6xl lg:text-7xl">
            Got a story worth shooting? Let&apos;s make it.
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          <Reveal delay={0.05}>
            <div className="flex flex-col">
              <ContactRow
                icon={<Mail className="h-5 w-5" />}
                label="Email"
                value={profile.email}
                copyValue={profile.email}
              />
              <ContactRow
                icon={<Phone className="h-5 w-5" />}
                label="Phone / WhatsApp"
                value={profile.phone}
                copyValue={profile.phone.replace(/-/g, "")}
              />
              <ContactRow
                icon={<MapPin className="h-5 w-5" />}
                label="Location"
                value={profile.location}
              />
            </div>
          </Reveal>

          <Reveal delay={0.15} className="flex flex-col justify-between gap-10">
            <p className="text-muted">
              Available for freelance shoots, brand content, and design work
              across Solo and beyond. Reach out directly by email or phone —
              replies usually come fast.
            </p>
            <Magnetic className="self-start">
              <a
                href={`mailto:${profile.email}`}
                data-cursor="EMAIL"
                className="rounded-full bg-accent px-8 py-4 text-sm font-medium uppercase tracking-wide text-accent-ink transition-transform duration-200 hover:scale-105"
              >
                Send an email
              </a>
            </Magnetic>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
