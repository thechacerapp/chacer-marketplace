import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Bell, ArrowRight, CheckCircle, LogIn, ChevronDown } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import NeedHelpButton from "@/components/home/NeedHelpButton";

export default function HeroSection() {
  return (
    <section aria-label="Hero" className="relative bg-red-600 text-white overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-blue-400 blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-indigo-400 blur-3xl" />
      </div>
      <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-36 text-center">
        <div className="absolute top-4 right-6 flex items-center gap-2">
          <NeedHelpButton />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="outline" className="border-white/40 text-white hover:bg-white hover:text-blue-900 bg-white/10 gap-2">
                <LogIn className="w-4 h-4" /> Login <ChevronDown className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuItem asChild>
                <Link to="/ClientDashboard" className="cursor-pointer">Manage my account</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href="https://www.thechacerapp.com" target="_blank" rel="noopener noreferrer" className="cursor-pointer">Login to my app</a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="inline-flex items-center gap-2 bg-blue-700/50 border border-blue-500/50 rounded-full px-4 py-1.5 text-sm text-blue-200 mb-8">
          <Bell className="w-4 h-4" aria-hidden="true" />
          Smart In-Office Call Buttons
        </div>
        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
          The Smarter Way to Call<br />
          <span className="text-blue-300">Staff in Any Office</span>
        </h1>
        <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto mb-10">
          Chacer replaces overhead paging and shouting across hallways. Place smart call buttons in every room — patients and staff press once, the right person responds instantly.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <div className="flex flex-col items-center gap-1">
            <Link to={createPageUrl("GetStartedPage")}>
              <Button size="lg" className="bg-white text-blue-900 hover:bg-blue-50 font-semibold px-8">
                Start Free 30-Day Trial <ArrowRight className="ml-2 w-5 h-5" aria-hidden="true" />
              </Button>
            </Link>
            <p className="text-blue-300 text-xs">Use your office email — it becomes your login for the app.</p>
          </div>
          <Link to={createPageUrl("PricingPage")}>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-900 px-8 bg-white/10">
              View Pricing
            </Button>
          </Link>
        </div>
        <div className="flex flex-wrap justify-center gap-6 text-sm text-blue-200">
          {["30-day free trial", "No setup fees", "Full refund if cancelled within 30 days", "Works in any office type"].map(item => (
            <div key={item} className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-green-400" aria-hidden="true" />
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}