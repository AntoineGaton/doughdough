import { HeroSection } from '@/components/HeroSection';
import { FeaturedDeals } from '@/components/FeaturedDeals';
import { PopularPizzas } from '@/components/PopularPizzas';

export default function Home() {
  return (
    <div>
      <HeroSection />
      <div id="featured-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FeaturedDeals />
        <PopularPizzas />
      </div>
    </div>
  );
}