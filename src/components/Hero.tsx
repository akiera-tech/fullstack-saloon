'use client'

import Link from 'next/link';
import { motion } from 'framer-motion';
import HeroPathDiagram from './HeroPathDiagram';

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full opacity-40 blur-3xl"
        style={{ background: 'radial-gradient(ellipse at center, oklch(0.72 0.17 250 / 0.35), transparent 65%)' }}
      />
      <div className="grain" />
      <div className="relative mx-auto grid max-w-6xl grid-cols-1 gap-14 px-6 lg:grid-cols-2 lg:items-center">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="eyebrow mb-5"
          >
            Est. Chair-Side Console
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="font-display text-5xl leading-[1.05] text-[var(--fg)] sm:text-6xl lg:text-7xl"
          >
            Book your chair,
            <br />
            <span className="text-[var(--primary)]">not a waiting room.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16 }}
            className="mt-6 max-w-md text-lg font-light leading-relaxed text-[var(--muted-fg)]"
          >
            Saloon runs your appointments like a control room: real slots, real
            stylists, one dashboard that tells you exactly where you stand.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.24 }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <Link
              href="/register"
              className="font-mono-head group relative inline-flex items-center border-2 border-[var(--primary)] px-7 py-3.5 text-sm uppercase tracking-widest text-[var(--primary)] transition-colors hover:bg-[var(--primary)] hover:text-[#05080b]"
            >
              <span className="absolute left-0 top-0 h-full w-1 -translate-x-1 bg-[var(--accent)] opacity-0 transition-opacity group-hover:opacity-100" />
              Reserve Your Slot
            </Link>
            <Link
              href="#services"
              className="eyebrow border-2 border-[var(--border)] px-7 py-3.5 transition-colors hover:border-[var(--muted-fg)] hover:text-[var(--fg)]"
            >
              See Services
            </Link>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <HeroPathDiagram />
        </motion.div>
      </div>
    </section>
  );
}
