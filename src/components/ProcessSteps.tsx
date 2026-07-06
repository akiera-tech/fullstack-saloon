'use client'

import { motion } from 'framer-motion';

const STEPS = [
  { n: '01', title: 'Pick a service and stylist', body: 'Browse the manifest, choose the chair operator whose work matches what you want walking out.' },
  { n: '02', title: 'Lock a slot on the console', body: 'Every date and time you see is live availability — no double bookings, no waiting-room roulette.' },
  { n: '03', title: 'Get a confirmed reservation', body: 'Your dashboard shows status in real time: confirmed, pending, or cancelled, always accurate.' },
];

export default function ProcessSteps() {
  return (
    <section id="process" className="mx-auto max-w-6xl px-6">
      <p className="eyebrow mb-3">Operating Procedure</p>
      <h2 className="font-display mb-12 text-4xl text-[var(--fg)] sm:text-5xl">Three steps. No front desk.</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {STEPS.map((step, i) => (
          <motion.article
            key={step.n}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="relative overflow-hidden rounded-[12px] border border-[var(--border)] bg-[var(--surface)] px-7 py-10"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute -right-6 -top-10 select-none text-[10rem] font-black leading-none text-white/[0.04] font-mono-head"
            >
              {step.n}
            </span>
            <h3 className="font-display relative text-xl text-[var(--fg)]">{step.title}</h3>
            <p className="relative mt-3 max-w-prose font-light leading-relaxed text-[var(--muted-fg)]">{step.body}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
