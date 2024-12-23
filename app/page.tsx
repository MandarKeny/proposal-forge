"use client";

import { HeroSection } from '@/components/ui/hero-section';
import { NavBar } from '@/components/navigation/nav-bar';
import { StatsSection } from '@/components/ui/sections/stats-section';
import { FeaturesSection } from '@/components/ui/sections/features-section';
import { TestimonialsSection } from '@/components/ui/sections/testimonials-section';
import { CTASection } from '@/components/ui/sections/cta-section';
import { Footer } from '@/components/ui/footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      
      <HeroSection
        title="Create Winning B2B Proposals in Minutes"
        subtitle="Turbocharge your sales with AI-generated, high-quality, error-free proposals tailored to impress clients"
        ctaText="Start Creating Proposals"
        ctaLink="/credentials"
      />

      <StatsSection />
      <FeaturesSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  );
}