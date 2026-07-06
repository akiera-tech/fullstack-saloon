import Link from 'next/link';
import AuthCard from '@/components/AuthCard';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-16">
      <Link href="/" className="font-mono-head mb-10 text-lg tracking-tight text-[var(--fg)]">
        SALOON<span className="text-[var(--primary)]">_OPS</span>
      </Link>
      <AuthCard mode="login" />
    </main>
  );
}
