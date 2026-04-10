import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import CTASection from "@/components/home/CTASection";
import MoreInfoSection from "@/components/home/MoreInfoSection";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-blue-600 text-white px-4 py-2 rounded z-50">Skip to main content</a>
      <main id="main-content">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CTASection />
      <MoreInfoSection />
      </main>
      <footer className="bg-gray-50 border-t border-gray-200 py-6 text-center text-sm text-gray-500">
        <div className="flex justify-center gap-6">
          <Link to="/SetupGuide" className="hover:text-blue-600 underline underline-offset-2">Setup Guide</Link>
          <Link to="/PrivacyPolicy" className="hover:text-blue-600 underline underline-offset-2">Privacy Policy</Link>
        </div>
      </footer>
    </div>
  );
}