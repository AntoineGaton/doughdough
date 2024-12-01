import { AboutHero } from '@/components/about/AboutHero';
import { OurStory } from '@/components/about/OurStory';
import { Values } from '@/components/about/Values';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <AboutHero />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-center mb-8">About DoughDough's Pizza</h1>
        <OurStory />
        <Values />
      </div>
    </div>
  );
}
