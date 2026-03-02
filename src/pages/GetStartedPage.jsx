import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, Loader2 } from "lucide-react";

export default function GetStartedPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const planFromUrl = urlParams.get("plan") || "Basic Monthly";
  const billingFromUrl = urlParams.get("billing") || "monthly";

  const [form, setForm] = useState({
    name: "",
    contact_email: "",
    contact_phone: "",
    office_type: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const office = await base44.entities.Office.create({
      name: form.name,
      contact_email: form.contact_email,
      contact_phone: form.contact_phone,
      office_type: form.office_type,
      status: "pending"
    });

    const response = await base44.functions.invoke("createStripeCheckoutSession", {
      office_id: office.id,
      office_name: form.name,
      email: form.contact_email,
      plan: planFromUrl,
      billing: billingFromUrl
    });

    if (response.data?.url) {
      window.location.href = response.data.url;
    } else {
      setError("Could not initiate payment. Please try again.");
      setLoading(false);
    }
  };

  const planPrices = {
    "Basic Monthly": "$49/mo",
    "Basic Annual": "$39/mo (billed annually)",
    "Premium Monthly": "$99/mo",
    "Premium Annual": "$79/mo (billed annually)"
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Start Your Free Trial</h1>
            <p className="text-gray-500 mt-2 text-sm">10 days free. Cancel for a full refund within 10 days.</p>
            {planFromUrl && (
              <div className="mt-3 inline-block bg-blue-50 text-blue-700 text-sm px-4 py-1.5 rounded-full font-medium">
                Plan: {planFromUrl} — {planPrices[planFromUrl] || ""}
              </div>
            )}
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

            {error && <p className="text-red-500 text-sm">{error}</p>}

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