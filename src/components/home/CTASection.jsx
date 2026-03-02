import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-24 bg-blue-900 text-white text-center">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Office?</h2>
        <p className="text-blue-200 text-lg mb-10">Start your 10-day free trial today. No credit card required upfront. Cancel anytime within 10 days for a full refund.</p>
        <Link to={createPageUrl("SignUpPage")}>
          <Button size="lg" className="bg-white text-blue-900 hover:bg-blue-50 font-semibold px-10">
            Get Started Free <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </Link>
      </div>
    </section>
  );
}