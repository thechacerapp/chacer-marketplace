import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import ContactButton from "@/components/ContactButton";
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
      <section className="bg-blue-50 border-t border-blue-100 py-10 text-center">
        <h2 className="text-lg font-bold text-gray-900 mb-1">Already a customer?</h2>
        <p className="text-gray-500 text-sm mb-4">Log in to manage your subscription, view your app link, and more.</p>
        <Link to="/ClientDashboard">
          <button className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h7a2 2 0 012 2v1" /></svg>
            Client Login
          </button>
        </Link>
      </section>
      <footer className="bg-gray-50 border-t border-gray-200 py-6 text-center text-sm text-gray-500">
        <div className="flex justify-center gap-6">
          <Link to="/ClientDashboard" className="hover:text-blue-600 underline underline-offset-2">Client Login</Link>
          <Link to="/SetupGuide" className="hover:text-blue-600 underline underline-offset-2">Setup Guide</Link>
          <Link to="/PrivacyPolicy" className="hover:text-blue-600 underline underline-offset-2">Privacy Policy</Link>
        </div>
      </footer>
      <ContactButton />
    </div>
  );
}