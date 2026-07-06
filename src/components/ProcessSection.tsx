'use client'

import { motion } from "framer-motion";

interface Step {
  n: string;
  title: string;
  body: string;
}

const STEPS: Step[] = [
  {
    n: "01",
    title: "Open an account",
    body: "Register with an email and password. Your credentials are salted, hashed, and never touched by our staff.",
  },
  {
    n: "02",
    title: "Pick service, stylist, slot",
    body: "Browse the live service ledger, name your stylist, and choose an open date and time in one form.",
  },
  {
    n: "03",
    title: "Hold your reservation",
    body: "Your booking writes straight to the shop's ledger with a confirmed status — visible in your dashboard instantly.",
  },
];

export default function ProcessSection() {
  return (
    <section id="process" className="border-b border-[var(--border)] px-6">
      <div className="mx-auto max-w-6xl">
        <p className="eyebrow font-mono-op text-[var(--primary)]">How the ledger fills</p>
        <h2 className="font-display mt-3 max-w-2xl text-4xl text-[var(--fg)] md:text-5xl">
          Three steps, no phone tag.
        </h2>
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <motion.article
              key={step.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="elevation-sm relative overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)] px-7 py-9"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute -right-4 -top-8 select-none font-mono-op text-[7.5rem] font-bold leading-none text-white/[0.04]"
              >
                {step.n}
              </span>
              <h3 className="font-display relative text-xl text-[var(--fg)]">{step.title}</h3>
              <p className="relative mt-3 max-w-prose font-light leading-relaxed text-[var(--muted-fg)]">
                {step.body}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
