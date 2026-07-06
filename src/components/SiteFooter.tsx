export default function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-[var(--border)] px-6 pb-10 pt-16">
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 left-1/2 h-72 w-[700px] -translate-x-1/2 rounded-full opacity-20 blur-3xl"
        style={{ background: 'radial-gradient(ellipse at center, oklch(0.72 0.17 250 / 0.4), transparent 70%)' }}
      />
      <div className="relative mx-auto max-w-6xl">
        <p className="font-display text-4xl leading-none text-[var(--fg)]/90 sm:text-6xl">SALOON_OPS</p>
        <div className="mt-10 grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div>
            <p className="eyebrow mb-3">Console</p>
            <ul className="space-y-2 font-light text-[var(--muted-fg)]">
              <li><a href="/#services" className="transition-colors hover:text-[var(--primary)]">Services</a></li>
              <li><a href="/#process" className="transition-colors hover:text-[var(--primary)]">Process</a></li>
              <li><a href="/dashboard" className="transition-colors hover:text-[var(--primary)]">Dashboard</a></li>
            </ul>
          </div>
          <div>
            <p className="eyebrow mb-3">Account</p>
            <ul className="space-y-2 font-light text-[var(--muted-fg)]">
              <li><a href="/login" className="transition-colors hover:text-[var(--primary)]">Sign In</a></li>
              <li><a href="/register" className="transition-colors hover:text-[var(--primary)]">Create Account</a></li>
            </ul>
          </div>
          <div>
            <p className="eyebrow mb-3">Hours</p>
            <ul className="space-y-2 font-light text-[var(--muted-fg)]">
              <li>Tue&ndash;Sat, 9:00&ndash;19:00</li>
              <li>Closed Sun &amp; Mon</li>
            </ul>
          </div>
          <div>
            <p className="eyebrow mb-3">Location</p>
            <ul className="space-y-2 font-light text-[var(--muted-fg)]">
              <li>214 Furnace St</li>
              <li>Foundry District</li>
            </ul>
          </div>
        </div>
        <p className="mt-12 font-mono-head text-xs text-[var(--muted-fg)]/60">&copy; {new Date().getFullYear()} Saloon Ops. All chairs accounted for.</p>
      </div>
    </footer>
  );
}
