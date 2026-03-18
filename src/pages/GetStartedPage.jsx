import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, Loader2, BadgeCheck } from "lucide-react";

export default function GetStartedPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const billingFromUrl = urlParams.get("billing") || "monthly";

  const [billing, setBilling] = useState(billingFromUrl === "annual" ? "annual" : "monthly");
  const [form, setForm] = useState({
    name: "",
    contact_email: "",
    contact_phone: "",
    office_type: "",
  });
  const [discountCode, setDiscountCode] = useState("");
  const [discountStatus, setDiscountStatus] = useState(null); // null | "valid" | "invalid"
  const [discountInfo, setDiscountInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.name || !form.contact_email || !form.office_type) {
      setError("Please fill in all required fields.");
      return;
    }
    
    setLoading(true);
    setError("");

    try {
      const plan = billing === "annual" ? "Basic Annual" : "Basic Monthly";
      const response = await base44.functions.invoke("createStripeCheckoutSession", {
        office_name: form.name,
        email: form.contact_email,
        office_type: form.office_type,
        contact_phone: form.contact_phone,
        plan,
        billing,
        discount_code: discountCode.trim().toUpperCase() || undefined
      });

      if (response.data?.url) {
        window.location.href = response.data.url;
      } else {
        setError(response.data?.error || "Could not initiate payment. Please try again.");
        setLoading(false);
      }
    } catch (err) {
      setError(err.message || "An error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Start Your Free Trial</h1>
            <p className="text-gray-500 mt-2 text-sm">10 days free. Cancel for a full refund within 10 days.</p>
          </div>

          {/* Plan Selector */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => setBilling("monthly")}
              className={`rounded-xl border-2 p-4 text-left transition-all ${billing === "monthly" ? "border-blue-600 bg-blue-50" : "border-gray-200 bg-white hover:border-gray-300"}`}
            >
              <p className="font-semibold text-gray-900 text-sm">Monthly</p>
              <p className="text-2xl font-extrabold text-gray-900 mt-1">$49<span className="text-sm font-normal text-gray-400">/mo</span></p>
              <p className="text-xs text-gray-400 mt-1">Billed month-to-month</p>
              {billing === "monthly" && <BadgeCheck className="w-4 h-4 text-blue-600 mt-2" />}
            </button>
            <button
              type="button"
              onClick={() => setBilling("annual")}
              className={`rounded-xl border-2 p-4 text-left transition-all relative ${billing === "annual" ? "border-blue-600 bg-blue-50" : "border-gray-200 bg-white hover:border-gray-300"}`}
            >
              <span className="absolute top-2 right-2 text-xs bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full">Save 20%</span>
              <p className="font-semibold text-gray-900 text-sm">Yearly</p>
              <p className="text-2xl font-extrabold text-gray-900 mt-1">$39<span className="text-sm font-normal text-gray-400">/mo</span></p>
              <p className="text-xs text-gray-400 mt-1">$468 billed once/year</p>
              {billing === "annual" && <BadgeCheck className="w-4 h-4 text-blue-600 mt-2" />}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="name">Office / Practice Name</Label>
              <Input id="name" placeholder="Dr. Smith's Dental" required className="mt-1"
                value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="email">Contact Email</Label>
              <Input id="email" type="email" placeholder="admin@youroffice.com" required className="mt-1"
                value={form.contact_email} onChange={e => setForm({ ...form, contact_email: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" placeholder="(555) 123-4567" className="mt-1"
                value={form.contact_phone} onChange={e => setForm({ ...form, contact_phone: e.target.value })} />
            </div>
            <div>
              <Label>Office Type</Label>
              <Select value={form.office_type} onValueChange={v => setForm({ ...form, office_type: v })}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select office type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Medical">Medical / Clinical</SelectItem>
                  <SelectItem value="Dental">Dental</SelectItem>
                  <SelectItem value="Legal">Legal / Law Firm</SelectItem>
                  <SelectItem value="Physical Therapy">Physical Therapy / Rehab</SelectItem>
                  <SelectItem value="Mental Health">Mental Health / Therapy</SelectItem>
                  <SelectItem value="Veterinary">Veterinary</SelectItem>
                  <SelectItem value="General Office">General Office</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Discount Code */}
            <div>
              <Label htmlFor="discount">Discount Code <span className="text-gray-400 font-normal">(optional)</span></Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="discount"
                  placeholder="Enter code"
                  value={discountCode}
                  onChange={e => { setDiscountCode(e.target.value.toUpperCase()); setDiscountStatus(null); setDiscountInfo(null); }}
                  className="uppercase"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={async () => {
                    if (!discountCode.trim()) return;
                    const codes = await base44.entities.DiscountCode.filter({ code: discountCode.trim().toUpperCase(), active: true });
                    if (codes.length > 0) {
                      setDiscountStatus("valid");
                      setDiscountInfo(codes[0]);
                    } else {
                      setDiscountStatus("invalid");
                      setDiscountInfo(null);
                    }
                  }}
                >
                  Apply
                </Button>
              </div>
              {discountStatus === "valid" && (
                <p className="text-green-600 text-xs mt-1 flex items-center gap-1">
                  <BadgeCheck className="w-3 h-3" /> {discountInfo?.description || "Discount applied!"}
                </p>
              )}
              {discountStatus === "invalid" && (
                <p className="text-red-500 text-xs mt-1">Invalid or expired discount code.</p>
              )}
            </div>

            {error && <p className="text-red-500 text-sm" role="alert" aria-live="assertive">{error}</p>}

            <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold h-12">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Continue to Payment →"}
            </Button>
          </form>

          <p className="text-xs text-gray-400 text-center mt-4">You'll be redirected to Stripe's secure checkout. No charge during your 10-day trial.</p>
        </div>
      </div>
    </div>
  );
}