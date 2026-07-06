import SiteNav from '@/components/SiteNav';
import Hero from '@/components/Hero';
import ServicesGrid from '@/components/ServicesGrid';
import ProcessSteps from '@/components/ProcessSteps';
import SiteFooter from '@/components/SiteFooter';

export default function HomePage() {
  return (
    <main>
      <SiteNav />
      <Hero />
      <ServicesGrid />
      <ProcessSteps />
      <SiteFooter />
    </main>
  );
}
