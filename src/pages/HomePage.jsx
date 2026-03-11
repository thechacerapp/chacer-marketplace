import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import CTASection from "@/components/home/CTASection";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-blue-600 text-white px-4 py-2 rounded z-50">Skip to main content</a>
      <main id="main-content">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CTASection />
      </main>
    </div>
  );
}