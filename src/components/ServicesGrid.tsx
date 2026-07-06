'use client'

import { motion } from 'framer-motion';

interface Service {
  code: string;
  name: string;
  duration: string;
  price: string;
  detail: string;
}

const SERVICES: Service[] = [
  { code: '01', name: 'Signature Fade', duration: '45 min', price: '$42', detail: 'Precision taper with straight-razor edge work, finished dry.' },
  { code: '02', name: 'Classic Hot-Towel Shave', duration: '35 min', price: '$38', detail: 'Double hot towel, warm oil, single-blade finish.' },
  { code: '03', name: 'Beard Sculpt', duration: '30 min', price: '$28', detail: 'Line-up, contour, and conditioning oil for shape that holds.' },
  { code: '04', name: 'Full Restyle', duration: '75 min', price: '$68', detail: 'Consultation, cut, and style rebuild from a clean slate.' },
];

export default function ServicesGrid() {
  return (
    <section id="services" className="mx-auto max-w-6xl px-6">
      <div className="mb-12 flex items-end justify-between gap-6">
        <div>
          <p className="eyebrow mb-3">Service Manifest</p>
          <h2 className="font-display text-4xl text-[var(--fg)] sm:text-5xl">What&rsquo;s on the chair.</h2>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {SERVICES.map((service, i) => (
          <motion.article
            key={service.code}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="group relative overflow-hidden rounded-[12px] border border-[var(--border)] bg-[var(--surface)] p-7 shadow-[var(--elevation-sm)] transition-shadow hover:shadow-[var(--elevation-md)]"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute -right-4 -top-8 select-none text-[8rem] font-black leading-none text-white/[0.035] font-mono-head"
            >
              {service.code}
            </span>
            <div className="relative">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-display text-2xl text-[var(--fg)]">{service.name}</h3>
                <span className="font-mono-head whitespace-nowrap text-lg text-[var(--primary)]">{service.price}</span>
              </div>
              <p className="mt-3 max-w-sm font-light leading-relaxed text-[var(--muted-fg)]">{service.detail}</p>
              <p className="eyebrow mt-5">{service.duration}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
