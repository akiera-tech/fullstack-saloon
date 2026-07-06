'use client'

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fetchServices, ApiService } from "@/lib/api-client";

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(0)}`;
}

export default function ServicesSection() {
  const [services, setServices] = useState<ApiService[]>([]);

  useEffect(() => {
    fetchServices().then((d) => setServices(d.services));
  }, []);

  return (
    <section id="services" className="border-b border-[var(--border)] px-6">
      <div className="mx-auto max-w-6xl">
        <p className="eyebrow font-mono-op text-[var(--accent)]">Menu of record</p>
        <h2 className="font-display mt-3 max-w-2xl text-4xl text-[var(--fg)] md:text-5xl">
          Every service, priced and timed.
        </h2>
        <div className="mt-4 overflow-hidden rounded-lg border border-[var(--border)]">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--surface)]">
                <th className="px-5 py-3 font-mono-op text-xs uppercase tracking-widest text-[var(--muted-fg)]">#</th>
                <th className="px-5 py-3 font-mono-op text-xs uppercase tracking-widest text-[var(--muted-fg)]">Service</th>
                <th className="px-5 py-3 font-mono-op text-xs uppercase tracking-widest text-[var(--muted-fg)]">Duration</th>
                <th className="px-5 py-3 text-right font-mono-op text-xs uppercase tracking-widest text-[var(--muted-fg)]">Rate</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service, i) => (
                <motion.tr
                  key={service.id}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className={i % 2 === 0 ? "bg-[var(--surface)]" : "bg-white/[0.02]"}
                >
                  <td className="px-5 py-4 font-mono-op text-sm text-[var(--muted-fg)]/60">{String(i + 1).padStart(2, "0")}</td>
                  <td className="px-5 py-4 font-display text-lg text-[var(--fg)]">{service.name}</td>
                  <td className="px-5 py-4 font-mono-op text-sm text-[var(--muted-fg)]">{service.durationMinutes} min</td>
                  <td className="px-5 py-4 text-right font-mono-op text-sm text-[var(--primary)]">{formatPrice(service.priceCents)}</td>
                </motion.tr>
              ))}
              {services.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center font-mono-op text-sm text-[var(--muted-fg)]">
                    Loading service ledger…
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
