"use client";
import Hero from "@/components/home/HeroSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { EventsSection } from "@/components/home/EventsSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
export default function Home() {

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Hero Section */}
      <Hero />
      {/* Features Section */}
      <FeaturesSection />
      {/* How It Works Section */}
      <HowItWorksSection />
      {/* Events Section */}
      <EventsSection />
      {/* Testimonials Section */}
      <TestimonialsSection />
    </div>
  );
}
