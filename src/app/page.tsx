import { Hero } from '@/components/home/hero';
import { StatsStrip } from '@/components/home/stats-strip';
import { CategoryGrid } from '@/components/home/category-grid';
import { FeaturedBusinesses } from '@/components/home/featured-businesses';
import { HowItWorks } from '@/components/home/how-it-works';
import { PopularAreas } from '@/components/home/popular-areas';
import { WhyQatarPulse } from '@/components/home/why-qatarpulse';
import { OwnerCta } from '@/components/home/owner-cta';
import { FaqSection } from '@/components/home/faq-section';
import { FinalCta } from '@/components/home/final-cta';

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <StatsStrip />
      <CategoryGrid />
      <FeaturedBusinesses />
      <HowItWorks />
      <PopularAreas />
      <WhyQatarPulse />
      <OwnerCta />
      <FaqSection />
      <FinalCta />
    </div>
  );
}
