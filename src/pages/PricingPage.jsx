import { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight } from "lucide-react";

const plans = [
  {
    name: "Basic",
    monthlyPrice: 49,
    annualPrice: 39,
    description: "Perfect for small offices with up to 5 rooms.",
    features: [
      "Up to 5 call buttons",
      "Real-time staff alerts",
      "Mobile app for staff",
      "Basic response analytics",
      "Email support",
      "10-day free trial"
    ],
    cta: "Start Basic Trial",
    highlight: false
  },
  {
    name: "Premium",
    monthlyPrice: 99,
    annualPrice: 79,
    description: "For growing practices with advanced needs.",
    features: [
      "Unlimited call buttons",
      "Real-time staff alerts",
      "Mobile app for staff",
      "Advanced analytics & reporting",
      "Custom room labels",
      "Priority support",
      "Staff performance tracking",
      "10-day free trial"
    ],
    cta: "Start Premium Trial",
    highlight: true
  }
];

export default function PricingPage() {
  const [billing, setBilling] = useState("monthly");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h1>
          <p className="text-gray-500 text-lg mb-8">Start with a 10-day free trial. Full refund if you cancel within 10 days.</p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full p-1.5">
            <button
              onClick={() => setBilling("monthly")}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${billing === "monthly" ? "bg-blue-600 text-white" : "text-gray-500 hover:text-gray-700"}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling("annual")}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${billing === "annual" ? "bg-blue-600 text-white" : "text-gray-500 hover:text-gray-700"}`}
            >
              Annual
              <span className="ml-2 bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-semibold">Save 20%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {plans.map(plan => {
            const price = billing === "monthly" ? plan.monthlyPrice : plan.annualPrice;
            const planKey = `${plan.name} ${billing === "monthly" ? "Monthly" : "Annual"}`;
            return (
              <div
                key={plan.name}
                className={`rounded-2xl p-8 ${plan.highlight ? "bg-blue-900 text-white shadow-2xl ring-2 ring-blue-400" : "bg-white border border-gray-200 shadow-sm"}`}
              >
                {plan.highlight && (
                  <div className="text-xs font-semibold text-blue-300 uppercase tracking-widest mb-3">Most Popular</div>
                )}
                <h2 className={`text-2xl font-bold mb-1 ${plan.highlight ? "text-white" : "text-gray-900"}`}>{plan.name}</h2>
                <p className={`text-sm mb-6 ${plan.highlight ? "text-blue-200" : "text-gray-500"}`}>{plan.description}</p>
                <div className="mb-6">
                  <span className={`text-5xl font-extrabold ${plan.highlight ? "text-white" : "text-gray-900"}`}>${price}</span>
                  <span className={`text-sm ml-1 ${plan.highlight ? "text-blue-200" : "text-gray-400"}`}>/mo{billing === "annual" ? ", billed annually" : ""}</span>
                </div>
                <Link to={`${createPageUrl("GetStartedPage")}?plan=${encodeURIComponent(planKey)}&billing=${billing}`}>
                  <Button
                    size="lg"
                    className={`w-full mb-8 font-semibold ${plan.highlight ? "bg-white text-blue-900 hover:bg-blue-50" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
                  >
                    {plan.cta} <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <ul className="space-y-3">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <CheckCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${plan.highlight ? "text-green-400" : "text-green-500"}`} />
                      <span className={plan.highlight ? "text-blue-100" : "text-gray-600"}>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <p className="text-center text-gray-400 text-sm mt-10">
          All plans include a 10-day free trial. Cancel within 10 days for a complete refund — no questions asked.
        </p>
      </div>
    </div>
  );
}