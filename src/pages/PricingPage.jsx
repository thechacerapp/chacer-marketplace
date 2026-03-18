import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight } from "lucide-react";

const features = [
  "Up to 30 call buttons / devices",
  "Real-time staff alerts",
  "Mobile app for staff",
  "Analytics dashboard",
  "Email support",
  "10-day free trial"
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50" role="main">
      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h1>
          <p className="text-gray-500 text-lg">Start with a 10-day free trial. Full refund if you cancel within 10 days.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Monthly */}
          <div className="rounded-2xl p-8 bg-white border border-gray-200 shadow-sm flex flex-col" role="region" aria-label="Monthly Plan">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Monthly</h2>
            <p className="text-sm text-gray-500 mb-6">Up to 30 devices. Billed month-to-month.</p>
            <div className="mb-6">
              <span className="text-5xl font-extrabold text-gray-900">$49</span>
              <span className="text-sm ml-1 text-gray-400">/mo</span>
            </div>
            <Link to={`${createPageUrl("GetStartedPage")}?plan=Monthly&billing=monthly`} className="mb-8" aria-label="Start free trial with Monthly plan">
              <Button size="lg" className="w-full font-semibold bg-blue-600 hover:bg-blue-700 text-white">
                Start Free Trial <ArrowRight className="ml-2 w-4 h-4" aria-hidden="true" />
              </Button>
            </Link>
            <ul className="space-y-3 mt-auto">
              {features.map(f => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-500" aria-hidden="true" />
                  <span className="text-gray-600">{f}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Annual */}
          <div className="rounded-2xl p-8 bg-blue-900 text-white shadow-2xl ring-2 ring-blue-400 flex flex-col" role="region" aria-label="Annual Plan">
            <div className="text-xs font-semibold text-blue-300 uppercase tracking-widest mb-3">Save 20%</div>
            <h2 className="text-2xl font-bold text-white mb-1">Annual</h2>
            <p className="text-sm text-blue-200 mb-6">Up to 30 devices. Billed once per year.</p>
            <div className="mb-2">
              <span className="text-5xl font-extrabold text-white">$468</span>
              <span className="text-sm ml-1 text-blue-200">/yr</span>
            </div>
            <p className="text-blue-300 text-sm mb-6">~$39/mo — save $118 vs monthly</p>
            <Link to={`${createPageUrl("GetStartedPage")}?plan=Annual&billing=annual`} className="mb-8" aria-label="Start free trial with Annual plan">
              <Button size="lg" className="w-full font-semibold bg-white text-blue-900 hover:bg-blue-50">
                Start Free Trial <ArrowRight className="ml-2 w-4 h-4" aria-hidden="true" />
              </Button>
            </Link>
            <ul className="space-y-3 mt-auto">
              {features.map(f => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-400" aria-hidden="true" />
                  <span className="text-blue-100">{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="text-center text-gray-400 text-sm mt-10">
          All plans include a 10-day free trial. Cancel within 10 days for a complete refund — no questions asked.
        </p>
      </div>
    </div>
  );
}